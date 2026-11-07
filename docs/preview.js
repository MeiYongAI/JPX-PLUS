'use strict';
(() => {
  const scenes = {
    settings: { en: 'Basic settings', zh: '基本设置', desktop: ['desktop-settings-light', 'desktop-settings-dark'], mobile: ['mobile-settings', 'mobile-settings-dark'] },
    rules: { en: 'Battle rules', zh: '战斗规则', desktop: ['desktop-rules', 'desktop-rules-dark'] },
    keybindings: { en: 'Key bindings', zh: '按键绑定', desktop: ['desktop-keybindings', 'desktop-keybindings-dark'] },
    colors: { en: 'Statistics colors', zh: '统计配色', desktop: ['desktop-stats-settings', 'desktop-stats-settings-dark'] },
    store: { en: 'Config Store', zh: '配置商店', desktop: ['desktop-store', 'desktop-store-dark'], mobile: ['mobile-store', 'mobile-store-dark'], break: true },
    backpack: { en: 'Config backpack', zh: '配置背包', desktop: ['desktop-backpack', 'desktop-backpack-dark'], mobile: ['mobile-backpack', 'mobile-backpack-dark'] },
    records: { en: 'Battle statistics', zh: '战斗统计', desktop: ['desktop-records', 'desktop-records-dark'], mobile: ['mobile-records', 'mobile-records-dark'], break: true },
    detail: { en: 'Battle details', zh: '单场明细', desktop: ['desktop-detail', 'desktop-detail-dark'], mobile: ['mobile-detail', 'mobile-detail-dark'] },
    final: { en: 'Battle results', zh: '战斗结算', desktop: ['desktop-final', 'desktop-final-dark'] },
    panel: { en: 'Floating panel', zh: '悬浮面板', desktop: ['control-panel', 'control-panel-dark'] }
  };
  const copy = {
    en: { install: 'Install script', installStore: 'Config Store', languagePacks: 'Language packs', languagePackHint: 'Enable one pack, then refresh. English needs no pack.', gallery: 'Interface preview', device: 'Device', desktop: 'Desktop', mobile: 'Mobile', theme: 'Theme', light: 'Light', dark: 'Dark', language: 'Language', pages: 'Preview page', original: 'Full size', imageError: 'The image could not be loaded.', retry: 'Try again', staticGallery: 'Gallery', feedback: 'Feedback', about: 'About', authorThanks: 'Original JPX by ', skip: 'Skip to preview', title: 'JPX-PLUS · Interface preview', shown: 'Showing: ', disclaimer: 'Actual script interfaces with offline demo data. The results image shows the statistics area.', storeNote: 'Config Store is optional. Sharing requires GitHub sign-in. Submitted configs and descriptions are public and sent for AI review.', backpackNote: 'Backpack copies stay in local storage. Saving does not apply a config; applying uses the import, undo, and manual Save controls.', panelNote: 'Default panel colors follow the theme; custom colors are preserved.', finalNote: 'The theme applies to the statistics area. The original game background stays unchanged.' },
    'zh-CN': { install: '安装脚本', installStore: '配置商店', languagePacks: '语言包', languagePackHint: '一次启用一个语言包，再刷新。英语无需语言包。', gallery: '界面预览', device: '设备', desktop: '桌面', mobile: '手机', theme: '主题', light: '浅色', dark: '暗色', language: '语言', pages: '预览页面', original: '查看原图', imageError: '图片暂时未加载。', retry: '重新加载', staticGallery: '图集', feedback: '反馈', about: '预览说明', authorThanks: '感谢 JPX 原作者 ', skip: '跳至预览', title: 'JPX-PLUS · 界面预览', shown: '已显示：', disclaimer: '截图来自脚本真实界面，使用离线演示数据。结算图仅展示统计区域。', storeNote: '配置商店是独立可选插件。分享需登录 GitHub；提交的配置与说明会公开并交由 AI 审阅。', backpackNote: '背包保存在本地，存入不会自动应用；应用时沿用导入、撤销和手动保存。', panelNote: '面板默认配色随主题切换，自定义配色保留。', finalNote: '主题作用于统计区域，游戏原生背景保持原样。' }
  };
  const params = new URLSearchParams(location.search);
  const normalizeLanguage = value => /^zh(?:-|$)/i.test(value || '') ? 'zh-CN' : /^en(?:-|$)/i.test(value || '') ? 'en' : null;
  let savedLanguage;
  try { savedLanguage = localStorage.getItem('jpx-preview-language'); } catch {}
  let language = normalizeLanguage(params.get('lang')) || normalizeLanguage(savedLanguage) || normalizeLanguage(navigator.languages?.[0] || navigator.language) || 'en';
  let theme = ['light', 'dark'].includes(params.get('theme')) ? params.get('theme') : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let device = params.get('device') === 'mobile' ? 'mobile' : 'desktop';
  let scene = Object.hasOwn(scenes, params.get('page')) ? params.get('page') : 'settings';
  if (!scenes[scene][device]) scene = 'settings';
  const image = document.getElementById('preview');
  const stage = document.getElementById('stage');
  const nav = document.getElementById('scenes');
  const select = document.getElementById('scene-select');
  const pane = document.getElementById('preview-pane');
  const error = document.getElementById('image-error');
  const packs = document.getElementById('language-packs');
  let revision = 0;
  const sceneTitle = key => scenes[key][language === 'en' ? 'en' : 'zh'];
  function renderNavigation() {
    if (nav.dataset.device !== device) {
      nav.replaceChildren();
      select.replaceChildren();
      Object.entries(scenes).filter(([, entry]) => entry[device]).forEach(([key, entry]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'scene-' + key;
        button.dataset.scene = key;
        if (entry.break) button.dataset.break = 'true';
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', 'preview-pane');
        nav.append(button);
        const option = document.createElement('option');
        option.value = key;
        select.append(option);
      });
      nav.dataset.device = device;
    }
    nav.querySelectorAll('button').forEach(button => {
      const selected = button.dataset.scene === scene;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.textContent = sceneTitle(button.dataset.scene);
    });
    Array.from(select.options).forEach(option => { option.textContent = sceneTitle(option.value); });
    select.value = scene;
    pane.setAttribute('aria-labelledby', 'scene-title');
  }
  async function render(updateUrl = true) {
    const current = ++revision;
    const words = copy[language];
    const title = sceneTitle(scene);
    const src = 'images/' + scenes[scene][device][theme === 'dark' ? 1 : 0] + (language === 'en' ? '-en' : '') + '.png';
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.title = words.title;
    document.querySelector('meta[name=theme-color]').content = theme === 'dark' ? '#202226' : '#e3e0d1';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = words[node.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', words[node.dataset.i18nAria]); });
    for (const [key, value] of Object.entries({ language, theme, device })) {
      document.querySelectorAll('button[data-' + key + ']').forEach(button => { button.setAttribute('aria-pressed', String(button.dataset[key] === value)); });
    }
    renderNavigation();
    document.getElementById('scene-title').textContent = title;
    document.getElementById('full-image').href = src;
    document.getElementById('static-preview').href = 'https://github.com/MeiYongAI/JPX-PLUS/blob/main/docs/gallery-' + theme + (language === 'zh-CN' ? '.zh-CN' : '') + '.md';
    document.getElementById('scene-note').textContent = words[({ store: 'storeNote', backpack: 'backpackNote', panel: 'panelNote', final: 'finalNote' })[scene]] || '';
    if (updateUrl) {
      const url = new URL(location.href);
      url.search = new URLSearchParams({ lang: language, theme, device, page: scene });
      history.replaceState(null, '', url);
    }
    stage.setAttribute('aria-busy', 'true');
    error.hidden = true;
    image.hidden = false;
    const next = new Image();
    next.src = src;
    try {
      await next.decode();
      if (current !== revision) return;
      stage.dataset.device = device;
      stage.dataset.scene = scene;
      image.width = next.naturalWidth;
      image.height = next.naturalHeight;
      image.src = src;
      image.alt = title + ' · ' + words[device] + ' · ' + words[theme];
      document.getElementById('status').textContent = words.shown + image.alt;
    } catch {
      if (current !== revision) return;
      error.hidden = false;
      image.hidden = true;
      document.getElementById('status').textContent = words.imageError;
    }
    stage.setAttribute('aria-busy', 'false');
  }
  document.querySelectorAll('button[data-theme]').forEach(button => button.addEventListener('click', () => { theme = button.dataset.theme; render(); }));
  document.querySelectorAll('button[data-device]').forEach(button => button.addEventListener('click', () => { device = button.dataset.device; if (!scenes[scene][device]) scene = 'settings'; render(); }));
  document.querySelectorAll('button[data-language]').forEach(button => button.addEventListener('click', () => { language = button.dataset.language; try { localStorage.setItem('jpx-preview-language', language); } catch {} render(); }));
  nav.addEventListener('click', event => { const button = event.target.closest('button[data-scene]'); if (button) { scene = button.dataset.scene; render(); } });
  nav.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const buttons = Array.from(nav.querySelectorAll('button'));
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    scene = buttons[nextIndex].dataset.scene;
    render();
    buttons[nextIndex].focus();
  });
  select.addEventListener('change', () => { scene = select.value; render(); });
  document.getElementById('retry-image').addEventListener('click', () => render());
  document.addEventListener('click', event => { if (packs.open && !packs.contains(event.target)) packs.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && packs.open) { packs.open = false; packs.querySelector('summary').focus(); } });
  render(false);
})();
