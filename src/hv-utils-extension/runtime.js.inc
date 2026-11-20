// Start an isolated content script with synchronous GM-style reads and real
// extension storage shared across game origins. Page JS never receives the data.
(() => {
const params = new URLSearchParams(location.search);
const gameHost = location.hostname !== 'e-hentai.org';
const armory = gameHost && params.get('s') === 'Bazaar' && params.get('ss') === 'am';
const armoryPending = 'data-hvut-armory-pending'; // translation ordering only; no visual rules
if (armory) document.documentElement.setAttribute(armoryPending, '');
function finishStartup() {
  finishMenu();
  if (!armory) return;
  document.documentElement.removeAttribute(armoryPending);
  document.dispatchEvent(new Event('hvut:armory-ready'));
}
// Resolve on the parser mutation that supplies the consumer's inputs. If the
// document has a different layout, let the normal document-end path inspect it.
function parsed(ready) {
  if (document.readyState !== 'loading' || ready?.()) return;
  return new Promise(resolve => {
    const done = () => {
      observer?.disconnect();
      document.removeEventListener('DOMContentLoaded', done);
      resolve();
    };
    const observer = ready && new MutationObserver(records => {
      if (records.some(r => !document.head?.contains(r.target)) && ready()) done();
    });
    observer?.observe(document, {childList:true, subtree:true});
    document.addEventListener('DOMContentLoaded', done, {once:true});
  });
}
// Declare the actual first-render dependency in the head, before the browser
// starts laying out the body. Battles and riddles do not use this menu.
let menuLink;
let menuResolved = false;
function finishMenu() { menuResolved = true; menuLink?.remove(); }
if (gameHost && document.referrer && new URL(document.referrer).origin === location.origin &&
    !(params.get('s') === 'Battle' && params.get('ss') === 'ba')) {
  parsed(() => {
    if (menuResolved) return true;
    if (!document.head) return false;
    menuLink = document.createElement('link');
    menuLink.rel = 'expect'; menuLink.setAttribute('blocking','render'); menuLink.href = '#hvut-top';
    document.head.append(menuLink);
    return true;
  });
  parsed(() => {
    if (document.getElementById('navbar')) return true;
    if (document.getElementById('battle_top') || document.getElementById('riddleform')) { finishMenu(); return true; }
  });
}
(async () => {
const storage = chrome.storage.local;
const cache = Object.create(null);
// Don't deserialize monster/shrine histories and the armory DB on every battle round.
const prefix = location.pathname.includes('/isekai/') ? 'hvuti_' : 'hvut_';
const {s, ss, screen, filter, hvut} = Object.fromEntries(params);
const keys = new Set(['hvut_re', 'hvut_lt_notif', 'hvut_tr_notif', ...[
  'settings', 'prices', 'equipset', 'ch_style', 'persona', 'tr_level'
].map(key => prefix + key)]);
if (s === 'Character' && ss === 'se') keys.add(prefix + 'se_settings');
if (s === 'Bazaar') {
  if (ss === 'ml') { keys.add(prefix + 'ml_log'); keys.add(prefix + 'ml_plc'); }
  if (ss === 'ss') keys.add(prefix + 'ss_log');
  if (ss === 'am' && screen === 'organize') keys.add(prefix + 'equipdata');
  if (ss === 'mm' && filter === 'new' && hvut !== 'disabled') {
    keys.add(prefix + 'equipdata');
    keys.add(prefix + 'mm_userlist');
  }
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [key, change] of Object.entries(changes)) {
    if (!keys.has(key)) continue;
    if ('newValue' in change) cache[key] = change.newValue;
    else delete cache[key];
  }
});
Object.assign(cache, await storage.get([...keys]));
// The legacy migration also reads both histories regardless of the active page.
if (cache[prefix + 'settings']?.version && cache[prefix + 'settings'].version !== 4.24) {
  const missing = ['ml_log', 'ss_log'].map(key => prefix + key).filter(key => !keys.has(key));
  Object.assign(cache, await storage.get(missing));
}
// The menu needs the player's readouts, not the rest of the game panel.
await parsed(gameHost ? () => document.getElementById('navbar')?.nextElementSibling &&
  / Lv\.\d+/.test(document.getElementById('level_readout')?.textContent) &&
  document.querySelector('#stamina_readout > div:nth-child(2)') &&
  document.querySelector('#stamina_readout img[title^="Stamina"]') &&
  /Stamina: \d+/.test(document.getElementById('stamina_readout').textContent) : null);
const GM_getValue = (key, fallback) => Object.hasOwn(cache, key) ? structuredClone(cache[key]) : fallback;
const GM_setValue = (key, value) => { cache[key] = structuredClone(value); return storage.set({[key]: value}); };
const GM_deleteValue = key => { delete cache[key]; return storage.remove(key); };
function GM_addStyle(css) {
  const style = document.createElement('style'); style.textContent = css; document.head.append(style); return style;
}
async function GM_xmlhttpRequest({method, url, headers, data, onload, onerror, context}) {
  const target = new URL(url, document.baseURI);
  let response;
  try {
    if (target.origin === location.origin) {
      const r = await fetch(target, { method, headers, body: data || undefined, credentials: 'same-origin' });
      response = {status: r.status, statusText: r.statusText, finalUrl: r.url, responseText: await r.text()};
    } else {
      const read = target.href === 'https://hentaiverse.org/' ? 'lobby' : target.href === 'https://e-hentai.org/news.php' ? 'news' : null;
      if (method !== 'GET' || !read) throw Error('Unsupported cross-origin HVUT request');
      response = await chrome.runtime.sendMessage({read});
    }
  } catch (e) { response = {status: 0, statusText: e.message, finalUrl: target.href}; }
  (response.status ? onload : onerror)({...response, context});
}
function game(op, arg) {
  const el = document.createElement('meta');
  el.setAttribute('data-request', JSON.stringify([op, arg]));
  document.head.append(el);
  try {
    el.dispatchEvent(new Event('hvut:game', {bubbles:true}));
    if (!el.hasAttribute('data-result')) throw Error(`HV Utils: game operation failed: ${op}`);
    return JSON.parse(el.getAttribute('data-result'));
  } finally { el.remove(); }
}
// The upstream filter replaces names and $-terms before reaching this step.
// Evaluate its remaining boolean/numeric grammar without JavaScript eval in MV3.
function filterValue(expr) {
  const tokens = expr.match(/true|false|\d+(?:\.\d+)?|!==|===|!=|==|<=|>=|&&|\|\||[!()<>]|[^\s]/g) || [];
  let i = 0;
  const take = t => tokens[i] === t && (++i, true);
  function atom() {
    if (take('!')) return !atom();
    if (take('(')) { const v = or(); if (!take(')')) throw Error('Invalid Filter'); return v; }
    if (take('true')) return true;
    if (take('false')) return false;
    if (/^\d+(?:\.\d+)?$/.test(tokens[i])) return Number(tokens[i++]);
    throw Error('Invalid Filter');
  }
  function comparison() {
    const a = atom(), op = tokens[i];
    if (!['<','>','<=','>=','==','!=','===','!=='].includes(op)) return a;
    i++; const b = atom();
    switch (op) { case '<': return a<b; case '>': return a>b; case '<=': return a<=b; case '>=': return a>=b;
      case '==': return a==b; case '!=': return a!=b; case '===': return a===b; case '!==': return a!==b; }
  }
  function and() { let v = comparison(); while (take('&&')) { const next = comparison(); v = v && next; } return v; }
  function or() { let v = and(); while (take('||')) { const next = and(); v = v || next; } return v; }
  const result = or(); if (i !== tokens.length) throw Error('Invalid Filter'); return result;
}
