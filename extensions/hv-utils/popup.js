'use strict';
const $ = id => document.getElementById(id);
const version = chrome.runtime.getManifest().version;
$('version').textContent = 'v' + version;
$('version').setAttribute('aria-label', `v${version}，打开 GitHub 仓库`);
function showSettings(open) {
    $('home').hidden = open; $('preferences').hidden = !open;
    $('saved').textContent = ''; $(open ? 'back' : 'settings').focus();
}
$('settings').onclick = () => showSettings(true);
$('back').onclick = () => showSettings(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('preferences').hidden) { e.preventDefault(); showSettings(false); } });
async function render() {
    const {automatic, intervalHours = 12, result} = await chrome.storage.local.get(['automatic','intervalHours','result']);
    $('interval').value = automatic === false ? '0' : String(intervalHours);
    $('interval').disabled = false;
    $('latest').textContent = result?.latest ? 'v' + result.latest : '—';
    $('checked').textContent = result ? new Date(result.checked).toLocaleString('zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}) : '尚未检查';
    $('status').textContent = !result ? '尚未检查' : result.failed ? '检查失败，可重试' : result.available ? '有新版本' : result.latest === version ? '已是最新版本' : '本地版本较新';
    $('download').hidden = !result?.available; $('check').hidden = !!result?.available;
    if (result?.available) $('download').href = `https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/extensions/hv-utils-${result.latest}.zip`;
    else $('download').removeAttribute('href');
}
$('interval').onchange = async () => {
    const hours = Number($('interval').value);
    try { await chrome.storage.local.set(hours ? {automatic:true,intervalHours:hours} : {automatic:false}); $('saved').textContent = '已保存'; }
    catch { await render(); $('saved').textContent = '未能保存，请重试'; }
};
$('check').onclick = async () => {
    $('check').disabled = true; $('check').textContent = '检查中…';
    try { if (!await chrome.runtime.sendMessage('check')) throw Error(); await render(); }
    catch { $('status').textContent = '检查失败，可重试'; }
    finally { $('check').disabled = false; $('check').textContent = '检查更新'; }
};
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.automatic || changes.intervalHours || changes.result)) render(); });
render();
