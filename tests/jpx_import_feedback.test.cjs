'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture, envelope, choose, save, row } = require('./fixtures/battle-import.cjs');
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
const directNotice = page => page.locator('.jpx-settings-window > .jpx-import-feedback');
const libraryNotice = page => page.locator('.jpx-config-manager .jpx-import-feedback');
const config = () => ({ battleVersion:20251216, TwoHanded_General:envelope().config.OneHanded_Item });
async function selectDirect(page, value, name = 'Direct.json') {
    const file = page.waitForEvent('filechooser'); await page.locator('#import-button').click();
    await (await file).setFiles({name,mimeType:'application/json',buffer:Buffer.from(typeof value === 'string' ? value : JSON.stringify(value))});
}

test('direct import status persists, can be dismissed by keyboard, and is cleared on undo', async t => {
    const { page } = await fixture(browser,t); await page.locator('#tab_battle').click();
    await selectDirect(page,config()); await directNotice(page).locator('p').waitFor();
    await page.waitForTimeout(4200); assert.equal(await directNotice(page).isVisible(),true);
    await directNotice(page).getByRole('button',{name:'Close',exact:true}).focus(); await page.keyboard.press('Enter');
    assert.equal(await directNotice(page).isVisible(),false);
    await selectDirect(page,config()); await page.waitForFunction(()=>document.querySelector('.jpx-settings-window > .jpx-import-feedback')?.dataset.stage === 'draft');
    await page.locator('#undo-settings-button').click(); assert.equal(await directNotice(page).isVisible(),false);
    await page.locator('#redo-settings-button').click(); assert.equal(await directNotice(page).isVisible(),false);
});

test('a pending direct import announces reading and cannot report success after navigation', async t => {
    const {page} = await fixture(browser,t); await page.locator('#tab_battle').click();
    await page.evaluate(()=>__imports.hold()); await selectDirect(page,config());
    await page.waitForFunction(()=>__imports.pending()===1);
    assert.match(await directNotice(page).textContent(),/Reading.*Direct.json/);
    await page.locator('#tab_stats').click(); await page.evaluate(()=>__imports.release());
    await page.waitForTimeout(60); assert.equal(await directNotice(page).isVisible(),false);
});

test('direct save failure stays actionable and a retry reports actual persistence', async t => {
    const {page} = await fixture(browser,t); await page.locator('#tab_stats').click();
    const value=await page.evaluate(()=>__imports.defaults()); value.statsColumns[0].customName='Feedback persistence';
    await selectDirect(page,value); await page.waitForFunction(()=>document.querySelector('.jpx-settings-window > .jpx-import-feedback')?.dataset.stage==='draft');
    const original=await page.evaluate(()=>__imports.snapshot().storedStats);
    await page.evaluate(()=>__imports.deny('jpx_cfgStats')); await page.locator('#save-button').click();
    assert.match(await directNotice(page).textContent(),/Could not save/);
    assert.equal(await page.evaluate(()=>__imports.snapshot().storedStats),original);
    await page.locator('#save-button').click();
    assert.equal(await directNotice(page).locator('p').textContent(),'Saved.');
    assert.equal(JSON.parse(await page.evaluate(()=>__imports.snapshot().storedStats)).statsColumns[0].customName,'Feedback persistence');
    await page.locator('#cfgStats-ui input').first().dispatchEvent('input');
    assert.equal(await directNotice(page).isVisible(),false,'later edits clear stale saved confirmation');
    await page.locator('#tab_battle').click(); assert.equal(await directNotice(page).isVisible(),false);
});

for(const direct of [false,true]) test('cancelling a newer picker clears obsolete reading feedback: '+direct,async t=>{
    const {page}=await fixture(browser,t); if(direct) await page.locator('#tab_battle').click();
    const notice=direct?directNotice(page):libraryNotice(page);
    await page.evaluate(()=>__imports.hold());
    if(direct) await selectDirect(page,config()); else await choose(page,envelope());
    await page.waitForFunction(()=>__imports.pending()===1); assert.equal(await notice.getAttribute('data-stage'),'reading');
    const chooser=page.waitForEvent('filechooser');
    await (direct?page.locator('#import-button'):page.locator('.jpx-config-toolbar').getByRole('button',{name:'Import',exact:true})).click();
    await (await chooser).setFiles([]); await page.evaluate(()=>__imports.release());
    await page.waitForTimeout(60); assert.equal(await notice.isVisible(),false);
});

test('file-read errors have a specific reason and the next successful selection replaces the error', async t => {
    const {page}=await fixture(browser,t);
    await page.evaluate(()=>{ const original=File.prototype.text; File.prototype.text=function(){File.prototype.text=original;return Promise.reject(new Error('read denied'));}; });
    await choose(page,envelope()); await libraryNotice(page).locator('[role=alert]').waitFor();
    assert.match(await libraryNotice(page).textContent(),/Could not read the file/);
    await choose(page,envelope()); await page.locator('.jpx-config-form').waitFor();
    assert.match(await libraryNotice(page).textContent(),/File validated/);
    assert.equal(await libraryNotice(page).locator('p').getAttribute('role'),'status');
});

