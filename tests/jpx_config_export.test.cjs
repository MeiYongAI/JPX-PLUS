'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..'), output = path.join(root, '.test-output/config-management');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
function expose() {
    initDoI18n(); loadBattleConfig(); battleStyle = 'TwoHanded'; battleType = 'Tower';
    const copy = value => JSON.parse(JSON.stringify(value));
    const rules = name => ({ supports: [{ type: 'stop', customMessage: name, conditions: [] }], attacks: [{ type: 'normalAttack' }], futureMode: { keep: [1, false, 'x'] } });
    cfgBattle.TwoHanded_General = rules('General'); cfgBattle.TwoHanded_Tower = rules('Tower'); cfgBattle.OneHanded_General = rules('Shield');
    window.__exportTest = {
        open: renderSettings, theme: toggleJpxTheme,
        snapshot: () => ({ config: copy(cfgBattle), storage: Object.fromEntries(Object.keys(localStorage).map(key => [key, localStorage.getItem(key)])) }),
        combat() { log = document.createElement('table'); log.id = 'textlog'; document.getElementById('csp').append(log); },
        select(mode) {
            const library = getJpxConfigLibrary(), entry = library.save({ schemaVersion: 1, kind: 'battle-mode', title: 'Selected override', world: jpxConfigWorld(), mode,
                config: { battleVersion: cfgBattle.battleVersion, [mode]: copy(cfgBattle[mode]) } });
            library.setApplied(jpxConfigWorld(), { id: entry.id, revision: entry.revision, mode, scopes: [mode], config: entry.envelope.config }, { activate: true });
            refreshJpxSelectedConfig();
        },
        assign(withoutNative = false) {
            const library=getJpxConfigLibrary(),mode='TwoHanded_General';
            const entry=library.save({schemaVersion:1,kind:'battle-mode',title:'Assigned export',world:jpxConfigWorld(),mode,
                config:{battleVersion:cfgBattle.battleVersion,[mode]:rules('Assigned export')}});
            library.assignScene(jpxConfigWorld(),'TwoHanded_Tower',entry.id,mode,entry.revision);
            if (withoutNative) delete cfgBattle.TwoHanded_Tower;
            refreshJpxSelectedConfig();
        },
        manyRules() { for (const mode of BATTLE_MODES) cfgBattle[mode] = rules(mode); }
    };
}
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); fs.mkdirSync(output, { recursive: true }); });
after(async () => browser?.close());
async function fixture(t, { isekai = false, combat = true, language = '', dark = false, width = 1440, height = 960, many = false, wideGame = false, meta = true } = {}) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width < 600, hasTouch: width < 600 });
    t.after(() => context.close());
    const page = await context.newPage(), errors = [], requests = [], downloads = [];
    page.on('pageerror', error => errors.push(error.message)); page.on('download', download => downloads.push(download));
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><meta charset="utf-8">' + (meta ? '<meta name="viewport" content="width=device-width,initial-scale=1">' : '') + '<body><div id="csp"' + (wideGame ? ' style="width:1240px;height:704px"' : '') + '><div id="navbar"></div></div></body></html>' });
        requests.push(route.request().url()); return route.abort();
    });
    await page.goto('https://hentaiverse.org/' + (isekai ? 'isekai/' : ''));
    if (language) await page.addScriptTag({ content: fs.readFileSync(path.join(root, `JPX-PLUS-${language}.user.js`), 'utf8') });
    await page.addScriptTag({ content: source.replace('\ninitDo();', '\n(' + expose.toString() + ')();') });
    if (combat) await page.evaluate(() => __exportTest.combat());
    if (many) await page.evaluate(() => __exportTest.manyRules());
    if (dark) await page.evaluate(() => __exportTest.theme());
    await page.evaluate(() => __exportTest.open());
    const original = await page.evaluate(() => __exportTest.snapshot());
    await page.locator('#export-button').click(); await page.locator('#jpx-battle-export').waitFor();
    return { page, errors, requests, downloads, original };
}
async function download(f) {
    const waiting = f.page.waitForEvent('download'); await f.page.locator('.jpx-export-submit').click(); const file = await waiting;
    return { name: file.suggestedFilename(), data: JSON.parse(fs.readFileSync(await file.path(), 'utf8')) };
}
async function clean(f) {
    assert.deepEqual(await f.page.evaluate(() => __exportTest.snapshot()), f.original, 'export changes neither active configuration nor persistence');
    assert.deepEqual(f.errors, []); assert.deepEqual(f.requests, [], 'export is entirely local');
}

