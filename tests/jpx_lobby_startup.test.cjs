'use strict';
// Issue #15/#16: JPX runs in the same task as HVUT, so its synchronous lobby
// startup delays HVUT's first paint. Library validation must stay off that path.
const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {configArchive}=require('./fixtures/config-archive.cjs');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const html='<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div><div id="mainpane"></div></div>';
function instrument(){
    window.__startup={checks:0,refreshes:0,validations:0,sync:null};
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
    return {startup:await page.evaluate(()=>__startup),errors};
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
