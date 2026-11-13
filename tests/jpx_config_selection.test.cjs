'use strict';

// Real configuration-manager interactions in disposable offline contexts.
// Equipment recognition comes from the real DOM reader, never a forced style.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const normalized = config => { const copy=structuredClone(config); for (const mode of Object.values(copy.config || copy)) if(mode && Array.isArray(mode.supports) && Array.isArray(mode.attacks)) { mode.rules=[...mode.supports,...mode.attacks]; delete mode.supports;delete mode.attacks; } return copy; };
const rules = marker => ({ supports: [{ type: 'stop', customMessage: marker, conditions: [] }], attacks: [{ type: 'normalAttack' }] });
const html = equipment => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    '<div id="csp"><div id="navbar"></div></div>' + (equipment ? '<div id="eqsb">' +
    '<div class="eqb" onclick="location.href=\'/?equip_slot=1\'"><span>Main</span><span data-eid="123"></span></div>' +
    '<div class="eqb eqdisabled"><div>Off</div><div class="eqempty">...</div></div></div>' : '') + '</body></html>';

function expose() {
    initDoI18n(); loadBattleConfig();
    battleType = 'Arena'; battleStyle = getDetectedJpxBattleStyle();
    const copy = value => JSON.parse(JSON.stringify(value));
    let pauses = 0, signals = 0;
    const pause = pauseForJpxConfigApplication;
    pauseForJpxConfigApplication = () => { pauses++; return pause(); };
    window.addEventListener('storage', event => { if (event.key === jpxConfigApplyKey) signals++; });
    window.__selection = {
        open: renderSettings,
        theme: toggleJpxTheme,
        label: key => t('cM.' + key),
        library: () => getJpxConfigLibrary().readState(),
        get: id => getJpxConfigLibrary().get(id),
        add(envelope) {
            const entry = getJpxConfigLibrary().save(envelope);
            window.dispatchEvent(new Event('jpx:config-library')); return entry;
        },
        oldPlaceholders(entries, missingModes) {
            const stored = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix));
            for (const mode of missingModes) delete stored[mode];
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(stored));
            getJpxConfigLibrary().migrate(entries, 'selection-test-old-placeholders');
            window.dispatchEvent(new Event('jpx:config-library'));
        },
        snapshot: () => copy({ config: cfgBattle, stats: cfgStats, mode: getBattleMode(), selected: getJpxSelectedBattleMode(), detected: getDetectedJpxBattleStyle(),
            native: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) }),
        seed(config) {
            cfgBattle = {}; mergeCfg(copy(config), defaultCfgBattle, cfgBattle, 'battle');
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            refreshJpxSelectedConfig();
        },
        running: () => isActiveBattle,
        runtime: () => copy({rules:getJpxBattleRules(),mode:getBattleMode(),active:isActiveBattle,reason:readyNext,pauses,signals}),
        smart: () => smartBattle(),
        resetLobby() {
            log = null; battleStyle = ''; battleType = 'General';
            window.dispatchEvent(new Event('jpx:mode-detected'));
        },
        setBattleType(value) { battleType = value; window.dispatchEvent(new Event('jpx:mode-detected')); },
        externalReplace(mode, data) {
            cfgBattle[mode] = copy(data);
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            refreshJpxSelectedConfig();
            window.dispatchEvent(new Event('jpx:config-library'));
        },
        beginBattle() {
            log = document.createElement('div'); isActiveBattle = true;
            jpxPanelManager.updateContent = () => {};
            jpxPanelManager.setBackground = () => {};
            jpxPanelManager.dispatchState = () => {};
            jpxPanelManager.refreshAppearance = () => {};
        }
    };
}
assert.equal(source.split('\ninitDo();').length, 2, 'main startup anchor is unique');
const harness = source.replace('\ninitDo();', '\n(' + expose.toString() + ')();');
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => { await browser?.close(); });

async function initialize(page, { seed = false, equipment = true, language = '' } = {}) {
    if(language) await page.addScriptTag({content:fs.readFileSync(path.join(root,'JPX-PLUS-'+language+'.user.js'),'utf8')});
    if (equipment) await page.evaluate(() => { window.dynjs_equip = { '123': { n: '', t: 'Legendary Willow Staff of Destruction' } }; });
    await page.addScriptTag({ content: harness });
    if (seed) await page.evaluate(config => __selection.seed(config), { battleVersion: 20251216,
        OneHanded_General: rules('native single-hand'), OneHanded_Item: rules('native Item'),
        TwoHanded_General: rules('native two-hand'), Staff_General: rules('native staff'), Staff_Arena: rules('native staff arena') });
    await page.evaluate(() => __selection.open());
    await page.locator('#tab_configManager').click();
    await page.locator('.jpx-config-list').waitFor();
}

async function fixture(t, { equipment = true, language = '' } = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const errors = [], requests = [];
    context.on('page', page => { page.setDefaultTimeout(10000); page.on('pageerror', error => errors.push(error.message)); });
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: html(equipment) });
        if (route.request().method() === 'GET' && /^https:\/\/hentaiverse\.org\/(?:isekai\/)?\?s=Character&ss=(?:ch|eq)$/.test(route.request().url())) return route.fulfill({ status: 503, body: 'Character lookup unavailable in this fixture' });
        requests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage();
    await page.goto('https://hentaiverse.org/?s=Character');
    await initialize(page, { seed: true, equipment, language });
    const labels = await page.evaluate(() => Object.fromEntries(['apply', 'edit', 'save', 'updateApply', 'applied', 'currentStyle'].map(key => [key, __selection.label(key)])));
    return { page, context, errors, requests, labels, equipment };
}

