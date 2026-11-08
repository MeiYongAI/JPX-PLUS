'use strict';

// Real userscript UI with local HTTP fixtures. No account, installed storage,
// combat actions, or real game request is used.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = fs.readFileSync(path.join(__dirname, '../JPX-PLUS.user.js'), 'utf8');
const translation = fs.readFileSync(path.join(__dirname, '../HentaiVerse-Chinese.user.js'), 'utf8');
const rules = name => ({ supports: [{ type: 'stop', customMessage: name }], attacks: [{ type: 'normalAttack' }] });
const base = '<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div></div>';
const quickbar = names => '<div id="quickbar">' + names.map(name =>
    '<div class="btqs" onmouseover="set_infopane_spell(\'' + name + '\', \'Fixture\', \'fixture\', 10, 0, 5)">中文显示<div class="cooldown">3</div></div>').join('') + '</div>';
const character = (name = 'Fixture Persona', id = '17', magic = 20) => base +
    `<form id="persona_form"><select><option value="${id}" selected>${name}</option></select></form>` +
    `<div class="spc">Spell Damage Bonus</div><div><table><tr><td>${magic}%</td><td>Wind</td></tr></table></div>`;
const equipment = (weapon = 'Legendary Willow Staff of Destruction') => base +
    '<div id="eqsb"><div class="eqb" onclick="location.href=\'/?s=Character&ss=eq&equip_slot=1\'">' +
    '<div>Main hand</div><div onmouseover="equips.set(101,\'slot_pane\',250,130)">Translated equipment label</div></div>' +
    '<div class="eqb eqdisabled"><div>Offhand</div><div class="eqempty">Unavailable</div></div></div>' +
    '<script>var dynjs_equip = ' + JSON.stringify({ 101: { n: '', t: weapon, d: 'Nested text with }; and escaped "quotes" { }' } }) +
    '; window.__inspectionScriptExecuted = true;</script>';
const equipmentScript = weapon => 'var dynjs_equip = ' + JSON.stringify({ 101: { n: '', t: weapon } }) +
    '; window.__inspectionScriptExecuted = true;';
// The live Isekai equipment page references a separate /isekai/dynjs/.../equip-ID.js.
// Keep its structure, but use invented equipment IDs and data in this fixture.
const externalEquipment = src => equipment().replace(/<script>[\s\S]*$/, `<script src="${src}"></script>`);

