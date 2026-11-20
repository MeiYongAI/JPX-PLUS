'use strict';
// Ordinary page startup must not pay for unopened UI or full library validation.
const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {configArchive}=require('./fixtures/config-archive.cjs');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const html='<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div><div id="mainpane"></div></div>';
function instrument(){
    window.__startup={checks:0,refreshes:0,validations:0,sync:null};
    window.__schemasReady=()=>!!settingsSchemas;
    const check=needsJpxMonsterDatabase;
    needsJpxMonsterDatabase=()=>{__startup.checks++;return check();};
    getJpxMonsterDatabase=()=>({refresh:async()=>{__startup.refreshes++;}});
    const library=getJpxConfigLibrary(),runtime=library.readRuntime;
    jpxConfigLibrary=Object.freeze({...library,readRuntime:world=>{__startup.validations++;return runtime(world);}});
}
const harness=source.replace('\ninitDo();','\n('+instrument.toString()+')();initDo();__startup.sync={...__startup};');
let browser;
before(async()=>{browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});});
after(async()=>browser?.close());
async function lobby(t,cfg){
    const context=await browser.newContext();t.after(()=>context.close());
    await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:html}):route.fulfill({status:404,body:''}));
    const {storage}=configArchive({count:20,size:300*1024,active:true,world:'Persistent'});
    if(cfg)storage.jpx_cfgBattle=JSON.stringify({...JSON.parse(storage.jpx_cfgBattle),...cfg});
    await context.addInitScript(values=>{for(const [key,value] of Object.entries(values))localStorage.setItem(key,value);},storage);
    const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('https://hentaiverse.org/?s=Character&ss=eq');
    await page.addScriptTag({content:harness});
    await page.waitForFunction(()=>__startup.checks>0,null,{timeout:8000});
    return {page,startup:await page.evaluate(()=>__startup),errors};
}

test('lobby startup defers the monster-database rule check and its library validation',async t=>{
    const {startup,errors}=await lobby(t);
    assert.deepEqual(errors,[]);
    assert.equal(startup.sync.checks,0,'no rule check before the first paint');
    assert.equal(startup.sync.validations,0,'the configuration library is not validated synchronously');
    assert.equal(startup.checks,1);
    assert.equal(startup.refreshes,0,'default rules do not need the monster database');
});

test('deferred check still refreshes the monster database when monster info is enabled',async t=>{
    const {startup,errors}=await lobby(t,{showMonsterInfo:true});
    assert.deepEqual(errors,[]);
    assert.equal(startup.sync.checks,0);
    assert.equal(startup.checks,1);
    assert.equal(startup.refreshes,1);
});


test('ordinary pages mount only entry styles and build the editor on first open',async t=>{
    const {page,errors}=await lobby(t);
    const css=page.locator('style#jpx');
    assert.equal(await page.evaluate(()=>__schemasReady()),false);
    const entry=await css.textContent();
    assert.match(entry,/#jpx-mobile-entry/);
    assert.doesNotMatch(entry,/#ctrl-widget|\.jpx-settings-dialog/);
    await page.keyboard.press(',');
    await page.locator('#settings-container[open]').waitFor();
    assert.equal(await page.evaluate(()=>__schemasReady()),true);
    assert.match(await css.textContent(),/\.jpx-settings-dialog/);
    assert.equal(await css.count(),1);
    assert.deepEqual(errors,[]);
});

// Hold the next rendering opportunity so early input cannot pass by chance
// because a fast machine happened to finish booting before the test sent it.
async function pendingLobby(t, { marker = '', hidden = false, probeOnly = false } = {}) {
    const context = await browser.newContext(); t.after(() => context.close());
    const body = html + '<form id="persona_form"><select><option value="1">Build A</option><option value="2">Build B</option></select></form>' + marker;
    await context.route('**/*', route => route.request().isNavigationRequest()
        ? route.fulfill({ contentType: 'text/html', body }) : route.fulfill({ status: 404, body: '' }));
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    t.after(() => assert.deepEqual(errors, []));
    await page.goto('https://hentaiverse.org/?s=Character&ss=ch');
    await page.evaluate(hidden => {
        window.__restoreFrames = () => { window.requestAnimationFrame = raf; window.cancelAnimationFrame = cancel; };
        const raf = window.requestAnimationFrame, cancel = window.cancelAnimationFrame;
        window.requestAnimationFrame = callback => { window.__frame = callback; return 1; };
        window.cancelAnimationFrame = () => {};
        if (hidden) Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        window.__boots = 0;
    }, hidden);
    const input = probeOnly
        ? source.replace('function jpxMain() {', 'function jpxMain() { window.__boots++; return;')
        : source.replace('\ninitDo();', '\ninitDo(); window.__boots++; window.__loadoutPending = () => jpxLoadoutPending;');
    await page.addScriptTag({ content: input + '\nwindow.__inlineBoots = window.__boots;' });
    return page;
}

test('ordinary startup releases injection and the animation frame before initializing', async t => {
    const page = await pendingLobby(t);
    assert.equal(await page.evaluate(() => window.__inlineBoots), 0);
    assert.equal(await page.locator('#jpx').count(), 0);
    assert.equal(await page.locator('#persona_form').isVisible(), true);
    assert.equal(await page.evaluate(() => { __restoreFrames(); __frame(); return window.__boots; }), 0,
        'initialization must not run inside the before-paint callback');
    await page.waitForFunction(() => window.__boots === 1);
    await page.evaluate(() => { document.dispatchEvent(new Event('DOMContentLoaded')); __frame(); });
    await page.waitForTimeout(30);
    assert.equal(await page.evaluate(() => window.__boots), 1);
});

test('a settings shortcut during deferred startup is handled once by the real handler', async t => {
    const page = await pendingLobby(t);
    await page.evaluate(() => __restoreFrames());
    await page.keyboard.press(',');
    await page.locator('#settings-container[open]').waitFor();
    assert.equal(await page.evaluate(() => window.__boots), 1);
    await page.evaluate(() => __frame());
    await page.waitForTimeout(30);
    assert.equal(await page.evaluate(() => window.__boots), 1);
    assert.equal(await page.locator('#settings-container[open]').count(), 1);
});

for (const type of ['change', 'submit']) test('early persona ' + type + ' still invalidates the loadout', async t => {
    const page = await pendingLobby(t);
    const state = await page.evaluate(type => {
        __restoreFrames();
        const form = document.getElementById('persona_form');
        form.querySelector('select').value = '2';
        (type === 'submit' ? form : form.querySelector('select')).dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
        return { boots: __boots, pending: __loadoutPending() };
    }, type);
    assert.deepEqual(state, { boots: 1, pending: true });
});

test('a page becoming hidden starts even if its animation frame never fires', async t => {
    const page = await pendingLobby(t);
    await page.evaluate(() => {
        __restoreFrames();
        Object.defineProperty(document, 'hidden', { value: true });
        document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await page.evaluate(() => window.__boots), 1);
});

for (const marker of ['<div id="battle_main"></div>', '<table id="textlog"></table>', '<div id="riddlemaster"></div>']) {
    test('immediate bootstrap for ' + marker, async t => {
        // Isolate routing here; full battle and riddle fixtures exercise initDo.
        const page = await pendingLobby(t, { marker, probeOnly: true });
        assert.equal(await page.evaluate(() => window.__inlineBoots), 1);
        assert.equal(await page.evaluate(() => typeof window.__frame), 'undefined');
    });
}

test('an already hidden ordinary page initializes without waiting for rendering', async t => {
    const page = await pendingLobby(t, { hidden: true });
    assert.equal(await page.evaluate(() => window.__inlineBoots), 1);
});
