# Changelog

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