const row = (page, id) => page.locator('.jpx-config-row[data-config-id="' + id + '"]');
const snapshot = page => page.evaluate(() => __selection.snapshot());
const library = page => page.evaluate(() => __selection.library());
async function addMode(page, title, mode) {
    return page.evaluate(({ title, mode, data }) => __selection.add({ schemaVersion: 1, kind: 'battle-mode', title, description: '', world: 'Persistent',
        mode, config: { battleVersion: 20251216, [mode]: data } }), { title, mode, data: rules(title) });
}
async function apply(page, entry, labels, confirm = false) {
    const target = row(page, entry.id);
    await target.getByRole('button', { name: labels.apply, exact: true }).click();
    if (confirm) await page.locator('.jpx-config-confirm').getByRole('button', { name: labels.apply, exact: true }).click();
    await target.locator('.jpx-config-status').waitFor();
}
async function assertCurrentBattle(page, expectedId) {
    const state = await library(page);
    assert.equal(state.active.Persistent, expectedId);
    const statsIds = state.entries.filter(entry => entry.envelope.kind === 'stats').map(entry => entry.id);
    const current = await page.locator('.jpx-config-row[data-active="true"]').evaluateAll(nodes => nodes.map(node => node.dataset.configId));
    assert.deepEqual(current.filter(id => !statsIds.includes(id)), [expectedId], 'exactly one battle config carries the current badge');
}
function assertClean(f) { assert.deepEqual(f.errors, []); assert.deepEqual(f.requests, []); }

test('explicit selection wins across detected weapons and scenes, with one current battle badge', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    assert.equal(await page.locator('#eqsb > .eqb.eqdisabled').getAttribute('onclick'), null, 'real Staff offhand is disabled and has no equip_slot link');
    assert.equal((await snapshot(page)).detected, 'Staff', 'equipped Staff is read through the real DOM helper');
    assert.equal((await snapshot(page)).mode, 'Staff_Arena');
    const first = await addMode(page, 'Single-hand Item', 'OneHanded_Item');
    const second = await addMode(page, 'Two-hand general', 'TwoHanded_General');
    await apply(page, first, labels);
    let observed = await snapshot(page), state = await library(page);
    assert.equal(observed.mode, 'OneHanded_Item', 'explicit scene and weapon choice are honored exactly');
    assert.equal(observed.selected, 'OneHanded_Item');
    assert.equal(observed.detected, 'Staff', 'selection does not falsify detected equipment');
    assert.equal(await row(page, 'native-Persistent-Staff_General').locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await row(page, first.id).locator('.jpx-config-detected').count(), 0, 'selected config does not acquire a false detected-style marker');
    assert.equal(state.applied.Persistent[first.id].mode, 'OneHanded_Item');
    await assertCurrentBattle(page, first.id);
    await apply(page, second, labels);
    observed = await snapshot(page); state = await library(page);
    assert.equal(observed.mode, 'TwoHanded_General');
    assert.equal(observed.detected, 'Staff');
    assert.equal(await row(page, 'native-Persistent-Staff_General').locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await row(page, second.id).locator('.jpx-config-detected').count(), 0, 'applying another weapon config cannot move the real current-style marker');
    assert.equal(state.applied.Persistent[second.id].mode, 'TwoHanded_General');
    await assertCurrentBattle(page, second.id);
    assert.equal(await row(page, first.id).locator('.jpx-config-status').count(), 0);
    assertClean(f);
});

test('fixed rules return to automatic selection and referenced configs can be deleted', { timeout: 45000 }, async t => {
    const f=await fixture(t), {page,labels}=f;
    const entry=await addMode(page,'Pinned Item','OneHanded_Item');
    await apply(page,entry,labels);
    assert.match(await page.locator('.jpx-config-selection').textContent(),/Fixed rules/);
    await page.getByRole('button',{name:'Restore automatic selection',exact:true}).click();
    assert.equal((await snapshot(page)).selected,'');
    assert.equal((await snapshot(page)).mode,'Staff_Arena');
    assert.ok((await library(page)).applied.Persistent[entry.id]);
    await page.reload();await initialize(page);
    assert.equal((await snapshot(page)).selected,'');
    const native=(await snapshot(page)).native;
    await row(page,entry.id).locator('.jpx-config-more').click();
    await page.locator('.jpx-config-menu').getByRole('button',{name:'Delete',exact:true}).click();
    await page.locator('.jpx-config-confirm').getByRole('button',{name:'Detach and delete',exact:true}).click();
    assert.equal(await row(page,entry.id).count(),0);
    assert.equal((await snapshot(page)).native,native);
    assert.equal((await library(page)).applied.Persistent?.[entry.id],undefined);
    assertClean(f);
});