test('saved library import remains visibly unapplied and Apply replaces that status', async t => {
    const {page}=await fixture(browser,t,{status:'running'});
    await choose(page,envelope()); await save(page); await page.waitForTimeout(4200);
    assert.match(await libraryNotice(page).textContent(),/Not applied yet/);
    assert.equal(await page.evaluate(()=>__imports.snapshot().active),true);
    await row(page,'Import case').getByRole('button',{name:'Apply',exact:true}).click();
    assert.equal(await libraryNotice(page).isVisible(),false);
    assert.match(await page.locator('.jpx-config-notice').textContent(),/Applied.*paused/);
});

test('invalid input with HTML in its name is rendered as text and can be retried', async t => {
    const {page}=await fixture(browser,t);
    const name='<img src=x onerror=alert(1)>.json'; await choose(page,'{bad',name);
    await libraryNotice(page).locator('[role=alert]').waitFor();
    assert.ok((await libraryNotice(page).textContent()).includes(name));
    assert.equal(await libraryNotice(page).locator('img').count(),0);
    await choose(page,envelope()); await save(page); assert.match(await libraryNotice(page).textContent(),/Not applied yet/);
});

for (const locale of ['ZhCN','ZhTW','ZhHK','Ja','Ko']) test('localized import feedback survives narrow dark layout: '+locale, async t => {
    const {page}=await fixture(browser,t,{mobile:true});
    await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'..','JPX-PLUS-'+locale+'.user.js'),'utf8')});
    await page.evaluate(()=>document.getElementById('settings-container').close());
    await page.locator('#settings-container').waitFor({state:'detached'});
    await page.evaluate(()=>__imports.open());
    await page.setViewportSize({width:320,height:720});
    await page.locator('#jpx-theme-toggle').click();
    await selectDirect(page,config(),'很长的文件名LongConfigurationName'.repeat(8)+'.json');
    await page.waitForFunction(()=>document.querySelector('.jpx-settings-window > .jpx-import-feedback')?.dataset.stage==='draft');
    const text=await directNotice(page).locator('p').textContent();
    assert.ok(text.includes('很长的文件名')); assert.equal(text.includes('${'),false); assert.equal(text.includes('Not saved yet'),false);
    const layout=await directNotice(page).evaluate(node=>({width:node.clientWidth,scrollWidth:node.scrollWidth,bottom:node.getBoundingClientRect().bottom,saveTop:document.getElementById('save-button').getBoundingClientRect().top}));
    assert.ok(layout.scrollWidth<=layout.width+1,JSON.stringify(layout)); assert.ok(layout.bottom<=layout.saveTop,JSON.stringify(layout));
    assert.equal(await directNotice(page).locator('p').getAttribute('title'),'很长的文件名LongConfigurationName'.repeat(8)+'.json');
    if(locale==='ZhCN'){
        const output=path.join(__dirname,'../.test-output/import-feedback'); fs.mkdirSync(output,{recursive:true});
        await page.screenshot({path:path.join(output,'direct-mobile-dark.png')});
        await directNotice(page).getByRole('button').click();
        await page.locator('#jpx-settings-menu-button').click(); await page.locator('#tab_configManager').click();
        const chooser=page.waitForEvent('filechooser'); await page.locator('.jpx-config-toolbar').getByRole('button',{name:'导入',exact:true}).click();
        await (await chooser).setFiles({name:'测试配置.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope('测试配置')))});
        await page.locator('.jpx-config-form').waitFor(); await page.screenshot({path:path.join(output,'library-ready-mobile-dark.png')});
        await page.locator('.jpx-config-form button[type=submit]').click();
        assert.match(await libraryNotice(page).textContent(),/加入我的配置.*点击.*应用.*后使用/);
        await page.screenshot({path:path.join(output,'library-saved-mobile-dark.png')});
    }
});

for(const width of [768,1024,1440]) test('import result and Save remain readable in light and dark at '+width,async t=>{
    const {page}=await fixture(browser,t); await page.setViewportSize({width,height:900});
    if(!await page.locator('#tab_battle').isVisible()) await page.locator('#jpx-settings-menu-button').click();
    await page.locator('#tab_battle').click(); await selectDirect(page,config());
    await page.waitForFunction(()=>document.querySelector('.jpx-settings-window > .jpx-import-feedback')?.dataset.stage==='draft');
    for(const theme of ['light','dark']){
        if(theme==='dark') await page.locator('#jpx-theme-toggle').click();
        const layout=await directNotice(page).evaluate(node=>({width:node.clientWidth,scrollWidth:node.scrollWidth,bottom:node.getBoundingClientRect().bottom,saveTop:document.getElementById('save-button').getBoundingClientRect().top}));
        assert.ok(layout.scrollWidth<=layout.width+1,JSON.stringify(layout)); assert.ok(layout.bottom<=layout.saveTop,JSON.stringify(layout));
        assert.equal(await page.locator('#save-button').isVisible(),true);
        if(width===1440){const output=path.join(__dirname,'../.test-output/import-feedback');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,'direct-desktop-'+theme+'.png')});}
    }
});
