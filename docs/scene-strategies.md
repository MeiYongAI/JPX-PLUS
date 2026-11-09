# Scene strategies

Open **Configs → Scene strategies**. Select a world and one of the ten styles to inspect its assignments. Browsing these selectors does not change the active style, world, or rules.

Persistent shows General, Arena, Item World, Encounter, and Grindfest. Isekai shows General, Arena, Item World, Tower, and Grindfest. Each picker lists saved rules for that style and world, including groups from multi-mode files.

- Changing a picker reveals **Assign** and **Cancel**. **Assign** records the selected rules as a snapshot for that scene; **Cancel** restores the current choice. Neither browsing nor selecting a draft changes battle behavior.
- **Inherit General** removes the scene-specific assignment. General is resolved for the same world and style.
- **No assignment** on General removes its assignment. If neither scene nor General has usable rules, automatic battle pauses with a reason.
- Existing native slots remain available under their resolved strategy names until explicitly replaced or cleared. This preserves existing automatic routing when upgrading.
- **Save** changes the library copy only. Assign the newer revision when ready; the panel marks saved changes that are not assigned yet.
- **Apply** on a single config selects fixed rules across scenes in the chosen world and persists after reload. **Restore automatic selection** exits fixed mode without deleting saved rules or assignments. Applying a whole file exits single-group selection; explicit scene assignments remain in place.

Each scene shows its strategy directly in the picker; the active scene has an **In use** marker. Desktop rows align labels and controls, while phone controls stack below their labels. Open the picker to read long names in full. The library distinguishes the current strategy from configs assigned to another scene. Deletion lists application records, fixed selections, scene assignments and loadout bindings. **Detach and delete** removes these references atomically and keeps native settings; detached scenes return to General inheritance. Changes pause affected battle tabs, including other tabs on the same origin or shared primary/alt storage.

Scene assignments belong to the PLUS library. Native JPX exports omit assignment metadata. **Export → In use** exports the actual assigned rules; full/native configuration export keeps the native slots. Custom code still requires confirmation before assignment.

## 简体中文

进入**配置管理 → 场景策略**，选择世界和流派。浏览不会切换当前执行状态。主世界显示通用、竞技场、道具界、遭遇战和压榨界；异世界以爬塔替代遭遇战。

更改选项后才显示**取消**和**分配**，点击**分配**才保存规则；**取消**恢复原选项。选择**使用通用规则**并分配后，恢复使用同世界、同流派的通用策略。通用也未分配且无可用规则时，自动战斗暂停并提示原因。升级后保留原有槽位，明确解除后不再回到该槽位。

桌面横向对齐场景与策略，手机将选项放在场景名下方。当前场景标记**使用中**；长名称可展开查看。

**保存副本**、**分配到场景**和**当前执行**分别显示。修改副本不会悄悄替换正在使用的规则，需要重新分配。单组**应用**仍为跨场景的固定模式，刷新后保留；点击**恢复自动选择**退出。完整配置应用不会清除独立的场景分配。

删除前会列出使用位置，可选择**清除关联并删除**。当前设置保留，清除场景分配后使用通用规则；受影响的战斗标签页会暂停。原版 JPX 格式不包含场景分配关系，导出**使用中**会导出实际执行的规则。