test('scene panel assigns snapshots, inherits General, isolates worlds and pauses without rules', { timeout: 45000 }, async t => {
    const f=await fixture(t),{page,labels}=f;
    const general=await addMode(page,'My Staff General','Staff_General');
    const arena=await addMode(page,'My Staff Arena','Staff_Arena');
    await page.getByRole('button',{name:'Scene strategies',exact:true}).click();
    assert.equal(await page.locator('[data-scene-style] option').count(),10);
    assert.deepEqual(await page.locator('[data-scene]').evaluateAll(rows=>rows.map(row=>row.dataset.scene)),['General','Arena','Item','Encounter','Battle1000']);
    const assign=async(scene,entry)=>{
        const area=page.locator('[data-scene="'+scene+'"]');
        await area.locator('select').selectOption(entry?JSON.stringify([entry.id,entry.envelope.mode]):'');
        await area.getByRole('button',{name:'Assign',exact:true}).click();
    };
    const original=(await snapshot(page)).native;
    await assign('General',general);await assign('Arena',arena);
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'My Staff Arena');
    assert.equal((await snapshot(page)).native,original,'assignments do not overwrite native settings');
    await page.locator('[data-scene-style]').selectOption('OneHanded');
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'My Staff Arena');
    await page.locator('[data-scene-style]').selectOption('Staff');
    await page.locator('[data-scene-world]').selectOption('Isekai');
    assert.deepEqual(await page.locator('[data-scene]').evaluateAll(rows=>rows.map(row=>row.dataset.scene)),['General','Arena','Item','Tower','Battle1000']);
    assert.equal((await library(page)).scenes.Isekai,undefined);
    await page.locator('[data-scene-world]').selectOption('Persistent');
    await assign('Arena',null);
    assert.match(await page.locator('[data-scene="Arena"] select').evaluate(node=>node.selectedOptions[0].textContent),/Inherit General.*My Staff General/);
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'My Staff General');
    await page.reload();await initialize(page);
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'My Staff General');
    await apply(page,arena,labels);
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'My Staff Arena');
    await page.getByRole('button',{name:'Restore automatic selection',exact:true}).click();
    await page.getByRole('button',{name:'Scene strategies',exact:true}).click();
    await page.evaluate(()=>__selection.beginBattle());
    await assign('General',null);
    await page.evaluate(()=>__selection.smart());
    const missing=await page.evaluate(()=>__selection.runtime());
    assert.equal(missing.rules,null);assert.equal(missing.active,false);assert.match(missing.reason,/no scene or General/);
    assertClean(f);
});

test('another tab assigns scene snapshots without switching on save, and detach restores inheritance', {timeout:45000},async t=>{
    const f=await fixture(t), {page,context}=f;
    const settings=await context.newPage();await settings.goto('https://hentaiverse.org/?s=Character');await initialize(settings);
    const entry=await addMode(settings,'Assigned from another tab','Staff_Arena');
    await page.evaluate(()=>__selection.beginBattle());
    await settings.getByRole('button',{name:'Scene strategies',exact:true}).click();
    const area=settings.locator('[data-scene="Arena"]');
    await area.locator('select').selectOption(JSON.stringify([entry.id,entry.envelope.mode]));
    await area.getByRole('button',{name:'Assign',exact:true}).click();
    await page.waitForFunction(()=>__selection.runtime().rules.rules[0].customMessage==='Assigned from another tab'&&!__selection.running());
    await page.evaluate(()=>__selection.beginBattle());
    await addMode(settings,'Unused saved copy','Staff_General');
    await page.waitForFunction(()=>__selection.library().entries.some(entry=>entry.envelope.title==='Unused saved copy'));
    assert.equal(await page.evaluate(()=>__selection.running()),true);
    await settings.evaluate(()=>{const cfg=document.querySelector('.jpx-config-back');cfg.click();});
    await row(settings,entry.id).locator('.jpx-config-more').click();
    await settings.locator('.jpx-config-menu').getByRole('button',{name:'Delete',exact:true}).click();
    assert.match(await settings.locator('.jpx-config-confirm').textContent(),/Scene strategies/);
    await settings.locator('.jpx-config-confirm').getByRole('button',{name:'Detach and delete',exact:true}).click();
    await page.waitForFunction(()=>!__selection.running()&&__selection.runtime().mode==='Staff_General');
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'native staff');
    assertClean(f);
});

