const {test} = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require('playwright');
const folder = path.resolve(__dirname, '../extensions/hv-utils');
const zh = path.resolve(__dirname, '../extensions/hv-zh-cn');
const lobby = `<!doctype html><meta charset=utf-8><script>window.common = {};</script><div id=csp><div id=navbar></div>
<div id=world_text></div><div id=level_readout>Normal Lv.500</div>
<div id=stamina_readout><div>Stamina: 90</div><div title=""></div><img title="Stamina: Great"></div></div>`;

test('unpacked HVUT: lobby + settings + cross-origin RE + exclusions', async t => {
  const ctx = await chromium.launchPersistentContext('', {channel:'chromium', headless:true,
    args:[`--disable-extensions-except=${folder},${zh}`, `--load-extension=${folder},${zh}`]});
  t.after(() => ctx.close());
  const worker = ctx.serviceWorkers().find(w => w.url().endsWith('/background.js')) || await ctx.waitForEvent('serviceworker', w => w.url().endsWith('/background.js'));
  // Mock remote HTML at the worker's fetch boundary; no live sessions or game actions.
  await worker.evaluate(() => {
    self.calls = []; self.fetch = async (url, init) => {
      calls.push([url,init.credentials]);
      if (url !== 'https://e-hentai.org/news.php') throw Error('unexpected URL');
      return new Response('<div id="eventpane"><a href="?s=Battle&amp;ss=ba&amp;encounter=Key123">Fight</a></div>');
    };
  });
  const page = await ctx.newPage(), errors = [], requests = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', msg => {if(msg.type()==='error' && msg.text().includes('[HV Utils]')) errors.push(msg.text());});
  page.setDefaultTimeout(5000);
  await ctx.route('**/*', r => {
    const req = r.request(), u = new URL(req.url());
    if (!req.isNavigationRequest()) {
      requests.push([req.method(), u.search, req.postData()]);
      const body = u.search.includes('ss=se') ? (req.method()==='GET' ? '<div id=settings_outer><form><input name=token value=keep></form></div>' : '<div id=level_readout>Hard Lv.500</div>') : '<div>mock</div>';
      return r.fulfill({contentType:'text/html',body});
    }
    return r.fulfill({contentType:'text/html; charset=utf-8',body: u.hostname==='e-hentai.org' ? '<div id=nb></div>' :
      u.pathname==='/battle-fixture' ? '<div id=csp><div id=battle_top></div><table id=textlog><tbody><tr><td>Fighting</td></tr></tbody></table></div>' : lobby});
  });
  const persona = {pset:1,eset:1,pname:'Local',ename:'Test',1:{1:{}}};
  await ctx.addInitScript(p => {localStorage.setItem('hvut_persona', JSON.stringify(p));localStorage.setItem('hvuti_persona', JSON.stringify(p));localStorage.setItem('hvut_old_test','keep');}, persona);
  await page.goto('https://hentaiverse.org/?s=Bazaar&ss=is');
  await page.locator('#hvut-top-config-icon').waitFor();
  assert.equal(await page.locator('[data-hv-zh-runtime]').count(),1);
  const difficulty = page.locator('#hvut-top > div').nth(4);
  await difficulty.hover();
  await difficulty.locator('select').selectOption('2');
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('hvut_ch_style')).difficulty === 'Hard');
  const form = requests.find(([m,q])=>m==='POST' && q.includes('ss=se'))[2];
  assert.match(form,/name="token"\r\n\r\nkeep/); assert.match(form,/name="difflevel"\r\n\r\n2/);
  await page.locator('#hvut-top-config-icon').click();
  assert.equal(await page.locator('.hvut-cfg-div header').textContent(), 'HV Utils Settings');
  assert.equal(await page.evaluate(() => common.get_dynamic_digit_string(12).includes('12')),true);
  assert.equal(await page.evaluate(() => localStorage.getItem('hvut_old_test')), 'keep');
  assert.equal(await page.locator('#hvut-bottom').count(), 1);
  assert.equal(await page.evaluate(() => typeof GM_getValue), 'undefined');
  await page.locator('input[data-key=topMenuIntegration]').uncheck();
  await page.locator('[data-key=equipmentShopProtectFilters]').fill('Magnificent && (!Cloth || Rapier) && $level<250');
  await Promise.all([page.waitForNavigation(),page.locator('.hvut-cfg-div footer input').first().click()]);
  await page.locator('#hvut-top-config-icon').waitFor();
  const cfg = await worker.evaluate(async () => (await chrome.storage.local.get('hvut_settings')).hvut_settings);
  assert.equal(cfg.topMenuIntegration,false);
  assert.deepEqual(cfg.equipmentShopProtectFilters,['Magnificent && (!Cloth || Rapier) && $level<250']);
  assert.ok(requests.some(([m,q])=>m==='GET' && q.includes('ss=lt')));
  await page.goto('https://alt.hentaiverse.org/?s=Bazaar&ss=is');
  await page.locator('#hvut-top-config-icon').click();
  assert.equal(await page.locator('input[data-key=topMenuIntegration]').isChecked(),false);
  await page.goto('https://alt.hentaiverse.org/isekai/?s=Bazaar&ss=is');
  await page.locator('#hvut-top-config-icon').click();
  assert.equal(await page.locator('input[data-key=topMenuIntegration]').isChecked(),true);
  await page.goto('https://e-hentai.org/');
  await page.locator('#nb a').waitFor();
  await page.goto('https://hentaiverse.org/battle-fixture');
  await page.locator('#csp > div').last().click();
  await page.waitForFunction(()=>/\[\d+\]/.test(document.querySelector('#csp').textContent) && !document.querySelector('#csp').textContent.includes('Loading...'));
  assert.equal(await worker.evaluate(async () => (await chrome.storage.local.get('hvut_re')).hvut_re.key), 'Key123');
  assert.ok((await worker.evaluate(()=>calls)).some(([u,c])=>u==='https://e-hentai.org/news.php' && c==='include'));
  for(const url of ['https://alt.hentaiverse.org/isekai/equip/1/key','https://hentaiverse.org/equip/1/key','https://example.org/']) {
    await page.goto(url); assert.equal(await page.locator('#hvut-top').count(),0);
  }
  assert.deepEqual(errors,[]);
});

