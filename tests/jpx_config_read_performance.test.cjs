'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/config-manager/library.js'),'utf8');
const create=new Function(source+'\nreturn createJpxConfigLibrary;')();
const mode='OneHanded_General';
const env=()=>({schemaVersion:1,kind:'battle-mode',world:'Persistent',title:'Read test',mode,
 config:{battleVersion:20251216,[mode]:{supports:[{type:'spellSupport',name:'Cure',conditions:[{key:'pHP',value:[0,.4]}]}],attacks:[]}}});
function setup(factory=create){
 const values=new Map();let denied=false;
 const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>{if(denied)throw Error('quota');values.set(key,value);}};
 const options={storage,key:'library',modes:[mode,'TwoHanded_General','1H_Mage_General'],battleVersion:20251216,statsVersion:20260109};
 const library=factory(options),entry=library.save(env());
 library.setApplied('Persistent',{id:entry.id,revision:1,mode,scopes:[mode],config:entry.envelope.config},{activate:true});
 return {values,library,entry,options,deny:()=>{denied=true;}};
}
const corrupt=error=>error.code==='storageCorrupt';

test('selection reads copy only the requested record and retain independent ownership',()=>{
 const metrics={encodes:0,copies:[]};
 const instrumented=source.replace('function encode(value, limit = MAX_JSON) {','function encode(value, limit = MAX_JSON) { metrics.encodes++;')
  .replace('const copyValidated = value => JSON.parse(JSON.stringify(value));','const copyValidated = value => { metrics.copies.push(value === null ? "null" : Array.isArray(value) ? "list" : value.id || "state"); return JSON.parse(JSON.stringify(value)); };');
 const factory=new Function('metrics',instrumented+'\nreturn createJpxConfigLibrary;')(metrics);
 const {library,entry,values}=setup(factory);metrics.encodes=0;metrics.copies=[];
 const raw=values.get('library'),selected=library.readSelection('Persistent');
 assert.equal(metrics.encodes,0,'parsed JSON never reaches the arbitrary-object descriptor walker');
 assert.deepEqual(metrics.copies,[entry.id],'no full-library clone on a selection read');
 selected.config[mode].supports[0].name='Changed';selected.scopes.length=0;
 assert.equal(library.readSelection('Persistent').config[mode].supports[0].name,'Cure');
 const state=library.readState();state.applied.Persistent[entry.id].mode='TwoHanded_General';
 const list=library.list();list[0].envelope.title='Changed';
 const item=library.get(entry.id);item.envelope.config[mode].supports=[];
 assert.equal(library.readSelection('Persistent').mode,mode);
 assert.equal(library.get(entry.id).envelope.title,'Read test');
 assert.equal(library.get(entry.id).envelope.config[mode].supports.length,1);
 assert.equal(values.get('library'),raw,'reads do not modify storage');
 assert.equal(library.readSelection('Isekai'),null);
 assert.throws(()=>library.readSelection('unknown'),error=>error.code==='invalidConfig');
});

test('selection cache sees external replacement, removal, corruption and recovery',()=>{
 const {library,values,entry}=setup();const good=values.get('library');
 assert.equal(library.readSelection('Persistent').id,entry.id);
 const replacement=JSON.parse(good);replacement.applied.Persistent[entry.id].config[mode].supports[0].name='Regen';
 values.set('library',JSON.stringify(replacement));
 assert.equal(library.readSelection('Persistent').config[mode].supports[0].name,'Regen');
 values.set('library','{broken');assert.throws(()=>library.readSelection('Persistent'),corrupt);
 values.delete('library');assert.equal(library.readSelection('Persistent'),null);assert.deepEqual(library.readState().entries,[]);
 values.set('library',good);assert.equal(library.readSelection('Persistent').config[mode].supports[0].name,'Cure');
});

test('selection reads still reject corruption in an unrelated saved config and bindings',()=>{
 const {library,values}=setup();const other=library.save(env()),good=values.get('library');
 for(const change of [state=>{state.entries.find(e=>e.id===other.id).envelope.config[mode].supports='bad';},
  state=>{state.bindings=[{world:'Persistent',personaId:'1',setId:'1',id:'missing',trustedRevision:1}];},
  state=>{state.active.Persistent='missing';},state=>{state.entries.push(state.entries[0]);}]){
  const state=JSON.parse(good);change(state);const raw=JSON.stringify(state);values.set('library',raw);
  assert.throws(()=>library.readSelection('Persistent'),corrupt);assert.equal(values.get('library'),raw);
 }
});

