'use strict';
// Real userscript renderer in disposable, fully offline Chromium contexts.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const backdrop = require('./backdrop.cjs');
const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'docs/images');
const language=process.env.JPX_SCREENSHOT_LANGUAGE==='en'?'en':'zh-CN';
const statsOnly=process.argv.includes('--stats-only');
const names=name=>language==='en'?name.replace('.png','-en.png'):name;
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const pack = fs.readFileSync(path.join(root, 'JPX-PLUS-ZhTrans.user.js'), 'utf8');
const expose = [
  'initDoI18n();loadBattleConfig();',
  'battleStyle="OneHanded";battleType="General";',
  'cfgBattle.advanceToNextRound=true;cfgBattle.showCooldowns=true;cfgBattle.showDurations=true;cfgBattle.showRealTimeProficiency=true;cfgBattle.showMonsterHP=true;',
  'loadStatsSettingsConfig();',
  'const demoProfit=cfgStats.statsColumns.find(item=>item.id==="finalProfit");',
  'demoProfit.colorThresholds="0:#8d543a,1000:#467752,5000:#ad7330";',
  'localStorage.setItem(prefix+"cfgStats",JSON.stringify(cfgStats));',
  'window.__readme={open:renderSettings,toggle:toggleJpxTheme};applyJpxTheme();'
].join('\n');
assert.ok(source.includes('\ninitDo();'), 'Startup anchor exists');
const harness = source.replace('\ninitDo();','\n'+expose);
const html='<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#edebdf;color:#5c0d11;font:12px Verdana}#csp{width:1240px;height:704px}</style></head><body><div id="csp"><div id="navbar"></div></div></body></html>';
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});
  const context=await browser.newContext({viewport:{width:1200,height:940},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[], blocked=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>route.request().isNavigationRequest()
    ? route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html})
    : (blocked.push(route.request().url()),route.abort()));
  try{
    await page.goto('https://hentaiverse.org/?s=Character');
    await backdrop.install(page);
    if(language==='zh-CN')await page.addScriptTag({content:pack});
    await page.addScriptTag({content:harness});
    await page.evaluate(()=>__readme.open());
    const reports=[];
    const captureContentState=()=>page.evaluate(()=>{
      const dialog=document.querySelector('#settings-container');
      return {
        expanded:[...dialog.querySelectorAll('details')].map(node=>node.open),
        scrolls:[...dialog.querySelectorAll('*')].map(node=>[node.scrollLeft,node.scrollTop]),
        inputs:[...dialog.querySelectorAll('input,select,textarea')].map(node=>({value:node.matches('[data-control-color],[data-control-palette],[data-color-property][data-default=true]')?'theme-palette':node.value,checked:node.checked})),
        active:[...dialog.querySelectorAll('[role=tabpanel]')].find(node=>getComputedStyle(node).display!=='none')?.id,
        selected:[...dialog.querySelectorAll('[data-selected=true]')].map(node=>node.dataset.fieldId)
      };
    });
    async function shot(name){
      name=names(name);
      await page.mouse.move(4,4);
      await page.evaluate(()=>{document.activeElement?.blur();});
      await settle(page);
      const state=await page.evaluate(()=>{
        const dialog=document.querySelector('#settings-container');
        const box=dialog.getBoundingClientRect();
        const active=[...dialog.querySelectorAll('[role=tabpanel]')].find(node=>getComputedStyle(node).display!=='none');
        return {x:box.x,y:box.y,width:box.width,height:box.height,text:dialog.textContent,active:active?.id,theme:document.documentElement.dataset.jpxTheme,
          retired:dialog.querySelectorAll('[data-field-key=dailyTasks],[data-field-key=autoStartBattle],[data-field-key=autoCheckIn],[data-field-key=autoArena],[data-field-key=autoEncounter],[data-field-key=autoRingOfBlood]').length,
          focusRing:document.querySelectorAll('#settings-container :focus-visible').length};
      });
      assert.equal(state.retired,0,'No retired task controls');
      assert.equal(state.text.includes('\ufffd'),false,'Chinese renders without replacement characters');
      if(language==='en')assert.equal(/[\u3400-\u9fff]/u.test(state.text),false,'English screenshots use only the main script language');
      assert.equal(state.focusRing,0,'No focus decoration in captures');
      const palette=await page.evaluate(()=>{
        const sample=document.querySelector('.jpx-control-preview-sample'), css=getComputedStyle(sample);
        const values=[css.color,getComputedStyle(sample.querySelector('.jpx-widget-drag')).backgroundColor,css.backgroundColor,css.borderTopColor];
        const inputs=[...document.querySelectorAll('[data-control-color],[data-control-palette]')].map(node=>node.value);
        const colors=values.map(value=>'#'+value.match(/[\d.]+/g).slice(0,3).map(part=>Math.round(Number(part)).toString(16).padStart(2,'0')).join(''));
        return {inputs,colors,surface:values[2]};
      });
      assert.deepEqual(palette.inputs,palette.colors,'Palette controls show actual theme preview colors');
      const surface=palette.surface.match(/[\d.]+/g).slice(0,3).map(Number);
      assert.equal(surface.every(channel=>state.theme==='dark'?channel<100:channel>150),true,'Default preview surface follows light/dark theme');
      if(state.active==='panel_stats'){
        const statsColors=await page.evaluate(()=>{
          const editor=document.querySelector('#jpx-stats-statsColumns');
          const hex=value=>'#'+value.match(/[\d.]+/g).slice(0,3).map(part=>Math.round(Number(part)).toString(16).padStart(2,'0')).join('');
          const swatches=[...editor.querySelectorAll('[data-color-property]')].map(input=>({
            value:input.value,default:input.dataset.default,
            actual:hex(getComputedStyle(input.closest('.jpx-stats-palette').querySelector('.jpx-stats-preview-sample')).getPropertyValue(input.dataset.colorProperty))
          }));
          const samples=[...editor.querySelectorAll('.jpx-stats-preview-sample')].map(sample=>({
            background:getComputedStyle(sample).backgroundColor,inlineBackground:sample.style.backgroundColor,text:sample.textContent
          }));
          return {swatches,samples,thresholds:[...editor.querySelectorAll('[data-threshold-color]')].map(input=>input.value)};
        });
        assert.equal(statsColors.swatches.length,2,'Stats preview has text and fill swatches');
        for(const swatch of statsColors.swatches){
          assert.equal(swatch.default,'true','Demo keeps default text and fill');
          assert.equal(swatch.value,swatch.actual,'Stats swatch matches the actual themed preview');
        }
        assert.equal(statsColors.samples.length,2,'Main preview and Try sample are both checked');
        for(const sample of statsColors.samples){
          assert.equal(sample.inlineBackground,'','Preview does not force a demo fill');
          assert.ok(sample.background.match(/[\d.]+/g).slice(0,3).map(Number).every(channel=>state.theme==='dark'?channel<100:channel>150),'Both statistics previews follow the theme background');
        }
        assert.deepEqual(statsColors.thresholds,['#8d543a','#467752','#ad7330'],'Three threshold examples remain unchanged');
      }
      if(statsOnly&&state.active!=='panel_stats')return;
      const clip={x:state.x-14,y:state.y-14,width:state.width+28,height:state.height+28};
      await page.screenshot({path:path.join(output,name),clip,animations:'disabled'});
      reports.push({name,width:clip.width,height:clip.height,active:state.active,theme:state.theme,bytes:fs.statSync(path.join(output,name)).size});
    }
    await page.locator('#panel_battle').evaluate(panel=>{
      const preview=panel.querySelector('.jpx-control-preview-stage');
      panel.scrollTop+=Math.max(0,preview.getBoundingClientRect().bottom-panel.getBoundingClientRect().bottom+10);
    });
    await shot('desktop-settings-light.png');
    const basicState=await captureContentState();
    await page.locator('#jpx-theme-toggle').click();
    await shot('desktop-settings-dark.png');
    assert.deepEqual(await captureContentState(),basicState,'Basic settings theme preserves other controls and scroll');
    await page.locator('#jpx-theme-toggle').click();
    await page.locator('#tab_keyBindings').click();
    await shot('desktop-keybindings.png');
    const keyState=await captureContentState();
    await page.locator('#jpx-theme-toggle').click();
    await shot('desktop-keybindings-dark.png');
    assert.deepEqual(await captureContentState(),keyState,'Key bindings theme preserves inputs and scroll');
    await page.locator('#jpx-theme-toggle').click();
    await page.locator('#tab_stats').click();
    await page.locator('[data-stats-section=statsColumns]').click();
    await page.locator('#jpx-stats-statsColumns [data-field-id=finalProfit] .jpx-stats-select').click();
    await page.locator('#jpx-stats-statsColumns .jpx-stats-threshold-preview > summary').click();
    await page.locator('#jpx-stats-statsColumns [data-threshold-preview]').fill('2600');
    await shot('desktop-stats-settings.png');
    const statsState=await captureContentState();
    await page.locator('#jpx-theme-toggle').click();
    await shot('desktop-stats-settings-dark.png');
    assert.deepEqual(await captureContentState(),statsState,'Statistics dark theme preserves values, selection, expansion and scroll');
    for(const [light,dark] of [['desktop-settings-light.png','desktop-settings-dark.png'],['desktop-keybindings.png','desktop-keybindings-dark.png'],['desktop-stats-settings.png','desktop-stats-settings-dark.png']]){
      if(statsOnly&&!light.startsWith('desktop-stats-settings'))continue;
      const a=reports.find(item=>item.name===names(light)),b=reports.find(item=>item.name===names(dark));
      assert.equal(a.width,b.width,light+' paired width');
      assert.equal(a.height,b.height,light+' paired height');
    }
    assert.deepEqual(errors,[],'No runtime errors');
    console.log(JSON.stringify({browser:await browser.version(),language,offline:true,errors,blocked,reports},null,2));
  }finally{await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
