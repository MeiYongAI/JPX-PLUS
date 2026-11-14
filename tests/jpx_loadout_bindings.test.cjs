'use strict';
const {test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const html=(persona='1',set='1')=>'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#edebdf;font:12px Arial}#csp{width:1240px;height:700px}</style><div id="csp"><div id="navbar"></div><div id="hvut-top"><div><span>Build A [1]</span></div></div><div hidden><form id="persona_form"><select name="persona_set"><option value="1" '+(persona==='1'?'selected':'')+'>Build A</option><option value="2" '+(persona==='2'?'selected':'')+'>Build B</option></select></form><div id="eqsl">'+['1','2','3'].map(id=>'<img src="/y/set'+id+'_'+(set===id?'on':'off')+'.png">').join('')+'</div><div id="eqsb"></div></div></div>';
function expose(){
    initDoI18n();loadBattleConfig();applyJpxTheme();
    jpxPanelManager.refreshAppearance=()=>{};
    window.__binding={
        open:renderSettings,init:initJpxLoadoutBindings,lookup:()=>ensureJpxModeDetection(true),
        state:()=>getJpxConfigLibrary().readState(), catalog:getJpxLoadoutCatalog, label:key=>t('cM.'+key),
        confirmed:()=>jpxLoadoutConfirmed, pending:()=>jpxLoadoutPending, detectionContext:getJpxDetectionContext,
        native:()=>JSON.parse(localStorage.getItem(prefix+'cfgBattle'+isekaiSuffix)||'null'),
        selected:()=>getJpxSelectedBattleMode(),apply:id=>commitJpxConfigEntry(getJpxConfigLibrary().get(id),jpxConfigWorld()),
        theme:toggleJpxTheme,
        save(title,mode='OneHanded_General',id){
            return getJpxConfigLibrary().save({schemaVersion:1,kind:'battle-mode',title,description:'',world:jpxConfigWorld(),mode,
                config:{battleVersion:defaultCfgBattle.battleVersion,[mode]:{supports:[{type:'stop',customMessage:title,conditions:[]}],attacks:[{type:'normalAttack'}]}}},id?{id}:{});
        },
        bind:(id,personaId,setId,world=jpxConfigWorld())=>{const lib=getJpxConfigLibrary(),entry=lib.get(id);return lib.setBinding({world,personaId,setId},id,entry.revision);},
        remember(personaId,setId){const doc=new DOMParser().parseFromString(window.__fixture(personaId,setId),'text/html');rememberJpxLoadout(doc,doc);},
        rememberPages(character,equipment){rememberJpxLoadout(new DOMParser().parseFromString(character,'text/html'),new DOMParser().parseFromString(equipment,'text/html'));},
        custom(id){const lib=getJpxConfigLibrary(),entry=lib.get(id);entry.envelope.config[entry.envelope.mode].rules.push({type:'kamisamaniNattaHi',code:'window.__mustNotRun = true'});return lib.save(entry.envelope,{id});},
        battle(){log=document.createElement('div');isActiveBattle=true;},
        running:()=>isActiveBattle,
        route(count){for(let i=0;i<count;i++)getJpxSelectedBattleMode();}
    };
}
const harness=source.replace('\ninitDo();','\n('+expose.toString()+')();');
let browser;
before(async()=>{browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});});
after(async()=>browser?.close());
async function fixture(t,{world='Persistent',width=1360,zh=false}={}){
    const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});t.after(()=>context.close());
    let current={persona:'1',set:'1'},blocked=false,holdNext=null;const requests=[],errors=[];
    await context.route('**/*',async route=>{
        const req=route.request(),url=new URL(req.url());
        if(req.isNavigationRequest())return route.fulfill({contentType:'text/html',body:html(current.persona,current.set)});
        if(url.searchParams.get('s')==='Character'){
            requests.push({url:req.url(),method:req.method()});
            const body=blocked?'Unavailable':html(current.persona,current.set),held=holdNext;holdNext=null;
            if(held)await held;
            return route.fulfill({status:blocked?503:200,contentType:'text/html',body});
        }
        return route.fulfill({status:404,body:''});
    });
    const page=await context.newPage();page.setDefaultTimeout(6000);page.on('pageerror',error=>errors.push(error.message));
    const boot=async()=>{
        await page.evaluate('window.__fixture = '+html.toString());
        if(zh)await page.addScriptTag({content:fs.readFileSync(path.join(root,'JPX-PLUS-ZhCN.user.js'),'utf8')});
        await page.addScriptTag({content:harness});
    };
    await page.goto('https://hentaiverse.org/'+(world==='Isekai'?'isekai/':''));await boot();
    return{page,context,requests,errors,boot,world,setGame:(persona,set)=>{current={persona,set};},block:()=>{blocked=true;},
        hold(){let release;holdNext=new Promise(resolve=>{release=resolve;});return release;}};
}
const state=page=>page.evaluate(()=>__binding.state());
const active=async(page,world='Persistent')=>(await state(page)).active?.[world];
const add=(page,title,mode)=>page.evaluate(({title,mode})=>__binding.save(title,mode),{title,mode});
const bind=(page,id,personaId,setId,world)=>page.evaluate(args=>__binding.bind(...args),[id,personaId,setId,world]);
const remember=(page,p,s)=>page.evaluate(([p,s])=>__binding.remember(p,s),[p,s]);

