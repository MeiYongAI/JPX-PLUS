# Built-in monster information

Starting with JPX-PLUS 2026.11.09.1, **Basic settings → Monster class, attack & power** works without a separate Monster DB userscript. Enable it and save. Update the main script and your language pack together.

## Data and updates

- Source: [Sukka Monster Database](https://hv-monster.skk.moe/). The public snapshots are [Persistent](https://hv-monsterdb-data.skk.moe/persistent.json) and [Isekai](https://hv-monsterdb-data.skk.moe/isekai.json). JPX reads JSON data, not remote executable code.
- Downloads use an anonymous GET through the userscript manager. Accept its permission for hv-monsterdb-data.skk.moe when installing/updating if prompted. No game credentials or battle logs are sent.
- A download is needed only when the display is enabled or the selected battle mode uses monster-class, power-level or database-age conditions. In the lobby, updates run when the browser is idle. An empty battle cache can also download on first use; combat initialization does not await it.
- One successful snapshot refresh per UTC day and world. Same-origin tabs share a transactional download lease; failures back off for five minutes. A failed download or transaction preserves the previous snapshot.
- IndexedDB caches only ID, name, class, attack, PL and update time. The main host and alt have separate origin-local caches; these bulk records do not enter the shared configuration/history store, exports or backups. Persistent and Isekai never share monster records.
- Battle initialization/AJAX round replacement reads only the current monsters. Ordinary turns do not download or read the full database. A spawned ID takes precedence over a name; a name is used only when no ID is available. Unrecorded monsters show ?, without inventing PL.

## Scan and existing scripts

Successful Scan results update the displayed fields and a separate local Scan cache. Newer local scans survive an older server snapshot. Scan results are **not uploaded** by this integration. It does not add automatic scanning, a second information panel or the companion script's highlighting features.

The existing window.HVMonsterDB reader remains compatible if the companion is still installed; newer local Scan records are retained. The built-in implementation itself requires no companion. Delayed results from a replaced battle log or puzzle transition are not applied to that page.

**Clear all JPX-PLUS data** also deletes this origin's monster snapshot and Scan cache. A subsequent enabled visit downloads a fresh snapshot. Unknown data or an unavailable endpoint does not stop battle initialization.

## 简体中文

从 **2026.11.09.1** 起，在基础设置中勾选 **显示怪物类别、攻击类型和战斗力** 并保存即可使用，不再需要安装怪物数据库脚本。主脚本与语言包应一起更新。

- 数据由 Sukka 怪物数据库提供。仅发送匿名 GET 下载公开 JSON；不发送游戏登录信息或战斗日志，不执行远程代码。
- 主世界、异世界分库，按需每日 UTC 更新一次。非战斗时安排空闲更新；首次在战斗中使用且没有缓存时也可异步下载，不等待下载完成再开始初始化。
- 平时读取本轮怪物的本地资料，不会每回合联网。同源多标签页避免重复下载；失败后五分钟退避，并保留上一次可用数据。未知怪物显示 ?。
- 使用原有怪物类别、战斗力、距数据库更新天数条件的规则，即使关闭资料显示也会按需读取。只有显示和这些条件都不用时才不下载。
- 手动或现有规则触发的 **Scan** 会更新显示和本地缓存，较新的扫描结果不会被旧快照覆盖。本次接入**不向服务端上传扫描结果**，也不增加自动 Scan 规则。
- 主站与 alt 的 IndexedDB 缓存各自独立，不加入配置导出、共享战斗历史或备份。清除全部 JPX-PLUS 数据时会同时清除此站点的怪物缓存。
- 原配套脚本可以卸载；保留它时仍支持旧 API。其独立信息面板、高亮、扫描上传功能未搬入 JPX-PLUS。

## Implementation evidence

Upstream interface/schema reference: [SukkaW/hv-monsterdb-userscript](https://github.com/SukkaW/hv-monsterdb-userscript/tree/d4abcbb1074b2cbfda353f01540cb12fdfea7b8f), notably src/types.ts, src/lib/api.ts, src/lib/localDataBase.ts and src/lib/parseLog.ts. The integration uses independently written code and does not bundle the companion.

On 2026-11-09, both public snapshot endpoints returned HTTP 200. All 44,585 Persistent records and 35,248 Isekai records passed the integration's field validation without duplicate IDs. This verifies the data source, not a live game session.

In an isolated installed-Chrome fixture using those full snapshots, chunked validation and atomic IDB batches completed in approximately 3.6 / 2.8 seconds; ten indexed monster reads took approximately 1.2 / 0.8 ms. No >50 ms long task was observed during these measured imports. Network transfer and JSON parsing were outside that timed import; this is not a mobile or Firefox benchmark.

Browser regression coverage is in tests/jpx_monster_database.test.cjs: standalone startup, reload, settings activation, native Scan callbacks, both worlds, translation ordering, late round/puzzle responses, offline fallback, schema rejection, local Scan precedence and two-tab download coordination. Fixture requests are intercepted. No real account, installed userscript, live combat or upload was exercised.

Final validation on 2026-11-09: **586/586 full repository tests passed**, including 16 new monster-database tests. Main-script syntax, embedded-source consistency and all language-pack consistency checks passed. The settings control was exercised in six languages, light/dark themes and 320/1440 px widths; the Chinese screenshots were visually inspected. Full cleanup removed the database in an isolated origin. Results are local validation, not publication or userscript-manager installation.
