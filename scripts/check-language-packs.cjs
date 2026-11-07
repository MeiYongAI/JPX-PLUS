'use strict';
// No dependencies, game startup, network, or persistent storage. Run from any directory.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const locales = ['ZhTW', 'ZhHK', 'Ja', 'Ko'];
const read = file => new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(path.join(root, file)));
const plain = value => JSON.parse(JSON.stringify(value));
function evaluate(source, file, existing = {}) {
    const context = vm.createContext({ window: { jpxI18N: existing } });
    new vm.Script(source, { filename: file }).runInContext(context, { timeout: 1000 });
    assert.ok(context.window.jpxI18N, file + ': exports window.jpxI18N');
    return plain(context.window.jpxI18N);
}
function flatten(object, prefix = '', output = {}) {
    assert.ok(object && typeof object === 'object' && !Array.isArray(object), prefix + ': dictionary object');
    for (const [key, value] of Object.entries(object)) {
        const full = prefix ? prefix + '.' + key : key;
        if (value && typeof value === 'object') flatten(value, full, output);
        else output[full] = value;
    }
    return output;
}
const placeholders = text => [...text.matchAll(/\$\{([^}]+)\}/g)].map(match => match[1]).sort();
function validateEntries(actual, expected, label) {
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), label + ': exact translation keys');
    for (const [key, original] of Object.entries(expected)) {
        const value = actual[key];
        assert.equal(typeof value, 'string', label + '.' + key + ': string value');
        assert.ok(value.trim(), label + '.' + key + ': non-empty value');
        assert.ok(!value.includes('\uFFFD'), label + '.' + key + ': no replacement characters');
        assert.ok(!value.includes('\\n'), label + '.' + key + ': use actual dialog line breaks');
        assert.deepEqual(placeholders(value), placeholders(original), label + '.' + key + ': interpolation');
        if (original.includes('\n')) assert.equal((value.match(/\n/g) || []).length,
            (original.match(/\n/g) || []).length, label + '.' + key + ': dialog line breaks');
    }
}
function metadata(source, file) {
    const header = source.match(/^\/\/ ==UserScript==\r?\n([\s\S]*?)\/\/ ==\/UserScript==/);
    assert.ok(header, file + ': userscript metadata');
    const fields = {};
    for (const [, key, value] of header[1].matchAll(/^\/\/\s+@(\S+)\s+(.+)$/gm)) (fields[key] ||= []).push(value.trim());
    for (const key of ['name', 'namespace', 'description', 'version', 'updateURL', 'downloadURL'])
        assert.equal(fields[key]?.length, 1, file + ': single @' + key);
    assert.match(fields.version[0], /^\d+\.\d+\.\d+(?:\.\d+)?$/, file + ': dotted version');
    const url = 'https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/' + file;
    assert.equal(fields.updateURL[0], url, file + ': update URL');
    assert.equal(fields.downloadURL[0], url, file + ': download URL');
    assert.deepEqual(fields.grant, ['none'], file + ': no extra permissions');
    assert.equal(fields.require, undefined, file + ': standalone without dependencies');
    return fields;
}
const baseFile = 'JPX-PLUS-ZhTrans.user.js';
const baseSource = read(baseFile), base = evaluate(baseSource, baseFile), baseMetadata = metadata(baseSource, baseFile);
const { cStore: baseStore, cM: baseManager, ...baseUI } = base;
const baseEntries = flatten(baseUI);
const translations = JSON.parse(read('plugins/config-store/i18n.json'));
const storeSource = read('src/config-manager/store.js');
const integratedTranslations = JSON.parse(storeSource.match(/    const translations = (.+);/)[1]);
const storeEntries = flatten(integratedTranslations.en);
const managerEntries = flatten(JSON.parse(read('src/config-manager/en.json')));
validateEntries(flatten(baseStore), storeEntries, baseFile + '.cStore');
validateEntries(flatten(baseManager), managerEntries, baseFile + '.cM');
// Extract only the actual plugin lookup. No plugin startup or GM API is executed.
const plugin = read('JPX-PLUS-ConfigStore.user.js');
const lookupSource = plugin.match(/    const t = key => \{[\s\S]*?\n    \};/);
assert.ok(lookupSource, 'Config Store lookup can be tested in isolation');
function lookup(dictionary) {
    const context = vm.createContext({ host: { jpxI18N: dictionary }, translations });
    new vm.Script(lookupSource[0] + '\nt;').runInContext(context, { timeout: 1000 });
    return key => vm.runInContext('t(' + JSON.stringify(key) + ')', context, { timeout: 1000 });
}
const results = [];
for (const locale of locales) {
    const file = 'JPX-PLUS-' + locale + '.user.js';
    const source = read(file), dictionary = evaluate(source, file), fields = metadata(source, file);
    for (const key of ['namespace', 'match', 'exclude', 'run-at']) assert.deepEqual(fields[key], baseMetadata[key], file + ': @' + key + ' compatibility');
    const { cStore, cM, ...ui } = dictionary;
    validateEntries(flatten(ui), baseEntries, file);
    validateEntries(flatten(cStore), storeEntries, file + '.cStore');
    validateEntries(flatten(cM), managerEntries, file + '.cM');
    const unknown = { extension: { retained: 'custom extension' } };
    const merged = evaluate(source, file, { ...unknown, cW: { obsolete: 'replace owned namespace' } });
    assert.deepEqual(merged.extension, unknown.extension, file + ': preserve unknown namespace');
    assert.deepEqual(merged.cW, dictionary.cW, file + ': replace owned namespace');
    assert.deepEqual(evaluate(source, file, plain(merged)), merged, file + ': repeat loading stays stable');
    const translate = lookup(dictionary);
    for (const [key, value] of Object.entries(cStore)) assert.equal(translate('cStore.' + key), value, file + ': plugin lookup ' + key);
    assert.equal(translate('cStore.unknownFixtureKey'), 'cStore.unknownFixtureKey', file + ': unknown key fallback');
    results.push({ file, base: Object.keys(baseEntries).length, store: Object.keys(cStore).length, total: Object.keys(flatten(dictionary)).length });
}
assert.equal(lookup(base)('cStore.name'), translations.zh.name, 'Existing Simplified Chinese pack retains store fallback');
assert.equal(lookup({})('cStore.name'), translations.en.name, 'Default store language remains English');
console.log(JSON.stringify({ passed: true, results }, null, 2));
