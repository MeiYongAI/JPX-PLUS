'use strict';
// Isolated Chrome, synthetic records with the reported archive counts. Measures
// storage volume and codec work, not Tampermonkey injection or live HV latency.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const shared=fs.readFileSync(path.join(root,'src/shared-data.js'),'utf8');
const main=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const defaults=name=>new Function('return '+main.match(new RegExp('ns\\.'+name+' = (function\\(\\) \\{[\\s\\S]*?\\n    \\});'))[1])()();
const records=Array.from({length:2409},(_,i)=>{
 const timestamp=new Date(Date.UTC(2026,9,1,0,i)).toISOString().slice(0,19).replace('T',' ');
 const combatRecords=defaults('createCombatRecords'),revenueRecords=defaults('createRevenueRecords');
 for(const field of Object.keys(combatRecords))if(field!=='use')for(const key of Object.keys(combatRecords[field]))combatRecords[field][key]=(i*31+key.length*7)%250;
 combatRecords.use=Object.fromEntries(['Attack','Cure','Regen','Haste','Spirit Shield','Protection','Imperil','Weaken','Slow','Spark of Life'].map((key,n)=>[key,(i*13+n*7)%500]));
 Object.assign(revenueRecords,{exp:1234567+i*100,credit:1200+i,crystal:{'Crystal of Vigor':10+i%20,'Crystal of Finesse':i%9},material:{'Low-Grade Cloth':i%5},totalProfit:8500+i,finalProfit:8500+i});
 return {timestamp,date:timestamp.slice(0,10),world:i%2?'Isekai':'Persistent',persona:'Fixture '+i%3,battleType:'Arena',result:'Victory',roundInfo:{current:100,total:100},turns:500+i,tps:4.2,deltaSeconds:119,combatRecords,revenueRecords};
});
(async()=>{
 const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});
 try{
  const page=await browser.newPage();
  await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Storage profile</title>'}));
  await page.goto('https://hentaiverse.org/');
  await page.addScriptTag({content:shared+'\nwindow.createShared=createJpxSharedData;'});
  const report=await page.evaluate(async records=>{
   const origin='https://hentaiverse.org',root='jpx_shared_v1:',data=new Map(),gets=[];
   const native={length:0,getItem:()=>null,key:()=>null};
   const gm={get:(key,fallback=null)=>{gets.push(key);return data.has(key)?structuredClone(data.get(key)):fallback;},set:(key,value)=>data.set(key,structuredClone(value)),list:()=>[...data.keys()],remove:key=>data.delete(key),listen:()=>{}};
   data.set(root+'settingsMigrated:'+encodeURIComponent(origin),true);
   data.set(root+'recordsMigrated:'+encodeURIComponent(origin),true);
   data.set(root+'legacyRecords:'+encodeURIComponent(origin),{origin,records:records.slice(0,1953)});
   for(const record of records.slice(1953)){
    const id=JSON.stringify([record.world,record.timestamp]),key=root+'result:'+encodeURIComponent(id);
    data.set(key,{id,order:record.timestamp,record});
   }
   const bytes=()=>new TextEncoder().encode(JSON.stringify(Object.fromEntries(data))).length;
   const oldBytes=bytes(),store=createShared({native,gm,origin});
   const start=performance.now();await store.ensureRecords(()=>{throw Error('Unexpected legacy read');});const migrationMs=performance.now()-start;
   const newBytes=bytes(),cold=performance.now(),restored=await store.allRecords(),coldReadMs=performance.now()-cold;
   const warm=performance.now();await store.allRecords();const warmReadMs=performance.now()-warm;
   gets.length=0;const reload=createShared({native,gm,origin});await reload.ensureRecords(()=>{throw Error('Unexpected legacy read');});
   const startupReads=gets.slice();
   const save=performance.now();await reload.saveResult({...records[0],timestamp:'2026-11-17 23:59:59'});const saveMs=performance.now()-save;
   return {legacyRecords:1953,receipts:456,oldBytes,newBytes,reductionPercent:100*(1-newBytes/oldBytes),migrationMs,coldReadMs,warmReadMs,saveMs,startupReads,equivalent:JSON.stringify(restored)===JSON.stringify(records)};
  },records);
  assert.equal(report.equivalent,true);assert.ok(!report.startupReads.some(key=>/:(legacyRecords|result|batch):/.test(key)));
  const output=path.join(root,'.test-output/shared-storage-profile.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify({scope:'Synthetic records in isolated Chrome; no live manager injection measured',...report},null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