function expose() {
    initDoI18n(); loadBattleConfig();
    log = document.querySelector('#textlog'); battleType = 'General';
    initJpxModeDetection();
    window.__pages = {
        open: renderSettings, detect: getDetectedJpxBattleStyle, ensure: ensureJpxModeDetection,
        cache: () => localStorage.getItem(jpxDetectedFamilyKey()),
        native: () => localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix),
        context: getJpxDetectionContext,
        magic: () => ({ memory: spellDamageBonus, verified: readJpxSpellDamageBonus(true), element: getManagedSpellType() }),
        parseMagic: getJpxSpellDamageFromPage,
        parseQuickbar: getJpxSpellTypeFromQuickbar,
        refresh: refreshJpxModeDetection,
        nextRound() {
            const prepare = preDoBattle, background = jpxPanelManager.setBackground, dispatch = jpxPanelManager.dispatchState;
            preDoBattle = jpxPanelManager.setBackground = jpxPanelManager.dispatchState = () => {};
            try { reDoBattle(); } finally {
                preDoBattle = prepare; jpxPanelManager.setBackground = background; jpxPanelManager.dispatchState = dispatch;
            }
        },
        simulateSpell(name = 'T1', explicitElement = '') {
            battleStyle = 'Staff'; battleType = 'General'; jpxSelectedConfig = null;
            cfgBattle.Staff_General = { supports: [], attacks: [] };
            if (explicitElement) cfgBattle.Staff_General.jpxPlusExecution = { element: explicitElement };
            monstersObj = { monsters: [], activeMonsters: [], bosses: [], activeBosses: [] };
            conditionsObj = null; isActiveBattle = true; readyNext = 0;
            spellCooldowns = {}; itemCooldowns = {}; actionCounts = { history: [] };
            timeRecords = jpxUtils.createTimeRecords(); combatRecords = jpxUtils.createCombatRecords(); revenueRecords = jpxUtils.createRevenueRecords();
            const conditions = initConditions().generalHandlers;
            const guarded = ['pActionCooldown', 'pActionHistory', 'pActionCounts', 'pTotalActionCounts'].map(key => conditions[key]([0, 9999, 'T1']));
            const original = doSpellGoNext, updates = jpxPanelManager.updateContent, background = jpxPanelManager.setBackground, dispatch = jpxPanelManager.dispatchState;
            const casts = []; doSpellGoNext = spell => { casts.push(spell); return true; };
            jpxPanelManager.updateContent = jpxPanelManager.setBackground = jpxPanelManager.dispatchState = () => {};
            try {
                const panel = CTRLWIDGET_FIELDS.find(field => field.id === 'battleStyle').get();
                actionHandlers.spellDamage({ name, conditions: [] }, { isAlive: true });
                return { casts, active: isActiveBattle, status: readyNext, panel, guarded };
            } finally {
                doSpellGoNext = original; jpxPanelManager.updateContent = updates; jpxPanelManager.setBackground = background; jpxPanelManager.dispatchState = dispatch;
            }
        },
        setPersona(name, id) {
            localStorage.setItem(prefix + 'persona' + isekaiSuffix, name);
            localStorage.setItem(prefix + 'personaId' + isekaiSuffix, id);
        },
        ageCache() {
            const value = JSON.parse(localStorage.getItem(jpxDetectedFamilyKey())); value.verifiedAt -= 61000;
            localStorage.setItem(jpxDetectedFamilyKey(), JSON.stringify(value));
        },
        enterBattle() { log = document.createElement('div'); log.id = 'textlog'; document.body.append(log); }
    };
}
const harness = source.replace('\ninitDo();', '\n(' + expose.toString() + ')();');
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => { await browser?.close(); });

async function fixture(t, { isekai = false, initialHtml = base, responseBattle = false, failed = false, hold = false, holdMetadata = false } = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    t.after(() => context.close());
    const page = await context.newPage(), requests = [], unexpected = [], errors = [];
    page.setDefaultTimeout(10000); page.on('pageerror', error => errors.push(error.message));
    let release;
    const gate = hold ? new Promise(resolve => { release = resolve; }) : Promise.resolve();
    let releaseMetadata;
    const metadataGate = holdMetadata ? new Promise(resolve => { releaseMetadata = resolve; }) : Promise.resolve();
    const replies = { ch: character(), eq: equipment(), metadata: equipmentScript('Exquisite Mace of Slaughter'), metadataStatus: 200 };
    await context.route('**/*', async route => {
        const request = route.request();
        if (request.isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: initialHtml });
        const url = new URL(request.url()), part = url.searchParams.get('ss');
        if (url.origin === 'https://hentaiverse.org' && request.method() === 'GET' &&
            url.pathname === (isekai ? '/isekai/' : '/') + 'dynjs/1794042812/fixture/equip-101.js') {
            requests.push({ path: url.pathname + url.search, method: request.method() });
            await metadataGate;
            return route.fulfill({ status: replies.metadataStatus, contentType: 'text/javascript', body: replies.metadata });
        }
        if (url.origin !== 'https://hentaiverse.org' || request.method() !== 'GET' || url.searchParams.get('s') !== 'Character' || !['ch', 'eq'].includes(part)) {
            unexpected.push(request.url()); return route.abort();
        }
        requests.push({ path: url.pathname + url.search, method: request.method() });
        await gate;
        return route.fulfill({ status: failed ? 503 : 200, contentType: 'text/html',
            body: responseBattle ? base + '<div id="battle_main"><table id="textlog"></table></div>' : replies[part] });
    });
    const url = 'https://hentaiverse.org/' + (isekai ? 'isekai/' : '') + '?s=Battle&ss=ar';
    await page.goto(url);
    const config = { battleVersion: 20251216, Staff_General: rules('Saved Staff'), TwoHanded_General: rules('Saved Two-handed'), '2H_Mage_General': rules('Saved Battlemage') };
    await page.evaluate(({ config, isekai }) => localStorage.setItem('jpx_cfgBattle' + (isekai ? '_isekai' : ''), JSON.stringify(config)), { config, isekai });
    const start = async () => page.addScriptTag({ content: harness });
    await start();
    const original = await page.evaluate(() => __pages.native());
    const open = async () => { await page.evaluate(() => __pages.open()); await page.locator('#tab_configManager').click(); };
    return { page, context, url, start, open, original, requests, unexpected, errors, replies, release, releaseMetadata };
}
function clean(f) { assert.deepEqual(f.errors, []); assert.deepEqual(f.unexpected, []); }

