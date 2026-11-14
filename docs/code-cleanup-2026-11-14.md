# Code cleanup verification — 2026-11-14

Release: **2026.11.14.1**. The source baseline is rollback commit `43250db56fd5563d0da2ab18011ab2786dd44ce6` (script version 2026.11.13.9). The withdrawn HVUT quick-switch verification patch remains withdrawn. The new version is above the previously withdrawn 2026.11.14 so users who installed it can update.

## Scope

Six local cleanup rounds remove unused defaults and helpers, consolidate recovery rules and statistics, simplify combat counters, and reduce repeated configuration and UI work. Supported rule order, statistics rounding, import/storage validation, store cleanup and existing loadout behavior are retained. No new runtime dependency is added.

Before release metadata changes, the main script shrank from 16,663 lines / 1,030,115 bytes to 16,305 lines / 1,012,624 bytes: **358 lines and 17,491 bytes removed**. This is a source-size measurement, not an equivalent reduction in memory or execution time.

## Correctness

- Final cleanup source: **801 existing JPX tests, 739 passed and 62 failed**. Every failed case was rerun with the exact source from before the final cleanup round; all 62 also failed there. The suite is not fully green. Existing failures include outdated text expectations, mobile layout assertions and a fixture error. Tests were not weakened or rewritten for this release.
- Targeted production-function comparisons covered action/target selection, aggregation and rounding, statistics HTML, cooldowns, native IndexedDB imports, request results and prices across the earlier rounds.
- The final round additionally compared all 20 combat counter descriptors and their order; 7,432 combat/log cases; 369 monster classifications; 324 condition-cache lifecycles; 432 immutable-action cases; and 3,098 glyph-decoding cases. Results and relevant side-effect ordering matched.
- Configuration comparisons included 2,940 scene-routing cases, 1,296 search/filter cases, 9 editor dispatch cases, 24 backup cases and 256 store-status cases.
- Build consistency, JavaScript syntax, language-pack validation and whitespace checks passed. Release documentation checks covered 31 documents and 426 local links; the preview check covered 120 scenarios, five responsive widths, keyboard navigation and locale selection with no reported errors or missing assets. The release packaging changes only version metadata, localized README summaries and documentation after the production-code checks.

## Performance

All measurements used isolated desktop Chrome, synthetic game DOM/data and intercepted network requests. They do not measure live-server latency, live-game TPS, memory use or mobile-device performance. New and old variants alternate execution order.

The first five rounds were compared with the rollback source: mean battle-update changes ranged from approximately **−3.3% to +3.8%**, without a consistent speedup. The following tables isolate the final round against the preceding five-round snapshot; they are not an end-to-end speedup claim against the rollback commit.

### Full battle update

Five repetitions, 100 measured updates per scenario and version, after 15 warmup updates. Fixture construction is excluded from update timing. Mean time per update:

| Scenario | Before final round (ms) | After final round (ms) | Change |
| --- | ---: | ---: | ---: |
| Replaced DOM, extra displays off | 0.4210 | 0.4158 | −1.2% |
| Replaced DOM, extra displays on | 1.1050 | 1.1120 | +0.6% |
| Retained DOM, extra displays on | 0.5438 | 0.5402 | −0.7% |
| 2,000 log rows, extra displays on | 1.5236 | 1.5818 | +3.8% |

The median is unchanged in all four scenarios. First-update output matched. An unchanged-render probe retained zero new DOM nodes, zero measured layout-text reads, zero DOM mutations and one log snapshot read.

### Focused production paths

Five repetitions, 12 measured batches after 4 warmup batches. Strategies and glyph decoding use 1,000 calls per batch; combat recording uses 200. Preparation and result serialization are excluded. Strategy conditions are rebuilt per call, and native click/cast endpoints are local stubs.

| Path | Before mean (ms/call) | After mean (ms/call) | Change |
| --- | ---: | ---: | ---: |
| Scene strategy → smart debuff | 0.007687 | 0.007130 | −7.2% |
| General strategy → target → attack | 0.007723 | 0.007177 | −7.1% |
| Mixed-log combat recorder | 0.030275 | 0.031325 | +3.5% |
| Glyph decoding from DOM | 0.008197 | 0.007665 | −6.5% |

Batch outputs and witnesses matched between versions. Combat recording increased by about **0.00105 ms/call** in this probe; shorter code is not assumed to make every path faster.

### Fresh-document initialization

Three repetitions × five native navigations per scenario/version. Synchronous production initialization is measured; script parsing and network latency are excluded. Median time:

| Scenario | Before (ms) | After (ms) |
| --- | ---: | ---: |
| Ordinary round | 9.3 | 9.4 |
| Long log | 11.4 | 11.1 |
| 40 saved configs | 12.0 | 12.2 |

Statistics and navigation state remained consistent. The measured scopes show no substantial slowdown; they do not establish a guaranteed speedup in gameplay.

## Reproduction and evidence

Use `scripts/profile-battle.cjs` and `scripts/profile-reload.cjs` with `JPX_PERF_BASELINE` pointing to the desired old script. `JPX_PERF_SAMPLES`, `JPX_PERF_REPEATS`, `JPX_RELOAD_ROUNDS` and `JPX_RELOAD_REPEATS` select the sample sizes above.

Raw timing, regression and focused-probe outputs remain local under `.test-output/` and are excluded from publication. The measured final source SHA-256 was `33cbca9b9c2b52543c8b93879181ce3853cd02c32e93cdb18efa530a5dc73523`; the pre-final-round source was `d5bee49317359d3005c39c8c37f43f9ea3b2c527667e06d808eb64e4b0c6da64`. Release metadata is updated after measurement without changing execution logic.