for (const isekai of [false, true]) test(`current rules export the actual scene in ${isekai ? 'Isekai' : 'Persistent'}`, async t => {
    const f = await fixture(t, { isekai });
    assert.equal(f.downloads.length, 0, 'opening the chooser does not download');
    assert.equal(await f.page.locator('[data-export-scope=current]').getAttribute('aria-pressed'), 'true');
    assert.match(await f.page.locator('.jpx-export-summary').textContent(), /Two-handed.*Tower/);
    const result = await download(f);
    assert.equal(result.name, `cfgBattle_${isekai ? 'Isekai' : 'Persistent'}_TwoHanded_Tower.txt`);
    assert.deepEqual(result.data, { battleVersion: f.original.config.battleVersion, TwoHanded_Tower: f.original.config.TwoHanded_Tower });
    await clean(f);
});

test('current export follows an explicitly applied ruleset rather than detected weapon or battle type', async t => {
    const f = await fixture(t); await f.page.keyboard.press('Escape');
    await f.page.evaluate(() => __exportTest.select('OneHanded_General')); f.original = await f.page.evaluate(() => __exportTest.snapshot());
    await f.page.locator('#export-button').click();
    assert.match(await f.page.locator('.jpx-export-summary').textContent(), /One-handed.*General/);
    const result = await download(f);
    assert.deepEqual(Object.keys(result.data), ['battleVersion', 'OneHanded_General']); await clean(f);
});

test('full config stays lossless and unknown lobby style never pretends to be current', async t => {
    const f = await fixture(t, { combat: false });
    assert.equal(await f.page.locator('[data-export-scope=current]').isDisabled(), true);
    assert.equal(await f.page.locator('[data-export-scope=all]').getAttribute('aria-pressed'), 'true');
    const result = await download(f); assert.equal(result.name, 'cfgBattle_Persistent.txt');
    assert.deepEqual(result.data, f.original.config); await clean(f);
});

for(const withoutNative of [false,true]) test('current export uses the assigned snapshot while full export keeps native settings; no native slot '+withoutNative, async t=>{
    const f=await fixture(t,{isekai:true});
    await f.page.keyboard.press('Escape');await f.page.evaluate(value=>__exportTest.assign(value),withoutNative);
    const expected=await f.page.evaluate(()=>__exportTest.snapshot());
    await f.page.locator('#export-button').click();
    const current=await download(f);
    assert.equal(current.data.TwoHanded_Tower.supports[0].customMessage,'Assigned export');
    await f.page.locator('#export-button').click();await f.page.locator('[data-export-scope=all]').click();
    const full=await download(f);assert.deepEqual(full.data,expected.config);
    await f.page.locator('#export-button').click();await f.page.locator('[data-export-scope=choose]').click();
    assert.equal(await f.page.locator('[data-export-scene] option[value=Tower]').count(),withoutNative?0:1);
    await f.page.keyboard.press('Escape');
    assert.deepEqual(await f.page.evaluate(()=>__exportTest.snapshot()),expected);
    assert.deepEqual(f.errors,[]);assert.deepEqual(f.requests,[]);
});

test('custom export links style and scene and exports only the chosen group', async t => {
    const f = await fixture(t); await f.page.locator('[data-export-scope=choose]').click();
    assert.equal(await f.page.locator('[data-export-style]').inputValue(), 'TwoHanded');
    assert.equal(await f.page.locator('[data-export-scene]').inputValue(), 'Tower');
    await f.page.locator('[data-export-style]').selectOption('OneHanded');
    await f.page.locator('[data-export-scene]').selectOption('General');
    assert.equal(await f.page.locator('#jpx-battle-export select').count(), 2);
    const result = await download(f);
    assert.equal(result.name, 'cfgBattle_Persistent_OneHanded_General.txt');
    assert.deepEqual(result.data, { battleVersion: f.original.config.battleVersion, OneHanded_General: f.original.config.OneHanded_General });
    await clean(f);
});

