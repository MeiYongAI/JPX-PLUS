# Changelog

## 2026.11.10.1

- Restore the HV statistics address and remove the independent project page. Opening and refreshing statistics can briefly show HV while the userscript starts; this is an expected loading transition, not a statistics failure.
- Keep existing records, shared storage, and the standardized ZhCN language pack. Update the main script and language pack together.

### 简体中文

- 统计页恢复使用 HV 地址，撤回独立页面。打开或刷新时可能短暂显示 HV，这是脚本启动前的加载过渡，不是统计功能故障。
- 保留已有记录、共享存储和统一后的 ZhCN 语言包。请同步更新主脚本和语言包。

## 2026.11.09.5

- #10 follow-up: statistics now use an independent project page. Opening, refreshing, and using statistics after closing the game tab no longer navigate through HV.
- Keep records and display settings in the existing local script storage. Finish legacy record migration before opening; old statistics bookmarks redirect to the new page. Update the main script and language pack together.
- Verification: 667 offline tests and 112 preview checks passed, with no skipped tests. Script and language-pack consistency checks passed.

### 简体中文

- #10 后续修正：统计页改用独立入口。打开、刷新，以及关闭游戏页后继续使用，都不再经过 HV。
- 记录和显示设置继续保存在脚本本地存储中。打开前迁移旧记录，旧统计页地址会跳转至新入口。请同步更新主脚本和语言包。
- 验证：667 项离线测试和 112 项预览检查通过，无跳过；脚本与语言包一致性检查通过。

## 2026.11.09.4

- Rename the Simplified Chinese pack to ZhCN to match ZhTW and ZhHK. Update installation links and tooling, keeping the former ZhTrans URL as a generated compatibility copy that updates from ZhCN.
- #10: initialize the statistics document at document start on the records route, stopping the native homepage load. Keep the HV address so refreshing the page and closing the original game tab still work. Ordinary game startup continues to wait for the DOM.
- Start language packs early as well, so translations work regardless of which script runs first.
- Verification: 661 offline tests passed, including 16 startup cases covering both HV hosts, both worlds, translations, refresh and the Z-key popup. Real HV and installed userscript-manager timing still need live confirmation.

### 简体中文

- 简体语言包统一命名为 ZhCN，与 ZhTW、ZhHK 对齐；安装链接和工具同步更新，旧 ZhTrans 地址保留兼容，更新指向 ZhCN。
- #10：打开统计页时直接初始化统计页面，停止原主页加载。保留 HV 地址，刷新或关闭原游戏标签页后仍可使用；普通游戏页保持原来的启动时机。
- 语言包同步提前加载，主脚本与语言包先后顺序均可正常显示翻译。
- 验证：661 项离线测试通过，其中 16 项覆盖双站点、双世界、翻译、刷新和 Z 键新标签页。真实 HV 与已安装脚本管理器的加载时机仍待实测。

## 2026.11.09.3

- Complete all five language packs for primary/alt shared-data controls, recovery prompts and cleanup warnings. These controls now use the selected language instead of choosing only English or Simplified Chinese.
- Simplify scene selection, linked-config deletion and import messages. Align export labels and battle names across screens.
- Validate language packs against the main English dictionary as well as the config-manager, store and shared-data dictionaries.
- Verification: 1,233 entries per pack, 645 offline tests and 112 preview checks passed. Screenshots and localized guides now match the updated labels.

### 简体中文

- 补齐主站／alt 共享数据面板的五种语言，包括恢复提示和清理提醒，不再让繁体显示简体、日韩显示英文。
- 简化场景选择、清除关联和导入提示，统一导出按钮及战斗名称。
- 语言包直接对照主脚本检查，同时校验配置管理、商店和共享数据文案。
- 验证：每包 1,233 项，645 项离线测试、112 项预览检查通过；截图与各语言说明同步更新。

## 2026.11.09.2