for (const isekai of [false, true]) test('all native stat headings preserve wind detection in ' + (isekai ? 'Isekai' : 'Persistent'), async t => {
    const headings = '<div class="spc">Mainhand Attack</div><table><tr><td>4613</td><td>Crushing Damage</td></tr></table>' +
        '<div class="spc">Magic Attack</div><table><tr><td>5140</td><td>Damage Bonus</td></tr></table>';
    const stats = '<div class="spc">Spell Damage Bonus</div><table>' +
        [[0, 'Fire'], [0, 'Cold'], [38.4, 'Elec'], [398.6, 'Wind'], [0, 'Holy'], [76.8, 'Dark']].map(([value, name]) =>
            '<tr><td>' + value + '%</td><td>' + name + '</td></tr>').join('') + '</table>';
    const initialHtml = character().replace(/<div class="spc">[\s\S]*$/, '<div id="stats_scrollable">' + headings + stats + '</div>');
    const f = await fixture(t, { isekai, initialHtml });
    const magic = await f.page.evaluate(() => __pages.magic());
    assert.deepEqual(magic.memory, { maxType: 'wind', maxValue: 398.6 });
    assert.deepEqual(magic.verified, magic.memory); assert.equal(magic.element, 'wind');
    await f.page.goto('https://hentaiverse.org/' + (isekai ? 'isekai/' : '') + '?battle-fixture');
    await f.page.evaluate(() => { document.body.innerHTML = '<div id="csp"><div id="navbar"></div><table id="textlog"></table></div>'; });
    await f.start();
    const action = await f.page.evaluate(() => __pages.simulateSpell());
    assert.deepEqual(action.casts, ['Gale'], 'a normal T1 rule follows the persisted wind observation in combat');
    assert.equal(action.active, true); assert.match(action.panel, /Wind/);
    assert.deepEqual(f.requests, []); clean(f);
});

test('missing element is not fire, tier actions pause, and explicit choices remain authoritative', async t => {
    const f = await fixture(t, { initialHtml: base + '<table id="textlog"></table>' });
    const unknown = await f.page.evaluate(() => __pages.simulateSpell());
    assert.deepEqual(unknown.casts, []); assert.equal(unknown.active, false);
    assert.deepEqual(unknown.guarded, [false, false, false, false]);
    assert.match(unknown.status, /Spell element unavailable/); assert.doesNotMatch(unknown.panel, /Fire|undefined/);
    const named = await f.page.evaluate(() => __pages.simulateSpell('Gale'));
    assert.deepEqual(named.casts, ['Gale']); assert.equal(named.active, true);
    const explicit = await f.page.evaluate(() => __pages.simulateSpell('T1', 'fire'));
    assert.deepEqual(explicit.casts, ['Fiery Blast']); assert.equal(explicit.active, true);
    assert.deepEqual(f.requests, []); clean(f);
});

