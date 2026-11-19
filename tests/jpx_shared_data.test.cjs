'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const create=new Function(fs.readFileSync(path.join(__dirname,'../src/shared-data.js'),'utf8')+';return createJpxSharedData;')();
function native(seed={}) { const data=new Map(Object.entries(seed));return {get length(){return data.size;},key:i=>[...data.keys()][i]??null,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)}; }
function setup(){
 const data=new Map(),listeners=[],pending=[];let tick=Date.parse('2026-11-08T12:00:00Z'),id=0,denied=null;const gets=[];
 function host(origin,seed={}){const own=++id,events=[],local=native(seed);const gm={get:(k,f)=>{gets.push(k);return data.has(k)?structuredClone(data.get(k)):f;},set:(k,v)=>{if(denied&&denied(k))throw Error('denied');const old=data.get(k);data.set(k,structuredClone(v));for(const l of listeners)if(l.key===k)pending.push(()=>l.fn(k,old,v,l.own!==own));},list:()=>[...data.keys()],remove:k=>data.delete(k),listen:(key,fn)=>listeners.push({key,fn,own})};
  const shared=create({native:local,gm,origin,emit:e=>events.push(e),now:()=>tick,uuid:()=>String(++id).padStart(8,'0')});return {shared,local,events,gm};}
 return {data,host,gets,flush(){while(pending.length)pending.shift()();},deny:fn=>{denied=fn;},advance:ms=>{tick+=ms;}};
}
const main='https://hentaiverse.org',alt='https://alt.hentaiverse.org';
const record=(timestamp='2026-11-08 12:00:00',world='Persistent')=>({timestamp,world,date:timestamp.slice(0,10),revenueRecords:{totalProfit:1000,staminaCost:0,finalProfit:1000}});
const cost=(used=10,world='Persistent',date='2026-11-08')=>({used,world,date,quota:24,unitPrice:100});
test('hosts share settings but retain both original conflicting copies',async()=>{
 const h=setup(),a=h.host(main,{jpx_cfgBattle:'one',jpx_cfgBattle_isekai:'isekai',hvut_persona:'mine'});
 const b=h.host(alt,{jpx_cfgBattle:'two'});h.flush();
 assert.equal(b.shared.storage.getItem('jpx_cfgBattle'),'one');
 a.shared.storage.getItem('jpx_cfgBattle');b.shared.storage.setItem('jpx_cfgBattle','three');h.flush();
 assert.equal(a.shared.storage.getItem('jpx_cfgBattle'),'three');
 assert.equal(a.shared.storage.getItem('jpx_cfgBattle_isekai'),'isekai');
 assert.equal(a.local.getItem('jpx_cfgBattle'),'one');assert.equal(b.local.getItem('jpx_cfgBattle'),'two');
 assert.equal((await a.shared.backups()).length,2);assert.equal(b.shared.storage.getItem('hvut_persona'),null);
 assert.equal(a.events.filter(e=>e.key==='jpx_cfgBattle').length,1);
 const before=h.data.size;h.flush();assert.equal(h.data.size,before);
});
test('deleted shared settings never resurrect from old native values after reload',()=>{const h=setup(),a=h.host(main,{jpx_cfgStats:'{}'});a.shared.storage.removeItem('jpx_cfgStats');h.flush();const reload=h.host(main,{jpx_cfgStats:'{}'});assert.equal(reload.shared.storage.getItem('jpx_cfgStats'),null);});
test('concurrent configuration edits preserve both proposed versions',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);a.shared.storage.getItem('jpx_cfgBattle');b.shared.storage.getItem('jpx_cfgBattle');a.shared.storage.setItem('jpx_cfgBattle','one');b.shared.storage.setItem('jpx_cfgBattle','two');h.flush();assert.equal(a.shared.storage.getItem('jpx_cfgBattle'),'two');assert.deepEqual([...new Set((await a.shared.revisions()).map(x=>x.value))],['one','two']);});
test('repeated reads and no-op writes do not reread GM or create revisions',()=>{const h=setup(),a=h.host(main,{jpx_cfgBattle:'{}'});a.shared.storage.getItem('jpx_cfgBattle');h.gets.length=0;const count=h.data.size;for(let i=0;i<500;i++){a.shared.storage.getItem('jpx_cfgBattle');a.shared.storage.setItem('jpx_cfgBattle','{}');}assert.equal(h.gets.length,0);assert.equal(h.data.size,count);});
test('legacy archives merge by world and timestamp and migrate once',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);let reads=0;await a.shared.ensureRecords(async()=>{reads++;return [record()];});await b.shared.ensureRecords(async()=>[record(),record(undefined,'Isekai')]);h.flush();assert.equal((await a.shared.allRecords()).length,2);await a.shared.ensureRecords(async()=>{reads++;return [];});assert.equal(reads,1);});
test('separate concurrent battles and repeated final saves count stamina exactly once',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);await a.shared.ensureRecords(async()=>[]);await b.shared.ensureRecords(async()=>[]);await a.shared.saveResult(record(),cost(20));await b.shared.saveResult(record('2026-11-08 12:01:00'),cost(10));await b.shared.saveResult(record(),cost(20));h.flush();assert.equal(a.shared.stamina('Persistent','2026-11-08'),30);assert.equal(b.shared.stamina('Persistent','2026-11-08'),30);assert.equal((await a.shared.allRecords()).length,2);assert.equal((await a.shared.allRecords()).reduce((sum,r)=>sum+r.revenueRecords.staminaCost,0),6);assert.equal(a.shared.stamina('Isekai','2026-11-08'),0);h.advance(86400000);assert.equal(a.shared.usage('Persistent').staminaCost,0);await b.shared.saveResult(record(),cost(20,'Persistent','2026-11-09'));assert.equal(a.shared.stamina('Persistent','2026-11-09'),0);});
test('same timestamp in different worlds retains both records and usage',async()=>{const h=setup(),a=h.host(main);await a.shared.saveResult(record(),cost(10));await a.shared.saveResult(record(undefined,'Isekai'),cost(7,'Isekai'));assert.equal((await a.shared.allRecords()).length,2);assert.equal(a.shared.stamina('Persistent','2026-11-08'),10);assert.equal(a.shared.stamina('Isekai','2026-11-08'),7);});
test('legacy stamina uses explicit maximum baseline and supports correction',async()=>{const time=Date.parse('2026-11-08T10:00:00Z');const h=setup(),a=h.host(main,{jpx_staminaRecords:JSON.stringify({lastUpdate:time,staminaCost:8})}),b=h.host(alt,{jpx_staminaRecords:JSON.stringify({lastUpdate:time,staminaCost:12})});h.flush();assert.equal(a.shared.usage('Persistent').staminaCost,12);await a.shared.saveResult(record(),cost(4));b.shared.setBaseline('Persistent','2026-11-08',20);h.flush();assert.equal(a.shared.usage('Persistent').staminaCost,24);assert.throws(()=>a.shared.setBaseline('Persistent','2026-11-08',-1));});
test('archive delete and replacement are shared and do not refund consumed stamina',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);await a.shared.ensureRecords(async()=>[record('2026-11-07 12:00:00')]);await a.shared.saveResult(record(),cost());b.shared.deleteRecords([a.shared.idOf(record())]);h.flush();assert.equal((await a.shared.allRecords()).length,1);assert.equal(a.shared.usage('Persistent').staminaCost,10);await b.shared.importRecords([record('2026-11-06 12:00:00')],false);h.flush();assert.equal((await a.shared.allRecords()).length,1);assert.equal((await a.shared.allRecords())[0].date,'2026-11-06');});
test('failed shared writes do not change the cache or charge stamina',async()=>{const h=setup(),a=h.host(main,{jpx_cfgBattle:'old'});h.deny(key=>key.includes('setting:jpx_cfgBattle')||key.includes('result:'));assert.throws(()=>a.shared.storage.setItem('jpx_cfgBattle','new'));assert.equal(a.shared.storage.getItem('jpx_cfgBattle'),'old');await assert.rejects(()=>a.shared.saveResult(record(),cost()));assert.equal(a.shared.usage('Persistent').staminaCost,0);h.deny(null);await a.shared.saveResult(record(),cost());assert.equal(a.shared.usage('Persistent').staminaCost,10);});
test('failed migration is retryable and never marks an incomplete archive migrated',async()=>{const h=setup(),a=h.host(main);h.deny(key=>key.includes('legacyRecords:'));await assert.rejects(a.shared.ensureRecords(async()=>[record()]));assert.equal([...h.data.keys()].some(key=>key.includes('recordsMigrated:')),false);h.deny(null);await a.shared.ensureRecords(async()=>[record()]);assert.equal((await a.shared.allRecords()).length,1);});
test('reset prevents old data reappearing even from a previously unopened host',async()=>{const h=setup(),a=h.host(main,{jpx_cfgBattle:'old'});await a.shared.ensureRecords(async()=>[record()]);a.shared.reset();const b=h.host(alt,{jpx_cfgBattle:'older',jpx_staminaRecords:JSON.stringify({lastUpdate:Date.parse('2026-11-08'),staminaCost:20})});await b.shared.ensureRecords(async()=>[record()]);h.flush();assert.equal(b.shared.storage.getItem('jpx_cfgBattle'),null);assert.equal((await b.shared.allRecords()).length,0);assert.equal(b.shared.usage('Persistent').staminaCost,0);});
test('unsupported environments preserve native storage behavior',()=>{const local=native({jpx_cfgBattle:'{}'});const shared=create({native:local,gm:null,origin:main});assert.equal(shared.enabled,false);assert.equal(shared.storage,local);});
test('newly created cleanup signal reaches a host that never read the key',()=>{const h=setup(),a=h.host(main),b=h.host(alt);a.shared.storage.setItem('jpx_cleanupRequest','reset-token');h.flush();assert.ok(b.events.some(event=>event.key==='jpx_cleanupRequest'&&event.newValue==='reset-token'));});
test('small usage query never reads historical or other-world record payloads',async()=>{const h=setup(),a=h.host(main);await a.shared.saveResult(record('2026-11-07 10:00:00'),cost(20,'Persistent','2026-11-07'));await a.shared.saveResult(record(undefined,'Isekai'),cost(7,'Isekai'));await a.shared.saveResult(record(),cost(5));h.gets.length=0;assert.equal(a.shared.usage('Persistent').staminaCost,5);const reads=h.gets.filter(key=>key.includes(':result:'));assert.equal(reads.length,1);assert.ok(reads[0].includes('Persistent'));assert.ok(!h.gets.some(key=>key.includes('legacyRecords:')));});
test('pointer commit failure cannot leave an orphaned charge',async()=>{const h=setup(),a=h.host(main);h.deny(key=>key.includes(':day:'));await assert.rejects(()=>a.shared.saveResult(record(),cost()));assert.equal([...h.data.keys()].some(key=>key.includes(':result:')),false);assert.equal(a.shared.usage('Persistent').staminaCost,0);});
test('a failed notification never makes a successful receipt look unsaved',async()=>{const h=setup(),a=h.host(main);h.deny(key=>key.endsWith(':change'));const original=console.warn;console.warn=()=>{};try{await a.shared.saveResult(record(),cost());}finally{console.warn=original;}assert.equal(a.shared.usage('Persistent').staminaCost,10);h.deny(null);await a.shared.saveResult(record(),cost());assert.equal(a.shared.usage('Persistent').staminaCost,10);});
test('routine settings changes do not refresh the archive viewer',()=>{const h=setup(),a=h.host(main),b=h.host(alt);h.flush();b.events.length=0;a.shared.storage.setItem('jpx_theme','dark');h.flush();assert.ok(b.events.some(e=>e.key==='jpx_theme'));assert.ok(!b.events.some(e=>e.key==='jpx_recordsChanged'));});
test('focus refresh recovers coalesced settings and archive invalidations',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);h.flush();b.shared.storage.getItem('jpx_cfgBattle');assert.equal((await b.shared.allRecords()).length,0);await a.shared.saveResult(record(),cost());a.shared.storage.setItem('jpx_cfgBattle','new');b.shared.refresh();assert.equal(b.shared.storage.getItem('jpx_cfgBattle'),'new');assert.equal((await b.shared.allRecords()).length,1);assert.ok(b.events.some(e=>e.key==='jpx_recordsChanged'));});
test('failed legacy stamina write keeps migration incomplete for retry',()=>{const h=setup(),seed={jpx_staminaRecords:JSON.stringify({lastUpdate:Date.parse('2026-11-08'),staminaCost:15})};h.deny(key=>key.includes('legacyStamina:'));assert.throws(()=>h.host(main,seed));assert.ok(![...h.data.keys()].some(key=>key.includes('settingsMigrated:')));h.deny(null);const a=h.host(main,seed);assert.equal(a.shared.usage('Persistent').staminaCost,15);});
test('shared archive read applies corrected legacy baseline without repeated scans per day',async()=>{const h=setup(),a=h.host(main);a.shared.setBaseline('Persistent','2026-11-08',20);await a.shared.saveResult(record(),cost(10));assert.equal((await a.shared.allRecords())[0].revenueRecords.staminaCost,6);a.shared.setBaseline('Persistent','2026-11-08',0);assert.equal((await a.shared.allRecords())[0].revenueRecords.staminaCost,0);});
test('configuration recovery slots remain bounded after repeated edits',async()=>{const h=setup(),a=h.host(main),b=h.host(alt);for(let i=0;i<100;i++){a.shared.storage.setItem('jpx_cfgBattle','main-'+i);b.shared.storage.setItem('jpx_cfgBattle','alt-'+i);}h.flush();const revisions=await a.shared.revisions();assert.equal(revisions.length,4);assert.ok(revisions.some(row=>row.value==='main-99'));assert.ok(revisions.some(row=>row.value==='alt-99'));});

