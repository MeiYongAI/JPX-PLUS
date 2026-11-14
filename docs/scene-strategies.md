# Battle strategies

Open **Configs → Battle strategies**. Select a world and one of the ten styles to inspect its assignments. Browsing these selectors does not change the active style, world, or rules.

Persistent shows General, Arena, Item World, Encounter, and Grindfest. Isekai shows General, Arena, Item World, Tower, and Grindfest. Each picker lists saved rules for that style and world, including groups from multi-mode files.

Automatic selection follows the detected style in the current world: scene rules first, then that style's General rules. Settings in another style's saved rules do not override detection. Each world/style/scene has one assignment; saving, adding or sorting other copies does not replace it.

Multiple General copies are not selected by detected spell element. For example, saved fire and holy Staff configs still share one Staff General assignment. The assigned rules' explicit element takes priority; otherwise the detected spell element is used.

HVUT quick switches invalidate the displayed character page immediately. JPX-PLUS waits for HVUT to finish, then verifies the persona/set, equipped weapons and spell bonuses from fresh server responses before applying the binding. It does not replace the native character form or assume that HVUT's cached tuple is sufficient. Late-created and replaced HVUT top bars are observed without a discovery timeout.

If a switch is not verified before entering battle, JPX-PLUS pauses its automatic actions and rule hotkeys. The pending marker survives navigation in that tab and world; verification resumes outside battle. There is no polling or inferred default style. A failed or inconsistent response leaves the switch unverified. Fixed manual selections and unbound-set behavior are unchanged.

HVUT 顶部快切后，原生角色框可能仍显示旧人格。JPX-PLUS 会立即停用旧页面数据，等待 HVUT 切换结束，再通过服务器响应核实人格／套装、武器和法伤，核实成功后才应用绑定。若未核实就进入战斗，自动动作和策略快捷键保持暂停；返回战斗外完成同步后解除。此流程不轮询、不猜测流派，也不会改写原生角色框。

- Changing a picker reveals **Assign** and **Cancel**. **Assign** records the selected rules as a snapshot for that scene; **Cancel** restores the current choice. Neither browsing nor selecting a draft changes battle behavior.
- **Use General rules** removes the scene-specific assignment. General is resolved for the same world and style.
- **No assignment** on General removes its assignment. If neither scene nor General has usable rules, automatic battle pauses with a reason.
- Existing native slots remain available under their resolved strategy names until explicitly replaced or cleared. This preserves existing automatic routing when upgrading.
- **Save** changes the library copy only. Assign the newer revision when ready; the panel marks saved changes that are not assigned yet.
- **Apply** on a single config selects fixed rules across scenes in the chosen world and persists after reload. **Switch to auto** exits fixed mode without deleting saved rules or assignments. Applying a whole file exits single-group selection; explicit scene assignments remain in place.

Each scene shows its strategy directly in the picker; the active scene has an **In use** marker. Desktop rows align labels and controls, while phone controls stack below their labels. Open the picker to read long names in full. The library distinguishes the current strategy from configs assigned to another scene. Deletion lists application records, fixed selections, scene assignments and loadout bindings. **Detach and delete** removes these references atomically and keeps native settings; detached scenes return to General inheritance. Assignment changes pause a battle only when its effective rules or selection change, including other tabs on the same origin or shared primary/alt storage. Other scenes, inactive General rules and identical replacement copies do not interrupt it. Explicit configuration application still pauses battle before applying.

Scene assignments belong to the PLUS library. Native JPX exports omit assignment metadata. **Export → In use** exports the actual assigned rules; full/native configuration export keeps the native slots. Custom code still requires confirmation before assignment.

## 简体中文

进入**配置管理 → 场景策略**，选择世界和流派。浏览不会切换当前执行状态。主世界显示通用、竞技场、道具界、遭遇战和压榨界；异世界以爬塔替代遭遇战。

自动选择按当前世界和识别到的流派，先用当前场景的规则，没有再用同流派的通用规则。其他流派配置中的设置不会覆盖识别结果。每个世界、流派、场景只能分配一份；新增、保存或排序其他副本不会改变分配。

多份通用配置不会按法术属性自动挑选。例如，火法和圣法的法杖通用配置，仍需在法杖的**通用**中指定一份。该配置明确指定属性时按配置施法，否则使用识别到的属性。

更改选项后才显示**取消**和**分配**，点击**分配**才保存规则；**取消**恢复原选项。选择**使用通用规则**并分配后，恢复使用同世界、同流派的通用策略。通用也未分配且无可用规则时，自动战斗暂停并提示原因。升级后保留原有槽位，明确解除后不再回到该槽位。

桌面横向对齐场景与策略，手机将选项放在场景名下方。当前场景标记**使用中**；长名称可展开查看。

**保存副本**、**分配到场景**和**当前执行**分别显示。修改副本不会悄悄替换正在使用的规则，需要重新分配。单组**应用**仍为跨场景的固定模式，刷新后保留；点击**恢复自动选择**退出。完整配置应用不会清除独立的场景分配。

删除前会列出使用位置，可选择**清除关联并删除**。当前设置保留，清除场景分配后使用通用规则。只有当前使用的规则或选择方式发生变化，场景调整才会暂停战斗；修改其他场景、未使用的通用配置，或换成规则相同的副本不会打断战斗。直接点击**应用**仍会先暂停。原版 JPX 格式不包含场景分配关系，导出**使用中**会导出实际执行的规则。
