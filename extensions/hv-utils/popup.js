'use strict';
const $ = id => document.getElementById(id);
const meta = chrome.runtime.getManifest();
$('version').textContent = 'v' + meta.version;
async function render() {
    const {automatic, result} = await chrome.storage.local.get(['automatic','result']);
    $('automatic').checked = automatic !== false;
    $('automatic').disabled = false;
    $('status').textContent = !result ? '尚未检查' : result.failed ? '检查失败，可稍后重试' : result.available ? `发现新版 v${result.latest}` : result.latest === meta.version ? '已是最新版本' : '本地版本较新';
    $('checked').textContent = result ? '上次检查 ' + new Date(result.checked).toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}) : '可手动检查新版本';
    $('release').hidden = !result?.available;
    if (result?.available) $('download').href = `https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/extensions/hv-utils-${result.latest}.zip`;
    else $('download').removeAttribute('href');
}
$('automatic').onchange = () => chrome.storage.local.set({automatic:$('automatic').checked});
$('check').onclick = async () => {
    $('check').disabled = true; $('check').textContent = '检查中…';
    try { if (!await chrome.runtime.sendMessage('check')) throw Error(); await render(); }
    catch { $('status').textContent = '检查失败，可稍后重试'; }
    finally { $('check').disabled = false; $('check').textContent = '检查更新'; }
};
chrome.storage.onChanged.addListener(render);
render();

async function gameSettings(open = false) {
    const button = $('gameSettings'); button.disabled = true;
    try {
        const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
        const ready = await chrome.tabs.sendMessage(tab.id, open ? 'open-settings' : 'can-open-settings', {frameId:0});
        if (!ready) throw Error();
        if (open) { window.close(); return; }
        $('gameHint').textContent = '在当前游戏页调整菜单、装备和通知。';
        button.disabled = false;
    } catch { $('gameHint').textContent = '请切到已加载 HVUT 的游戏大厅后再打开面板。'; }
}
$('gameSettings').onclick = () => gameSettings(true);
gameSettings();
