# Config Store source

This directory contains the independent Config Store plugin. `service.js` handles GitHub requests, authorization, validation, and integrity checks. `ui.js`, `ui.css`, and `i18n.json` provide the settings tab and its English/Chinese interface. The main script exposes the small `JPXPlus.registerSettingsTab` bridge; it does not contain the plugin's network permissions or credentials.

The local backpack uses one userscript-manager storage key per saved configuration. Its names and descriptions wrap an unchanged JPX configuration; they never enter the game's battle or statistics settings. Saving and editing backpack entries do not require login or send requests. Applying an entry goes through the core import bridge and remains undoable until the user saves. Public submissions still use the separate publishing validator and review process.

From the repository root, use Node.js 20 or later:

```sh
node plugins/config-store/service.test.cjs
node scripts/build-config-store.cjs
node scripts/build-config-store.cjs --check
node --check JPX-PLUS-ConfigStore.user.js
```

No dependency installation is required. The service tests use mocked GitHub responses and credentials, and make no network requests. Change the source files here, then rebuild the root userscript; update its release version in the build script when publishing. The generated userscript is committed so userscript managers can install and update it directly.

The review workflow and public catalog are maintained in [JPX-PLUS-Configs](https://github.com/MeiYongAI/JPX-PLUS-Configs). Only the public GitHub App client ID belongs in this plugin. DeepSeek keys belong in the review repository's Secrets.
