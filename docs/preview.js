'use strict';
(() => {
  const scenes = {
    settings: {title:'基本设置', description:'战斗操作、显示选项和控制面板配色，集中设置。', desktop:['desktop-settings-light','desktop-settings-dark'], mobile:['mobile-settings','mobile-settings-dark']},
    rules: {title:'战斗规则', description:'按流派设置辅助与攻击规则，展开查看触发条件。', desktop:['desktop-rules','desktop-rules-dark']},
    keybindings: {title:'按键绑定', description:'为常用操作设置快捷键。', desktop:['desktop-keybindings','desktop-keybindings-dark']},
    colors: {title:'统计配色', description:'设置颜色分段，输入示例数值即可检查显示效果。', desktop:['desktop-stats-settings','desktop-stats-settings-dark']},
    records: {title:'战斗统计', description:'按世界、类型与结果筛选，汇总收益并查看历史记录。', desktop:['desktop-records','desktop-records-dark'], mobile:['mobile-records','mobile-records-dark']},
    detail: {title:'单场明细', description:'伤害、已使用技能与道具、装备掉落和收益一览。', desktop:['desktop-detail','desktop-detail-dark'], mobile:['mobile-detail','mobile-detail-dark']},
    final: {title:'战斗结算', description:'战斗结束后直接查看本场统计，保留结算页面。', desktop:['desktop-final','desktop-final-dark']},
    panel: {title:'悬浮面板', description:'自动、手动、等待三种状态；拖动标题栏调整位置。', desktop:['control-panel','control-panel-dark']}
  };
  const englishScenes = {settings:['Basic settings','Battle controls, display options, and panel colors in one place.'],rules:['Battle rules','Configure support and attack rules for each combat style. Expand a rule to see its conditions.'],keybindings:['Key bindings','Choose keyboard shortcuts for common actions.'],colors:['Statistics colors','Set color ranges and enter a sample value to preview the result.'],records:['Battle statistics','Filter by world, battle type, and result. Review history and total earnings.'],detail:['Battle details','Damage, skills and items used, equipment drops, and earnings at a glance.'],final:['Battle results','Review statistics after a battle while keeping the settlement page open.'],panel:['Floating panel','Automatic, manual, and waiting states. Drag the title bar to reposition.']};
  const copy = {
    en:{authorThanks:'Special thanks to JPX author ',authorFoundation:'. Without his work, JPX-PLUS would not exist.',headline:'Your battles. A clearer view.',intro:'Explore battle rules, statistics, and a more comfortable interface on desktop and mobile.',install:'Install script',gallery:'Interactive interface preview',device:'Device',desktop:'Desktop',mobile:'Mobile',theme:'Theme',light:'Light',dark:'Dark',language:'Language',pages:'Preview page',original:'Open full image',imageError:'The image could not be loaded.',retry:'Open the original image',disclaimer:'Actual script interfaces with offline sample data. The settlement image shows only the statistics area.',staticGallery:'Gallery on GitHub',feedback:'Report an issue',panelNote:'Default panel colors follow the theme; custom colors are preserved.',finalNote:'The theme applies to the statistics area. The original game background stays unchanged.',themeNote:'Switch themes without changing the page or sample data.',shown:'Showing ',title:'JPX-PLUS · Interface preview'},
    'zh-CN':{authorThanks:'特别感谢 JPX 原作者 ',authorFoundation:'，没有他的工作，就不会有今天的 JPX-PLUS。',headline:'熟悉的战斗，更顺手的界面。',intro:'从规则配置到战斗统计，看看 JPX-PLUS 在桌面和手机上的样子。',install:'安装脚本',gallery:'交互式界面预览',device:'设备',desktop:'桌面',mobile:'手机',theme:'截图主题',light:'浅色',dark:'暗色',language:'语言',pages:'预览页面',original:'查看原图',imageError:'图片暂时未加载。',retry:'打开原图',disclaimer:'截图来自当前脚本的真实界面，使用离线示例数据；结算图仅展示统计区域。',staticGallery:'在仓库查看图集',feedback:'反馈问题',panelNote:'控制面板默认配色随主题切换，自定义配色保留。',finalNote:'主题切换作用于统计区域，游戏原生页面的背景保持原样。',themeNote:'切换主题会保留当前页面与示例数据。',shown:'已显示',title:'JPX-PLUS · 界面预览'}
  };
  const params = new URLSearchParams(location.search);
  const normalizeLanguage = value => /^zh(?:-|$)/i.test(value || '') ? 'zh-CN' : /^en(?:-|$)/i.test(value || '') ? 'en' : null;
  let savedLanguage;try{savedLanguage=localStorage.getItem('jpx-preview-language');}catch{}
  let language=normalizeLanguage(params.get('lang'))||normalizeLanguage(savedLanguage)||normalizeLanguage(navigator.languages?.[0]||navigator.language)||'en';
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = ['light','dark'].includes(params.get('theme')) ? params.get('theme') : systemDark ? 'dark' : 'light';
  let device = params.get('device') === 'mobile' ? 'mobile' : 'desktop';
  let scene = Object.hasOwn(scenes,params.get('page')) ? params.get('page') : 'settings';
  if (!scenes[scene][device]) scene='settings';
  const image=document.getElementById('preview'), stage=document.getElementById('stage'), nav=document.getElementById('scenes');
  const error=document.getElementById('image-error');
  let revision=0;
  async function render(updateUrl=true) {
    const current=++revision, entry=scenes[scene], words=copy[language];
    const title=language==='en'?englishScenes[scene][0]:entry.title;
    const description=language==='en'?englishScenes[scene][1]:entry.description;
    const src='images/'+entry[device][theme==='dark'?1:0]+(language==='en'?'-en':'')+'.png';
    document.documentElement.dataset.theme=theme;
    document.documentElement.lang=language;document.title=words.title;
    document.querySelectorAll('[data-i18n]').forEach(node=>{node.textContent=words[node.dataset.i18n];});
    document.querySelectorAll('[data-i18n-aria]').forEach(node=>{node.setAttribute('aria-label',words[node.dataset.i18nAria]);});
    document.querySelectorAll('button[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===language)));
    document.querySelectorAll('[data-theme]').forEach(button=>{if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.theme===theme));});
    document.querySelectorAll('button[data-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.device===device)));
    if(nav.dataset.device!==device) {
      nav.replaceChildren(...Object.entries(scenes).filter(([,value])=>value[device]).map(([key,value])=>{const button=document.createElement('button');button.type='button';button.textContent=value.title;button.dataset.scene=key;return button;}));
      nav.dataset.device=device;
    }
    nav.querySelectorAll('button').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.scene===scene));button.textContent=language==='en'?englishScenes[button.dataset.scene][0]:scenes[button.dataset.scene].title;});
    document.getElementById('scene-title').textContent=title;
    document.getElementById('scene-description').textContent=description;
    document.getElementById('full-image').href=src;
    document.getElementById('retry-image').href=src;
    document.getElementById('static-preview').href='https://github.com/MeiYongAI/JPX-PLUS/blob/main/docs/gallery-'+theme+(language==='zh-CN'?'.zh-CN':'')+'.md';
    document.getElementById('theme-note').textContent=words[scene==='panel'?'panelNote':scene==='final'?'finalNote':'themeNote'];
    stage.setAttribute('aria-busy','true');error.hidden=true;image.hidden=false;
    const next=new Image();next.src=src;
    try {
      await next.decode();
      if(current!==revision)return;
      stage.dataset.device=device;stage.dataset.scene=scene;
      image.width=next.naturalWidth;image.height=next.naturalHeight;
      image.src=src;image.alt=title+' · '+words[device]+' · '+words[theme];
      document.getElementById('status').textContent=words.shown+image.alt;
    } catch {if(current!==revision)return;error.hidden=false;image.hidden=true;}
    stage.setAttribute('aria-busy','false');
    if(updateUrl) {const url=new URL(location.href);url.search=new URLSearchParams({lang:language,theme,device,page:scene});history.replaceState(null,'',url);}
  }
  document.querySelectorAll('button[data-theme]').forEach(button=>button.addEventListener('click',()=>{theme=button.dataset.theme;render();}));
  document.querySelectorAll('button[data-device]').forEach(button=>button.addEventListener('click',()=>{device=button.dataset.device;if(!scenes[scene][device])scene='settings';render();}));
  document.querySelectorAll('button[data-language]').forEach(button=>button.addEventListener('click',()=>{language=button.dataset.language;try{localStorage.setItem('jpx-preview-language',language);}catch{}render();}));
  nav.addEventListener('click',event=>{const button=event.target.closest('button[data-scene]');if(button){scene=button.dataset.scene;render();}});
  render(false);
})();
