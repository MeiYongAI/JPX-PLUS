'use strict';
// Offline fixtures, actual unmodified translation/HVUT source, no game requests.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const sharp=require(process.env.SHARP_MODULE||'sharp');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'HV-Dark.user.css'),'utf8').match(/@-moz-document[^\{]*\{([\s\S]*)\}\s*$/)[1];
const translator=fs.readFileSync(path.join(root,'HentaiVerse-Chinese.user.js'),'utf8');
const out=path.join(root,'.test-output/battle-ability');
const actions=['attack','skill','items','spirit','defend','focus'];
const img=(id,src)=>'<img id="'+id+'" src="/y/'+src+'" onclick="window.clicks++">';
async function pageFor(browser,body,url='?s=Battle') {
    const page=await browser.newPage({viewport:{width:1100,height:700},deviceScaleFactor:1.5});
    page.errors=[];page.on('pageerror',e=>page.errors.push(e.message));
    const html='<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;font:16px Arial,"Microsoft YaHei",sans-serif}#csp{padding:24px;width:1000px}.line{display:flex;gap:30px;align-items:center;margin:18px 0}#ability_outer{display:flex;gap:30px;position:relative}#ability_top{display:none}#ability_treelist{width:130px;text-align:center}#ability_treelist>div{height:31px}#ability_treepane{width:650px}#ability_treepane>div{display:flex;align-items:center;gap:15px;height:80px}#ability_treepane>div>div:first-child{width:180px}#ability_treepane>div>div:nth-child(3){display:flex;gap:8px}#ability_treepane>div>div:nth-child(3)>div{width:130px;height:30px;text-align:center}</style></head><body><div id="csp">'+body+'</div><script>window.clicks=0</script></body></html>';
    await page.route('**/*',r=>r.request().isNavigationRequest()?r.fulfill({contentType:'text/html',body:html}):r.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="75" height="21"/>'}));
    await page.goto('https://hentaiverse.org/'+url);page.themeStyle=await page.addStyleTag({content:css});
    return page;
}
async function assertPixels(page,id,rgb) {
    const {data,info}=await sharp(await page.locator('#'+id).screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
    let count=0;for(let i=0;i<data.length;i+=info.channels)if(rgb.every((v,c)=>Math.abs(data[i+c]-v)<=1))count++;
    assert.ok(count>=3,id+' matches palette '+rgb+'; pixels='+count);
}
const geometry=page=>page.locator('#csp img').evaluateAll(ns=>ns.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {id:n.id,w:r.width,h:r.height,src:n.getAttribute('src'),handler:n.getAttribute('onclick'),content:s.content,background:s.backgroundColor,border:s.border,outline:s.outline,shadow:s.boxShadow};}));
test('battle text follows the theme palette and keeps native state changes',async t=>{
    fs.mkdirSync(out,{recursive:true});
    const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});t.after(()=>browser.close());
    const body='<div id="pane_log"><table id="textlog"></table></div>'+['n','s','a'].map(state=>'<div class="line">'+actions.map(name=>img(name+'-'+state,'battle/'+name+'_'+state+'.png')).join('')+'</div>').join('')+'<div class="line">'+['sbsel_skills_n','sbsel_skills_s','skills_innate','magic_damage','finishbattle'].map(name=>img(name,'battle/'+name+'.png')).join('')+'</div>'+img('artwork','a/0533.png');
    const page=await pageFor(browser,body);await page.addScriptTag({content:translator});
    await page.waitForSelector('#hv-img-translate-style',{state:'attached'});
    const initial=await geometry(page);
    const result=await page.evaluate(()=>{
        const root=getComputedStyle(document.documentElement);
        return [...document.querySelectorAll('#csp img')].map(n=>{const s=getComputedStyle(n);return {id:n.id,token:['accent','blue','active','text','disabled'].find(k=>s.getPropertyValue('--hvd-control-filter').trim()===root.getPropertyValue('--hvd-image-'+k).trim()),filter:s.filter,bg:s.backgroundColor,shadow:s.boxShadow,outline:s.outlineWidth};});
    });
    for(const name of actions)for(const [state,token,rgb] of [['n','accent',[226,188,140]],['s','blue',[147,186,255]],['a','active',[255,146,149]]]){
        assert.equal(result.find(r=>r.id===name+'-'+state).token,token);await assertPixels(page,name+'-'+state,rgb);
    }
    for(const [id,token] of [['sbsel_skills_n','accent'],['sbsel_skills_s','blue'],['skills_innate','text'],['magic_damage','text'],['finishbattle','accent']])assert.equal(result.find(r=>r.id===id).token,token);
    assert.equal(result.find(r=>r.id==='artwork').filter,'none');
    assert.ok(result.every(r=>r.bg==='rgba(0, 0, 0, 0)'&&r.shadow==='none'));
    const start=css.indexOf('    /* Battle action lettering');
    const end=css.indexOf('    /* Other selectable tabs',start);assert.ok(start>=0&&end>start);
    await page.themeStyle.evaluate((n,before)=>n.textContent=before,css.slice(0,start)+css.slice(end));
    assert.deepEqual(await geometry(page),initial,'battle colors introduce no changes to geometry, surfaces, outlines or handlers');
    await page.locator('#csp').screenshot({path:path.join(out,'battle-before.png')});
    await page.themeStyle.evaluate((n,after)=>n.textContent=after,css);
    await page.locator('#attack-n').evaluate(n=>n.src='/y/battle/attack_s.png');
    assert.equal(await page.locator('#attack-n').evaluate(n=>getComputedStyle(n).filter),await page.locator('#attack-s').evaluate(n=>getComputedStyle(n).filter));
    await page.locator('#attack-n').evaluate(n=>n.src='/y/battle/attack_n.png');
    await page.locator('#attack-n').click();assert.equal(await page.evaluate(()=>clicks),1);
    assert.deepEqual(await geometry(page),initial);
    await page.locator('#csp').screenshot({path:path.join(out,'battle-after.png')});
    assert.deepEqual(page.errors,[]);await page.close();
});
const hvutPath=process.env.HVUT_SOURCE||path.join(root,'..','HVUT_CN_4.2.42.js');
test('CSS preserves existing HVUT markers without inferring other categories from the current pane',{skip:!fs.existsSync(hvutPath)},async t=>{
    const hvut=fs.readFileSync(hvutPath,'utf8');
    function section(a,b){const start=hvut.indexOf(a),end=hvut.indexOf(b,start+a.length);assert.ok(start>=0&&end>start);return hvut.slice(start,end);}
    const code=section('function $id(','const _window =')+"window._query={s:'Character',ss:'ab'};window._ab={};window._player={level:500};window.$config={set:()=>{}};window.$ajax={fetch:()=>{throw Error('Unexpected game request')}};window.GM_addStyle=css=>{const n=document.createElement('style');n.textContent=css;document.head.append(n)};"+section("if (_query.s === 'Character' && _query.ss === 'ab')",'// [END 3]').replace(/\s*else\s*$/,'');
    const tabs=['general','onehanded','twohanded','dualwield','niten','staff','cloth','light','heavy','deprecating1','deprecating2','supportive1','supportive2','elemental','forbidden','divine'];
    const body='<div id="ability_outer"><div id="ability_top"><div></div><div></div><div></div><div>Ability Points: 30</div></div><div id="ability_treelist">'+tabs.map((name,i)=>'<div>'+img('tab-'+name,'ab/t'+(i?'d':'a')+name+'.png')+'</div>').join('')+'</div><div id="ability_treepane"></div></div>';
    const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});t.after(()=>browser.close());
    const reports=[];
    for(const order of ['native','translation-first','hvut-first']){
        const page=await pageFor(browser,body,'?s=Character&ss=ab');
        if(order==='translation-first')await page.addScriptTag({content:translator});
        await page.addScriptTag({content:code});
        if(order==='hvut-first')await page.addScriptTag({content:translator});
        const report=await page.evaluate(({tabs})=>{
            const blue=getComputedStyle(document.documentElement).getPropertyValue('--hvd-image-blue').trim();
            const highlighted=()=>tabs.filter(name=>getComputedStyle(document.getElementById('tab-'+name)).getPropertyValue('--hvd-control-filter').trim()===blue);
            const set=(name,types,points,hidden=false)=>{
                const row=document.createElement('div');if(hidden)row.style.display='none';
                row.innerHTML='<div><span></span></div><div></div><div onclick="do_unlock_ability(1)"></div><div></div><div></div>';
                row.firstElementChild.firstElementChild.textContent=name;
                for(const type of types){const n=document.createElement('div');n.style.backgroundImage='url(/y/ab/2r'+type+'.png)';row.children[2].append(n);}
                document.getElementById('ability_treepane').replaceChildren(row);_ab.point=points;_ab.parse_treepane();
            };
            const states=[['f','u'],['f','x'],['f','f']].map(types=>{set('DW Accuracy',types,2);return {actual:highlighted(),warn:document.querySelector('[data-warn]').dataset.warn};});
            set('DW Accuracy',['f','u'],1);const insufficient=highlighted();
            set('DW Accuracy',['f','u'],2);document.querySelector('.hvut-ab-bu').remove();const removed=highlighted();
            set('DW Accuracy',['f','u'],2);
            const selected=document.getElementById('tab-dualwield');selected.src='/y/ab/tadualwield.png';
            document.getElementById('tab-general').src='/y/ab/tdgeneral.png';
            const selectedIsAccent=getComputedStyle(selected).getPropertyValue('--hvd-control-filter').trim()===getComputedStyle(document.documentElement).getPropertyValue('--hvd-image-accent').trim();
            // Execute the original slot parser: an equipped 1H skill exposes a marker
            // even while the loaded tree contains only Dual Wielding abilities.
            const slot=document.createElement('div');
            slot.setAttribute('onmouseover',"overability(1, '1H Accuracy', 'Requires <strong>Level 50</strong>')");
            document.getElementById('ability_top').firstElementChild.append(slot);
            _ab.parse_slotbar();
            return {states,insufficient,removed,selectedIsAccent,existingMarkers:highlighted(),classCount:document.querySelectorAll('.hvut-ab-tree').length,costColor:getComputedStyle(document.querySelector('.hvut-ab-bu')).color};
        },{tabs});
        assert.deepEqual(report.states.map(s=>s.actual),[[],[],[]]);assert.ok(report.states.every(s=>s.warn==='unslotted'));
        assert.deepEqual(report.insufficient,[]);assert.deepEqual(report.removed,[]);assert.equal(report.classCount,1);assert.equal(report.costColor,'rgb(226, 188, 140)');
        assert.equal(report.selectedIsAccent,true);assert.deepEqual(report.existingMarkers,['onehanded']);
        if(order!=='native'){await assertPixels(page,'tab-dualwield',[226,188,140]);await assertPixels(page,'tab-onehanded',[147,186,255]);fs.mkdirSync(out,{recursive:true});await page.locator('#csp').screenshot({path:path.join(out,'ability-'+order+'.png')});}
        // Reproduce the observed Isekai page: General open, DW Accuracy equipped at 1/2.
        // The Dual Wielding tree itself is not present in the document.
        await page.evaluate(()=>{
            document.querySelectorAll('#ability_treelist > div').forEach(n=>n.classList.remove('hvut-ab-tree'));
            document.getElementById('ability_treepane').replaceChildren();
            document.getElementById('ability_top').firstElementChild.replaceChildren();
            document.querySelectorAll('#ability_treelist img').forEach(n=>n.src=n.getAttribute('src').replace('/y/','/isekai/y/'));
            document.getElementById('tab-general').src='/isekai/y/ab/tageneral.png';
            document.getElementById('tab-dualwield').src='/isekai/y/ab/tddualwield.png';
            _player.level=276;
            const slot=document.createElement('div');
            slot.setAttribute('onmouseover',"overability(0, 'DW Accuracy', 'Requires <strong>Level 50</strong>', 'Requires <strong>Level 150</strong>')");
            document.getElementById('ability_top').firstElementChild.append(slot);_ab.parse_slotbar();
        });
        assert.equal(await page.locator('#tab-dualwield').evaluate(n=>n.parentElement.classList.contains('hvut-ab-tree')),true);
        const isekaiGeometry=await geometry(page);
        const expectedFilter=await page.locator('#tab-dualwield').evaluate(n=>getComputedStyle(n).filter);
        assert.match(expectedFilter,/data:image\/svg\+xml/);
        // The category rule must not regress to the original brightness-only cue.
        const legacyStyle=await page.addStyleTag({content:".hvut-ab-tree > img[src*='/td'] { filter:brightness(250%) !important; }"});
        assert.equal(await page.locator('#tab-dualwield').evaluate(n=>getComputedStyle(n).filter),expectedFilter);
        assert.deepEqual(await geometry(page),isekaiGeometry);
        if(order!=='native'){
            await assertPixels(page,'tab-general',[226,188,140]);await assertPixels(page,'tab-dualwield',[147,186,255]);await assertPixels(page,'tab-twohanded',[229,224,216]);
            await page.locator('#ability_treelist').screenshot({path:path.join(out,'ability-upgrade-isekai-'+order+'.png')});
        }
        await page.locator('#tab-dualwield').evaluate(n=>n.src='/isekai/y/ab/tadualwield.png');
        assert.equal(await page.locator('#tab-dualwield').evaluate(n=>getComputedStyle(n).filter),expectedFilter,'upgrade blue also takes precedence in the selected category');
        await page.locator('#tab-dualwield').evaluate(n=>n.parentElement.classList.remove('hvut-ab-tree'));
        assert.notEqual(await page.locator('#tab-dualwield').evaluate(n=>getComputedStyle(n).filter),expectedFilter,'selected category reverts when the native upgrade mark disappears');
        if(order!=='native')await assertPixels(page,'tab-dualwield',[226,188,140]);
        await legacyStyle.evaluate(n=>n.remove());
        assert.deepEqual(page.errors,[]);reports.push({order,...report});await page.close();
    }
    fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({offline:true,reports},null,2));
});