test('existing raw archives, receipts and import history compress without changing records or stamina', async () => {
 const h=setup(),a=h.host(main),b=h.host(alt),prefix='jpx_shared_v1:';
 const first=record('2026-11-07 10:00:00'),second=record(),third=record('2026-11-08 13:00:00','Isekai');
 first.note='旧记录 日本語 한글 🎠';
 const id=a.shared.idOf(second),key=prefix+'result:'+encodeURIComponent(id);
 h.data.set(prefix+'recordsMigrated:'+encodeURIComponent(main),true);
 h.data.set(prefix+'recordsMigrated:'+encodeURIComponent(alt),true);
 h.data.set(prefix+'legacyRecords:'+encodeURIComponent(main),{origin:main,records:[first]});
 h.data.set(key,{order:'001',id,record:{...second,sharedResult:'001'},stamina:cost(30)});
 h.data.set(prefix+'day:Persistent:2026-11-08:'+encodeURIComponent(id),key);
 h.data.set(prefix+'batch:002',{order:'002',type:'import',merge:true,records:[third]});
 h.data.set(prefix+'batch:003',{order:'003',type:'delete',ids:[a.shared.idOf(first)]});
 const before=await a.shared.allRecords();
 await Promise.all([a.shared.ensureRecords(()=>assert.fail('already migrated')),b.shared.ensureRecords(()=>assert.fail('already migrated'))]);
 h.flush();
 assert.match(h.data.get(prefix+'legacyRecords:'+encodeURIComponent(main)).records,/^gzip:/);
 assert.match(h.data.get(key).record,/^gzip:/);
 assert.match(h.data.get(prefix+'batch:002').records,/^gzip:/);
 assert.equal(h.data.get(prefix+'batch:003').type,'delete');
 assert.deepEqual(await a.shared.allRecords(),before);
 assert.deepEqual(await b.shared.allRecords(),before);
 assert.equal(a.shared.usage('Persistent').staminaCost,30);
 const storage=JSON.stringify([...h.data]);await a.shared.ensureRecords(()=>assert.fail('already migrated'));
 assert.equal(JSON.stringify([...h.data]),storage,'completed compression does not rewrite storage');
 h.gets.length=0;const reload=h.host(main);await reload.shared.ensureRecords(()=>assert.fail('already migrated'));
 assert.ok(!h.gets.some(key=>/:(?:legacyRecords|result|batch):/.test(key)),'ordinary reload never reads archive payloads');
});

