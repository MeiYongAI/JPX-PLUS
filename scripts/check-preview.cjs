'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const repo=path.resolve(__dirname,'..'),output=path.join(repo,'.test-output/preview');fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
(async()=>{
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1100},locale:'zh-CN'});
const errors=[],missing=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
await context.route('**/*',route=>{const url=new URL(route.request().url());const relative=decodeURIComponent(url.pathname).replace(/^\/JPX-PLUS\//,'')||'index.html';const file=path.resolve(repo,'docs',relative);if(!file.startsWith(path.resolve(repo,'docs')+path.sep)||!fs.existsSync(file)){missing.push(url.href);return route.abort();}return route.fulfill({contentType:mime[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});});
context.on('response',response=>{if(response.status()>=400)missing.push(response.url()+' '+response.status());});
try{
const page=await context.newPage();await page.goto('https://meiyongai.github.io/JPX-PLUS/?theme=light');
const ready=()=>page.waitForFunction(()=>document.querySelector('#stage').getAttribute('aria-busy')==='false'&&!document.querySelector('#image-error').hidden===false&&document.querySelector('#preview').naturalWidth>0);
await ready();
const selectionGeometry=await page.evaluate(()=>{const buttons=[...document.querySelectorAll('.toolbar button,#scenes button')];const geometry=()=>buttons.map(button=>{const r=button.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height,fontWeight:getComputedStyle(button).fontWeight};});const before=geometry();const selected=buttons.map(button=>button.getAttribute('aria-pressed'));buttons.forEach(button=>button.setAttribute('aria-pressed','false'));const unselected=geometry();buttons.forEach(button=>button.setAttribute('aria-pressed','true'));const active=geometry();buttons.forEach((button,i)=>button.setAttribute('aria-pressed',selected[i]));return {before,unselected,active};});
assert.deepEqual(selectionGeometry.before,selectionGeometry.unselected,'selected control geometry stays stable');assert.deepEqual(selectionGeometry.before,selectionGeometry.active,'all selection typography stays stable');
const expected=JSON.parse(fs.readFileSync(path.join(repo,'docs/screenshot-scenes.json'),'utf8'));
const scenarios=[];
for(const language of ['en','zh-CN']){
await page.locator('button[data-language="'+language+'"]').click();await ready();
for(const device of ['desktop','mobile']){
await page.locator('button[data-device='+device+']').click();await ready();
const keys=await page.locator('#scenes button').evaluateAll(buttons=>buttons.map(b=>b.dataset.scene));
assert.deepEqual(keys,expected.filter(row=>row[device==='mobile'?4:3]).map(row=>row[0]));
for(const key of keys){await page.locator('#scenes button[data-scene='+key+']').click();await ready();
let size;for(const theme of ['light','dark']){await page.locator('button[data-theme='+theme+']').click();await ready();const current=await page.evaluate(()=>({scene:document.querySelector('#stage').dataset.scene,device:document.querySelector('#stage').dataset.device,theme:document.documentElement.dataset.theme,language:document.documentElement.lang,src:document.querySelector('#preview').getAttribute('src'),size:[document.querySelector('#preview').naturalWidth,document.querySelector('#preview').naturalHeight],pressed:document.querySelector('button[data-theme][aria-pressed=true]').dataset.theme}));assert.equal(current.scene,key);assert.equal(current.theme,theme);assert.equal(current.device,device);assert.equal(current.pressed,theme);assert.equal(current.language,language);assert.equal(current.src.endsWith('-en.png'),language==='en');if(size)assert.deepEqual(current.size,size);size=current.size;scenarios.push(current);}}}}
await page.locator('button[data-device=desktop]').click();await ready();await page.locator('#scenes button[data-scene=configs]').click();await ready();
for(const theme of ['light','dark']){await page.locator('button[data-theme='+theme+']').click();await ready();await page.screenshot({path:path.join(output,'preview-'+theme+'.png'),fullPage:true});}
for(const language of ['en','zh-CN']){await page.locator('button[data-language="'+language+'"]').click();await ready();for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:1000});for(const device of ['desktop','mobile']){await page.locator('button[data-device='+device+']').click();await ready();const metrics=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:innerWidth,buttons:[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width>0).map(b=>({text:b.textContent.trim(),left:b.getBoundingClientRect().left,right:b.getBoundingClientRect().right}))}));assert.ok(metrics.doc<=metrics.viewport,'page fits '+language+' '+width);assert.ok(metrics.buttons.every(b=>b.left>=0&&b.right<=width),'buttons fit '+width);}}}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'preview-mobile.png'),fullPage:true});
await page.goto('https://meiyongai.github.io/JPX-PLUS/?theme=dark&device=mobile&page=detail');await ready();assert.equal(await page.locator('#stage').getAttribute('data-scene'),'detail');assert.equal(await page.locator('#stage').getAttribute('data-device'),'mobile');assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
await page.locator('button[data-theme=light]').focus();await page.keyboard.press('Enter');await ready();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
await page.locator('button[data-language=en]').focus();await page.keyboard.press('Enter');await ready();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.equal(await page.locator('#stage').getAttribute('data-scene'),'detail');assert.equal(await page.locator('#stage').getAttribute('data-device'),'mobile');
await page.goto('https://meiyongai.github.io/JPX-PLUS/');await ready();assert.equal(await page.locator('html').getAttribute('lang'),'en','manual language is remembered');
await page.goto('https://meiyongai.github.io/JPX-PLUS/?lang=zh-CN');await ready();assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN','URL language overrides stored preference');
await page.goto('https://meiyongai.github.io/JPX-PLUS/?page=backpack&device=mobile');await ready();assert.equal(await page.locator('#stage').getAttribute('data-scene'),'configs');
const localeCases=[];
for(const [locale,expected]of [['zh-CN','zh-CN'],['zh-TW','zh-CN'],['en-US','en'],['ja-JP','en']]){
 const p=await context.newPage();await p.addInitScript(locale=>{localStorage.removeItem('jpx-preview-language');Object.defineProperty(navigator,'languages',{get:()=>[locale]});Object.defineProperty(navigator,'language',{get:()=>locale});},locale);await p.goto('https://meiyongai.github.io/JPX-PLUS/');await p.waitForFunction(()=>document.querySelector('#stage')?.getAttribute('aria-busy')==='false'&&document.querySelector('#preview').naturalWidth>0);assert.equal(await p.locator('html').getAttribute('lang'),expected);localeCases.push({locale,expected});await p.close();}
assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
console.log(JSON.stringify({scenarios:scenarios.length,responsiveWidths:[320,390,768,1024,1440],deepLink:true,keyboard:true,localeCases,rememberedLanguage:true,errors,missing}));
}finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