- #7: bound ordinary log reads to the current action, cancel stale trailing callbacks, and label callback intervals accurately. Add `JPXPlus.getBattleTiming()` diagnostics. The reported Chrome split-view slowdown still needs live reproduction; see [evidence and limits](docs/issue-7-battle-timing.md).
- #8: show fixed versus automatic selection, add **Restore automatic selection**, and list references before detaching or deleting saved configs. Migration records no longer make deletion inaccessible.
- #9: add **Scene strategies** for all ten styles in both worlds. Assign saved rules per scene, inherit General, keep fixed mode explicit, and pause when no strategy is available. Saving a copy does not update its assigned snapshot.
- Keep scene assignments separate from native JPX exports. Applying or detaching assignments pauses affected battle tabs. See [selection behavior](docs/scene-strategies.md).
- Simplify scene assignments into aligned desktop rows and stacked mobile controls. Show Assign/Cancel only for pending changes, preserve readable long options, and require confirmation before signing out of the config store.
- Renew GitHub device-flow sessions instead of imposing an eight-hour logout. Preserve credentials on temporary failures and protect newer logins from stale responses. Older installations may need one new authorization; see [authentication behavior](docs/store-authentication.md).
- Documentation follow-up: synchronize all six READMEs and upgrade guides, refresh screenshots, add scene-strategy and sign-out previews, and check local documentation links and language-pack versions. All 112 updated preview scenarios passed.
- Verification: all 637 tests included in this release passed. Documentation previews passed 96 scenarios; source consistency, syntax and language packs passed. Live split-view gameplay and long-running real-account renewal were not exercised.

### 简体中文

- #7：限制每次日志读取范围，取消过期回调，并将延迟标注为回合间隔；新增耗时诊断。Chrome 分屏持续变慢仍待实战复测。
- #8：明确固定／自动模式，增加恢复自动选择、查看引用及解除引用后删除。
- #9：新增场景策略面板，支持双世界、十种流派、继承通用和无策略暂停。保存副本不会自动更新已分配的规则。
- 精简场景策略界面，桌面横向对齐、手机纵向排列，修改后才显示操作按钮；长名称可展开查看，退出配置仓库登录须再次确认。
- 修复八小时后掉登录：保存续期凭据并自动更新，临时失败保留登录，防止旧请求误删新登录。旧版更新后可能需要重新授权一次。
- 文档补全：同步六份 README 与升级说明，重拍截图，补充场景策略和退出确认预览，并校验文档链接及语言包版本。更新后的 112 个预览场景全部通过。

## 2026.11.09.1

- Built in Sukka monster database reads: class, attack and power no longer require a companion script. Persistent/Isekai caches use IndexedDB and refresh daily on demand, with offline fallback, retry backoff and per-origin tab coordination.
- Preserve current-round identity through AJAX replacement; local Scan results refresh display and metadata conditions without uploads. Chunked imports avoid the large synchronous IDB write loop. Existing companion API remains supported.
- Update all five language packs, and include the monster cache in full data cleanup. See [behavior and verification details](docs/monster-database.md).
- Verification: 586/586 offline repository tests, build/source consistency and language checks passed. Real public snapshots were validated and imported in isolated Chrome. No real game account or installed userscript was exercised.

### 简体中文

