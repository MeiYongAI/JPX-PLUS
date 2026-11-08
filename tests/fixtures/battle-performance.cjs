'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../..');
const source = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const spell = (name, icon, available = true) => '<div onmouseover="set_infopane_spell(\'' + name + '\', \'Fixture\', \'' + icon + '\', 10, 0, 5)"' + (available ? ' onclick="window.__casts++"' : '') + '>' + name + '</div>';
const effect = (name, turns) => '<img src="/y/e/fixture.png" onmouseover="show(\'' + name + '\', \'Fixture\', ' + turns + ')">';
function mainHTML(rows = 100) {
    const spells = spell('Cure', '0533', false) + spell('Regen', '0534') + spell('Haste', '0541') + Array.from({ length: 60 }, (_, i) => spell('Test Spell ' + i, '0101')).join('');
    const log = '<tr><td class="tl">You hit Fixture Monster for 1234 slashing damage.</td></tr><tr><td class="tl">You attack Fixture Monster 0.</td></tr><tr><td class="tls"></td></tr>' + Array.from({ length: rows }, () => '<tr><td class="tl">Fixture Monster hits you for 10 crushing damage.</td></tr>').join('');
    return '<div id="pane_vitals"><img src="/y/green.png" style="width:400px"><span id="vrhb">10000</span><img src="/y/bar_blue.png" style="width:180px"><span id="vrm">900</span><img src="/y/bar_red.png" style="width:180px"><span id="vrs">700</span></div><img id="ckey_spirit" src="/y/spirit_n.png"><div id="pane_effects">' + ['Haste', 'Regen', 'Heartseeker', 'Protection', 'Spark of Life', 'Spirit Shield'].map(name => '<div>' + effect(name, 15) + '</div>').join('') + '</div><div id="battle_right">' + Array.from({ length: 10 }, (_, i) => '<div class="btm1" id="mkey_' + ((i + 1) % 10) + '" onclick="window.__attacks++"><div class="btm2"><div><img src="/y/battle/mon_a.png"></div><div>400</div></div><div class="btm3"><div><div>Fixture Monster ' + i + '</div></div></div><div class="btm4"><img src="/y/s/nbargreen.png" style="width:110px"><img src="/y/s/nbarblue.png" style="width:90px"><img src="/y/s/nbarred.png" style="width:90px"></div><div class="btm6">' + ['Imperil', 'Weaken', 'Slow', 'Searing Skin'].map(name => effect(name, 10)).join('') + '</div></div>').join('') + '</div><div id="battle_left"><div class="bts">' + spells + '</div><div class="bti3"><div id="ikey_p" onclick="window.__casts++" onmouseover="set_infopane_item(10005)">Health Gem</div></div><div id="quickbar"><div class="btqs" id="native-cure" onmouseover="set_infopane_spell(\'Cure\', \'Fixture\', \'0533\', 10, 0, 5)"><img class="btqi" src="/y/a/0533.png"></div></div><table id="textlog"><tbody>' + log + '</tbody></table></div>';
}
const html = '<!doctype html><meta charset="utf-8"><style>body{font:12px Arial;background:#edebdf}#csp{width:1200px;margin:auto}.btm1{display:block;width:230px;height:85px;border:1px solid #987}.btm2,.btm3{display:flex}.btm6{display:flex}.btm6>img{width:24px;height:24px}#battle_left{width:900px}#quickbar,.bts{display:flex;flex-wrap:wrap}.btqs{position:relative;width:30px;height:32px}.bts>div{width:90px;height:18px}#pane_effects{display:flex}#pane_effects>div{position:relative;width:40px;height:24px}table{border-collapse:collapse}</style><div id="csp"><div id="navbar"></div><div id="battle_main"></div></div>';
function expose(initial) {
    initDoI18n(); cfgBattle = JSON.parse(JSON.stringify(defaultCfgBattle)); ensureJpxStyle();
    window.__casts = 0; window.__attacks = 0;
    window.GM_xmlhttpRequest = () => { throw Error('Unexpected live request'); };
    battleStyle = 'TwoHanded'; battleType = 'General'; roundInfo = { current: 1, total: 100 };
    let reads = 0, stages = {};
    const getLog = getBattleLogHTML;
    getBattleLogHTML = (...args) => { reads++; return getLog(...args); };
    function reset(main = initial, visuals = true) {
        document.getElementById('battle_main').innerHTML = main;
        log = document.getElementById('textlog'); isActiveBattle = false;
        timeRecords = jpxUtils.createTimeRecords(); combatRecords = jpxUtils.createCombatRecords(); revenueRecords = jpxUtils.createRevenueRecords();
        timeRecords.turn = 12; timeRecords.lastUse.Cure = 10;
        monsterData = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, maxHP: 20000, level: 400, name: 'Fixture Monster ' + i }));
        allMonsterInfo = Object.fromEntries(monsterData.map((_, i) => ['mkey_' + ((i + 1) % 10), { monsterClass: 'Humanoid', attack: 'Slashing', plvl: 1000 }]));
        monstersEffects = {}; actionCounts = { history: [] };
        for (const key of ['showDurations', 'showCooldowns', 'showMonsterInfo', 'showMonsterIndex', 'showMonsterHP']) cfgBattle[key] = visuals;
        cfgBattle.recordBattleLog = false;
        cfgBattle.quickbarExtend = visuals ? ['Cure', 'Regen', 'Haste', 'ikey_p', ...Array.from({ length: 8 }, (_, i) => 'Test Spell ' + i)] : [];
        if (!jpxPanelManager.ctrlWidget) jpxPanelManager.createCtrlWidget('battle');
    }
    function measure(kind = 'render') {
        const create = document.createElement, innerText = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
        let created = 0, layoutReads = 0;
        const observer = new MutationObserver(() => {});
        observer.observe(document.getElementById('battle_main'), { subtree: true, childList: true, attributes: true, characterData: true });
        document.createElement = function(...args) { created++; return create.apply(this, args); };
        Object.defineProperty(HTMLElement.prototype, 'innerText', { ...innerText, get() { layoutReads++; return innerText.get.call(this); } });
        reads = 0;
        try {
            (kind === 'process' ? preProcessLog : preRender)();
            return { created, layoutReads, logReads: reads, mutations: observer.takeRecords().length };
        } finally { document.createElement = create; Object.defineProperty(HTMLElement.prototype, 'innerText', innerText); observer.disconnect(); }
    }
    window.__perf = {
        reset, measure, render: () => preRender(), process: () => preProcessLog(), vitals: getVitals,
        monsters: () => { monstersObj = getMonsters(false); return snapshot().monsters; },
        options: values => Object.assign(cfgBattle, values), advance: value => { timeRecords.turn = value; },
        effects: getEffectDuration,
        hideEffects(value) { monstersEffects = value; monstersObj = getMonsters(false); updateMonsterEffects(); },
        record: () => battleRecorder(), snapshot, profile() {
            for (const name of ['battleRecorder', 'getActionCooldowns', 'getVitals', 'getMonsters', 'updateMonsterEffects', 'getEffectDuration', 'preRender']) {
                const original = eval(name);
                eval(name + ' = function(...args) { const start = performance.now(); try { return original(...args); } finally { stages[name] = (stages[name] || 0) + performance.now() - start; } }');
            }
        }, clearStages: () => { stages = {}; }, stages: () => stages
    };
    function snapshot() {
        return { vitals, spellCooldowns, itemCooldowns, playerEffectsObj,
            monsters: monstersObj.monsters.map(m => ({ name: m.name, level: m.level, type: m.type, hp: m.hpPercentage, effects: m.effectObj })),
            turn: timeRecords.turn, action: timeRecords.action, combatRecords, revenueRecords };
    }
    reset();
}
async function open(context, options = {}) {
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => route.request().isNavigationRequest() ? route.fulfill({ contentType: 'text/html', body: html }) : route.fulfill({ status: 204, body: '' }));
    await page.goto('https://hentaiverse.org/');
    const input = options.source || source;
    if (!input.includes('\ninitDo();')) throw Error('Missing startup anchor');
    if (options.translation === 'before') await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'HentaiVerse-Chinese.user.js'), 'utf8') });
    await page.addScriptTag({ content: input.replace('\ninitDo();', '\n(' + expose.toString() + ')(' + JSON.stringify(mainHTML(options.rows)) + ');') });
    if (options.translation === 'after') await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'HentaiVerse-Chinese.user.js'), 'utf8') });
    return { page, errors };
}
module.exports = { open, mainHTML, source };