for (const isekai of [false, true]) test('quickbar supplies a missing element without altering stats in ' + (isekai ? 'Isekai' : 'Persistent'), async t => {
    const f = await fixture(t, { isekai, initialHtml: base + '<table id="textlog"></table>' + quickbar(['Gale', 'Downburst', 'Cure', 'Imperil']) });
    const magic = await f.page.evaluate(() => __pages.magic());
    assert.deepEqual(magic.memory, { maxType: '', maxValue: 0 });
    assert.equal(magic.verified, null); assert.equal(magic.element, 'wind');
    const action = await f.page.evaluate(() => __pages.simulateSpell());
    assert.deepEqual(action.casts, ['Gale']); assert.equal(action.active, true); assert.match(action.panel, /Wind/);
    const explicit = await f.page.evaluate(() => __pages.simulateSpell('T1', 'fire'));
    assert.deepEqual(explicit.casts, ['Fiery Blast']);
    for (const suffix of ['', '_isekai']) assert.equal(await f.page.evaluate(s => localStorage.getItem('jpx_spellDamageBonus' + s), suffix), null);
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original);
    assert.deepEqual(f.requests, []); clean(f);
});

test('quickbar requires one unambiguous attack element and ignores visible labels and full spell lists', async t => {
    const f = await fixture(t);
    const cases = [
        [quickbar(['Gale', 'Gale', 'Downburst', 'Fiery Blast']), ''],
        [quickbar(['Cure', 'Imperil', 'Arcane Focus']), ''],
        ['<div id="quickbar"><div class="btqs">Gale</div><div class="btqs" onmouseover="void(0)">Downburst</div></div>', ''],
        [quickbar(['Storms of Njord', 'Cure']) + quickbar(['Fiery Blast']).replace('id="quickbar"', 'id="pane_magic"'), 'wind'],
        [quickbar(['Fiery Blast']), 'fire'], [quickbar(['Freeze']), 'cold'],
        [quickbar(['Shockblast']), 'elec'], [quickbar(['Smite']), 'holy'], [quickbar(['Ragnarok']), 'dark'],
        ['<div id="quickbar"><div class="btqs" onmouseover="set_infopane_spell(&quot;Gale&quot;, &quot;Fixture&quot;)">烈风</div></div>', 'wind']
    ];
    for (const [html, expected] of cases) {
        const actual = await f.page.evaluate(html => __pages.parseQuickbar(new DOMParser().parseFromString(html, 'text/html')), html);
        assert.equal(actual, expected, html);
    }
    clean(f);
});

test('character attributes take priority over quickbar hints', async t => {
    const f = await fixture(t, { initialHtml: character() + quickbar(['Fiery Blast']) });
    assert.equal((await f.page.evaluate(() => __pages.magic())).element, 'wind');
    assert.deepEqual((await f.page.evaluate(() => __pages.simulateSpell())).casts, ['Gale']);
    clean(f);
});

test('quickbar fallback refreshes on AJAX rounds and stays out of repeated action reads', async t => {
    const f = await fixture(t, { initialHtml: base + '<table id="textlog"></table>' + quickbar(['Gale']) });
    const queries = await f.page.evaluate(() => {
        const original = document.querySelectorAll; let scans = 0;
        document.querySelectorAll = function(selector) { if (selector.includes('#quickbar')) scans++; return original.call(this, selector); };
        try { for (let i = 0; i < 100; i++) __pages.magic(); } finally { document.querySelectorAll = original; }
        return scans;
    });
    assert.equal(queries, 0);
    await f.page.evaluate(html => { document.querySelector('#quickbar').outerHTML = html; __pages.nextRound(); }, quickbar(['Freeze']));
    assert.equal((await f.page.evaluate(() => __pages.magic())).element, 'cold');
    await f.page.evaluate(html => { document.querySelector('#quickbar').outerHTML = html; __pages.nextRound(); }, quickbar(['Freeze', 'Gale']));
    const action = await f.page.evaluate(() => __pages.simulateSpell());
    assert.deepEqual(action.casts, []); assert.equal(action.active, false);
    assert.deepEqual(f.requests, []); clean(f);
});

