importScripts('updates.js');
// These are the only cross-origin reads in HV Utils 4.2.4. Same-origin game
// requests (including forms and POSTs) stay in the content script.
const endpoints = { news: 'https://e-hentai.org/news.php', lobby: 'https://hentaiverse.org/' };
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.id !== chrome.runtime.id || !Object.hasOwn(endpoints, message?.read)) return;
  const url = endpoints[message.read];
  fetch(url, { credentials: 'include', redirect: 'error' }).then(async r => reply({
    status: r.status, statusText: r.statusText, finalUrl: r.url, responseText: await r.text()
  })).catch(e => reply({status: 0, statusText: e.message, finalUrl: url}));
  return true;
});
