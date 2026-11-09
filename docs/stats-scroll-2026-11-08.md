# 统计页斜向拖动滚动条的停顿排查 — 2026-11-08

## 结论与适用范围

用户补充：横向、纵向都会出现，感觉与显示条数关系不大，鼠标拖动并非直线。

按这个操作在 Windows 隔离 Chrome 157.0.8103.38 上复现了原生滚动条的 **drag snapback（拖动回弹）**：按住滑块后，鼠标在与滚动方向垂直的方向偏离轨道过远，滚动位置回到本次按下时的起点；鼠标接近轨道后又跟随拖动。这个跳回／恢复很容易被感知为卡住、拉不动或跳动。

这是与描述吻合的可复现机制，尚未采集用户正在使用的浏览器／扩展组合，不能证明用户每次卡顿均由它造成。本轮没有修改主脚本，也没有安装或发布。

被测主脚本 SHA-256：E92B6232697FD71D977821ABD6707D58C0E1712EA0D907D2025AF3E3946AE190。

## 真实鼠标拖动的对照

使用实际 renderBattleRecordsPage / renderDynamicTable 和 50 条合成记录，保持默认 44 列。Playwright 启动独立 Chrome，并移除默认 --hide-scrollbars 参数，确保按下的是实际可见的浏览器滚动条。窗口 1440 × 900。

| 操作 | 横向 | 纵向 | 拖动中的 tooltip / 单元格 hover |
| --- | --- | --- | --- |
| 直线拖动 | 连续移动 | 连续移动 | 0 / 0 |
| 垂直于轨道偏移 30 px | 连续移动 | 连续移动 | 0 / 0 |
| 垂直于轨道偏移 80 px | 连续移动 | 连续移动 | 0 / 0 |
| 垂直于轨道偏移 160 px | 跳回起点，接近后恢复 | 跳回起点，接近后恢复 | 0 / 0 |

另外关闭 tooltip 伪元素和单元格 hover 边框，把起点设为 100 px 重测。160 px 偏移下仍复现：

- 横向：100 → 130 → … → 316 → **100（连续多次）** → 626 → … → 845。
- 纵向：100 → 122 → … → 265 → **100（连续多次）** → 506 → … → 674。
- 两方向均无文字选区、单元格 hover 或 tooltip 命中。
- 此时没有长 Paint；横向单次 Paint 最大约 2.3 ms，纵向采样没有 Paint 事件。上述回跳不是由大表重绘卡住产生的。

160 px 是本机复现用例，不是通用阈值；阈值由浏览器实现、轨道厚度、缩放等决定。

原始数据及重跑脚本位于本地忽略目录 .test-output/stats-scroll/：drag-hover.cjs、drag-hover.json、drag-hover-control.json。测试网络全部拦截，未读取真实账号记录。

## 源码对应

JPX-PLUS.user.js:6720 使用 overflow:auto 的原生滚动容器。6752–6761 是行高亮、单元格边框和 tooltip 的 CSS；没有替代浏览器原生滑块的拖动实现。

Chromium 主线 third_party/blink/renderer/core/scroll/scrollbar_theme_aura.cc 的 SupportsDragSnapBack 和 ShouldSnapBackToDragOrigin 明确实现此行为：仅检查非滚动方向的越界，偏离允许范围后要求滑块回到拖动起点。2026-11-08 下载的源码保存在 .test-output/stats-scroll/scrollbar_theme_aura.cc，函数分别位于 122 与 397 行；此为主线旁证，不冒充当前安装二进制的精确构建源码。

来源：https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/core/scroll/scrollbar_theme_aura.cc

## 先前发现的其他开销，不作为斜向回跳的结论

- 直接改变 scrollTop/scrollLeft 的合成轨迹下，500 条 × 44 列会增加 Paint 成本；50 条时没有观察到同等级的持续长帧。滚动本身没有调用 renderDynamicTable。
- 更改共享记录／配置会重建整表。共享查询先 allRecords、过滤、排序，再 slice 到显示条数；allRecords 会复制完整归档。减少显示条数不能消除全部归档处理成本。
- 普通滚轮滚动时鼠标位于表格内，hover 会增加绘制，但这不等同于按住原生滚动条滑块时的行为。
- 早期 diagnose.cjs 的拖动实验遗漏移除 headless 的 --hide-scrollbars，实际产生的是内容选区／自动滚动，drag.json 不作为原生滑块证据。有效拖动结论只取 drag-hover 两组报告。
- 脚本设定滚动位置的轨迹、模拟同步 GM 存储耗时均为诊断资料，不等价于真实用户配置、实际脚本管理器或实战性能。

## 处理方向

用户端可将鼠标保持在轨道附近，或使用滚轮／触控板，避免原生滑块的横向偏离回弹条件。关闭 tooltip 不能解决本次复现的行为。

若要改变 JPX 的拖动体验，需要另行实现可捕获指针、允许斜向移动的拖动交互；仅加 will-change、禁用提示或减少显示记录不是该回弹机制的修复。本轮仅诊断，未改动交互。
