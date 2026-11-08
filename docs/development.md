# Development

The installed entry point is `JPX-PLUS.user.js`. It contains the core and the generated configuration-manager block; there are no runtime imports or npm dependencies in the game.

## Source layout

| Path | Responsibility |
| --- | --- |
| `JPX-PLUS.user.js` | Core, battle execution, settings, records and generated manager |
| `src/config-manager/` | Local library, manager UI, integrated store, styles and English labels |
| `JPX-PLUS-*.user.js` language packs | External interface translations |
| `docs/` | Pages preview, static galleries and screenshots |
| `tests/` | Config storage, migration, UI, import/export and recognition regression tests |

Edit the manager modules, then rebuild. Do not hand-edit the generated section in the main script. Native config structures and library storage have separate responsibilities; see [the module notes](../src/config-manager/README.md).

## Build and test

Requires Node.js 22 or newer. From the repository root:

```sh
npm ci
npx playwright install chromium
npm run build
npm run check
npm test
```

`npm run check` verifies syntax, reproducible generated blocks and all five external language packs. Browser tests use disposable profiles and mocked transport. They do not access your installed userscripts, account, battle or GitHub credentials. They do not measure live game network latency.

To use an installed Chrome instead of the downloaded test browser, set `PLAYWRIGHT_CHANNEL=chrome`. The optional `JPX_CONFIG_REPRO` environment variable lets the battle-import regression inspect a local reporter file without committing it.

## Battle performance

Run `npm run profile:battle` for isolated browser timings and DOM operation counts. Set `JPX_PERF_BASELINE` to an older local userscript to compare outputs and timing, and `JPX_PERF_OUTPUT` to save the JSON report. `JPX_PERF_SAMPLES` and `JPX_PERF_REPEATS` default to 80 and 3. The profiler defaults to installed Chrome; set `PLAYWRIGHT_CHANNEL` if needed.

All requests are intercepted. Fixtures exercise both whole battle-DOM replacement and repeated updates to retained nodes, with 100-row and 2,000-row logs. Fixture construction is outside the measured update; browser layout counters also include construction and final rendering. Timing is diagnostic and never a pass/fail threshold. The deterministic regression suite checks node counts, freshness and output semantics. See [the audit and evidence boundaries](performance-2026-11-08.md).

## Screenshots and Pages

```sh
npm run screenshots
npm run check:docs
```

Screenshots are produced from the actual script renderers with invented, offline data. Store requests and account responses are mocked; no submissions are sent. Capture scripts cover English/Chinese, light/dark, and desktop/mobile. The panel image combines three actual state captures. The battle-results image shows the statistics area, not the entire game screen.

The neutral screenshot backdrop follows the selected theme; fixture styling does not change the product UI. The Pages preview retains browser-language detection, remembered language, URL parameters and theme/device switching. The old `page=backpack` link redirects within the preview to `configs`.

The configuration-review service is maintained separately in [JPX-PLUS-Configs](https://github.com/MeiYongAI/JPX-PLUS-Configs). Ship its security-policy and catalog-metadata update alongside the manager release. Never put tokens, application private keys, reporter configs, personal automation builds or local backups in a release.

## 中文简述

主脚本仍是独立用户脚本。配置管理源码集中在 `src/config-manager/`，修改后运行 `npm run build`，再执行 `npm run check` 和 `npm test`。测试不使用真实账号、战斗或已安装脚本的存储。

截图使用真实渲染函数和离线示例数据，运行 `npm run screenshots` 重拍，再用 `npm run check:docs` 检查图片、预览切换与窄屏布局。配置审核后端需与本次主脚本同步发布，不能只更新截图和安装文件。