for(const world of ['Persistent','Isekai'])test(world+': confirmed tuples apply exact local rules; manual choices persist until the tuple changes',async t=>{
    const f=await fixture(t,{world}),{page}=f,a=await add(page,'A'),b=await add(page,'B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','1');
    await page.evaluate(()=>__binding.init());assert.equal(await active(page,world),a.id);
    await remember(page,'2','1');assert.equal(await active(page,world),b.id);
    await page.evaluate(id=>__binding.apply(id),a.id);
    await remember(page,'2','1');assert.equal(await active(page,world),a.id,'same tuple must not fight explicit manual apply');
    await remember(page,'1','3');assert.equal(await active(page,world),a.id,'unbound tuple keeps current selection');
    await remember(page,'2','1');assert.equal(await active(page,world),b.id);
    const native=await page.evaluate(()=>__binding.native());assert.equal(native.bindings,undefined);assert.equal(native.active,undefined);
    assert.equal((await state(page)).active?.[world==='Persistent'?'Isekai':'Persistent'],undefined);
    assert.deepEqual(f.requests,[]);assert.deepEqual(f.errors,[]);
});

test('native reload observes a changed set while a pending dropdown never applies early',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    await page.evaluate(()=>{const s=document.querySelector('#persona_form select');s.value='2';s.dispatchEvent(new Event('change',{bubbles:true}));});
    assert.equal(await page.evaluate(()=>__binding.pending()),true);assert.equal(await active(page),a.id);
    f.setGame('2','2');await page.reload();await f.boot();await page.evaluate(()=>__binding.init());
    assert.equal(await active(page),b.id);assert.deepEqual(f.errors,[]);
});

test('HVUT waits for the equipment response, then applies once without fetching',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    await page.evaluate(()=>{document.querySelector('#hvut-top span').textContent='(P...)';});
    await page.evaluate(()=>__binding.lookup());assert.deepEqual(f.requests,[],'a binding dialog cannot query an intermediate persona switch');
    await page.evaluate(()=>{
        localStorage.setItem('hvut_persona',JSON.stringify({pset:2,eset:1,1:{name:'Build A',1:{name:''}},2:{name:'Build B',1:{name:''},2:{name:'Tower'}}}));
        document.querySelector('#hvut-top span').textContent='(E...)';
    });
    assert.equal(await active(page),a.id);
    await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('hvut_persona'));d.eset=2;localStorage.setItem('hvut_persona',JSON.stringify(d));document.querySelector('#hvut-top span').textContent='Tower';});
    assert.equal(await active(page),b.id);assert.equal(await page.evaluate(()=>__binding.selected()),'TwoHanded_General');
    const saved=await page.evaluate(()=>localStorage.getItem('jpx_configApplySignal_v1'));
    await page.evaluate(()=>document.querySelector('#hvut-top').append(document.createElement('span')));
    assert.equal(await page.evaluate(()=>localStorage.getItem('jpx_configApplySignal_v1')),saved);assert.deepEqual(f.requests,[]);
});

