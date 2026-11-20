'use strict';
const installed = chrome.runtime.getManifest().version;
const feed = 'https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/extensions/hv-zh-cn/manifest.json';
const alarm = 'hv-check-version';
const interval = 12 * 60;
let checking;
function compare(a, b) {
    const x = a.split('.').map(Number), y = b.split('.').map(Number);
    for (let i=0; i<4; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0);
    return 0;
}
async function check() {
    const result = {checked: Date.now()};
    try {
        const r = await fetch(feed, {cache:'no-store', credentials:'omit', signal:AbortSignal.timeout(12000)});
        if (!r.ok) throw Error();
        const {version} = await r.json();
        if (typeof version !== 'string' || !/^\d{1,5}(\.\d{1,5}){0,3}$/.test(version) || version.split('.').some(n => +n > 65535)) throw Error();
        result.latest = version;
        result.available = compare(version, installed) > 0;
        await chrome.action.setBadgeText({text:result.available ? 'NEW' : ''});
    } catch {
        result.failed = true;
        await chrome.action.setBadgeText({text:''});
    }
    await chrome.storage.local.set({result});
}
function checkOnce() { return checking ||= check().finally(() => { checking = null; }); }
async function schedule() {
    const {automatic, result} = await chrome.storage.local.get(['automatic','result']);
    if (automatic === false) { await chrome.alarms.clear(alarm); return; }
    if (!await chrome.alarms.get(alarm)) await chrome.alarms.create(alarm, {periodInMinutes:interval});
    if (!result || Date.now() - result.checked >= interval * 60000) await checkOnce();
}
chrome.runtime.onInstalled.addListener(async () => { await chrome.storage.local.remove('result'); await chrome.action.setBadgeText({text:''}); await schedule(); });
chrome.runtime.onStartup.addListener(schedule);
chrome.alarms.onAlarm.addListener(async a => { if (a.name === alarm && (await chrome.storage.local.get('automatic')).automatic !== false) await checkOnce(); });
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes.automatic) schedule(); });
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (sender.url !== chrome.runtime.getURL('popup.html') || msg !== 'check') return;
    checkOnce().then(() => reply(true), () => reply(false));
    return true;
});
