'use strict';
const backdrop = require('./backdrop.cjs');
// Real configuration UI; every request is fulfilled from the examples below.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),output=path.join(root,'docs/images');
const source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const pack=fs.readFileSync(path.join(root,'JPX-PLUS-ZhTrans.user.js'),'utf8');
const html='<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:8px;background:#edebdf;color:#5c0d11;font:12px Verdana}#csp{width:1240px;height:704px}</style><body><div id="csp"><div id="navbar"></div></div><div hidden><form id="persona_form"><select><option value="1" selected>Demo</option></select></form><div class="spc">Spell Damage Bonus</div><div><table><tr><td>20%</td><td>Fire</td></tr></table></div><div id="eqsb"><div class="eqb" onclick="location.href=\'/?equip_slot=1\'"><span>Main</span><span data-eid="101"></span></div><div class="eqb" onclick="location.href=\'/?equip_slot=2\'"><span>Off</span><span data-eid="102"></span></div></div></div></body></html>';
function boot(){
  initDoI18n();loadBattleConfig();applyJpxTheme();initJpxModeDetection();battleStyle=getDetectedJpxBattleStyle();battleType='General';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const mode=(name)=>clone(defaultCfgBattle[name]||defaultCfgBattle.OneHanded_General);
  window.__shots={open:renderSettings,theme:toggleJpxTheme,label:key=>t(key),seed(english){
    const raw={battleVersion:defaultCfgBattle.battleVersion,OneHanded_General:mode('OneHanded_General')};
    cfgBattle={};mergeCfg(clone(raw),defaultCfgBattle,cfgBattle,'battle');
    localStorage.setItem(prefix+'cfgBattle',JSON.stringify(raw));
    const lib=getJpxConfigLibrary();
    const existing=lib.readState().entries;
    for(const entry of existing)lib.save({...entry.envelope,title:english?'Everyday shield':'日常单手'},{id:entry.id});
    const values=[
      ['Tower · two-handed','双手 · 爬塔','TwoHanded_Tower','Isekai'],
      ['Item World · dual wield','双持 · 道具世界','DualWielding_Item','Persistent'],
      ['Holy mage','圣法 · 通用','Staff_General','Any'],
      ['Arena · two-handed','双手 · 竞技场','TwoHanded_Arena','Persistent']
    ];
    for(const [en,zh,key,world] of values)lib.save({schemaVersion:1,kind:'battle-mode',title:english?en:zh,description:'',world,mode:key,config:{battleVersion:defaultCfgBattle.battleVersion,[key]:mode(key)}});
    lib.save({schemaVersion:1,kind:'stats',title:english?'Compact battle stats':'简洁战斗统计',description:'',world:'Any',config:clone(defaultCfgStats)});
    return lib.readState().entries.map(entry=>({id:entry.id,title:entry.envelope.title}));
  }};
}
const harness=source.replace('\ninitDo();','\n('+boot.toString()+')();');
assert.notEqual(harness,source);
async function capture(browser,english,mobile){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1360,height:900},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce',locale:english?'en-US':'zh-CN'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:html}):route.fulfill({status:503,body:'Offline example'}));
  try{
    await page.goto('https://hentaiverse.org/');
    await backdrop.install(page);
    const definitions=[['Shield · Item World','单手 · 道具世界','OneHanded_Item','Persistent','DemoPlayer'],['Two-handed · Tower','双手 · 爬塔','TwoHanded_Tower','Isekai','DemoPlayer'],['Holy mage','圣法 · 通用','Staff_General','Any','ExampleMage'],['Arena · dual wield','双持 · 竞技场','DualWielding_Arena','Persistent','ExamplePlayer']];
    const files={},entries=definitions.map(([en,zh,mode,world,author],index)=>{
      const envelope={schemaVersion:1,kind:'battle-mode',title:english?en:zh,description:english?'Example configuration for the interface preview.':'界面预览示例配置。',world,mode,scriptVersion:'2026.11.08.1',config:{battleVersion:20251216,[mode]:{supports:[{type:'spellSupport',name:'Cure',conditions:[{key:'pHP',value:[0,.4]}]}],attacks:[{type:'normalAttack'}]}}};
      const content=JSON.stringify(envelope)+'\n',sha256=createHash('sha256').update(content).digest('hex'),id=index+101,configPath=`catalog/configs/${id}-${sha256}.json`;
      files[configPath]=content;return{id,title:envelope.title,description:envelope.description,kind:envelope.kind,world,mode,author,scriptVersion:envelope.scriptVersion,updatedAt:'2026-11-08T00:00:00Z',sha256,configPath,issueUrl:`https://github.com/MeiYongAI/JPX-PLUS-Configs/issues/${id}`};
    });
    await page.evaluate(({files,entries})=>{
      window.dynjs_equip={'101':{n:'',t:'Legendary Rapier of Slaughter'},'102':{n:'',t:'Legendary Force Shield of Protection'}};
      const gm=new Map([['jpx-config-store-auth-v1',{token:'offline_demo_only',expiresAt:Date.now()+3600000}]]);
      window.GM_getValue=(key,fallback)=>gm.has(key)?gm.get(key):fallback;
      window.GM_setValue=(key,value)=>gm.set(key,value);window.GM_deleteValue=key=>gm.delete(key);
      window.GM_xmlhttpRequest=options=>{
        let cancelled=false;
        queueMicrotask(()=>{
          if(cancelled)return;
          let response;
          if(options.url.includes('/catalog/index.json'))response={schemaVersion:1,updatedAt:'2026-11-08T00:00:00Z',entries};
          else if(options.url.endsWith('/user'))response={id:42,login:'DemoPlayer'};
          else if(options.url.includes('/issues?'))response=entries.slice(0,2).map(entry=>({number:entry.id,title:'[Config] '+entry.title,user:{id:42,login:'DemoPlayer'},state:'open',labels:[{name:'store:published'}],body:'<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n'+files[entry.configPath].trim()+'\n```',html_url:entry.issueUrl,updated_at:entry.updatedAt}));
          else if(options.url.includes('/comments?'))response=[];
          else {const file=files[options.url.split('/main/')[1]];if(file){options.onload({status:200,finalUrl:options.url,responseText:file});return;}}
          if(response!==undefined)options.onload({status:200,finalUrl:options.url,responseText:JSON.stringify(response)});else options.onerror?.({error:'Offline demo'});
        });
        return{abort(){cancelled=true;options.onabort?.();}};
      };
    },{files,entries});
    if(!english)await page.addScriptTag({content:pack});await page.addScriptTag({content:harness});
    await page.evaluate(english=>{__shots.seed(english);__shots.open();},english);
    const label=key=>page.evaluate(key=>__shots.label(key),key);
    const tab=async id=>{if(!await page.locator('#tab_'+id).isVisible())await page.locator('#jpx-settings-menu-button').click();await page.locator('#tab_'+id).click();};
    const pair=async name=>{
      for(const dark of [false,true]){
        if(dark)await page.evaluate(()=>__shots.theme());
        await page.mouse.move(1,1);await page.evaluate(()=>document.activeElement?.blur());
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const file=`${mobile?'mobile':'desktop'}-${name}${dark?'-dark':''}${english?'-en':''}.png`;
        if(name==='export')await page.screenshot({path:path.join(output,file),animations:'disabled'});
        else await page.locator('#settings-container').screenshot({path:path.join(output,file),animations:'disabled'});
      }
      await page.evaluate(()=>__shots.theme());
    };
    await tab('configManager');await page.locator('.jpx-config-row').first().waitFor();
    const applied=page.locator('[data-config-id="native-Persistent-OneHanded_General"]');
    const apply=applied.getByRole('button',{name:await label('cM.apply'),exact:true});
    if(await apply.count()){await apply.click();await applied.locator('.jpx-config-status').waitFor();}
    await applied.locator('.jpx-config-detected').waitFor();
    await tab('battle');await tab('configManager');
    // Capture the actual loadout dialog and a saved binding with offline personas.
    await page.evaluate(english=>{
      const selector=document.querySelector('#persona_form select');
      selector.options[0].textContent=english?'Daily':'日常';
      const second=document.createElement('option');second.value='2';second.textContent=english?'Mage':'法师';selector.append(second);
      const sets=document.createElement('div');sets.id='eqsl';
      for(const id of ['1','2','3']){const img=document.createElement('img');img.src='/y/set'+id+'_'+(id==='1'?'on':'off')+'.png';sets.append(img);}
      selector.closest('form').after(sets);
    },english);
    const openBinding=async()=>{await applied.locator('.jpx-config-more').click();await page.locator('.jpx-config-menu').getByRole('button',{name:await label('cM.bind'),exact:true}).click();await page.locator('.jpx-config-confirm').waitFor();};
    await openBinding();await page.locator('[data-binding-set]').selectOption('2');
    await page.locator('.jpx-config-confirm').getByRole('button',{name:await label('cM.bind'),exact:true}).click();
    await applied.locator('.jpx-config-binding').waitFor();
    await tab('battle');await tab('configManager');await pair('configs');
    await openBinding();await page.locator('[data-binding-persona]').selectOption('2');await page.locator('[data-binding-set]').selectOption('3');
    await pair('bindings');
    await page.locator('.jpx-config-confirm').getByRole('button',{name:await label('cM.close'),exact:true}).click();
    await page.locator('[data-config-sort]').selectOption('manual');await pair('order');
    await page.locator('[data-config-sort]').selectOption('type');
    const current=page.locator('[data-config-id="native-Persistent-OneHanded_General"]');
    await current.getByRole('button',{name:await label('cM.edit'),exact:true}).click();
    await page.locator('.jpx-config-editor').waitFor();
    const cure=page.locator('#jpx-rule-panel-supports .jpx-rule-item').filter({hasText:english?'Cure':'治疗'}).first();
    if(await cure.count())await cure.locator(':scope > summary').click();
    await pair('rules');
    await page.locator(mobile?'#close-button':'.jpx-config-back').click();
    await page.locator('.jpx-config-nav').getByRole('button',{name:await label('cM.store'),exact:true}).click();
    await page.locator('.jpx-store-row').first().waitFor();await pair('store');
    await page.getByRole('button',{name:await label('cStore.shared'),exact:true}).click();
    await page.locator('[data-shared-id]').first().waitFor();await pair('shared');
    await tab('battle');await page.locator('#export-button').click();await page.locator('#jpx-battle-export').waitFor();await pair('export');
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({language:english?'en':'zh-CN',device:mobile?'mobile':'desktop',scenes:7,themes:2,errors}));
  }finally{await context.close();}
}
(async()=>{fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});try{for(const english of [true,false])for(const mobile of [false,true])await capture(browser,english,mobile);}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