test('scene changes pause only affected battles once across local and remote tabs', {timeout:45000}, async t => {
    const f = await fixture(t), {page, context, labels} = f;
    const settings = await context.newPage();
    await settings.goto('https://hentaiverse.org/?s=Character'); await initialize(settings);
    const general = await addMode(settings, 'General A', 'Staff_General');
    const nextGeneral = await addMode(settings, 'General B', 'Staff_General');
    const arena = await addMode(settings, 'Arena A', 'Staff_Arena');
    const duplicate = await settings.evaluate(entry => __selection.add({...entry.envelope, title:'Same arena rules'}), arena);
    const other = await addMode(settings, 'Other style', 'OneHanded_General');
    for (const tab of [page, settings]) await tab.evaluate(() => __selection.beginBattle());
    await settings.getByRole('button', {name:'Scene strategies', exact:true}).click();
    await settings.locator('[data-scene-style]').selectOption('Staff');
    const assign = async (scene, entry, shouldPause) => {
        const before = await Promise.all([page, settings].map(tab => tab.evaluate(() => __selection.runtime())));
        const area = settings.locator('[data-scene="' + scene + '"]');
        await area.locator('select').selectOption(entry ? JSON.stringify([entry.id, entry.envelope.mode]) : '');
        await area.getByRole('button', {name:'Assign', exact:true}).click();
        await page.waitForFunction(count => __selection.runtime().signals > count, before[0].signals);
        const after = await Promise.all([page, settings].map(tab => tab.evaluate(() => __selection.runtime())));
        for (let index = 0; index < after.length; index++) {
            assert.equal(after[index].active, !shouldPause);
            assert.equal(after[index].pauses - before[index].pauses, shouldPause ? 1 : 0, 'only an effective change pauses, once');
        }
        assert.deepEqual(after[0].rules, after[1].rules);
        if (shouldPause) for (const tab of [page, settings]) await tab.evaluate(() => __selection.beginBattle());
    };
    await assign('General', general, false); // Native Arena still wins.
    await settings.locator('[data-scene-style]').selectOption('OneHanded');
    await assign('General', other, false);
    await settings.locator('[data-scene-style]').selectOption('Staff');
    await assign('Item', general, false);
    await assign('Arena', arena, true);
    await assign('Arena', duplicate, false); // Different ID, identical rules.
    await assign('Arena', null, true); // Now inherits General A.
    await assign('General', nextGeneral, true);
    await settings.locator('.jpx-config-back').click();
    await apply(settings, arena, labels);
    await page.waitForFunction(() => __selection.snapshot().selected === 'Staff_Arena' && !__selection.running());
    for (const tab of [page, settings]) await tab.evaluate(() => __selection.beginBattle());
    await settings.getByRole('button', {name:'Scene strategies', exact:true}).click();
    await settings.locator('[data-scene-style]').selectOption('Staff');
    await assign('General', general, false); // A fixed choice ignores scene edits.
    assertClean(f);
});

test('applying a physical config preserves the mage config and its explicit element', {timeout:45000}, async t => {
    const f = await fixture(t), {page, labels} = f;
    const mageRules = {...rules('Holy mage'), jpxPlusExecution:{style:'1H_Mage', element:'holy'}};
    const mage = await page.evaluate(data => __selection.add({schemaVersion:1, kind:'battle-mode', title:'Holy mage', description:'',
        world:'Persistent', mode:'1H_Mage_General', config:{battleVersion:20251216, '1H_Mage_General':data}}), mageRules);
    await apply(page, mage, labels);
    const before = (await snapshot(page)).config['1H_Mage_General'];
    const physical = await addMode(page, 'Physical general', 'OneHanded_General');
    await apply(page, physical, labels);
    assert.deepEqual((await snapshot(page)).config['1H_Mage_General'], before);
    assert.deepEqual(JSON.parse((await snapshot(page)).native)['1H_Mage_General'], before);
    assert.deepEqual((await library(page)).applied.Persistent[physical.id].scopes, ['OneHanded_General']);
    await page.reload(); await initialize(page);
    await apply(page, mage, labels);
    assert.equal((await snapshot(page)).selected, '1H_Mage_General');
    assert.equal((await page.evaluate(() => __selection.runtime())).rules.jpxPlusExecution.element, 'holy');
    assertClean(f);
});

test('multiple General configs keep their explicit assignment across saves sorting and reloads', {timeout:45000}, async t => {
    const f = await fixture(t), { page } = f;
    const first = await addMode(page, 'General A', 'Staff_General');
    const second = await addMode(page, 'General B', 'Staff_General');
    const assignGeneral = async entry => {
        const area = page.locator('[data-scene=General]');
        await area.locator('select').selectOption(JSON.stringify([entry.id, entry.envelope.mode]));
        await area.getByRole('button', {name:'Assign',exact:true}).click();
    };
    await page.getByRole('button', {name:'Scene strategies',exact:true}).click();
    await assignGeneral(second);
    const arena = page.locator('[data-scene=Arena]');
    await arena.locator('select').selectOption('');
    await arena.getByRole('button', {name:'Assign',exact:true}).click();
    assert.equal((await page.evaluate(() => __selection.runtime())).rules.rules[0].customMessage, 'General B');
    await addMode(page, 'General C', 'Staff_General');
    await page.locator('.jpx-config-back').click();
    await page.locator('[data-config-sort]').selectOption('name');
    await row(page, second.id).getByRole('button', {name:'Edit',exact:true}).click();
    const editor = page.locator('.jpx-config-editor');
    await editor.locator('#jpx-rule-panel-rules .jpx-rule-state-toggle').first().click();
    await editor.locator('.jpx-config-editor-footer').getByRole('button', {name:'Save',exact:true}).click();
    assert.equal((await page.evaluate(() => __selection.runtime())).rules.rules[0].disabled, undefined, 'saved edits do not replace assigned rules');
    await page.reload(); await initialize(page);
    assert.equal((await snapshot(page)).selected, '');
    assert.equal((await page.evaluate(() => __selection.runtime())).rules.rules[0].customMessage, 'General B');
    assert.equal((await library(page)).scenes.Persistent.Staff_General.id, second.id);
    await page.getByRole('button', {name:'Scene strategies',exact:true}).click();
    await assignGeneral(first);
    assert.equal((await page.evaluate(() => __selection.runtime())).rules.rules[0].customMessage, 'General A');
    assertClean(f);
});

