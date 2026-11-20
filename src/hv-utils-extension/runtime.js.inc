// Start an isolated content script with synchronous GM-style reads and real
// extension storage shared across game origins. Page JS never receives the data.
(() => {
const params = new URLSearchParams(location.search);
const gameHost = location.hostname !== 'e-hentai.org';
const pending = 'data-hvut-armory-pending';
let timeout;
function releaseArmory() {
  if (!document.documentElement?.hasAttribute(pending)) return;
  clearTimeout(timeout);
  document.documentElement.removeAttribute(pending);
  document.dispatchEvent(new Event('hvut:armory-ready'));
}
if (gameHost && params.get('s') === 'Bazaar' && params.get('ss') === 'am') {
  // document_start: mark the route before the streaming parser creates the native list.
  document.documentElement.setAttribute(pending, '');
  timeout = setTimeout(releaseArmory, 2000); // slow/broken page: restore native UI
}
(async () => {
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.url !== chrome.runtime.getURL('popup.html') || !['can-open-settings','open-settings'].includes(message)) return;
  const icon = document.getElementById('hvut-top-config-icon');
  if (icon && message === 'open-settings' && !document.querySelector('.hvut-cfg-div')) icon.click();
  reply(!!icon);
});
const storage = chrome.storage.local;
const cache = Object.create(null);
// Don't deserialize monster/shrine histories and the armory DB on every battle round.
const prefix = location.pathname.includes('/isekai/') ? 'hvuti_' : 'hvut_';
const heavy = ['ml_log', 'ss_log', 'equipdata'];
const keys = new Set(['hvut_re', 'hvut_lt_notif', 'hvut_tr_notif', ...[
  'settings', 'prices', 'equipset', 'ch_style', 'persona', 'tr_level', 'se_settings', 'ml_plc', 'mm_userlist'
].map(key => prefix + key)]);
const ss = params.get('ss');
const history = {ml:'ml_log', ss:'ss_log', am:'equipdata', mm:'equipdata'}[ss];
if (history && heavy.includes(history)) keys.add(prefix + history);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [key, change] of Object.entries(changes)) {
    if (!keys.has(key)) continue;
    if ('newValue' in change) cache[key] = change.newValue;
    else delete cache[key];
  }
});
Object.assign(cache, await storage.get([...keys]));
// Only an older extension schema needs all records for the upstream migration.
if (cache[prefix + 'settings']?.version && cache[prefix + 'settings'].version !== 4.24)
  Object.assign(cache, await storage.get(heavy.map(key => prefix + key)));
// Prefetch in parallel with the parser, but upstream code needs the complete DOM.
if (document.readyState === 'loading')
  await new Promise(done => document.addEventListener('DOMContentLoaded', done, {once:true}));
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
