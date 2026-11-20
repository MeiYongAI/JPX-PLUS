# 扩展自动更新：由浏览器负责

两个扩展都提供签名 CRX，后续版本沿用各自的签名密钥。支持自托管扩展的浏览器会定期读取[更新清单](https://meiyongai.github.io/JPX-PLUS/extensions/updates.xml)，检查版本及签名，自动下载安装新版。**无需本地更新器、计划任务或常驻程序。**

| 安装方式 | 更新行为 |
| --- | --- |
| 支持自托管 CRX 的 Chromium 安装环境（如 Linux 桌面 Chrome、管理员已配置相应策略的托管浏览器） | 浏览器原生自动更新。首次安装必须使用签名包或管理员配置的更新通道。具体安装限制以浏览器策略为准。 |
| Chrome / Edge「加载已解压的扩展程序」 | 不会变成签名安装。面板默认每 12 小时检查 GitHub，发现新版可下载 ZIP，覆盖**原目录**后点「重新加载」。 |
| 普通个人 Windows 上的 Chrome / Edge | 不要把 GitHub 的 CRX 当成商店安装包。要获得面向普通用户的原生自动安装体验，需要对应商店分发；目前未上架。 |

- **HV Utils**：[签名包 4.2.4.2](https://meiyongai.github.io/JPX-PLUS/extensions/hv-utils-4.2.4.2.crx) · ID `fakllkpacebljdkappedbefcooiimdop`
- **HV 简体中文**：[签名包 1.2.3](https://meiyongai.github.io/JPX-PLUS/extensions/hv-zh-cn-1.2.3.crx) · ID `peajhkaihfabnchjkhnppmhofachdjog`

面板里的「每 12 小时自动检查」只控制 ZIP 提醒，不控制浏览器的原生更新周期。由解压版改为签名版时 ID 可能改变，先备份 HVUT 配置，避免同时启用两份。不要为安装扩展而关闭浏览器安全保护。

## 维护者发版

分别运行 `node scripts/build-hv-extension.cjs`、`python scripts/build-hv-utils-extension.py`、`python scripts/package-extensions.py`；然后运行 `node scripts/sign-extensions.cjs <仓库外的私钥目录>`。保管好 `hv-utils.pem` 和 `hv-zh-cn.pem` 的私有备份，不要提交。不要更换签名密钥，否则原有安装不能沿用该通道。将新 ZIP、`docs/extensions` 下的 CRX、更新清单和生成源一并发布到 main（GitHub Pages 从 `/docs` 部署）。