test('failed writes cannot mutate the cached selection or full-library snapshot',()=>{
 const {library,values,entry,deny}=setup();const before=library.readState(),selected=library.readSelection('Persistent'),raw=values.get('library');deny();
 for(const write of [()=>library.rename(entry.id,'New name',1),()=>library.clearApplied('Persistent',entry.id),
  ()=>library.save(env()),()=>library.setApplied('Persistent',{...selected,config:{[mode]:{supports:[],attacks:[]}}},{activate:true})]){
  assert.throws(write,error=>error.code==='storageError');assert.deepEqual(library.readState(),before);
  assert.deepEqual(library.readSelection('Persistent'),selected);assert.equal(values.get('library'),raw);
 }
});

test('JSON-only reader keeps blocked-key, number, depth, node, array and envelope limits',()=>{
 const {values,options}=setup(),good=values.get('library');
 function altered(value){const state=JSON.parse(good);state.extra=value;return JSON.stringify(state);}
 let deep=null;for(let i=0;i<82;i++)deep={child:deep};
 const tooMany={a:Array(90000).fill(1),b:Array(90000).fill(1),c:Array(90000).fill(1)};
 const oversized=JSON.parse(good);oversized.entries[0].envelope.description='x'.repeat(2*1024*1024);
 const samples=[...['__proto__','constructor','prototype'].map(key=>good.slice(0,-1)+',"extra":{"'+key+'":{}}}'),
  good.slice(0,-1)+',"extra":1e400}',altered(deep),altered(Array(100001).fill(0)),altered(tooMany),JSON.stringify(oversized)];
 for(const raw of samples){values.set('library',raw);const library=create(options);assert.throws(()=>library.readSelection('Persistent'),corrupt);assert.throws(()=>library.readState(),corrupt);assert.equal(values.get('library'),raw);}
 const expanding=JSON.parse(good);expanding.padding='x'.repeat(6*1024*1024);expanding.extra={};
 for(let i=0;i<14;i++)expanding.extra['n'+i]=Array(10000).fill(1e20);
 const normalized=JSON.stringify(expanding),raw=normalized.replaceAll('100000000000000000000','1e20');
 assert.ok(raw.length<8*1024*1024&&normalized.length>8*1024*1024);
 values.set('library',raw);assert.throws(()=>create(options).readState(),corrupt);
});

test('stored legacy envelopes normalize privately without modifying original JSON',()=>{
 const {values,options}=setup();const state=JSON.parse(values.get('library')),entry=state.entries[0];
 entry.envelope.mode='Battlecaster_General';entry.envelope.config={version:20251216,Battlecaster_General:{supports:[{type:'spellDuration',name:'Haste'}],attacks:[{type:'target',bottomUp:true}]}};
 delete state.active;state.applied={};const raw=JSON.stringify(state);values.set('library',raw);
 const library=create(options),first=library.get(entry.id);
 assert.equal(first.envelope.mode,'1H_Mage_General');assert.equal(first.envelope.config['1H_Mage_General'].supports[0].type,'spellSupport');
 assert.equal(first.envelope.config['1H_Mage_General'].attacks[0].priorityRule,'Bottom Up');
 first.envelope.config['1H_Mage_General'].supports=[];
 assert.equal(library.get(entry.id).envelope.config['1H_Mage_General'].supports.length,1);assert.equal(values.get('library'),raw);
});

test('indexed validation preserves applications and 2000 persona/set bindings',()=>{
 const {values,options}=setup();const state=JSON.parse(values.get('library')),seed=state.entries[0];
 state.entries=Array.from({length:500},(_,i)=>({...JSON.parse(JSON.stringify(seed)),id:'entry-'+i}));
 state.applied.Persistent=Object.fromEntries(state.entries.map(e=>[e.id,{id:e.id,revision:1,mode,scopes:[mode],config:e.envelope.config}]));
 state.active.Persistent='entry-499';
 state.bindings=Array.from({length:2000},(_,i)=>({world:i%2?'Persistent':'Isekai',personaId:String(i+1),setId:'1',id:'entry-'+(i%500),trustedRevision:1}));
 values.set('library',JSON.stringify(state));const library=create(options);
 assert.equal(library.readSelection('Persistent').id,'entry-499');assert.equal(library.readState().bindings.length,2000);
 state.bindings.push(state.bindings[0]);values.set('library',JSON.stringify(state));assert.throws(()=>library.readSelection('Persistent'),corrupt);
});
