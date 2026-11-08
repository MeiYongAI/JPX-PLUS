# Changelog

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
