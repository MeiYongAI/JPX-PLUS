# jpx-plus

JPX-PLUS userscript for Hentaiverse. Installation file: `jpx-plus.user.js`.

Install directly in Tampermonkey/Violentmonkey using the raw file URL from this repo.

## HV Dark Mode (Stylus)

本仓库同时包含一个为 Hentaiverse 提供的深色主题样式文件：`hv-dark-mode.user.css`。

使用方法（推荐 Stylus 浏览器扩展）：

1. 安装 Stylus（Chrome/Edge/Firefox 均支持）。
2. 打开 Stylus → 新建样式，或直接导入仓库中的 `hv-dark-mode.user.css` 文件。
3. 在样式的适用范围中设置为 `domain("hentaiverse.org")`（文件已包含该规则），并保存启用。

说明：该样式会在页面最开始加载时生效，避免页面闪烁；因此建议使用 Stylus 而不是把 CSS 内嵌到 userscript。

如果你想让 Tampermonkey 自动更新 `jpx-plus.user.js`，把脚本安装地址设置为：

```
https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/jpx-plus.user.js
```

如需我把 README 翻译为其它语言或添加截图说明，告诉我即可。
