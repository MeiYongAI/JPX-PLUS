'use strict';
// Offline rendering only: no authenticated profile or live forum requests.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.resolve(__dirname, '..');
const fixture = path.join(__dirname, 'fixtures/forum-buttons');
const output = path.join(root, '.test-output/forum-buttons');
const source = fs.readFileSync(path.join(root, 'E-Hentai-Forums-Dark.user.css'), 'utf8');
const section = source.indexOf('@-moz-document');
assert.ok(section >= 0, 'forum-only theme section exists');
const theme = source.slice(source.indexOf('{', section) + 1, source.lastIndexOf('}'));
const image = name => `<img src="style_images/ambience/${name}.gif" border="0" alt="${name === 't_closed' ? 'Closed Topic' : 'Start new topic'}">`;
const controls = id => `<table id="${id}" width="100%"><tr><td class="nopad" style="padding:0 0 5px 0" align="right" valign="middle">${image('t_closed')}<a href="#new-topic" title="Start a new topic">${image('t_new')}</a></td></tr></table>`;
const html = `<!doctype html><html><head><base href="https://forums.e-hentai.org/"></head><body><div id="ipbwrapper">${controls('top')}<div class="postcolor">${image('t_closed')}</div><div class="signature">${image('t_closed')}</div><img id="unrelated" src="uploads/t_closed.gif" alt="User upload">${controls('bottom')}</div></body></html>`;
const lum = (r,g,b) => [r,g,b].map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
async function pixels(locator) {
  const buffer = await locator.screenshot();
  const {data,info} = await sharp(buffer).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const values = [];
  for(let i=0;i<data.length;i+=info.channels) values.push(lum(data[i],data[i+1],data[i+2]));
  values.sort((a,b)=>a-b);
  return {buffer,median:values[Math.floor(values.length*.5)],p95:values[Math.floor(values.length*.95)]};
}
async function attributes(page) {
  return page.locator('img').evaluateAll(nodes=>nodes.map(n=>({src:n.getAttribute('src'),alt:n.alt,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})));
}
async function preserved(page) {
  return page.locator('.postcolor img,.signature img,#unrelated').evaluateAll(nodes=>nodes.map(n=>({filter:getComputedStyle(n).filter,opacity:getComputedStyle(n).opacity})));
}
let browser;
before(async()=>{
  fs.mkdirSync(output,{recursive:true});
  browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome',headless:true});
});
after(async()=>{await browser?.close();});
for(const width of [1440,320]) for(const order of ['theme-first','theme-last']) {
  test(`closed-topic buttons: ${width}px, ${order}`, async()=>{
    const page = await browser.newPage({viewport:{width,height:500}});
    try {
      await page.route('**/*',route=>{
        const url = new URL(route.request().url());
        const name = path.basename(url.pathname);
        if(url.hostname==='forums.e-hentai.org' && ['t_closed.gif','t_new.gif'].includes(name)) return route.fulfill({body:fs.readFileSync(path.join(fixture,name)),contentType:'image/gif'});
        return route.abort();
      });
      await page.setContent(html);
      assert.ok(await page.locator('img').evaluateAll(nodes=>nodes.every(n=>n.complete&&n.naturalWidth===99&&n.naturalHeight===23)), 'real 99x23 button assets loaded');
      const original = await attributes(page), originalMedia = await preserved(page);
      const initialWidth = await page.evaluate(()=>document.documentElement.scrollWidth);
      if(width===1440 && order==='theme-last') {
        const previous = await page.addStyleTag({content:theme.replace(', [src$="/t_closed.gif"]','')});
        await page.locator('#top').screenshot({path:path.join(output,'closed-before.png')});
        await previous.evaluate(n=>n.remove());
      }
      // A deliberately generic reset checks that a later stylesheet cannot undo adaptation.
      const reset = 'img { filter: none; }';
      if(order==='theme-last') await page.addStyleTag({content:reset});
      const tag = await page.addStyleTag({content:theme});
      if(order==='theme-first') await page.addStyleTag({content:reset});
      for(const id of ['top','bottom']) {
        const closed = page.locator(`#${id} img[alt="Closed Topic"]`);
        const newTopic = page.locator(`#${id} img[alt="Start new topic"]`);
        const filter = await closed.evaluate(n=>getComputedStyle(n).filter);
        assert.notEqual(filter,'none','closed topic is adapted');
        assert.equal(filter,await newTopic.evaluate(n=>getComputedStyle(n).filter),'closed and new-topic buttons use the same tone');
        const px = await pixels(closed);
        assert.ok(px.median<.16,'closed button no longer has a light surface');
        assert.ok((px.p95+.05)/(px.median+.05)>=3,'button glyph remains distinguishable (pixel proxy)');
      }
      assert.deepEqual(await attributes(page),original,'original URLs, labels and geometry retained');
      assert.deepEqual(await preserved(page),originalMedia,'posted, signature and unrelated images remain unchanged');
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth)<=initialWidth,'no added horizontal overflow');
      if(width===1440 && order==='theme-last') await page.locator('#top').screenshot({path:path.join(output,'closed-after.png')});
      await page.emulateMedia({media:'print'});
      assert.equal(await page.locator('#top img[alt="Closed Topic"]').evaluate(n=>getComputedStyle(n).filter),'none','print stays native');
      await page.emulateMedia({media:'screen'});
      await tag.evaluate(n=>n.remove());
      const native = await pixels(page.locator('#top img[alt="Closed Topic"]'));
      assert.ok(native.median>.5,'captured asset reproduces the original white surface');
    } finally { await page.close(); }
  });
}
