const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const script = readFileSync(path.resolve(__dirname, '../extensions/hv-utils/hv-utils.js'), 'utf8');

// Run the real startup through storage prefetch; keep the DOM parser pending.
async function reads(query, prefix = 'hvut_', version = 4.24) {
  const calls = [];
  const storage = {local: {get(keys) {
    calls.push(...keys);
    return {[prefix + 'settings']: {version}};
  }}, onChanged: {addListener() {}}};
  vm.runInNewContext(script, {URLSearchParams, chrome:{storage}, MutationObserver:class {observe() {}},
    location: new URL('https://hentaiverse.org/' + (prefix === 'hvuti_' ? 'isekai/' : '') + '?' + query),
    document: {getElementById() {}, readyState:'loading', documentElement:{setAttribute() {}}, addEventListener() {}}});
  await new Promise(resolve => setImmediate(resolve));
  return calls;
}

test('prefetch reads page-specific records only on their consuming routes', async () => {
  const scoped = ['equipdata', 'mm_userlist', 'ml_plc', 'ml_log', 'ss_log', 'se_settings'];
  for (const [query, expected] of [
    ['s=Bazaar&ss=am&screen=sell', []], ['s=Bazaar&ss=am&screen=organize', ['equipdata']],
    ['s=Bazaar&ss=mm', []], ['s=Bazaar&ss=mm&filter=new', ['equipdata','mm_userlist']],
    ['s=Bazaar&ss=mm&filter=new&hvut=disabled', []], ['s=Bazaar&ss=ml', ['ml_plc','ml_log']],
    ['s=Bazaar&ss=ss', ['ss_log']], ['s=Character&ss=se', ['se_settings']], ['s=Battle&ss=ba', []]
  ]) {
    for (const prefix of ['hvut_', 'hvuti_']) {
      const keys = await reads(query, prefix);
      assert.deepEqual(scoped.filter(k => keys.includes(prefix + k)), expected, query);
    }
  }
  const migration = await reads('s=Bazaar&ss=ml', 'hvuti_', 4.2);
  for (const key of ['hvuti_ml_log','hvuti_ss_log','hvuti_prices'])
    assert.equal(migration.filter(k => k === key).length, 1, key);
});

test('AJAX queue releases sent requests, preserves FIFO and can be reused', () => {
  const sent = [], callbacks = [];
  const ajax = vm.runInNewContext(script.slice(script.indexOf('const $ajax ='), script.indexOf("window.addEventListener('unhandledrejection'")) + '\n$ajax;', {
    console: {log() {}}, GM_xmlhttpRequest: r => sent.push(r), setTimeout: () => 1, clearTimeout() {}
  });
  const add = i => ajax.add('POST', '/' + i, 'data=' + i, () => callbacks.push(i));
  const finish = i => sent[i].onload({status:200, responseText:'ok', context:sent[i].context});
  for (let i = 0; i < 100; i++) add(i);
  for (let i = 0; i < 100; i++) {
    assert.equal(sent.length, i + 1);
    assert.equal(sent[i].data, 'data=' + i);
    assert.ok(!ajax.queue.includes(sent[i]), 'dispatched request is still retained');
    finish(i);
  }
  assert.equal(ajax.queue.length, 0);
  add(100); finish(100);
  assert.deepEqual(callbacks, Array.from({length:101}, (_, i) => i));
  assert.equal(ajax.conn, 0);
});

test('protection decisions reuse equivalent rows only within one filter pass', () => {
  const begin = script.indexOf('const decisions = new Map();');
  let calls = 0;
  const match = vm.runInNewContext('() => {' + script.slice(begin, script.indexOf('equiplist.forEach', begin)) + 'return matches;}', {
    $config:{settings:{equipmentShopProtectFilters:[]}}, $equip:{filter:{equip:() => ++calls}}
  });
  const pass = match(), info = {name:'Rapier', quality:'Superior', pab:'sd', level:400, prefix:''};
  assert.equal(pass({info}), 1);
  assert.equal(pass({info:{...info}}), 1);
  for (const [field, value] of Object.entries({name:'Dagger',quality:'Legendary',pab:'sde',level:401,prefix:'Fiery'})) {
    const n = calls;
    assert.equal(pass({info:{...info,[field]:value}}), n + 1, field);
  }
  assert.equal(match()({info}), 7);
});
