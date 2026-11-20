"""Build an unpacked Chromium extension and its ZIP from the supplied HV Utils."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
out = root / 'extensions/hv-utils'
meta, source = (root / 'src/hv-utils-extension/upstream/HV Utils.user.js').read_text('utf-8-sig').split('// ==/UserScript==\n')
fields = lambda name: re.findall(r'^//\s+@' + name + r'\s+(.+)$', meta, re.M)
version, = fields('version')
extension_version = version + '.4'
manifest = dict(manifest_version=3, name='HV Utils', version=extension_version, author=fields('author')[0],
                description='HV Utils for HentaiVerse — standalone Chromium extension.',
                minimum_chrome_version='111', permissions=['storage', 'unlimitedStorage', 'alarms'],
                host_permissions=['https://e-hentai.org/*', 'https://hentaiverse.org/*'],
                background={'service_worker': 'background.js'}, content_scripts=[])
icons = {str(n): f'icon-{n}.png' for n in (16, 32, 48, 128)}
manifest.update(update_url="https://meiyongai.github.io/JPX-PLUS/extensions/updates.xml", icons=icons, action=dict(default_icon=icons, default_title='HV Utils · 工具', default_popup='popup.html'))
for world, file, timing in [('MAIN', 'game.js', 'document_start'), ('ISOLATED', 'hv-utils.js', 'document_start')]:
    manifest['content_scripts'].append(dict(matches=fields('match'), exclude_matches=fields('exclude'),
                                           all_frames=True, world=world, js=[file], run_at=timing))

def patch(pattern, new):
    global source
    source, n = re.subn(pattern, lambda _: new, source, flags=re.S)
    if n != 1:
        raise ValueError(f'Expected one upstream integration point: {pattern} (found {n})')

patch(r'const _window = .*?;', '')
patch(r'  dynjs_equip: _window.*?dynjs_eqstore: _window.dynjs_eqstore \|\| \{\},',
      "  get dynjs_equip() { return equipment().equip; },\n  get dynjs_eqstore() { return equipment().store; },")
patch(r'const \$equip = \{', "let pageEquipment;\nfunction equipment() { return pageEquipment ??= game('equipment'); }\nconst $equip = {")
patch(r'  // DISABLE FONT ENGINE.*?\n\}', "  game('display');\n}")
patch(r'total: _window.total_exp,', "total: game('exp'),")
patch(r'_window.total_exp = _ch.exp.get_exp\(level\);.*?const exp_gain = _window.total_exp',
      "const exp_gain = game('simulate', _ch.exp.get_exp(level))")
patch(r'_window.end_time', "game('training')")
patch(r'json = \{\n            dynjs_eqstore: typeof.*?\n          \};', "json = game('armory');")
patch(r'assign: function \(json\) \{ // cannot access const/let.*?\n      \},', "assign: function (json) { game('assign', json); },")
patch(r'        // _window.curr_hover_eqid.*?        _window.update_selected_count\(\);',
      "        game('count', $armory.equiplist.filter((eq) => eq.node.check.name === 'eqids[]' && !eq.node.wrapper.dataset.eqprotect).length);")
patch(r'return eval\(r\);', 'return filterValue(r);')
# Release dispatched bodies and callback contexts without shifting a large pending queue.
patch(r'    GM_xmlhttpRequest\(\$ajax.queue\[\$ajax.index\]\);\n    \$ajax.index\+\+;', '''    const request = $ajax.queue[$ajax.index];
    $ajax.queue[$ajax.index++] = null;
    if ($ajax.index === $ajax.queue.length) {
      $ajax.queue.length = 0;
      $ajax.index = 0;
    }
    GM_xmlhttpRequest(request);''')
# Absence of GM settings means a new extension, not a pre-4.x userscript.
# Do not run its destructive legacy localStorage cleanup against the existing game profile.
patch(r'    if \(!\$config.settings.version\) \{.*?\n    \}\n\n    if \(\$config.settings.version < 4.2\)',
      '''    if (!$config.settings.version) {
      $config.reset();
      for (const key of $config.ls_savelist) {
        const value = $config.ls_get(key);
        if (value != null) GM_setValue($config.prefix + key, value);
      }
      $config.save();
      return;
    }

    if ($config.settings.version < 4.2)''')
# Wait for the storage commit before the settings panel navigates away.
patch(r'    GM_setValue\(prefix \+ key, value\);(.*?)\n  \},\n  del:', '''    const saved = GM_setValue(prefix + key, value);
    if ($config.ls_savelist.includes(key)) $config.ls_set(key, value, prefix);
    return saved;
  },
  del:''')
patch(r"    \$config.set\('settings', \$config.settings\);\n    if \(panel\) \{\n      location.href = location.href;\n    \}",
      "    const saved = $config.set('settings', $config.settings);\n    if (panel) saved.then(() => { location.href = location.href; });")
# Only share a protection decision inside this list pass. The expression can
# inspect all five fields below; pinned/protected are separate upstream checks.
patch(r'        equiplist.forEach\(\(eq\) => \{\n          eq.data.protected = .*?;', """        const decisions = new Map();
        const matches = eq => {
          const {name, quality, pab, level, prefix} = eq.info;
          const key = JSON.stringify([name, quality, pab, level, !!prefix]);
          if (!decisions.has(key)) decisions.set(key, $equip.filter.equip($config.settings.equipmentShopProtectFilters, eq));
          return decisions.get(key);
        };
        equiplist.forEach((eq) => {
          eq.data.protected = eq.info.protected || eq.info.pinned || matches(eq);""")
# Mount the upstream menu and base styles when its readouts exist. The hooks
# below the menu depend on page controls and game scripts, not just the header.
start = source.index("if ($id('stats_scrollable'))")
end = source.index('// TOP MENU', start)
page_setup = source[start:end]
source = source[:start] + source[end:]
# Apply route-specific geometry with the real header, before a long page is
# complete. Keep styles that replace native controls (e.g. mail composition)
# attached to their original module so they never hide a still-needed control.
early_styles = []
for route, first_selector in [('it', '#item_left'), ('is', '.itshop_pane'),
                              ('ss', '#shrine_outer'), ('tr', '#train_table'), ('mk', '#market_itemlist')]:
    section = 'Character' if route in ('it', 'tr') else 'Bazaar'
    pattern = r'(?m)^  GM_addStyle\(/\*css\*/`\n    ' + re.escape(first_selector) + r'[^`]*`\);'
    css, = re.findall(pattern, source)
    patch(pattern, '')
    early_styles.append(f"if (_query.s === '{section}' && _query.ss === '{route}') {css}")
patch(r'_top\.init\(\);', '\n'.join([*early_styles, '_top.init();', 'finishMenu();']))
patch(r'\$persona\.init\(\);', """// A following sibling proves that the parser has closed the form. The armory's
// inline data script must also have run before reading equipment or prices.
await parsed(armory && ['sell','purchase','organize','salvage'].includes(screen) ? () => {
  const data = document.querySelector('#equipform ~ script:not([src])');
  return data && data !== document.scripts[document.scripts.length - 1] && game('armoryReady', screen);
} : null);
""" + page_setup + "\n$persona.init();")
header = f"// HV Utils {version} by {fields('author')[0]} — {fields('homepageURL')[0]}\n// Generated by scripts/build-hv-utils-extension.py\n"
runtime = (root/'src/hv-utils-extension/runtime.js.inc').read_text('utf-8-sig')
(out/'hv-utils.js').write_text(header + runtime + source + '\n})().catch(e => console.error("[HV Utils]", e)).finally(finishStartup);\n})();\n', 'utf-8', newline='\n')
(out/'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', 'utf-8', newline='\n')