// Stop the streaming parser after the native sell table is available but before
// document_end. Sample in a rendering frame, not just after page.goto().
const sellURL = 'https://hentaiverse.org/?s=Bazaar&ss=am&screen=sell&filter=weapon_2handed';
const sell = lobby.replace('window.common = {};', `window.common = {}; window.hover_equip = () => {};
window.dynjs_equip = {1:{t:'Exquisite Longsword of Slaughter',k:'fixture',d:'<div>Two-handed Weapon Level 400 Tradeable Condition: 99% Energy: 80%</div>'}};
localStorage.setItem('hvut_persona', JSON.stringify({pset:1,eset:1,pname:'Local',ename:'Test',1:{1:{}}}));
window.eqitems = {1:{c:496}}; window.update_selected_count = () => {};`).replace('id=navbar></div>', 'id=navbar><a>Character</a></div>').replace(/<\/div>$/, `
<style>#equipform{margin-left:120px}</style><div id="armory_left"><div></div></div><div id="filterbar"><a><div>Two-Handed</div></a></div>
<form id="equipform"><input name="postoken" value="fixture"><div id="equiplist"><table><tbody>
<tr class="eqselall"><td><input type="checkbox">Select All</td></tr>
<tr onmouseover="hover_equip(1)"><td><input type="checkbox" name="eqids[]"></td><td class="eqp">Exquisite Longsword of Slaughter</td><td>496 C</td></tr>
</tbody></table></div></form></div>`);
for (const [name, extensions] of [['both', [folder, zh]], ['HVUT only', [folder]], ['translation only', [zh]], ['slow parser', [zh, folder]]]) {
  test(`armory first frame: ${name}`, async t => {
    const list = extensions.join(',');
    const ctx = await chromium.launchPersistentContext('', {channel:'chromium', headless:true,
      args:[`--disable-extensions-except=${list}`, `--load-extension=${list}`]});
    t.after(() => ctx.close());
    if (extensions.includes(folder)) {
      // Keep the unrelated daily encounter-key dialog out of this offline fixture.
      const isHVUT = w => w.url().endsWith('/background.js');
      const worker = ctx.serviceWorkers().find(isHVUT) || await ctx.waitForEvent('serviceworker', isHVUT);
      await worker.evaluate(() => chrome.storage.local.set({hvut_re:{date:Date.now(), count:1, clear:true}}));
    }
    let release;
    const held = new Promise(resolve => { release = resolve; });
    await ctx.route('**/*', async r => {
      if (r.request().url().endsWith('hold.js')) {
        await held; return r.fulfill({contentType:'application/javascript', body:''});
      }
      return r.fulfill({contentType:'text/html; charset=utf-8', body:r.request().isNavigationRequest() ? sell + '<script src="/hold.js"></script>' : sell});
    });
    const page = await ctx.newPage(); page.setDefaultTimeout(5000);
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type()==='error' && m.text().includes('[HV Utils]')) errors.push(m.text()); });
    try {
      await page.goto(sellURL, {waitUntil:'commit'});
      await page.locator('#equiplist').waitFor({state:'attached'});
      const sample = await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => resolve([
        document.readyState, getComputedStyle(document.querySelector('#equiplist')).visibility,
        document.querySelector('#navbar a').textContent
      ]))));
      assert.deepEqual(sample, ['loading', extensions.includes(folder) ? 'hidden' : 'visible', name === 'translation only' ? '角色' : 'Character']);
      if (name === 'slow parser') {
        await page.waitForFunction(() => document.readyState === 'loading' && !document.documentElement.hasAttribute('data-hvut-armory-pending'));
        assert.ok(await page.locator('#equiplist').isVisible());
        assert.equal(await page.locator('#navbar a').textContent(), '角色');
      }
    } finally { release(); }
    await page.waitForLoadState();
    if (extensions.includes(folder)) {
      await page.locator('.hvut-am-side input').first().waitFor();
      assert.ok(await page.locator('tr.hvut-equip-Exquisite').isVisible());
      const button = page.locator('.hvut-am-side input[value="' + (extensions.includes(zh) ? '全选' : 'Select All') + '"]');
      await button.click();
      assert.ok(await page.locator('input[name="eqids[]"]').isChecked());
    }
    if (extensions.includes(zh)) await page.waitForFunction(() => document.querySelector('#navbar a').textContent === '角色');
    assert.equal(await page.locator('#equiplist').isVisible(), true);
    assert.deepEqual(errors, []);
  });
}
test('tool popup: repository, interval persistence, alarm rescheduling and manual checks', async t => {
  const ctx = await chromium.launchPersistentContext('', {channel:'chromium',headless:true,
    args:[`--disable-extensions-except=${folder}`,`--load-extension=${folder}`, '--no-proxy-server','--host-resolver-rules=MAP raw.githubusercontent.com ~NOTFOUND']});
  t.after(() => ctx.close());
  const worker = ctx.serviceWorkers()[0] || await ctx.waitForEvent('serviceworker');
  const pop = await ctx.newPage(); await pop.goto(new URL('popup.html', worker.url()).href);
  await pop.waitForFunction(async () => !!(await chrome.storage.local.get('result')).result);
  assert.equal(await pop.locator('#version').getAttribute('href'), 'https://github.com/MeiYongAI/JPX-PLUS');
  await pop.getByRole('button', {name:'设置', exact:true}).click();
  const interval = pop.getByLabel('自动检查更新间隔');
  assert.equal(await interval.inputValue(),'12');
  await interval.selectOption('6'); await pop.waitForFunction(async () => (await chrome.alarms.get('hv-check-version'))?.periodInMinutes === 360);
  await pop.reload(); await pop.locator('#settings').click(); assert.equal(await interval.inputValue(),'6');
  await interval.selectOption('0'); await pop.waitForFunction(async () => !await chrome.alarms.get('hv-check-version'));
  await interval.selectOption('24'); await pop.waitForFunction(async () => (await chrome.alarms.get('hv-check-version'))?.periodInMinutes === 1440);
  await pop.locator('#back').click(); assert.ok(await interval.isHidden());
  await worker.evaluate(() => { self.fetch = async () => Response.json({version:chrome.runtime.getManifest().version}); });
  await pop.locator('#check').click(); await pop.getByText('已是最新版本').waitFor();
  if(process.env.HVUT_PREVIEW) await pop.locator('body').screenshot({path:process.env.HVUT_PREVIEW});
  await worker.evaluate(() => { self.fetch = async () => Response.json({version:'4.3.0'}); });
  await pop.locator('#check').click(); await pop.getByText('有新版本').waitFor();
  assert.match(await pop.locator('#download').getAttribute('href'), /hv-utils-4\.3\.0.zip$/);
});