test('interrupted compression keeps mixed-format history readable and resumes without loss', async () => {
 const h=setup(),a=h.host(main),prefix='jpx_shared_v1:';
 h.data.set(prefix+'recordsMigrated:'+encodeURIComponent(main),true);
 h.data.set(prefix+'legacyRecords:fixture',{origin:main,records:[record()]});
 h.data.set(prefix+'batch:001',{order:'001',type:'import',merge:true,records:[record(undefined,'Isekai')]});
 const before=await a.shared.allRecords();h.deny(key=>key===prefix+'batch:001');
 await assert.rejects(a.shared.ensureRecords(()=>assert.fail('already migrated')),/denied/);
 assert.match(h.data.get(prefix+'legacyRecords:fixture').records,/^gzip:/);
 assert.ok(Array.isArray(h.data.get(prefix+'batch:001').records));
 assert.equal(h.data.has(prefix+'recordsCompressed_v1'),false);
 const reloaded=h.host(main);assert.deepEqual(await reloaded.shared.allRecords(),before);
 h.deny(null);await reloaded.shared.ensureRecords(()=>assert.fail('already migrated'));
 assert.deepEqual(await reloaded.shared.allRecords(),before);
 assert.match(h.data.get(prefix+'batch:001').records,/^gzip:/);
});