test('bindings never probe or auto-apply during battle/puzzle; steady routing does not read the library',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A');await bind(page,a.id,'1','1');
    await page.evaluate(()=>__binding.battle());await page.evaluate(()=>__binding.init());await page.evaluate(()=>__binding.lookup());
    await remember(page,'1','1');assert.equal(await active(page),undefined);assert.equal(await page.evaluate(()=>__binding.running()),true);
    await page.evaluate(id=>__binding.apply(id),a.id);
    const count=await page.evaluate(()=>{let count=0;const get=Storage.prototype.getItem;Storage.prototype.getItem=function(key){if(key==='jpx_configLibrary_v1')count++;return get.call(this,key);};__binding.route(1000);Storage.prototype.getItem=get;return count;});
    assert.equal(count,0);assert.deepEqual(f.requests,[]);
});

test('saved edits apply only on a later switch, and newly introduced code requires a new binding confirmation',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A');await bind(page,a.id,'1','1');await page.evaluate(()=>__binding.init());
    await page.evaluate(id=>__binding.save('Edited','OneHanded_General',id),a.id);await remember(page,'1','1');
    assert.equal((await state(page)).applied.Persistent[a.id].revision,1);
    await remember(page,'2','1');await remember(page,'1','1');assert.equal((await state(page)).applied.Persistent[a.id].revision,2);
    await page.evaluate(id=>__binding.custom(id),a.id);await remember(page,'2','1');await remember(page,'1','1');
    assert.equal((await state(page)).applied.Persistent[a.id].revision,2);assert.equal(await page.evaluate(()=>window.__mustNotRun),undefined);
});

test('missing observations use deduplicated GETs; stale HVUT cache alone cannot select a rule',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A');await bind(page,a.id,'1','1');
    await page.evaluate(()=>{document.querySelector('#persona_form').remove();document.querySelector('#eqsl').remove();localStorage.setItem('hvut_persona',JSON.stringify({pset:2,eset:3,2:{name:'Stale',3:{name:'Old'}}}));});
    await page.evaluate(()=>Promise.all([__binding.lookup(),__binding.lookup()]));
    assert.equal(await active(page),a.id);assert.equal(f.requests.length,1);assert.ok(f.requests.every(r=>r.method==='GET'));
});

test('failed character lookup and puzzle page leave stored rules and active selection unchanged',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A');await bind(page,a.id,'1','1');
    await page.evaluate(()=>{document.querySelector('#persona_form').remove();document.querySelector('#eqsl').remove();});
    f.block();await page.evaluate(()=>__binding.lookup());assert.equal(await active(page),undefined);
    const count=f.requests.length;
    await page.evaluate(()=>{const puzzle=document.createElement('div');puzzle.id='riddlemaster';document.body.append(puzzle);});
    await page.evaluate(()=>__binding.lookup());await remember(page,'1','1');
    assert.equal(await active(page),undefined);assert.equal(f.requests.length,count);assert.deepEqual(f.errors,[]);
});

test('native-rule write failure rolls back application and does not consume the pending loadout',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','1');await page.evaluate(()=>__binding.init());
    const before=await page.evaluate(()=>({native:__binding.native(),library:__binding.state(),catalog:__binding.catalog()}));
    const failed=await page.evaluate(()=>{
        const set=Storage.prototype.setItem;let rejected=false;
        Storage.prototype.setItem=function(key,value){if(key==='jpx_configLibrary_v1'&&!rejected){rejected=true;throw Error('quota');}return set.call(this,key,value);};
        try{__binding.remember('2','1');return false;}catch{return true;}finally{Storage.prototype.setItem=set;}
    });
    assert.equal(failed,true);
    assert.deepEqual(await page.evaluate(()=>({native:__binding.native(),library:__binding.state(),catalog:__binding.catalog()})),before);
    await remember(page,'2','1');assert.equal(await active(page),b.id);
});