for(const width of [1440,390,320]) test('scene strategies fit viewport '+width, async t=>{
    const f=await fixture(t),{page}=f;
    await page.setViewportSize({width,height:900});
    await page.getByRole('button',{name:'Scene strategies',exact:true}).click();
    const geometry=await page.locator('#settings-container').evaluate(node=>{
        const rect=node.getBoundingClientRect();
        return {left:rect.left,right:rect.right,width:innerWidth,body:[...node.querySelectorAll('.jpx-config-body')].map(el=>({client:el.clientWidth,scroll:el.scrollWidth})),
            controls:[...node.querySelectorAll('.jpx-scene-controls select,.jpx-scene-controls button')].filter(el=>el.getClientRects().length).map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width};})};
    });
    assert.ok(geometry.left>=-1&&geometry.right<=width+1,JSON.stringify(geometry));
    assert.ok(geometry.body.every(x=>x.scroll<=x.client+1),JSON.stringify(geometry));
    assert.ok(geometry.controls.every(x=>x.left>=geometry.left&&x.right<=geometry.right+1&&x.width>30),JSON.stringify(geometry));
    await page.locator('#settings-container').screenshot({path:path.join(root,'.test-output','scene-strategies-'+width+'.png')});
    assertClean(f);
});

test('scene edits reveal only pending actions, cancel without writes and restore focus after assign',async t=>{
    const f=await fixture(t),{page}=f;
    const entry=await addMode(page,'Arena alternative','Staff_Arena');
    await page.getByRole('button',{name:'Scene strategies',exact:true}).click();
    assert.equal(await page.locator('.jpx-scene-pending:visible').count(),0);
    assert.equal(await page.locator('.jpx-scene-resolved,.jpx-scene-executing').count(),0);
    const original=await library(page),area=page.locator('[data-scene=Arena]'),picker=area.locator('select');
    const initial=await picker.inputValue();
    await picker.selectOption(JSON.stringify([entry.id,entry.envelope.mode]));
    assert.equal(await page.locator('.jpx-scene-pending:visible').count(),1);
    assert.deepEqual(await library(page),original,'selecting a draft does not apply it');
    await area.getByRole('button',{name:'Cancel',exact:true}).click();
    assert.equal(await picker.inputValue(),initial);
    assert.equal(await picker.evaluate(node=>node===document.activeElement),true);
    assert.deepEqual(await library(page),original);
    await picker.selectOption(JSON.stringify([entry.id,entry.envelope.mode]));
    await area.getByRole('button',{name:'Assign',exact:true}).click();
    assert.equal(await area.locator('select').evaluate(node=>node===document.activeElement),true);
    assert.equal(await page.locator('.jpx-scene-pending:visible').count(),0);
    assert.equal((await page.evaluate(()=>__selection.runtime())).rules.rules[0].customMessage,'Arena alternative');
    assertClean(f);
});

for(const options of [
    {width:1440,height:960,language:'ZhCN',dark:false},
    {width:1440,height:960,language:'',dark:true},
    {width:375,height:812,language:'ZhCN',dark:false},
    {width:375,height:812,language:'ZhCN',dark:true},
    {width:812,height:375,language:'',dark:true},
    {width:320,height:568,language:'Ja',dark:false},
    {width:320,height:568,language:'ZhTW',dark:false},
    {width:320,height:568,language:'ZhHK',dark:true},
    {width:390,height:844,language:'Ko',dark:true}
]) test('compact scenes support themes, touch and text scaling '+JSON.stringify(options),async t=>{
    const f=await fixture(t,options),{page}=f;
    await page.setViewportSize({width:options.width,height:options.height});
    if(options.dark)await page.evaluate(()=>__selection.theme());
    const sceneLabel=await page.evaluate(()=>__selection.label('sceneAssignments'));
    const entry=await addMode(page,'用于长配置名称的策略 Long strategy name that must remain selectable','Staff_Arena');
    await page.getByRole('button',{name:sceneLabel,exact:true}).click();
    const area=page.locator('[data-scene=Arena]');
    await area.locator('select').selectOption(JSON.stringify([entry.id,entry.envelope.mode]));
    const buttons=area.locator('.jpx-scene-pending button');await buttons.first().scrollIntoViewIfNeeded();
    const geometry=await page.locator('#settings-container').evaluate(node=>{
        const bounds=node.getBoundingClientRect();
        return {left:bounds.left,right:bounds.right,scroll:[...node.querySelectorAll('.jpx-scenes-body,.jpx-scenes-table')].map(x=>[x.clientWidth,x.scrollWidth]),
            controls:[...node.querySelectorAll('.jpx-scenes-body button,.jpx-scenes-body select')].filter(x=>x.getClientRects().length).map(x=>{const r=x.getBoundingClientRect();return {left:r.left,right:r.right,height:r.height};})};
    });
    assert.ok(geometry.scroll.every(([client,scroll])=>scroll<=client+1),JSON.stringify(geometry));
    assert.ok(geometry.controls.every(x=>x.left>=geometry.left&&x.right<=geometry.right+1),JSON.stringify(geometry));
    if(options.width<600)assert.ok(geometry.controls.every(x=>x.height>=43.9),JSON.stringify(geometry));
    const file='uiux-scenes-'+options.width+'-'+(options.language||'en')+'-'+(options.dark?'dark':'light')+'.png';
    await page.locator('#settings-container').screenshot({path:path.join(root,'.test-output',file)});
    await area.locator('select').click();
    const choice=area.locator('option').filter({hasText:entry.envelope.title});
    assert.equal(await choice.textContent(),entry.envelope.title);
    const choiceBounds=await choice.evaluate(node=>({left:node.getBoundingClientRect().left,right:node.getBoundingClientRect().right,client:node.clientWidth,scroll:node.scrollWidth}));
    assert.ok(choiceBounds.left>=0&&choiceBounds.right<=options.width+1&&choiceBounds.scroll<=choiceBounds.client+1,JSON.stringify(choiceBounds));
    await choice.click();
    assert.deepEqual((await library(page)).scenes?.Persistent?.Staff_Arena,undefined,'opening a picker never assigns its draft');
    await page.addStyleTag({content:'#settings-container .jpx-scenes-body{font-size:20px}#settings-container .jpx-scene-context select,#settings-container .jpx-scene-controls select,#settings-container .jpx-scene-pending button{font-size:20px}'});
    assert.equal(await page.locator('.jpx-scenes-body,.jpx-scenes-table').evaluateAll(nodes=>nodes.every(node=>node.scrollWidth<=node.clientWidth+1)),true);
    assertClean(f);
});