test('cancel, focus trapping and parent close clean up without downloading or altering settings', async t => {
    const f = await fixture(t);
    for (let i = 0; i < 10; i++) {
        await f.page.keyboard.press('Tab'); assert.equal(await f.page.evaluate(() => !!document.activeElement.closest('#jpx-battle-export')), true);
    }
    await f.page.keyboard.press('Escape'); assert.equal(await f.page.locator('#jpx-battle-export').count(), 0);
    assert.equal(await f.page.locator('#settings-container').evaluate(node => node.open), true);
    assert.equal(await f.page.locator('#export-button').evaluate(node => node === document.activeElement), true);
    await f.page.locator('#export-button').click(); await f.page.locator('#jpx-battle-export').getByRole('button', { name: 'Cancel', exact: true }).click();
    await f.page.locator('#export-button').click(); await f.page.evaluate(() => document.getElementById('settings-container').close());
    await f.page.waitForFunction(() => !document.getElementById('jpx-battle-export'));
    assert.equal(f.downloads.length, 0); await clean(f);
});

for (const options of [
    { language: 'ZhCN', dark: false, width: 1440, height: 960 },
    { language: '', dark: true, width: 1440, height: 960 },
    { language: 'ZhCN', dark: true, width: 375, height: 812 },
    { language: 'ZhTW', dark: false, width: 375, height: 812 },
    { language: 'ZhHK', dark: true, width: 375, height: 812 },
    { language: 'Ja', dark: true, width: 375, height: 812 },
    { language: 'Ko', dark: false, width: 375, height: 812 },
    { language: '', dark: false, width: 812, height: 375 }
]) test(`export chooser fits ${options.language || 'English'} ${options.width}x${options.height} ${options.dark ? 'dark' : 'light'}`, async t => {
    const f = await fixture(t, { ...options, many: true });
    const tag = `export-${options.language || 'en'}-${options.width}-${options.dark ? 'dark' : 'light'}`;
    if (['ZhCN', ''].includes(options.language)) await f.page.screenshot({ path: path.join(output, tag + '-current.png') });
    await f.page.locator('[data-export-scope=choose]').click();
    if (options.width === 375) await f.page.addStyleTag({ content: '#settings-container .jpx-export-dialog{font-size:16px}' });
    const sizes = await f.page.locator('#jpx-battle-export').evaluate(node => {
        const rect = node.getBoundingClientRect(), group = node.querySelector('.jpx-export-fields');
        return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: innerWidth, height: innerHeight,
            overflow: group.scrollWidth > group.clientWidth + 1, controls: [...node.querySelectorAll('button,select')].filter(n => n.getClientRects().length).map(n => {
                const r = n.getBoundingClientRect(); return { x: r.x, right: r.right, height: r.height, footer: !!n.closest('.jpx-export-footer') }; }) };
    });
    assert.ok(sizes.x >= 0 && sizes.y >= 0 && sizes.right <= sizes.width && sizes.bottom <= sizes.height, JSON.stringify(sizes));
    assert.equal(sizes.overflow, false);
    assert.ok(sizes.controls.every(c => c.x >= sizes.x && c.right <= sizes.right));
    if (options.width === 375) assert.ok(sizes.controls.every(c => c.height >= 44));
    assert.ok(sizes.bottom - sizes.y < 330, 'many saved rules do not make the chooser taller');
    await f.page.screenshot({ path: path.join(output, tag + '-choose.png') });
    await f.page.keyboard.press('Escape'); await clean(f);
});

for (const meta of [true, false]) test('export chooser stays in the visible mobile viewport over a wide game, meta=' + meta, async t => {
    const f = await fixture(t, { width: 390, height: 844, wideGame: true, meta });
    for (const scope of ['current', 'all', 'choose']) {
        await f.page.locator('[data-export-scope=' + scope + ']').click();
        const view = await f.page.locator('#jpx-battle-export').evaluate(node => {
            const rect = node.getBoundingClientRect(), viewport = visualViewport;
            return {x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom,
                left:viewport.offsetLeft,top:viewport.offsetTop,width:viewport.width,height:viewport.height,scale:viewport.scale};
        });
        assert.ok(view.x >= view.left-1 && view.right <= view.left+view.width+1, JSON.stringify(view));
        assert.ok(view.y >= view.top-1 && view.bottom <= view.top+view.height+1, JSON.stringify(view));
        assert.ok((view.right-view.x)*view.scale >= 340, 'chooser remains readable after shrink-to-fit');
    }
    await f.page.keyboard.press('Escape'); await clean(f);
});
