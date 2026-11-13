'use strict';
const { open, source, mainHTML } = require('./battle-performance.cjs');
function instrument() {
    const clone = value => JSON.parse(JSON.stringify(value));
    cfgBattle.TwoHanded_General = { supports: [{ type: 'stop', customMessage: 'Fixture wait', disabled: true, conditions: [] }],
        attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'normalAttack', conditions: [] }] };
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    cfgBattle.ctrlWidgetMouseEnter = false; cfgBattle.ajaxRound = true; cfgBattle.autoFinishBattle = false;
    cfgBattle.advanceToNextRound = false;
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    document.addEventListener('DOMContentLoaded', reDoBattle);
    preDoBattle();
    const nativeSet = Storage.prototype.setItem, nativeText = File.prototype.text;
    let deniedKey = null, readPending = [], holdReads = false;
    Storage.prototype.setItem = function(key, value) {
        if (key === deniedKey) { deniedKey = null; throw new DOMException('Fixture quota', 'QuotaExceededError'); }
        return nativeSet.call(this, key, value);
    };
    File.prototype.text = function() { const result = nativeText.call(this); return holdReads ? new Promise((resolve, reject) => readPending.push(() => result.then(resolve, reject))) : result; };
    window.__imports = {
        setup(status) {
            if (status === 'running' || status === 'stop') {
                if (status === 'stop') cfgBattle.TwoHanded_General.rules[0].disabled = false;
                localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
                toggleActive();
            }
            if (status === 'puzzle') { document.body.insertAdjacentHTML('beforeend', '<div id="riddlemaster"></div>'); reDoBattle(); }
            if (status === 'between' || status === 'finished') {
                document.getElementById('battle_main').insertAdjacentHTML('beforeend', '<div id="btcp">' + (status === 'finished' ? '<img src="/y/finishbattle.png">' : '') + '</div>');
                if (status === 'between') { isActiveBattle = true; monstersObj = { activeMonsters: [] }; goNext(); }
            }
            if (status === 'lobby') { stopBattleUpdates(); log = null; document.getElementById('battle_main').remove(); }
        },
        open: renderSettings,
        snapshot: () => ({ config: clone(cfgBattle), native: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix),
            library: localStorage.getItem(jpxConfigLibraryKey), stats: clone(cfgStats), storedStats: localStorage.getItem(prefix + 'cfgStats'),
            otherWorld: localStorage.getItem(prefix + 'cfgBattle' + (isekaiSuffix ? '' : '_isekai')),
            active: isActiveBattle, ready: readyNext, mode: getBattleMode(), attacks: window.__attacks }),
        library: () => getJpxConfigLibrary().readState(),
        defaults: () => clone(defaultCfgStats),
        append() { const row = log.insertRow(0); row.insertCell().textContent = 'Fixture import update'; },
        hold(value = true) { holdReads = value; },
        pending: () => readPending.length,
        release(index = 0) { readPending.splice(index, 1)[0]?.(); },
        deny(key) { deniedKey = key; },
        damageLibrary() { nativeSet.call(localStorage, jpxConfigLibraryKey, '{broken'); },
        async next(main, fallback = false) {
            const panel = document.createElement('div'); panel.id = 'btcp'; document.getElementById('battle_main').append(panel);
            window.Battle = function() {};
            jpxUtils.xhrGet = async () => [{ status: 'fulfilled', value: { responseText: '<div id="battle_main">' + main + '</div>', url: location.href } }];
            isActiveBattle = true; monstersObj = { activeMonsters: [] }; goNext();
            if (fallback) document.getElementById('battle_main').id = 'old-battle-main';
            await panel.onclick();
        }
    };
}
async function fixture(browser, t, { status = 'paused', isekai = false, mobile = false } = {}) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1100 },
        isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' }); t.after(() => context.close());
    const input = source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
    const { page, errors } = await open(context, { source: input, url: 'https://hentaiverse.org/' + (isekai ? 'isekai/' : '') });
    page.setDefaultTimeout(6000); t.after(() => require('node:assert/strict').deepEqual(errors, []));
    await page.evaluate(status => __imports.setup(status), status); await page.waitForTimeout(30);
    await page.evaluate(() => __imports.open());
    if (!await page.locator('#tab_configManager').isVisible()) await page.locator('#jpx-settings-menu-button').click();
    await page.locator('#tab_configManager').click(); await page.locator('.jpx-config-list').waitFor();
    return { page, context, isekai, errors };
}
const envelope = (title = 'Import case', world = 'Persistent', mode = 'OneHanded_Item') => ({ schemaVersion: 1, kind: 'battle-mode', title, description: '', world, mode,
    config: { battleVersion: 20251216, [mode]: { supports: [{ type: 'stop', customMessage: title, conditions: [] }], attacks: [{ type: 'normalAttack', conditions: [] }] } } });
async function choose(page, value, name = 'Import case.json') {
    const chooser = page.waitForEvent('filechooser');
    await page.locator('.jpx-config-toolbar').getByRole('button', { name: 'Import', exact: true }).click();
    await (await chooser).setFiles({ name, mimeType: 'application/json', buffer: Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
}
async function save(page) { await page.locator('.jpx-config-form').getByRole('button', { name: 'Save', exact: true }).click(); }
const row = (page, title) => page.locator('.jpx-config-row').filter({ has: page.locator('.jpx-config-title strong', { hasText: title }) });
module.exports = { fixture, envelope, choose, save, row, mainHTML };

// Expected native output after loading either supported rule format.
module.exports.normalized = value => {
    const copy = JSON.parse(JSON.stringify(value));
    const config = copy.config || copy;
    for (const mode of Object.values(config)) if (mode && Array.isArray(mode.supports) && Array.isArray(mode.attacks)) {
        mode.rules = [...mode.supports, ...mode.attacks]; delete mode.supports; delete mode.attacks;
    }
    return copy;
};