test('lobby rows show the real current style and native active group without a top detection label', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    await page.evaluate(() => __selection.resetLobby());
    assert.equal((await snapshot(page)).detected, 'Staff');
    assert.equal((await library(page)).active?.Persistent, undefined, 'lobby has no explicit applied selection');
    const staff = row(page, 'native-Persistent-Staff_General');
    assert.equal(await staff.locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await staff.getAttribute('data-active'), 'true', 'real lobby equipment selects Staff General for its native current badge');
    assert.equal(await page.locator('.jpx-config-row[data-config-id="native-Persistent-Unarmed_General"][data-active="true"]').count(), 0);
    assert.equal(await row(page, 'native-Persistent-OneHanded_General').locator('.jpx-config-detected').count(), 0);
    assert.equal(await page.locator('.jpx-config-toolbar .jpx-config-detected, .jpx-config-detection').count(), 0, 'detection belongs only beside matching row styles');
    await staff.scrollIntoViewIfNeeded();
    const output = path.join(root, '.test-output/config-management');
    fs.mkdirSync(output, { recursive: true });
    await page.locator('#settings-container').screenshot({ path: path.join(output, 'current-style-list.png') });
    const examples = await page.evaluate(data => ['Persistent', 'Isekai', 'Any'].map(world => __selection.add({ schemaVersion: 1,
        kind: 'battle-mode', title: 'Staff in ' + world, description: '', world, mode: 'Staff_General',
        config: { battleVersion: 20251216, Staff_General: data } })), rules('world marker'));
    for (const entry of examples) {
        assert.equal(await row(page, entry.id).locator('.jpx-config-detected').count(), entry.envelope.world === 'Isekai' ? 0 : 1,
            'current-style marker is restricted to the current world or both worlds');
    }
    assertClean(f);
});

test('old untouched native placeholders stay hidden while saved empty drafts and edited native copies remain', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page } = f;
    const empty = { supports: [], attacks: [] };
    const makeEntry = (id, mode, config, revision = 1) => ({ id, revision, source: { type: 'native' }, envelope: {
        schemaVersion: 1, kind: 'battle-mode', title: id, description: '', world: 'Persistent', mode,
        config: { battleVersion: 20251216, [mode]: config }
    } });
    const old = [
        makeEntry('old-empty-native', 'OneHanded_Tower', empty),
        makeEntry('old-missing-native', 'DualWielding_Tower', rules('Old generated defaults')),
        makeEntry('old-edited-native', 'TwoHanded_Tower', empty, 2)
    ];
    await page.evaluate(entries => __selection.oldPlaceholders(entries, ['DualWielding_Tower', 'TwoHanded_Tower']), old);
    const manual = await page.evaluate(data => __selection.add({ schemaVersion: 1, kind: 'battle-mode', title: 'My empty draft', description: '',
        world: 'Persistent', mode: 'Staff_Tower', config: { battleVersion: 20251216, Staff_Tower: data } }), empty);
    assert.equal(await row(page, 'old-empty-native').count(), 0, 'untouched generated empty slot is hidden');
    assert.equal(await row(page, 'old-missing-native').count(), 0, 'generated slot absent from actual native storage is hidden');
    assert.equal(await row(page, 'old-edited-native').count(), 1, 'editing makes even an empty native copy intentional');
    assert.equal(await row(page, manual.id).count(), 1, 'a deliberately saved empty draft remains available');
    const beforeNavigation = await library(page);
    for (const original of old) {
        const stored = beforeNavigation.entries.find(entry => entry.id === original.id);
        assert.deepEqual(stored.envelope, normalized(original.envelope), 'hidden placeholders are retained without data loss');
        assert.equal(stored.revision, original.revision);
    }
    await page.locator('#tab_stats').click(); await page.locator('#tab_configManager').click();
    assert.equal(await row(page, 'old-empty-native').count(), 0);
    assert.equal(await row(page, 'old-missing-native').count(), 0);
    assert.equal(await row(page, 'old-edited-native').count(), 1);
    assert.equal(await row(page, manual.id).count(), 1);
    assert.deepEqual(await library(page), beforeNavigation, 'rendering and navigation do not rewrite stored entries');
    assertClean(f);
});

