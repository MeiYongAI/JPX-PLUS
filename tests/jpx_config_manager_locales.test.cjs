'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const english = JSON.parse(fs.readFileSync(path.join(root, 'src/config-manager/en.json'), 'utf8'));
const placeholders = value => (value.match(/\$\{[^}]+\}/g) || []).sort();

for (const locale of ['ZhCN', 'ZhTW', 'ZhHK', 'Ja', 'Ko']) {
    test(`${locale}: configuration manager strings are complete and preserve placeholders`, () => {
        const source = fs.readFileSync(path.join(root, `JPX-PLUS-${locale}.user.js`), 'utf8');
        const context = { window: {} };
        vm.runInNewContext(source, context);
        const dictionary = JSON.parse(JSON.stringify(context.window.jpxI18N));
        assert.deepEqual(Object.keys(dictionary.cM).sort(), Object.keys(english).sort());
        for (const [key, value] of Object.entries(english)) {
            const translated = dictionary.cM[key];
            assert.equal(typeof translated, 'string', key);
            assert.ok(translated.trim(), key);
            assert.equal(translated.includes('\ufffd'), false, `${key}: no replacement characters`);
            assert.deepEqual(placeholders(translated), placeholders(value), `${key}: placeholders`);
        }
        for (const key of ['savedConfig', 'saved', 'submitted']) {
            assert.equal(typeof dictionary.cStore[key], 'string', `cStore.${key}`);
            assert.ok(dictionary.cStore[key].trim());
        }
        for (const key of ['filters', 'allWorlds', 'allStyles', 'allBattles', 'clearFilters', 'sort', 'latest', 'nameSort', 'resultCount', 'showMore']) {
            assert.equal(typeof dictionary.cStore[key], 'string', `cStore.${key}`);
            assert.ok(dictionary.cStore[key].trim());
            assert.equal(dictionary.cStore[key].includes('\ufffd'), false);
        }
        assert.deepEqual(placeholders(dictionary.cStore.resultCount), ['${count}']);
        assert.doesNotMatch(dictionary.cStore.submitted, /→|My configs|我的配置|我的設定|マイ設定|내 설정/);
    });
}