test('compressed payloads retain Unicode and returned records cannot mutate cached history', async () => {
 const h=setup(),a=h.host(main),row=record();row.note='雷电⚡ 日本語 한글';
 await a.shared.ensureRecords(async()=>[row]);
 const first=await a.shared.allRecords();first[0].note='changed';first[0].revenueRecords.totalProfit=0;
 assert.deepEqual(await a.shared.allRecords(),[row]);
 h.data.set('jpx_shared_v1:legacyRecords:'+encodeURIComponent(main),{origin:main,records:'gzip:invalid'});
 const reload=h.host(main);
 await assert.rejects(reload.shared.allRecords());
 assert.equal(h.data.get('jpx_shared_v1:legacyRecords:'+encodeURIComponent(main)).records,'gzip:invalid');
});

test('overlapping saves of the same battle still commit one receipt', async () => {
 const h=setup(),a=h.host(main),b=h.host(alt);
 await Promise.all([a.shared.saveResult(record(),cost(10)),b.shared.saveResult(record(),cost(10))]);h.flush();
 assert.equal((await a.shared.allRecords()).length,1);
 assert.equal(a.shared.usage('Persistent').staminaCost,10);
 assert.equal(b.shared.usage('Persistent').staminaCost,10);
});

test('reset during asynchronous compression cannot resurrect a receipt, import or legacy archive', async () => {
 for(const action of ['save','import','migrate','compress']){
  const h=setup(),a=h.host(main);
  if(action==='compress'){
   h.data.set('jpx_shared_v1:recordsMigrated:'+encodeURIComponent(main),true);
   h.data.set('jpx_shared_v1:legacyRecords:fixture',{origin:main,records:[record()]});
  }
  const pending=action==='save'?a.shared.saveResult(record(),cost()):action==='import'?a.shared.importRecords([record()],true):a.shared.ensureRecords(async()=>[record()]);
  const rejected=assert.rejects(pending,/reset while saving records/);a.shared.reset();await rejected;
  assert.deepEqual(await a.shared.allRecords(),[]);
  assert.equal(a.shared.usage('Persistent').staminaCost,0);
 }
});