- 内置 Sukka 怪物数据库读取，怪物类别、攻击类型和战斗力无需另装数据库脚本；主／异世界分库，按需每日更新，支持旧缓存回退、失败退避与同源标签页去重。
- AJAX 换轮丢弃迟到结果；Scan 更新本地资料及显示，不上传。完整数据库采用分批导入，保留旧配套脚本 API 兼容。
- 同步五个语言包，清除全部数据时包括怪物缓存。详见[行为与验证边界](docs/monster-database.md#简体中文)。

## 2026.11.08.21

- Shorten the mouse-enter pause setting help to its prerequisite sentence in English and all five language packs. Battle behavior is unchanged.
- 精简鼠标再次移入切换手动的说明：英文及五个语言包均仅保留生效前提，战斗行为不变。

## 2026.11.08.20

- **Revert ineffective hover fix.** Withdraws the changes from 2026.11.08.19 after user feedback confirmed that they did not resolve the reported scrollbar/hover conflict. Statistics behavior returns to 2026.11.08.18; its toolbar and data-management layout improvements remain.
- **Rollback delivery.** The version increases so existing 2026.11.08.19 installations can receive this rollback through their normal update flow. The original reported issue remains unresolved.

### 简体中文

- **撤回无效的悬停修复**：用户反馈 2026.11.08.19 未解决滚动条与悬停冲突，现撤回该次代码及配套测试，统计行为恢复至 2026.11.08.18；保留此前顶栏和数据管理布局优化。
- **回退更新**：使用递增版本号，让已安装 2026.11.08.19 的脚本可通过正常更新获取回退。原反馈问题仍未解决。

## 2026.11.08.18

- **Cleaner records toolbar.** Aggregate by Day uses centered text with a selected background and underline, without a checkmark or empty indicator space. Clear records moves beside the other toolbar icons and retains its range preview, current world/battle scope and confirmation.
- **Stable expanding controls.** Column panels reserve scrollbar space so labels and arrows stay aligned when categories expand. Settings statistics also reserves its scrollbar gutter; disclosure arrows have enough space throughout rotation. Existing animation and reduced-motion behavior remain.
- **Compact data management.** Record export, import and cleanup share one action row. Primary/alt backups, shared history and stamina correction sit in an initially collapsed section. Reset statistics settings and full-data cleanup remain separate, with concise labels and no permanent explanatory paragraphs. Import preview and destructive confirmation remain intact. Mobile controls use 44px targets and the existing HV square-corner palette.
- **Verification.** Full offline regression: 562/562. Final statistics/shared-browser checks: 62/62. Build, language consistency and 96 preview scenarios pass. Layouts and data flows use isolated Chrome fixtures with mocked GM transport; no real account or installed userscript was exercised.

### 简体中文

- **顶栏更简洁**：按天汇总使用居中文字，以底色和下划线区分开启状态，移除对勾及占位。清理记录移到顶栏图标区，保留当前世界/战斗类型范围、预览和删除确认。
- **展开不再挤动**：显示项目窗口预留滚动条空间，分类文字和箭头保持对齐；统计设置也预留滚动条位置，并为箭头旋转留足空间。沿用原有展开动画与减少动画偏好。
- **数据管理精简布局**：记录导出、导入、清理集中排列；主站/alt 旧配置、共享历史和体力修正默认折叠。重置统计设置与清空全部数据独立放置，移除常驻说明段落，保留导入预览和删除确认。手机控件保持 44px 点击区域，沿用 HV 直角、细边框及明暗配色。
- **验证范围**：全量离线回归 562/562、最终统计/共享专项 62/62、构建、语言一致性及 96 个预览场景通过。使用隔离 Chrome 页面与模拟 GM 传输，未操作真实账号或已安装脚本。

## 2026.11.08.17

- **Checkbox filters.** World, result, battle type and difficulty return to visible native checkboxes with touch-sized labels. The toolbar exposes Aggregate by Day as a compact text toggle with a check indicator; it retains the original filter input, keyboard behavior and redraw state.
- **Stable column window.** Expanding a category no longer increases or repositions the Choose columns dialog. Its viewport-limited height stays fixed while the contents scroll; close controls remain in place on desktop, small phones and landscape screens.
- **Reused disclosure motion.** The statistics categories and existing rule editor share the same native-details transition, timing and easing. Rapid reversal is supported, collapsed fields are inert, and reduced-motion preferences disable the transition. Opening a category does not rescan history.
- **Verification.** Full offline regression: 548/548. Focused statistics/shared-browser checks: 48/48. Build, language consistency and 96 preview scenarios pass. Light/dark layouts, small-phone languages, portrait/landscape, aggregation state and stationary-window animation were checked in isolated Chrome fixtures, not a live account or installed userscript.

### 简体中文

- **筛选恢复勾选框**：世界、结果、战斗类型和难度改回可见的原生勾选框，保留方便触摸的整行标签；“按天汇总”移到顶栏，保持文字切换样式，启用时带对勾。沿用原筛选输入，重绘和切换屏幕尺寸后状态不丢失。
- **显示项目窗口不再拉长**：窗口保持受屏幕高度限制的固定尺寸，展开分类只增加内部滚动内容，标题与关闭按钮不移动，兼容手机横竖屏。
- **复用原有展开动画**：与规则编辑器共用 native details 动画、时长和缓动，支持快速反向操作与减少动画偏好；收起内容不可获焦，展开不重新读取历史。
- **验证**：全量离线回归 548/548、统计与共享专项 48/48 通过；构建、语言一致性和 96 个预览场景通过。明暗主题、多语言窄屏、横竖屏、汇总状态与窗口固定动画均使用隔离 Chrome 页面验证，未操作真实账号或已安装脚本。

## 2026.11.08.16

- **Table-first records layout.** The permanent filter/category blocks and floating text controls are replaced by a compact title/count and three named icon buttons: filters, columns and image actions. Data starts immediately below the toolbar, including at 320px.
- **On-demand panels.** A shared modal opens as a bottom sheet on phones and a compact dialog on desktop. Category rows expand individually without a permanent help paragraph; visibility changes keep their auto-save, primary/alt sharing and cached redraw behavior.
- **Transient save feedback.** Column changes show one two-second toast instead of a permanent saved bar. Repeated edits replace/reset it, closing the panel clears it, and storage errors remain visible until a successful retry.
- **HV visual style.** Square corners, thin dividers and the existing light/dark palette replace rounded cards. Toolbar and close buttons retain 44px touch targets, accessible labels, keyboard focus cycling, Escape/backdrop dismissal and focus restoration. The scrollable body accommodates small portrait and landscape screens.
- **Verification.** The full offline suite passes 535/535 tests, and the final category/shared-browser suite passes 35/35 after the last visual changes. Build/language checks and 96 documentation-preview scenarios pass. Responsive, focus, PNG-download, clipboard-error, transient-toast and nested-cleanup flows use isolated Chrome fixtures. No live account or installed userscript was exercised; cross-host transport is mocked.

### 简体中文

- **统计表格优先**：移除常驻筛选与分类大块设置，以及悬浮文字按钮。顶部仅显示标题、记录数与三个图标入口：筛选、显示项目、图片；320px 窄屏也直接看到数据。
- **按需设置**：手机使用底部抽屉，桌面使用紧凑对话框；分类右侧箭头单独展开具体项目，移除常驻说明段落。保留自动保存、主站/alt 共享和修改显示时不重新读取历史的行为。
- **短暂保存提示**：显示设置保存成功改为两秒 toast，连续修改合并提示，关闭面板清理；保存失败仍保留错误说明，重试成功后清除。
- **沿用 HV 风格**：直角、细分隔线和现有明暗配色，去掉大圆角与卡片装饰。图标和关闭按钮保持 44px 点击区域，支持键盘循环、Escape、遮罩关闭与焦点返回；抽屉内容独立滚动，适配窄屏和横屏。
- **验证范围**：全量离线回归 535/535 通过，最终视觉调整后分类/共享专项 35/35 通过；构建、语言检查及文档预览 96 个场景通过。响应式、焦点、PNG 下载、剪贴板失败、短暂 toast 及嵌套清理使用隔离 Chrome 页面验证。未操作真实账号或已安装脚本，跨站传输使用模拟 GM。

## 2026.11.08.15

- **Grouped statistics columns (issue #5).** The records page offers eight category switches: Basic, Earnings, Drops, Potions, Scrolls, Special consumables, Skill use and Combat. Expand “Choose columns” to select individual existing metrics. Hiding a category retains its item selections.
- **Two-level table headers.** A darker category row sits above individual column labels; both stay visible while scrolling, and category names remain readable on narrow screens. The rendered table groups columns by category while retaining custom names, colors and ordering within each category. Saved column order is not rewritten.
- **Saved display preferences.** Changes save automatically, survive reload, travel with stats configuration import/export and use the existing primary/alt shared configuration. Save failures leave the previous selection intact and show a retryable error.
- **No history rescan for display changes.** Local and other-tab category/column changes redraw the already-loaded records. Record filtering and refresh still read current history. Totals, averages, balances, detail links and image export retain their existing calculations.
- **Verification.** 529/529 offline regression tests pass, including 29 category/shared-browser checks. Five language packs and 320/768/1024/1440-pixel light/dark layouts were checked. Cross-host tests use mocked GM transport; no live account or installed userscript was exercised.

### 简体中文

- **统计列表增加八类开关**：基础、收益、掉落、药水、卷轴、特殊消耗品、技能使用、战斗。展开“选择显示项目”可勾选分类下的具体项目；关闭分类不会清空原有勾选。
- **两层表头**：上层分类使用更深底色，下层显示字段名，纵向滚动时一起固定；窄屏下分类名称保持可读。列表按分类排列，保留自定义名称、颜色与分类内顺序，不改写已保存的列顺序。
- **自动保存和共享**：显示修改自动保存，刷新后保留，随统计配置导入导出，并由主站和 alt 共享；保存失败会恢复原选择并显示错误。
- **保持统计性能和数值**：本页及其他标签页的显示修改仅重绘已加载记录，不重新扫描历史；总计、平均值、消耗品余额、详情和图片导出保持原有计算。
- **验证**：全量离线回归 529 项通过，其中分类及跨站浏览器专项 29 项；五种语言和明暗主题窄屏均已检查。未操作真实账号，跨站共享使用模拟 GM 传输验证。

## 2026.11.08.14

- **Visible configuration-import feedback.** Battle and stats settings show a persistent, dismissible result above the footer: reading, imported but not saved, or failure with a reason. Saving updates the result only after the write succeeds. Later edits, undo/redo and navigation clear stale confirmations.
- **Separate reading, saving and applying.** My configs explains that a validated file still needs Save; after saving it confirms the named archive was added and still needs Apply. Importing never silently saves or applies a config.
- **Recoverable errors and safe async results.** File-read, validation, size, unsupported-version, custom-code cancellation and storage errors are visible. Retrying is supported; obsolete reads and cancelled replacement selections cannot leave a misleading result.
- **Accessible, themed layout.** Inline status/alert text and a keyboard-operable close button fit light/dark layouts from 320 to 1440 pixels. Long names are abbreviated with the full name in a tooltip. All five language packs are updated.
- **Verification.** The full offline regression run passed 504/504 checks. After the final cancelled-picker cleanup, the import-feedback suite passed 16/16 checks. Build, embedded-source and language checks pass. Tests use isolated browser fixtures; installed userscript/live-account validation was not performed.

### 简体中文

- **导入结果持续可见**：战斗与统计设置导入后，在底部按钮上方显示读取中、导入成功但待保存、失败及原因；提示可手动关闭，不再只靠按钮短暂变字。保存成功后才显示“已保存”，后续编辑、撤销重做或切换页面会清除过期提示。
- **明确下一步操作**：配置管理导入先提示校验通过、待保存；保存后明确“已成功导入我的配置，尚未应用”，需要使用时再点击“应用”。
- **失败可重试**：覆盖读取失败、文件格式/版本/大小问题、自定义代码取消和存储失败；修正重新选文件又取消时的旧读取中提示。
- **适配现有界面**：适配明暗主题、窄屏、键盘关闭及五种语言，超长文件名不会挤掉结果说明。全量离线回归 504 项通过，最终导入反馈专项 16 项通过；未操作真实账号或已安装脚本。

## 2026.11.08.13

- **Hover starts auto battle without pausing it on re-entry.** When panel hover activation is enabled, leaving and entering again keeps an already-running battle automatic by default. An ignored hover does not consume the click toggle's throttle.
- **Optional original toggle behavior.** Battle settings → Battle controls adds “Re-enter panel to switch to manual”, off by default and dependent on hover activation. Enable it to restore the previous entry-to-toggle behavior. Existing configs without this field use the new start-only default.
- **Keep explicit controls and round recovery.** Panel click, Enter/Space and shortcut toggles remain available; AJAX mouse-movement recovery still activates once without toggling off on subsequent movement. Five language packs include the option and explanation.
- **Verification.** 490/490 offline regression tests and build/language checks pass, including 29 panel/AJAX hover tests. No live account battle was used for this change.

### 简体中文

- **移入默认只开启自动战斗**：自动中移出再移入保持自动，不再因重复进入切换手动；忽略的移入不会占用点击切换的节流时间。
- **二次进入切换手动可选**：战斗设置 → 战斗控制新增“再次移入面板时切换为手动”，默认关闭，仅在开启移入自动战斗时有效。开启可恢复原来的行为，旧配置缺少该字段时默认为关闭。
- **保留主动暂停和换轮恢复**：点击、Enter/空格、快捷键仍可切换；AJAX 换轮后面板内移动仍只恢复一次。五种语言包同步更新。

## 2026.11.08.12

- **Share data between primary and alt.** Settings, shortcuts, config archives, completed battle history and daily stamina use the same userscript-owned store, with Persistent and Isekai kept separate.
- **Preserve existing copies.** Both hosts keep recoverable pre-sharing settings; old battle archives merge by world and timestamp. Recovery and a clearly explained legacy-stamina correction are available under Stats → Data.
- **Record each completion once.** Shared per-battle receipts avoid duplicate charges and whole-history rewrites. Deleting history does not refund consumed stamina. Changes to executing settings pause other battle tabs.
- **Scope and verification.** Ongoing raw logs and transient battle state remain local. Cross-origin Chrome fixtures use mocked GM transport, not the installed extension or a live account. See [migration, tests and limits](docs/alt-shared-data-2026-11-08.md).

### 简体中文

- **主站与 alt 共享数据**：配置、快捷键、配置库、已结算历史和当日体力账本使用同一份油猴存储，主世界与异世界仍分开。
- **保留迁移前副本**：两站旧配置均可下载或恢复，历史按世界和时间戳合并。统计设置的数据页提供旧体力基数修正说明和入口。
- **逐场记账**：重复结算不重复扣体力，删除历史不返还消耗；另一站修改当前执行配置会暂停自动战斗。
- **明确边界**：战斗中原始日志及临时状态仍为站点本地；已做隔离双域名测试，尚未在用户安装的油猴或真实战斗中验证。

## 2026.11.08.11

- **Append long battle logs without copying all history.** Full-log recording appends each batch in place, preserving initialization lines, repeated actions, Scan output and round markers.
- **Serialize only new log entries when saving.** Reuse the last saved JSON prefix, keep the existing complete-array storage format, and skip unchanged writes after checking the actual storage key. Failed writes do not advance the saved position.
- **Preserve transitions and complete export.** Keep the final pending-action flush, Persistent/Isekai isolation, native reloads, AJAX resets and final-result cleanup; do not truncate logs or alter combat decisions.
- **Measured offline.** With 100,000 prior entries, 200 recorded actions fall from 28.6 to 1.5 ms; first save after restoring a document falls from 23.5 to 11.8 ms. Full-string storage writes still remain. This applies when full-log recording is enabled, not live TPS. See [verification and limits](docs/battle-log-2026-11-08.md).

### 简体中文

- **减少长日志追加复制**：每次行动只追加当前批次，不再复制全部历史；相同内容的新行动、初始化行、Scan 和轮末标记保持原顺序。
- **保存只序列化新增后缀**：复用上次成功保存的 JSON 前缀，保持完整数组格式；无变化时检查实际存储后跳过重复写入，失败不推进保存位置。
- **保留刷新与导出**：保留最后一条待处理行动、双世界隔离、非 AJAX 刷新、AJAX 换轮、结算清理和完整导出，不裁剪历史。
- **离线对照**：十万条历史下，200 次追加 28.6 → 1.5 ms；恢复后首次保存 23.5 → 11.8 ms。仅启用完整日志时受益，仍需写完整字符串，不等于真实 TPS 提升。

## 2026.11.08.10

- **Reduce configuration-library startup cost.** Validate parsed JSON without redundant generic-object descriptor walks or per-entry deep copies, and index applied/binding references by ID.
- **Copy only the selected record.** Battle selection no longer copies the whole archive; validated cache objects remain private and mutable callers receive independent copies. Full-library callers keep a lazy serialized cache.
- **Preserve validation and behavior.** Retain all structural/size limits, migrations, corrupt-store checks, current-rule equality, world isolation and failed-write rollback. No storage schema change or extra selection key.
- **Measured offline.** Against .9 in isolated Chrome, first selection reads fall from 27.1 to 7.2 ms for a synthetic 992 KiB conditional-rule archive, and 52.8 to 14.5 ms for 2 MiB with 2,000 bindings. These are not live-game TPS or a reproduction of the reported 400 ms stall. See [verification and measurements](docs/config-read-2026-11-08.md).

### 简体中文

- **降低配置库首次读取开销**：JSON 解析后保留完整数据校验，去掉重复的通用对象检查和逐条深拷贝；应用记录与装备绑定改用 ID 索引。
- **战斗选择只复制所需记录**：内部缓存不暴露给调用者，完整库读取保留惰性序列化缓存，不改变存档格式或添加可能失配的选择键。
- **保留正确性检查**：继续检查损坏数据、大小/深度限制、迁移、规则一致性、世界隔离和失败回滚。
- **离线结果**：复杂 992 KiB 合成库首次选择读取 27.1 → 7.2 ms，2 MiB / 2,000 绑定 52.8 → 14.5 ms；不代表真实 TPS，也未复现报告中的 400 ms。

## 2026.11.08.6

- **Reduce battle update work.** Read plain vital counters without forcing rendered-text layout, share one normalized log snapshot within an update, and leave existing log separators untouched. Addon-decorated vital counters retain rendered-text parsing.
- **Reuse battle decorations.** Extended quickbar slots, cooldowns, effect durations, monster metadata and HP labels update existing nodes. Repeated renders no longer accumulate copies. New AJAX elements receive fresh state; missing/available actions and changed settings refresh their current handlers and appearance.
- **Preserve combat inputs.** Exclude JPX metadata from monster names and its synthetic hidden-effect icons from native effect counting. Verify countdown changes, expiry, translation load order and the prior AJAX-hover fix with offline regression tests.
- **Reproducible profiling.** Add an isolated browser profiler and operation-count tests. Measurements and limitations are documented in [the performance audit](docs/performance-2026-11-08.md); they are not live-game throughput claims.

### 简体中文

- **减少战斗更新开销**：纯数字血量／魔力／灵力采用不触发布局的读取方式；同一次更新复用日志快照，已有分隔线不再重写；其他脚本加入子元素的数值仍按可见文本读取。
- **复用战斗提示节点**：扩展快捷栏、冷却、状态倒计时、怪物信息与血量标签改为就地更新，避免重复渲染不断追加。AJAX 新节点重新建立状态，技能可用性、点击处理和设置变更仍实时更新。
- **保持战斗判断准确**：读取名称时排除 JPX 添加的怪物信息，原生状态计数排除补出的隐藏效果；覆盖倒计时、失效清理、汉化加载顺序与上一版 AJAX 悬停回归。
- **可复跑性能记录**：新增隔离浏览器诊断及确定性操作次数检查，结果与边界见[性能排查记录](docs/performance-2026-11-08.md)，不将离线数据当作真实游戏 TPS。

## 2026.11.08.5

- **Resume inside the panel after AJAX.** With hover-to-toggle enabled, the first deliberate mouse movement in the status area can resume a newly loaded round without leaving and reentering the floating panel. Supports both battle-only replacement and full-body fallback.
- **Keep manual controls predictable.** Recovery is consumed once per round. Later motion does not toggle repeatedly or undo a manual pause; clicks, keyboard toggles and dragging cancel pending recovery. Stationary/synthetic input, held buttons, puzzles and final results do not trigger movement recovery.
- **Offline regression coverage.** Reproduce the old failure and verify repeated rounds in Persistent and Isekai using isolated Chromium with intercepted requests. Live-account combat has not been exercised by these tests.

### 简体中文

- **修复 AJAX 换轮后面板内移动失效**：开启悬停切换时，在状态区域内主动移动鼠标即可恢复新一轮自动战斗，无需先移出面板再进入；兼容仅替换战斗区域和整页内容替换。
- **保留手动控制**：每轮只恢复一次，后续移动不会反复开关或撤销手动暂停；点击、键盘切换和拖动会取消待恢复状态。静止／脚本合成事件、按住鼠标按钮、谜题及最终结算不会触发移动恢复。
- **离线回归验证**：在拦截全部请求的隔离 Chromium 中复现旧版问题，覆盖主世界、异世界及连续换轮；这些测试不代表真实账号实战验证。

## 2026.11.08.4

- **Quickbar fallback.** When character elemental data is unavailable, use the quickbar only if its attack spells belong to one element. Read native tooltip metadata, including unavailable/cooling-down spells, so translated labels do not affect the result. Mixed elements remain unknown.
- **Preserve priorities and performance.** Explicit config choices and existing character attributes take precedence. Scan at initialization and AJAX round changes, with no extra requests or per-action scans; keep native config and stat-cache formats unchanged.

### 简体中文

- **快捷栏补充识别**：读取不到角色属性时，若快捷栏攻击法术只有一种属性，就采用该属性；读取原生技能提示数据，兼容冷却状态和中文显示，混合多系时不猜测。
- **保留优先级与性能**：明确指定的配置属性、已有角色属性仍优先；只在初始化和 AJAX 换轮时扫描，不增加请求或每次行动的扫描，也不修改原版配置和属性缓存格式。

## 2026.11.08.3

- **Correct spell-element detection.** Skip stat headings without glyph containers instead of aborting the character-page scan. Recognize native element names even when translated display text is appended, and refresh missing elemental data outside battle.
- **No guessed Fire fallback.** Missing or invalid elemental data no longer displays Fire or silently selects fire spells. Automatic T1/T2/T3 actions pause with a clear message when their element is unknown; explicitly named spells and selected element overrides keep working.
- **Compatibility and coverage.** Preserve native JPX config formats and separate Persistent/Isekai observations. Update all five language packs and add regressions for both worlds, translated labels, and unknown-element handling.

### 简体中文

- **修复法术属性识别**：跳过没有字形容器的属性标题，避免角色页读取中断；兼容英文属性名后附中文显示文本，并在战斗外补全缺失的属性数据。
- **不再默认火系**：属性缺失或无效时不再误显示火系、误选火系法术；依赖自动识别的 T1/T2/T3 操作会暂停并提示，明确指定技能或属性的规则仍正常工作。
- **保持兼容**：原版 JPX 配置格式和主世界／异世界数据隔离不变，同步五个语言包，补充双世界、混排标签及未知属性的回归测试。

## 2026.11.08.2

- **More reliable persona/set bindings.** Handle fast HVUT switches, native AJAX equipment updates and changes in another tab. Cancel obsolete lookups and publish the active-config update after the confirmed persona/set state is ready.
- **Remember each persona's set.** The binding picker remembers its last observed set and prefers that persona's known slots. Persistent and Isekai observations remain separate.
- **Fewer background requests.** Binding checks use the equipment response when it contains both IDs, and share it with style detection when needed. Combat and puzzle pages still make no character/equipment lookup requests.
- **Keep existing choices.** Manual applications survive ordinary reloads; an unbound set keeps the current config. Native JPX config import/export stays compatible.

### 简体中文

- **人格／套装切换更稳**：修复 HVUT 快速切换、原生页面 AJAX 换装及跨标签页同步中的遗漏，取消过期查询，确认人格和套装后再更新“使用中”。
- **分别记住套装**：绑定窗口记住每个人格上次读取到的套装，优先显示该人格已知的套装；主世界与异世界分别保存。
- **减少后台请求**：装备页包含完整信息时，仅读取一次即可确认绑定；需要识别流派时复用请求，战斗和谜题中仍不请求角色／装备页。
- **保留现有选择**：普通刷新保留手动应用的配置，未绑定套装沿用当前配置，原版 JPX 配置导入导出格式不变。

## 2026.11.08.1

Compared with the previous public main script, 2026.11.06.12:

- **Optional auto finish.** A default-off switch beside Auto next round saves the final statistics, skips the JPX result tables and clicks the game's finish button. Failed saves keep the result open.
- **Built-in config management.** My configs, Store and Shared now live in the main script. Keep multiple setups for the same mode; edit each in a separate rule editor.
- **Persona and set bindings.** Bind saved battle configs to a world, persona and equipment set from the config menu. Confirmed native/HVUT switches apply the matching local rules; the native JPX export format stays unchanged.
- **Clear application state.** Apply a selected ruleset immediately, see which copy is in use, and distinguish it from the detected equipment style. Editing a saved copy does not change the running rules. Application during battle pauses automatic actions.
- **Colored tags and ordering.** Styles, worlds, battle types and elements have consistent colors across My configs, Store and Shared in both themes. Filter by actual rule groups, search names and tags, and sort by type, update time, name or manual order. Touch, mouse and keyboard ordering are supported.
- **Sharing maintenance.** Update an existing share from a saved config, inspect review feedback, withdraw it and remove withdrawn records from the list. Download configs from catalog rows. Community updates never overwrite local copies automatically.
- **Import and export.** Retain native JPX config imports and multi-mode files; choose In use, Full config or Choose rules when exporting. Fix legacy optional-target values that could prevent a full config from being applied during combat.
- **World-aware recognition.** Keep equipment observations separate by world and persona. Refresh available evidence outside combat; do not request inaccessible character/equipment pages during combat or puzzles.
- **Responsiveness and cleanup.** Reuse parsed config data and catalog ordering, defer collapsed rule forms, cancel obsolete statistics reads, close database connections, and allow clearing records within a selected range.
- **UI and documentation.** Compact mobile filters/actions, stable navigation, consistent dark controls and dismissing feedback. The export dialog stays inside the visible mobile viewport even over the game's wide layout. Updated five external language packs, English/Chinese documentation and desktop/mobile screenshots in both themes.

The standalone Config Store script has been retired; use the integrated manager. Existing local configs are retained. See [upgrading](docs/upgrading.md).

The configuration-review backend is a separate coordinated update in [JPX-PLUS-Configs](https://github.com/MeiYongAI/JPX-PLUS-Configs): format and device/data security checks, evidence-based AI review only for candidate code or suspicious content, controlled retries, and catalog mode metadata. It does not rate battle strategy.

This changelog covers JPX-PLUS and its language packs. The independent game translation and Stylus themes have separate versions.

### 简体中文

- **可选自动结束战斗**：在自动下一轮旁增加默认关闭的开关，保存统计后跳过 JPX 结算表格并点击游戏结束按钮；保存失败时保留结算页。
- **配置管理并入主脚本**：我的配置、商店、已分享统一管理，同类方案可保存多套，规则使用独立页面编辑。
- **人格与套装绑定**：在配置的更多菜单选择世界、人格和装备套装，切换完成后自动应用对应的本地规则；绑定信息不进入原版 JPX 配置文件。
- **应用状态明确**：所选规则立即应用，“使用中”和识别到的“当前流派”分开标记；保存副本不改变正在执行的规则，战斗中应用会暂停自动操作。
- **彩色标签与排序**：流派、世界、场景和元素统一染色，覆盖我的配置、商店和已分享的浅暗主题。按实际规则组筛选，支持名称/标签搜索、自动排序和手动拖动排序。
- **分享可维护**：更新同一投稿、查看反馈、撤下和移除已撤下记录；目录行可直接下载，分享更新不自动覆盖他人的本地副本。
- **导入导出更清楚**：保留原版配置与多规则组文件的兼容；导出可选使用中、完整配置或自选规则。修复旧配置可选目标字段导致战斗中应用失败的问题。
- **识别与性能**：按世界和角色分别保存识别信息；战斗和谜题中不请求不可访问的角色页。复用配置读取及目录排序，延后生成折叠规则，取消过期统计查询并关闭数据库连接。
- **界面与展示**：收紧手机端筛选和操作布局，修复切页跳动、暗色控件及提示滞留，导出弹窗在游戏宽页面下仍位于手机可视区域内；增加按范围清理统计，同步五个语言包、中英介绍及双主题截图。

旧独立商店脚本已移除，使用主脚本内的配置管理；已有本地配置保留。配置审核后端需同步更新，审核仅关注格式及设备、数据安全，不评价策略。本文仅记录 JPX-PLUS 及其语言包，游戏汉化与独立暗色主题使用各自的版本。