for (const order of ['translation-first', 'translation-last']) test('quickbar metadata survives the published game translation: ' + order, async t => {
    const f = await fixture(t, { initialHtml: base + '<table id="textlog"></table>' + quickbar(['Gale', 'Downburst', 'Cure']) });
    if (order === 'translation-first') {
        // Navigate to a clean fixture, then load the real translator before JPX.
        await f.page.goto(f.url); await f.page.addScriptTag({ content: translation }); await f.start();
    } else await f.page.addScriptTag({ content: translation });
    await f.page.evaluate(() => __pages.refresh());
    assert.equal((await f.page.evaluate(() => __pages.magic())).element, 'wind');
    assert.deepEqual((await f.page.evaluate(() => __pages.simulateSpell())).casts, ['Gale']);
    assert.deepEqual(f.requests, []); clean(f);
});

test('a cached staff family without spell stats still refreshes outside combat', async t => {
    const f = await fixture(t);
    await f.page.evaluate(() => {
        __pages.setPersona('Fixture Persona', '17');
        localStorage.setItem('jpx_detectedWeaponFamily_v1', JSON.stringify({ version: 1, ...__pages.context(), family: 'Staff', verifiedAt: Date.now() }));
    });
    await f.page.evaluate(() => __pages.ensure());
    assert.equal((await f.page.evaluate(() => __pages.magic())).element, 'wind');
    assert.equal(f.requests.length, 2); clean(f);
});

test('bilingual stat captions use native source text and never select mitigation values', async t => {
    const f = await fixture(t);
    const result = await f.page.evaluate(() => {
        const doc = new DOMParser().parseFromString('<div class="spc">Damage Mitigation</div><table><tr><td>999%</td><td>Fire</td></tr></table>' +
            '<div class="spc">Spell Damage Bonus 法术伤害加成</div><table><tr><td>0.0%</td><td>Fire火焰</td></tr>' +
            '<tr><td>398.6%</td><td><hv-source-text>Wind</hv-source-text><span>疾风</span></td></tr>' +
            '<tr><td>76.8%</td><td>Dark 黑暗</td></tr></table>', 'text/html');
        return __pages.parseMagic(doc);
    });
    assert.deepEqual(result, { maxType: 'wind', maxValue: 398.6 }); clean(f);
});

for (const isekai of [false, true]) test(`first open detects automatically without visiting equipment, ${isekai ? 'Isekai' : 'Persistent'}`, async t => {
    const f = await fixture(t, { isekai }); await f.open();
    const world = isekai ? 'Isekai' : 'Persistent';
    const row = f.page.locator(`[data-config-id="native-${world}-Staff_General"]`);
    await row.locator('.jpx-config-detected').waitFor();
    assert.equal(await row.getAttribute('data-active'), 'true');
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'Staff');
    assert.equal(f.page.url(), f.url, 'the displayed game page never navigates');
    assert.deepEqual(f.requests.map(x => x.path).sort(), ['ch', 'eq'].map(x => (isekai ? '/isekai/' : '/') + '?s=Character&ss=' + x));
    assert.equal(await f.page.evaluate(() => window.__inspectionScriptExecuted), undefined, 'fetched scripts are data only');
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original, 'detection cannot change battle rules');
    await f.page.evaluate(() => Promise.all([__pages.ensure(), __pages.ensure()]));
    assert.equal(f.requests.length, 2, 'fresh evidence reuses the cache');
    await f.page.reload(); await f.start(); await f.open();
    await row.locator('.jpx-config-detected').waitFor();
    assert.equal(f.requests.length, 2, 'navigation and reload do not need another equipment lookup'); clean(f);
});

