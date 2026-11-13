# Upgrading

Primary and alt share settings, completed battle records and daily stamina from 2026.11.08.12. Close older running tabs, then visit both hosts outside combat once. Both previous settings copies remain recoverable under **Stats → Data → Primary / alt shared data**. See [migration rules and limitations](alt-shared-data-2026-11-08.md).

[English README](../README.md) · [简体中文](#简体中文)

## Updating JPX-PLUS

From 2026.11.13, support and attack actions share one ordered rule list, and normal attacks support conditions. Back up battle settings before updating. Older configurations convert when loaded; save them once to keep the new format. Files saved or exported in the new format require JPX-PLUS 2026.11.13 or upstream JPX 2026.11.11 or later.

When updating an existing installation, update the main script and language pack together. Monster information is built in; the companion database script is optional. GitHub sessions now renew automatically, but an older login may require one new authorization because previous versions did not save refresh credentials. Signing out requires confirmation. [Authentication details](store-authentication.md).

The Simplified Chinese pack is named JPX-PLUS-ZhCN.user.js. The old ZhTrans file is no longer provided. If your installation still updates from the old ZhTrans address, install ZhCN using the link in the README. Keep only one Simplified Chinese pack enabled.

## From original JPX

Export the settings and records you want to keep, then disable the old main script and its language pack. Install JPX-PLUS and, if needed, one matching language pack.

Import battle configs under **Configs → My configs → Import**. Imported rules are saved first. **Scene strategies** assigns saved rules by world, style and scene, with General inheritance. **Apply** on one mode fixes that ruleset across scenes and reloads; **Restore automatic selection** exits fixed mode. A complete file stays one item and updates native settings; explicit scene assignments remain in place. See [selection behavior](scene-strategies.md).

Statistics and historical records retain their own import/export controls. The local library is separate from the native battle settings. Original JPX files remain supported; PLUS-specific options are not a promise of lossless export back to original JPX.

## Existing Config Store installations

The standalone script is no longer distributed. Use **Configs → My configs / Store / Shared** in JPX-PLUS. Configs already in My configs remain available. If any configs are still only in the old plugin, export them before disabling or uninstalling it, then import those files into My configs. Sign in separately in the integrated Store when needed.

## Save, apply and update

In **My configs → More → Bind loadout**, choose a world, persona and equipment set. A confirmed switch applies the matching saved config. Bindings stay local and are not included in native JPX exports. One config can bind to several combinations; each combination selects one config. Manual application is kept until you switch to another combination. Unbound sets and removing a binding keep the current rules. Editing a bound copy affects the next matching switch; code added by a later update requires binding confirmation again.

| Action | Result |
| --- | --- |
| Save in the rule editor | Update the local saved copy |
| Scene strategies → Assign | Save a scene snapshot; unassigned scenes inherit General |
| Restore automatic selection | Exit fixed single-group mode without deleting saved rules |
| Detach and delete | List and remove references, then delete the saved copy |
| Apply / Update & apply | Write those rules to the selected world and use them; pause automatic battle actions if running |
| Store → Save | Add a local copy without applying it |
| Store → Update saved copy | Replace that local copy after your confirmation; apply it separately |
| Shared → Update | Submit a revision to the same public listing |
| Shared → Withdraw | Remove the listing from the store; imported copies remain |
| Remove from list | Archive a withdrawn submission in the UI; keep its GitHub record and local rules |

## 简体中文

### 更新 JPX-PLUS

从 2026.11.13 起，辅助与攻击合并为一份有序规则列表，普通攻击也能设置条件。更新前请备份战斗设置。旧配置载入时自动转换，保存一次后使用新格式。新格式的保存或导出文件需要 JPX-PLUS 2026.11.13、上游 JPX 2026.11.11 或更新版本。

简体语言包统一使用 JPX-PLUS-ZhCN.user.js，不再提供旧 ZhTrans 文件。仍使用旧 ZhTrans 地址更新的用户，请通过 README 中的链接安装 ZhCN。只需启用一个简体语言包。

已有安装请同步更新主脚本和语言包。怪物资料已内置，数据库配套脚本不再必需。GitHub 登录支持自动续期；旧版没有保存续期凭据，更新后可能需要重新授权一次。退出登录须确认。[登录说明](store-authentication.md#简体中文)。

### 从原版 JPX 迁移

先导出需要保留的配置与记录，再停用旧主脚本及其语言包，安装 JPX-PLUS 和一个所需语言包。

在**配置管理 → 我的配置 → 导入**添加战斗配置，导入后先保存为副本。**场景策略**按世界、流派、场景分配规则，未单独分配时使用通用规则。单组**应用**会跨场景固定使用，刷新后仍保留；点击**恢复自动选择**退出。完整配置保留为一个条目并更新原生设置，独立的场景分配仍然保留。详见[选择规则](scene-strategies.md#简体中文)。

统计设置与历史记录仍使用各自的导入导出入口。本地配置库和原生战斗设置分别保存；支持导入原版 JPX 文件，但 PLUS 特有选项不保证降级到原版后完全保留。

### 已安装旧商店

旧独立脚本不再提供，请使用主脚本中的**配置管理 → 我的配置 / 商店 / 已分享**。已进入“我的配置”的条目继续保留；如果配置还只存在旧插件中，请先导出，再停用或卸载旧插件，并将文件导入“我的配置”。需要分享时在内置商店登录。

### 保存、应用与更新

在**我的配置 → 更多 → 绑定套装**选择世界、人格和装备套装。切换到已绑定组合后自动应用对应规则；同一配置可绑定多个组合，每个组合对应一份配置。绑定仅保存在本地，不进入原版 JPX 导出文件。手动应用保持有效，直到切换到其它组合；未绑定的套装和解除绑定都保持当前规则。修改已绑定副本后，下次切换时使用新版；后续更新加入自定义代码时需重新确认绑定。

编辑页**保存**更新本地副本，**应用 / 更新并应用**才让规则生效；从商店保存或更新副本同样不会自动应用。**已分享 → 更新**修改同一投稿，审核期间保留已通过的旧版。撤下不删除他人的本地副本，移除记录也不会删除自己的规则或 GitHub 历史。

**场景策略 → 分配**保存该场景要用的规则，**恢复自动选择**退出固定规则。删除正在使用的副本时，先查看使用位置，再选择**清除关联并删除**。
