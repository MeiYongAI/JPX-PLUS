# HentaiVerse 简体中文扩展

独立的 Manifest V3 扩展（1.2.1），面向桌面 Chrome / Edge。无需 Tampermonkey、JPX-PLUS 或在线翻译服务。网址范围、词库和显示规则与同仓汉化用户脚本一致：

- **游戏**：HentaiVerse 主站、alt 站和异世界沿用游戏汉化。
- **论坛**：在 `forums.e-hentai.org/index.php?showtopic=…` 和 `?act=…` 页面处理已适配的装备内容。拍卖帖中的装备链接显示中文与词缀颜色，拍卖助手仍可读取英文原名。论坛首页、其他板块列表和玩家发言不做全文翻译。
- **拍卖站**：支持 `reasoningtheory.net`、`lisieuxing.com`、`auction.ngnl.host` 已适配区域。后两站只处理装备名与相关提示，不翻译出价表单或改动金额。

## 安装与使用

1. 如果已安装「Hentaiverse 汉化」或「HV综合汉化」，先在脚本管理器中停用重复的汉化脚本，避免重复翻译。**JPX-PLUS Simplified Chinese Language Pack 不用关**，它负责 JPX 自己的界面。
2. Chrome 打开 `chrome://extensions`，Edge 打开 `edge://extensions`。启用「开发者模式」→「加载已解压的扩展程序」，选择 [hv-zh-cn](../extensions/hv-zh-cn/) 文件夹（直接包含 `manifest.json`）。如果拿到的是 ZIP，先解压到准备长期保留的位置。
3. 刷新游戏标签页。左侧「中 / 英」按钮切换游戏汉化；战斗页蓝色按钮单独切换日志汉化。切换会刷新页面。开关与拖动位置按站点保存在本地；同站点会沿用原游戏汉化脚本的设置。
4. 在浏览器扩展菜单中固定「HentaiVerse 简体中文」，点击朱红色「文」字图标打开版本与更新面板。默认每 12 小时检查 GitHub；有新版时图标显示 NEW。面板显示上次检查时间，支持立即检查和下载新版；展开「设置」可关闭自动检查或查看词库版本。浏览器关闭时不会定时检查。
5. GitHub ZIP 不会静默安装。手动更新：替换该文件夹内容，在扩展管理页点「重新加载」，若浏览器提示新增站点访问权限，允许后刷新已打开的游戏、论坛和拍卖标签页。卸载：移除扩展并刷新标签页。

**装备悬停与百分比**：论坛装备链接的悬停面板由 Percentage Ranges 提供，不是汉化扩展自带功能。请保留启用该脚本，并允许它在论坛运行及请求游戏站。汉化扩展保留装备标题、等级、属性名及 `Base:` 原值，供其计算百分比和响应 F 切换。

**HV 装备助手**：装备升级模拟刷新右栏时，汉化会在助手的加减数值前显示中文属性名，同时保留英文原名供助手和 HVUT 读取。无需修改装备助手。

## “无感”指什么

扩展在 `document_start` 注册；一出现 `body` 就处理已有节点，并监听解析过程中和 AJAX 后续加入或更新的内容，不等待整个页面加载。不会为了遮住英文而隐藏整页。主菜单、图片按钮、装备名称与战斗日志复用已有汉化规则；对已适配的 HVUT 属性、JPX 战斗日志等区域保留英文原文供脚本解析。大量日志仍分帧处理，第三方脚本自己晚生成的界面也不会被提前生成。

使用 MAIN 执行环境是为了翻译游戏发出的 `alert` / `confirm` / `prompt`；版本检查使用按需唤醒的后台服务和 `alarms`、`storage` 权限，只读取公开的版本清单，不上传游戏数据或执行远程代码。词典和生成图片所需的数据随包提供。

## 维护与验证

词典、显示规则和运行逻辑的维护入口仍是 [HentaiVerse-Chinese.user.js](../HentaiVerse-Chinese.user.js)。修改后在 JPX-PLUS 目录运行以下命令；不要单独编辑生成的 `translate.js` 或 `manifest.json`（站点列表来自脚本的 `@match`）。保留 mbbdzz 原作者、MeiYongAI 维护及 MIT 许可声明。

```sh
npm run build:hv-extension
node scripts/build-hv-extension.cjs --check
# 首次运行浏览器测试需先 npm ci 和 npx playwright install chromium
node --test tests/hv_extension.test.cjs
```

测试用临时 Chromium 配置实际加载扩展，并拦截目标域名返回离线 HTML。它在阻塞后续解析的情况下采样首个 `requestAnimationFrame` 的导航文字，另测动态内容、日志开关、HVUT 英文原文、alt / 异世界及非目标站。论坛和拍卖用相同离线样本对照扩展与用户脚本，不登录账号或实际出价。这个检查不是实站首绘耗时或全页面无闪烁的证明；建议在自己常用的脚本组合下分别复测普通刷新、无刷新过层和长日志战斗。
