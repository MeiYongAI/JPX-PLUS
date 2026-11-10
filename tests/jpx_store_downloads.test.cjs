const { test } = require('node:test');
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '../src/config-manager/downloads.js'), 'utf8');
function fixture() {
  const values = new Map(), calls = []; let now = Date.parse('2026-11-10T08:00:00Z'), fail = false;
  const context = { TextEncoder, Uint8Array, crypto: webcrypto, Date: class extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } },
    GM_getValue: key => values.get(key), GM_setValue: (key, value) => values.set(key, value),
    GM_xmlhttpRequest(options) {
      calls.push(options); queueMicrotask(() => { if (fail) return options.onerror();
        const body = options.data && JSON.parse(options.data), result = body ? { configId: body.configId, day: body.day, count: 9, counted: true } : { counts: { 5: 8 } };
        options.onload({ status: 200, finalUrl: options.url, responseText: JSON.stringify(result) });
      });
    } };
  vm.createContext(context); vm.runInContext(source + ';globalThis.client=createJpxStoreDownloads()', context);
  return { client: context.client, calls, values, context, advance(ms) { now += ms; }, fail(value) { fail = value; } };
}
test('download client deduplicates same-day saves, shares pending writes and changes its token by config and day', async () => {
  const f = fixture();
  await Promise.all([f.client.record(5), f.client.record(5)]); await f.client.record(5);
  assert.equal(f.calls.length, 1); const first = JSON.parse(f.calls[0].data);
  assert.deepEqual(Object.keys(first).sort(), ['configId', 'day', 'visitor']); assert.equal(first.visitor.length, 64);
  assert.notEqual(first.visitor, f.values.get('jpx-config-download-seed-v1'));
  await f.client.record(6); f.advance(86400000); await f.client.record(5);
  assert.equal(new Set(f.calls.map(call => JSON.parse(call.data).visitor)).size, 3);
  for (const call of f.calls) { assert.equal(call.anonymous, true); assert.equal(call.headers.Authorization, undefined); }
});
test('download client retains unknown or prior counts on failure and retries only after a later action', async () => {
  const f = fixture(); f.fail(true); await f.client.counts([5]); assert.equal(f.client.peek(5), null);
  await f.client.record(5); assert.equal(f.values.get('jpx-config-download-day-v1:5'), undefined);
  f.fail(false); await f.client.record(5); assert.equal(f.client.peek(5), 9);
  f.advance(61000); await f.client.counts([5]); assert.equal(f.client.peek(5), 9, 'stale read cannot erase a confirmed increment');
  f.context.GM_setValue = () => { throw Error('storage denied'); }; f.advance(86400000);
  assert.equal(await f.client.record(5), null);
});
