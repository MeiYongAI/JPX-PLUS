'use strict';
// Offline captured PNGs and the actual translator. No account requests or ability allocation.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const root = path.resolve(__dirname, '..');
const assetsDir = path.join(__dirname, 'fixtures/hv-controls');
const assets = JSON.parse(fs.readFileSync(path.join(assetsDir, 'assets.json'), 'utf8'));
const usercss = fs.readFileSync(path.join(root, 'HV-Dark.user.css'), 'utf8');
const css = usercss.match(/@-moz-document[^\{]*\{([\s\S]*)\}\s*$/)[1];
const translation = fs.readFileSync(path.join(root, 'HentaiVerse-Chinese.user.js'), 'utf8');
const out = path.join(root, '.test-output/image-controls');
const control = (id, src, active = true) => `<img id="${id}" src="${src}"${active ? ' onclick="window.__clicks++"' : ''}>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;background:#191b1e;color:#e5e0d8;font:14px/1.5 Arial,"Microsoft YaHei",sans-serif}#csp{padding:20px;width:500px;box-sizing:border-box}h1{font-size:19px;margin:0 0 14px}h2{font-size:13px;font-weight:400;color:#b4afa7;margin:18px 0 9px}
.line{display:flex;align-items:center;gap:22px;min-height:30px}.hint{color:#b4afa7;font-size:12px}.actions img{vertical-align:middle}img[onclick]{cursor:pointer}.slots{display:flex;gap:16px;height:65px}.ability_slotbar{display:flex;gap:16px}.ability_slotbar>div{width:44px;height:46px;position:relative}.ability_slotbar>div>div{width:34px;height:36px;position:absolute;top:3px;left:5px}
#ability_treelist{width:145px;text-align:center;border-right:1px solid #5a534c}#ability_treelist>div{height:31px}#ability_treelist img{margin-top:5px}.categories{display:flex;gap:24px}.category-notes>div{height:31px;line-height:31px;color:#b4afa7;font-size:12px}
.hvut-ab-tree>img[src*='/td']{filter:brightness(250%)}.hvut-ab-slot{position:absolute;bottom:-5px;left:2px;width:30px;text-align:center;font-size:9pt;color:var(--color-ab-font)}.hvut-ab-max{background:var(--color-ab-max)}.hvut-ab-cap{background:var(--color-ab-cap)}.hvut-ab-up{background:var(--color-ab-up)}
.hvut-ab-warn::before{content:attr(data-warn);display:inline-block;margin-bottom:2px;padding:1px 3px;border-radius:2px;background:var(--color-font-highlight);color:var(--color-font-invert);font-size:9pt}
.hvut-ab-bar{font-size:9pt;line-height:30px;white-space:nowrap;width:100px;text-align:center;background-image:url('/y/ab/5rf.png')}.hvut-ab-bu{color:var(--color-ab-slot);display:block}.hvut-ab-bux{color:var(--color-font-invalid);display:block;cursor:not-allowed}.hvut-ab-bx{color:var(--color-font-invalid)}
</style></head><body><main id="csp"><h1>暗色控件 / 状态辨识</h1>
<h2>操作文字：可用 / 禁用</h2><div class="line actions">${control('challenge','/y/arena/startchallenge.png')}${control('challenge-disabled','/y/arena/startchallenge_d.png',false)}</div>
<div class="line actions">${control('train','/y/training/train.png')}${control('train-disabled','/y/training/train_d.png',false)}${control('apply','/y/character/apply.png')}${control('rename','/y/monster/rename.png')}</div>
<div class="line">${control('clone','/y/character/persona_create_clone_d.png',false)}${control('blank','/y/character/persona_create_blank_d.png',false)}</div>
<h2>装备套装：当前 / 其他可选</h2><div class="line">${control('set1','/y/equip/set1_on.png')}${control('set2','/y/equip/set2_off.png')}${control('set3','/y/equip/set3_off.png')}</div>
<h2>加减点：可操作 / 禁用（原生图片）</h2><div class="line">${control('minus','/y/character/dec.png')}<span>0</span>${control('plus','/y/character/inc.png')}<span class="hint">可操作</span></div>
<div class="line">${control('minus-disabled','/y/character/dec_d.png',false)}<span>0</span>${control('plus-disabled','/y/character/inc_d.png',false)}<span class="hint">禁用</span></div>
<h2>能力分类：选中 / 可升级 / 普通</h2><div class="categories"><div id="ability_treelist">
<div id="category-selected">${control('selected-img','/y/ab/tageneral.png')}</div>
<div id="category-up" class="hvut-ab-tree">${control('up-img','/y/ab/tdonehanded.png')}</div>
<div id="category-normal">${control('normal-img','/y/ab/tdtwohanded.png')}</div>
<div id="category-both" class="hvut-ab-tree">${control('both-img','/y/ab/tadeprecating1.png')}</div>
</div><div class="category-notes"><div>当前分类</div><div>含可升级技能</div><div>其他分类</div><div>当前分类 + 可升级</div></div></div>
<h2>已装备能力：可升级 / 等级上限 / 已满级</h2><div class="slots ability_slotbar">
${[['up','pu','3/10'],['cap','bu','5/10'],['max','ru','max']].map(([state,frame,text])=>`<div style="background-image:url(/y/ab/${frame}.png)"><div style="background-image:url(/y/t/3.png);background-position:0px 2px" onclick="window.__clicks++" draggable="true"><span class="hvut-ab-slot hvut-ab-${state}">${text}</span></div></div>`).join('')}
</div><div class="line"><span class="hvut-ab-warn" data-warn="unleveled"> 技能 A</span><span class="hvut-ab-warn" data-warn="unslotted"> 技能 B</span></div>
<h2>加点消耗：可升级 / 点数不足 / 等级受限</h2><div class="line"><div class="hvut-ab-bar"><span class="hvut-ab-bu" data-action="unlock">2</span></div><div class="hvut-ab-bar"><span class="hvut-ab-bux">5</span></div><div class="hvut-ab-bar"><span class="hvut-ab-bx">5 (350)</span></div></div>
<h2>原生图标样本（不启用汉化时单独验证）</h2><div class="line native">${control('native-cancel','/y/training/canceltrain.png')}${control('native-disabled','/y/training/train_d.png',false)}</div>
<div id="sentinels" style="display:none">${['/y/t/3.png','/y/a/0533.png','/y/riddle/example.png','/y/monster/hungerbar.png','/y/ab/ru.png'].map((src,i)=>control('art'+i,src)).join('')}</div>
</main><script>window.__clicks=0;</script></body></html>`;
const geometry = page => page.locator('#csp img,.ability_slotbar>div,.hvut-ab-bar').evaluateAll(nodes => nodes.map(n => {
    const r = n.getBoundingClientRect();
    return { id:n.id, width:r.width, height:r.height, src:n.getAttribute('src'), content:getComputedStyle(n).content, onclick:n.getAttribute('onclick') };
}));
test('image text and real HVUT states stay distinct without altering artwork or click targets', async t => {
    fs.mkdirSync(out,{recursive:true});
    const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});
    t.after(()=>browser.close());
    const results=[];
    for(const translated of [false,true]) {
        const page=await browser.newPage({viewport:{width:550,height:880},deviceScaleFactor:1.5});
        const errors=[];page.on('pageerror',e=>errors.push(e.message));
        await page.route('**/*',route=>{
            const url=new URL(route.request().url());
            if(route.request().isNavigationRequest())return route.fulfill({contentType:'text/html',body:html});
            if(assets[url.pathname])return route.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(assetsDir,assets[url.pathname]))});
            // Only the translated fixture uses these uncaptured placeholders for layout/selector checks.
            return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="50" height="16"/>'});
        });
        await page.goto('https://hentaiverse.org/?s=Character&ss=ab');
        let before=css;
        const baseline=path.join(out,'before-1.0.9.css');
        if(fs.existsSync(baseline))before=fs.readFileSync(baseline,'utf8').match(/@-moz-document[^\{]*\{([\s\S]*)\}\s*$/)[1];
        const style=await page.addStyleTag({content:before});
        if(translated) {
            await page.addScriptTag({content:translation});
            await page.waitForSelector('#hv-img-translate-style',{state:'attached'});
            await page.evaluate(async()=>{await Promise.all([...document.querySelectorAll('img')].map(async n=>{const url=getComputedStyle(n).content.match(/^url\("(.*)"\)$/)?.[1];if(url){const image=new Image();image.src=url;await image.decode();}}));});
        }
        await page.mouse.move(540,870);
        const initial=await geometry(page);
        await page.locator('#csp').screenshot({path:path.join(out,(translated?'zh':'native')+'-before.png')});
        await style.evaluate((node,css)=>node.textContent=css,css);
        assert.deepEqual(await geometry(page),initial,'native size, translated content and handlers stay intact');
        const report=await page.evaluate(()=>{
            const style=id=>getComputedStyle(document.getElementById(id));
            const categories=['category-selected','category-up','category-normal','category-both'].map(id=>({id,bg:style(id).backgroundColor,shadow:style(id).boxShadow,marker:getComputedStyle(document.getElementById(id),'::after').content}));
            const colors=[...document.querySelectorAll('.hvut-ab-slot,.hvut-ab-warn')].map(n=>{const s=getComputedStyle(n,n.matches('.hvut-ab-warn')?'::before':null);return{class:n.className,color:s.color,bg:s.backgroundColor};});
            const costs=[...document.querySelectorAll('.hvut-ab-bu,.hvut-ab-bux,.hvut-ab-bx')].map(n=>{const s=getComputedStyle(n);return{background:s.backgroundColor,frame:s.boxShadow};});
            const surfaces=['challenge','challenge-disabled','set1','set2','plus','plus-disabled','minus','minus-disabled'].map(id=>({id,background:style(id).backgroundColor,frame:style(id).boxShadow,filter:style(id).filter}));
            return{categories,colors,costs,surfaces,enabledFilter:style('challenge').filter,disabledFilter:style('challenge-disabled').filter,
                upgradeFilter:style('up-img').filter,normalFilter:style('normal-img').filter,selectedSet:style('set1').boxShadow,otherSet:style('set2').boxShadow,
                artwork:[...document.querySelectorAll('#sentinels img')].map(n=>getComputedStyle(n).filter),
                spriteFilter:getComputedStyle(document.querySelector('.ability_slotbar>div>div')).filter};
        });
        assert.match(report.enabledFilter,/data:image\/svg\+xml/);
        assert.notEqual(report.enabledFilter,report.disabledFilter);
        assert.notEqual(report.upgradeFilter,report.normalFilter);
        assert.ok(report.categories.every(c=>c.marker==='none'&&c.bg==='rgba(0, 0, 0, 0)'&&c.shadow==='none'),'no added category backgrounds, borders or markers');
        assert.equal(report.otherSet,'none');assert.equal(report.selectedSet,'none');
        assert.ok([...report.surfaces,...report.costs].every(s=>s.frame==='none'&&s.background==='rgba(0, 0, 0, 0)'),'no added action or tier backgrounds and outlines');
        for(const [active,disabled] of [['challenge','challenge-disabled'],['plus','plus-disabled'],['minus','minus-disabled']]) {
            assert.notEqual(report.surfaces.find(s=>s.id===active).filter,report.surfaces.find(s=>s.id===disabled).filter,'enabled / disabled image colors differ');
        }
        assert.notEqual(report.surfaces.find(s=>s.id==='set1').filter,report.surfaces.find(s=>s.id==='set2').filter,'selected set differs by image color only');
        assert.ok(report.artwork.every(f=>f==='none'));assert.equal(report.spriteFilter,'none');
        const lum=color=>color.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
        for(const c of report.colors){const a=lum(c.color),b=lum(c.bg);c.contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(c.contrast>=4.5,JSON.stringify(c));}
        const palette=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['accent','text','blue'].map(name=>[name,s.getPropertyValue('--hvd-'+name).trim()]).concat([['disabled',s.getPropertyValue('--color-font-invalid').trim()]]));});
        report.imageColors=[];
        for(const [id,token] of [['challenge','accent'],['set1','accent'],['set2','text'],['plus','accent'],['minus','accent'],['challenge-disabled','disabled'],['up-img','blue']]) {
            const {data,info}=await sharp(await page.locator('#'+id).screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
            const expected=palette[token].slice(1).match(/../g).map(v=>parseInt(v,16));
            let exactPixels=0;
            for(let i=0;i<data.length;i+=info.channels)if(expected.every((value,c)=>Math.abs(data[i+c]-value)<=1))exactPixels++;
            assert.ok(exactPixels>=3,`${id}: rendered lettering matches ${token} ${palette[token]}, got ${exactPixels} matching pixels`);
            report.imageColors.push({id,token,color:palette[token],exactPixels});
        }
        await page.locator('#csp').screenshot({path:path.join(out,(translated?'zh':'native')+'-after.png')});
        await page.locator('#challenge').click();assert.equal(await page.evaluate(()=>__clicks),1);
        await page.locator('#plus').click();await page.locator('#minus').click();assert.equal(await page.evaluate(()=>__clicks),3);
        await page.locator('#plus').evaluate(n=>n.src='/y/character/inc_d.png');
        assert.deepEqual(await page.locator('#plus,#plus-disabled').evaluateAll(nodes=>nodes.map(n=>{const s=getComputedStyle(n);return[s.backgroundColor,s.boxShadow,s.filter];})).then(states=>states[0]),
            await page.locator('#plus-disabled').evaluate(n=>{const s=getComputedStyle(n);return[s.backgroundColor,s.boxShadow,s.filter];}),'point button follows native disabled image switch');
        await page.locator('#category-up').evaluate(n=>n.classList.remove('hvut-ab-tree'));
        assert.equal(await page.locator('#category-up').evaluate(n=>getComputedStyle(n,'::after').content),'none');
        assert.equal(await page.locator('#up-img').evaluate(n=>getComputedStyle(n).filter),report.normalFilter,'upgrade text reverts when its native state clears');
        await page.locator('.hvut-ab-slot.hvut-ab-up').evaluate(n=>{n.classList.replace('hvut-ab-up','hvut-ab-max');n.textContent='max';});
        const badges=await page.locator('.hvut-ab-slot.hvut-ab-max').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));
        assert.equal(badges[0],badges[1],'upgrade highlight disappears when ability reaches maximum');
        await page.locator('#set1').evaluate(n=>n.src='/y/equip/set1_off.png');
        assert.equal(await page.locator('#set1').evaluate(n=>getComputedStyle(n).boxShadow),report.otherSet);
        assert.deepEqual(errors,[]);results.push({translated,...report});await page.close();
    }
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({offline:true,results},null,2));
});
