'use strict';
const $ = id => document.getElementById(id);
const meta = chrome.runtime.getManifest();
$('version').textContent = 'v' + meta.version;
$('pack').textContent = meta.version_name.split(' · ')[1].replace('汉化 ', '词库版本：');
async function render() {
    const {automatic, result} = await chrome.storage.local.get(['automatic','result']);
    $('automatic').checked = automatic !== false;
    $('automatic').disabled = false;
    $('status').textContent = !result ? '尚未检查' : result.failed ? '检查失败，可稍后重试' : result.available ? `发现新版 v${result.latest}` : result.latest === meta.version ? '已是最新版本' : '本地版本较新';
    $('checked').textContent = result ? '上次检查 ' + new Date(result.checked).toLocaleString('zh-CN', {month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}) : '可手动检查新版本';
    $('release').hidden = !result?.available;
    if (result?.available) $('download').href = `https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/extensions/hv-zh-cn-${result.latest}.zip`;
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