test('unknown detection stays honest while an explicit selected mode survives a reload', { timeout: 45000 }, async t => {
    const f = await fixture(t, { equipment: false }), { page, labels } = f;
    assert.equal((await snapshot(page)).detected, '');
    assert.equal(await page.locator('.jpx-config-detected, .jpx-config-detection').count(), 0, 'no evidence means no current-style marker');
    const entry = await addMode(page, 'Persistent selected Item', 'OneHanded_Item');
    await apply(page, entry, labels);
    assert.equal((await snapshot(page)).mode, 'OneHanded_Item');
    await page.reload();
    await initialize(page, { equipment: false });
    const observed = await snapshot(page);
    assert.equal(observed.detected, '');
    assert.equal(observed.mode, 'OneHanded_Item');
    assert.equal(observed.selected, 'OneHanded_Item');
    assert.equal(await page.locator('.jpx-config-detected, .jpx-config-detection').count(), 0);
    await assertCurrentBattle(page, entry.id);
    assertClean(f);
});

test('an invalidated applied snapshot falls back to detected rules and does not suppress their current badge', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    await page.evaluate(() => __selection.setBattleType('General'));
    const entry = await addMode(page, 'Selected single hand', 'OneHanded_General');
    await apply(page, entry, labels);
    const appliedBefore = (await library(page)).applied.Persistent[entry.id];
    assert.equal((await snapshot(page)).mode, 'OneHanded_General');
    await page.evaluate(({ mode, data }) => __selection.externalReplace(mode, data), { mode: 'OneHanded_General', data: rules('External native change') });
    const observed = await snapshot(page), state = await library(page);
    assert.equal(observed.detected, 'Staff');
    assert.equal(observed.selected, '', 'an applied snapshot which no longer matches native rules cannot stay selected');
    assert.equal(observed.mode, 'Staff_General');
    assert.deepEqual(state.applied.Persistent[entry.id], appliedBefore, 'mismatch handling does not rewrite the historical applied snapshot');
    assert.equal(await row(page, entry.id).getAttribute('data-active'), 'false');
    assert.equal(await row(page, 'native-Persistent-Staff_General').getAttribute('data-active'), 'true');
    const current = await page.locator('.jpx-config-row[data-active="true"]').evaluateAll(nodes => nodes.map(node => node.dataset.configId));
    assert.deepEqual(current, ['native-Persistent-Staff_General'], 'stale active selection cannot hide the still-matching native fallback');
    assertClean(f);
});

test('whole battle packages restore native selection and statistics have an independent active slot', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const single = await addMode(page, 'Single Item', 'OneHanded_Item');
    await apply(page, single, labels);
    const whole = await page.evaluate(config => __selection.add({ schemaVersion: 1, kind: 'battle', title: 'All battle groups', description: '',
        world: 'Persistent', config }), { battleVersion: 20251216, Staff_General: rules('package staff'), Staff_Arena: rules('package arena'), OneHanded_Item: rules('package item') });
    await apply(page, whole, labels, true);
    let observed = await snapshot(page), state = await library(page);
    assert.equal(observed.selected, '');
    assert.equal(observed.mode, 'Staff_Arena', 'whole package uses actual Staff and Arena evidence');
    assert.equal(Object.hasOwn(state.applied.Persistent[whole.id], 'mode'), false);
    await assertCurrentBattle(page, whole.id);
    const selectedBeforeStats = state.active.Persistent;
    const stats = await page.evaluate(() => __selection.add({ schemaVersion: 1, kind: 'stats', title: 'Stats only', description: '', world: 'Any',
        config: { statsVersion: 20260109, statsColumns: [{ id: 'date', customName: 'Selected date' }] } }));
    const battleBeforeStats = observed.config;
    await apply(page, stats, labels, true);
    observed = await snapshot(page); state = await library(page);
    assert.equal(state.active.Any, stats.id);
    assert.equal(state.active.Persistent, selectedBeforeStats);
    assert.equal(observed.mode, 'Staff_Arena');
    assert.deepEqual(observed.config, battleBeforeStats);
    await assertCurrentBattle(page, whole.id);
    assertClean(f);
});