for (const isekai of [false, true]) test(`external equipment data detects zero-bonus melee from the lobby, ${isekai ? 'Isekai' : 'Persistent'}`, async t => {
    const f = await fixture(t, { isekai });
    const world = isekai ? 'Isekai' : 'Persistent', path = (isekai ? '/isekai/' : '/') + 'dynjs/1794042812/fixture/equip-101.js';
    f.replies.ch = character('Fixture Persona', '17', 0);
    f.replies.eq = externalEquipment(path);
    await f.open(); await f.page.evaluate(() => __pages.ensure());
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'TwoHanded');
    assert.equal(await f.page.locator(`[data-config-id="native-${world}-TwoHanded_General"] .jpx-config-detected`).count(), 1);
    assert.deepEqual(f.requests.map(x => x.path).sort(), [path, ...['ch', 'eq'].map(x => (isekai ? '/isekai/' : '/') + '?s=Character&ss=' + x)].sort());
    assert.equal(await f.page.evaluate(() => window.__inspectionScriptExecuted), undefined, 'metadata is parsed, never executed');
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original);
    assert.equal(f.page.url(), f.url);
    const observation = JSON.parse(await f.page.evaluate(() => __pages.cache()));
    assert.equal(observation.world, world); assert.equal(observation.personaId, '17');
    const otherSuffix = isekai ? '' : '_isekai';
    assert.equal(await f.page.evaluate(suffix => localStorage.getItem('jpx_detectedWeaponFamily_v1' + suffix), otherSuffix), null);
    await f.page.reload(); await f.start(); await f.open();
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'TwoHanded');
    assert.equal(f.requests.length, 3, 'cached detection survives reload without more requests');
    await f.page.evaluate(() => __pages.ageCache());
    f.replies.metadata = equipmentScript('Legendary Willow Staff of Destruction');
    await f.page.evaluate(() => __pages.ensure());
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'Staff');
    assert.equal(await f.page.locator(`[data-config-id="native-${world}-Staff_General"] .jpx-config-detected`).count(), 1);
    assert.equal(f.requests.length, 6, 'expired equipment evidence is refreshed in the same world');
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original); clean(f);
});

test('external metadata is confined to native equipment data in the current world', async t => {
    const f = await fixture(t, { isekai: true });
    f.replies.eq = externalEquipment('/dynjs/1794042812/fixture/equip-101.js') +
        '<script src="https://example.invalid/isekai/dynjs/1794042812/fixture/equip-101.js"></script>' +
        '<script src="/isekai/z/091e/hvc.js"></script>';
    await f.open(); await f.page.evaluate(() => __pages.ensure());
    assert.equal(await f.page.evaluate(() => __pages.cache()), null);
    assert.equal(f.requests.length, 2, 'unrelated assets and the other world are not requested'); clean(f);
});

test('failed or malformed external metadata cannot create a detection result', async t => {
    for (const reply of [{ metadataStatus: 503 }, { metadata: 'var dynjs_equip = broken;' },
        { metadata: 'var dynjs_equip = {101: (() => { window.__inspectionScriptExecuted = true; return {}; })()};' }]) {
        const f = await fixture(t, { isekai: true });
        f.replies.eq = externalEquipment('/isekai/dynjs/1794042812/fixture/equip-101.js');
        Object.assign(f.replies, reply);
        await f.open(); await f.page.evaluate(() => __pages.ensure());
        assert.equal(await f.page.evaluate(() => __pages.cache()), null);
        assert.equal(await f.page.evaluate(() => __pages.native()), f.original);
        assert.equal(await f.page.evaluate(() => window.__inspectionScriptExecuted), undefined);
        assert.equal(f.requests.length, 3); clean(f);
    }
});