test('HVUT switching already in progress at startup waits for completion',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');
    await page.evaluate(()=>{document.querySelector('#hvut-top span').textContent='(E...)';__binding.init();});
    assert.equal(await active(page),undefined);assert.equal(f.requests.length,0);
    await page.evaluate(()=>{localStorage.setItem('hvut_persona',JSON.stringify({pset:2,eset:2,2:{name:'Build B',2:{name:'Tower'}}}));document.querySelector('#hvut-top span').textContent='Tower';});
    assert.equal(await active(page),b.id);assert.deepEqual(f.errors,[]);
});

for(const world of ['Persistent','Isekai'])test(world+': fast HVUT completion applies once and ignores stale page selectors',async t=>{
    const f=await fixture(t,{world}),{page}=f,a=await add(page,'A'),b=await add(page,'B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','3');await page.evaluate(()=>__binding.init());
    await page.evaluate(world=>{
        const button=document.querySelector('#hvut-top span');
        button.textContent='(P...)';
        localStorage.setItem(world==='Isekai'?'hvuti_persona':'hvut_persona',JSON.stringify({pset:2,eset:3,2:{name:'Renamed B',3:{name:'Tower'}}}));
        button.textContent='(E...)';button.textContent='Tower';
    },world);
    assert.equal(await active(page,world),b.id);
    assert.equal(await page.evaluate(()=>__binding.detectionContext().personaId),'2');
    assert.equal(await page.evaluate(()=>__binding.detectionContext().persona),'Renamed B');
    const catalog=await page.evaluate(()=>__binding.catalog());
    assert.equal(catalog.personas.find(p=>p.id==='2').lastSetId,'3');
    const signal=await page.evaluate(()=>localStorage.getItem('jpx_configApplySignal_v1'));
    await page.evaluate(()=>document.querySelector('#hvut-top span').textContent='Renamed again');
    assert.equal(await page.evaluate(()=>localStorage.getItem('jpx_configApplySignal_v1')),signal);
    assert.deepEqual(f.requests,[]);assert.deepEqual(f.errors,[]);
});

test('native AJAX equipment replacement confirms the server tuple without another focus event',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    f.setGame('2','2');
    await page.evaluate(()=>{
        const selector=document.querySelector('#persona_form select');selector.value='2';selector.dispatchEvent(new Event('change',{bubbles:true}));
        const replacement=new DOMParser().parseFromString(__fixture('2','2'),'text/html').querySelector('#eqsl');
        document.querySelector('#eqsl').replaceWith(replacement);
    });
    await page.waitForFunction(id=>__binding.state().active?.Persistent===id,b.id);
    assert.equal(f.requests.length,1);assert.equal(new URL(f.requests[0].url).searchParams.get('ss'),'eq');
    assert.equal(await page.evaluate(()=>__binding.detectionContext().personaId),'2');
    assert.equal(await page.evaluate(()=>__binding.pending()),false);assert.deepEqual(f.errors,[]);
});

test('an interrupted lookup cannot swallow the next confirmed switch',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    const release=f.hold(),started=page.waitForRequest(/ss=eq/);
    await page.evaluate(()=>{window.__oldLookup=__binding.lookup();});await started;
    f.setGame('2','2');
    await page.evaluate(()=>{
        const selector=document.querySelector('#persona_form select');selector.value='2';selector.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await page.evaluate(()=>__binding.lookup());
    assert.equal(await active(page),b.id);release();await page.evaluate(()=>window.__oldLookup);
    assert.equal(await active(page),b.id);assert.equal(f.requests.length,2);assert.deepEqual(f.errors,[]);
});

test('a confirmed switch from another tab updates local state without reapplying',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    const other=await f.context.newPage();await other.goto(page.url());
    await other.evaluate('window.__fixture = '+html.toString());await other.addScriptTag({content:harness});
    await other.evaluate(()=>__binding.init());await remember(other,'2','2');
    await page.waitForFunction(()=>__binding.confirmed()?.personaId==='2');
    assert.equal(await page.evaluate(()=>__binding.detectionContext().personaId),'2');
    assert.equal(await page.evaluate(()=>__binding.pending()),false);
    await page.evaluate(id=>__binding.apply(id),a.id);
    await other.evaluate(()=>{const key='jpx_loadouts_v1',data=JSON.parse(localStorage.getItem(key));data.personas[0].name='Renamed A';localStorage.setItem(key,JSON.stringify(data));});
    await page.waitForFunction(()=>__binding.catalog().personas[0].name==='Renamed A');
    assert.equal(await active(page),a.id);assert.deepEqual(f.requests,[]);assert.deepEqual(f.errors,[]);
});