test('saving an active draft retains its applied snapshot until Update & apply is clicked', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const entry = await addMode(page, 'Editable current', 'OneHanded_Item');
    await apply(page, entry, labels);
    const before = await snapshot(page), previous = await library(page);
    await row(page, entry.id).getByRole('button', { name: labels.edit, exact: true }).click();
    const editor = page.locator('.jpx-config-editor');
    await editor.locator('#jpx-rule-panel-rules .jpx-rule-state-toggle').first().click();
    await editor.locator('.jpx-config-editor-footer').getByRole('button', { name: labels.save, exact: true }).click();
    await row(page, entry.id).getByRole('button', { name: labels.updateApply, exact: true }).waitFor();
    const state = await library(page), saved = state.entries.find(item => item.id === entry.id);
    assert.equal(saved.revision, entry.revision + 1);
    assert.equal(saved.envelope.config.OneHanded_Item.rules[0].disabled, true);
    assert.deepEqual(state.applied.Persistent[entry.id], previous.applied.Persistent[entry.id]);
    assert.deepEqual(await snapshot(page), before, 'saving never mutates the runtime or native storage');
    await assertCurrentBattle(page, entry.id);
    await row(page, entry.id).getByRole('button', { name: labels.updateApply, exact: true }).click();
    await page.waitForFunction(id => __selection.library().applied.Persistent[id].revision === __selection.get(id).revision, entry.id);
    assert.equal((await snapshot(page)).config.OneHanded_Item.rules[0].disabled, true);
    assert.equal((await snapshot(page)).mode, 'OneHanded_Item');
    await assertCurrentBattle(page, entry.id);
    assertClean(f);
});

test('another tab changes the exact selected mode and pauses a running battle before it is used', { timeout: 45000 }, async t => {
    const f = await fixture(t, { equipment: false }), { page: battlePage, context, labels } = f;
    await battlePage.evaluate(() => __selection.beginBattle());
    assert.equal(await battlePage.evaluate(() => __selection.running()), true);
    assert.equal((await snapshot(battlePage)).detected, '');
    const settingsPage = await context.newPage();
    await settingsPage.goto('https://hentaiverse.org/?s=Character');
    await initialize(settingsPage, { equipment: false });
    const entry = await addMode(settingsPage, 'From another tab', 'TwoHanded_Item');
    await apply(settingsPage, entry, labels);
    await battlePage.waitForFunction(() => __selection.snapshot().selected === 'TwoHanded_Item' && !__selection.running());
    const observed = await snapshot(battlePage);
    assert.equal(observed.mode, 'TwoHanded_Item');
    assert.equal(observed.detected, '');
    assert.equal(observed.config.TwoHanded_Item.rules[0].customMessage, 'From another tab');
    await assertCurrentBattle(battlePage, entry.id);
    assertClean(f);
});

test('success notices expire after four seconds, replace cleanly, clear on navigation and preserve scroll', { timeout: 60000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const addFilledRows = group => page.evaluate(({ group, data }) => {
        for (let i = 0; i < 12; i++) __selection.add({ schemaVersion: 1, kind: 'battle-mode', title: 'Timer ' + group + ' ' + i,
            description: '', world: 'Persistent', mode: 'Staff_General', config: { battleVersion: 20251216, Staff_General: data } });
    }, { group, data: rules('Saved list content') });
    await addFilledRows('before');
    const first = await addMode(page, 'Timer first', 'OneHanded_Item');
    const second = await addMode(page, 'Timer second', 'TwoHanded_General');
    await addFilledRows('after');
    await page.locator('.jpx-config-toolbar input[type=search]').fill('Timer');
    await page.locator('[data-config-sort]').selectOption('manual');
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    const notice = page.locator('.jpx-config-notice');
    await apply(page, first, labels);
    assert.equal(await notice.textContent(), labels.applied);
    await page.clock.runFor(3999);
    assert.equal(await notice.textContent(), labels.applied);
    await page.clock.runFor(1);
    assert.equal(await notice.textContent(), '');

    await apply(page, second, labels);
    await page.clock.runFor(2500);
    await apply(page, first, labels);
    await page.clock.runFor(1501);
    assert.equal(await notice.textContent(), labels.applied, 'replacement cancels the previous timeout');
    await page.clock.runFor(2499);
    assert.equal(await notice.textContent(), '');

    await apply(page, second, labels);
    await page.locator('#tab_stats').click();
    assert.equal(await notice.textContent(), '');
    await page.locator('#tab_configManager').click();
    assert.equal(await notice.textContent(), '');
    await page.clock.runFor(5000);

    const target = row(page, first.id);
    await target.scrollIntoViewIfNeeded();
    // Put the chosen entry inside a non-edge scroll position before measuring.
    const before = await page.locator('.jpx-config-body').evaluate(node => {
        node.scrollTop = Math.max(0, node.scrollTop - 80);
        const rect = node.getBoundingClientRect();
        return { top: node.scrollTop, height: node.clientHeight, rectTop: rect.top, rectHeight: rect.height };
    });
    assert.ok(before.top > 0, 'explicitly saved configs create a genuinely scrollable list');
    await apply(page, first, labels);
    await page.clock.runFor(32);
    let after = await page.locator('.jpx-config-body').evaluate(node => ({ top: node.scrollTop, height: node.clientHeight, rectTop: node.getBoundingClientRect().top, rectHeight: node.getBoundingClientRect().height }));
    assert.deepEqual(after, before, 'showing a notice neither moves nor resizes the list');
    await page.clock.runFor(4000);
    after = await page.locator('.jpx-config-body').evaluate(node => ({ top: node.scrollTop, height: node.clientHeight, rectTop: node.getBoundingClientRect().top, rectHeight: node.getBoundingClientRect().height }));
    assert.deepEqual(after, before, 'removing a notice neither moves nor resizes the list');
    assert.equal(await notice.textContent(), '');
    assertClean(f);
});