const bytes=h=>[...h.data.values()].reduce((sum,value)=>sum+JSON.stringify(value).length,0);
const day=86400000;
test('compaction packs recovery copies after migration and restores them on read',async()=>{
 const big=JSON.stringify({rules:Array.from({length:200},(_,i)=>({type:'item',name:'Health Potion',conditions:[{key:'pHP',value:[0,i/200]}]}))});
 const h=setup(),a=h.host(main,{jpx_cfgBattle:big}),b=h.host(alt);h.flush();
 a.shared.storage.setItem('jpx_cfgBattle',big+' ');b.shared.storage.setItem('jpx_cfgBattle',big+'  ');h.flush();
 const revisions=await a.shared.revisions(),backups=await a.shared.backups(),before=bytes(h);
 await a.shared.ensureRecords(async()=>[]);
 assert.ok(bytes(h)<before/3,'packed copies are much smaller');
 assert.ok([...h.data.entries()].filter(([k])=>k.includes(':revision:')||k.includes(':legacy:')).every(([,v])=>v.packed&&!('value' in v)&&!('values' in v)));
 const canon=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(canon):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
 const sort=rows=>rows.map(row=>JSON.stringify(canon(row))).sort();
 assert.deepEqual(sort(await a.shared.revisions()),sort(revisions));assert.deepEqual(sort(await b.shared.backups()),sort(backups));
 assert.equal(b.shared.storage.getItem('jpx_cfgBattle'),big+'  ');
});
test('settled results fold into a bundle without changing records or stamina',async()=>{
 const h=setup(),a=h.host(main),b=h.host(alt);await a.shared.ensureRecords(async()=>[record('2026-11-01 00:00:00')]);await b.shared.ensureRecords(async()=>[]);
 for(let i=0;i<30;i++){await (i%2?a:b).shared.saveResult(record('2026-11-02 00:'+String(i).padStart(2,'0')+':00'),cost(5,'Persistent','2026-11-02'));h.advance(60000);}
 h.advance(5*day);const today=new Date(Date.parse('2026-11-08T12:00:00Z')+5*day+30*60000).toISOString().slice(0,10);
 await a.shared.saveResult(record(today+' 01:00:00'),cost(3,'Persistent',today));
 const before=await a.shared.allRecords(),usage=a.shared.stamina('Persistent',today),size=bytes(h);
 await a.shared.compact();h.flush();
 const keys=[...h.data.keys()];
 assert.equal(keys.filter(k=>k.includes(':result:')).length,1,'only the recent receipt stays loose');
 assert.equal(keys.filter(k=>k.includes(':bundle:')).length,1);
 assert.equal(keys.filter(k=>k.includes(':day:Persistent:2026-11-02:')).length,0);
 assert.ok(bytes(h)<size);
 const sort=rows=>rows.map(row=>JSON.stringify(row)).sort();
 assert.deepEqual(sort(await b.shared.allRecords()),sort(before));
 assert.equal(a.shared.stamina('Persistent',today),usage);
 await a.shared.compact();assert.equal([...h.data.keys()].filter(k=>k.includes(':bundle:')).length,1,'fewer than 20 settled results are left alone');
});
test('an interrupted compaction never duplicates records or stamina',async()=>{
 const h=setup(),a=h.host(main);await a.shared.ensureRecords(async()=>[]);
 for(let i=0;i<25;i++){await a.shared.saveResult(record('2026-11-02 01:'+String(i).padStart(2,'0')+':00'),cost(2,'Persistent','2026-11-02'));h.advance(60000);}
 h.advance(5*day);const loose=[...h.data.entries()].filter(([k])=>k.includes(':result:'));
 const before=await a.shared.allRecords();await a.shared.compact();
 for(const [k,v] of loose)h.data.set(k,v);h.data.set('jpx_shared_v1:recordsRevision','x');
 const sort=rows=>rows.map(row=>JSON.stringify(row)).sort();
 assert.deepEqual(sort(await a.shared.allRecords()),sort(before));
 a.shared.reset();assert.equal([...h.data.keys()].filter(k=>k.includes(':bundle:')).length,0);
});
test('deleted archive payloads are dropped while records, re-adds and stamina stay exact',async()=>{
 const h=setup(),a=h.host(main),b=h.host(alt);const canon=v=>v&&typeof v==='object'?Array.isArray(v)?v.map(canon):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canon(v[k])])):v;
 const sort=rows=>rows.map(row=>JSON.stringify(canon(row))).sort();
 await a.shared.ensureRecords(async()=>Array.from({length:40},(_,i)=>record('2026-10-01 00:'+String(i).padStart(2,'0')+':00')));
 for(let i=0;i<30;i++){await a.shared.saveResult(record('2026-11-02 02:'+String(i).padStart(2,'0')+':00'),cost(4,'Persistent','2026-11-02'));h.advance(60000);}
 await a.shared.importRecords([record('2026-09-01 00:00:00'),record('2026-09-02 00:00:00')],true);
 h.advance(5*day);await a.shared.compact();
 const today=new Date(Date.parse('2026-11-08T12:00:00Z')+5*day+30*60000).toISOString().slice(0,10);
 for(let i=0;i<3;i++)await a.shared.saveResult(record(today+' 03:0'+i+':00'),cost(9,'Persistent',today));
 const all=await a.shared.allRecords();
 // Delete every legacy record, half of the bundled results, one import and one loose receipt.
 const doomed=all.filter((r,i)=>r.timestamp.startsWith('2026-10')||r.timestamp.startsWith('2026-11-02')&&i%2||r.timestamp==='2026-09-01 00:00:00'||r.timestamp===today+' 03:01:00').map(a.shared.idOf);
 a.shared.deleteRecords(doomed);h.flush();
 await a.shared.importRecords([record('2026-10-01 00:05:00')],true);h.flush(); // re-added after its deletion
 const before=await a.shared.allRecords(),usage=a.shared.stamina('Persistent',today),size=bytes(h);
 await a.shared.compact();h.flush();
 assert.ok(bytes(h)<size*0.7,'dead payloads are gone: '+bytes(h)+' < '+size);
 assert.deepEqual(sort(await b.shared.allRecords()),sort(before));
 assert.ok(before.some(r=>r.timestamp==='2026-10-01 00:05:00'),'a record imported after its deletion survives');
 assert.equal(a.shared.stamina('Persistent',today),usage);
 const storage=JSON.stringify([...h.data]);await a.shared.compact();assert.equal(JSON.stringify([...h.data]),storage,'a pruned archive is not rewritten');
});
test('clearing the archive drops every payload but keeps today\'s charges',async()=>{
 const h=setup(),a=h.host(main);await a.shared.ensureRecords(async()=>Array.from({length:50},(_,i)=>record('2026-10-02 00:'+String(i).padStart(2,'0')+':00')));
 for(let i=0;i<5;i++)await a.shared.saveResult(record('2026-11-08 05:0'+i+':00'),cost(6));
 const usage=a.shared.usage('Persistent').staminaCost;
 a.shared.deleteRecords((await a.shared.allRecords()).map(a.shared.idOf));h.flush();
 const size=bytes(h);await a.shared.compact();h.flush();
 assert.deepEqual(await a.shared.allRecords(),[]);
 assert.equal(a.shared.usage('Persistent').staminaCost,usage);
 assert.ok(bytes(h)<size/2);
 await a.shared.saveResult(record('2026-11-08 06:00:00'),cost(1));assert.equal((await a.shared.allRecords()).length,1);
});
test('a host migrating after pruning still honors earlier deletions',async()=>{
 const h=setup(),a=h.host(main);await a.shared.ensureRecords(async()=>[record('2026-10-03 00:00:00')]);
 a.shared.deleteRecords([a.shared.idOf(record('2026-10-03 00:00:00')),a.shared.idOf(record('2026-10-04 00:00:00'))]);h.flush();await a.shared.compact();
 const b=h.host(alt);await b.shared.ensureRecords(async()=>[record('2026-10-04 00:00:00'),record('2026-10-05 00:00:00')]);
 assert.deepEqual((await b.shared.allRecords()).map(r=>r.timestamp),['2026-10-05 00:00:00']);
});