test('cross-tab HVUT changes are coalesced and verified even while this tab stays focused',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    const other=await f.context.newPage();await other.goto(page.url());f.setGame('2','2');
    await other.evaluate(()=>{
        localStorage.setItem('hvut_persona',JSON.stringify({pset:2,eset:1}));
        localStorage.setItem('hvut_persona',JSON.stringify({pset:2,eset:2}));
    });
    await page.waitForFunction(id=>__binding.state().active?.Persistent===id,b.id);
    assert.equal(f.requests.length,1);assert.equal(await page.evaluate(()=>__binding.pending()),false);assert.deepEqual(f.errors,[]);
});

test('per-persona observed sets survive reload, while mismatched snapshots and idle repeats change nothing',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    await remember(page,'2','2');await remember(page,'1','3');
    const before=await page.evaluate(()=>__binding.catalog());
    assert.equal(before.personas.find(p=>p.id==='2').lastSetId,'2');
    assert.deepEqual(before.personas.find(p=>p.id==='2').sets.map(s=>s.id),['1','2','3']);
    await page.evaluate(()=>__binding.rememberPages(__fixture('1','3'),__fixture('2','2')));
    assert.deepEqual(await page.evaluate(()=>__binding.catalog()),before);
    const events=await page.evaluate(()=>{let count=0;const listener=()=>count++;window.addEventListener('jpx:loadout-detected',listener);for(let i=0;i<10;i++)__binding.remember('1','3');window.removeEventListener('jpx:loadout-detected',listener);return count;});
    assert.equal(events,0);
    await page.reload();await f.boot();
    assert.equal((await page.evaluate(()=>__binding.catalog())).personas.find(p=>p.id==='2').lastSetId,'2');
    assert.deepEqual(f.errors,[]);
});

test('open config list follows the applied binding and a manual override survives reload',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'Bound A'),b=await add(page,'Bound B','TwoHanded_General');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');
    await page.evaluate(()=>{__binding.init();__binding.open();});await page.locator('#tab_configManager').click();
    await page.evaluate(()=>{window.__appliedContext=null;window.addEventListener('jpx:config-library',()=>{window.__appliedContext=__binding.confirmed();},{once:true});});
    await remember(page,'2','2');
    assert.equal(await page.evaluate(()=>window.__appliedContext.personaId),'2','observers see the final persona before rendering');
    assert.equal(await page.locator('[data-config-id="'+b.id+'"]').getAttribute('data-active'),'true');
    assert.equal(await page.locator('[data-config-id="'+a.id+'"]').getAttribute('data-active'),'false');
    await page.evaluate(id=>__binding.apply(id),a.id);f.setGame('2','2');
    await page.reload();await f.boot();await page.evaluate(()=>__binding.init());
    assert.equal(await active(page),a.id);assert.deepEqual(f.errors,[]);
});

test('binding startup preserves magic stats freshly read from the live page',async t=>{
    const f=await fixture(t),{page}=f;
    const value=await page.evaluate(()=>{
        const key='jpx_spellDamageBonus:context',stats={version:1,world:'Persistent',persona:'Build A',personaId:'1'};
        localStorage.setItem(key,JSON.stringify(stats));__binding.init();return JSON.parse(localStorage.getItem(key));
    });
    assert.equal(value.personaId,'1');assert.deepEqual(f.errors,[]);
});