test('combat or persona changes during external metadata loading discard the late response', async t => {
    for (const change of ['combat', 'persona']) {
        const f = await fixture(t, { isekai: true, holdMetadata: true });
        f.replies.eq = externalEquipment('/isekai/dynjs/1794042812/fixture/equip-101.js');
        const metadataRequest = f.page.waitForRequest(/\/dynjs\/.*\/equip-101\.js$/);
        await f.open(); await metadataRequest;
        if (change === 'combat') await f.page.evaluate(() => __pages.enterBattle());
        else await f.page.evaluate(() => __pages.setPersona('Other Persona', '29'));
        f.releaseMetadata(); await f.page.evaluate(() => __pages.ensure());
        await new Promise(resolve => setTimeout(resolve, 100));
        assert.equal(await f.page.evaluate(() => __pages.cache()), null);
        assert.equal(await f.page.evaluate(() => __pages.native()), f.original); clean(f);
    }
});

test('background character stats distinguish two-handed battlemage and expired evidence refreshes', async t => {
    const f = await fixture(t); f.replies.ch = character('Fixture Persona', '17', 150); f.replies.eq = equipment('Legendary Estoc');
    await f.open();
    await f.page.locator('[data-config-id="native-Persistent-2H_Mage_General"] .jpx-config-detected').waitFor();
    assert.equal(await f.page.evaluate(() => __pages.detect()), '2H_Mage');
    await f.page.evaluate(() => __pages.ageCache());
    f.replies.eq = equipment();
    await f.page.evaluate(() => __pages.ensure());
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'Staff');
    assert.equal(f.requests.length, 4); clean(f);
});

test('concurrent opens share one lookup and changed persona rejects its stale response', async t => {
    const f = await fixture(t, { hold: true }); await f.open();
    await f.page.evaluate(() => { __pages.ensure(); __pages.ensure(); });
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(f.requests.length, 2);
    await f.page.evaluate(() => __pages.setPersona('Other Persona', '29'));
    f.release(); await f.page.evaluate(() => __pages.ensure());
    assert.equal(await f.page.evaluate(() => __pages.cache()), null);
    assert.equal(await f.page.evaluate(() => __pages.context().persona), 'Other Persona');
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original); clean(f);
});

test('style detection joins an in-flight binding lookup without losing its result', async t => {
    const f = await fixture(t, { hold: true });
    await f.page.evaluate(() => { window.__bindingRead = __pages.ensure(true); window.__modeRead = __pages.ensure(); });
    f.release(); await f.page.evaluate(() => Promise.all([window.__bindingRead, window.__modeRead]));
    assert.equal(await f.page.evaluate(() => __pages.detect()), 'Staff');
    assert.equal(f.requests.length, 2, 'the equipment response is shared by binding and recognition');
    clean(f);
});

test('battle and puzzle pages never make character or equipment requests', async t => {
    for (const markup of ['<div id="textlog"></div>', '<div id="battle_main"></div>', '<div id="riddlemaster"></div>']) {
        const f = await fixture(t, { initialHtml: base + markup }); await f.open();
        await f.page.evaluate(() => __pages.ensure());
        assert.deepEqual(f.requests, []); assert.equal(await f.page.evaluate(() => __pages.cache()), null); clean(f);
    }
});

test('a server battle response or failed lookup never becomes an equipment observation', async t => {
    for (const option of [{ responseBattle: true }, { failed: true }]) {
        const f = await fixture(t, option); await f.open(); await f.page.evaluate(() => __pages.ensure());
        assert.equal(await f.page.evaluate(() => __pages.cache()), null);
        assert.equal(await f.page.locator('.jpx-config-detected').count(), 0);
        assert.equal(await f.page.evaluate(() => __pages.native()), f.original);
        assert.equal(f.page.url(), f.url); clean(f);
    }
});

test('entering combat before lookup completes prevents it from updating observations', async t => {
    const f = await fixture(t, { hold: true }); await f.open();
    await f.page.evaluate(() => __pages.enterBattle()); f.release();
    await f.page.evaluate(() => __pages.ensure());
    await new Promise(resolve => setTimeout(resolve, 100));
    assert.equal(await f.page.evaluate(() => __pages.cache()), null);
    assert.equal(await f.page.evaluate(() => __pages.native()), f.original); clean(f);
});