test('binding picker remembers each persona set and lists only its observed slots',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A');
    await remember(page,'2','3');await remember(page,'1','1');
    await page.evaluate(()=>{
        const key='jpx_loadouts_v1',data=JSON.parse(localStorage.getItem(key));
        data.personas.find(p=>p.id==='2').sets=data.personas.find(p=>p.id==='2').sets.filter(s=>s.id==='3');
        localStorage.setItem(key,JSON.stringify(data));__binding.init();__binding.open();
    });
    await page.locator('#tab_configManager').click();
    await page.locator('[data-config-id="'+a.id+'"] .jpx-config-more').click();
    await page.getByRole('button',{name:await page.evaluate(()=>__binding.label('bind')),exact:true}).click();
    await page.locator('[data-binding-persona]').selectOption('2');
    assert.equal(await page.locator('[data-binding-set]').inputValue(),'3');
    assert.deepEqual(await page.locator('[data-binding-set] option').evaluateAll(nodes=>nodes.map(n=>n.value)),['3']);
    await page.locator('[data-binding-persona]').selectOption('1');
    assert.equal(await page.locator('[data-binding-set]').inputValue(),'1');assert.deepEqual(f.errors,[]);
});

test('a failed pending switch keeps its pending state and can be retried',async t=>{
    const f=await fixture(t),{page}=f,a=await add(page,'A'),b=await add(page,'B');
    await bind(page,a.id,'1','1');await bind(page,b.id,'2','2');await page.evaluate(()=>__binding.init());
    await page.evaluate(()=>{
        const selector=document.querySelector('#persona_form select');selector.value='2';selector.dispatchEvent(new Event('change',{bubbles:true}));
        const original=Storage.prototype.setItem;
        Storage.prototype.setItem=function(key,value){if(key==='jpx_configLibrary_v1')throw Error('quota');return original.call(this,key,value);};
        try{__binding.remember('2','2');}catch{}finally{Storage.prototype.setItem=original;}
    });
    assert.equal(await page.evaluate(()=>__binding.pending()),true);assert.equal(await active(page),a.id);
    await remember(page,'2','2');assert.equal(await active(page),b.id);assert.equal(await page.evaluate(()=>__binding.pending()),false);
    assert.deepEqual(f.errors,[]);
});

for(const width of [1360,320])test('binding UI, replacement and removal fit '+width+'px with both themes',async t=>{
    const f=await fixture(t,{width,zh:true}),{page}=f,a=await add(page,'日常单手'),b=await add(page,'竞技场双手','TwoHanded_General');
    await page.evaluate(()=>{__binding.open();});
    if(width<600)await page.locator('#jpx-settings-menu-button').click();
    await page.locator('#tab_configManager').click();
    const open=async id=>{await page.locator('.jpx-config-row[data-config-id="'+id+'"] .jpx-config-more').click();await page.getByRole('button',{name:'绑定套装',exact:true}).click();};
    await open(a.id);await page.locator('[data-binding-persona]').selectOption('1');await page.locator('[data-binding-set]').selectOption('2');
    const dialog=page.locator('.jpx-config-confirm');
    for(const dark of [false,true]){
        if(dark)await page.evaluate(()=>__binding.theme());
        const geometry=await dialog.evaluate(node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,viewport:visualViewport.width,scroll:node.scrollWidth,client:node.clientWidth};});
        assert.ok(geometry.x>=-1 && geometry.x+geometry.width<=geometry.viewport+1,JSON.stringify(geometry));assert.ok(geometry.scroll<=geometry.client+1);
        const out=path.join(root,'.test-output/persona-bindings');fs.mkdirSync(out,{recursive:true});await dialog.screenshot({path:path.join(out,(width===320?'mobile':'desktop')+(dark?'-dark':'')+'.png')});
    }
    await dialog.getByRole('button',{name:'绑定套装',exact:true}).click();assert.equal((await state(page)).bindings[0].id,a.id);
    assert.match(await page.locator('.jpx-config-row[data-config-id="'+a.id+'"] .jpx-config-binding').textContent(),/Build A.*套装2/);
    await open(b.id);await page.locator('[data-binding-set]').selectOption('2');await dialog.getByRole('button',{name:'绑定套装',exact:true}).click();
    await dialog.getByRole('button',{name:'绑定套装',exact:true}).click();assert.equal((await state(page)).bindings[0].id,b.id);
    await open(b.id);await dialog.getByRole('button',{name:'解绑',exact:true}).click();await dialog.getByRole('button',{name:'关闭',exact:true}).click();
    assert.deepEqual((await state(page)).bindings,[]);assert.deepEqual(f.errors,[]);
});
