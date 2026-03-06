// ==UserScript==
// @name         jpx-plus
// @author       MeiYongAI
// @icon           https://hentaiverse.org/y/favicon.png
// @namespace    ijpx
// @version      2026.03.05
// @description  jpx
// @run-at       document-end
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      e-hentai.org
// ==/UserScript==

let cfgBattle = {};
let defaultCfgBattle = {
    "battleVersion": 20251216,
    "advanceToNextRound": false,
    "autoStartBattle": false,
    "autoEncounter": false,
    "autoDawn": false,
    "encounterDailyLimit": 24,
    "notifyOnRiddle": false,
    "autoArena": false,
    "arenaDailyLimit": 14,
    "autoRingOfBlood": false,
    "ringOfBloodChallenges": [],
    "isekaiMode": false,
    "randomDelayEnabled": false,
    "delayRangeMs": [0, 0],
    "showCooldowns": false,
    "quickbarExtend": [],
    "showDurations": false,
    "showRealTimeProficiency": false,
    "showMonsterIndex": false,
    "showMonsterInfo": false,
    "showMonsterHP": false,
    "recordBattleLog": false,
    "dailyStaminaQuotaPlus": 0,
    "ctrlWidgetStyleText": [],
    "ctrlWidgetMouseEnter": false,
	"ctrlWidgetRows": [
        {"id":"isActiveBattle"},
        {"id":"readyNext"},
        {"id":"networkDelay"},
        {"id":"battleStyle"},
        {"id":"battleType"},
        {"id":"round"}
    ],
    "OneHanded_General": {
        "supports": [
            {"type":"itemInstant","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"itemInstant","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Health Gem","conditions":[{"key":"pHP","value":[0,1]}]},
            {"type":"spellInstant","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellInstant","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"itemInstant","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"itemDuration","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellDuration","name":"Heartseeker","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Heartseeker"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"toggle","name":"Spirit","toggled":true,"conditions":[{"key":"pOC","value":[6,10]}]},
            {"type":"spellDuration","name":"Heartseeker","conditions":[{"key":"pEffects","value":[-1,0,"Heartseeker"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"itemDuration","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]}]},
            {"type":"itemDuration","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]}]},
            {"type":"itemDuration","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","name":"Weaken","tailSkip":0,"bottomUp":false,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tTypes","value":["Arena400","Arena500"]},{"key":"tIgnoredEffects","value":[1,9999,"Weakened"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"world","value":["Persistent"]},{"key":"tDaysSinceUpdate","value":[45,9999]},{"key":"tIgnoredEffects","value":[0,9999,"Imperiled","Searing Skin","Freezing Limbs","Turbulent Air","Deep Burns","Breached Defense","Blunted Attack"]}]},
            {"type":"skill","name":"Scan","conditions":[{"key":"pActionCounts","value":[0,0,"Scan"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tName","value":"Yggdrasil"}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena500","Arena400"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"skill","name":"Orbital Friendship Cannon","conditions":[{"key":"activeMonsters","value":[6,10]},{"key":"pOC","value":[9,10]},{"key":"pSpiritStatus","value":true}]},
            {"type":"smartDebuff","name":"Imperil","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"]}]},
            {"type":"smartDebuff","name":"Imperil","bottomUp":false,"tailSkip":-1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"]},{"key":"activeBosses","value":[0,0]}]},
            {"type":"skill","name":"Merciful Blow","conditions":[{"key":"tTypes","value":["Ultimate","Arena300","Arena400","Arena500"]},{"key":"tEffects","value":[0,9999,"Bleeding Wound"]},{"key":"tHP","value":[0.04,0.22]},{"key":"pOC","value":[4.5,10]}]},
            {"type":"skill","name":"Vital Strike","conditions":[{"key":"tTypes","value":["Ultimate","Arena300","Arena400","Arena500"]},{"key":"tEffects","value":[0,9999,"Stunned"]},{"key":"tHP","value":[0.05,1]},{"key":"pOC","value":[2.5,10]}]},
            {"type":"normalAttack"}
        ]
    },
    "OneHanded_Tower": {
        "supports": [
            {"type":"itemInstant","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"itemInstant","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Health Gem","conditions":[{"key":"pHP","value":[0,1]}]},
            {"type":"spellInstant","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellInstant","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"itemInstant","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"itemDuration","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellDuration","name":"Heartseeker","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Heartseeker"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"toggle","name":"Spirit","toggled":true,"conditions":[{"key":"pOC","value":[6,10]},{"key":"defeatedMonsters","value":[1,10]}]},
            {"type":"spellDuration","name":"Heartseeker","conditions":[{"key":"pEffects","value":[-1,0,"Heartseeker"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"itemDuration","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]}]},
            {"type":"itemDuration","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]}]},
            {"type":"itemDuration","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","name":"Sleep","bottomUp":true,"tailSkip":1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Asleep"]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[36,9999]}]},
            {"type":"smartDebuff","name":"Weaken","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Weakened","Asleep"]},{"key":"roundCurrent","value":[10,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"smartDebuff","name":"Silence","bottomUp":true,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Asleep","Silenced"]},{"key":"roundCurrent","value":[15,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"smartDebuff","name":"Imperil","bottomUp":false,"tailSkip":-1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"skill","name":"Merciful Blow","conditions":[{"key":"tEffects","value":[0,9999,"Bleeding Wound"]},{"key":"tHP","value":[0.04,0.22]},{"key":"pOC","value":[4.5,10]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[95,9999]}]},
            {"type":"skill","name":"Vital Strike","conditions":[{"key":"tEffects","value":[0,9999,"Stunned"]},{"key":"tHP","value":[0.05,1]},{"key":"pOC","value":[2.5,10]},{"key":"pSpiritStatus","value":true},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[60,9999]}]},
            {"type":"normalAttack"}
        ]
    },
    "1H_Mage_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "TwoHanded_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "2H_Mage_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "DualWielding_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "DW_Mage_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "NitenIchiryu_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "NI_Mage_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
    "Staff_General": {
        "supports": [
            {"type":"itemInstant","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"itemInstant","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"itemInstant","name":"Health Gem","conditions":[{"key":"pHP","value":[0,1]}]},
            {"type":"spellInstant","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellInstant","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"itemInstant","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"itemInstant","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.1]}]},
            {"type":"itemDuration","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellDuration","name":"Arcane Focus","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Arcane Focus"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"spellDuration","name":"Arcane Focus","conditions":[{"key":"pEffects","value":[-1,0,"Arcane Focus"]}]},
            {"type":"spellDuration","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"itemDuration","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]}]},
            {"type":"itemDuration","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]}]},
            {"type":"itemDuration","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","name":"Weaken","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Weakened"]},{"key":"tTypes","value":["Arena400","Arena500"]}]},
            {"type":"smartDebuff","name":"Silence","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Silenced"]},{"key":"tTypes","value":["Arena400","Arena500"]}]},
            {"type":"smartDebuff","name":"Imperil","bottomUp":false,"tailSkip":0,"maxAtFirst":3,"minMonstersLeft":5,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tName","value":"Yggdrasil"}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled","Coalesced Mana"]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Coalesced Mana"]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled","Coalesced Mana"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"spellDamage","name":"T3","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T2","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T1","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T3","conditions":[{"key":"pMP","value":[0.4,1]}]},
            {"type":"spellDamage","name":"T2","conditions":[{"key":"pMP","value":[0.4,1]}]},
            {"type":"spellDamage","name":"T1","conditions":[{"key":"pMP","value":[0.4,1]}]}
        ]
    },
    "Unarmed_General": {
        "supports": [

        ],
        "attacks": [

        ]
    },
};
let cfgStats = {};
let defaultCfgStats = {
    "statsVersion": 20260109,
    "combatRows": [
        {"id":"fire"},
        {"id":"cold"},
        {"id":"wind"},
        {"id":"elec"},
        {"id":"holy"},
        {"id":"dark"},
        {"id":"crushing","s_pt":"background-color: #ff6a6a;"},
        {"id":"slashing","s_pt":"background-color: #ff6a6a;"},
        {"id":"piercing","s_pt":"background-color: #ff6a6a;"},
        {"id":"void"},
        {"id":"damagePlus"},
        {"id":"damageTotal"},
        {"id":"glance","s_pt":"background-color: #e58a8a;"},
        {"id":"hit","s_pt":"background-color: #e58a8a;"},
        {"id":"crit","s_pt":"background-color: #e58a8a;"},
        {"id":"miss","s_pt":"background-color: #66cc33;"},
        {"id":"evade","s_pt":"background-color: #66cc33;"},
        {"id":"parry","s_pt":"background-color: #66cc33;"},
        {"id":"resist","s_md":"background-color: #8f7ee6;"},
        {"id":"block","s_pt":"background-color: #66cc33;"},
        {"id":"resultTotal"},
        {"id":"resist50","s_md":"background-color: #b5a8f2;"},
        {"id":"resist75","s_md":"background-color: #b5a8f2;"},
        {"id":"resist90","s_md":"background-color: #b5a8f2;"},
        {"id":"parryPartially","s_pt":"background-color: #9fd67a;"},
        {"id":"resistPartially","s_md":"background-color: #b5a8f2;"},
        {"id":"blockPartially","s_pt":"background-color: #9fd67a;"}
    ],
    "revenueRows": [
        {"id":"exp"},
        {"id":"proficiency"},
        {"id":"credit","styleText":"color: #a89000;"},
        {"id":"equipment","styleText":"color: #f00;"},
        {"id":"material","styleText":"color: #f00;"},
        {"id":"consumable","styleText":"color: #00b000;"},
        {"id":"token","styleText":"color: #3A7540;"},
        {"id":"food","styleText":"color: #489eff;"},
        {"id":"figurine","styleText":"color: #25f;"},
        {"id":"artifact","styleText":"color: #25f;"},
        {"id":"trophy","styleText":"color: #7C4BFF;"},
        {"id":"crystal","styleText":"color: #ba05b4;"},
        {"id":"crystalTotal","styleText":"color: #ba05b4;"},
        {"id":"totalProfit"},
        {"id":"stamina"},
        {"id":"finalProfit"}
    ],
    "statsColumns": [
        {"id":"date"},
        {"id":"world"},
        {"id":"level"},
        {"id":"persona"},
        {"id":"battleType"},
        {"id":"round"},
        {"id":"deltaTime"},
        {"id":"turns"},
        {"id":"tps"},
        {"id":"finalProfit"},
        {"id":"credit"},
        {"id":"eqP"},
        {"id":"eqL"},
        {"id":"eqM"},
        {"id":"cha"},
        {"id":"blo"},
        {"id":"food"},
        {"id":"fig"},
        {"id":"arti"},
        {"id":"crys"},
        {"id":"t2"},
        {"id":"t36"},
        {"id":"lCharm"},
        {"id":"gCharm"},
        {"id":"seed"},
        {"id":"hd"},
        {"id":"md"},
        {"id":"sd"},
        {"id":"hp"},
        {"id":"mp"},
        {"id":"sp"},
        {"id":"he"},
        {"id":"me"},
        {"id":"se"},
        {"id":"le"},
        {"id":"swif"},
        {"id":"prot"},
        {"id":"avat"},
        {"id":"abso"},
        {"id":"shad"},
        {"id":"life"},
        {"id":"gods"},
        {"id":"staminaCost"},
        {"id":"totalProfit"}
    ]
};
let cfgTheme = {};
let defaultCfgTheme = {
    "themeVersion": 20260304,
    "darkMode": false
};
let cfg = {
    //CSS
    styleText: `
        :root {
            --jpx-primary: #4a90d9;
            --jpx-primary-dark: #357abd;
            --jpx-primary-darker: #2c6aab;
            --jpx-surface: #fafbfc;
            --jpx-surface-alt: #f0f2f5;
            --jpx-border: #e0e3e8;
            --jpx-border-light: #e8eaed;
            --jpx-text: #1a1d21;
            --jpx-text-secondary: #4e5969;
            --jpx-text-muted: #86909c;
            --jpx-radius: 8px;
            --jpx-radius-sm: 6px;
            --jpx-shadow: 0 2px 8px rgba(0,0,0,0.08);
            --jpx-shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
            --jpx-success: #00b365;
            --jpx-success-hover: #00d97e;
            --jpx-bg: #ffffff;
            --jpx-bg-alt: #f5f5f5;
        }

        [data-theme="dark"] {
            --jpx-primary: #6eb3ff;
            --jpx-primary-dark: #5a9feb;
            --jpx-primary-darker: #4681d1;
            --jpx-surface: #1e1e1e;
            --jpx-surface-alt: #2d2d2d;
            --jpx-border: #3d3d3d;
            --jpx-border-light: #4a4a4a;
            --jpx-text: #e8e8e8;
            --jpx-text-secondary: #d0d0d0;
            --jpx-text-muted: #a0a0a0;
            --jpx-shadow: 0 2px 8px rgba(0,0,0,0.5);
            --jpx-shadow-lg: 0 8px 24px rgba(0,0,0,0.7);
            --jpx-bg: #1a1a1a;
            --jpx-bg-alt: #252525;
        }

        /* Dark mode styles scoped to JPX-PLUS containers only */
        [data-theme="dark"] .settings-window,
        [data-theme="dark"] #ctrl-widget,
        [data-theme="dark"] #encounter-widget,
        [data-theme="dark"] .enc-header,
        [data-theme="dark"] .enc-body,
        [data-theme="dark"] .enc-row {
            background-color: var(--jpx-surface);
            color: var(--jpx-text);
            border-color: var(--jpx-border);
        }

        /* JPX scrollbar - 浅色模式下重置（防止被 HV 深色滚动条影响） */
        html:not([data-theme="dark"]) .settings-window ::-webkit-scrollbar {
            width: 10px;
        }
        html:not([data-theme="dark"]) .settings-window ::-webkit-scrollbar-track {
            background: #f1f1f1 !important;
        }
        html:not([data-theme="dark"]) .settings-window ::-webkit-scrollbar-thumb {
            background: #c1c1c1 !important;
            border-radius: 5px;
        }
        html:not([data-theme="dark"]) .settings-window ::-webkit-scrollbar-thumb:hover {
            background: #a1a1a1 !important;
        }

        /* JPX scrollbar - 深色模式 */
        [data-theme="dark"] .settings-window ::-webkit-scrollbar {
            width: 10px;
        }
        [data-theme="dark"] .settings-window ::-webkit-scrollbar-track {
            background: var(--jpx-bg);
        }
        [data-theme="dark"] .settings-window ::-webkit-scrollbar-thumb {
            background: var(--jpx-border);
            border-radius: 5px;
        }
        [data-theme="dark"] .settings-window ::-webkit-scrollbar-thumb:hover {
            background: var(--jpx-text-muted);
        }

        [data-theme="dark"] .settings-window a,
        [data-theme="dark"] #ctrl-widget a,
        [data-theme="dark"] #encounter-widget a {
            color: #6eb3ff;
        }

        [data-theme="dark"] .settings-window a:visited,
        [data-theme="dark"] #ctrl-widget a:visited,
        [data-theme="dark"] #encounter-widget a:visited {
            color: #9fbfff;
        }

        [data-theme="dark"] .settings-window button,
        [data-theme="dark"] .settings-window input,
        [data-theme="dark"] .settings-window select,
        [data-theme="dark"] .settings-window textarea,
        [data-theme="dark"] #ctrl-widget button,
        [data-theme="dark"] #ctrl-widget input,
        [data-theme="dark"] #ctrl-widget select,
        [data-theme="dark"] #ctrl-widget textarea,
        [data-theme="dark"] #encounter-widget button,
        [data-theme="dark"] #encounter-widget input,
        [data-theme="dark"] #encounter-widget select,
        [data-theme="dark"] #encounter-widget textarea {
            background-color: var(--jpx-surface);
            color: var(--jpx-text);
            border-color: var(--jpx-border);
        }

        [data-theme="dark"] .settings-window *::placeholder,
        [data-theme="dark"] #ctrl-widget *::placeholder,
        [data-theme="dark"] #encounter-widget *::placeholder {
            color: var(--jpx-text-muted);
        }

        #ctrl-widget {
            position: fixed;
            top: 100px;
            left: 100px;
            width: 200px;
            height: auto;
            z-index: 10000;
            color: var(--jpx-text);
            font-size: 13px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            text-align: left;
            padding: 0;
            background: var(--jpx-surface);
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius);
            box-shadow: var(--jpx-shadow);
            user-select: none;
            cursor: default;
        }

        #ctrl-widget-header {
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, var(--jpx-primary), var(--jpx-primary-dark));
            border-radius: var(--jpx-radius) var(--jpx-radius) 0 0;
            cursor: move;
            text-align: center;
            letter-spacing: 0.3px;
        }

        #ctrl-widget-body {
            padding: 12px 14px;
        }

        #ctrl-widget .cw-info {
            font-size: 12px;
            line-height: 1.8;
            margin-bottom: 8px;
            white-space: pre-line;
            text-align: center;
            color: var(--jpx-text-secondary);
        }

        #ctrl-widget .cw-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-top: 1px solid var(--jpx-border);
        }

        #ctrl-widget .cw-row-label {
            font-size: 12px;
            color: var(--jpx-text-secondary);
        }

        #ctrl-widget .cw-toggle-btn {
            width: 100%;
            padding: 6px 10px;
            font-size: 12px;
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius-sm);
            background: var(--jpx-surface-alt);
            color: var(--jpx-text);
            cursor: pointer;
            text-align: center;
            transition: background 0.15s, border-color 0.15s;
        }

        #ctrl-widget .cw-toggle-btn:hover {
            background: #e5e8eb;
        }

        #ctrl-widget .cw-toggle-btn.on {
            background: #e6f7ee;
            border-color: #a3e6c4;
            color: #0d7d42;
        }

        #ctrl-widget .cw-toggle-btn.off {
            background: #fef2f2;
            border-color: #fecaca;
            color: #b91c1c;
        }

        [data-theme="dark"] #ctrl-widget .cw-toggle-btn:hover {
            background: #2a2f33;
        }

        [data-theme="dark"] #ctrl-widget .cw-toggle-btn.on {
            background: #162e1e;
            border-color: #2a6b42;
            color: #6ee7a0;
        }

        [data-theme="dark"] #ctrl-widget .cw-toggle-btn.off {
            background: #2e1616;
            border-color: #6b2a2a;
            color: #f87171;
        }

        #ctrl-widget .cw-delay-info {
            font-size: 11px;
            color: var(--jpx-text-muted);
            line-height: 1.6;
            padding: 8px 0;
            border-top: 1px solid var(--jpx-border);
        }

        #ctrl-widget .cw-delay-btns {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px 0;
            border-top: 1px solid var(--jpx-border);
        }

        #ctrl-widget .cw-delay-btns button {
            flex: 1 1 0;
            padding: 6px 10px;
            font-size: 12px;
            background: #fff;
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius-sm);
            cursor: pointer;
            color: var(--jpx-text-secondary);
            transition: background 0.15s, border-color 0.15s;
        }

        #ctrl-widget .cw-delay-btns button:hover {
            background: var(--jpx-surface-alt);
            border-color: var(--jpx-primary);
            color: var(--jpx-primary);
        }

        [data-theme="dark"] #ctrl-widget .cw-delay-btns button {
            background: var(--jpx-surface);
        }

        #ctrl-widget .cw-status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 4px;
        }

        /* === Encounter / JPX-PLUS 浮窗 === */
        #encounter-widget {
            position: fixed;
            top: 150px;
            left: 100px;
            width: 220px;
            z-index: 10000;
            background: var(--jpx-surface);
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius);
            box-shadow: var(--jpx-shadow);
            user-select: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        #encounter-widget .enc-header {
            padding: 8px 12px;
            font-size: 12px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, var(--jpx-primary), var(--jpx-primary-dark));
            border-radius: var(--jpx-radius) var(--jpx-radius) 0 0;
            cursor: move;
            text-align: center;
            letter-spacing: 0.5px;
        }
        #encounter-widget .enc-body { padding: 12px 14px; }
        #encounter-widget .enc-section {
            border-top: 1px solid var(--jpx-border);
            margin-top: 10px;
            padding-top: 10px;
        }
        #encounter-widget .enc-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        #encounter-widget .enc-row:last-child { margin-bottom: 0; }
        #encounter-widget .enc-label {
            font-size: 12px;
            color: var(--jpx-text-secondary);
            font-weight: 600;
        }
        #encounter-widget .enc-capsule {
            position: relative;
            width: 44px;
            height: 22px;
            border-radius: 11px;
            cursor: pointer;
            transition: background 0.25s;
            background: var(--jpx-border);
        }
        #encounter-widget .enc-capsule.on { background: var(--jpx-success); }
        #encounter-widget .enc-capsule-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #fff;
            transition: left 0.25s;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }
        #encounter-widget .enc-capsule.on .enc-capsule-slider { left: 24px; }
        #encounter-widget .enc-info {
            font-size: 12px;
            line-height: 1.6;
            text-align: center;
            color: var(--jpx-text-secondary);
            cursor: pointer;
            padding: 6px 0;
        }
        #encounter-widget .enc-body > .enc-info {
            border-top: 1px solid var(--jpx-border);
            margin-top: 10px;
            padding-top: 10px;
        }
        #encounter-widget .enc-info:hover { color: var(--jpx-primary); }
        #encounter-widget .enc-btn-num {
            width: 26px;
            height: 26px;
            border-radius: var(--jpx-radius-sm);
            background: var(--jpx-surface-alt);
            color: var(--jpx-text);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 600;
            user-select: none;
            border: 1px solid var(--jpx-border);
            transition: background 0.15s, border-color 0.15s;
        }
        #encounter-widget .enc-btn-num:hover {
            background: #e5e8eb;
            border-color: var(--jpx-primary);
            color: var(--jpx-primary);
        }
        [data-theme="dark"] #encounter-widget .enc-btn-num:hover {
            background: #3a3a3a;
        }
        #encounter-widget .enc-display {
            min-width: 32px;
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            color: var(--jpx-text);
        }
        #encounter-widget .enc-num-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #encounter-widget .enc-settings-btn {
            font-size: 12px;
            color: var(--jpx-text-muted);
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: var(--jpx-radius-sm);
            background: var(--jpx-surface-alt);
            border: 1px solid var(--jpx-border);
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        #encounter-widget .enc-settings-btn:hover {
            background: #e9edf2;
            border-color: var(--jpx-primary);
            color: var(--jpx-primary);
        }
        [data-theme="dark"] #encounter-widget .enc-settings-btn:hover {
            background: #3a3a3a;
        }

        #proficiency-record {
            position: absolute;
            top: 752px;
            left: 50px;
            white-space: nowrap;
            text-align: left;
        }

        @media (min-width: 600px) and (orientation:landscape) {
            #proficiency-record { top: 50px; left: 1240px; }
        }

        #battle_right {
            position: absolute;
            top: 42px;
            left: 681px;
            width: 364px;
            overflow: visible;

            .btm6 {
                min-width: 200px;
            }
        }

        .effect-duration {
            display: inline-block;
            width: 30px;
            margin-right: -30px;
            position: relative;
            text-align: center;
            z-index: 1;

            div {
                display: inline-block;
                min-width: 16px;
                padding: 0 2px;
                background: #EDEBDF;
                color: black;
                font-weight: bold;
                border: 1px solid black;
            }
        }

        .cooldown {
            width: 37px;
            margin-top: 7px;
            position: relative;
            z-index: 3;
            color: black;
            font-size: 20px;
            font-weight: bold;
        }

        .monster-hp {
            display: inline-block;
            position: relative;
            top: -20px;
            left: 204px;
        }

        #time-records-div { text-align: center; white-space: pre; }

        .records-table {
            border-top: 1px solid;
            border-bottom: 1px solid;
            border-collapse: collapse;
            background-color: #fff;

            & tr:nth-child(1) > td, & tr:nth-child(2) > td { text-align: center; }
            & tr:not(:nth-child(1), :nth-child(2)) > td:nth-child(1) { text-align: left; }
            & td { min-width: 40px; padding: 2px 4px; border-left: 1px solid; border-right: 1px solid; text-align: right; }
        }

        #time-records-div.dark-mode,
        #combat-records-use-table.dark-mode,
        #combat-records-table.dark-mode,
        #revenue-records-table.dark-mode {
            color: #eee;
            background-color: #121212;
            border-color: #555;
        }

        #combat-records-table { margin: 10px 0px; }
        #combat-records-table tr:nth-child(1) > td:not(:nth-child(1)), #combat-records-table tr:nth-child(2) > td { border-bottom: 1px solid; }

        #combat-records-use-table {
            border-collapse: collapse;
            background-color: #fff;

            & th, & td { border: 1px solid; min-width: 40px; padding: 2px 4px; }
            & th { text-align: center; }
            & td { text-align: left; }
        }

        #revenue-records-table { margin: 10px auto; }
        #revenue-records-table .surplus { color: #000; !important; background-color: #a5f779 !important; }
        #revenue-records-table .deficit { color: #000 !important; background-color: #ff6a6a !important; }
        #revenue-records-table .noData { color: #000 !important; background-color: #a796fa !important; }
        #revenue-records-table.dark-mode .surplus { color: #eee !important; background-color: #226709 !important; }
        #revenue-records-table.dark-mode .deficit { color: #eee !important; background-color: #7c1010 !important; }
        #revenue-records-table.dark-mode .noData { color: #eee !important; background-color: #433483 !important; }

        .heading { font-weight: 600; margin: 14px 0 8px; padding-bottom: 4px; color: var(--jpx-text); font-size: 11pt; display: inline-block; }
        .heading-main { font-weight: 600; margin: 14px 0 8px; padding: 8px 12px; color: var(--jpx-text); font-size: 11pt; background: #E3F2FD; border-radius: var(--jpx-radius-sm); }

        /* Dark mode heading styles */
        [data-theme="dark"] .heading-main {
            background: #1e3a5f;
            color: #6eb3ff;
        }

        .array-row:not(.array-row .array-row) {
            border: 1px solid var(--jpx-border);
            background: var(--jpx-surface-alt);
            padding: 8px 10px;
            margin: 4px 0;
            position: relative;
            border-radius: var(--jpx-radius-sm);
            transition: opacity 0.2s ease;
        }
        .array-row-dragging {
            display: none;
        }
        .array-row-actions {
            display: flex;
            justify-content: flex-end;
            gap: 4px;
            margin-top: 6px;
        }
        .array-row-footer-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px dashed var(--jpx-border);
        }
        .array-row-footer-actions .array-row-actions,
        .array-row-footer-actions .conditions-add-actions {
            margin-top: 0;
        }
        .conditions-add-actions {
            display: flex;
            gap: 4px;
        }
        .array-drop-placeholder {
            border: 2px dashed var(--jpx-accent);
            border-radius: var(--jpx-radius-sm);
            background: var(--jpx-accent-light, rgba(59, 130, 246, 0.08));
            margin: 4px 0;
            box-sizing: border-box;
        }

        .object-item {
            padding: 8px 10px;
            background: var(--jpx-surface-alt);
            border-radius: var(--jpx-radius-sm);
            margin: 2px 0;
        }

        .object-item .field-block {
            margin-bottom: 8px;
        }
        .object-item .field-block:last-child {
            margin-bottom: 0;
        }
        .object-item .heading {
            margin: 0 0 6px;
        }
        .object-item select {
            padding: 4px 10px;
            min-height: 24px;
            font-size: 9pt;
            line-height: 1.2;
        }
        .object-item input[type="text"],
        .object-item input[type="number"] {
            padding: 3px 8px;
            min-height: 24px;
            font-size: 9pt;
            line-height: 1.2;
        }
        .object-item label {
            font-size: 9pt;
        }

        .field-block {
            margin-bottom: 12px;
        }
        .field-block:last-child {
            margin-bottom: 0;
        }

        .dynamic-array-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }

        .drag-handle { cursor: grab; user-select: none; }
        .drag-handle:active { cursor: grabbing; }

        .field-picker-select { width: 200px; padding: 6px 10px; border: 1px solid var(--jpx-border); border-radius: var(--jpx-radius-sm); }
        .field-picker-select option:checked { background-color: var(--jpx-surface-alt); }

        /* Capsule tags for multi-select fields */
        .jpx-tag-group {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }
        .jpx-tag {
            border-radius: 999px;
            padding: 4px 10px;
            font-size: 11px;
            line-height: 1.4;
            border: 1px solid var(--jpx-border);
            background: #fff;
            color: var(--jpx-text-secondary);
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
        }
        .jpx-tag:hover {
            border-color: var(--jpx-primary);
            color: var(--jpx-primary);
        }
        .jpx-tag.selected {
            background: var(--jpx-primary);
            border-color: var(--jpx-primary);
            color: #fff;
            font-weight: 600;
        }

        /* Small icon / inline buttons inside schema editor */
        .jpx-icon-btn {
            min-width: 24px;
            height: 24px;
            padding: 0 6px;
            margin-left: 4px;
            border-radius: 4px;
            border: 1px solid var(--jpx-border);
            background: #fff;
            font-size: 11px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--jpx-text-secondary);
        }
        .jpx-icon-btn:hover:not(:disabled) {
            border-color: var(--jpx-primary);
            color: var(--jpx-primary);
            background: var(--jpx-surface-alt);
        }
        .jpx-icon-btn:disabled {
            opacity: 0.4;
            cursor: default;
        }
        .jpx-icon-btn-danger {
            color: #b91c1c;
            border-color: #fecaca;
        }
        .jpx-icon-btn-danger:hover:not(:disabled) {
            background: #fef2f2;
            border-color: #dc2626;
            color: #b91c1c;
        }

        .jpx-inline-btn {
            padding: 4px 10px;
            border-radius: 999px;
            border: 1px solid #c6e9c3;
            background: #e8f5e9;
            color: #2e7d32;
            font-size: 11px;
            cursor: pointer;
            margin: 4px 4px 0 0;
            white-space: nowrap;
        }
        .jpx-inline-btn:hover {
            border-color: #66bb6a;
            color: #1b5e20;
            background: #c8e6c9;
        }

        /* === Settings modal styles === */
        #settings-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.45);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            animation: jpx-overlay-in 0.2s ease-out;
        }
        @keyframes jpx-overlay-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .settings-window {
            background: var(--jpx-surface);
            border-radius: var(--jpx-radius);
            box-shadow: var(--jpx-shadow-lg), 0 0 0 1px var(--jpx-border);
            width: 90vw;
            max-width: 920px;
            height: 88vh;
            min-width: 320px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: jpx-modal-in 0.25s ease-out;
        }
        @media (max-width: 768px) {
            .settings-window {
                width: 95vw;
                max-width: 100%;
                max-height: 92vh;
            }
        }
        @keyframes jpx-modal-out {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .settings-window.closing {
            animation: jpx-modal-out 0.15s ease forwards;
        }

        .settings-titlebar {
            padding: 12px 20px;
            background: linear-gradient(135deg, var(--jpx-primary), var(--jpx-primary-dark));
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
            flex-shrink: 0;
            user-select: none;
            border-radius: var(--jpx-radius) var(--jpx-radius) 0 0;
        }
        .settings-titlebar:active {
            cursor: grabbing;
        }


        .settings-tabbar {
            display: flex;
            background: var(--jpx-surface-alt);
            padding: 0 12px;
            flex-shrink: 0;
        }

        .settings-tab-btn {
            padding: 10px 24px;
            border: none;
            background: none;
            font-size: 13px;
            color: var(--jpx-text-muted);
            cursor: pointer;
            position: relative;
            transition: color 0.15s;
            font-weight: 500;
        }
        @media (max-width: 768px) {
            .settings-tab-btn {
                padding: 10px 16px;
                font-size: 12px;
            }
        }
        .settings-tab-btn:hover {
            color: var(--jpx-primary);
        }
        .settings-tab-btn.active {
            color: var(--jpx-primary);
            font-weight: 600;
        }
        .settings-tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 12px;
            right: 12px;
            height: 3px;
            background: var(--jpx-primary);
            border-radius: 3px 3px 0 0;
        }

        .settings-content {
            text-align: left;
            font-size: 10pt;
            padding: 18px 22px;
            overflow-y: auto;
            flex: 1;
            line-height: 1.6;
            color: var(--jpx-text);
            background: var(--jpx-surface);
        }
        @media (max-width: 768px) {
            .settings-content {
                padding: 12px 16px;
                font-size: 9pt;
            }
        }

        .settings-footer {
            display: flex;
            gap: 10px;
            padding: 12px 22px;
            background: var(--jpx-surface-alt);
            border-top: 1px solid var(--jpx-border);
            flex-shrink: 0;
            flex-wrap: wrap;
            border-radius: 0 0 var(--jpx-radius) var(--jpx-radius);
            justify-content: flex-start;
            align-items: center;
        }
        .settings-footer .spacer { flex: 1; }
        .settings-footer .divider {
            width: 1px;
            height: 20px;
            background: var(--jpx-border);
            margin: 0 4px;
        }
        @media (max-width: 768px) {
            .settings-footer {
                padding: 10px 16px;
                gap: 8px;
            }
        }

        /* Button styles */
        .stg-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 18px;
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius-sm);
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
            background: #fff;
            color: var(--jpx-text-secondary);
            min-width: 72px;
            white-space: nowrap;
        }
        @media (max-width: 768px) {
            .stg-btn {
                padding: 6px 14px;
                font-size: 11px;
                min-width: 64px;
            }
        }
        .stg-btn:hover { background: var(--jpx-surface-alt); border-color: var(--jpx-text-muted); }
        .stg-btn:active { background: var(--jpx-border-light); }
        .stg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Dark mode button styles */
        [data-theme="dark"] .stg-btn {
            background: var(--jpx-surface);
            color: var(--jpx-text-secondary);
            border-color: var(--jpx-border);
        }

        [data-theme="dark"] .stg-btn:hover {
            background: var(--jpx-surface-alt);
            border-color: var(--jpx-text-muted);
        }

        [data-theme="dark"] .stg-btn:active {
            background: var(--jpx-border);
        }

        [data-theme="dark"] .stg-btn.primary {
            background: var(--jpx-primary);
            color: #000000;
            border-color: var(--jpx-primary);
        }

        [data-theme="dark"] .stg-btn.danger {
            background: #dc2626;
            color: #ffffff;
            border-color: #dc2626;
        }

        [data-theme="dark"] .stg-btn.success {
            background: #059669;
            color: #ffffff;
            border-color: #059669;
        }

        [data-theme="dark"] .jpx-tag {
            background: #2a2a2a;
            color: #b0b0b0;
            border-color: #444;
        }
        [data-theme="dark"] .jpx-tag:hover {
            border-color: #5a9fd4;
            color: #6eb3ff;
            background: #2a3444;
        }
        [data-theme="dark"] .jpx-tag.selected {
            background: #2563eb;
            border-color: #2563eb;
            color: #fff;
        }

        [data-theme="dark"] .jpx-icon-btn {
            background: #2a2a2a;
            color: #b0b0b0;
            border-color: #444;
        }
        [data-theme="dark"] .jpx-icon-btn:hover:not(:disabled) {
            border-color: #5a9fd4;
            color: #6eb3ff;
            background: #2a3444;
        }

        [data-theme="dark"] .jpx-inline-btn {
            background: #1a2e1a;
            color: #4caf50;
            border-color: #2e5a2e;
        }
        [data-theme="dark"] .jpx-inline-btn:hover {
            background: #2e4a2e;
            border-color: #4caf50;
        }

        .stg-btn.primary {
            background: var(--jpx-primary);
            color: #fff;
            border-color: var(--jpx-primary);
        }
        .stg-btn.primary:hover { background: var(--jpx-primary-dark); border-color: var(--jpx-primary-dark); }
        .stg-btn.primary:active { background: var(--jpx-primary-darker); }

        .stg-btn.danger {
            background: #ef4444;
            color: #ffffff;
            border-color: #dc2626;
        }
        .stg-btn.danger:hover { background: #dc2626; border-color: #b91c1c; }

        .stg-btn.success {
            color: #039855;
            border-color: #6ce9a6;
        }
        .stg-btn.success:hover { background: #ecfdf3; border-color: #039855; }

        /* Settings form elements */
        .settings-content input[type="text"],
        .settings-content input[type="number"] {
            padding: 5px 10px;
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius-sm);
            font-size: 10pt;
            line-height: 1.4;
            transition: border-color 0.15s, box-shadow 0.15s;
            outline: none;
            background: #fff;
        }
        .settings-content select {
            padding: 7px 12px;
            border: 1px solid var(--jpx-border);
            border-radius: var(--jpx-radius-sm);
            font-size: 10pt;
            line-height: 1.4;
            min-height: 30px;
            transition: border-color 0.15s, box-shadow 0.15s;
            outline: none;
            background: #fff;
            color: var(--jpx-text);
        }
        .settings-content select option {
            background: #fff;
            color: var(--jpx-text);
        }
        .settings-content select option:checked {
            background: var(--jpx-primary);
            color: #fff;
        }

        /* Dark mode adjustments for form elements */
        [data-theme="dark"] .settings-content input[type="text"],
        [data-theme="dark"] .settings-content input[type="number"] {
            background: var(--jpx-surface-alt);
            color: var(--jpx-text);
            transition: none;
        }

        [data-theme="dark"] .settings-content input[type="text"]:hover,
        [data-theme="dark"] .settings-content input[type="number"]:hover {
            background: var(--jpx-surface-alt);
            border-color: var(--jpx-primary);
            transition: none;
        }

        [data-theme="dark"] .settings-content select {
            background: var(--jpx-surface-alt);
            transition: none;
        }

        [data-theme="dark"] .settings-content select:hover {
            background: var(--jpx-surface-alt);
            border-color: var(--jpx-primary);
            transition: none;
        }

        [data-theme="dark"] .settings-content select option {
            background: var(--jpx-surface);
            color: var(--jpx-text);
        }

        [data-theme="dark"] .settings-content input[type="text"]:focus,
        [data-theme="dark"] .settings-content input[type="number"]:focus,
        [data-theme="dark"] .settings-content select:focus {
            background: var(--jpx-surface-alt);
            border-color: var(--jpx-primary);
            box-shadow: 0 0 0 3px rgba(110,179,255,0.2);
            transition: none;
        }

        .settings-content input[type="text"]:focus,
        .settings-content input[type="number"]:focus,
        .settings-content select:focus {
            border-color: var(--jpx-primary);
            box-shadow: 0 0 0 3px rgba(74,144,217,0.15);
        }

        .settings-content .jpx-switch-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
        }
        .settings-content .jpx-switch-input {
            position: absolute;
            opacity: 0;
            width: 1px;
            height: 1px;
            pointer-events: none;
        }
        .settings-content .jpx-switch-slider {
            position: relative;
            width: 36px;
            height: 20px;
            border-radius: 999px;
            background: #cbd5e1;
            transition: background 0.18s ease;
            flex-shrink: 0;
        }
        .settings-content .jpx-switch-slider::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            transition: transform 0.18s ease;
        }
        .settings-content .jpx-switch-input:checked + .jpx-switch-slider {
            background: var(--jpx-primary);
        }
        .settings-content .jpx-switch-input:checked + .jpx-switch-slider::after {
            transform: translateX(16px);
        }
        .settings-content .jpx-switch-input:focus-visible + .jpx-switch-slider {
            box-shadow: 0 0 0 3px rgba(74,144,217,0.2);
        }

        /* Dark mode toggle switch */
        [data-theme="dark"] .settings-content .jpx-switch-slider {
            background: #5a5a5a;
        }

        [data-theme="dark"] .settings-content .jpx-switch-slider::after {
            background: #e0e0e0;
            box-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        [data-theme="dark"] .settings-content .jpx-switch-input:focus-visible + .jpx-switch-slider {
            box-shadow: 0 0 0 3px rgba(110,179,255,0.3);
        }

        .settings-content .jpx-switch-text {
            line-height: 1.2;
        }

        .settings-content label {
            cursor: pointer;
        }
    `,
};

jpxPanelManager();
jpxMarket();
jpxUtils();

let doInitDoBattle = false;
let isActiveBattle = false;

let readyNext = 0;
let lastActionTimestamp = Date.now();
let lastLogTimestamp = Date.now();

let prefix = 'jpx_';
let isekaiSuffix = document.URL.includes('isekai') ? '_isekai' : '';
let regExp = {
    locationQueries: /\w+=\w+/g,
    playerInfo: /(\w+) Lv\.(\d+)/,
    staminaInfo: /Stamina:\s(\d+)/,
    spellInfo: /\('([\w\s-]+)'.*, '(\w+)', (\d+), (\d+), (\d+)\)/, //Name, iconID, MP, OC, CD
    itemInfo: /set_infopane_item\((\d+)/,
    battleTypeLog: /Initializing (.*) \.\.\./,
    floor: /Floor (\d+)/,
    round: /Round (\d+) \/ (\d+)/,
    monster: /MID=(\d+) \(([^<>]+)\) \LV=(\d+) HP=(\d+)/g,
    effectGain: /([\w\s-]+) gains the effect ([\w\s-]+)\./g,
    effectExpired: /The effect ([\w\s-]+) on ([\w\s-]+) has expired\./g,
    effectWear: /The effect ([\w\s-]+) on ([\w\s-]+) has worn off\./g,
    effectWearAsleep: /([^<>]+) has been roused from its sleep\./g,
    effectWearConfused: /([^<>]+) got knocked out of confuse\./g,
    oc: /div/g,
    ocHalf: /vcr/g,
    /*isekai911*/
    spellMatch: /\('(?<name>[\w\s-]+)(?:\s\(x(?<stack>\d+)\))?',\s?(?<description>.*),\s?'?(?<turns>[\w\s-]+)'?\)/,
    /*isekai912*/
    //battleRecorder
    turnLog: /([^]+?)<tr><td class="tls">/,
    //timeRecorder
    action: />([^<>]+)<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
    /*isekai911*/
    action2: />([^<>]+)<\/td><\/tr><tr><td class="tlb?">[^<>]+<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
    /*isekai912*/
    zeroturn: /You use\s*(\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Bubble))/,
    use: /You (cast|use) ([\w\s-]+)/,
    //combatRecorder
    damage: /[^<>]+damage( \([^<>]+\))*(<\/td><\/tr><tr><td class="tlb">Your spirit shield absorbs \d+ |<|\.)/g,
    damageType: /for (\d+) (\w+) damage/,
    spiritShield: /absorbs (\d+)/,
    crit: /(You crit| crits | blasts )/,
    strike: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits/,
    damagePlus: /for (\d+) damage/,
    damagePhysicalPlus: /(Bleeding Wound|Spreading Poison)/,
    damagePoints: /for (\d+) points of (\w+) damage/,
    counter: />You counter/g,
    //    dealt magical
    magicalDealtMiss: /to connect\./g,
    magicalDealtEvade: /evades your spell\./g,
    magicalDealtResist50: / (?:hits|blasts) [^y][^<>]+50%/g,
    magicalDealtResist75: / (?:hits|blasts) [^y][^<>]+75%/g,
    magicalDealtResist90: / (?:hits|blasts) [^y][^<>]+90%/g,
    magicalDealtResist: /resists your spell\./g,
    //    dealt physical
    physicalDealtMiss: /its mark\./g,
    physicalDealtEvade: /(?: dodges your attack\.|evades your offhand attack\.)/g,
    physicalDealtParry: /parries your attack\./g,
    //    taken magical
    magicalTakenEvade: / casts [^<>]+evade the attack\./g,
    magicalTakenBlock: / casts [^<>]+block the attack\./g,
    magicalTakenResist50: / (?:hits|blasts) y[^<>]+50%/g,
    magicalTakenResist75: / (?:hits|blasts) y[^<>]+75%/g,
    magicalTakenResist90: / (?:hits|blasts) y[^<>]+90%/g,
    //    taken physical
    physicalTakenMiss: /misses the attack against you\./g,
    physicalTakenEvade: /(>You evade| uses [^<>]+evade the attack\.)/g,
    physicalTakenParry: /(>You parry| uses [^<>]+parry the attack\.)/g,
    physicalTakenBlock: /(>You block| uses [^<>]+block the attack\.)/g,
    /*isekai911*/
    //combatRecorder_isekai
    damage_isekai: /[^<>]+damage/g,
    damageTaken1_isekai: /(?<v>glances|hits|crits) you.*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageTaken2_isekai: /which (?<v>glances|hits|crits).*?(?<n>\d+).*?(?<t>\w+) damage/,
    spiritShield_isekai: /absorbs (\d+)/,
    damageDealt1_isekai: /(?:You|Your offhand attack|Arcane Blow) (?:(?<s>\d)x-)*(?<v>glance|hit|crit).*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageDealt2_isekai: /(?:(?<s>\d)x-)*(?<v>glanced|hit|crit|eviscerated) for (?<n>\d+) (?<t>\w+) damage/,
    strike_isekai: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits.*?(\d+).*?(\w+) damage/,
    explode_isekai: /explodes for (\d+) (\w+) damage/,
    damagePlus_isekai: /for (\d+) damage/,
    damagePhysicalPlus_isekai: /(Bleeding Wound|Spreading Poison)/,
    damagePoints_isekai: /for (\d+) points of (\w+) damage/,
    debuffLog_isekai: /(?:<tr><td class="tlb?">[^<>]+(?: gains the effect | partially resists the effects of your spell\.| shrugs off the effects of your spell\.)+[^<>]*<\/td><\/tr>)+<tr><td class="tl">You cast [a-zA-Z]+\.<\/td><\/tr>/,
    debuffResist0_isekai: / gains the effect /g,
    debuffResist1_isekai: / partially resists the effects of your spell\./g,
    debuffResist3_isekai: / shrugs off the effects of your spell\./g,
    counter_isekai: />You counter/g,
    //    dealt magical
    magicalDealtMiss_isekai: / to connect\./g,
    magicalDealtEvade_isekai: / evades your spell\./g,
    magicalDealtResistPartially_isekai: / resists, and was/g,
    magicalDealtResist_isekai: / resists your spell\./g,
    //    dealt physical
    physicalDealtMiss_isekai: / its mark\./g,
    physicalDealtEvade_isekai: / dodges your attack\./g,
    physicalDealtParryPartially_isekai: / parries[^<>]+?(\d+)[^<>]+?(\w+) damage/g,
    physicalDealtParry_isekai: / parries your attack\./g,
    //    taken magical
    magicalTakenMiss_isekai: /(?:casts[^<>]+, but misses the attack\.|casts[^<>]+, missing you completely\.)/g,
    magicalTakenEvade_isekai: />You evade the attack\./g,
    magicalTakenResistPartially_isekai: / resist the attack/g,
    magicalTakenBlockPartially_isekai: /casts[^<>]+partially block (?:and|resist| )*the attack/g,
    magicalTakenBlock_isekai: /(?<!partially )block (?:and|resist| )*the attack\./g,
    //    taken physical
    physicalTakenMiss_isekai: /(?:uses[^<>]+, but misses the attack\.|(?:vigorously whiffs at a shadow|uses[^<>]+), missing you completely\.)/g,
    physicalTakenEvade_isekai: />You evade the attack from/g,
    physicalTakenParryPartially_isekai: /partially parry the attack/g,
    physicalTakenParry_isekai: /(?<!partially )parry the attack/g,
    physicalTakenBlockPartially_isekai: /(?:(?:uses[^<>]+|>)You|you) partially block (?:and|partially|parry| )*the attack/g,
    physicalTakenBlock_isekai: /(?<!partially )block (?:and|partially|parry| )*the attack/g,
    /*isekai912*/
    //revenueRecorder
    gainExp: /gain (\d+) EXP/,
    gainCredit: /gain (\d+) Credit/,
    proficiencies: /\d+\.\d+ points of [^<>]+ proficiency/g,
    proficiency: /(\d+\.\d+) points of ([^<>]+) proficiency/,
    dropsLogs: /\S+ <span style="color:.{7}">\[[^<>]+\](<\/span><\/td><\/tr><tr><td class="tlb">A traveling)*/g,
    drop: /(\S+) \<.*#(.{6}).*\[(.*)\](.)*/,
    quality: /(Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/,
    credit: /(\d+) Credit/,
    crystal: /(?:(\d+)x )?(Crystal of \w+)/,
}

let log;
let battleStyle = '';
let battleType = '';
let towerFloor = 0;
let roundInfo = { current: 0, total: 0 }
let monsterData = [];
let allMonsterInfo = {};
let prevMonsterIds = '';
let monstersEffects = {};
let actionCounts = {};
let battleLogRecord = [];
let battleLogRecordCurrent = [];
let timeRecords = {};
let combatRecords = {};
let revenueRecords = {};
let spellDamageBonus = JSON.parse(localStorage.getItem(prefix + 'spellDamageBonus' + isekaiSuffix) || '{"maxType":"fire","maxValue":0}');

let dummy = document.createElement('div');
let newWindow;

const difficultyMap = { Normal: 1, Hard: 2, Nightmare: 4, Hell: 7, Nintendo: 10, IWBTH: 15, PFUDOR: 20 };
const itemMap = {
    10005: 'Health Gem', 10006: 'Mana Gem', 10007: 'Spirit Gem', 10008: 'Mystic Gem',
    11191: 'Health Draught', 11195: 'Health Potion', 11199: 'Health Elixir',
    11291: 'Mana Draught', 11295: 'Mana Potion', 11299: 'Mana Elixir',
    11391: 'Spirit Draught', 11395: 'Spirit Potion', 11399: 'Spirit Elixir',
    11401: 'Energy Drink', 11402: 'Caffeinated Candy', 11501: 'Last Elixir',
    12101: 'Infusion of Flames', 12201: 'Infusion of Frost', 12301: 'Infusion of Lightning', 12401: 'Infusion of Storms', 12501: 'Infusion of Divinity', 12601: 'Infusion of Darkness',
    13101: 'Scroll of Swiftness', 13111: 'Scroll of Protection', 13199: 'Scroll of the Avatar', 13201: 'Scroll of Absorption', 13211: 'Scroll of Shadows', 13221: 'Scroll of Life', 13299: 'Scroll of the Gods',
    19111: 'Flower Vase', 19131: 'Bubble-Gum',
};
const itemSrc = [
    { keys: ['Health', 'Last Elixir'], src: '/y/e/healthpot.png' },
    { keys: ['Mana'], src: '/y/e/manapot.png' },
    { keys: ['Spirit'], src: '/y/e/spiritpot.png' },
    { keys: ['Drink', 'Candy'], src: '/y/e/soulstone.png' },
    { keys: ['Flames'], src: '/y/e/fireinfusion.png' },
    { keys: ['Frost'], src: '/y/e/coldinfusion.png' },
    { keys: ['Storms'], src: '/y/e/windinfusion.png' },
    { keys: ['Lightning'], src: '/y/e/elecinfusion.png' },
    { keys: ['Divinity'], src: '/y/e/holyinfusion.png' },
    { keys: ['Darkness'], src: '/y/e/darkinfusion.png' },
    { keys: ['Protection','vatar'], src: '/y/e/protection_scroll.png' },
    { keys: ['Swiftness'], src: '/y/e/haste_scroll.png' },
    { keys: ['Absorption'], src: '/y/e/absorb_scroll.png' },
    { keys: ['Shadows'], src: '/y/e/shadowveil_scroll.png' },
    { keys: ['Life','Gods'], src: '/y/e/sparklife_scroll.png' },
    { keys: ['Vase'], src: '/y/e/flowers.png' },
    { keys: ['Gum'], src: '/y/e/gum.png' }
];
const effectSrc = {
    'Vital Theft': { scr: '/y/e/drainhp.png' },
    'Ether Theft': { scr: '/y/e/drainmp.png' },
    'Spirit Theft': { scr: '/y/e/drainsp.png' },

    'Weakened': { scr: '/y/e/weaken.png' },
    'Imperiled': { scr: '/y/e/imperil.png' },
    'Slowed': { scr: '/y/e/slow.png' },
    'Asleep': { scr: '/y/e/sleep.png' },
    'Confused': { scr: '/y/e/confuse.png' },
    'Blinded': { scr: '/y/e/blind.png' },
    'Silenced': { scr: '/y/e/silence.png' },
    'Magically Snared': { scr: '/y/e/magnet.png' },
    'Immobilized': { scr: '/y/e/magnet.png' },
    'Stunned': { scr: '/y/e/wpn_stun.png' },
    'Penetrated Armor': { scr: '/y/e/wpn_ap.png' },
    'Bleeding Wound': { scr: '/y/e/wpn_bleed.png' },
    'Spreading Poison': { scr: '/y/e/poison.png' },
    'Coalesced Mana': { scr: '/y/e/coalescemana.png' },

    'Searing Skin': { scr: '/y/e/firedot.png' },
    'Freezing Limbs': { scr: '/y/e/coldslow.png' },
    'Turbulent Air': { scr: '/y/e/windmiss.png' },
    'Deep Burns': { scr: '/y/e/elecweak.png' },
    'Breached Defense': { scr: '/y/e/holybreach.png' },
    'Blunted Attack': { scr: '/y/e/darknerf.png' },
    'Burning Soul': { scr: '/y/e/soulfire.png' },
    'Ripened Soul': { scr: '/y/e/ripesoul.png' },

    'Fury of the Sisters': { scr: '/y/e/trio_furyofthesisters.png' },
    'Lamentations of the Future': { scr: '/y/e/trio_skuld.png' },
    'Screams of the Past': { scr: '/y/e/trio_urd.png' },
    'Wails of the Present': { scr: '/y/e/trio_verdandi.png' },
    'Absorbing Ward': { scr: '/y/e/absorb.png' },
};
const spellsDamageObj = {
    fire: ['Fiery Blast', 'Inferno', 'Flames of Loki'],
    cold: ['Freeze', 'Blizzard', 'Fimbulvetr'],
    wind: ['Gale', 'Downburst', 'Storms of Njord'],
    elec: ['Shockblast', 'Chained Lightning', 'Wrath of Thor'],
    holy: ['Smite', 'Banishment', 'Paradise Lost'],
    dark: ['Corruption', 'Disintegrate', 'Ragnarok'],
};
const bossTypes = {
    Rare: new Set(['Manbearpig', 'White Bunneh', 'Mithra', 'Dalek']),
    Legendary: new Set(['Konata', 'Mikuru Asahina', 'Ryouko Asakura', 'Yuki Nagato']),
    Ultimate: new Set(['Skuld', 'Urd', 'Verdandi', 'Yggdrasil', 'Real Life', 'Invisible Pink Unicorn', 'Flying Spaghetti Monster']),
    Arena300: new Set(['Drogon', 'Rhaegal', 'Viserion']),
    Arena400: new Set(['New Game +', 'Bottomless Dungeon', 'Recycled Boss Rush', 'Time Trial Mode', 'Achievement Grind', 'Hardcore Mode']),
    Arena500: new Set(['Angel Bunny', 'Applejack', 'Fluttershy', 'Gummy', 'Pinkie Pie', 'Rarity', 'Spike', 'Rainbow Dash', 'Twilight Sparkle']),
};

const BATTLE_MODES = ['OneHanded_General', 'OneHanded_Tower', '1H_Mage_General', 'TwoHanded_General', '2H_Mage_General',
    'DualWielding_General', 'DW_Mage_General', 'NitenIchiryu_General', 'NI_Mage_General', 'Staff_General', 'Unarmed_General'];
const BATTLE_TYPES = ['Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'];
const ROB_CHALLENGES = ['Konata', 'Mikuru Asahina', 'Ryouko Asakura', 'Yuki Nagato', 'Real Life', 'Invisible Pink Unicorn', 'Flying Spaghetti Monster', 'Triple Trio and the Tree'];
const ROB_CHALLENGE_CN = {
    'Konata': '泉此方',
    'Mikuru Asahina': '朝比奈实玖瑠',
    'Ryouko Asakura': '朝仓凉子',
    'Yuki Nagato': '长门有希',
    'Real Life': '现实生活',
    'Invisible Pink Unicorn': '隐形粉红独角兽',
    'Flying Spaghetti Monster': '飞行意大利面怪物',
    'Triple Trio and the Tree': '大树十重奏'
};
// Reverse map: CN name → EN name
const ROB_CHALLENGE_CN_REV = Object.fromEntries(Object.entries(ROB_CHALLENGE_CN).map(([en, cn]) => [cn, en]));
const PRIORITY_RULES = ['Top Down', 'Bottom Up', 'Current HP Low to High', 'Current HP High to Low', 'Current HP Percent Low to High', 'Current HP Percent High to Low'];
const MONSTER_TYPES = ['Normal', 'Rare', 'Legendary', 'Ultimate', 'Arena300', 'Arena400', 'Arena500'];
const MONSTER_CLASSES = ['Arthropod', 'Avion', 'Beast', 'Celestial', 'Daimon', 'Dragonkin', 'Elemental',
     'Giant', 'Humanoid', 'Mechanoid', 'Reptilian', 'Sprite', 'Undead'];
const PLAYER_EFFECTS = ['Channeling', 'Regeneration', 'Replenishment', 'Refreshment', 'Regen', 'Heartseeker', 'Arcane Focus',
    'Hastened', 'Protection', 'Absorbing Ward', 'Shadow Veil', 'Spark of Life', 'Spirit Shield',
    'Infused Flames', 'Infused Frost', 'Infused Storm', 'Infused Lightning', 'Infused Divinity', 'Infused Darkness',
    'Energized', 'Sleeper Imprint', 'Kicking Ass',
    'Overwhelming Strikes', 'Ether Tap', 'Cloak of the Fallen', 'Blessing of the RiddleMaster', 'Defending', 'Focusing'];
const TOGGLE = ['Spirit', 'Defend', 'Focus'];
const SKILLS = ['Shield Bash', 'Vital Strike', 'Merciful Blow', 'Iris Strike', 'Backstab', 'Frenzied Blows', 'Great Cleave',
    'Rending Blow', 'Shatter Strike', 'Skyward Sword', 'Concussive Strike', 'Flee', 'Scan', 'FUS RO DAH', 'Orbital Friendship Cannon'];
const SPELLS_INSTANT = ['Cure', 'Full-Cure'];
const SPELLS_DURATION = ['Regen', 'Haste', 'Protection', 'Absorb', 'Shadow Veil', 'Spark of Life', 'Spirit Shield', 'Heartseeker', 'Arcane Focus'];
const ITEMS_INSTANT = ['Health Gem', 'Health Potion', 'Health Elixir', 'Mana Gem', 'Mana Potion', 'Mana Elixir', 'Spirit Gem', 'Spirit Potion', 'Spirit Elixir', 'Last Elixir'];
const ITEMS_DURATION = ['Mystic Gem', 'Health Draught', 'Mana Draught', 'Spirit Draught', 'Infusion of Flames', 'Infusion of Frost', 'Infusion of Storms',
    'Infusion of Lightning', 'Infusion of Divinity', 'Infusion of Darkness', 'Scroll of Swiftness', 'Scroll of Protection', 'Scroll of the Avatar', 'Scroll of Absorption',
    'Scroll of Shadows', 'Scroll of Life', 'Scroll of the Gods', 'Caffeinated Candy', 'Energy Drink', 'Flower Vase', 'Bubble-Gum'];
const SPELLS_DAMAGE = ['T1', 'T2', 'T3', 'Fiery Blast', 'Inferno', 'Flames of Loki', 'Freeze', 'Blizzard', 'Fimbulvetr', 'Gale', 'Downburst', 'Storms of Njord',
    'Shockblast', 'Chained Lightning', 'Wrath of Thor', 'Smite', 'Banishment', 'Paradise Lost', 'Corruption', 'Disintegrate', 'Ragnarok'];
const SPELLS_DEBUFF = ['Drain', 'Weaken', 'Imperil', 'Slow', 'Sleep', 'Confuse', 'Blind', 'Silence', 'MagNet', 'Immobilize'];

const CTRLWIDGET_FIELDS = [
    { id: 'isActiveBattle', get: () => (isActiveBattle ? '战斗中' : '未战斗') },
    { id: 'readyNext', get: () => readyNext },
    { id: 'networkDelay', get: () => (lastLogTimestamp > lastActionTimestamp ? lastLogTimestamp - lastActionTimestamp : '-') },
    { id: 'battleStyle', get: () => t(`cW.${battleStyle}`) + (/Staff|Mage/.test(battleStyle) ? ` (${t(`cW.${spellDamageBonus.maxType}`)})` : '') },
    { id: 'battleType', get: () => t(`cW.${battleType}`) + (towerFloor ? ` (${towerFloor}F)` : '') },
    { id: 'round', get: () => roundInfo.total ? `${roundInfo.current} / ${roundInfo.total}` : '-' },
].map(f => ({ ...f, label: `cW.${f.id}` }));
const COMBAT_FIELDS = [
    { id: 'fire', type: 'damage' },
    { id: 'cold', type: 'damage' },
    { id: 'wind', type: 'damage' },
    { id: 'elec', type: 'damage' },
    { id: 'holy', type: 'damage' },
    { id: 'dark', type: 'damage' },
    { id: 'crushing', type: 'damage' },
    { id: 'slashing', type: 'damage' },
    { id: 'piercing', type: 'damage' },
    { id: 'void', type: 'damage' },
    { id: 'damagePlus', type: 'damage' },
    { id: 'damageTotal', type: 'damage', isTotal: true },

    { id: 'glance', type: 'result' },
    { id: 'hit', type: 'result' },
    { id: 'crit', type: 'result' },
    { id: 'miss', type: 'result' },
    { id: 'evade', type: 'result' },
    { id: 'parry', type: 'result' },
    { id: 'resist', type: 'result' },
    { id: 'block', type: 'result' },
    { id: 'resultTotal', type: 'result', isTotal: true },

    { id: 'resist50', type: 'resultPartially' },
    { id: 'resist75', type: 'resultPartially' },
    { id: 'resist90', type: 'resultPartially' },
    { id: 'parryPartially', type: 'resultPartially' },
    { id: 'resistPartially', type: 'resultPartially' },
    { id: 'blockPartially', type: 'resultPartially' },
    { id: 'resultPartiallyTotal', type: 'resultPartially', isTotal: true },
].map(f => ({ ...f, label: `cP.${f.id}` }));
const COMBAT_USE_FIELDS = [
    { id: 'action', keys: ['Attack', ...TOGGLE] },
    { id: 'item', keys: ['Mystic Gem', 'Health Gem', 'Mana Gem', 'Spirit Gem', 'Caffeinated Candy', 'Energy Drink'] },
    { id: 'skill', keys: SKILLS },
    { id: 'spellSupport', keys: [...SPELLS_INSTANT, ...SPELLS_DURATION] },
    { id: 'spellDamage', keys: SPELLS_DAMAGE },
    { id: 'spellDebuff', keys: SPELLS_DEBUFF },
].map(f => ({ ...f, label: `cP.${f.id}`, keys: f.keys.map(key => ({ key, label: `cB.${key}`})) }));
const REVENUE_FIELDS = [
    { id: 'exp', type: 'simple' },
    { id: 'proficiency', type: 'list_paired',
        order: [
            'one-handed weapon', 'two-handed weapon', 'dual wielding', /*isekai911*/'dual-wielding',/*isekai912*/ 'staff',
            'cloth armor', 'light armor', 'heavy armor', 'elemental magic', 'divine magic', 'forbidden magic', 'supportive magic', 'deprecating magic'
        ]
    },
    { id: 'credit', type: 'simple' },
    { id: 'equipment', type: 'list_flat', order: ['Peerless', 'Legendary', 'Magnificent', 'Exquisite', 'Superior', 'Average', 'Fair', 'Crude'] },
    { id: 'material', type: 'grid',
        order: [
            'Low-Grade Cloth', 'Mid-Grade Cloth', 'High-Grade Cloth',
            'Low-Grade Leather', 'Mid-Grade Leather', 'High-Grade Leather',
            'Low-Grade Metals', 'Mid-Grade Metals', 'High-Grade Metals',
            'Low-Grade Wood', 'Mid-Grade Wood', 'High-Grade Wood',
            'Scrap Cloth', 'Scrap Leather', 'Scrap Metal', 'Scrap Wood', 'Energy Cell',
        ]
    },
    { id: 'consumable', type: 'grid_detailed',
        order: [
            'Health Draught', 'Health Potion', 'Health Elixir',
            'Mana Draught', 'Mana Potion', 'Mana Elixir',
            'Spirit Draught', 'Spirit Potion', 'Spirit Elixir', 'Last Elixir',
            'Infusion of Flames', 'Infusion of Frost', 'Infusion of Storms', 'Infusion of Lightning', 'Infusion of Divinity', 'Infusion of Darkness',
            'Scroll of Swiftness', 'Scroll of Protection', 'Scroll of the Avatar', 'Scroll of Absorption', 'Scroll of Shadows', 'Scroll of Life', 'Scroll of the Gods',
            'Voidseeker Shard', 'Aether Shard', 'Featherweight Shard', 'Amnesia Shard', 'World Seed',
            'Flower Vase', 'Bubble-Gum'
        ]
    },
    { id: 'consumableProfit', type: 'simple', source: 'consumable', key: 'profit' },
    { id: 'token', type: 'grid', order: ['Token of Blood', 'Chaos Token', 'Soul Fragment'] },
    { id: 'tokenProfit', type: 'simple', source: 'token', key: 'profit' },
    { id: 'food', type: 'grid', order: ['Monster Chow', 'Monster Edibles', 'Monster Cuisine', 'Happy Pills'] },
    { id: 'foodProfit', type: 'simple', source: 'food', key: 'profit' },
    { id: 'figurine', type: 'grid',
        order: [
            'Twilight Sparkle Figurine', 'Rainbow Dash Figurine', 'Applejack Figurine', 'Fluttershy Figurine', 'Pinkie Pie Figurine', 'Rarity Figurine',
            'Trixie Figurine', 'Princess Celestia Figurine', 'Princess Luna Figurine', 'Apple Bloom Figurine', 'Scootaloo Figurine', 'Sweetie Belle Figurine',
            'Big Macintosh Figurine', 'Spitfire Figurine', 'Derpy Hooves Figurine', 'Lyra Heartstrings Figurine', 'Octavia Figurine', 'Zecora Figurine',
            'Cheerilee Figurine', 'Vinyl Scratch Figurine', 'Daring Do Figurine', 'Doctor Whooves Figurine', 'Berry Punch Figurine', 'Bon-Bon Figurine',
            'Fluffle Puff Figurine', 'Angel Bunny Figurine', 'Gummy Figurine',
        ]
    },
    { id: 'figurineProfit', type: 'simple', source: 'figurine', key: 'profit' },
    { id: 'artifact', type: 'grid', order: ['Precursor Artifact'] },
    { id: 'artifactProfit', type: 'simple', source: 'artifact', key: 'profit' },
    { id: 'trophy', type: 'grid',
        order: [
            'ManBearPig Tail', 'Holy Hand Grenade of Antioch', "Mithra's Flower", 'Dalek Voicebox', 'Lock of Blue Hair',
            'Bunny-Girl Costume', 'Hinamatsuri Doll', 'Broken Glasses', 'Black T-Shirt', 'Sapling', 'Unicorn Horn', 'Noodly Appendage',
        ]
    },
    { id: 'trophyProfit', type: 'simple', source: 'trophy', key: 'profit' },
    { id: 'crystal', type: 'grid',
        order: [
            'Crystal of Vigor', 'Crystal of Finesse', 'Crystal of Swiftness', 'Crystal of Fortitude', 'Crystal of Cunning', 'Crystal of Knowledge',
            'Crystal of Flames', 'Crystal of Frost', 'Crystal of Tempest', 'Crystal of Lightning', 'Crystal of Devotion', 'Crystal of Corruption',
        ]
    },
    { id: 'crystalTotal', type: 'total', source: 'crystal' },
    { id: 'totalProfit', type: 'summary' },
    { id: 'stamina', type: 'stamina' },
    { id: 'finalProfit', type: 'summary' }
].map(f => ({ ...f, label: `rP.${f.id}` }));
const sumRevenueCategory = (record, category) => {
    let data = record.revenueRecords?.[category];
    if (!data) return '0';
    let total = 0;
    for (const [key, value] of Object.entries(data)) {
        if (key !== 'total' && key !== 'profit') total += value;
    }
    return Math.round(total * 100) / 100;
};
const sumTrophies = (record, type) => {
    let data = record.revenueRecords?.trophy;
    if (!data) return '0';

    const TROPHIES_T2 = ['ManBearPig Tail', 'Holy Hand Grenade of Antioch', "Mithra's Flower", 'Dalek Voicebox', 'Lock of Blue Hair'];
    let total = 0;
    for (const [key, value] of Object.entries(data)) {
        if (key === 'total' || key === 'profit') continue;
        let isLesser = key.match(/Lesser .+ Charm/);
        let isGreater = key.match(/Greater .+ Charm/);
        let isT2 = TROPHIES_T2.includes(key);
        switch (type) {
            case 'lesserCharm':
                if (isLesser) total += value;
                break;
            case 'greaterCharm':
                if (isGreater) total += value;
                break;
            case 'T2':
                if (isT2) total += value;
                break;
            case 'T36':
                if (!isT2 && !isLesser && !isGreater) total += value;
                break;
        }
    }
    return total;
};
const getConsumable = (record, field) => {
    let item = record.revenueRecords?.consumable?.[field];
    if (!item) return { drop: 0, use: 0, balance: 0 };
    return { drop: item.drop || 0, use: item.use || 0, balance: item.balance || 0 };
};
const STATS_FIELDS = [
    { id: 'date', get: d => d.date || '' },
    { id: 'world', style: 'min-width: 60px;', get: d => d.world || '', doI18n: true },
    { id: 'level', get: d => d.playerLevel || '' },
    { id: 'persona', style: 'min-width: 150px;', get: d => d.persona || '' },
    { id: 'battleType', get: d => d.battleType === 'Tower' ? `Tower (${d.towerFloor}F)` : (d.battleType || ''), doI18n: true },
    { id: 'round', get: d => d.roundInfo?.current || '' },
    { id: 'deltaTime', get: d => d.deltaTime || '' },
    { id: 'turns', style: 'min-width: 60px;', get: d => d.turns || '' },
    { id: 'tps', get: d => d.tps || '' },
    { id: 'finalProfit', get: d => d.revenueRecords?.finalProfit || 0 },
    { id: 'credit', get: d => d.revenueRecords?.credit || 0 },
    { id: 'staminaCost', get: d => d.revenueRecords?.staminaCost || 0 },
    { id: 'totalProfit', get: d => d.revenueRecords?.totalProfit || 0 },

    { id: 'pDGlance', get: d => d.combatRecords?.physicalDealt?.glance || 0 },
    { id: 'pDHit', get: d => d.combatRecords?.physicalDealt?.hit || 0 },
    { id: 'pDCrit', get: d => d.combatRecords?.physicalDealt?.crit || 0 },
    { id: 'mDGlance', get: d => d.combatRecords?.magicalDealt?.glance || 0 },
    { id: 'mDHit', get: d => d.combatRecords?.magicalDealt?.hit || 0 },
    { id: 'mDCrit', get: d => d.combatRecords?.magicalDealt?.crit || 0 },
    { id: 'mDRes', get: d => d.combatRecords?.magicalDealt?.resist || 0 },
    { id: 'mDRes50', get: d => d.combatRecords?.magicalDealt?.resist50 || 0 },
    { id: 'mDRes75', get: d => d.combatRecords?.magicalDealt?.resist75 || 0 },
    { id: 'mDRes90', get: d => d.combatRecords?.magicalDealt?.resist90 || 0 },
    { id: 'mDResP', get: d => d.combatRecords?.magicalDealt?.resistPartially || 0 },
    { id: 'mDDRes0', get: d => d.combatRecords?.magicalDealt?.debuffResist0 || 0 },
    { id: 'mDDRes12', get: d => d.combatRecords?.magicalDealt?.debuffResist1 || 0 },
    { id: 'mDDRes3', get: d => d.combatRecords?.magicalDealt?.debuffResist3 || 0 },

    { id: 'uCure', get: d => d.combatRecords?.use?.Cure || 0 },
    { id: 'uFullCure', get: d => d.combatRecords?.use?.['Full-Cure'] || 0 },
    { id: 'uCloakOfTheFallen', get: d => d.combatRecords?.use?.['Cloak of the Fallen'] || 0 },
    { id: 'uImperil', get: d => d.combatRecords?.use?.Imperil || 0 },

    { id: 'eqP', get: d => d.revenueRecords?.equipment?.Peerless?.length || 0 },
    { id: 'eqL', get: d => d.revenueRecords?.equipment?.Legendary?.length || 0 },
    { id: 'eqM', get: d => d.revenueRecords?.equipment?.Magnificent?.length || 0 },
    { id: 'cha', get: d => d.revenueRecords?.token?.['Chaos Token'] || 0 },
    { id: 'blo', get: d => d.revenueRecords?.token?.['Token of Blood'] || 0 },

    { id: 'food', get: d => sumRevenueCategory(d, 'food') },
    { id: 'fig', get: d => sumRevenueCategory(d, 'figurine') },
    { id: 'arti', get: d => sumRevenueCategory(d, 'artifact') },
    { id: 'crys', get: d => sumRevenueCategory(d, 'crystal') },

    { id: 't2', get: d => sumTrophies(d, 'T2') },
    { id: 't36', get: d => sumTrophies(d, 'T36') },
    { id: 'lCharm', get: d => sumTrophies(d, 'lesserCharm') },
    { id: 'gCharm', get: d => sumTrophies(d, 'greaterCharm') },

    { id: 'seed', get: d => getConsumable(d, 'World Seed') },
    { id: 'hd', get: d => getConsumable(d, 'Health Draught') },
    { id: 'md', get: d => getConsumable(d, 'Mana Draught') },
    { id: 'sd', get: d => getConsumable(d, 'Spirit Draught') },
    { id: 'hp', get: d => getConsumable(d, 'Health Potion') },
    { id: 'mp', get: d => getConsumable(d, 'Mana Potion') },
    { id: 'sp', get: d => getConsumable(d, 'Spirit Potion') },
    { id: 'he', get: d => getConsumable(d, 'Health Elixir') },
    { id: 'me', get: d => getConsumable(d, 'Mana Elixir') },
    { id: 'se', get: d => getConsumable(d, 'Spirit Elixir') },
    { id: 'le', get: d => getConsumable(d, 'Last Elixir') },
    { id: 'swif', get: d => getConsumable(d, 'Scroll of Swiftness') },
    { id: 'prot', get: d => getConsumable(d, 'Scroll of Protection') },
    { id: 'avat', get: d => getConsumable(d, 'Scroll of the Avatar') },
    { id: 'abso', get: d => getConsumable(d, 'Scroll of Absorption') },
    { id: 'shad', get: d => getConsumable(d, 'Scroll of Shadows') },
    { id: 'life', get: d => getConsumable(d, 'Scroll of Life') },
    { id: 'gods', get: d => getConsumable(d, 'Scroll of the Gods') },
].map(f => ({ ...f, label: `sP.${f.id}` }));

const KEYBINDS = {
    openBattleRecords: { key: 'z', ctrl: false, alt: false, shift: false },
    toggleActive: { key: 'm', ctrl: false, alt: false, shift: false },
    openSettings: { key: ',', ctrl: false, alt: false, shift: false }
};
let userKeybinds = JSON.parse(localStorage.getItem(prefix + 'userKeybinds' + isekaiSuffix)) || { ...KEYBINDS };
let keybindController = null;
let idCounter = 0;
const mkF = (key, type, extra = {}) => {
    const {
        prefix = 'cB.',
        label,
        ...otherExtra
    } = extra;
    const field = {
        key,
        type,
        label: label || (type === 'constant' ? `${prefix}${extra.value || key}` : `${prefix}${key}`),
        ...otherExtra
    };

    ['options', 'multiSelectOptions'].forEach(opts => {
        if (type !== 'conditionsArray' && Array.isArray(field[opts])) field[opts] = field[opts].map(opt => ({ value: opt, label: `${prefix}${opt}` }));
    });

    return field;
};
const mkItem = (type, nameList = null, extra = [], useGeneral = true, useTarget = false) => {
    const properties = [mkF('type', 'constant', { value: type, class: 'heading' })];

    if (nameList) properties.push(mkF('name', 'dropdown', { options: nameList }));
    if (extra.length > 0) properties.push(...extra.map(item => mkF(item.key, item.type, { ...item })));

    let conds = [];
    if (useGeneral) conds = conds.concat(conditionsGeneral);
    if (useTarget)  conds = conds.concat(conditionsTarget);
    if (conds.length > 0) properties.push(mkF('conditions', 'conditionsArray', { options: conds }));

    return { type: 'object', properties };
};
const conditionsGeneral = [
    mkF('world', 'array', { multiSelectOptions: ['Persistent', 'Isekai'], itemSchema: { type: 'text' } }),
    mkF('pLevel', 'rangeNumber'),
    mkF('battleTypes', 'array', { multiSelectOptions: BATTLE_TYPES, itemSchema: { type: 'text' } }),
    mkF('difficulty', 'array', { multiSelectOptions: Object.keys(difficultyMap), itemSchema: { type: 'text' } }),
    mkF('roundCurrent', 'rangeNumber'),
    mkF('roundLeft', 'rangeNumber'),
    mkF('roundTotal', 'rangeNumber'),
    mkF('floor', 'rangeNumber'),
    mkF('pActionCooldown', 'array', { multiSelectOptions: [
        ...SKILLS,
        ...SPELLS_INSTANT, ...SPELLS_DURATION, ...ITEMS_INSTANT, ...ITEMS_DURATION,
        ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.cooldownRange', itemSchema: { type: 'text' } }),
    mkF('pActionCounts', 'array', { multiSelectOptions: [
        'Attack', ...TOGGLE, ...SKILLS,
        ...SPELLS_INSTANT, ...SPELLS_DURATION, ...ITEMS_INSTANT, ...ITEMS_DURATION,
        ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.usesPerRoundRange', itemSchema: { type: 'text' } }),
    mkF('pHP', 'rangeNumber'),
    mkF('pMP', 'rangeNumber'),
    mkF('pSP', 'rangeNumber'),
    mkF('pOC', 'rangeNumber'),
    mkF('pSpiritStatus', 'boolean'),
    mkF('pEffects', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.remainingTurnsRange', itemSchema: { type: 'text' } }),
    mkF('pIgnoredEffects', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.remainingTurnsRange', itemSchema: { type: 'text' } }),
    mkF('pEffectStacks', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.stacksRange', itemSchema: { type: 'text' } }),
    mkF('monsters', 'rangeNumber'),
    mkF('activeMonsters', 'rangeNumber'),
    mkF('defeatedMonsters', 'rangeNumber'),
    mkF('bosses', 'rangeNumber'),
    mkF('activeBosses', 'rangeNumber'),
    mkF('defeatedBosses', 'rangeNumber'),
    mkF('mWithoutEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.monsterCountRange', itemSchema: { type: 'text' } }),
];
const conditionsTarget = [
    mkF('tName', 'text'),
    mkF('tTypes', 'array', { multiSelectOptions: MONSTER_TYPES, itemSchema: { type: 'text' } }),
    mkF('tClasses', 'array', { multiSelectOptions: MONSTER_CLASSES, itemSchema: { type: 'text' } }),
    mkF('tPowerLevel', 'rangeNumber'),
    mkF('tIndex', 'rangeNumber'),
    mkF('tHP', 'rangeNumber'),
    mkF('tEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.remainingTurnsRange', itemSchema: { type: 'text' } }),
    mkF('tIgnoredEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.remainingTurnsRange', itemSchema: { type: 'text' } }),
    mkF('tEffectStacks', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.stacksRange', itemSchema: { type: 'text' } }),
    mkF('tDaysSinceUpdate', 'rangeNumber'),
];
const cfgBattleSchema = {
    type: 'object',
    properties: [
        mkF('basic', 'heading', { class: 'heading-main' }),
        mkF('advanceToNextRound', 'boolean'),
        mkF('autoStartBattle', 'boolean'),
        mkF('autoEncounter', 'boolean'),
        mkF('autoDawn', 'boolean'),
        mkF('notifyOnRiddle', 'boolean'),
        mkF('encounterDailyLimit', 'number'),
        mkF('autoArena', 'boolean'),
        mkF('arenaDailyLimit', 'number'),
        mkF('autoRingOfBlood', 'boolean'),
        mkF('ringOfBloodChallenges', 'array', { multiSelectOptions: ROB_CHALLENGES, itemSchema: { type: 'text' } }),
        mkF('isekaiMode', 'boolean'),
        mkF('randomDelayEnabled', 'boolean'),
        mkF('delayRangeMs', 'rangeNumber'),
        mkF('showCooldowns', 'boolean'),
        mkF('quickbarExtend', 'array', { itemSchema: { type: 'text' } }),
        mkF('showDurations', 'boolean'),
        mkF('showRealTimeProficiency', 'boolean'),
        mkF('showMonsterIndex', 'boolean'),
        mkF('showMonsterInfo', 'boolean'),
        mkF('showMonsterHP', 'boolean'),
        mkF('recordBattleLog', 'boolean'),
        mkF('dailyStaminaQuotaPlus', 'number'),
        mkF('ctrlWidgetStyleText', 'text', { placeholder: 'opacity: 0.75;' }),
        mkF('ctrlWidgetMouseEnter', 'boolean'),
		mkF('ctrlWidgetRows', 'fieldPicker', {
            prefix: 'cW.',
            size: 16,
            allFields: CTRLWIDGET_FIELDS,
        }),

        mkF('battleModeSettings', 'heading', { class: 'heading-main' }),
        {
            key: 'modes', type: 'dropdown', label: 'cB.modes',
            hasModeDropdown: 'battleMode',
            options: BATTLE_MODES.map(key => ({ value: key, label: `cB.${key}` })),
            itemSchema: {
                type: 'object',
                properties: [
                    mkF('supports', 'array', {
                        class: 'heading-main',
                        itemSchema: {
                            type: 'object',
                            discriminator: 'type',
                            oneOf: {
                                spellInstant: mkItem('spellInstant', SPELLS_INSTANT),
                                spellDuration: mkItem('spellDuration', SPELLS_DURATION),
                                itemInstant: mkItem('itemInstant', ITEMS_INSTANT),
                                itemDuration: mkItem('itemDuration', ITEMS_DURATION),
                                toggle: mkItem('toggle', TOGGLE, [{ key: 'toggled', type: 'boolean' }]),
                                stop: mkItem('stop', null, [{ key: 'customMessage', type: 'text' }]),
                            }
                        }
                    }),
                    mkF('attacks', 'array', {
                        class: 'heading-main',
                        itemSchema: {
                            type: 'object',
                            discriminator: 'type',
                            oneOf: {
                                target: mkItem('target', null, [{ key: 'priorityRule', type: 'dropdown', options: PRIORITY_RULES }], true, true),
                                toggle: mkItem('toggle', TOGGLE, [{ key: 'toggled', type: 'boolean' }], true, true),
                                smartDebuff: mkItem('smartDebuff', SPELLS_DEBUFF, [
                                    { key: 'targetCount', type: 'dropdown', options: [3, 2, 1] },
                                    { key: 'bottomUp', type: 'boolean' },
                                    { key: 'tailSkip', type: 'number' },
                                    { key: 'maxAtFirst', type: 'number' },
                                    { key: 'minMonstersLeft', type: 'number' }
                                ], true, true),
                                spellDebuff: mkItem('spellDebuff', SPELLS_DEBUFF, [], true, true),
                                spellDamage: mkItem('spellDamage', SPELLS_DAMAGE, [], true, true),
                                skill: mkItem('skill', SKILLS, [], true, true),
                                normalAttack: mkItem('normalAttack', null, [], false, false),
                            }
                        }
                    })
                ]
            }
        }
    ]
};
const cfgStatsSchema = {
    type: 'object',
    properties: [
        mkF('basic', 'heading', { class: 'heading-main', prefix: 'cS.' }),
        mkF('combatRows', 'fieldPicker', {
            prefix: 'cS.',
            size: 16,
            allFields: COMBAT_FIELDS,
            editFields: [
                { key: 's_pd' },
                { key: 's_md' },
                { key: 's_td' },
                { key: 's_pt' },
                { key: 's_ps' },
                { key: 's_mt' },
                { key: 's_ms' },
                { key: 's_tt' },
            ].map(f => ({ ...f, label: `cS.${f.key}`, placeholder: 'background-color: red' })),
        }),
        mkF('revenueRows', 'fieldPicker', {
            prefix: 'cS.',
            size: 16,
            allFields: REVENUE_FIELDS,
            editFields: [
                { key: 'styleText', label: 'cS.styleText', placeholder: 'color: red;' },
            ],
        }),
        mkF('statsColumns', 'fieldPicker', {
            prefix: 'cS.',
            size: 16,
            allFields: STATS_FIELDS,
            editFields: [
                { key: 'customName', label: 'cS.customName' },
                { key: 'styleText', label: 'cS.styleText', placeholder: 'color: red;' },
                { key: 'colorThresholds', label: 'cS.colorThresholds', placeholder: '500:#c31dcf, 1000:red' },
            ],
        }),
    ]
};

const cfgThemeSchema = {
    type: 'object',
    properties: [
        mkF('basic', 'heading', { class: 'heading-main', prefix: 'cT.' }),
        mkF('darkMode', 'boolean', { prefix: 'cT.' }),
    ]
};
let itemCooldowns = {};
let vitals = {};
let spiritStatus = false;
let playerEffectsObj = {};
let monstersObj = {};

const I18N = {
    "cW": {
        "ctrlWidgetRows": "控制元件列",
        "isActiveBattle": "战斗状态",
        "autoStartBattle": "自动开战",
        "OneHanded": "单手",
        "1H_Mage": "单手战法师",
        "TwoHanded": "双手",
        "2H_Mage": "双手战法师",
        "DualWielding": "双持",
        "DW_Mage": "双持战法师",
        "NitenIchiryu": "二天一流",
        "NI_Mage": "二天一流战法师",
        "readyNext": "准备好下一步",
        "networkDelay": "网络延迟",
        "battleStyle": "战斗风格",
        "Staff": "法师",
        "Unarmed": "徒手",
        "fire": "火",
        "cold": "冰",
        "wind": "风",
        "elec": "雷",
        "holy": "圣",
        "dark": "暗",
        "battleType": "战斗类型",
        "Arena": "竞技场",
        "Encounter": "随机遭遇",
        "Colosseum": "浴血擂台",
        "Battle1000": "压榨界",
        "Item": "道具世界",
        "Tower": "塔楼",
        "round": "轮次",
        "openSettings": "打开设置"
    },
    "cB": {
        "advanceToNextRound": "自动进入下一轮战斗",
        "autoStartBattle": "新轮自动开战",
        "autoEncounter": "自动遭遇战",
            "autoDawn": "仅签到（不触发遭遇战战斗）",
            "notifyOnRiddle": "小马谜题通知",
            "encounterDailyLimit": "每日遭遇战次数上限",
        "autoArena": "自动竞技场",
        "arenaDailyLimit": "每日竞技场场数上限",
        "autoRingOfBlood": "自动浴血擂台",
        "ringOfBloodChallenges": "浴血擂台挑战选择（不选=全部）",
        "isekaiMode": "异世界模式（竞技场/擂台使用异世界）",
        "Konata": "泉此方 (Konata)",
        "Mikuru Asahina": "朝比奈实玖瑠 (Mikuru Asahina)",
        "Ryouko Asakura": "朝仓凉子 (Ryouko Asakura)",
        "Yuki Nagato": "长门有希 (Yuki Nagato)",
        "Real Life": "现实生活 (Real Life)",
        "Invisible Pink Unicorn": "隐形粉红独角兽 (Invisible Pink Unicorn)",
        "Flying Spaghetti Monster": "飞行意大利面怪物 (Flying Spaghetti Monster)",
        "Triple Trio and the Tree": "大树十重奏 (Triple Trio and the Tree)",
        "randomDelayEnabled": "随机延迟",
        "delayRangeMs": "延迟范围(毫秒)",
        "showCooldowns": "在快捷栏位显示冷却回合数",
        "quickbarExtend": "快捷栏",
        "showDurations": "显示状态剩余回合数",
        "showRealTimeProficiency": "即时显示目前获得的熟练度",
        "showMonsterIndex": "显示怪物索引值",
        "showMonsterInfo": "（需要安装怪物数据库脚本） 显示怪物资讯，包含类别、攻击类型与战斗力",
        "showMonsterHP": "显示怪物血量，包含目前血量与最大血量",
        "recordBattleLog": "纪录战斗日志",
        "dailyStaminaQuotaPlus": "每日额外精力",
        "ctrlWidgetStyleText": "控制元件行内样式",
        "ctrlWidgetMouseEnter": "在控制元件监听游标进入事件",
        "battleModeSettings": "战斗模式设置",
        "spellInstant": "即时法术",
        "spellDuration": "长效法术",
        "itemInstant": "即时物品",
        "itemDuration": "长效物品",
        "customMessage": "显示自定义信息",
        "priorityRule": "优先度规则",
        "smartDebuff": "智能减益",
        "targetCount": "法术影响的目标数",
        "bottomUp": "由下而上（从怪物J处理到怪物A）",
        "tailSkip": "忽略尾端 （正数为忽略末N个怪物；负数则只锁定前N个怪物）",
        "maxAtFirst": "二只怪物死前的最大施法次数",
        "minMonstersLeft": "无限施法的存活怪物数量阈值",
        "spellDebuff": "减益法术",
        "spellDamage": "伤害法术",
        "normalAttack": "普通攻击",
        "pLevel": "玩家等级范围",
        "battleTypes": "战斗类型",
        "roundCurrent": "目前轮次范围",
        "roundLeft": "剩余轮次范围",
        "roundTotal": "总轮次范围",
        "floor": "楼层范围",
        "pActionCooldown": "玩家行动冷却范围",
        "pActionCounts": "玩家行动次数范围",
        "pHP": "玩家血量百分比范围",
        "pMP": "玩家魔力百分比范围",
        "pSP": "玩家灵力百分比范围",
        "pOC": "玩家斗气百分比范围",
        "pSpiritStatus": "玩家灵动状态",
        "pEffects": "玩家效果",
        "pIgnoredEffects": "玩家忽略效果",
        "pEffectStacks": "玩家效果堆叠数",
        "monsters": "怪物数量范围",
        "activeMonsters": "怪物存活数量范围",
        "defeatedMonsters": "怪物击败数量范围",
        "bosses": "魔王数量范围",
        "activeBosses": "魔王存活数量范围",
        "defeatedBosses": "魔王击败数量范围",
        "mWithoutEffects": "怪物没有效果范围",
        "tName": "怪物名字",
        "tTypes": "怪物类型",
        "tClasses": "怪物类别",
        "tPowerLevel": "怪物战斗力范围",
        "tIndex": "怪物索引值范围",
        "tHP": "怪物血量百分比范围",
        "tEffects": "怪物效果",
        "tIgnoredEffects": "怪物忽略效果",
        "tEffectStacks": "怪物效果堆叠数",
        "tDaysSinceUpdate": "怪物距离上次更新日数范围",
        "OneHanded_General": "单手-通用",
        "OneHanded_Tower": "单手-塔楼",
        "1H_Mage_General": "单手战法师-通用",
        "TwoHanded_General": "双手-通用",
        "2H_Mage_General": "双手战法师-通用",
        "DualWielding_General": "双持-通用",
        "DW_Mage_General": "双持战法师-通用",
        "NitenIchiryu_General": "二天一流-通用",
        "NI_Mage_General": "二天一流战法师-通用",
        "Staff_General": "法师-通用",
        "Unarmed_General": "徒手-通用",
        "openBattleRecords": "打开战斗纪录",
        "toggleActive": "开始战斗",
        "openSettings": "打开设置",
        "basic": "基本",
        "modes": "战斗模式",
        "name": "名字",
        "supports": "补给",
        "toggle": "切换",
        "toggled": "切换",
        "stop": "停止",
        "attacks": "攻击",
        "target": "目标",
        "skill": "技能",
        "conditions": "条件",
        "world": "世界",
        "Persistent": "主世界",
        "Isekai": "异世界",
        "Arena": "竞技场",
        "Encounter": "随机遭遇",
        "Colosseum": "浴血擂台",
        "Battle1000": "压榨界",
        "Item": "道具世界",
        "Tower": "塔楼",
        "difficulty": "难度",
        "Normal": "普通",
        "Hard": "困难",
        "Nightmare": "恶梦",
        "Hell": "地狱",
        "Nintendo": "任天堂",
        "IWBTH": "我要成为变态",
        "PFUDOR": "毛茸茸的粉红独角兽在彩虹上跳舞",
        "cooldownRange": "冷却范围",
        "usesPerRoundRange": "单轮次使用次数范围",
        "remainingTurnsRange": "剩余回合数范围",
        "stacksRange": "堆叠数范围",
        "monsterCountRange": "怪物数量范围",
        "Top Down": "由上而下",
        "Bottom Up": "由下而上",
        "Current HP Low to High": "目前血量值由低至高",
        "Current HP High to Low": "目前血量值由高至低",
        "Current HP Percent Low to High": "目前血量百分比由低至高",
        "Current HP Percent High to Low": "目前血量百分比由高至低",
        "Rare": "罕见",
        "Legendary": "传奇",
        "Ultimate": "终极",
        "Arena300": "竞技场300",
        "Arena400": "竞技场400",
        "Arena500": "竞技场500",
        "Arthropod": "节肢动物",
        "Avion": "飞禽",
        "Beast": "兽类",
        "Celestial": "天使",
        "Daimon": "魔鬼",
        "Dragonkin": "龙类",
        "Elemental": "元素精灵",
        "Giant": "巨人",
        "Humanoid": "类人类",
        "Mechanoid": "人形机器人",
        "Reptilian": "爬虫类",
        "Sprite": "妖精",
        "Undead": "不死族",
        "Channeling": "引导",
        "Regeneration": "再生",
        "Replenishment": "补给",
        "Refreshment": "提神",
        "Hastened": "急速",
        "Absorbing Ward": "吸收",
        "Infused Flames": "火焰附魔",
        "Infused Frost": "冰霜附魔",
        "Infused Storm": "风暴附魔",
        "Infused Lightning": "闪电附魔",
        "Infused Divinity": "神圣附魔",
        "Infused Darkness": "黑暗附魔",
        "Energized": "带劲",
        "Sleeper Imprint": "沉睡烙印",
        "Kicking Ass": "海扁",
        "Overwhelming Strikes": "压制打击",
        "Ether Tap": "以太之触",
        "Cloak of the Fallen": "陨落的披风",
        "Blessing of the RiddleMaster": "御谜士的祝福",
        "Defending": "防御",
        "Focusing": "专注",
        "Vital Theft": "生命吸窃",
        "Ether Theft": "以太吸窃",
        "Spirit Theft": "灵力吸窃",
        "Weakened": "虚弱",
        "Imperiled": "陷危",
        "Slowed": "缓慢",
        "Asleep": "沉眠",
        "Confused": "混乱",
        "Blinded": "致盲",
        "Silenced": "沉默",
        "Magically Snared": "魔磁网",
        "Immobilized": "定身",
        "Stunned": "晕眩",
        "Penetrated Armor": "破甲",
        "Bleeding Wound": "流血",
        "Spreading Poison": "流动毒性",
        "Coalesced Mana": "魔力合流",
        "Searing Skin": "烧灼的皮肤",
        "Freezing Limbs": "冰封的肢体",
        "Turbulent Air": "湍流的空气",
        "Deep Burns": "深层的烧伤",
        "Breached Defense": "崩溃的防御",
        "Blunted Attack": "钝化的攻击",
        "Burning Soul": "焚烧的灵魂",
        "Ripened Soul": "鲜美的灵魂",
        "Fury of the Sisters": "姊妹们的盛怒",
        "Lamentations of the Future": "未来的哀叹",
        "Screams of the Past": "昔日的凄叫",
        "Wails of the Present": "此刻的恸哭",
        "Attack": "攻击",
        "Spirit": "灵动",
        "Defend": "防守",
        "Focus": "专注",
        "Counter": "反击",
        "Shield Bash": "盾牌猛击",
        "Vital Strike": "要害猛击",
        "Merciful Blow": "最后的慈悲",
        "Iris Strike": "致盲打击",
        "Backstab": "暗影潜袭",
        "Frenzied Blows": "星爆气流斩",
        "Great Cleave": "蓄力重击",
        "Rending Blow": "猛龙破军击",
        "Shatter Strike": "崩山裂地击",
        "Skyward Sword": "燕返",
        "Concussive Strike": "震荡冲击",
        "Flee": "逃跑",
        "Scan": "扫描",
        "FUS RO DAH": "龙之怒吼",
        "Orbital Friendship Cannon": "轨道友情加农炮",
        "Cure": "疗伤",
        "Full-Cure": "全疗伤",
        "Regen": "细胞活化",
        "Haste": "急速",
        "Protection": "守护",
        "Absorb": "吸收",
        "Shadow Veil": "影纱",
        "Spark of Life": "生命火花",
        "Spirit Shield": "灵力盾",
        "Heartseeker": "穿心",
        "Arcane Focus": "奥术集成",
        "Health Gem": "生命宝石",
        "Health Potion": "生命药水",
        "Health Elixir": "生命万能药",
        "Mana Gem": "魔力宝石",
        "Mana Potion": "魔力药水",
        "Mana Elixir": "魔力万能药",
        "Spirit Gem": "灵力宝石",
        "Spirit Potion": "灵力药水",
        "Spirit Elixir": "灵力万能药",
        "Last Elixir": "终极万能药",
        "Mystic Gem": "神秘宝石",
        "Health Draught": "生命长效药",
        "Mana Draught": "魔力长效药",
        "Spirit Draught": "灵力长效药",
        "Infusion of Flames": "火焰魔药",
        "Infusion of Frost": "冰霜魔药",
        "Infusion of Storms": "风暴魔药",
        "Infusion of Lightning": "闪电魔药",
        "Infusion of Divinity": "神圣魔药",
        "Infusion of Darkness": "黑暗魔药",
        "Scroll of Swiftness": "迅捷卷轴",
        "Scroll of Protection": "防护卷轴",
        "Scroll of the Avatar": "化身卷轴",
        "Scroll of Absorption": "吸收卷轴",
        "Scroll of Shadows": "幻影卷轴",
        "Scroll of Life": "生命卷轴",
        "Scroll of the Gods": "神之卷轴",
        "Caffeinated Candy": "咖啡因糖果",
        "Energy Drink": "能量饮料",
        "Flower Vase": "花瓶",
        "Bubble-Gum": "泡泡糖",
        "T1": "T1",
        "T2": "T2",
        "T3": "T3",
        "Fiery Blast": "高热冲击",
        "Inferno": "地狱火",
        "Flames of Loki": "邪神战火",
        "Freeze": "冰冻",
        "Blizzard": "暴雪",
        "Fimbulvetr": "芬布尔之冬",
        "Gale": "烈风",
        "Downburst": "下击暴流",
        "Storms of Njord": "尼奥尔德神风",
        "Shockblast": "电光冲击",
        "Chained Lightning": "连锁闪电",
        "Wrath of Thor": "雷神之怒",
        "Smite": "惩戒",
        "Banishment": "放逐",
        "Paradise Lost": "失乐园",
        "Corruption": "腐败",
        "Disintegrate": "瓦解",
        "Ragnarok": "诸神黄昏",
        "Drain": "枯竭",
        "Weaken": "虚弱",
        "Imperil": "陷危",
        "Slow": "缓慢",
        "Sleep": "沉眠",
        "Confuse": "混乱",
        "Blind": "致盲",
        "Silence": "沉默",
        "MagNet": "魔磁网",
        "Immobilize": "定身",
        "exportCurrentBattleMode": "导出当前战斗模式",
        "resetCurrentBattleMode": "重置当前战斗模式",
        "battleSettings": "战斗设置",
        "saveBattleConfig": "保存战斗设置",
        "exportBattleConfig": "导出战斗设置",
        "importBattleConfig": "导入战斗设置"
    },
    "cT": {
        "basic": "基本",
        "darkMode": "深色模式",
        "themeSettings": "主题设置",
        "saveThemeConfig": "保存主题设置",
        "exportThemeConfig": "导出主题设置",
        "importThemeConfig": "导入主题设置"
    },
    "cS": {
        "s_pd": "物理造成伤害行内样式",
        "s_md": "魔法造成伤害行内样式",
        "s_td": "总造成伤害行内样式",
        "s_pt": "物理承受伤害行内样式",
        "s_ps": "物理灵力承受伤害行内样式",
        "s_mt": "魔法承受伤害行内样式",
        "s_ms": "魔法灵力承受伤害行内样式",
        "s_tt": "总承受伤害行内样式",
        "styleText": "行内样式",
        "exportDB": "导出数据库",
        "importDB": "导入数据库",
        "importConfirm": "是否合并数据？\n按确定确保只新增数据（合并），或按取消来覆盖已存在的数据（覆盖）。",
        "basic": "基本",
        "combatRows": "战斗列",
        "revenueRows": "营收列",
        "statsColumns": "统计栏位",
        "customName": "自定义名称",
        "colorThresholds": "颜色阈值",
        "resetStatsSettings": "重置统计设置",
        "statsSettings": "统计设置",
        "saveStatsConfig": "保存统计设置",
        "exportStatsConfig": "导出统计设置",
        "importStatsConfig": "导入统计设置"
    },
    "tP": {
        "t/s": "每秒回合数",
        "turns": "回合",
        "riddle": "谜语",
        "spark": "火花"
    },
    "cP": {
        "damageDealt": "造成伤害",
        "damageTaken": "承受伤害",
        "damagePlus": "额外伤害",
        "damageTotal": "总伤害",
        "resultTotal": "总结果",
        "resist50": "抵抗50",
        "resist75": "抵抗75",
        "resist90": "抵抗90",
        "parryPartially": "部分招架",
        "resistPartially": "部分抵抗",
        "blockPartially": "部分格挡",
        "resultPartiallyTotal": "总部分结果",
        "critStack": "暴击堆叠数",
        "debuffResist": "减益抵抗",
        "debuffResist0": "减益抵抗0",
        "debuffResist1-2": "减益抵抗1-2",
        "debuffResist3": "减益抵抗3",
        "spellSupport": "辅助法术",
        "spellDamage": "伤害法术",
        "spellDebuff": "减益法术",
        "physical": "物理",
        "magical": "魔法",
        "total": "总计",
        "spirit": "灵力",
        "fire": "火",
        "cold": "冰",
        "wind": "风",
        "elec": "雷",
        "holy": "圣",
        "dark": "暗",
        "crushing": "敲击",
        "slashing": "砍击",
        "piercing": "刺击",
        "void": "虚空",
        "glance": "擦伤",
        "hit": "击中",
        "crit": "暴击",
        "miss": "未击中",
        "evade": "闪避",
        "parry": "招架",
        "resist": "抵抗",
        "block": "格挡",
        "used": "已使用",
        "action": "行动",
        "item": "物品",
        "skill": "技能",
        "misc": "杂项"
    },
    "rP": {
        "unitPrice": "单价",
        "dual-wielding": "双持",
        "staff": "法杖",
        "revenue": "营收",
        "name": "名字",
        "drop": "掉落",
        "use": "使用",
        "balance": "结余",
        "profit": "收益",
        "noData": "无数据",
        "exp": "经验",
        "proficiency": "熟练度",
        "credit": "钱",
        "equipment": "装备",
        "material": "材料",
        "consumable": "消耗品",
        "consumableProfit": "消耗品收益",
        "token": "令牌",
        "tokenProfit": "令牌收益",
        "food": "食物",
        "foodProfit": "食物收益",
        "figurine": "雕像",
        "figurineProfit": "雕像收益",
        "artifact": "文物",
        "artifactProfit": "文物收益",
        "trophy": "奖杯",
        "trophyProfit": "奖杯收益",
        "crystal": "水晶",
        "crystalTotal": "水晶收益",
        "totalProfit": "总收益",
        "stamina": "精力",
        "finalProfit": "最终收益",
        "one-handed weapon": "单手",
        "two-handed weapon": "双手",
        "dual wielding": "双持",
        "cloth armor": "布甲",
        "light armor": "轻甲",
        "heavy armor": "重甲",
        "elemental magic": "元素魔法",
        "divine magic": "神圣魔法",
        "forbidden magic": "黑暗魔法",
        "supportive magic": "辅助魔法",
        "deprecating magic": "贬抑魔法",
        "Low-Grade Cloth": "低级布料",
        "Mid-Grade Cloth": "中级布料",
        "High-Grade Cloth": "高级布料",
        "Low-Grade Leather": "低级皮革",
        "Mid-Grade Leather": "中级皮革",
        "High-Grade Leather": "高级皮革",
        "Low-Grade Metals": "低级金属",
        "Mid-Grade Metals": "中级金属",
        "High-Grade Metals": "高级金属",
        "Low-Grade Wood": "低级木材",
        "Mid-Grade Wood": "中级木材",
        "High-Grade Wood": "高级木材",
        "Scrap Cloth": "废布料",
        "Scrap Leather": "废皮革",
        "Scrap Metal": "废金属",
        "Scrap Wood": "废木材",
        "Energy Cell": "能量元件",
        "Health Draught": "生命长效药",
        "Health Potion": "生命药水",
        "Health Elixir": "生命万能药",
        "Mana Draught": "魔力长效药",
        "Mana Potion": "魔力药水",
        "Mana Elixir": "魔力万能药",
        "Spirit Draught": "灵力长效药",
        "Spirit Potion": "灵力药水",
        "Spirit Elixir": "灵力万能药",
        "Last Elixir": "终极万能药",
        "Infusion of Flames": "火焰魔药",
        "Infusion of Frost": "冰霜魔药",
        "Infusion of Storms": "风暴魔药",
        "Infusion of Lightning": "闪电魔药",
        "Infusion of Divinity": "神圣魔药",
        "Infusion of Darkness": "黑暗魔药",
        "Scroll of Swiftness": "迅捷卷轴",
        "Scroll of Protection": "防护卷轴",
        "Scroll of the Avatar": "化身卷轴",
        "Scroll of Absorption": "吸收卷轴",
        "Scroll of Shadows": "幻影卷轴",
        "Scroll of Life": "生命卷轴",
        "Scroll of the Gods": "神之卷轴",
        "Voidseeker Shard": "虚空碎片",
        "Aether Shard": "以太碎片",
        "Featherweight Shard": "羽毛碎片",
        "Amnesia Shard": "失忆碎片",
        "World Seed": "世界种子",
        "Flower Vase": "花瓶",
        "Bubble-Gum": "泡泡糖",
        "Token of Blood": "混沌令牌",
        "Chaos Token": "怪物令牌",
        "Soul Fragment": "灵魂断片",
        "Monster Chow": "怪物口粮",
        "Monster Edibles": "怪物食品",
        "Monster Cuisine": "怪物料理",
        "Happy Pills": "快乐药丸",
        "Twilight Sparkle Figurine": "暮光闪闪的公仔",
        "Rainbow Dash Figurine": "云宝黛西的公仔",
        "Applejack Figurine": "苹果杰克的公仔",
        "Fluttershy Figurine": "小蝶的公仔",
        "Pinkie Pie Figurine": "萍琪的公仔",
        "Rarity Figurine": "瑞瑞的公仔",
        "Trixie Figurine": "崔克茜的公仔",
        "Princess Celestia Figurine": "塞拉斯提娅公主的公仔",
        "Princess Luna Figurine": "露娜公主的公仔",
        "Apple Bloom Figurine": "小萍花的公仔",
        "Scootaloo Figurine": "飞板露的公仔",
        "Sweetie Belle Figurine": "甜贝儿的公仔",
        "Big Macintosh Figurine": "大麦克的公仔",
        "Spitfire Figurine": "爆火的公仔",
        "Derpy Hooves Figurine": "小呆的公仔",
        "Lyra Heartstrings Figurine": "天琴心弦的公仔",
        "Octavia Figurine": "奥塔维亚的公仔",
        "Zecora Figurine": "泽科拉的公仔",
        "Cheerilee Figurine": "车厘子的公仔",
        "Vinyl Scratch Figurine": "维尼尔的公仔",
        "Daring Do Figurine": "天马无畏的公仔",
        "Doctor Whooves Figurine": "神秘博士的公仔",
        "Berry Punch Figurine": "酸梅酒的公仔",
        "Bon-Bon Figurine": "糖糖的公仔",
        "Fluffle Puff Figurine": "毛毛小马的公仔",
        "Angel Bunny Figurine": "天使兔的公仔",
        "Gummy Figurine": "甘米的公仔",
        "Precursor Artifact": "古文物",
        "ManBearPig Tail": "人熊猪的尾巴",
        "Holy Hand Grenade of Antioch": "安提阿的神圣手榴弹",
        "Mithra's Flower": "猫人族的花",
        "Dalek Voicebox": "戴立克音箱",
        "Lock of Blue Hair": "一绺蓝发",
        "Bunny-Girl Costume": "兔女郎装",
        "Hinamatsuri Doll": "雏人形",
        "Broken Glasses": "破碎的眼镜",
        "Black T-Shirt": "黑色Ｔ恤",
        "Sapling": "树苗",
        "Unicorn Horn": "独角兽的角",
        "Noodly Appendage": "面条般的附肢",
        "Crystal of Vigor": "力量水晶",
        "Crystal of Finesse": "灵巧水晶",
        "Crystal of Swiftness": "敏捷水晶",
        "Crystal of Fortitude": "体质水晶",
        "Crystal of Cunning": "智力水晶",
        "Crystal of Knowledge": "感知水晶",
        "Crystal of Flames": "火焰水晶",
        "Crystal of Frost": "冰冷水晶",
        "Crystal of Tempest": "风暴水晶",
        "Crystal of Lightning": "闪电水晶",
        "Crystal of Devotion": "神圣水晶",
        "Crystal of Corruption": "黑暗水晶"
    },
    "sP": {
        "jpxStats": "jpx 战斗统计",
        "pDGlance": "物攻擦伤",
        "pDHit": "物攻击中",
        "pDCrit": "物攻暴击",
        "mDGlance": "魔攻擦伤",
        "mDHit": "魔攻击中",
        "mDCrit": "魔攻暴击",
        "mDRes": "魔攻抵抗",
        "mDRes50": "魔攻抵抗50",
        "mDRes75": "魔攻抵抗75",
        "mDRes90": "魔攻抵抗90",
        "mDResP": "魔攻部分抵抗",
        "mDDRes0": "减益抵抗0",
        "mDDRes12": "减益抵抗1-2",
        "mDDRes3": "减益抵抗3",
        "uCure": "治疗",
        "uFullCure": "完全治疗",
        "uCloakOfTheFallen": "火花",
        "uImperil": "陷危",
        "eqP": "无双",
        "eqL": "传奇",
        "eqM": "史诗",
        "lCharm": "小护符",
        "gCharm": "大护符",
        "hd": "生命长效药",
        "md": "魔力长效药",
        "sd": "灵力长效药",
        "hp": "生命药水",
        "mp": "魔力药水",
        "sp": "灵力药水",
        "he": "生命万能药",
        "me": "魔力万能药",
        "se": "灵力万能药",
        "le": "终极万能药",
        "Aggregate by Day": "按日汇总",
        "Persistent": "主世界",
        "Isekai": "异世界",
        "Arena": "竞技场",
        "Encounter": "随机遭遇",
        "Colosseum": "浴血擂台",
        "Battle1000": "压榨界",
        "Item": "道具世界",
        "Tower": "塔楼",
        "Victory": "胜利",
        "Defeat": "战败",
        "Flee": "逃跑",
        "drop": "掉落",
        "use": "使用",
        "Total": "总计",
        "Average": "平均",
        "date": "日期",
        "world": "世界",
        "level": "等级",
        "persona": "人格",
        "battleType": "战斗模式",
        "round": "轮次",
        "deltaTime": "用时",
        "turns": "回合数",
        "tps": "每秒回合数",
        "finalProfit": "最终收益",
        "credit": "钱",
        "staminaCost": "精力消耗",
        "totalProfit": "总收益",
        "cha": "怪物令牌",
        "blo": "混沌令牌",
        "food": "食物",
        "fig": "雕像",
        "arti": "古遗物",
        "crys": "水晶",
        "t2": "奖杯2",
        "t36": "奖杯36",
        "seed": "种子",
        "swif": "迅捷卷轴",
        "prot": "防护卷轴",
        "avat": "化身卷轴",
        "abso": "吸收卷轴",
        "shad": "幻影卷轴",
        "life": "生命卷轴",
        "gods": "神之卷轴"
    },
    "add": "新增",
    "delete": "删除",
    "conditions": "条件",
    "cGen": {
        "saved!": "已保存",
        "error!": "保存失败",
        "exported!": "已导出",
        "exportFailed!": "导出失败",
        "imported!": "已导入",
        "importFailed!": "导入失败",
        "reset!": "已重置",
        "resetFailed!": "重置失败",
        "closeSettings": "关闭菜单"
    }
};

const mergedI18N = {};

function initDo() {
    // Override window.confirm for auto-arena (use unsafeWindow to override page's native dialogs in sandbox mode)
    const originalConfirm = unsafeWindow.confirm.bind(unsafeWindow);
    unsafeWindow.confirm = function(message) {
        // Check if auto-arena is enabled (need to load from localStorage since cfg might not be loaded yet)
        try {
            const storedCfg = JSON.parse(localStorage.getItem('jpx_cfgBattle') || localStorage.getItem('jpx_cfgBattle_isekai') || '{}');
            if (storedCfg.autoArena && message) {
                // Check for both English and Chinese arena challenge messages
                const isArenaChallenge = message.includes('Arena Challenge') ||
                                        message.includes('竞技场挑战') ||
                                        message.includes('arena challenge');
                if (isArenaChallenge) {
                    console.log('[JPX-PLUS] 自动确认竞技场挑战对话框:', message);
                    return true;
                }
            }
            if (storedCfg.autoRingOfBlood && message) {
                const isRoBChallenge = message.includes('Ring of Blood') ||
                                       message.includes('浴血擂台') ||
                                       message.includes('ring of blood');
                if (isRoBChallenge) {
                    console.log('[JPX-PLUS] 自动确认浴血擂台挑战对话框:', message);
                    return true;
                }
            }
        } catch(e) {
            console.log('[JPX-PLUS] Error checking auto-arena config:', e);
        }
        return originalConfirm(message);
    };

    const originalAlert = unsafeWindow.alert.bind(unsafeWindow);
    unsafeWindow.alert = function(message) {
        // Check if auto-arena or auto-encounter is enabled
        try {
            const storedCfg = JSON.parse(localStorage.getItem('jpx_cfgBattle') || localStorage.getItem('jpx_cfgBattle_isekai') || '{}');
            const isAutoMode = storedCfg.autoArena || storedCfg.autoEncounter || storedCfg.autoRingOfBlood;
            if (isAutoMode) {
                console.log('[JPX-PLUS] 自动关闭alert对话框:', message);
                return; // Suppress dialog in auto mode
            }
        } catch(e) {
            console.log('[JPX-PLUS] Error checking auto config:', e);
        }
        return originalAlert(message);
    };

    let style = document.createElement('style');
    style.id = 'jpx';
    style.textContent = cfg.styleText;
    document.head.appendChild(style);

    window.addEventListener('beforeunload', storeTmp);
    document.addEventListener('keydown', onKeyDown, true);

    initDoI18n();

    let queries = location.search.match(regExp.locationQueries) || [];
    let queriesObj = Object.fromEntries(queries.map(
        (query) => {
            return query.split('=', 2);
        }
    ));
    log = document.querySelector('#textlog');

    //Show JPX-PLUS Widget on all pages
    initEncounterWidget();

    //Arena - Auto Arena
    if (queriesObj.s === 'Battle' && queriesObj.ss === 'ar') {
        initAutoArena();
    }

    //Ring of Blood - Auto Ring of Blood
    if (queriesObj.s === 'Battle' && queriesObj.ss === 'rb') {
        initAutoRingOfBlood();
    }

    //Battle
    if (log && !doInitDoBattle) {
        initDoBattle();
        return;
    }

    //Riddle
    if (document.querySelector('#riddlemaster')) {
        riddleRecorder();
        return;
    }

    //Lobby
    if (!log) {
        let difficulty = localStorage.getItem(prefix + 'difficulty' + isekaiSuffix) || 'undefined';
        let playerLevel = parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix)) || 0;
        let persona = localStorage.getItem(prefix + 'persona' + isekaiSuffix) || 'undefined';
        let stamina = parseFloat(localStorage.getItem(prefix + 'stamina' + isekaiSuffix)) || 80;

        if (queriesObj.s === 'Battle') {
            let levelReadout = document.querySelector('#level_readout > div > div')?.innerText;
            let playerInfo = levelReadout.match(regExp.playerInfo);
            if (playerInfo) {
                if (difficulty != playerInfo[1]) {
                    localStorage.setItem(prefix + 'difficulty' + isekaiSuffix, playerInfo[1]);
                }
                if (playerLevel != playerInfo[1]) {
                    localStorage.setItem(prefix + 'playerLevel' + isekaiSuffix, playerInfo[2]);
                }
            }
            let staminaReadout = document.querySelector('#stamina_readout > div > div')?.innerText;
            let staminaInfo = staminaReadout.match(regExp.staminaInfo)?.[1];
            if (staminaInfo && stamina != staminaInfo) {
                localStorage.setItem(prefix + 'stamina' + isekaiSuffix, staminaInfo);
            }
        }

        let personaSelected = document.querySelector('#persona_form > select > option[selected]')?.innerText;
        if (personaSelected && persona != personaSelected) {
            localStorage.setItem(prefix + 'persona' + isekaiSuffix, personaSelected);
        }

        let spcArray = Array.from(document.querySelectorAll('.spc'));
        let spellDamageBonus = spcArray.find(spc =>
            spc.innerText.includes('Spell Damage Bonus') || jpxUtils.parseHVClasses(spc.querySelector('div')).includes('Spell Damage Bonus')
        );
        if (spellDamageBonus) {
            if (!isekaiSuffix) {
                let spellDamageBonusArray = Array.from(spellDamageBonus.nextElementSibling.children);
                let maxValue = -Infinity;
                let maxType = '';

                for (let i = 0; i < spellDamageBonusArray.length; i += 2) {
                    let value = parseFloat(spellDamageBonusArray[i].innerText || jpxUtils.parseHVClasses(spellDamageBonusArray[i].querySelector('div')));
                    let spellsDamageType = (spellDamageBonusArray[i + 1].innerText || jpxUtils.parseHVClasses(spellDamageBonusArray[i + 1].querySelector('div'))).match(/[A-Za-z]+/)?.[0];

                    if (value > maxValue) {
                        maxValue = value;
                        maxType = jpxUtils.lowerFirst(spellsDamageType);
                    }
                }

                if (
                    (maxType && spellDamageBonus.maxType != maxType) ||
                    (maxValue > 0 && spellDamageBonus.maxValue != maxValue)
                ){
                    localStorage.setItem(prefix + 'spellDamageBonus' + isekaiSuffix, JSON.stringify({
                        maxType: maxType,
                        maxValue: maxValue,
                    }));
                }
            /*isekai911*/
            } else {
                let table = spellDamageBonus.nextElementSibling;
                let rows = table.querySelectorAll('tr');
                let maxValue = -Infinity;
                let maxType = "";

                rows.forEach((tr) => {
                    let tds = tr.querySelectorAll('td');
                    if (tds.length < 2) {
                        return;
                    }

                    let value = parseFloat(tds[0].textContent.trim());
                    let spellsDamageType = tds[1].textContent.trim();

                    if (value > maxValue) {
                        maxValue = value;
                        maxType = jpxUtils.lowerFirst(spellsDamageType);
                    }
                });

                if (
                    (maxType && spellDamageBonus.maxType != maxType) ||
                    (maxValue > 0 && spellDamageBonus.maxValue != maxValue)
                ) {
                    localStorage.setItem(prefix + 'spellDamageBonus' + isekaiSuffix, JSON.stringify({
                        maxType: maxType,
                        maxValue: maxValue,
                    }));
                }
            }
            /*isekai912*/
        }

        return;
    }
}

// Apply dark mode theme based on configuration
function applyDarkMode() {
    const isDarkMode = cfgTheme?.darkMode === true;
    const htmlElement = document.documentElement;

    // JPX-PLUS dark mode (scoped to JPX containers via CSS)
    if (isDarkMode) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.removeAttribute('data-theme');
    }

    console.log(`[JPX-PLUS] 深色模式已${isDarkMode ? '启用' : '禁用'}`);
}

function initEncounterWidget() {
    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');

    // Load cfgTheme and apply dark mode（主题配置全局共享，不区分世界）
    let storedCfgTheme = {};
    try {
        storedCfgTheme = JSON.parse(localStorage.getItem(prefix + 'cfgTheme') || '{}');
    } catch (err) {
        storedCfgTheme = {};
    }
    mergeCfg(storedCfgTheme, defaultCfgTheme, cfgTheme, 'theme');

    // Load cfgStats
    let storedCfgStats = {};
    try {
        storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats' + isekaiSuffix) || '{}');
    } catch (err) {
        storedCfgStats = {};
    }
    mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');

    applyDarkMode();

    // Create encounter widget（样式由全局 #encounter-widget 提供）
    const encounterWidget = document.createElement('div');
    encounterWidget.id = 'encounter-widget';
    encounterWidget.style.cssText = 'top: 150px; left: 100px; z-index: 10000;';

    const header = document.createElement('div');
    header.className = 'enc-header';
    header.textContent = 'JPX-PLUS';
    encounterWidget.appendChild(header);

    const body = document.createElement('div');
    body.className = 'enc-body';
    encounterWidget.appendChild(body);

    const toggleRow = document.createElement('div');
    toggleRow.className = 'enc-row';
    body.appendChild(toggleRow);

    const toggleLabel = document.createElement('div');
    toggleLabel.className = 'enc-label';
    toggleLabel.textContent = '自动遭遇战';
    toggleRow.appendChild(toggleLabel);

    const capsuleSwitch = document.createElement('div');
    capsuleSwitch.className = 'enc-capsule';
    const capsuleSlider = document.createElement('div');
    capsuleSlider.className = 'enc-capsule-slider';
    capsuleSwitch.appendChild(capsuleSlider);

    function updateCapsuleSwitch() {
        capsuleSwitch.classList.toggle('on', !!cfgBattle.autoEncounter);
    }
    updateCapsuleSwitch();

    capsuleSwitch.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        cfgBattle.autoEncounter = !cfgBattle.autoEncounter;
        localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        updateCapsuleSwitch();
        updateEncounterInfo();
    });
    toggleRow.appendChild(capsuleSwitch);

    const encounterInfoDiv = document.createElement('div');
    encounterInfoDiv.className = 'enc-info';
    encounterInfoDiv.title = '点击手动检测遭遇战';
    encounterInfoDiv.addEventListener('click', function() {
        if (encounterState.fetching) return;
        encounterState.idle = false;
        encounterState.needsProbe = false;
        encounterState.fetching = false;
        console.log('[JPX-PLUS] 手动检测遭遇战...');
        fetchEncounterKey();
    });
    body.appendChild(encounterInfoDiv);

    const limitSection = document.createElement('div');
    limitSection.className = 'enc-section';
    body.appendChild(limitSection);

    const limitRow = document.createElement('div');
    limitRow.className = 'enc-row';
    limitSection.appendChild(limitRow);

    const limitLabel = document.createElement('div');
    limitLabel.className = 'enc-label';
    limitLabel.textContent = '每日次数';
    limitRow.appendChild(limitLabel);

    const limitControls = document.createElement('div');
    limitControls.className = 'enc-num-controls';
    limitRow.appendChild(limitControls);

    const decreaseBtn = document.createElement('div');
    decreaseBtn.className = 'enc-btn-num';
    decreaseBtn.textContent = '−';
    decreaseBtn.addEventListener('click', () => {
        if (cfgBattle.encounterDailyLimit > 0) {
            cfgBattle.encounterDailyLimit--;
            updateLimitDisplay();
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        }
    });
    limitControls.appendChild(decreaseBtn);

    const limitDisplay = document.createElement('div');
    limitDisplay.className = 'enc-display';
    limitControls.appendChild(limitDisplay);

    const increaseBtn = document.createElement('div');
    increaseBtn.className = 'enc-btn-num';
    increaseBtn.textContent = '+';
    increaseBtn.addEventListener('click', () => {
        if (cfgBattle.encounterDailyLimit < 24) {
            cfgBattle.encounterDailyLimit++;
            updateLimitDisplay();
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        }
    });
    limitControls.appendChild(increaseBtn);

    function updateLimitDisplay() {
        limitDisplay.textContent = cfgBattle.encounterDailyLimit;
    }
    updateLimitDisplay();

    const arenaSection = document.createElement('div');
    arenaSection.className = 'enc-section';
    body.appendChild(arenaSection);

    const arenaRow = document.createElement('div');
    arenaRow.className = 'enc-row';
    arenaSection.appendChild(arenaRow);

    const arenaLabel = document.createElement('div');
    arenaLabel.className = 'enc-label';
    arenaLabel.textContent = '自动竞技场';
    arenaRow.appendChild(arenaLabel);

    const arenaCapsule = document.createElement('div');
    arenaCapsule.className = 'enc-capsule';
    const arenaSlider = document.createElement('div');
    arenaSlider.className = 'enc-capsule-slider';
    arenaCapsule.appendChild(arenaSlider);

    function updateArenaCapsule() {
        arenaCapsule.classList.toggle('on', !!cfgBattle.autoArena);
    }
    updateArenaCapsule();

    arenaCapsule.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const wasDisabled = !cfgBattle.autoArena;
        cfgBattle.autoArena = !cfgBattle.autoArena;
        localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        updateArenaCapsule();

        if (wasDisabled && cfgBattle.autoArena) {
            const isArenaPage = document.querySelector('#arena_list') !== null;
            if (!isArenaPage) {
                console.log('[JPX-PLUS] 自动竞技场已启用，跳转到竞技场页面...');
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=ar';
                }, 500);
            }
        }
    });
    arenaRow.appendChild(arenaCapsule);

    const arenaInfoDiv = document.createElement('div');
    arenaInfoDiv.className = 'enc-info';
    body.appendChild(arenaInfoDiv);

    const arenaLimitSection = document.createElement('div');
    arenaLimitSection.className = 'enc-section';
    body.appendChild(arenaLimitSection);

    const arenaLimitRow = document.createElement('div');
    arenaLimitRow.className = 'enc-row';
    arenaLimitSection.appendChild(arenaLimitRow);

    const arenaLimitLabel = document.createElement('div');
    arenaLimitLabel.className = 'enc-label';
    arenaLimitLabel.textContent = '竞技场场数';
    arenaLimitRow.appendChild(arenaLimitLabel);

    const arenaLimitControls = document.createElement('div');
    arenaLimitControls.className = 'enc-num-controls';
    arenaLimitRow.appendChild(arenaLimitControls);

    const arenaDecreaseBtn = document.createElement('div');
    arenaDecreaseBtn.className = 'enc-btn-num';
    arenaDecreaseBtn.textContent = '−';
    arenaDecreaseBtn.addEventListener('click', () => {
        if (cfgBattle.arenaDailyLimit > 0) {
            cfgBattle.arenaDailyLimit--;
            updateArenaLimitDisplay();
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        }
    });
    arenaLimitControls.appendChild(arenaDecreaseBtn);

    const arenaLimitDisplay = document.createElement('div');
    arenaLimitDisplay.className = 'enc-display';
    arenaLimitControls.appendChild(arenaLimitDisplay);

    const arenaIncreaseBtn = document.createElement('div');
    arenaIncreaseBtn.className = 'enc-btn-num';
    arenaIncreaseBtn.textContent = '+';
    arenaIncreaseBtn.addEventListener('click', () => {
        let maxLimit = 50;
        try {
            const arenaCache = JSON.parse(localStorage.getItem(prefix + 'arenaStatusCache' + isekaiSuffix) || '{}');
            if (arenaCache.total > 0) maxLimit = arenaCache.total;
        } catch(e) {}
        if (cfgBattle.arenaDailyLimit < maxLimit) {
            cfgBattle.arenaDailyLimit++;
            updateArenaLimitDisplay();
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        }
    });
    arenaLimitControls.appendChild(arenaIncreaseBtn);

    function updateArenaLimitDisplay() {
        arenaLimitDisplay.textContent = cfgBattle.arenaDailyLimit;
    }
    updateArenaLimitDisplay();

    const robSection = document.createElement('div');
    robSection.className = 'enc-section';
    body.appendChild(robSection);

    const robRow = document.createElement('div');
    robRow.className = 'enc-row';
    robSection.appendChild(robRow);

    const robLabel = document.createElement('div');
    robLabel.className = 'enc-label';
    robLabel.textContent = '自动浴血擂台';
    robRow.appendChild(robLabel);

    const robCapsule = document.createElement('div');
    robCapsule.className = 'enc-capsule';
    const robSlider = document.createElement('div');
    robSlider.className = 'enc-capsule-slider';
    robCapsule.appendChild(robSlider);

    function updateRobCapsule() {
        robCapsule.classList.toggle('on', !!cfgBattle.autoRingOfBlood);
    }
    updateRobCapsule();

    robCapsule.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        const wasDisabled = !cfgBattle.autoRingOfBlood;
        cfgBattle.autoRingOfBlood = !cfgBattle.autoRingOfBlood;
        localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        updateRobCapsule();

        if (wasDisabled && cfgBattle.autoRingOfBlood) {
            const isRoBPage = location.search.includes('ss=rb');
            if (!isRoBPage) {
                console.log('[JPX-PLUS] 自动浴血擂台已启用，跳转到浴血擂台页面...');
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=rb';
                }, 500);
            }
        }
    });
    robRow.appendChild(robCapsule);

    const robInfoDiv = document.createElement('div');
    robInfoDiv.className = 'enc-info';
    body.appendChild(robInfoDiv);

    const settingsSection = document.createElement('div');
    settingsSection.className = 'enc-section';
    body.appendChild(settingsSection);

    const settingsBtn = document.createElement('div');
    settingsBtn.className = 'enc-settings-btn';
    settingsBtn.textContent = '配置菜单';
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderSettings();
    });
    settingsSection.appendChild(settingsBtn);

    document.body.appendChild(encounterWidget);

    // Bring to front function
    if (!window.jpxWidgetZIndex) window.jpxWidgetZIndex = 10000;
    const bringToFront = () => {
        window.jpxWidgetZIndex++;
        encounterWidget.style.zIndex = window.jpxWidgetZIndex;
    };
    // Apply on any interaction with the widget
    encounterWidget.addEventListener('pointerdown', bringToFront);
    encounterWidget.addEventListener('mousedown', bringToFront);
    encounterWidget.addEventListener('click', bringToFront);

    // Drag functionality
    let isDragging = false;
    let dragOffsetX = 0, dragOffsetY = 0;
    header.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        bringToFront(); // Bring to front when starting drag
        isDragging = true;
        dragOffsetX = e.clientX - encounterWidget.getBoundingClientRect().left;
        dragOffsetY = e.clientY - encounterWidget.getBoundingClientRect().top;
        header.setPointerCapture(e.pointerId);
        e.preventDefault();
    });
    header.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        let newLeft = e.clientX - dragOffsetX;
        let newTop = e.clientY - dragOffsetY;
        newLeft = Math.max(0, Math.min(window.innerWidth - encounterWidget.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - 30, newTop));
        encounterWidget.style.left = newLeft + 'px';
        encounterWidget.style.top = newTop + 'px';
    });
    header.addEventListener('pointerup', (e) => {
        if (!isDragging) return;
        isDragging = false;
        header.releasePointerCapture(e.pointerId);
        try {
            localStorage.setItem(prefix + 'encounterWidgetPos', JSON.stringify({
                left: encounterWidget.style.left,
                top: encounterWidget.style.top
            }));
        } catch(e) {}
    });

    // Restore position
    try {
        const saved = JSON.parse(localStorage.getItem(prefix + 'encounterWidgetPos'));
        if (saved && saved.left && saved.top) {
            encounterWidget.style.left = saved.left;
            encounterWidget.style.top = saved.top;
        }
    } catch(e) {}

    // ========== Independent Encounter Detection System ==========
    // Flow: Dawn (first page load after UTC 00:00) → 30min → fetch KEY → KEY valid 30min → auto engage → 30min CD → repeat
    // KEY has 30-min validity from fetch time. If not used within 30 min → 已错失 (missed)
    // Detection starts at dawn, stops when count >= limit or autoEncounter off
    let encounterState = {
        date: '',               // YYYY-MM-DD UTC - for daily reset
        key: '',                // encounter KEY from news.php #eventpane
        count: 0,               // encounters completed today (successful battles)
        keyCount: 0,            // encounter keys discovered today (= slots consumed, regardless of battle outcome)
        lastEncounterTime: 0,   // timestamp when encounter was triggered (entered battle URL)
        keyFetchTime: 0,        // timestamp when KEY was fetched — KEY valid for 30 min from this
        dawnTime: 0,            // timestamp when dawn was triggered (first page load after UTC 00:00)
        fetching: false,        // whether currently fetching news.php
        lastFetchTime: 0,       // timestamp of last news.php fetch
        emptyFetchCount: 0,     // consecutive empty fetches (no key found) — for progressive backoff
        engageScheduled: false, // prevent multiple engage triggers
        idle: false             // true when probe found nothing — waiting for dawn or manual click
    };

    function loadEncounterState() {
        try {
            const saved = JSON.parse(localStorage.getItem(prefix + 'encounterState') || '{}');
            const today = new Date().toISOString().split('T')[0];
            if (saved.date === today) {
                // Same UTC day — restore state
                encounterState.date = saved.date;
                encounterState.key = saved.key || '';
                encounterState.count = saved.count || 0;
                encounterState.keyCount = saved.keyCount || 0;
                encounterState.lastEncounterTime = saved.lastEncounterTime || 0;
                encounterState.keyFetchTime = saved.keyFetchTime || 0;
                encounterState.dawnTime = saved.dawnTime || 0;
                encounterState.emptyFetchCount = saved.emptyFetchCount || 0;
                encounterState.idle = saved.idle || false;
            } else if (saved.date && saved.date !== today) {
                // Saved date exists but differs from today — UTC day actually changed = DAWN
                encounterState.date = today;
                encounterState.key = '';
                encounterState.count = 0;
                encounterState.keyCount = 0;
                encounterState.lastEncounterTime = 0;
                encounterState.keyFetchTime = 0;
                encounterState.dawnTime = Date.now();
                encounterState.emptyFetchCount = 0;
                encounterState.idle = false;
                saveEncounterState();
                console.log('[JPX-PLUS] 黎明已触发！30分钟后第一次遭遇战');
            } else {
                // No saved state (first time) — we don't know if dawn happened or encounters were done
                // Do a probe fetch to detect actual state
                encounterState.date = today;
                encounterState.dawnTime = 1; // Truthy but far in the past → cooldown already 0
                encounterState.needsProbe = true; // Flag for initial probe
                saveEncounterState();
                console.log('[JPX-PLUS] 遭遇战系统初始化，正在检测当前状态...');
            }
        } catch(e) {
            console.log('[JPX-PLUS] Error loading encounter state:', e);
        }
    }

    function saveEncounterState() {
        try {
            localStorage.setItem(prefix + 'encounterState', JSON.stringify({
                date: encounterState.date,
                key: encounterState.key,
                count: encounterState.count,
                keyCount: encounterState.keyCount,
                lastEncounterTime: encounterState.lastEncounterTime,
                keyFetchTime: encounterState.keyFetchTime,
                dawnTime: encounterState.dawnTime,
                emptyFetchCount: encounterState.emptyFetchCount,
                idle: encounterState.idle
            }));
        } catch(e) {}
    }

    // Get backoff interval for empty fetches (progressive: 30s → 1min → 2min → 5min → 10min → 30min → stop)
    // Returns Infinity when should go idle
    function getEmptyFetchBackoff() {
        const n = encounterState.emptyFetchCount;
        if (n <= 0) return 30000;       // 30s
        if (n === 1) return 60000;       // 1min
        if (n === 2) return 120000;      // 2min
        if (n === 3) return 300000;      // 5min
        if (n === 4) return 600000;      // 10min
        if (n === 5) return 1800000;     // 30min
        return Infinity;                 // stop — go idle
    }

    // Get the reference time for cooldown calculation
    // No encounters yet: cooldown from dawn (first encounter waits 30 min after dawn)
    // After first encounter: cooldown from last encounter/key-expire time
    function getCooldownRefTime() {
        if (encounterState.lastEncounterTime > 0) {
            return encounterState.lastEncounterTime;
        }
        return encounterState.dawnTime || 0;
    }

    // Get remaining cooldown in ms (0 if cooldown has passed)
    function getCooldownRemaining() {
        const refTime = getCooldownRefTime();
        if (!refTime) return 0;
        const elapsed = Date.now() - refTime;
        return Math.max(0, 1800000 - elapsed); // 30 minutes
    }

    // Fetch encounter key from e-hentai.org/news.php via GM_xmlhttpRequest
    function fetchEncounterKey(callback) {
        if (encounterState.fetching) return;
        encounterState.fetching = true;
        encounterState.lastFetchTime = Date.now();

        console.log('[JPX-PLUS] 正在从 news.php 获取遭遇战信息...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://e-hentai.org/news.php',
            timeout: 15000,
            onload: function(response) {
                encounterState.fetching = false;
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    const eventpane = doc.querySelector('#eventpane');

                    if (!eventpane) {
                        console.log('[JPX-PLUS] news.php 中未找到 #eventpane');
                        if (encounterState.needsProbe) {
                            // Probe completed: no eventpane → no active encounter, go idle
                            encounterState.needsProbe = false;
                            encounterState.idle = true;
                            saveEncounterState();
                            console.log('[JPX-PLUS] 探测完成: 未发现遭遇战，待机至黎明');
                        }
                        if (callback) callback(false);
                        return;
                    }

                    const html = eventpane.innerHTML;

                    // Check for dawn event from server
                    if (html.includes('It is the dawn of a new day')) {
                        console.log('[JPX-PLUS] 服务器确认: 新的一天 (Dawn)');
                        const today = new Date().toISOString().split('T')[0];
                        if (encounterState.date !== today) {
                            encounterState.date = today;
                            encounterState.count = 0;
                            encounterState.keyCount = 0;
                            encounterState.lastEncounterTime = 0;
                            encounterState.dawnTime = Date.now();
                            encounterState.emptyFetchCount = 0;
                            saveEncounterState();
                        }
                    }

                    // Extract encounter key from eventpane
                    const keyMatch = html.match(/encounter=([A-Za-z0-9=]+)/);
                    if (keyMatch) {
                        const newKey = keyMatch[1];
                        if (newKey !== encounterState.key) {
                            encounterState.keyCount = (encounterState.keyCount || 0) + 1;
                            console.log('[JPX-PLUS] 获取到遭遇战KEY:', newKey.substring(0, 8) + '... (今日第' + encounterState.keyCount + '个)');
                            encounterState.key = newKey;
                            encounterState.keyFetchTime = Date.now(); // KEY 30分钟有效期从此刻开始
                            encounterState.engageScheduled = false;
                            encounterState.needsProbe = false;
                            encounterState.emptyFetchCount = 0; // 找到KEY，重置空fetch计数
                            saveEncounterState();
                        }
                        if (callback) callback(true);
                    } else {
                        // No KEY found in news.php
                        if (encounterState.needsProbe) {
                            // Probe mode: no KEY found → no active encounter, go idle
                            console.log('[JPX-PLUS] 探测: 未发现遭遇战KEY，待机至黎明');
                            encounterState.idle = true;
                            encounterState.needsProbe = false;
                        } else {
                            encounterState.emptyFetchCount = (encounterState.emptyFetchCount || 0) + 1;
                            const backoff = getEmptyFetchBackoff();
                            if (backoff === Infinity) {
                                // Backoff exhausted → go idle until dawn
                                encounterState.idle = true;
                                console.log('[JPX-PLUS] 连续' + encounterState.emptyFetchCount + '次未发现遭遇战KEY，待机至黎明');
                            } else {
                                const nextInterval = Math.round(backoff / 1000);
                                console.log('[JPX-PLUS] news.php 中未找到遭遇战KEY (连续空' + encounterState.emptyFetchCount + '次，下次间隔' + nextInterval + '秒)');
                            }
                        }
                        encounterState.key = '';
                        saveEncounterState();
                        if (callback) callback(false);
                    }
                } catch(e) {
                    console.log('[JPX-PLUS] Error parsing news.php:', e);
                    if (callback) callback(false);
                }
            },
            onerror: function(e) {
                encounterState.fetching = false;
                console.log('[JPX-PLUS] Error fetching news.php:', e);
                if (callback) callback(false);
            },
            ontimeout: function() {
                encounterState.fetching = false;
                console.log('[JPX-PLUS] 获取 news.php 超时');
                if (callback) callback(false);
            }
        });
    }

    // Navigate to encounter battle URL
    function engageEncounter() {
        if (!encounterState.key) return;

        console.log('[JPX-PLUS] 自动进入遭遇战...');
        localStorage.setItem(prefix + 'isAutoEncounter', 'true');

        // 保存key用于URL，然后更新状态
        const usedKey = encounterState.key;

        // 30分钟倒计时从进入遭遇战时开始
        encounterState.lastEncounterTime = Date.now();
        encounterState.key = ''; // Key consumed
        encounterState.keyFetchTime = 0;
        encounterState.engageScheduled = false;
        saveEncounterState();

        const baseUrl = location.origin + '/';
        const encounterUrl = baseUrl + '?s=Battle&ss=ba&encounter=' + usedKey + '&date=' + Date.now();
        window.location.href = encounterUrl;
    }

    // Check if current KEY has expired (30 min from fetch time)
    function isKeyExpired() {
        if (!encounterState.key || !encounterState.keyFetchTime) return false;
        return (Date.now() - encounterState.keyFetchTime) >= 1800000;
    }

    // Check if encounter detection should happen
    // Only fetches when: autoEncounter ON + cooldown passed + count < limit
    function periodicEncounterCheck() {
        // Must have auto-encounter enabled
        if (!cfgBattle.autoEncounter) return;

        // Must not have reached daily limit — check keyCount (slots consumed) not just successful battles
        if ((encounterState.keyCount || 0) >= cfgBattle.encounterDailyLimit) return;

        // If idle (probe found nothing), don't auto-fetch — wait for dawn or manual click
        if (encounterState.idle) return;

        // Don't run encounter logic on ANY battle page (active or finished)
        // Encounter completion is handled separately by the battle completion handler (battleType === 'Encounter')
        // Running here on non-encounter finishbattle would incorrectly trigger key expiry → new 30-min cooldown
        if (document.querySelector('#battle_top')) return;

        // Check if current KEY has expired (30 min validity from fetch time)
        if (encounterState.key && isKeyExpired()) {
            console.log('[JPX-PLUS] 遭遇战KEY已过期（30分钟未使用），已错失 (今日slot: ' + encounterState.keyCount + ')');
            // Key过期 = 该slot已消耗，重启30分钟冷却，避免立即重复请求
            encounterState.lastEncounterTime = Date.now();
            encounterState.key = '';
            encounterState.keyFetchTime = 0;
            saveEncounterState();
            return; // Show 已错失 for one cycle
        }

        // Must not already have a key or be fetching
        if (encounterState.key || encounterState.fetching) return;

        // Don't fetch on encounter battle pages
        if (location.search.includes('encounter=')) return;

        // Cooldown must have passed (30 min from dawn or last encounter)
        if (getCooldownRemaining() > 0) return;

        // Rate limit: progressive backoff on consecutive empty fetches (30s → 1min → 2min → 5min → 10min)
        const now = Date.now();
        const fetchInterval = getEmptyFetchBackoff();
        if (now - encounterState.lastFetchTime < fetchInterval) return;

        fetchEncounterKey();
    }

    // Update info function (called every second)
    function updateEncounterInfo() {
        updateArenaInfo();
        updateRoBInfo();
        periodicEncounterCheck();
        updateEncounterStatus();
    }

    // Update Ring of Blood status info
    function updateRoBInfo() {
        const isRoBPage = location.search.includes('ss=rb');
        if (isRoBPage) {
            const arenaTable = document.querySelector('#arena_list');
            if (arenaTable) {
                const allRows = arenaTable.querySelectorAll('tr');
                const totalChallenges = allRows.length - 1;
                let availableCount = 0;
                let selectedAvailable = 0;
                let cooldownCount = 0;
                let tokenInsufCount = 0;
                const selectedList = cfgBattle.ringOfBloodChallenges || [];

                for (let i = 1; i < allRows.length; i++) {
                    const row = allRows[i];
                    const startImg = row.querySelector('img[src$="/arena/startchallenge.png"][onclick]');
                    const disabledImg = row.querySelector('img[src$="/arena/startchallenge_d.png"]');
                    if (startImg) {
                        availableCount++;
                        const pageName = row.querySelector('.fc4')?.textContent?.trim() || '';
                        const canonicalName = ROB_CHALLENGE_CN_REV[pageName] || pageName;
                        if (selectedList.length === 0 || selectedList.includes(canonicalName)) {
                            selectedAvailable++;
                        }
                    } else if (disabledImg) {
                        const rowText = row.textContent || '';
                        if (/cooldown|冷却中/i.test(rowText)) {
                            cooldownCount++;
                        } else {
                            tokenInsufCount++;
                        }
                    }
                }

                try {
                    localStorage.setItem(prefix + 'robStatusCache' + isekaiSuffix, JSON.stringify({
                        total: totalChallenges,
                        available: availableCount,
                        selectedAvailable: selectedAvailable,
                        cooldown: cooldownCount,
                        tokenInsufficient: tokenInsufCount,
                        timestamp: Date.now()
                    }));
                } catch(e) {}

                const statusParts = [];
                if (selectedAvailable > 0) statusParts.push(`${selectedAvailable}可挑战`);
                if (cooldownCount > 0) statusParts.push(`${cooldownCount}冷却`);
                if (tokenInsufCount > 0) statusParts.push(`${tokenInsufCount}令牌不足`);
                const statusText = statusParts.join(' | ');

                if (selectedAvailable > 0) {
                    robInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 浴血擂台</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${statusText}</span>`;
                } else {
                    robInfoDiv.innerHTML = `<span style="color: #ff9800; font-weight: bold;">• 全部不可用</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${statusText}</span>`;
                }
            }
        } else {
            const isAutoRoB = localStorage.getItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix) === 'true';

            let cached = null;
            try {
                cached = JSON.parse(localStorage.getItem(prefix + 'robStatusCache' + isekaiSuffix) || '{}');
            } catch(e) {
                cached = null;
            }

            if (isAutoRoB && typeof battleType !== 'undefined' && battleType === 'Colosseum') {
                robInfoDiv.innerHTML = `<span style="color: #2196F3; font-weight: bold;">⚔ 浴血擂台战斗中...</span>`;
            } else {
                if (cached && cached.total && cached.timestamp) {
                    if (cached.selectedAvailable > 0) {
                        robInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 浴血擂台</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${cached.selectedAvailable}可挑战 | ${cached.cooldown}冷却中</span>`;
                    } else {
                        robInfoDiv.innerHTML = `<span style="color: #ff9800; font-weight: bold;">• 全部冷却中</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${cached.cooldown}/${cached.total}</span>`;
                    }
                } else {
                    robInfoDiv.innerHTML = '<span style="color: var(--jpx-text-muted);">浴血擂台: 未访问</span>';
                }
            }
        }
    }

    // Update arena status info
    function updateArenaInfo() {
        // Only detect arena table on the actual arena page (ss=ar), not on other battle pages like Ring of Blood (ss=rb)
        const isArenaPage = location.search.includes('ss=ar');
        const arenaTable = isArenaPage ? document.querySelector('#arena_list') : null;
        if (arenaTable) {
            const allRows = arenaTable.querySelectorAll('tr');
            const totalChallenges = allRows.length - 1; // Exclude header row
            const availableChallenges = arenaTable.querySelectorAll('img[src$="/arena/startchallenge.png"][onclick]').length;

            // Calculate completed today (using UTC to match game server time)
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
            const lastArenaDate = localStorage.getItem(prefix + 'lastArenaDate' + isekaiSuffix);
            const initialAvailable = parseInt(localStorage.getItem(prefix + 'arenaInitialAvailable' + isekaiSuffix)) || totalChallenges;

            let completedToday = 0;
            if (lastArenaDate === today) {
                completedToday = Math.max(0, initialAvailable - availableChallenges);
            }

            const limitReached = completedToday >= cfgBattle.arenaDailyLimit;
            const remaining = availableChallenges; // 未完成的数量 = 可用的挑战数（有onclick的）

            // Cache arena status for other pages
            try {
                localStorage.setItem(prefix + 'arenaStatusCache' + isekaiSuffix, JSON.stringify({
                    total: totalChallenges,
                    completedToday: completedToday,
                    remaining: remaining,
                    limitReached: limitReached,
                    timestamp: Date.now()
                }));
            } catch(e) {}

            if (limitReached) {
                arenaInfoDiv.innerHTML = `<span style="color: #ff9800; font-weight: bold;">• 竞技场已达上限</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${completedToday}/${cfgBattle.arenaDailyLimit}</span>`;
            } else {
                arenaInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 竞技场</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${completedToday}/${cfgBattle.arenaDailyLimit} | ${remaining}未完成</span>`;
            }
        } else {
            // Not on arena page - check if in arena battle or use cached data
            const isAutoArena = localStorage.getItem(prefix + 'isAutoArena' + isekaiSuffix) === 'true';

            // Try to load cached status
            let cached = null;
            try {
                cached = JSON.parse(localStorage.getItem(prefix + 'arenaStatusCache' + isekaiSuffix) || '{}');
            } catch(e) {
                cached = null;
            }

            if (isAutoArena && typeof battleType !== 'undefined' && battleType === 'Arena') {
                // Currently in arena battle - show battle status with progress
                if (cached && cached.total && cached.timestamp) {
                    arenaInfoDiv.innerHTML = `<span style="color: #2196F3; font-weight: bold;">⚔ 战斗中</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${cached.completedToday}/${cfgBattle.arenaDailyLimit} | ${cached.remaining}未完成</span>`;
                } else {
                    arenaInfoDiv.innerHTML = `<span style="color: #2196F3; font-weight: bold;">⚔ 竞技场战斗中...</span>`;
                }
            } else {
                // Use cached data for other pages
                if (cached && cached.total && cached.timestamp) {
                    if (cached.limitReached) {
                        arenaInfoDiv.innerHTML = `<span style="color: #ff9800; font-weight: bold;">• 竞技场已达上限</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${cached.completedToday}/${cfgBattle.arenaDailyLimit}</span>`;
                    } else {
                        arenaInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 竞技场</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${cached.completedToday}/${cfgBattle.arenaDailyLimit} | ${cached.remaining}未完成</span>`;
                    }
                } else {
                    arenaInfoDiv.innerHTML = '<span style="color: var(--jpx-text-muted);">竞技场: 未访问</span>';
                }
            }
        }
    }

    // Update encounter status display — independent, no HV Utils dependency
    function updateEncounterStatus() {
        const today = new Date().toISOString().split('T')[0];
        const limit = cfgBattle.encounterDailyLimit;

        // Check for UTC day change in real-time (dawn trigger)
        if (encounterState.date && encounterState.date !== today) {
            encounterState.date = today;
            encounterState.count = 0;
            encounterState.keyCount = 0;
            encounterState.lastEncounterTime = 0;
            encounterState.keyFetchTime = 0;
            encounterState.dawnTime = Date.now();
            encounterState.key = '';
            encounterState.engageScheduled = false;
            encounterState.emptyFetchCount = 0;
            encounterState.idle = false;
            saveEncounterState();
            console.log('[JPX-PLUS] 实时检测: 黎明已触发');
        }

        const count = encounterState.count;
        const keyCount = encounterState.keyCount || 0;
        const limitReached = keyCount >= limit;
        const missCount = keyCount - count;
        // Display helper: "count/limit" or "count/limit (N错失)" when there are misses
        function countDisplay() {
            let s = `${count}/${limit}`;
            if (missCount > 0) s += ` <span style="color: #ff9800;">(${missCount}错失)</span>`;
            return s;
        }

        // State 1: Daily limit reached — all detection stopped
        if (limitReached) {
            encounterInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 已完成</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            return;
        }

        // State 1.5: Idle — probe found nothing, or autoDawn completed
        if (encounterState.idle) {
            if (cfgBattle.autoDawn) {
                // Auto dawn mode completed — show next UTC midnight countdown
                const now = new Date();
                const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
                const remaining = nextMidnight - now;
                const h = Math.floor(remaining / 3600000);
                const m = Math.floor((remaining % 3600000) / 60000);
                const s = Math.floor((remaining % 60000) / 1000);
                encounterInfoDiv.innerHTML = `<span style="color: #4CAF50;">☀ 已签到</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}</span>`;
            } else {
                encounterInfoDiv.innerHTML = `<span style="color: var(--jpx-text-muted);">未发现遭遇战</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            }
            return;
        }

        // State 2: Currently in encounter battle
        if (location.search.includes('encounter=')) {
            encounterInfoDiv.innerHTML = `<span style="color: #2196F3; font-weight: bold;">⚔ 遭遇战进行中</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            return;
        }

        // State 3: Encounter key available — show validity countdown
        if (encounterState.key) {
            // Check for KEY expiry
            if (isKeyExpired()) {
                encounterInfoDiv.innerHTML = `<span style="color: #f44336; font-weight: bold;">✗ 已错失</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
                return;
            }

            // Show remaining KEY validity time
            const keyRemaining = Math.max(0, 1800000 - (Date.now() - encounterState.keyFetchTime));
            const keyMin = Math.floor(keyRemaining / 60000);
            const keySec = Math.floor((keyRemaining % 60000) / 1000);
            const keyTimeStr = `${keyMin.toString().padStart(2, '0')}:${keySec.toString().padStart(2, '0')}`;

            encounterInfoDiv.innerHTML = `<span style="color: #4CAF50; font-weight: bold;">✓ 遭遇战</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${keyTimeStr}</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;

            // Auto Dawn mode: skip battle, discard key, go idle
            if (cfgBattle.autoEncounter && cfgBattle.autoDawn) {
                console.log('[JPX-PLUS] 自动黎明模式: 签到完成，丢弃遭遇战KEY，待机至明日');
                encounterState.key = '';
                encounterState.keyFetchTime = 0;
                encounterState.idle = true;
                saveEncounterState();
                return;
            }

            // Auto-engage if enabled
            if (cfgBattle.autoEncounter && !encounterState.engageScheduled) {
                // Don't engage during active battle (auto or manual)
                const inBattle = typeof isActiveBattle !== 'undefined' && isActiveBattle;
                // Don't engage on active battle pages (no finishbattle yet)
                const onBattlePage = !!document.querySelector('#battle_top') && !document.querySelector('img[src$="finishbattle.png"]');
                // Don't engage on non-encounter finishbattle pages (let user see IW/Arena results)
                const onNonEncounterFinish = !!document.querySelector('#battle_top') && battleType && battleType !== 'Encounter';
                // Don't engage during arena flow
                const inArenaFlow = localStorage.getItem(prefix + 'isAutoArena' + isekaiSuffix) === 'true';
                // Don't engage during Ring of Blood flow
                const inRoBFlow = localStorage.getItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix) === 'true';

                // Check if we should wait for arena completion
                let shouldWaitForArena = false;
                if (cfgBattle.autoArena) {
                    try {
                        const arenaCache = JSON.parse(localStorage.getItem(prefix + 'arenaStatusCache' + isekaiSuffix) || '{}');
                        if (arenaCache.remaining > 0 && !arenaCache.limitReached) {
                            shouldWaitForArena = true;
                        }
                    } catch(e) {}
                }

                // Check if we should wait for Ring of Blood
                let shouldWaitForRoB = false;
                if (cfgBattle.autoRingOfBlood) {
                    try {
                        const robCache = JSON.parse(localStorage.getItem(prefix + 'robStatusCache' + isekaiSuffix) || '{}');
                        if (robCache.selectedAvailable > 0) {
                            shouldWaitForRoB = true;
                        }
                    } catch(e) {}
                }

                if (inBattle || onBattlePage || onNonEncounterFinish || inArenaFlow || inRoBFlow || shouldWaitForArena || shouldWaitForRoB) {
                    // Don't engage — battle or arena in progress
                } else {
                    encounterState.engageScheduled = true;
                    setTimeout(() => {
                        engageEncounter();
                    }, Math.random() * 2000 + 500);
                }
            }
            return;
        }

        // State 4: No dawn yet today — waiting for UTC 00:00
        if (!encounterState.dawnTime) {
            encounterInfoDiv.innerHTML = `<span style="color: var(--jpx-text-muted);">等待黎明...</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            return;
        }

        // State 5: In cooldown — show countdown timer
        const cooldownRemaining = getCooldownRemaining();
        if (cooldownRemaining > 0) {
            const minutes = Math.floor(cooldownRemaining / 60000);
            const seconds = Math.floor((cooldownRemaining % 60000) / 1000);
            const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (keyCount === 0) {
                // First encounter — waiting after dawn
                encounterInfoDiv.innerHTML = `<span style="color: #9C27B0;">☀ 黎明</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="font-weight: bold;">${timeStr}</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            } else {
                // Subsequent encounter — cooldown after last battle/expire
                encounterInfoDiv.innerHTML = `<span style="color: var(--jpx-text-muted);">倒计时</span> <span style="font-weight: bold;">${timeStr}</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            }
            return;
        }

        // State 5: Cooldown passed — detection active / probing
        if (encounterState.fetching || encounterState.needsProbe) {
            encounterInfoDiv.innerHTML = `<span style="color: #2196F3;">⏳ 检测中...</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            return;
        }

        // State 6: Cooldown passed, auto off — show ready status
        if (!cfgBattle.autoEncounter) {
            encounterInfoDiv.innerHTML = `<span style="color: var(--jpx-text-muted);">遭遇战</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
            return;
        }

        // State 7: Cooldown passed, auto on, waiting for next fetch cycle
        encounterInfoDiv.innerHTML = `<span style="color: var(--jpx-text-muted);">⏳ 等待遭遇战...</span> <span style="color: var(--jpx-text-muted);">·</span> <span style="color: var(--jpx-text-muted);">${countDisplay()}</span>`;
    }

    // Check for auto battle start after entering encounter
    if (localStorage.getItem(prefix + 'encounterAutoStart') === 'true') {
        localStorage.removeItem(prefix + 'encounterAutoStart');
        // We're in a battle page, auto-enable battle
        setTimeout(() => {
            if (!isActiveBattle) {
                toggleActive();
            }
        }, 500);
    }

    // Initialize encounter state and start periodic updates
    loadEncounterState();

    // Detect encounter page on load — works for ANY entry point (auto, HV Utils, manual click, etc.)
    if (location.search.includes('encounter=')) {
        const urlKeyMatch = location.search.match(/encounter=([A-Za-z0-9=]+)/);
        if (urlKeyMatch) {
            const urlKey = urlKeyMatch[1];
            const today = new Date().toISOString().split('T')[0];
            // Only update if this is a new encounter (key differs from what we already consumed)
            if (encounterState.key === urlKey || encounterState.key === '') {
                // Set entry time for cooldown (30 min starts from entering encounter)
                if (!encounterState.lastEncounterTime || encounterState.lastEncounterTime < Date.now() - 60000) {
                    encounterState.date = today;
                    encounterState.lastEncounterTime = Date.now();
                    encounterState.key = '';
                    encounterState.keyFetchTime = 0;
                    encounterState.engageScheduled = false;
                    encounterState.idle = false;
                    if (!encounterState.dawnTime) encounterState.dawnTime = Date.now();
                    saveEncounterState();
                    console.log('[JPX-PLUS] 检测到遭遇战页面（入口不限），已记录进入时间');
                }
            }
        }
    }

    updateEncounterInfo();
    setInterval(updateEncounterInfo, 1000);

    // First-time probe: fetch news.php once to detect actual encounter state
    // This runs regardless of autoEncounter setting
    if (encounterState.needsProbe && !location.search.includes('encounter=')) {
        setTimeout(() => {
            console.log('[JPX-PLUS] 执行首次探测 fetch...');
            fetchEncounterKey();
        }, 1500);
    }

    // Auto-refresh at UTC midnight if auto modes are enabled
    let lastUtcDate = '';
    setInterval(() => {
        const now = new Date();
        const currentUtcDate = now.toISOString().split('T')[0];

        // Check if we've crossed into a new UTC day
        if (lastUtcDate && lastUtcDate !== currentUtcDate) {
            // New UTC day detected
            const isAutoMode = cfgBattle.autoEncounter || cfgBattle.autoArena || cfgBattle.autoDawn;
            if (isAutoMode) {
                console.log('[JPX-PLUS] 检测到UTC新的一天');

                // Priority: Arena first, then encounter/dawn
                if (cfgBattle.autoArena) {
                    console.log('[JPX-PLUS] 优先跳转到竞技场页面...');
                    setTimeout(() => {
                        window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=ar';
                    }, Math.random() * 3000 + 1000);
                } else {
                    console.log('[JPX-PLUS] 自动刷新页面以继续任务...');
                    setTimeout(() => {
                        location.reload();
                    }, Math.random() * 3000 + 1000);
                }
            }
        }
        lastUtcDate = currentUtcDate;
    }, 30000); // Check every 30 seconds
}

// Auto Arena: Automatically complete all available arena challenges
// Returns the URL path prefix for arena/RoB navigation
// Uses isekai path when currently on isekai page OR when isekaiMode config is enabled
function getIsekaiPrefix() {
    return (isekaiSuffix || cfgBattle.isekaiMode) ? '/isekai/' : '/';
}

function initAutoArena() {
    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');

    // Get arena status from page
    function getArenaStatus() {
        const arenaTable = document.querySelector('#arena_list');
        if (!arenaTable) return null;

        const allRows = arenaTable.querySelectorAll('tr');
        const totalChallenges = allRows.length - 1; // Exclude header row
        const availableChallenges = arenaTable.querySelectorAll('img[src$="/arena/startchallenge.png"][onclick]').length;

        return {
            total: totalChallenges,
            available: availableChallenges,
            completed: totalChallenges - availableChallenges
        };
    }

    // Check and reset daily arena tracking (using UTC to match game server time)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    const lastArenaDate = localStorage.getItem(prefix + 'lastArenaDate' + isekaiSuffix);

    if (lastArenaDate !== today) {
        // New day detected
        const status = getArenaStatus();
        if (status) {
            // Record initial available count for today
            localStorage.setItem(prefix + 'arenaInitialAvailable' + isekaiSuffix, status.available.toString());
            localStorage.setItem(prefix + 'lastArenaDate' + isekaiSuffix, today);
            console.log(`[JPX-PLUS] 新的一天，竞技场状态: ${status.available}/${status.total} 可用`);
        }
    }

    // Check if we should auto-return and continue from battle finish
    if (localStorage.getItem(prefix + 'isAutoArena' + isekaiSuffix) === 'true') {
        localStorage.removeItem(prefix + 'isAutoArena' + isekaiSuffix);
        console.log('[JPX-PLUS] 竞技场战斗完成，返回续战');
        // Delay a bit then try next challenge
        setTimeout(() => {
            tryStartNextArena();
        }, 2000);
        return; // Exit early to prevent manual page load from auto-starting
    }

    function tryStartNextArena() {
        if (!cfgBattle.autoArena) {
            console.log('[JPX-PLUS] 自动竞技场已关闭');
            return;
        }

        const status = getArenaStatus();
        if (!status) {
            console.log('[JPX-PLUS] 未找到竞技场列表');
            return;
        }

        // Calculate how many challenges completed today
        const initialAvailable = parseInt(localStorage.getItem(prefix + 'arenaInitialAvailable' + isekaiSuffix)) || status.total;
        const completedToday = initialAvailable - status.available;

        // Check if reached daily limit
        if (completedToday >= cfgBattle.arenaDailyLimit) {
            console.log(`[JPX-PLUS] 已达每日竞技场限制: ${completedToday}/${cfgBattle.arenaDailyLimit}，待机中`);
            // Priority: Ring of Blood > Encounter
            if (cfgBattle.autoRingOfBlood) {
                console.log('[JPX-PLUS] 竞技场完成，自动跳转浴血擂台...');
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=rb';
                }, Math.random() * 2000 + 1000);
            } else if (cfgBattle.autoEncounter) {
                console.log('[JPX-PLUS] 竞技场完成，自动跳转主页开始遭遇战...');
                setTimeout(() => {
                    window.location.href = location.origin + '/';
                }, Math.random() * 2000 + 1000);
            }
            return;
        }

        // Check if there are available challenges
        if (status.available === 0) {
            console.log('[JPX-PLUS] 没有可用的竞技场挑战，全部完成或冷却中，待机中');
            // Priority: Ring of Blood > Encounter
            if (cfgBattle.autoRingOfBlood) {
                console.log('[JPX-PLUS] 竞技场完成，自动跳转浴血擂台...');
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=rb';
                }, Math.random() * 2000 + 1000);
            } else if (cfgBattle.autoEncounter) {
                console.log('[JPX-PLUS] 竞技场完成，自动跳转主页开始遭遇战...');
                setTimeout(() => {
                    window.location.href = location.origin + '/';
                }, Math.random() * 2000 + 1000);
            }
            return;
        }

        // Find all arena challenge buttons
        const arenaTable = document.querySelector('#arena_list');
        if (!arenaTable) {
            console.log('[JPX-PLUS] 未找到竞技场列表');
            return;
        }

        // Find first available (not on cooldown) challenge
        const allRows = arenaTable.querySelectorAll('tr');
        for (let row of allRows) {
            const startImg = row.querySelector('img[src$="/arena/startchallenge.png"]');
            if (startImg && startImg.onclick) {
                const challengeName = row.querySelector('.fc4')?.textContent?.trim() || 'Unknown';
                console.log(`[JPX-PLUS] 开始竞技场挑战 (${completedToday + 1}/${cfgBattle.arenaDailyLimit}): ${challengeName}`);

                // Set flag for auto-return
                localStorage.setItem(prefix + 'isAutoArena' + isekaiSuffix, 'true');

                // Click the challenge
                setTimeout(() => {
                    startImg.click();
                }, Math.random() * 1000 + 500);
                return;
            }
        }

        console.log('[JPX-PLUS] 没有可用的竞技场挑战，待机中');
        // Priority: Ring of Blood > Encounter
        if (cfgBattle.autoRingOfBlood) {
            console.log('[JPX-PLUS] 竞技场完成，自动跳转浴血擂台...');
            setTimeout(() => {
                window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=rb';
            }, Math.random() * 2000 + 1000);
        } else if (cfgBattle.autoEncounter) {
            console.log('[JPX-PLUS] 竞技场完成，自动跳转主页开始遭遇战...');
            setTimeout(() => {
                window.location.href = location.origin + '/';
            }, Math.random() * 2000 + 1000);
        }
    }

    // Auto-start first challenge if auto-arena is enabled
    if (cfgBattle.autoArena) {
        console.log('[JPX-PLUS] 竞技场页面已加载，检测到自动竞技场已启用，开始自动挑战...');
        setTimeout(() => {
            tryStartNextArena();
        }, 1000);
    } else {
        console.log('[JPX-PLUS] 竞技场页面已加载，等待手动操作');
    }

    // Auto-refresh at UTC midnight if auto arena is enabled
    let lastUtcDate = '';
    setInterval(() => {
        const now = new Date();
        const currentUtcDate = now.toISOString().split('T')[0];

        // Check if we've crossed into a new UTC day
        if (lastUtcDate && lastUtcDate !== currentUtcDate) {
            // New UTC day detected
            if (cfgBattle.autoArena) {
                console.log('[JPX-PLUS] 检测到UTC新的一天，自动刷新竞技场页面以继续任务...');
                setTimeout(() => {
                    location.reload();
                }, Math.random() * 3000 + 1000); // Random delay 1-4s
            }
        }
        lastUtcDate = currentUtcDate;
    }, 30000); // Check every 30 seconds
}

// Auto Ring of Blood: Automatically complete selected ring of blood challenges
function initAutoRingOfBlood() {
    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');

    // Resolve page challenge name (EN or CN) to canonical EN config name
    function resolveRoBName(pageName) {
        // If it's already an EN name in our list, return as-is
        if (ROB_CHALLENGES.includes(pageName)) return pageName;
        // Try CN→EN reverse lookup
        if (ROB_CHALLENGE_CN_REV[pageName]) return ROB_CHALLENGE_CN_REV[pageName];
        return pageName; // fallback
    }

    // Get challenge list from page
    function getRoBChallenges() {
        const arenaTable = document.querySelector('#arena_list');
        if (!arenaTable) return [];

        const rows = arenaTable.querySelectorAll('tr');
        const challenges = [];
        for (let i = 1; i < rows.length; i++) { // Skip header
            const row = rows[i];
            const nameEl = row.querySelector('.fc4');
            const startImg = row.querySelector('img[src$="/arena/startchallenge.png"]');
            const disabledImg = row.querySelector('img[src$="/arena/startchallenge_d.png"]');
            const pageName = nameEl?.textContent?.trim() || '';
            const canonicalName = resolveRoBName(pageName);
            // Detect cooldown vs token-insufficient: cooldown has "Cooldown" text in cells
            const rowText = row.textContent || '';
            const isOnCooldown = !!disabledImg && /cooldown|冷却中/i.test(rowText);
            const isTokenInsufficient = !!disabledImg && !isOnCooldown;
            challenges.push({
                name: canonicalName,
                pageName,
                available: !!(startImg && startImg.onclick),
                onCooldown: isOnCooldown,
                tokenInsufficient: isTokenInsufficient,
                row,
                startImg
            });
        }
        return challenges;
    }

    // Check if a challenge name (canonical EN) matches the user's configured list
    function isChallengeSelected(challengeName) {
        const selectedList = cfgBattle.ringOfBloodChallenges || [];
        // If list is empty, match all
        if (selectedList.length === 0) return true;
        // Exact match against canonical EN name
        return selectedList.includes(challengeName);
    }

    // Check if we should auto-return and continue from battle finish
    if (localStorage.getItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix) === 'true') {
        localStorage.removeItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix);
        console.log('[JPX-PLUS] 浴血擂台战斗完成，返回续战');
        setTimeout(() => {
            tryStartNextRoB();
        }, 2000);
        return;
    }

    function tryStartNextRoB() {
        if (!cfgBattle.autoRingOfBlood) {
            console.log('[JPX-PLUS] 自动浴血擂台已关闭');
            return;
        }

        // If auto-arena is also enabled, check if arena still has work to do (arena has priority)
        if (cfgBattle.autoArena) {
            try {
                const arenaCache = JSON.parse(localStorage.getItem(prefix + 'arenaStatusCache' + isekaiSuffix) || '{}');
                if (arenaCache.timestamp && !arenaCache.limitReached && arenaCache.remaining > 0) {
                    console.log('[JPX-PLUS] 竞技场尚未完成，优先跳转竞技场...');
                    setTimeout(() => {
                        window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=ar';
                    }, Math.random() * 2000 + 1000);
                    return;
                }
            } catch(e) {}
        }

        const challenges = getRoBChallenges();
        if (challenges.length === 0) {
            console.log('[JPX-PLUS] 未找到浴血擂台列表');
            return;
        }

        // Find next available challenge matching user's selection
        for (const challenge of challenges) {
            if (challenge.available && isChallengeSelected(challenge.name)) {
                console.log(`[JPX-PLUS] 开始浴血擂台挑战: ${challenge.name}`);

                // Set flag for auto-return
                localStorage.setItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix, 'true');

                // Click the challenge
                setTimeout(() => {
                    challenge.startImg.click();
                }, Math.random() * 1000 + 500);
                return;
            }
        }

        // No matching available challenges
        const selectedNames = (cfgBattle.ringOfBloodChallenges || []).join(', ') || '全部';
        console.log(`[JPX-PLUS] 没有可用的浴血擂台挑战 (选中: ${selectedNames})，全部完成或冷却中`);

        // If auto-encounter is also enabled, go to homepage
        if (cfgBattle.autoEncounter) {
            console.log('[JPX-PLUS] 浴血擂台完成，自动跳转主页开始遭遇战...');
            localStorage.setItem(prefix + 'isAutoEncounter', 'true');
            setTimeout(() => {
                window.location.href = location.origin + '/';
            }, Math.random() * 2000 + 1000);
        }
    }

    // Auto-start if enabled
    if (cfgBattle.autoRingOfBlood) {
        console.log('[JPX-PLUS] 浴血擂台页面已加载，检测到自动浴血擂台已启用，开始自动挑战...');
        setTimeout(() => {
            tryStartNextRoB();
        }, 1000);
    } else {
        console.log('[JPX-PLUS] 浴血擂台页面已加载，等待手动操作');
    }
}

function initDoBattle() {
    doInitDoBattle = true;

    document.addEventListener('DOMContentLoaded', (event) => {
        if (document.querySelector('#riddlemaster')) {
            riddleRecorder();
            return;
        }

        // 从 localStorage 恢复战斗运行时状态
        isActiveBattle = localStorage.getItem(prefix + 'autoBattleActive' + isekaiSuffix) === 'true';
        // autoStartBattle 是用户偏好（持久），isActiveBattle 是运行时状态（每轮重置）
        // 如果用户偏好是自动开战，在 widget 创建前直接设为 true，避免一帧闪烁
        if (!isActiveBattle && cfgBattle.autoStartBattle) {
            isActiveBattle = true;
            localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, 'true');
        }
        readyNext = 0;
        monsterData = [];
        localStorage.removeItem(prefix + 'monsterData' + isekaiSuffix);
        allMonsterInfo = {};
        actionCounts = {};
        monstersEffects = {};
        log = document.querySelector('#textlog');
        if (log) {
            preDoBattle();
            jpxPanelManager.updateContent('battle');
            jpxPanelManager.setBackground(isActiveBattle ? '#0F0' : '#F00');
            if (isActiveBattle) goNext();
        }
    });

    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        console.error('Failed to load cfgBattle. Using default cfgBattle.');
        console.error(err);
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');

    if (cfgBattle.recordBattleLog) {
        battleLogRecord = JSON.parse(localStorage.getItem(prefix + 'battleLogRecord' + isekaiSuffix) || '[]');
    }
    timeRecords = JSON.parse(localStorage.getItem(prefix + 'timeRecords' + isekaiSuffix) || '{}');
    if (jpxUtils.isEmpty(timeRecords)) timeRecords = jpxUtils.createTimeRecords();
    combatRecords = JSON.parse(localStorage.getItem(prefix + 'combatRecords' + isekaiSuffix) || '{}');
    if (jpxUtils.isEmpty(combatRecords)) combatRecords = jpxUtils.createCombatRecords();
    revenueRecords = JSON.parse(localStorage.getItem(prefix + 'revenueRecords' + isekaiSuffix) || '{}');
    if (jpxUtils.isEmpty(revenueRecords)) revenueRecords = jpxUtils.createRevenueRecords();

    //Battle Style
    let {
        spellCooldowns
    } = getActionCooldowns();
    let spells = Object.keys(spellCooldowns);
    if (spells.includes('Shield Bash')) {
        battleStyle = spellDamageBonus.maxValue <= 100 ? 'OneHanded' : '1H_Mage';
    } else if (spells.includes('Great Cleave')) {
        battleStyle = spellDamageBonus.maxValue <= 100 ? 'TwoHanded' : '2H_Mage';
    } else if (spells.includes('Iris Strike')) {
        battleStyle = spellDamageBonus.maxValue <= 100 ? 'DualWielding' : 'DW_Mage';
    } else if (spells.includes('Skyward Sword')) {
        battleStyle = spellDamageBonus.maxValue <= 100 ? 'NitenIchiryu' : 'NI_Mage';
    } else if (spells.includes('Concussive Strike')) {
        battleStyle = 'Staff';
    } else {
        battleStyle = 'Unarmed';
    }

    //Battle Type
    let battleTypeLog = log.innerHTML.match(regExp.battleTypeLog);
    if (battleTypeLog) {
        if (battleTypeLog[1].includes('arena challenge') && !battleTypeLog[1].includes('Round 1 / 1)')) {
            battleType = 'Arena';
            // Check if this is an auto-arena
            if (localStorage.getItem(prefix + 'isAutoArena' + isekaiSuffix) === 'true') {
                // 自动竞技场：确保 autoStartBattle 和 advanceToNextRound 开启，goNext() 会自动开始
                if (!cfgBattle.autoStartBattle || !cfgBattle.advanceToNextRound) {
                    cfgBattle.autoStartBattle = true;
                    cfgBattle.advanceToNextRound = true;
                    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
                }
            }
        } else if (battleTypeLog[1].includes('random encounter')) {
            battleType = 'Encounter';
            // Check if this is an auto-encounter
            if (localStorage.getItem(prefix + 'isAutoEncounter') === 'true') {
                localStorage.removeItem(prefix + 'isAutoEncounter');
                // 自动遭遇战：确保 autoStartBattle 和 advanceToNextRound 开启，goNext() 会自动开始
                if (!cfgBattle.autoStartBattle || !cfgBattle.advanceToNextRound) {
                    cfgBattle.autoStartBattle = true;
                    cfgBattle.advanceToNextRound = true;
                    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
                }
            }
        } else if (battleTypeLog[1].includes('arena challenge') && battleTypeLog[1].includes('Round 1 / 1)')) {
            battleType = 'Colosseum';
            // Check if this is an auto-ring-of-blood
            if (localStorage.getItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix) === 'true') {
                // 自动浴血擂台：确保 autoStartBattle 和 advanceToNextRound 开启
                if (!cfgBattle.autoStartBattle || !cfgBattle.advanceToNextRound) {
                    cfgBattle.autoStartBattle = true;
                    cfgBattle.advanceToNextRound = true;
                    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
                }
            }
        } else if (battleTypeLog[1].includes('Grindfest')) {
            battleType = 'Battle1000';
        } else if (battleTypeLog[1].includes('Item World')) {
            battleType = 'Item';
        } else if (battleTypeLog[1].includes('The Tower')) {
            battleType = 'Tower';
            let floor = battleTypeLog[1].match(regExp.floor);
            if (floor) {
                towerFloor = floor[1];
            }
        }
    }
    if (battleType) {
        localStorage.setItem(prefix + 'battleType' + isekaiSuffix, battleType);
    } else {
        battleType = localStorage.getItem(prefix + 'battleType' + isekaiSuffix) || '';
    }

    //Tower Floor
    if (battleType === 'Tower') {
        if (towerFloor) {
            localStorage.setItem(prefix + 'towerFloor' + isekaiSuffix, towerFloor);
        } else {
            towerFloor = parseInt(localStorage.getItem(prefix + 'towerFloor' + isekaiSuffix)) || 0;
        }
    }

    preDoBattle();
}

function preDoBattle() {
    //Round
    let round = log.innerHTML.match(regExp.round);
    let storedRoundInfo = JSON.parse(localStorage.getItem(prefix + 'roundInfo' + isekaiSuffix) || '{}');
    if (battleType !== 'Encounter') {
        if (round) {
            roundInfo.current = +round[1];
            roundInfo.total = +round[2];
            localStorage.setItem(prefix + 'roundInfo' + isekaiSuffix, JSON.stringify(roundInfo));
        } else {
            roundInfo.current = storedRoundInfo.current || 0;
            roundInfo.total = storedRoundInfo.total || 0;
        }
    }

    //Proficiency Record
    if (cfgBattle.showRealTimeProficiency) {
        let proficiencyRecord = document.querySelector('#proficiency-record');
        if (!proficiencyRecord) {
            proficiencyRecord = document.createElement('table');
            proficiencyRecord.id = 'proficiency-record';
            document.querySelector('#csp').appendChild(proficiencyRecord);
        }

        let proficiencyKeys = Object.keys(revenueRecords.proficiency);
        if (proficiencyKeys.length) {
            let innerHTMLTemp = '';
            let order = REVENUE_FIELDS.find(f => f.id === 'proficiency').order;
            let sortedKeys = jpxUtils.getSortedKeys(order, proficiencyKeys);
            for (const sortedKey of sortedKeys) {
                let value = revenueRecords.proficiency[sortedKey];
                if (value) innerHTMLTemp += `<tr><td>${Math.round(value * 1000) / 1000}</td><td>${t(`rP.${sortedKey}`)}</td></tr>`;
            }
            proficiencyRecord.innerHTML = `<tbody>${innerHTMLTemp}</tbody>`;
        }
    }

    //Monster Data
    let matches;
    while ((matches = regExp.monster.exec(log.innerHTML)) !== null) {
        monsterData.unshift({
            id: +matches[1],
            name: matches[2],
            level: +matches[3],
            maxHP: +matches[4],
        });
    }
    let storedMonsterData = JSON.parse(localStorage[prefix + 'monsterData' + isekaiSuffix] || '[]');
    if (monsterData.length) {
        localStorage.setItem(prefix + 'monsterData' + isekaiSuffix, JSON.stringify(monsterData));
    } else if (storedMonsterData) {
        monsterData = storedMonsterData;
    }

    updateMonsterInfo();

    //Riddle
    if (log.textContent.includes('You gain the effect Blessing of the RiddleMaster.') && timeRecords.riddle.lastTurn !== timeRecords.turn) {
        timeRecords.riddle.lastTurn = timeRecords.turn;
        timeRecords.riddle.total += 1;
    }

    jpxPanelManager.createCtrlWidget('battle');

    let throttledPreProcessLog = jpxUtils.throttle(preProcessLog, 200, true);
    let obs = new MutationObserver(throttledPreProcessLog);
    obs.observe(log.firstChild, { childList: true });

    preRender();
}

function preProcessLog() {
    lastActionTimestamp = lastLogTimestamp;
    lastLogTimestamp = Date.now();

    let td = Array.from(log.getElementsByTagName('td'));
    for (let i = 0; i < td.length; i++) {
        if (td[i].className == 'tls') td[i].innerHTML = '<hr>';
    }

    battleRecorder();

    let btcp = document.querySelector('#btcp');
    let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
    if (btcp) {
        localStorage.removeItem(prefix + 'monsterData' + isekaiSuffix);

        if (finishBattle && !btcp.dataset.jpxAutoNext) {
            isActiveBattle = false;
            readyNext = 0;
            localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, 'false');
            // Don't change autoStartBattle - keep user's setting
            jpxPanelManager.updateContent('battle');
            jpxPanelManager.setBackground('#F00');
            btcp.setAttribute('style', 'display: block; width: max-content; min-width: 380px; max-width: 530px; height: auto; min-height: 120px; max-height: 621px; overflow: auto;');

            battleRecordPlayer();

            localStorage.removeItem(prefix + 'battleLogRecord' + isekaiSuffix);
            localStorage.removeItem(prefix + 'timeRecords' + isekaiSuffix);
            localStorage.removeItem(prefix + 'combatRecords' + isekaiSuffix);
            localStorage.removeItem(prefix + 'revenueRecords' + isekaiSuffix);

            // Update encounter count and auto-return after encounter
            if (battleType === 'Encounter') {
                // Increment count + update lastEncounterTime for accurate cooldown
                // lastEncounterTime is set here (battle finish) to cover both auto and manual entries
                try {
                    const state = JSON.parse(localStorage.getItem(prefix + 'encounterState') || '{}');
                    const today = new Date().toISOString().split('T')[0];
                    if (state.date === today) {
                        state.count = (state.count || 0) + 1;
                    } else {
                        state.date = today;
                        state.count = 1;
                        state.dawnTime = state.dawnTime || Date.now();
                    }
                    state.lastEncounterTime = state.lastEncounterTime || Date.now(); // 优先保留进入时设置的时间
                    state.key = '';
                    state.keyFetchTime = 0;
                    state.idle = false;
                    state.emptyFetchCount = 0; // 战斗成功，重置空fetch计数
                    localStorage.setItem(prefix + 'encounterState', JSON.stringify(state));
                    console.log('[JPX-PLUS] 遭遇战完成，今日第 ' + state.count + ' 场 (slot: ' + (state.keyCount || 0) + ')');
                } catch(e) {
                    console.log('[JPX-PLUS] Error updating encounter state:', e);
                }

                if (cfgBattle.autoEncounter) {
                    setTimeout(() => {
                        window.location.href = location.origin + '/';
                    }, Math.random() * 2000 + 1000);
                }
            }

            // Auto-return to arena list after arena challenge
            if (battleType === 'Arena' && localStorage.getItem(prefix + 'isAutoArena' + isekaiSuffix) === 'true') {
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=ar';
                }, Math.random() * 2000 + 1000);
            }

            // Auto-return to Ring of Blood list after colosseum challenge
            if (battleType === 'Colosseum' && localStorage.getItem(prefix + 'isAutoRingOfBlood' + isekaiSuffix) === 'true') {
                setTimeout(() => {
                    window.location.href = location.origin + getIsekaiPrefix() + '?s=Battle&ss=rb';
                }, Math.random() * 2000 + 1000);
            }

            return;
        }
    }

    preRender();
}

function preRender() {
    ({ spellCooldowns, itemCooldowns } = getActionCooldowns(true));
    vitals = getVitals();
    spiritStatus = getSpiritStatus();
    monstersObj = getMonsters(true);

    let { monsters, activeMonsters } = monstersObj;

    //Monster Effects
    updateMonsterEffects();

    //Player Effects and Render All
    playerEffectsObj = getEffectDuration(cfgBattle.showDurations);

    //Monster HP
    if (cfgBattle.showMonsterHP) {
        for (let i = 0; i < monsters.length; i++) {
            if (!monsterData[i]) break;
            if (monsters[i].hpPercentage) {
                let maxHP = monsterData[i].maxHP;
                let hpDiv = document.createElement('div');
                hpDiv.className = 'monster-hp';
                hpDiv.innerText = 'HP: ' + Math.round(maxHP * monsters[i].hpPercentage).toLocaleString() + ' / ' + maxHP.toLocaleString();
                monsters[i].monster_btm1.appendChild(hpDiv);
            }
        }
    }

	jpxPanelManager.updateContent('battle');

    goNext();
}

function normalizeDelayRange(range) {
    if (!Array.isArray(range) || range.length < 2) return { min: 0, max: 0 };
    let min = Number(range[0]);
    let max = Number(range[1]);
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = 0;
    if (min < 0) min = 0;
    if (max < 0) max = 0;
    if (max < min) [min, max] = [max, min];
    return { min, max };
}

let lastRandomDelays = {
    nextRound: '-',
    action: '-',
    item: '-',
    toggle: '-',
};

function getUnifiedDelayRange() {
    if (Array.isArray(cfgBattle.delayRangeMs) && cfgBattle.delayRangeMs.length >= 2) {
        return cfgBattle.delayRangeMs;
    }
    if (Array.isArray(cfgBattle.delayActionMs) && cfgBattle.delayActionMs.length >= 2) {
        return cfgBattle.delayActionMs;
    }
    if (Array.isArray(cfgBattle.delayNextRoundMs) && cfgBattle.delayNextRoundMs.length >= 2) {
        return cfgBattle.delayNextRoundMs;
    }
    return [0, 0];
}

function getRandomDelay(range) {
    if (!cfgBattle.randomDelayEnabled) return 0;
    let { min, max } = normalizeDelayRange(range);
    if (min >= max) return min;
    return Math.floor(min + Math.random() * (max - min));
}

function scheduleAction(action, delayType = 'action', requireActive = true) {
    let delay = getRandomDelay(getUnifiedDelayRange());
    if (lastRandomDelays[delayType] !== undefined) {
        lastRandomDelays[delayType] = delay;
        jpxPanelManager.updateContent('battle');
    }
    if (delay <= 0) {
        if (!requireActive || isActiveBattle) action();
        return;
    }

    setTimeout(() => {
        if (!requireActive || isActiveBattle) action();
    }, delay);
}

function goNext() {
    if (!isActiveBattle && cfgBattle.autoStartBattle) {
        isActiveBattle = true;
        localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, 'true');
    }

    if (isActiveBattle) {
		jpxPanelManager.setBackground('#0F0');

        //End of Round
        let btcp = document.querySelector('#btcp');
        let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
        if (finishBattle && !(btcp && btcp.dataset.jpxAutoNext)) {
            isActiveBattle = false;
            readyNext = 0;
            localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, 'false');
            // Don't change autoStartBattle - keep user's setting
            jpxPanelManager.updateContent('battle');
            jpxPanelManager.setBackground('#F00');
            return;
        }
        if (!monstersObj.activeMonsters || !monstersObj.activeMonsters[0]) {
            if (btcp && !finishBattle && cfgBattle.advanceToNextRound) {
                if (!btcp.dataset.jpxAutoNext) {
                    btcp.dataset.jpxAutoNext = '1';
                    scheduleAction(() => {
                        btcp.click();
                        btcp.style.visibility = 'hidden';
                    }, 'nextRound');
                }
            }
            return;
        }

        switch (readyNext) {
            case -1:
                break;
            default:
                readyNext = -1;
                setTimeout(() => {
                    smartBattle();
                }, 0);
                break;
        }
    }
}

const keybindHandlers = {
    openBattleRecords,
    toggleActive,
    openSettings: renderSettings,
};

function onKeyDown(e) {
    if (keybindController && !keybindController.signal.aborted) return;

    let target = e.target;
    if (
        e.repeat ||
        e.isComposing ||
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
    ) return;

    for (const [action, bind] of Object.entries(userKeybinds)) {
        if (e.key.toLowerCase() === bind.key.toLowerCase() && e.ctrlKey === bind.ctrl && e.altKey === bind.alt && e.shiftKey === bind.shift) {
            e.preventDefault();
            keybindHandlers[action]?.();
        }
    }
}

function toggleActive() {
    if (!log) return;
    isActiveBattle = !isActiveBattle;
	jpxPanelManager.updateContent('battle');
	jpxPanelManager.setBackground(isActiveBattle ? '#0F0' : '#F00');
    localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, String(isActiveBattle));
    if (isActiveBattle) goNext();
}

function toggleAutoStart() {
    // 切换战斗状态，同时同步自动开战配置
    isActiveBattle = !isActiveBattle;
    cfgBattle.autoStartBattle = isActiveBattle;
    // 开启自动开战时，同步开启自动下一轮
    if (isActiveBattle && !cfgBattle.advanceToNextRound) {
        cfgBattle.advanceToNextRound = true;
    }

    localStorage.setItem(prefix + 'autoBattleActive' + isekaiSuffix, String(isActiveBattle));
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    jpxPanelManager.updateContent('battle');
    jpxPanelManager.setBackground(isActiveBattle ? '#0F0' : '#F00');

    if (isActiveBattle) {
        goNext();
    }
}

function toggleRandomDelay() {
    cfgBattle.randomDelayEnabled = !cfgBattle.randomDelayEnabled;
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    jpxPanelManager.updateContent('battle');
}

function adjustDelay(delta, isMin = false) {
    if (!cfgBattle.delayRangeMs) cfgBattle.delayRangeMs = [0, 0];

    let [min, max] = cfgBattle.delayRangeMs;
    let adjust = Math.round(delta);

    if (isMin) {
        // 调整最小值
        min = Math.max(0, min + adjust);
        if (min > max) max = min;
    } else {
        // 调整最大值
        max = Math.max(0, max + adjust);
        if (max < min) min = max;
    }

    cfgBattle.delayRangeMs = [min, max];
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    jpxPanelManager.updateContent('battle');
}

//Battle Smart
function smartBattle() {
    let { supports, attacks } = cfgBattle[getBattleMode()];
    if (supports.length < 1) {
        readyNext = '\nWith so few conditions, you might die in auto-battle.';
		jpxPanelManager.updateContent('battle');
		jpxPanelManager.setBackground('#FF0');
        return true;
    }
    if (actionManager(supports, true)) return true;
    if (actionManager(attacks)) return true;
    if (doAttackGoNext(monstersObj.activeMonsters[0])) return true;

    return false;
}

//Battle Utils
function doSpellsDebuffGoNext({name, targetCount = 3, tailSkip = 0, bottomUp = false, maxAtFirst = Infinity, minMonstersLeft = 10, conditions}) {
    let { monsters, activeMonsters } = monstersObj;

    if (spellCooldowns[name] !== 0) return false;

    let maxDo = 0;
    if (monsters.length - activeMonsters.length <= 1) {
        maxDo = maxAtFirst;
    } else if (activeMonsters.length <= minMonstersLeft) {
        maxDo = Infinity;
    }
    if ((actionCounts[name] ?? 0) >= maxDo) return false;

    let startIndex = 0;
    let endIndex = 0;
    let firstIndex = activeMonsters[0].index;
    let lastIndex = activeMonsters.at(-1).index;
    let dir = !bottomUp ? 1 : -1;
    if (!bottomUp) {
        startIndex = firstIndex;
        endIndex = tailSkip >= 0
            ? lastIndex + 1 - tailSkip
            : startIndex + Math.abs(tailSkip);
    } else {
        startIndex = monsters.length - 1 - lastIndex;
        endIndex = tailSkip >= 0
            ? monsters.length - (firstIndex + tailSkip)
            : startIndex + Math.abs(tailSkip);
    }
    endIndex = Math.min(endIndex, monsters.length);
    if (endIndex <= 0) return false;

    let undebuffedObj = {};
    const isUnDebuffed = (i) => {
        return undebuffedObj[i] ??= (
            !!monsters[i]?.isAlive &&
            checkConditions(conditions, monsters[i], false)
        );
    };
    const getIndex = (j) => !bottomUp ? j : monsters.length - 1 - j;

    if (targetCount >= 3) {
        for (let i = startIndex + 1; i < endIndex - 1; i++) {
            let j = getIndex(i);
            if (isUnDebuffed(j - 1) && isUnDebuffed(j) && isUnDebuffed(j + 1)) {
                doSpellGoNext(name, monsters[j]);
                return true;
            }
        }
    }
    if (targetCount >= 2) {
        for (let i = startIndex; i < endIndex; i++) {
            let j = getIndex(i);
            if (!isUnDebuffed(j) || !isUnDebuffed(j + 1)) continue;
            if (targetCount === 3 && i === startIndex && monsters[j + dir]?.isAlive) {
                doSpellGoNext(name, monsters[j + dir]);
            } else if (targetCount === 3 && i === endIndex - 1 && monsters[j - dir]?.isAlive) {
                doSpellGoNext(name, monsters[j - dir]);
            } else {
                doSpellGoNext(name, monsters[j]);
            }
            return true;
        }
    }
    if (targetCount >= 3) {
        for (let i = startIndex + 1; i < endIndex - 1; i++) {
            let j = getIndex(i);
            if (isUnDebuffed(j - 1) && monsters[j]?.isAlive && isUnDebuffed(j + 1)) {
                doSpellGoNext(name, monsters[j]);
                return true;
            }
        }
    }
    for (let i = startIndex; i < endIndex; i++) {
        let j = getIndex(i);
        if (!isUnDebuffed(j)) continue;
        if (targetCount === 3 && i === startIndex && monsters[j + dir]?.isAlive) {
            doSpellGoNext(name, monsters[j + dir]);
        } else if (targetCount === 3 && i === endIndex - 1 && monsters[j - dir]?.isAlive) {
            doSpellGoNext(name, monsters[j - dir]);
        } else {
            doSpellGoNext(name, monsters[j]);
        }
        return true;
    }

    return false;
}

function doSpellGoNext(spell, monster) {
    readyNext = 0;
    if (monster.isAlive && spellCooldowns[spell] === 0) {
        scheduleAction(() => {
            cast(spell, true);
            monster.click();
        }, 'action');
        return true;
    }
    return false;
}

function doAttackGoNext(monster) {
    readyNext = 0;
    if (monster.isAlive) {
        scheduleAction(() => {
            monster.click();
        }, 'action');
        return true;
    }
    return false;
}

function toggle(name, skipDelay = false) {
    const run = () => {
        let state = document.querySelector('#ckey_' + name.toLowerCase());
        if (state) {
            dummy.setAttribute('onclick', state.getAttribute('onmouseover'));
            dummy.click();
            state.click();
        }
    };

    if (skipDelay) {
        run();
        return;
    }
    scheduleAction(run, 'toggle');
}

function cast(name, skipDelay = false) {
    const run = () => {
        let spell = document.querySelector('.bts > div[onclick][onmouseover*="\'' + name + '\'"]');
        if (document.getElementsByClassName('btii')[0].innerHTML != name && spell) {
            dummy.setAttribute('onclick', spell.getAttribute('onmouseover'));
            dummy.click();
            spell.click();
        }
    };

    if (skipDelay) {
        run();
        return;
    }
    scheduleAction(run, 'action');
}

function use(name, skipDelay = false) {
    const run = () => {
        let id = Object.entries(itemMap).find(([id, _name]) => _name === name)?.[0];
        if (!id) return;

        let itemArray = Array.from(document.querySelectorAll('.bti3 > div[onclick][onmouseover]'));
        let item = itemArray.find(div => div.outerHTML.includes(id));
        if (item) {
            dummy.setAttribute('onclick', item.getAttribute('onmouseover'));
            dummy.click();
            item.click();
        }
    };

    if (skipDelay) {
        run();
        return;
    }
    scheduleAction(run, 'item');
}

function getActionCooldowns(render = false) {
    let quickbarObj = {};

    function scan({selector, regexp, getName, getInitlCooldown}) {
        let result = {};

        for (const slot of document.querySelectorAll(selector)) {
            let tooltip = slot.getAttribute('onmouseover');
            let matches = tooltip?.match(regexp);

            let name;
            if (matches) {
                name = getName(matches);
            } else {
                name = slot.textContent?.trim() || jpxUtils.parseHVClasses(slot.querySelector('div'), true);
            }
            if (!name) continue;

            let cooldown;
            let onClick = slot.getAttribute('onclick');
            if (onClick) {
                cooldown = 0;
                result[name] = 0;
            } else {
                let lastUse = timeRecords.lastUse[name] ?? -Infinity;
                let initCooldown = getInitlCooldown(matches) ?? 0;
                cooldown = lastUse + initCooldown - timeRecords.turn;

                result[name] = cooldown > 0 ? cooldown : '-';
            }

            if (!render) continue;
            if (slot.id === 'ikey_p') {
                quickbarObj.ikey_p = {
                    name,
                    tooltip,
                    onClick,
                    cooldown,
                };
            } else {
                quickbarObj[name] = {
                    tooltip,
                    onClick,
                    cooldown,
                };
            }
        }

        return result;
    }

    function getQuickName(quick) {
        if (quick.id?.startsWith('extend_')) return quick.id.slice(7);

        let tooltip = quick.getAttribute('onmouseover');
        if (!tooltip) return;

        return tooltip.match(regExp.spellInfo)?.[1];
    }

    function renderQuickbar() {
        let quickbar = document.querySelector('#quickbar');

        for (const name of cfgBattle.quickbarExtend) {
            let quickDiv = document.createElement('div');
            quickDiv.id = `extend_${name}`;
            quickDiv.className = 'btqs extend';

            if (quickbarObj[name]) {
                let innerImg = document.createElement('img');

                let tooltip = quickbarObj[name].tooltip;
                quickDiv.setAttribute('onmouseover', tooltip ? tooltip : '');

                let onClick = quickbarObj[name].onClick;
                if (onClick) quickDiv.setAttribute('onclick', onClick);
                else innerImg.style.opacity = 0.5;

                let spellIconID = tooltip?.match(regExp.spellInfo)?.[2];
                if (spellIconID) innerImg.src = '/y/a/' + spellIconID + '.png';
                else innerImg.src = itemSrc.find(rule => rule.keys.some(key => {
                    if (name === 'ikey_p') return quickbarObj[name].name.includes(key);
                    return name.includes(key);
                }))?.src ?? '/y/e/channeling.png';

                innerImg.className = 'btqi';
                quickDiv.appendChild(innerImg);
            }

            let outerImg = document.createElement('img');
            outerImg.src = '/y/ab/b.png';
            outerImg.className = 'btqb';
            quickDiv.appendChild(outerImg);
            quickbar.appendChild(quickDiv);
        }

        showCooldowns(quickbar);
    }

    function showCooldowns(quickbar) {
        if (!cfgBattle.showCooldowns) return;

        for (const quick of quickbar.querySelectorAll('.btqs[onmouseover]:not([onclick])')) {
            let name = getQuickName(quick);
            if (!name) continue;

            let cooldown = quickbarObj[name].cooldown;
            if (!(cooldown > 0)) continue;

            let cooldownDiv = document.createElement('div');
            cooldownDiv.className = 'cooldown';
            cooldownDiv.textContent = cooldown;
            quick.appendChild(cooldownDiv);
        }
    }

    let spellCooldowns = scan({
        selector: '.bts > div[onmouseover]',
        regexp: regExp.spellInfo,
        getName: m => m[1],
        getInitlCooldown: m => m ? +m[5] : 0
    });

    let itemCooldowns = scan({
        selector: '.bti3 > div',
        regexp: regExp.itemInfo,
        getName: m => itemMap[+m[1]],
        getInitlCooldown: () => 40
    });

    if (render) renderQuickbar();

    return {
        spellCooldowns,
        itemCooldowns
    };
}

function getVitals() {
    let ocBar = document.querySelector('img[src$="bar_orange.png"]');

    let vitalCfg = ocBar ? {
        widthHP: 414, widthMP: 414, widthSP: 414, widthOC: 414,
        idHP: ['#dvrhb', '#dvrhd'], idMP: '#dvrm', idSP: '#dvrs',
    } : {
        widthHP: 496, widthMP: 207, widthSP: 207,
        idHP: ['#vrhb', '#vrhd'], idMP: '#vrm', idSP: '#vrs',
    };

    let oc = 0;
    if (ocBar) {
        let ocPercentage = parseInt(ocBar.style.width, 10) / vitalCfg.widthOC;
        oc = Math.round(10 * ocPercentage * 10) / 10;;
    } else {
        let vcp = document.querySelector('#vcp')?.innerHTML;
        if (vcp) {
            let matches = vcp.match(regExp.oc);
            if (matches) {
                oc = matches.length / 2 - 1;
                if (vcp.match(regExp.ocHalf)) {
                    oc -= 0.5;
                }
            }
        }
    }

    let hpPercentage = Math.round(parseInt(document.querySelector('img[src$="green.png"]').style.width, 10) / vitalCfg.widthHP * 10) / 10;
    let mpPercentage = Math.round(parseInt(document.querySelector('img[src$="bar_blue.png"]').style.width, 10) / vitalCfg.widthMP * 10) / 10;
    let spPercentage = Math.round(parseInt(document.querySelector('img[src$="bar_red.png"]').style.width, 10) / vitalCfg.widthSP * 10) / 10;

    let hpCurrentText = vitalCfg.idHP.map(id => document.querySelector(id)?.innerText).find(Boolean) || "0";
    let hpCurrent = parseInt(hpCurrentText, 10) || 0;
    let mpCurrent = parseInt(document.querySelector(vitalCfg.idMP).innerText, 10);
    let spCurrent = parseInt(document.querySelector(vitalCfg.idSP).innerText, 10);

    let hpMax = Math.round(hpCurrent / hpPercentage * 10) / 10;
    let mpMax = Math.round(mpCurrent / mpPercentage * 10) / 10;
    let spMax = Math.round(spCurrent / spPercentage * 10) / 10;

    return {
        oc,
        hpPercentage, mpPercentage, spPercentage,
        hpCurrent, mpCurrent, spCurrent,
        hpMax, mpMax, spMax,
    }
}

function getSpiritStatus() {
    let ckey_spirit = document.querySelector('#ckey_spirit');
    let spiritStatus = ckey_spirit.outerHTML.includes('spirit_a.png');
    return spiritStatus;
}

function getEffectDuration(render = false) {
    let playerEffectObj = {};
    let effectsPane = document.querySelector('#pane_effects');
    let effects = Array.from(effectsPane.getElementsByTagName('img'));
    let playerEffectsLength = effects.length;

    if (render) effects.push(...document.querySelectorAll('.btm6 > img[onmouseover]'));

    effects.forEach((effect, index) => {
        let tooltip = effect.getAttribute('onmouseover');
        if (!tooltip) return;

        let matches = tooltip.match(regExp.spellMatch);
        if (!matches?.groups) return;

        let { name, stack, description, turns } = matches.groups;
        if (index < playerEffectsLength && name) playerEffectObj[name] = { turns, stack: stack ?? 1 };

        if (render) {
            let displayTurns = turns;
            let durationContainer = document.createElement('div');
            durationContainer.className = 'effect-duration';
            let durationDiv = document.createElement('div');
            if (turns < 9) {
                durationDiv.style.background = turns < 4 ? 'aquamarine' : 'lavender';
            } else if (turns === 'autocast') {
                displayTurns = 'auto';
            } else if (turns === 'permanent') {
                displayTurns = decodeURIComponent('%E2%88%9E');
            /*isekai911*/
            } else if (turns === 'decaying') {
                displayTurns = '';
            /*isekai912*/
            } else if (turns === '-') {
                displayTurns = '-';
            }

            durationDiv.innerHTML = displayTurns;
            if (stack) durationDiv.innerHTML += `${turns !== 'decaying' ? '&nbsp;' : ''}x${stack}`;

            durationContainer.appendChild(durationDiv);
            effect.parentNode.insertBefore(durationContainer, effect);
        }
    });

    return playerEffectObj;
}

function getMonsters(render = false) {
    let monsters = [];
    let activeMonsters = [];
    let bosses = [];
    let activeBosses = [];

    [...document.getElementsByClassName('btm1')].forEach((monster_btm1, index) => {
        let monsterInfo = allMonsterInfo?.[`mkey_${(index + 1) % 10}`];
        let monster = {
            index: index,
            click: function() {
                monster_btm1.click();
            },
            name: 'Unknown',
            type: 'Normal',
            hpPercentage: 0,
            mpPercentage: 0,
            spPercentage: 0,
            isAlive: monster_btm1.hasAttribute('onclick'),
            effectObj: {},
            monster_btm1: monster_btm1,
        };

        //index
        let monster_btm2 = monster_btm1.querySelector('.btm2');
        if (render && (cfgBattle.showMonsterIndex || cfgBattle.showMonsterInfo)) {
            monster_btm2.querySelector('img').style.display = 'none';
            let monIndex = document.createElement('div');
            monIndex.textContent = index + 1;
            monIndex.style.cssText = `font-size: ${cfgBattle.showMonsterInfo ? 17 : 28}px; font-weight: bold`;
            monster_btm2.querySelector('div').appendChild(monIndex);
        }
        //info: monsterClass
        if (render && cfgBattle.showMonsterInfo) {
            let monClass = document.createElement('div');
            monClass.textContent = monsterInfo?.monsterClass ?? '?';
            monClass.dataset.field = 'monClass';
            monClass.style.cssText = 'font-size: 10px; font-weight: bold; overflow: hidden;';
            monster_btm2.querySelector('div').prepend(monClass);
        }

        //name
        let monster_btm3 = monster_btm1.querySelector('.btm3');
        let nameContainer = monster_btm3.querySelector('div');
        monster.name = nameContainer.textContent.trim() || jpxUtils.parseHVClasses(nameContainer);
        //type
        for (const [type, names] of Object.entries(bossTypes)) {
            if (names.has(monster.name)) {
                monster.type = type;
                monster.isAlive && activeBosses.push(monster);
                bosses.push(monster);
                break;
            }
        }
        //info: attackType, powerLevel, trainer
        if (render && cfgBattle.showMonsterInfo) {
            monster_btm3.querySelector(':scope > div > div').style.display = 'inline';
            let monTrAtkPl = document.createElement('span');
            if (!jpxUtils.isEmpty(monsterInfo)) monTrAtkPl.textContent = `${monsterInfo?.attack ?? '?'}, ${monsterInfo?.plvl ?? '?'}`;
            monTrAtkPl.dataset.field = 'monTrAtkPl';
            monTrAtkPl.style.cssText = 'font-weight: bold; position: absolute; right: 2px;';
            monster_btm3.querySelector('div').appendChild(monTrAtkPl);
        }

        //hpPercentage, mpPercentage, spPercentage
        let monster_btm4 = monster_btm1.querySelector('.btm4');
        let healthBar = monster_btm4.querySelector('img[src$="nbargreen.png"]');
        monster.hpPercentage = Math.round((parseInt(healthBar?.style.width, 10) / 120) * 100) / 100 || 0;
        let manaBar = monster_btm4.querySelector('img[src$="nbarblue.png"]');
        monster.mpPercentage = Math.round((parseInt(manaBar?.style.width, 10) / 120) * 100) / 100 || 0;
        let spiritBar = monster_btm4.querySelector('img[src$="nbarred.png"]');
        monster.spPercentage = Math.round((parseInt(spiritBar?.style.width, 10) / 120) * 100) / 100 || 0;

        //status
        let monster_btm6 = monster_btm1.querySelector('.btm6');
        monster_btm6.querySelectorAll('img').forEach((effect) => {
            let tooltip = effect.getAttribute('onmouseover');
            if (!tooltip) return;

            let matches = tooltip.match(regExp.spellMatch);
            if (!matches?.groups) return;

            let { name, stack, description, turns } = matches.groups;
            if (name) monster.effectObj[name] = { turns, stack: stack ?? 1 };
        });

        monsters.push(monster);
        monster.isAlive && activeMonsters.push(monster);
    });

    return {
        monsters, activeMonsters,
        bosses, activeBosses,
    }
}

function updateMonsterEffects() {
    let { monsters, activeMonsters } = monstersObj;

    function getEffectChanges(turnLog) {
        let effectsAdded = turnLog.matchAll(regExp.effectGain);
        let effectsRemoved = [...turnLog.matchAll(regExp.effectExpired), ...turnLog.matchAll(regExp.effectWear)];
        let asleepRemoved = turnLog.matchAll(regExp.effectWearAsleep);
        let confusedRemoved = turnLog.matchAll(regExp.effectWearConfused);
        let effectChanges = {};

        for (const match of effectsAdded) (effectChanges[match[1]] ??= { add: [], remove: [] }).add.push(match[2]);
        for (const match of effectsRemoved) (effectChanges[match[2]] ??= { add: [], remove: [] }).remove.push(match[1]);
        for (const match of asleepRemoved) (effectChanges[match[1]] ??= { add: [], remove: [] }).remove.push('Asleep');
        for (const match of confusedRemoved) (effectChanges[match[1]] ??= { add: [], remove: [] }).remove.push('Confused');

        return effectChanges;
    }

    function calcHiddenDelta(name, effectObj) {
        let savedEffects = monstersEffects[name];
        if (!savedEffects) return;

        let maxDecrease = 0;
        for (const effect in effectObj) {
            let savedTurns = +savedEffects[effect]?.turns;
            let effectTurns = +effectObj[effect]?.turns;
            if (!isNaN(savedTurns) && !isNaN(effectTurns)) {
                let delta = savedTurns - effectTurns;
                if (delta > 0) maxDecrease = Math.max(maxDecrease, delta);
            }
        }

        return maxDecrease;
    }

    function applyHiddenDelta(name, effectObj, delta) {
        let savedEffects = monstersEffects[name];
        if (!savedEffects) return;

        let elementEffects = ['Searing Skin', 'Freezing Limbs', 'Turbulent Air', 'Deep Burns', 'Breached Defense', 'Blunted Attack'];
        let effects = Object.keys(effectObj);
        let elementCount = effects.filter(effect => elementEffects.includes(effect)).length;

        for (const savedEffect in savedEffects) {
            if (effects.includes(savedEffect)) continue;

            if (
                (elementCount < 3 && elementEffects.includes(savedEffect)) ||
                savedEffect === 'Coalesced Mana'
            ) {
                delete savedEffects[savedEffect];
                continue;
            }

            if (!delta || delta <= 0) continue;
            let savedTurns = +savedEffects[savedEffect]?.turns;
            if (isNaN(savedTurns)) continue;

            if (savedTurns - delta < 0 && elementEffects.includes(savedEffect)) {
                delete savedEffects[savedEffect];
                continue;
            }
            savedEffects[savedEffect].turns = Math.max(0, savedTurns - delta);
        }
    }

    let turnLog = log.innerHTML.match(regExp.turnLog)?.[0];
    let effectChanges = turnLog ? getEffectChanges(turnLog) : {};

    for (const activeMonster of activeMonsters) {
        let name = activeMonster.name;
        let savedEffects = monstersEffects[name] ??= {};

        let effectObj = activeMonster.effectObj;
        let effects = Object.keys(effectObj);

        if (effects.length < 5) {
            for (const effect in savedEffects) delete savedEffects[effect];
        } else if (effects.length === 5) {
            for (const effect in savedEffects) delete savedEffects[effect];
            for (const effect of effects) savedEffects[effect] = { ...effectObj[effect] };
        } else if (effects.length === 6) {
            let delta = calcHiddenDelta(name, effectObj);
            for (const effect of effects) savedEffects[effect] = { ...effectObj[effect] };

            if (effectChanges[name]) {
                for (const effect of effectChanges[name].add) !effects.includes(effect) && (savedEffects[effect] = { turns: '-', stack: '-' });
                for (const effect of effectChanges[name].remove) (!effects.includes(effect) && (effect in savedEffects)) && delete savedEffects[effect];
            }

            applyHiddenDelta(name, effectObj, delta);

            let monster_btm6 = activeMonster.monster_btm1.querySelector('.btm6');
            monster_btm6.style.width = 'max-content';

            for (const effect in savedEffects) {
                if (!(effect in effectObj)) {
                    let { turns, stack } = savedEffects[effect];
                    effectObj[effect] = { turns, stack };
                    if (isNaN(+turns)) turns = `'${String(turns).replace(/'/g, "\\'")}'`;

                    let img = document.createElement('img');
                    img.src = (isekaiSuffix ? '/isekai' : '') + (effectSrc[effect]?.scr || '/y/e/channeling.png');
                    img.setAttribute('onmouseover', `battle.set_infopane_effect('${effect}', 'jpx Hidden Effects', ${turns})`);
                    img.setAttribute('onmouseout', 'battle.clear_infopane()');

                    monster_btm6.appendChild(img);
                }
            }
        }
    }
}

function monsterDBReady(prevInfo) {
    const getMonsterIds = info => info ? Object.values(info).map(monsterInfo => monsterInfo?.monsterId ?? '').join('|') : '';

    return new Promise((resolve, reject) => {
        let start = Date.now();

        (function loop() {
            let info = window.HVMonsterDB?.getCurrentMonstersInformation();
            let monsterIds = getMonsterIds(info);
            if (info && !jpxUtils.isEmpty(info) && monsterIds !== prevMonsterIds) {
                resolve({ info, monsterIds });
                return;
            }

            if (Date.now() - start > 250) {
                resolve();
                return;
            }

            setTimeout(loop, 10);
        })();
    });
}

function updateMonsterInfo() {
    monsterDBReady(prevMonsterIds).then((result) => {
        if (!result) return;
        allMonsterInfo = result.info;
        prevMonsterIds = result.monsterIds;

        if (!cfgBattle.showMonsterInfo) return;
        for (const monster of monstersObj.monsters) {
            let monsterInfo = allMonsterInfo?.[`mkey_${(monster.index + 1) % 10}`];
            let monClass = monster.monster_btm1.querySelector('[data-field="monClass"]');
            monClass.textContent = monsterInfo?.monsterClass ?? '?';
            let monTrAtkPl = monster.monster_btm1.querySelector('[data-field="monTrAtkPl"]')
            monTrAtkPl.textContent = `${monsterInfo?.attack ?? '?'}, ${monsterInfo?.plvl ?? '?'}`;
        }
    });
}

function checkConditions(conditions, target, checkGlobal = true, checkTarget = true) {
    const generalHandlers = {
        world: arr => arr.includes(!isekaiSuffix ? 'Persistent' : 'Isekai'),
        pLevel: range => jpxUtils.inRange(parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix) || 1), range),
        battleTypes: arr => arr.includes(battleType),
        difficulty: arr => {
            let difficulty;
            if (battleType === 'Tower') {
                if (jpxUtils.inRange(towerFloor, [1, 6])) difficulty = 'Normal';
                else if (jpxUtils.inRange(towerFloor, [7, 13])) difficulty = 'Hard';
                else if (jpxUtils.inRange(towerFloor, [14, 19])) difficulty = 'Nightmare';
                else if (jpxUtils.inRange(towerFloor, [20, 26])) difficulty = 'Hell';
                else if (jpxUtils.inRange(towerFloor, [27, 33])) difficulty = 'Nintendo';
                else if (jpxUtils.inRange(towerFloor, [34, 39])) difficulty = 'IWBTH';
                else difficulty = 'PFUDOR';
            } else {
                difficulty = localStorage.getItem(prefix + 'difficulty' + isekaiSuffix) || 'PFUDOR';
            }

            return arr.includes(difficulty);
        },
        roundCurrent: range => jpxUtils.inRange(roundInfo.current, range),
        roundLeft: range => jpxUtils.inRange(roundInfo.total - roundInfo.current, range),
        roundTotal: range => jpxUtils.inRange(roundInfo.total, range),
        floor: range => (battleType !== 'Tower' || jpxUtils.inRange(towerFloor, range)),
        pActionCooldown: arr => {
            let range = arr.slice(0, 2);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ?
                    spellsDamageObj[spellDamageBonus.maxType][tier - 1] :
                    action;
                let cooldown = spellCooldowns[action2] ?? itemCooldowns[action2];
                if (cooldown === '-') cooldown = 9999;
                return jpxUtils.inRange(cooldown, range);
            });
        },
        pActionCounts: arr => {
            let range = arr.slice(0, 2);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ?
                    spellsDamageObj[spellDamageBonus.maxType][tier - 1] :
                    action;

                return jpxUtils.inRange(actionCounts[action2] ?? 0, range);
            });
        },
        pHP: range => jpxUtils.inRange(vitals.hpPercentage, range),
        pMP: range => jpxUtils.inRange(vitals.mpPercentage, range),
        pSP: range => jpxUtils.inRange(vitals.spPercentage, range),
        pOC: range => jpxUtils.inRange(vitals.oc, range),
        pSpiritStatus: flag => flag === spiritStatus,
        pEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let turns = playerEffectsObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        pIgnoredEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return !effects.some(effect => {
                let turns = playerEffectsObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        pEffectStacks: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let stack = playerEffectsObj[effect]?.stack ?? -1;
                return isNaN(+stack) || jpxUtils.inRange(+stack, range);
            });
        },
        monsters: range => jpxUtils.inRange(monstersObj.monsters.length, range),
        activeMonsters: range => jpxUtils.inRange(monstersObj.activeMonsters.length, range),
        defeatedMonsters: range => jpxUtils.inRange(monstersObj.monsters.length - monstersObj.activeMonsters.length, range),
        bosses: range => jpxUtils.inRange(monstersObj.bosses.length, range),
        activeBosses: range => jpxUtils.inRange(monstersObj.activeBosses.length, range),
        defeatedBosses: range => jpxUtils.inRange(monstersObj.bosses.length - monstersObj.activeBosses.length, range),
        mWithoutEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);
            return jpxUtils.inRange(monstersObj.activeMonsters.filter(activeMonster => effects.some(effect => activeMonster.effectObj[effect]?.turns == null)).length, range);
        },
    };

    const targetHandlers = {
        tName: str => {
            let regex = jpxUtils.toRegExp(str);
            return !regex || regex.test(target.name);
        },
        tTypes: arr => arr.includes(target.type),
        tClasses: arr => arr.includes(allMonsterInfo?.[`mkey_${(target.index + 1) % 10}`]?.monsterClass),
        tPowerLevel: range => jpxUtils.inRange(allMonsterInfo?.[`mkey_${(target.index + 1) % 10}`]?.plvl, range),
        tIndex: range => jpxUtils.inRange(target.index, range.map(n => (
            n = n > 0 ? n - 1 : n === 0 ? 0 : monstersObj.monsters.length + n,
            Math.min(monstersObj.monsters.length - 1, Math.max(0, n))
        ))),
        tHP: range => jpxUtils.inRange(target.hpPercentage, range),
        tEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let turns = target.effectObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        tIgnoredEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return !effects.some(effect => {
                let turns = target.effectObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        tEffectStacks: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let stack = target.effectObj[effect]?.stack ?? -1;
                return isNaN(+stack) || jpxUtils.inRange(+stack, range);
            });
        },
        tDaysSinceUpdate: range => {
            let lastUpdate = allMonsterInfo?.[`mkey_${(target.index + 1) % 10}`]?.lastUpdate;
            let deltaDays = lastUpdate ? jpxUtils.daysSince(lastUpdate) : 9999;
            return !jpxUtils.isEmpty(allMonsterInfo) && jpxUtils.inRange(deltaDays, range);
        },
    };

    return conditions.every(condition => {
        const { key, value } = condition;

        let fn;
        if (checkGlobal && key in generalHandlers) {
            fn = generalHandlers[key];
        } else if (checkTarget && key in targetHandlers) {
            fn = targetHandlers[key];
        } else {
            return true;
        }

        return fn(value) === true;
    });
}

const actionHandlers = {
    stop(action, monster) {
        const { customMessage, conditions } = action;

        if (checkConditions(conditions, monster, true, false)) {
            readyNext = `Stop: ${customMessage}`;
			jpxPanelManager.updateContent('battle');
			jpxPanelManager.setBackground('#FF0');
            return true;
        }
        return false;
    },

    spellInstant(action, monster) {
        const { name, conditions } = action;

        if (
            spellCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, false)
        ) {
            readyNext = 0;
            cast(name);
            return true;
        }
        return false;
    },

    spellDuration(action, monster) {
        const { name, conditions } = action;

        if (
            spellCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, false)
        ) {
            readyNext = 0;
            cast(name);
            return true;
        }
        return false;
    },

    itemInstant(action, monster) {
        const { name, conditions } = action;

        if (
            itemCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, false)
        ) {
            readyNext = 0;
            use(name);
            return true;
        }
        return false;
    },

    itemDuration(action, monster) {
        const { name, conditions } = action;

        if (
            itemCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, false)
        ) {
            readyNext = 0;
            use(name);
            return true;
        }
        return false;
    },

    toggle(action, monster) {
        const { name, toggled, conditions } = action;
        return (
            (name !== 'Spirit' || toggled !== spiritStatus) &&
            checkConditions(conditions, monster, true, !!monster) &&
            toggle(name)
        );
    },

    target(action, monster) {
        const { priorityRule, conditions } = action;
        let { activeMonsters } = monstersObj;
        monstersObj.sorted ??= {};

        const getSorted = (fn, asc) => {
            return monstersObj.sorted[priorityRule] ??= jpxUtils.getSortedArray(activeMonsters, fn, priorityRule.includes('Low to High'));
        };

        let list = activeMonsters;
        switch (priorityRule) {
            case 'Bottom Up':
                list = monstersObj.sorted[priorityRule] ??= [...activeMonsters].reverse();
                break;
            case 'Current HP Low to High':
            case 'Current HP High to Low':
                list = getSorted(m => monsterData[m.index].maxHP * m.hpPercentage);
                break;
            case 'Current HP Percent Low to High':
            case 'Current HP Percent High to Low':
                list = getSorted(m => m.hpPercentage);
                break;
        }

        return list.find(activeMonster => checkConditions(conditions, activeMonster)) ?? null;
    },

    smartDebuff(action, monster) {
        const { conditions } = action;
        return (
            checkConditions(conditions, monster, true, false) &&
            doSpellsDebuffGoNext({ ...action })
        );
    },

    spellDebuff(action, monster) {
        const { name, conditions } = action;
        return (
            checkConditions(conditions, monster) &&
            doSpellGoNext(name, monster)
        );
    },

    spellDamage(action, monster) {
        const { name, conditions } = action;

        if (!checkConditions(conditions, monster)) return false;

        const tier = name.match(/^T(\d)$/)?.[1];
        const spell = tier ?
            spellsDamageObj[spellDamageBonus.maxType][tier - 1] :
            name;

        return doSpellGoNext(spell, monster);
    },

    skill(action, monster) {
        const { name, conditions } = action;
        return (
            checkConditions(conditions, monster) &&
            doSpellGoNext(name, monster)
        );
    },

    normalAttack(action, monster) {
        return doAttackGoNext(monster);
    },
};

function actionManager(actions, ignoreTarget = false) {
    let targetMonster = null;
    let targetLocked = false;

    for (const action of actions) {
        const handler = actionHandlers[action.type];
        if (!handler) continue;

        if (action.type === 'target') {
            if (!targetLocked) {
                targetMonster = null;

                let result = handler(action, targetMonster);
                if (result) {
                    targetMonster = result;
                    targetLocked = true;
                }
            }
            continue;
        }

        if (!ignoreTarget && action.type !== 'smartDebuff' && !targetMonster) continue;
        let result = handler(action, targetMonster);
        if (result) return true;
        targetLocked = false;
    }

    return false;
}

//Battle Record
function battleRecorder() {
    let turnLog = log.innerHTML.match(regExp.turnLog)?.[0];
    if (!turnLog) return;

    let action = turnLog.match(regExp.action)?.[1];
    if (!action) {
        /*isekai911*/
        if (turnLog.includes('<strong>Scanning')) {
            turnLog = turnLog.replace(/[\t\r\n]+/g, '').replace(/>\s+</g, '><');
            action = 'You use Scan';
        /*isekai912*/
        } else {
            return;
        }
    }
    /*isekai911*/
    if (action.includes('gains the effect')) {
        let action2 = turnLog.match(regExp.action2)?.[1];
        action2 && (action = action2);
    }
    /*isekai912*/
    let use = action.match(regExp.use)?.[2];

    if (cfgBattle.recordBattleLog) {
        battleLogRecorder();
    }
    timeRecorder(turnLog, action, use);
    if (!isekaiSuffix) {
        combatRecorder(turnLog, action, use);
    /*isekai911*/
    } else {
        combatRecorder_isekai(turnLog, action, use);
    }
    /*isekai912*/
    revenueRecorder(turnLog, action, use);
}

function battleLogRecorder() {
    let tdArray = Array.from(log.querySelectorAll('td'));
    let tlsArray = Array.from(log.querySelectorAll('.tls'));
    if (regExp.battleTypeLog.test(tdArray.at(-1).innerHTML) & tlsArray.length === 1) {
        for (let i = tdArray.length - 1; i > -1; i--) {
            if (!tdArray[i].textContent.trim() || tdArray[i].innerHTML.includes('<hr>')) {
                break;
            }
            battleLogRecordCurrent.unshift(tdArray[i].textContent);
        }
    }
    battleLogRecordCurrent.push('--------------------------------------------------');
    for (const td of tdArray) {
        if (!td.textContent.trim() || td.innerHTML.includes('<hr>')) {
            break;
        }
        if (td.querySelector('table')) {
            let clone = td.cloneNode(true);
            clone.querySelector('table')?.remove();
            clone = clone.textContent.replace(/\s+/g, ' ').trim();
            battleLogRecordCurrent.push(clone);
        } else {
            battleLogRecordCurrent.push(td.textContent.replace(/\s+/g, ' ').trim());
        }
    }

    let btcp = document.querySelector('#btcp');
    if (btcp) {
        battleLogRecordCurrent.push('++++++++++++++++++++++++++++++++++++++++++++++++++');
    }
    battleLogRecord = battleLogRecord.concat(battleLogRecordCurrent);
    battleLogRecordCurrent = [];
}

function timeRecorder(turnLog, action, use) {
    timeRecords['startTime'] ??= Date.now();
    timeRecords['action'] += 1;
    if (!regExp.zeroturn.test(action)) timeRecords['turn'] += 1;
    if (use) timeRecords['lastUse'][use] = timeRecords['turn'];
}

function riddleRecorder() {
    if (jpxUtils.isEmpty(timeRecords)) timeRecords = JSON.parse(localStorage.getItem(prefix + 'timeRecords' + isekaiSuffix) || JSON.stringify(jpxUtils.createTimeRecords()));

    // Show notification + beep when riddle appears (optional)
    try {
        if (cfgBattle && cfgBattle.notifyOnRiddle) {
            // Desktop notification (request permission if needed)
            try {
                if (typeof Notification !== 'undefined') {
                    if (Notification.permission === 'granted') {
                        new Notification('Hentaiverse', { body: '谜题大师出现了！', tag: 'jpx-riddle' });
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission().then(p => { if (p === 'granted') new Notification('Hentaiverse', { body: '谜题大师出现了！', tag: 'jpx-riddle' }); });
                    }
                }
            } catch (e) {}

            // Short beep via Web Audio API
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    const ctx = new AudioCtx();
                    const o = ctx.createOscillator();
                    const g = ctx.createGain();
                    o.type = 'sine';
                    o.frequency.value = 880;
                    g.gain.value = 0.05;
                    o.connect(g);
                    g.connect(ctx.destination);
                    o.start();
                    setTimeout(() => { try { o.stop(); ctx.close(); } catch (e) {} }, 350);
                }
            } catch (e) {}
        }
    } catch (e) {}

    let riddlesubmit = document.querySelector('#riddlesubmit')
    riddlesubmit && riddlesubmit.addEventListener('click', () => {
        timeRecords.riddle.solved += 1;
        localStorage.setItem(prefix + 'timeRecords' + isekaiSuffix, JSON.stringify(timeRecords));
    }, { once: true });
}

function combatRecorder(turnLog, action, use) {
    if (use) {
        if (
            !regExp.zeroturn.test(action) ||
            use.includes('Gem') ||
            use.includes('Caffeinated Candy') ||
            use.includes('Energy Drink')
        ) {
            jpxUtils.inc(combatRecords.use, use);
            jpxUtils.inc(actionCounts, use);
            use === 'Scan' && updateMonsterInfo();
        }
    } else if (action.includes('Spirit Stance Engaged')) {
        jpxUtils.inc(combatRecords.use, 'Spirit');
        jpxUtils.inc(actionCounts, 'Spirit');
    } else if (action.includes('Defending.')) {
        jpxUtils.inc(combatRecords.use, 'Defend');
        jpxUtils.inc(actionCounts, 'Defend');
    } else if (action.includes('Focusing.')) {
        jpxUtils.inc(combatRecords.use, 'Focus');
        jpxUtils.inc(actionCounts, 'Focus');
    } else {
        jpxUtils.inc(combatRecords.use, 'Attack');
        jpxUtils.inc(actionCounts, 'Attack');
    }

    if (turnLog.includes('You gain the effect Cloak of the Fallen.')) {
        jpxUtils.inc(combatRecords.use, 'Cloak of the Fallen');
        jpxUtils.inc(actionCounts, 'Cloak of the Fallen');
    }

    let damage = turnLog.match(regExp.damage);
    if (damage) {
        let cast = action.includes('You cast');

        for (let i = 0; i < damage.length; i++) {
            let damageType = damage[i].match(regExp.damageType);
            let damagePlus = damage[i].match(regExp.damagePlus);
            let damagePoints = damage[i].match(regExp.damagePoints);

            if (damageType) {
                //Taken
                if (damage[i].includes('its you for')) {
                    let crit = damage[i].includes(' crits ');
                    let spiritShield = damage[i].match(regExp.spiritShield);

                    //Magical Taken
                    if (damage[i].includes(' casts ')) {
                        combatRecords['magicalTaken']['hit'] += 1;
                        crit && (combatRecords['magicalTaken']['crit'] += 1);
                        jpxUtils.inc(combatRecords.magicalTaken, damageType[2], +damageType[1]);

                        if (spiritShield) {
                            jpxUtils.inc(combatRecords.magicalTaken, 'spiritShield' + 'hit');
                            if (crit) jpxUtils.inc(combatRecords.magicalTaken, 'spiritShield' + 'crit');
                            jpxUtils.inc(combatRecords.magicalTaken, 'spiritShield' + damageType[2], +spiritShield[1]);
                        }
                    //Physical Taken
                    } else {
                        combatRecords['physicalTaken']['hit'] += 1;
                        crit && (combatRecords['physicalTaken']['crit'] += 1);
                        jpxUtils.inc(combatRecords.physicalTaken, damageType[2], +damageType[1]);

                        if (spiritShield) {
                            jpxUtils.inc(combatRecords.physicalTaken, 'spiritShield' + 'hit');
                            if (crit) jpxUtils.inc(combatRecords.physicalTaken, 'spiritShield' + 'crit');
                            jpxUtils.inc(combatRecords.physicalTaken, 'spiritShield' + damageType[2], +spiritShield[1]);
                        }
                    }
                //Dealt
                } else {
                    //Magical Dealt
                    if (cast) {
                        if (!damage[i].includes(' explodes ')) {
                            combatRecords['magicalDealt']['hit'] += 1;

                            if (damage[i].includes(' blasts ')) {
                                combatRecords['magicalDealt']['crit'] += 1;
                            }
                        }
                        jpxUtils.inc(combatRecords.magicalDealt, damageType[2], +damageType[1]);
                    //Physical Dealt
                    } else {
                        if (!regExp.strike.test(damage[i])) {
                            combatRecords['physicalDealt']['hit'] += 1;

                            if (regExp.crit.test(damage[i])) {
                                combatRecords['physicalDealt']['crit'] += 1;
                            }
                        }

                        jpxUtils.inc(combatRecords.physicalDealt, damageType[2], +damageType[1]);
                    }
                }
            } else if (damagePlus) {
                //Physical Dealt
                //    <td class="tl">Bleeding Wound hits Monster for 1000 damage.</td>
                //    <td class="tl">Spreading Poison hits Monster for 1000 damage.</td>
                if (regExp.damagePhysicalPlus.test(damage[i])) {
                    jpxUtils.inc(combatRecords.physicalDealt, 'damagePlus', +damagePlus[1]);
                //Magical Dealt
                //    <td class="tl">Burning Soul hits Monster for 1000 damage.</td>
                //    <td class="tl">Ripened Soul hits Monster for 1000 damage.</td>
                } else {
                    jpxUtils.inc(combatRecords.magicalDealt, 'damagePlus', +damagePlus[1]);
                }
            } else if (damagePoints) {
                //counter
                //    <td class="tl">You counter Monster for 1000 points of void damage.</td>
                if (damage[i].includes('You counter')) {
                    jpxUtils.inc(combatRecords.physicalDealt, damagePoints[2], +damagePoints[1]);
                //spike shield
                //    <td class="tl">Your spike shield hits Monster for 1000 points of elec damage.</td>
                } else {
                    jpxUtils.inc(combatRecords.magicalDealt, damagePoints[2], +damagePoints[1]);
                }
            }
        }
    }

    let combatRecordsFactory = (regexp, combatRecordsType, combatRecordsKey) => {
        let match = turnLog.match(regexp);
        if (match) jpxUtils.inc(combatRecords[combatRecordsType], combatRecordsKey, match.length);
    }

    //Magical Dealt
    combatRecordsFactory(regExp.magicalDealtMiss, 'magicalDealt', 'miss');
    combatRecordsFactory(regExp.magicalDealtEvade, 'magicalDealt', 'evade');
    combatRecordsFactory(regExp.magicalDealtResist50, 'magicalDealt', 'resist50');
    combatRecordsFactory(regExp.magicalDealtResist75, 'magicalDealt', 'resist75');
    combatRecordsFactory(regExp.magicalDealtResist90, 'magicalDealt', 'resist90');
    combatRecordsFactory(regExp.magicalDealtResist, 'magicalDealt', 'resist');

    //Physical Dealt
    combatRecordsFactory(regExp.physicalDealtMiss, 'physicalDealt', 'miss');
    combatRecordsFactory(regExp.physicalDealtEvade, 'physicalDealt', 'evade');
    combatRecordsFactory(regExp.physicalDealtParry, 'physicalDealt', 'parry');

    //Magical Taken
    //    miss
    combatRecordsFactory(regExp.magicalTakenEvade, 'magicalTaken', 'evade');
    combatRecordsFactory(regExp.magicalTakenResist50, 'magicalTaken', 'resist50');
    combatRecordsFactory(regExp.magicalTakenResist75, 'magicalTaken', 'resist75');
    combatRecordsFactory(regExp.magicalTakenResist90, 'magicalTaken', 'resist90');
    //    resist
    combatRecordsFactory(regExp.magicalTakenBlock, 'magicalTaken', 'block');

    //Physical Taken
    combatRecordsFactory(regExp.physicalTakenMiss, 'physicalTaken', 'miss');
    combatRecordsFactory(regExp.physicalTakenEvade, 'physicalTaken', 'evade');
    combatRecordsFactory(regExp.physicalTakenParry, 'physicalTaken', 'parry');
    combatRecordsFactory(regExp.physicalTakenBlock, 'physicalTaken', 'block');

    //counter
    combatRecordsFactory(regExp.counter, 'use', 'Counter');
}

/*isekai911*/
function combatRecorder_isekai(turnLog, action, use) {
    if (use) {
        if (
            !regExp.zeroturn.test(action) ||
            use.includes('Gem') ||
            use.includes('Caffeinated Candy') ||
            use.includes('Energy Drink')
        ) {
            jpxUtils.inc(combatRecords.use, use);
            jpxUtils.inc(actionCounts, use);
            use === 'Scan' && updateMonsterInfo();
        }
    } else if (action.includes('Spirit Stance Engaged')) {
        jpxUtils.inc(combatRecords.use, 'Spirit');
        jpxUtils.inc(actionCounts, 'Spirit');
    } else if (action.includes('Defending.')) {
        jpxUtils.inc(combatRecords.use, 'Defend');
        jpxUtils.inc(actionCounts, 'Defend');
    } else if (action.includes('Focusing.')) {
        jpxUtils.inc(combatRecords.use, 'Focus');
        jpxUtils.inc(actionCounts, 'Focus');
    } else {
        jpxUtils.inc(combatRecords.use, 'Attack');
        jpxUtils.inc(actionCounts, 'Attack');
    }

    if (turnLog.includes('You gain the effect Cloak of the Fallen.')) {
        jpxUtils.inc(combatRecords.use, 'Cloak of the Fallen');
        jpxUtils.inc(actionCounts, 'Cloak of the Fallen');
    }

    let damage = turnLog.match(regExp.damage_isekai);
    if (damage) {
        for (let i = 0; i < damage.length; i++) {
            let damageTaken = jpxUtils.matchAny(damage[i], regExp.damageTaken1_isekai, regExp.damageTaken2_isekai);
            let spiritShield = damage[i].match(regExp.spiritShield_isekai);
            let damageDealt = jpxUtils.matchAny(damage[i], regExp.damageDealt1_isekai, regExp.damageDealt2_isekai);
            let strike = damage[i].match(regExp.strike_isekai);
            let explode = damage[i].match(regExp.explode_isekai);
            let damagePlus = damage[i].match(regExp.damagePlus_isekai);
            let damagePoints = damage[i].match(regExp.damagePoints_isekai);

            //Taken
            if (damageTaken?.groups) {
                let glance = damageTaken.groups.v.includes('glance');
                let crit = damageTaken.groups.v.includes('crit');
                let hit = !glance && !crit;
                let damageType = jpxUtils.lowerFirst(damageTaken.groups.t);
                //Magical Taken
                if (damage[i].includes(' casts ')) {
                    glance && (combatRecords.magicalTaken.glance += 1);
                    hit && (combatRecords.magicalTaken.hit += 1);
                    crit && (combatRecords.magicalTaken.crit += 1);
                    jpxUtils.inc(combatRecords.magicalTaken, damageType, +damageTaken.groups.n);
                //Physical Taken
                } else {
                    glance && (combatRecords.physicalTaken.glance += 1);
                    hit && (combatRecords.physicalTaken.hit += 1);
                    crit && (combatRecords.physicalTaken.crit += 1);
                    jpxUtils.inc(combatRecords.physicalTaken, damageType, +damageTaken.groups.n);
                }
            } else if (spiritShield) {
                jpxUtils.inc(combatRecords.physicalTaken, 'spiritShield' + 'hit');
                jpxUtils.inc(combatRecords.physicalTaken, 'spiritShield' + 'damagePlus', +spiritShield[1]);
            //Dealt
            } else if (damageDealt?.groups) {
                let glance = damageDealt.groups.v.includes('glance');
                let crit = damageDealt.groups.v.includes('crit');
                let critStack = parseInt(damageDealt.groups.s) || 1;
                let hit = !glance && !crit;
                let damageType = jpxUtils.lowerFirst(damageDealt.groups.t);
                //Magical Dealt
                if (action.includes('You cast')) {
                    glance && (combatRecords.magicalDealt.glance += 1);
                    hit && (combatRecords.magicalDealt.hit += 1);
                    crit && (combatRecords.magicalDealt.crit += 1);
                    jpxUtils.inc(combatRecords.magicalDealt, damageType, +damageDealt.groups.n);
                //Physical Dealt
                } else {
                    glance && (combatRecords.physicalDealt.glance += 1);
                    hit && (combatRecords.physicalDealt.hit += 1);
                    if (crit) {
                        combatRecords.physicalDealt.crit += 1;
                        jpxUtils.inc(combatRecords.physicalDealt, `crit${critStack}`);
                    }
                    jpxUtils.inc(combatRecords.physicalDealt, damageType, +damageDealt.groups.n);
                }
            } else if (strike) {
                let damageType = jpxUtils.lowerFirst(strike[3]);
                jpxUtils.inc(combatRecords.physicalDealt, damageType, +strike[2]);
            } else if (explode) {
                let damageType = jpxUtils.lowerFirst(explode[2]);
                jpxUtils.inc(combatRecords.magicalDealt, damageType, +explode[1]);
            } else if (damagePlus) {
                //Physical Dealt
                //    <td class="tl">Bleeding Wound hits Monster for 1000 damage.</td>
                //    <td class="tl">Spreading Poison hits Monster for 1000 damage.</td>
                if (regExp.damagePhysicalPlus_isekai.test(damage[i])) {
                    jpxUtils.inc(combatRecords.physicalDealt, 'damagePlus', +damagePlus[1]);
                //Magical Dealt
                //    <td class="tl">Burning Soul hits Monster for 1000 damage.</td>
                //    <td class="tl">Ripened Soul hits Monster for 1000 damage.</td>
                } else {
                    jpxUtils.inc(combatRecords.magicalDealt, 'damagePlus', +damagePlus[1]);
                }
            } else if (damagePoints) {
                let damageType = jpxUtils.lowerFirst(damagePoints[2]);
                //counter
                //    <td class="tl">You counter Monster for 1000 points of void damage.</td>
                if (damage[i].includes('You counter')) {
                    jpxUtils.inc(combatRecords.physicalDealt, damageType, +damagePoints[1]);
                //spike shield
                //    <td class="tl">Your spike shield hits Monster for 1000 points of elec damage.</td>
                } else {
                    jpxUtils.inc(combatRecords.magicalDealt, damageType, +damagePoints[1]);
                }
            }
        }
    }

    //debuff
    let debuffLog = turnLog.match(regExp.debuffLog_isekai)?.[0];
    if (debuffLog) {
        let debuffResist0 = debuffLog.match(regExp.debuffResist0_isekai)?.length || 0;
        let debuffResist1 = debuffLog.match(regExp.debuffResist1_isekai)?.length || 0;
        let debuffResist3 = debuffLog.match(regExp.debuffResist3_isekai)?.length || 0;
        jpxUtils.inc(combatRecords.magicalDealt, 'debuffResist0', debuffResist0 - debuffResist1);
        jpxUtils.inc(combatRecords.magicalDealt, 'debuffResist1', debuffResist1);
        jpxUtils.inc(combatRecords.magicalDealt, 'debuffResist3', debuffResist3);
    }

    /*patch*/
    let patchBlock = turnLog.match(/You block the attack\./g);
    if (patchBlock) jpxUtils.inc(combatRecords.magicalTaken, 'block', -patchBlock.length);
    let patchBlockAndParry = turnLog.match(/You block and parry the attack/g);
    if (patchBlockAndParry) jpxUtils.inc(combatRecords.physicalTaken, 'blockAndParry', patchBlockAndParry.length);

    let combatRecordsFactory = (regexp, combatRecordsType, combatRecordsKey) => {
        let match = turnLog.match(regexp);
        if (match) jpxUtils.inc(combatRecords[combatRecordsType], combatRecordsKey, match.length);
    }

    //Magical Dealt
    combatRecordsFactory(regExp.magicalDealtMiss_isekai, 'magicalDealt', 'miss');
    combatRecordsFactory(regExp.magicalDealtEvade_isekai, 'magicalDealt', 'evade');
    combatRecordsFactory(regExp.magicalDealtResistPartially_isekai, 'magicalDealt', 'resistPartially');
    combatRecordsFactory(regExp.magicalDealtResist_isekai, 'magicalDealt', 'resist');

    //Physical Dealt
    combatRecordsFactory(regExp.physicalDealtMiss_isekai, 'physicalDealt', 'miss');
    combatRecordsFactory(regExp.physicalDealtEvade_isekai, 'physicalDealt', 'evade');
    combatRecordsFactory(regExp.physicalDealtParryPartially_isekai, 'physicalDealt', 'parryPartially');
    combatRecordsFactory(regExp.physicalDealtParry_isekai, 'physicalDealt', 'parry');

    //Magical Taken
    combatRecordsFactory(regExp.magicalTakenMiss_isekai, 'magicalTaken', 'miss');
    combatRecordsFactory(regExp.magicalTakenEvade_isekai, 'magicalTaken', 'evade');
    combatRecordsFactory(regExp.magicalTakenBlockPartially_isekai, 'magicalTaken', 'blockPartially');
    combatRecordsFactory(regExp.magicalTakenBlock_isekai, 'magicalTaken', 'block');
    combatRecordsFactory(regExp.magicalTakenResistPartially_isekai, 'magicalTaken', 'resistPartially');

    //Physical Taken
    combatRecordsFactory(regExp.physicalTakenMiss_isekai, 'physicalTaken', 'miss');
    combatRecordsFactory(regExp.physicalTakenEvade_isekai, 'physicalTaken', 'evade');
    combatRecordsFactory(regExp.physicalTakenParryPartially_isekai, 'physicalTaken', 'parryPartially');
    combatRecordsFactory(regExp.physicalTakenParry_isekai, 'physicalTaken', 'parry');
    combatRecordsFactory(regExp.physicalTakenBlockPartially_isekai, 'physicalTaken', 'blockPartially');
    combatRecordsFactory(regExp.physicalTakenBlock_isekai, 'physicalTaken', 'block');

    //Counter
    combatRecordsFactory(regExp.counter_isekai, 'use', 'Counter');
}
/*isekai912*/

function revenueRecorder(turnLog, action, use) {
    if (
        use && regExp.zeroturn.test(action) &&
        !use.includes('Gem') &&
        !use.includes('Caffeinated Candy') &&
        !use.includes('Energy Drink')
    ) {
        revenueRecords['consumable'][use] ??= { use: 0, drop: 0 };
        revenueRecords['consumable'][use]['use'] += 1;
        jpxUtils.inc(actionCounts, use);
    }

    let gainExp = turnLog.match(regExp.gainExp);
    if (gainExp) revenueRecords['exp'] += +gainExp[1];

    let gainCredit = turnLog.match(regExp.gainCredit);
    if (gainCredit) revenueRecords['credit'] += +gainCredit[1];

    let proficiencies = turnLog.match(regExp.proficiencies);
    if (proficiencies) {
        for (let i = 0; i < proficiencies.length; i++) {
            let proficiency = proficiencies[i].match(regExp.proficiency);
            if (proficiency) {
                let prof = parseFloat(proficiency[1]);
                if (prof > 0) {
                    jpxUtils.inc(revenueRecords.proficiency, proficiency[2], prof);
                }
            }
        }
    }

    let dropLogs = turnLog.match(regExp.dropsLogs) || [];
    for (let dropLog of dropLogs) {
        let drop = dropLog.match(regExp.drop) || []; //drop[4]: sold, salvaged
        switch (drop[2]) {
            //Equipment, Material
            case 'FF0000': {
                if (!drop[4]){
                    let quality = drop[3].match(regExp.quality)?.[1];
                    if (quality) {
                        revenueRecords['equipment'][quality] ??= [];
                        revenueRecords['equipment'][quality].push(drop[3]);
                    } else {
                        jpxUtils.inc(revenueRecords.material, drop[3], +drop[1] || 1);
                    }
                }
                break;
            }
            //Credit
            case 'A89000': {
                let credit = drop[3].match(regExp.credit);
                if (credit) {
                    revenueRecords['credit'] += (+credit[1] || 1);
                }
                break;
            }
            //Consumable
            //    Restorative: Draught, Potion, Elixir
            //    Infusion: Flames, Frost, Storms, Lighting, Divinity, Darkness
            //    Scroll: Swiftness, Protection, the Avatar, Absorption, Shadows, Life, the Gods
            //    Shard: Voidseeker Shard, Aether Shard, Featherweight Shard, Amnesia Shard, World Seed
            //    Special Item: Flower Vase, Bubble Gum
            case '00B000': {
                if (!drop[3].includes('Gem')) {
                    revenueRecords['consumable'][drop[3]] ??= { use: 0, drop: 0 };
                    revenueRecords['consumable'][drop[3]]['drop'] += 1;
                }
                break;
            }
            //Token
            //    Token of Blood, Chaos Token, Soul Fragment
            case '254117': {
                if (drop[3].includes('Blood')) {
                    jpxUtils.inc(revenueRecords.token, 'Token of Blood');
                } else if (drop[3].includes('Chaos')) {
                    jpxUtils.inc(revenueRecords.token, 'Chaos Token');
                } else if (drop[3].includes('Soul')) {
                    jpxUtils.inc(revenueRecords.token, 'Soul Fragment', drop[1] === 'five' ? 5 : (+drop[1].match(/\d+/)?.[0] || 1));
                }
                break;
            }
            //Food
            case '489EFF': {
                jpxUtils.inc(revenueRecords.food, drop[3]);
                break;
            }
            //Artifact, Collectable
            case '0000FF': {
                if (drop[3].includes('Figurine')) {
                    jpxUtils.inc(revenueRecords.figurine, drop[3]);
                } else {
                    jpxUtils.inc(revenueRecords.artifact, drop[3]);
                }
                break;
            }
            //Trophy, World Seed, Charm
            case '461B7E': {
                /*isekai911*/
                if (drop[3].includes('World Seed')) {
                    revenueRecords['consumable'][drop[3]] ??= { use: 0, drop: 0 };
                    revenueRecords['consumable'][drop[3]]['drop'] += +drop[1].match(/\d+/)?.[0] || 1;
                /*isekai912*/
                } else {
                    jpxUtils.inc(revenueRecords.trophy, drop[3]);
                }
                break;
            }
            //Crystal
            case 'BA05B4': {
                let crystal = drop[3].match(regExp.crystal);
                if (crystal) jpxUtils.inc(revenueRecords.crystal, crystal[2], +crystal[1] || 1);
                break;
            }
        }
    }
}

async function battleRecordPlayer() {
    if (Object.keys(cfgStats).length < 1) {
        let storedCfgStats = {};
        try {
            storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
        } catch (err) {
            console.warn('Failed to load cfgStats. Using default cfgStats.');
            storedCfgStats = {};
        }
        mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');
    }

    let startTime = timeRecords['startTime'] || 0;
    let timestamp = new Date(timeRecords['startTime']).toISOString().slice(0, 19).replace('T', ' ');
    let date = timestamp.slice(0, 10);
    let result = 'undefined';
    if (log.innerHTML.includes('You are Victorious!')) {
        result = 'Victory';
    } else if (log.innerHTML.includes('You have been defeated.')) {
        result = 'Defeat';
    } else if (log.innerHTML.includes('You have escaped from the battle.')) {
        result = 'Flee';
    }
    let deltaSeconds = Math.round((Date.now() - startTime) / 1000);
    let deltaTime = jpxUtils.secondsToTime(deltaSeconds);
    let action = timeRecords['action'];
    let tps = Math.round(action / deltaSeconds * 100) / 100;

    //revenueRecords
    let priceData = await jpxMarket.getMarketPrice();
    for (const [categoryKey, categoryValue] of Object.entries(revenueRecords)) {
        switch (categoryKey) {
            case ('proficiency'):
                for (const [key, value] of Object.entries(categoryValue)) {
                    categoryValue[key] = Math.round(value * 1000) / 1000;
                }
                break;
            case ('consumable'):
                for (const [key, value] of Object.entries(categoryValue)) {
                    value['balance'] = value['drop'] - value['use'];
                    jpxUtils.inc(categoryValue, 'profit', (priceData[key] || 0) * value['balance']);
                }
                break;
            case ('material'):
            case ('token'):
            case ('food'):
            case ('figurine'):
            case ('artifact'):
            case ('trophy'):
                for (const [key, value] of Object.entries(categoryValue)) {
                    jpxUtils.inc(categoryValue, 'profit', (priceData[key] || 0) * value);
                }
                break;
            case ('crystal'):
                for (const [key, value] of Object.entries(categoryValue)) {
                    jpxUtils.inc(categoryValue, 'total', value);
                    jpxUtils.inc(categoryValue, 'profit', (priceData[key] || 0) * value);

                }
                break;
        }
        if (categoryValue?.['profit']) {
            categoryValue['profit'] = Math.round(categoryValue['profit'] * 10) / 10;
            revenueRecords['totalProfit'] += categoryValue['profit'];
        }
    }

    revenueRecords['totalProfit'] += revenueRecords['credit'] || 0;
    revenueRecords['totalProfit'] = Math.round(revenueRecords['totalProfit']);

    //Stamina
    let stamina = parseFloat(localStorage.getItem(prefix + 'stamina' + isekaiSuffix)) || 80;
    let greatCost = !isekaiSuffix ? 0.03 : 0.06;
    let normalCost = !isekaiSuffix ? 0.02 : 0.04;
    let greatRoundQuota = Math.floor(Math.max(0, stamina - (battleType === 'Battle1000' ? 1 : 0) - 60) / greatCost);
    let greatRound = Math.min(greatRoundQuota, roundInfo.current);
    let normalRound = roundInfo.current - greatRound;
    let staminaCost = greatRound * greatCost + normalRound * normalCost;

    if (battleType === 'Encounter' || battleType === 'Colosseum') {
        staminaCost = 0;
    } else if (battleType === 'Battle1000') {
        staminaCost += 1;
    }
    //    Daily 24 and LongGoneBeforeDaylight 20
    let staminaRecords = JSON.parse(localStorage.getItem(prefix + 'staminaRecords' + isekaiSuffix) || '{}');
    let currentDate = new Date().toISOString().slice(0, 10);
    if (
        !staminaRecords?.lastUpdate ||
        new Date(staminaRecords.lastUpdate).toISOString().slice(0, 10) != currentDate
    ) {
        staminaRecords = { lastUpdate: Date.now(), staminaCost: 0 };
    }

    let staminaQuota = 24 + (!isekaiSuffix ? cfgBattle.dailyStaminaQuotaPlus : 0) - staminaRecords.staminaCost;
    if (staminaCost > staminaQuota) {
        if (staminaQuota > 0) {
            revenueRecords['staminaCost'] = Math.round((staminaCost - staminaQuota) * 10) / 10;
        } else {
            revenueRecords['staminaCost'] = Math.round(staminaCost * 10) / 10;
        }
    } else {
        revenueRecords['staminaCost'] = 0;
    }
    staminaRecords.staminaCost = Math.round((staminaRecords.staminaCost + staminaCost) * 10) / 10;
    localStorage.setItem(prefix + 'staminaRecords' + isekaiSuffix, JSON.stringify(staminaRecords));
    //Final Profit
    let staminaUnitPrice = priceData['Energy Drink'] / 10;
    let staminaProfit = Math.round(-revenueRecords['staminaCost'] * staminaUnitPrice * 10) / 10;
    revenueRecords['finalProfit'] = Math.round((revenueRecords['totalProfit'] + staminaProfit) * 10) / 10;

    let battleRecords = {
        world: !isekaiSuffix ? 'Persistent' : 'Isekai',
        timestamp: timestamp,
        date: date,
        playerLevel: parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix)) || 0,
        difficulty: difficultyMap[localStorage.getItem(prefix + 'difficulty' + isekaiSuffix)] || 0,
        persona: localStorage.getItem(prefix + 'persona' + isekaiSuffix),
        battleType: battleType,
        towerFloor: towerFloor,
        roundInfo: roundInfo,
        result: result,
        deltaSeconds: deltaSeconds,
        deltaTime: deltaTime,
        turns: timeRecords.action,
        tps: tps,
        riddle: timeRecords.riddle.total,
        combatRecords: combatRecords,
        revenueRecords: revenueRecords,
    }

    timeRecordPlayer(battleRecords);
    combatRecordPlayer(combatRecords);
    revenueRecordPlayer(revenueRecords, priceData);
    if (cfgBattle.recordBattleLog) battleLogPlayer();

    storeBattleRecords(battleRecords)
        .then(result => console.log(result))
        .catch(err => console.error('Save failed: ', err));

    cfgBattle.recordBattleLog && console.log(battleLogRecord);
    console.log(timeRecords);
    console.log(combatRecords);
    console.log(revenueRecords);
    console.log(battleRecords);
}

function battleLogPlayer() {
    let blob = new Blob([JSON.stringify(battleLogRecord, null, '\t')], { type: 'text/plain;charset=utf-8' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    log.parentNode.insertBefore(a, log.parentNode.firstChild);
    a.innerText = 'Download Battle Log';
    a.style.cssText = 'float: left; font-size: 200%; margin: 10px 0px;';
    a.href = url;
    a.download = 'battleLog.txt';
}

function timeRecordPlayer(battleRecords) {
    let btcp = document.querySelector('#btcp');
    if (!btcp) return;
    let div = document.createElement('div');
    div.id = 'time-records-div';

    let riddleSolved = timeRecords.riddle.solved < timeRecords.riddle.total ? `${timeRecords.riddle.solved} / ` : '';
    div.innerText =
        `${battleRecords.turns.toLocaleString()} ${t('tP.turns')}   ${battleRecords.deltaTime}  (${battleRecords.tps} ${t('tP.t/s')})   ` +
        `${riddleSolved}${timeRecords.riddle.total} ${t('tP.riddle')}   ${combatRecords.use['Cloak of the Fallen'] || 0} ${t('tP.spark')}`;
    btcp.appendChild(div);
}

function combatRecordPlayer(combatRecords) {
    let table = document.createElement('table');
    table.id = 'combat-records-table';
    table.className = 'records-table';
    let tbody = document.createElement('tbody');

    let innerHTML = `
        <tr>
            <td></td>
            <td colspan="3">${t('cP.damageDealt')}</td>
            <td colspan="5">${t('cP.damageTaken')}</td>
        </tr>
        <tr>
            <td></td>
            <td>${t('cP.physical')}</td><td>${t('cP.magical')}</td><td>${t('cP.total')}</td>
            <td>${t('cP.physical')}</td><td>${t('cP.spirit')}</td><td>${t('cP.magical')}</td><td>${t('cP.spirit')}</td><td>${t('cP.total')}</td>
        </tr>`;
    /*isekai911*/
    if (isekaiSuffix) {
        innerHTML = `
            <tr>
                <td></td>
                <td colspan="3">${t('cP.damageDealt')}</td>
                <td colspan="4">${t('cP.damageTaken')}</td>
            </tr>
            <tr>
                <td></td>
                <td>${t('cP.physical')}</td><td>${t('cP.magical')}</td><td>${t('cP.total')}</td>
                <td>${t('cP.physical')}</td><td>${t('cP.magical')}</td><td>${t('cP.spirit')}</td><td>${t('cP.total')}</td>
            </tr>`;
    }
    /*isekai912*/

    function renderCombatRow(label, rowId, style, combatRecords, rowConfig) {
        let pd = combatRecords.physicalDealt[rowId] ?? 0;
        let md = combatRecords.magicalDealt[rowId] ?? 0;
        let td = pd + md;

        let pt = combatRecords.physicalTaken[rowId] ?? 0;
        let pts = combatRecords.physicalTaken['spiritShield' + rowId] ?? 0;
        let mt = combatRecords.magicalTaken[rowId] ?? 0;
        let mts = combatRecords.magicalTaken['spiritShield' + rowId] ?? 0;
        let tt = pt + pts + mt + mts;

        let dataObj = { label, pd, md, td, pt, pts, mt, mts, tt };
        let order = ['label', 'pd', 'md', 'td', 'pt', 'pts', 'mt', 'mts', 'tt'];
        /*isekai911*/
        if (isekaiSuffix) order = ['label', 'pd', 'md', 'td', 'pt', 'mt', 'pts', 'tt'];
        /*isekai912*/

        let html = `<tr ${style}>`;
        order.forEach((k, index) => {
            let v = dataObj[k];
            let styleStr = rowConfig[`s_${k}`] || '';
            let styleText = styleStr ? ` style="${styleStr}"` : '';
            html += `<td${styleText}>${(v === 0 && index !== 0) ? '' : v.toLocaleString()}</td>`;
        });
        html += '</tr>';
        return html;
    };

    let totals = {};
    let totalsTypes = ['damage', 'result', 'resultPartially'];
    COMBAT_FIELDS.forEach(f => {
        if (!totalsTypes.includes(f.type) || f.isTotal) return;
        totals[f.type] ??= { pd: 0, md: 0, pt: 0, pts: 0, mt: 0, mts: 0 };

        let acc = totals[f.type];
        acc.pd += (combatRecords.physicalDealt[f.id] ?? 0);
        acc.md += (combatRecords.magicalDealt[f.id] ?? 0);
        acc.pt += (combatRecords.physicalTaken[f.id] ?? 0);
        acc.pts += (combatRecords.physicalTaken['spiritShield' + f.id] ?? 0);
        acc.mt += (combatRecords.magicalTaken[f.id] ?? 0);
        acc.mts += (combatRecords.magicalTaken['spiritShield' + f.id] ?? 0);
    });

    cfgStats.combatRows.forEach(row => {
        /*isekai911*/
        let excludeIds = !isekaiSuffix
            ? ['glance', 'parryPartially', 'resistPartially', 'blockPartially']
            : ['resist50', 'resist75', 'resist90'];
        if (excludeIds.includes(row.id)) return;
        /*isekai912*/

        let field = COMBAT_FIELDS.find(f => f.id === row.id);
        let styleNormal = row.styleText ? `style="${row.styleText}"` : '';
        let styleTotal = `style="border-top: 1px solid; border-bottom: 1px solid; ${row.styleText || ''}"`;

        switch (field.type) {
            case 'damage':
            case 'result':
            case 'resultPartially': {
                if (field.isTotal) {
                    let totalData = { ...(totals[field.type] || { pd: 0, md: 0, pt: 0, pts: 0, mt: 0, mts: 0 }) };
                    /*patch*/if (isekaiSuffix && field.type === 'result') totalData.pt -= combatRecords.physicalTaken.blockAndParry || 0;
                    innerHTML += renderCombatRow(t(field.label), 'total', styleTotal, {
                        physicalDealt: { total: totalData.pd || 0 },
                        magicalDealt: { total: totalData.md || 0 },
                        physicalTaken: { total: totalData.pt || 0, spiritShieldtotal: totalData.pts || 0 },
                        magicalTaken: { total: totalData.mt || 0, spiritShieldtotal: totalData.mts || 0 }
                    }, row);
                } else {
                    innerHTML += renderCombatRow(t(field.label), field.id, styleNormal, combatRecords, row);
                }
                break;
            }
        }
    });

    /*isekai911*/
    if (isekaiSuffix) {
        innerHTML += `
            <tr style="border-top: 1px solid; border-bottom: 1px solid;">
                <td colspan="2" style="text-align: center;">${t('cP.critStack')}</td>
                <td colspan="2" style="text-align: center;">${t('cP.debuffResist')}</td>
                <td colspan="4"></td>
            </tr>
        `;

        let debuffResistTotal = 0;
        let debuffMap = {
            1: { key: 'debuffResist0', label: t('cP.debuffResist0') },
            2: { key: 'debuffResist1', label: t('cP.debuffResist1-2') },
            3: { key: 'debuffResist3', label: t('cP.debuffResist3') },
        };

        for (let i = 1; i < 10; i++) {
            let critStack = combatRecords.physicalDealt[`crit${i}`];
            if (i <= 4) {
                innerHTML += `<tr><td>${i}x-${t('cP.crit')}</td><td>${(critStack || '').toLocaleString()}</td>`;
                if (i < 4) {
                    let value = combatRecords.magicalDealt[debuffMap[i].key] || 0;
                    debuffResistTotal += value;
                    innerHTML += `<td style="text-align: left;">${debuffMap[i].label}</td><td>${(value || '').toLocaleString()}</td>`;
                } else if (i === 4) {
                    innerHTML += `<td style="border: 1px solid; text-align: left;">${t('cP.total')}</td><td style="border: 1px solid;">${(debuffResistTotal || '').toLocaleString()}</td>`;
                }
                innerHTML += '<td colspan="4"></td></tr>';
            } else if (critStack) {
                innerHTML += `<tr><td>${i}x-${t('cP.crit')}</td><td>${(critStack || '').toLocaleString()}</td><td colspan="6"></td></tr>`;
            }
        }
    }
    /*isekai912*/

    tbody.innerHTML = innerHTML;
    table.appendChild(tbody);
    log.parentNode.insertBefore(table, log.parentNode.firstChild);

    combatRecordPlayer_Use(combatRecords)
}

function combatRecordPlayer_Use(combatRecords) {
    let table = document.createElement('table');
    table.id = 'combat-records-use-table';

    let tbody = document.createElement('tbody');

    let innerHTML = `<tr><th colspan="2">${t('cP.used')}</th></tr>`;

    function renderCombatUseRow(label, entries) {
        if (!entries.length) return;
        innerHTML += `<tr><td>${t(label)}</td><td>${entries.join(', ')}</td></tr>`;
    }

    let useKeys = new Set();
    let temp_combatUseRows = [{"id":"action"}, {"id":"item"}, {"id":"skill"}, {"id":"spellSupport"}, {"id":"spellDamage"}, {"id":"spellDebuff"}];
    temp_combatUseRows.forEach(row => {
        let field = COMBAT_USE_FIELDS.find(f => f.id === row.id);
        let entries = [];
        for (const { key, label } of field.keys) {
            let count = combatRecords.use[key];
            if (count) {
                entries.push(`${t(label)}: ${count}`);
                useKeys.add(key);
            }
        }
        renderCombatUseRow(field.label, entries);
    });

    let others = [];
    for (const [key, value] of Object.entries(combatRecords.use)) {
        if (useKeys.has(key)) continue;
        others.push(`${t(`cB.${key}`)}: ${value}`);
    }
    renderCombatUseRow(t('cP.misc'), others);

    tbody.innerHTML = innerHTML;
    table.appendChild(tbody);
    let combatRecordsTable = document.querySelector('#combat-records-table');
    combatRecordsTable.parentNode.insertBefore(table, combatRecordsTable.nextSibling);
}

function revenueRecordPlayer(revenueRecords, priceData) {
    let btcp = document.querySelector('#btcp');
    if (!btcp) return;

    let table = document.createElement('table');
    table.id = 'revenue-records-table';
    table.className = 'records-table';
    let tbody = document.createElement('tbody');

    let innerHTML = `
        <tr style="border: 1px solid;"><td colspan="6">${t('rP.revenue')}</td></tr>
        <tr style="border: 1px solid;">
            <td style="text-align: left;">${t('rP.name')}</td>
            <td>${t('rP.drop')}</td><td>${t('rP.use')}</td><td>${t('rP.balance')}</td><td>${t('rP.unitPrice')}</td><td>${t('rP.profit')}</td>
        </tr>`;

    cfgStats.revenueRows.forEach(row => {
        let field = REVENUE_FIELDS.find(f => f.id === row.id);
        let data = revenueRecords[field.source || field.id];
        let styleNormal = row.styleText ? `style="${row.styleText}"` : '';
        let styleFirst = `style="border-top: 1px solid; ${row.styleText || ''}"`;

        switch (field.type) {
            case 'simple': {
                let value = field.key ? data[field.key] : data;
                if (value) {
                    innerHTML += `<tr${value < 0 ? ' class="deficit"' : ''} ${styleFirst}>
                        <td>${t(field.label)}</td>
                        <td colspan="5" style="text-align: center;">${value.toLocaleString()}</td>
                    </tr>`;
                }
                break;
            }
            case 'list_flat':
            case 'list_paired': {
                let dataKeys = Object.keys(data);
                let sortedKeys = jpxUtils.getSortedKeys(field.order || [], dataKeys);

                let items = [];
                sortedKeys.forEach(sortedKey => {
                    if (field.type === 'list_flat') items.push(...data[sortedKey]);
                    else if (field.type === 'list_paired') items.push(`${t(`rP.${sortedKey}`)}: ${data[sortedKey]}`);
                });
                if (!items.length) break;

                let firstItem = items.shift();
                innerHTML += `<tr ${styleFirst}>
                    <td rowspan="${items.length + 1}">${t(field.label)}</td>
                    <td colspan="5" style="text-align: center;">${firstItem}</td>
                </tr>`;
                items.forEach(item => {
                    innerHTML += `<tr ${styleNormal}><td colspan="5" style="text-align: center;">${item}</td></tr>`;
                });
                break;
            }
            case 'grid':
            case 'grid_detailed': {
                let dataKeys = Object.keys(data).filter(key => {
                    if (key === 'total' || key === 'profit') return false;
                    let value = data[key];
                    if (value && typeof value === 'object') return !jpxUtils.isEmpty(value);
                    return value;
                });
                let sortedKeys = jpxUtils.getSortedKeys(field.order || [], dataKeys);
                if (!sortedKeys.length) break;

                const renderRow = (key, rowStyle) => {
                    let value = data[key];
                    let balance = (field.type === 'grid_detailed') ? (value.drop - value.use) : value;
                    let unitPrice = priceData[key];
                    let tdClass = !isNaN(unitPrice) ? '' : ' class="noData"';
                    let tdUnitPrice = !isNaN(unitPrice) ? unitPrice.toLocaleString() : t('rP.noData');
                    let tdProfit = !isNaN(unitPrice) ? (Math.round(unitPrice * balance * 10) / 10).toLocaleString() : t('rP.noData') ;
                    let profitTds = `<td${tdClass}>${tdUnitPrice}</td><td${tdClass}>${tdProfit}</td>`;

                    if (field.type === 'grid_detailed') {
                        return `<tr${balance < 0 ? ' class="deficit"' : ''} ${rowStyle}>
                            <td>${t(`rP.${key}`)}</td><td>${value.drop}</td><td>${value.use}</td><td>${balance}</td>${profitTds}
                        </tr>`;
                    } else {
                        return `<tr ${rowStyle}>
                            <td>${t(`rP.${key}`)}</td><td colspan="3">${value}</td>${profitTds}
                        </tr>`;
                    }
                };

                let firstKey = sortedKeys.shift();
                innerHTML += renderRow(firstKey, styleFirst);
                sortedKeys.forEach(sortedKey => innerHTML += renderRow(sortedKey, styleNormal));
                break;
            }
            case 'total': {
                if (data && data.total) {
                    innerHTML += `<tr ${styleFirst}>
                        <td>${t(field.label)}</td>
                        <td colspan="3">${data.total}</td><td></td><td>${data.profit}</td>
                    </tr>`;
                }
                break;
            }
            case 'stamina': {
                let staminaRecords = JSON.parse(localStorage.getItem(prefix + 'staminaRecords' + isekaiSuffix) || '{}');
                let staminaCost = staminaRecords?.staminaCost ?? 0;
                let staminaQuotaTotal = 24 + (!isekaiSuffix ? cfgBattle.dailyStaminaQuotaPlus : 0)
                let unitPrice = priceData['Energy Drink'] / 10;
                let balance = -revenueRecords.staminaCost || 0;
                let profit = Math.round(balance * unitPrice * 10) / 10;
                innerHTML += `<tr${profit < 0 ? ' class="deficit"' : ''} ${styleFirst}>
                    <td>${t(field.label)}</td><td>${staminaQuotaTotal}</td><td>${staminaCost}</td><td>${balance}</td>
                    <td>${unitPrice.toLocaleString()}</td><td>${profit.toLocaleString()}</td>
                </tr>`;
                break;
            }
            case 'summary': {
                let trClass = data < 0 ? 'deficit' : (data > 0 ? 'surplus' : '');
                innerHTML += `<tr class="${trClass}" ${styleFirst}>
                    <td>${t(field.label)}</td>
                    <td colspan="5" style="text-align: center;">${data.toLocaleString()}</td>
                </tr>`;
                break;
            }
        }
    });

    tbody.innerHTML = innerHTML;
    table.appendChild(tbody);
    btcp.appendChild(table);
}

//Indexed DB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open('jpx', 1);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains('battleRecords')) {
                let objectStore = db.createObjectStore('battleRecords', {
                    keyPath: 'timestamp'
                });
                objectStore.createIndex('date', 'date');
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(request.error);
        };;
    });
}

async function storeBattleRecords(battleRecords) {
    const db = await openDB();

    const transaction = db.transaction('battleRecords', 'readwrite');
    transaction.objectStore('battleRecords').put(battleRecords);

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve('Saved successfully');
        };
        transaction.onerror = () => {
            reject(transaction.error);
        };
    });
}

function openBattleRecords() {
    if (Object.keys(cfgStats).length < 1) {
        let storedCfgStats = {};
        try {
            storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
        } catch (err) {
            console.warn('Failed to load cfgStats. Using default cfgStats.');
            storedCfgStats = {};
        }
        mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');
    }

    newWindow = window.open();
    if (newWindow === null || newWindow === undefined) return;

    newWindow.document.title = t('sP.jpxStats');
    newWindow.document.head.appendChild(newWindow.document.createElement('style')).innerHTML = `
        body {
            text-align: center;
        }

        table {
            border-collapse: collapse;
            table-layout: fixed;
            margin-top: 20px;
        }
        tr {
            border: 1px solid black;
            font-size: 80%;
        }
        tr:hover {
            background-color: #ccd9ff;
        }
        td, th {
            border: 1px solid black;
            min-width: 20px;
            padding: 0 3px;
            white-space: nowrap;
        }

        .tooltip:hover::after {
            display: block;
            position: absolute;
            content: attr(content);
            border: 1px solid black;
            background: #eee;
            padding: .25em;
            white-space: pre;
        }

        body.dark-mode {
            background-color: #121212;
            color: #eee;
        }
        body.dark-mode table,
        body.dark-mode td,
        body.dark-mode th,
        body.dark-mode tr {
            border: 1px solid #555;
        }
        body.dark-mode tr:hover {
            background-color: #333;
        }
        body.dark-mode .tooltip:hover::after {
            color: #eee;
            background: #222;
            border-color: #555;
        }
        body.dark-mode input {
            color: #eee;
            background-color: #1e1e1e;
            border: 1px solid #555;
        }
        body.dark-mode input[type="checkbox"] {
            accent-color: #555;
        }
        body.dark-mode label {
            color: #eee;
        }
    `;

    cfgTheme.darkMode && newWindow.document.body.classList.add('dark-mode');
    newWindow.document.body.appendChild(createFilter());
    getBattleRecordsRender().then(battleRecords => {
        renderDynamicTable(battleRecords, cfgStats.statsColumns, newWindow.document.body);
    });
}

async function getBattleRecordsRender() {
    const db = await openDB();
    const transaction = db.transaction('battleRecords', 'readonly');
    const objectStore = transaction.objectStore('battleRecords');

    let battleRecords = [];
    let filters = getFilters();
    let indexName = filters.aggregate ? 'date' : 'default';

    let keyRange = IDBKeyRange.bound(0, 'z');
    let source = (indexName === 'default' ? objectStore : objectStore.index(indexName));
    let i = 0;

    return new Promise(resolve => {
        const req = source.openCursor(keyRange, 'prevunique');
        req.onsuccess = function(e) {
            let cursor = e.target.result;

            if (!cursor || i >= filters.limit) {
                battleRecords.unshift(generateAggregate(battleRecords, 'Total'), generateAggregate(battleRecords, 'Average'));

                resolve(battleRecords);
                return;
            }

            if (indexName === 'date') {
                let dailyReq = objectStore.index('date').getAll(cursor.key);
                dailyReq.onsuccess = function(ev) {
                    let results = ev.target.result || [];
                    results = results.filter(x => filterData(x, filters));
                    if (results.length > 0) {
                        battleRecords.push(generateAggregate(results, 'Total', results[0].date));
                        i += 1;
                    }

                    cursor.continue();
                };

                return;
            }

            let bs = filterData(cursor.value, filters);
            if (bs) {
                battleRecords.push(bs);
                i += 1;
            }

            cursor.continue();
        };
    });
}

async function exportIndexedDB() {
    const db = await openDB();
    const exportData = {
        dbName: db.name,
        version: db.version,
        stores: {},
    };

    for (const storeName of db.objectStoreNames) {
        exportData.stores[storeName] = await new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const req = objectStore.getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    db.close();
    return exportData;
}

async function importIndexedDB(jsonData, merge = true) {
    const db = await openDB();

    for (const storeName in jsonData.stores) {
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        if (!merge) objectStore.clear();
        let existingKeys = null;
        if (merge) {
            existingKeys = await new Promise((resolve, reject) => {
                const req = objectStore.getAllKeys();
                req.onsuccess = () => resolve(new Set(req.result));
                req.onerror = () => reject(req.error);
            });
        }

        for (const record of jsonData.stores[storeName]) {
            const key = record[objectStore.keyPath];
            if (merge) {
                if (!existingKeys.has(key)) objectStore.put(record);
            } else {
                objectStore.put(record);
            }
        }

        await new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    db.close();
}

function filterData(data, filters) {
    if (filters.world && !filters.world.includes(data.world)) {return false }
    if (filters.battleType && !filters.battleType.includes(data.battleType)) {return false}
    if (filters.difficulties && !filters.difficulties.includes(data.difficulty.toString())) {return false}
    if (filters.result && !filters.result.includes(data.result)) {return false}

    return data;
}

function generateAggregate(data_array, type, timestamp_name = null) { //type: Average, Total
    if (data_array.length === 0) {
        return false
    } else {
        let length = type === 'Average' ? data_array.length : 1;
        let total_turns = data_array.map(x => x.turns).reduce((a,b) => a + b, 0);
        let total_deltaSeconds = data_array.map(x => x.deltaSeconds).reduce((a,b) => a + b, 0);

        let new_data = {
            date: timestamp_name || t(`sP.${type}`),
            roundInfo: {
                current: Math.round(data_array.map(x => x.roundInfo.current).reduce((a,b) => a + b, 0) / length * 100) / 100,
                total: Math.round(data_array.map(x => x.roundInfo.total).reduce((a,b) => a + b, 0) / length * 100) / 100,
            },
            deltaSeconds: type === 'Average' ? (Math.round(total_deltaSeconds / length * 100) / 100) : Math.round(total_deltaSeconds * 100) / 100,
            deltaTime: '',
            turns: type === 'Average' ? (Math.round(total_turns / length * 100) / 100) : total_turns,
            tps: 0,
            combatRecords: jpxUtils.createCombatRecords(),
            revenueRecords: jpxUtils.createRevenueRecords(),
        };
        new_data.deltaTime = jpxUtils.secondsToTime(new_data.deltaSeconds);
        new_data.tps = Math.round(new_data.turns / new_data.deltaSeconds * 100) / 100;

        for (let i = 0; i < data_array.length; i++) {
            for (const [categoryKey, categoryValue] of Object.entries(data_array[i].combatRecords)) {
                for (const [fieldKey, fieldValue] of Object.entries(categoryValue)) {
                    jpxUtils.inc(new_data.combatRecords[categoryKey], fieldKey, fieldValue);
                }
            }
            for (const [categoryKey, categoryValue] of Object.entries(data_array[i].revenueRecords)) {
                switch (categoryKey) {
                    case ('credit'):
                    case ('staminaCost'):
                    case ('totalProfit'):
                    case ('finalProfit'):
                        new_data.revenueRecords[categoryKey] += categoryValue;
                        break;
                    case ('equipment'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            new_data.revenueRecords[categoryKey][key] ??= [];
                            new_data.revenueRecords[categoryKey][key] = new_data.revenueRecords[categoryKey][key].concat(value);
                        }
                        break;
                    case ('consumable'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                new_data.revenueRecords[categoryKey][key] ??= {};
                                jpxUtils.inc(new_data.revenueRecords[categoryKey][key], 'balance', value.balance);
                            }
                        }
                        break;
                    case ('token'):
                    case ('food'):
                    case ('figurine'):
                    case ('artifact'):
                    case ('trophy'):
                    case ('crystal'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                jpxUtils.inc(new_data.revenueRecords[categoryKey], key, value);
                            }
                        }
                        break;
                }
            }
        }

        if (type === 'Average') {
            for (const [categoryKey, categoryValue] of Object.entries(new_data.combatRecords)) {
                for (const [fieldKey, fieldValue] of Object.entries(categoryValue)) {
                    new_data.combatRecords[categoryKey][fieldKey] = Math.round(fieldValue / length * 10) / 10;
                }
            }
            for (const [categoryKey, categoryValue] of Object.entries(new_data.revenueRecords)) {
                switch (categoryKey) {
                    case ('credit'):
                    case ('staminaCost'):
                    case ('totalProfit'):
                    case ('finalProfit'):
                        new_data.revenueRecords[categoryKey] = Math.round(categoryValue / length * 10) / 10;
                        break;
                    case ('consumable'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                new_data.revenueRecords[categoryKey][key].balance = Math.round(value.balance / length * 10) / 10;
                            }
                        }
                        break;
                    case ('material'):
                    case ('token'):
                    case ('food'):
                    case ('figurine'):
                    case ('artifact'):
                    case ('trophy'):
                    case ('crystal'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                new_data.revenueRecords[categoryKey][key] = Math.round(value / length * 10) / 10;
                            }
                        }
                        break;
                }
            }
        }

        return new_data;
    }
}

function createFilter() {
    let filtersDiv = newWindow.document.createElement('div');
    filtersDiv.id = 'filtersDiv';

    let checkboxSortArray = [
        {
            id: 'filter-aggregate',
            sortArray: ['Aggregate by Day'],
        },
        {
            id: 'filter-world',
            sortArray: ['Persistent', 'Isekai'],
        },
        {
            id: 'filter-battleType',
            sortArray: ['Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'],
        },
        {
            id: 'filter-difficulties',
            sortArray: ['20', '15', '10', '7', '4', '2', '1'],
        },
        {
            id: 'filter-result',
            sortArray: ['Victory', 'Defeat', 'Flee'],
        },
    ];

    //checkBox Filter
    for (let checkboxSort of checkboxSortArray) {
        let filterDiv = newWindow.document.createElement('div');
        filterDiv.id = checkboxSort.id;
        for (let checkboxValue of checkboxSort.sortArray) {
            let label = newWindow.document.createElement('label');
            let input = newWindow.document.createElement('input');
            input.type = 'checkbox';
            input.addEventListener('change', function() {
                getBattleRecordsRender().then(battleRecords => {
                    renderDynamicTable(battleRecords, cfgStats.statsColumns, newWindow.document.body);
                });
            });
            input.defaultChecked = true;
            input.value = checkboxValue;
            label.append(input);
            label.append(t(`sP.${checkboxValue}`));
            filterDiv.appendChild(label);
        }
        filtersDiv.appendChild(filterDiv);
    }
    //number Filter
    let filterDiv = newWindow.document.createElement('div');
    filterDiv.id = 'filter-rows';
    let input = newWindow.document.createElement('input');
    input.type = 'number';
    input.addEventListener('change', function() {
        getBattleRecordsRender().then(battleRecords => {
            renderDynamicTable(battleRecords, cfgStats.statsColumns, newWindow.document.body);
        });
    });
    input.value = 50;
    input.min = '0';
    input.step = '1';
    filterDiv.append(input);
    filtersDiv.appendChild(filterDiv);

    return filtersDiv;
}

function getFilters() {
    let filters = {};
    filters.aggregate = newWindow.document.getElementById('filter-aggregate').children[0].children[0].checked;
    filters.world =  Array.from(newWindow.document.getElementById('filter-world').querySelectorAll('input:checked')).map(x => x.value);
    filters.battleType =  Array.from(newWindow.document.getElementById('filter-battleType').querySelectorAll('input:checked')).map(x => x.value);
    filters.difficulties =  Array.from(newWindow.document.getElementById('filter-difficulties').querySelectorAll('input:checked')).map(x => x.value);
    filters.result = Array.from(newWindow.document.getElementById('filter-result').querySelectorAll('input:checked')).map(x => x.value);
    filters.limit = parseInt(newWindow.document.getElementById('filter-rows').children[0].value) || 1;

    return filters;
}

function renderDynamicTable(battleRecords, displayedColumns, parent) {
    newWindow.document.querySelector('#battleStatsTable')?.remove();

    let activeFields = displayedColumns.map(column => {
        let baseField = STATS_FIELDS.find(f => f.id === column.id);
        return baseField ? { ...baseField, ...column } : null;
    }).filter(f => f);

    let table = newWindow.document.createElement('table');
    table.id = 'battleStatsTable';

    let thead = newWindow.document.createElement('thead');
    let theadHTML = '<tr>';
    for (const field of activeFields) {
        let style = field.style ? ` style="${field.style}"` : '';
        theadHTML += `<th${style}>${field.customName || t(field.label)}</th>`;
    }
    theadHTML += '</tr>';
    thead.innerHTML = theadHTML;
    table.appendChild(thead);

    let tbody = newWindow.document.createElement('tbody');

    const parseColorThresholds = (str) => {
        if (!str) return [];
        return str.split(',').map(s => {
            const [value, color] = s.split(':');
            return { min: parseFloat(value.trim()), color: color?.trim() };
        }).filter(thr => !isNaN(thr.min)).sort((a, b) => b.min - a.min);
    };

    for (const record of battleRecords) {
        let tr = newWindow.document.createElement('tr');

        for (const field of activeFields) {
            let td = newWindow.document.createElement('td');
            let value = field.get(record);

            if (field.styleText) td.style.cssText = field.styleText;
            if (field.doI18n) value = t(`sP.${value}`);
            if (value && typeof value === 'object' && 'drop' in value) {
                td.classList.add('tooltip');
                td.setAttribute('content', `${t('sP.drop')}: ${value.drop.toLocaleString()}\n${t('sP.use')}: ${value.use.toLocaleString()}`);
                td.textContent = value.balance.toLocaleString();
            } else if (typeof value === 'number') {
                td.textContent = value.toLocaleString();

                if (field.colorThresholds) {
                    let thresholds = parseColorThresholds(field.colorThresholds);
                    let match = thresholds.find(thr => value >= thr.min);
                    if (match) td.style.color = match.color;
                }
            } else {
                td.textContent = value || '';
            }

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    parent.appendChild(table);
}

//Settings
function getBattleMode(defaultBattleStyle = 'Unarmed') {
    let modeKey = `${battleStyle}_${battleType || defaultBattleStyle}`;
    return !jpxUtils.isEmpty(cfgBattle[modeKey]) ? modeKey : `${battleStyle || defaultBattleStyle}_General`;
}

function renderSchema(container, schema, data) {
    container.innerHTML = '';

    if (schema.type === 'object') {
        schema.properties.forEach(field => {
            let fieldDiv = document.createElement('div');
            fieldDiv.className = 'field-block';
            renderField(fieldDiv, field, data);
            container.appendChild(fieldDiv);
        });
    }
}

function resizeTextInputWidth(input, minCh = 10, maxCh = 36) {
    if (!input) return;
    const valueLen = (input.value || '').length;
    const placeholderLen = Math.min((input.placeholder || '').length, minCh);
    const nextCh = Math.min(maxCh, Math.max(minCh, Math.max(valueLen, placeholderLen) + 1));
    input.style.width = `${nextCh}ch`;
}

const fieldRenderers = {
    heading(container, field) {
        let div = document.createElement('div');
        div.textContent = t(field.label);
        if (field.class) div.classList.add(field.class);
        container.appendChild(div);
    },

    constant(container, field) {
        let div = document.createElement('div');
        div.textContent = t(field.label);
        if (field.class) div.classList.add(field.class);
        container.appendChild(div);
    },

    boolean(container, field, dataObj) {
        let key = field.key;
        let checkboxId = getUniqueId(key);
        container.innerHTML = `
            <label for="${checkboxId}" class="jpx-switch-label">
                <input type="checkbox" class="jpx-switch-input" id="${checkboxId}" ${dataObj[key] ? 'checked' : ''}>
                <span class="jpx-switch-slider" aria-hidden="true"></span>
                <span class="jpx-switch-text">${t(field.label)}</span>
            </label>
        `;
        container.querySelector('input').onchange = event => dataObj[key] = event.target.checked;
    },

    text(container, field, dataObj) {
        let key = field.key;
        let inputId = getUniqueId(key);
        container.innerHTML = `
            ${field.skipLabel ? '' : `<label for="${inputId}">${t(field.label)}</label>`}
            <input id="${inputId}" type="text">
        `;

        let input = container.querySelector('input');
        if (field.placeholder) input.placeholder = field.placeholder;
        input.value = dataObj[key] ?? '';
        resizeTextInputWidth(input, 10, 42);
        input.oninput = event => {
            dataObj[key] = event.target.value;
            resizeTextInputWidth(input, 10, 42);
        };
    },

    number(container, field, dataObj) {
        let key = field.key;
        let inputId = getUniqueId(key);
        container.innerHTML = `
            ${field.skipLabel ? '' : `<label for="${inputId}">${t(field.label)}</label>`}
            <input id="${inputId}" type="number" value="${dataObj[key] ?? 0}">
        `;
        container.querySelector('input').oninput = event => dataObj[key] = +event.target.value;
    },

    rangeNumber(container, field, dataObj) {
        let key = field.key;
        if (!Array.isArray(dataObj[key])) dataObj[key] = [0, 0];
        let idMin = getUniqueId(`${key}_min`);
        let idMax = getUniqueId(`${key}_max`);

        container.innerHTML = `
            ${field.skipLabel ? '' : `<label>${t(field.label)}</label>`}
            <input id="${idMin}" type="number" style="width:80px; margin-left:6px;" value="${dataObj[key][0]}">
            <span style="margin:0 4px;">to</span>
            <input id="${idMax}" type="number" style="width:80px;" value="${dataObj[key][1]}">
        `;

        container.querySelector(`#${idMin}`).oninput = event => dataObj[key][0] = +event.target.value;
        container.querySelector(`#${idMax}`).oninput = event => dataObj[key][1] = +event.target.value;
    },

    dropdown(container, field, dataObj) {
        let selectId = getUniqueId(field.key);

        let select = document.createElement('select');
        select.id = selectId;
        if (field.class) select.className = field.class;
        field.options.forEach(opt => {
            let option = document.createElement('option');
            option.value = opt.value;
            option.textContent = t(opt.label);
            select.appendChild(option);
        });

        if (field.hasModeDropdown) {
            select.dataset.role = field.hasModeDropdown;

            let selectContent = document.createElement('div');
            select.onchange = () => {
                selectContent.innerHTML = '';
                renderSchema(selectContent, field.itemSchema, dataObj[select.value]);
            };

            container.appendChild(select);
            container.appendChild(selectContent);

            let modeKey = getBattleMode('OneHanded');
            let importBtn = document.getElementById('import-button');
            if (importBtn?.dataset.battleMode) {
                modeKey = importBtn.dataset.battleMode;
                delete importBtn.dataset.battleMode;
            } else {
                let resetBtn = document.getElementById('reset-current-button');
                if (resetBtn?.dataset.battleMode) {
                    modeKey = resetBtn.dataset.battleMode;
                    delete resetBtn.dataset.battleMode;
                }
            }

            if (select.options.length > 0) {
                if ([...select.options].some(opt => opt.value === modeKey)) select.value = modeKey;
                else select.selectedIndex = 0;
                renderSchema(selectContent, field.itemSchema, dataObj[select.value]);
            }
        } else {
            let wrap = document.createElement('div');
            let label = document.createElement('label');

            label.htmlFor = selectId;
            label.textContent = t(field.label);
            wrap.appendChild(label);

            let initValue = dataObj[field.key] ?? field.options[0]?.value;
            select.value = initValue;
            dataObj[field.key] = initValue;

            select.onchange = () => dataObj[field.key] = select.value;

            wrap.appendChild(select);
            container.appendChild(wrap);
        }
    },

    array(container, field, dataObj) {
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];
        let arrayGroupId = Symbol('array-group');
        let dragState = {
            fromIndex: null,
            groupId: null,
            draggedRow: null,
            placeholder: null,
            lastMouseY: 0,
        };

        let wrap = document.createElement('div');
        if (!field.skipLabel) {
            wrap.innerHTML = `<div${field.class ? ` class="${field.class}"` : ''} style="font-weight:bold; margin-bottom:4px;">${t(field.label)}</div>`;
        }
        container.appendChild(wrap);

        let listDiv = document.createElement('div');
        wrap.appendChild(listDiv);

        // 容器级别的dragover处理，确保整个区域都能响应拖动
        listDiv.addEventListener('dragover', e => {
            if (dragState.groupId !== arrayGroupId) return;
            if (dragState.fromIndex == null) return;
            if (!dragState.placeholder) return;
            e.preventDefault();

            // 获取所有可见的row（排除被拖动的）
            const rows = Array.from(listDiv.querySelectorAll('.array-row:not(.array-row-dragging)'));
            if (rows.length === 0) return;

            const mouseY = e.clientY;
            const movingDown = mouseY >= dragState.lastMouseY;
            dragState.lastMouseY = mouseY;

            const placeholderRect = dragState.placeholder.getBoundingClientRect();
            const placeholderHeight = placeholderRect.height;

            // 计算拖动预览的中心位置（近似）
            const dragCenterY = mouseY;
            const dragTopY = dragCenterY - placeholderHeight / 2;
            const dragBottomY = dragCenterY + placeholderHeight / 2;

            let bestInsertPosition = null;

            // 遍历所有row，找到应该插入的位置
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rect = row.getBoundingClientRect();
                const rowMidY = rect.top + rect.height / 2;

                // 向下拖动：当拖动条目覆盖目标条目超过50%时，插入到目标之后
                if (movingDown) {
                    // 拖动条目的底部超过目标条目的中点
                    if (dragBottomY > rowMidY && dragTopY < rect.bottom) {
                        bestInsertPosition = { afterRow: row };
                    }
                }
                // 向上拖动：当拖动条目覆盖目标条目超过50%时，插入到目标之前
                else {
                    // 拖动条目的顶部低于目标条目的中点
                    if (dragTopY < rowMidY && dragBottomY > rect.top) {
                        bestInsertPosition = { beforeRow: row };
                    }
                }
            }

            // 边界情况：鼠标在第一个row之上
            if (mouseY < rows[0].getBoundingClientRect().top) {
                bestInsertPosition = { beforeRow: rows[0] };
            }
            // 边界情况：鼠标在最后一个row之下
            else if (mouseY > rows[rows.length - 1].getBoundingClientRect().bottom) {
                bestInsertPosition = { afterRow: rows[rows.length - 1] };
            }

            if (!bestInsertPosition) return;

            // 确定目标节点
            let targetNode;
            if (bestInsertPosition.beforeRow) {
                targetNode = bestInsertPosition.beforeRow;
            } else if (bestInsertPosition.afterRow) {
                targetNode = bestInsertPosition.afterRow.nextSibling;
            }

            // 检查占位符是否已在目标位置
            const currentNext = dragState.placeholder.nextSibling;
            const effectiveNext = currentNext === dragState.draggedRow ? currentNext.nextSibling : currentNext;
            const effectiveTarget = targetNode === dragState.draggedRow ? targetNode.nextSibling : targetNode;
            if (effectiveNext === effectiveTarget) return;

            // 移动占位符到目标位置
            if (bestInsertPosition.beforeRow) {
                listDiv.insertBefore(dragState.placeholder, bestInsertPosition.beforeRow);
            } else if (bestInsertPosition.afterRow) {
                if (bestInsertPosition.afterRow.nextSibling) {
                    listDiv.insertBefore(dragState.placeholder, bestInsertPosition.afterRow.nextSibling);
                } else {
                    listDiv.appendChild(dragState.placeholder);
                }
            }
        });

        listDiv.addEventListener('drop', e => {
            if (dragState.groupId !== arrayGroupId) return;
            if (dragState.fromIndex == null) return;
            e.preventDefault();

            // 计算目标索引（基于占位符的位置）
            if (!dragState.placeholder || !dragState.placeholder.parentNode) return;

            const placeholderIndex = Array.from(listDiv.children).indexOf(dragState.placeholder);
            let targetIndex = 0;

            // 计算占位符前有多少个实际的row
            for (let i = 0; i < placeholderIndex; i++) {
                if (listDiv.children[i].classList && listDiv.children[i].classList.contains('array-row')) {
                    targetIndex++;
                }
            }

            const from = dragState.fromIndex;
            // 如果从上往下拖，目标索引需要减1（因为移除源元素后索引会变）
            if (from < targetIndex) targetIndex--;

            if (from !== targetIndex) {
                const item = dataObj[field.key].splice(from, 1)[0];
                dataObj[field.key].splice(targetIndex, 0, item);
            }

            renderArray();
        });

        function renderRowButtons(row, index) {
            const isTop = index === 0;
            const isBottom = index === dataObj[field.key].length - 1;

            let actions = document.createElement('div');
            actions.className = 'array-row-actions';
            const linkedAddActions = row.querySelector('.conditions-add-actions');
            if (linkedAddActions) {
                let footer = document.createElement('div');
                footer.className = 'array-row-footer-actions';
                footer.appendChild(linkedAddActions);
                footer.appendChild(actions);
                row.appendChild(footer);
            } else {
                row.appendChild(actions);
            }

            let handle = jpxUtils.createButton(actions, { text: decodeURIComponent('%E2%89%A1'), className: 'drag-handle jpx-icon-btn' });
            handle.draggable = true;
            handle.addEventListener('dragstart', e => {
                dragState.fromIndex = index;
                dragState.groupId = arrayGroupId;
                dragState.draggedRow = row;
                dragState.lastMouseY = e.clientY;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', '');

                // 使用整条 row 作为拖拽预览，而不是只有图标
                const rect = row.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                if (e.dataTransfer.setDragImage) {
                    e.dataTransfer.setDragImage(row, offsetX, offsetY);
                }

                // 延迟添加拖动样式和创建占位符
                requestAnimationFrame(() => {
                    // 创建占位符元素，高度与被拖动元素相同
                    if (!dragState.placeholder) {
                        dragState.placeholder = document.createElement('div');
                        dragState.placeholder.className = 'array-drop-placeholder';
                        dragState.placeholder.style.height = row.offsetHeight + 'px';
                        // 初始占位符插入到被拖动元素的位置
                        row.parentNode.insertBefore(dragState.placeholder, row);
                    }
                    // 隐藏被拖动的元素
                    row.classList.add('array-row-dragging');
                });
            });
            handle.addEventListener('dragend', () => {
                row.classList.remove('array-row-dragging');

                // 移除占位符
                if (dragState.placeholder && dragState.placeholder.parentNode) {
                    dragState.placeholder.parentNode.removeChild(dragState.placeholder);
                }

                dragState.fromIndex = null;
                dragState.groupId = null;
                dragState.draggedRow = null;
                dragState.placeholder = null;
                dragState.lastMouseY = 0;
            });

            jpxUtils.createButton(actions, { text: decodeURIComponent('%E2%86%91'), className: 'jpx-icon-btn', disabled: isTop, onClick: () => {
                [dataObj[field.key][index - 1], dataObj[field.key][index]] = [dataObj[field.key][index], dataObj[field.key][index - 1]];
                renderArray();
            }});
            jpxUtils.createButton(actions, { text: decodeURIComponent('%E2%86%93'), className: 'jpx-icon-btn', disabled: isBottom, onClick: () => {
                [dataObj[field.key][index + 1], dataObj[field.key][index]] = [dataObj[field.key][index], dataObj[field.key][index + 1]];
                renderArray();
            }});
            jpxUtils.createButton(actions, { text: t('delete'), className: 'jpx-icon-btn jpx-icon-btn-danger', onClick: () => {
                dataObj[field.key].splice(index, 1);
                renderArray();
            }});
        };

        function renderAddButtons(addContainer) {
            const addAction = (targetSchema) => {
                dataObj[field.key].push(targetSchema.type === 'text' ? '' : createEmptyObject(targetSchema));
                renderArray();
            };

            // 创建一个右对齐的按钮容器
            let btnWrapper = document.createElement('div');
            btnWrapper.style.cssText = 'display: flex; justify-content: flex-start; gap: 4px; margin-top: 6px;';
            addContainer.appendChild(btnWrapper);

            if (field.itemSchema.discriminator) {
                for (const [typeKey, subSchema] of Object.entries(field.itemSchema.oneOf)) {
                    jpxUtils.createButton(btnWrapper, {
                        text: `${t('add')} ${t(subSchema.properties.find(item => item.type === 'constant')?.label)}`,
                        className: 'jpx-inline-btn',
                        onClick: () => addAction(subSchema)
                    });
                };
            } else {
                jpxUtils.createButton(btnWrapper, { text: t('add'), className: 'jpx-inline-btn', onClick: () => addAction(field.itemSchema) });
            }
        };

        function renderMultiSelectMode() {
            if (field.hasRange) {
                if (dataObj[field.key].length < 2) dataObj[field.key].unshift(0, 0);
                let rangeBox = document.createElement('div');
                fieldRenderers.rangeNumber(rangeBox, { ...field, label: field.hasRange, skipLabel: false }, dataObj);
                listDiv.appendChild(rangeBox);
            }

            let tagGroup = document.createElement('div');
            tagGroup.className = 'jpx-tag-group';
            listDiv.appendChild(tagGroup);

            field.multiSelectOptions.forEach(opt => {
                let tag = document.createElement('button');
                tag.type = 'button';
                tag.className = 'jpx-tag';
                tag.textContent = t(opt.label);

                const isSelected = () => dataObj[field.key].includes(opt.value);
                if (isSelected()) tag.classList.add('selected');

                tag.addEventListener('click', () => {
                    if (isSelected()) {
                        if (field.hasRange) {
                            dataObj[field.key] = [
                                ...dataObj[field.key].slice(0, 2),
                                ...dataObj[field.key].slice(2).filter(v => v !== opt.value)
                            ];
                        } else {
                            dataObj[field.key] = dataObj[field.key].filter(v => v !== opt.value);
                        }
                        tag.classList.remove('selected');
                    } else {
                        if (!dataObj[field.key].includes(opt.value)) {
                            dataObj[field.key].push(opt.value);
                        }
                        tag.classList.add('selected');
                    }
                });

                tagGroup.appendChild(tag);
            });
        };

        function renderDynamicListMode() {
            dataObj[field.key].forEach((value, index) => {
                let row = document.createElement('div');
                row.className = 'array-row';

                let itemSchema = field.itemSchema;
                if (itemSchema.discriminator) itemSchema = resolveSchema(itemSchema, value);

                if (itemSchema.type === 'text') {
                    renderField(row, { ...itemSchema, key: index, label: index + 1 }, dataObj[field.key]);
                } else if (itemSchema.type === 'object') {
                    let objDiv = document.createElement('div');
                    objDiv.className = 'object-item';
                    renderSchema(objDiv, itemSchema, value);
                    row.appendChild(objDiv);
                }

                renderRowButtons(row, index);
                listDiv.appendChild(row);
            });

            renderAddButtons(listDiv);
        };

        function renderArray() {
            listDiv.innerHTML = '';
            if (field.multiSelectOptions) renderMultiSelectMode();
            else renderDynamicListMode();
        }

        renderArray();
    },

    fieldPicker(container, field, dataObj) {
        let editFields = field.editFields || [];
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];

        let wrap = document.createElement('div');
        wrap.innerHTML = `<div${field.class ? ` class="${field.class}"` : ''} style="margin-top:8px;">${t(field.label)}</div>`;
        container.appendChild(wrap);

        let pickerWrap = document.createElement('div');
        pickerWrap.style.cssText = 'display: flex; gap: 12px; align-items: center; padding-left: 10px;';
        wrap.appendChild(pickerWrap);

        let inputMap = {};
        let leftFields = field.allFields.filter(f => !dataObj[field.key].some(d => d.id === f.id));
        let rightFields = dataObj[field.key].map(d => {
            let base = field.allFields.find(f => f.id === d.id);
            return base ? { ...base, ...d } : null;
        }).filter(Boolean);

        const getSelectedIndexes = (select) => Array.from(select.selectedOptions, opt => +opt.value);
        const getIndexGroups = (indexes) => {
            return indexes.sort((a, b) => a - b).reduce((acc, value, i, array) => {
                if (i > 0 && value === array[i - 1] + 1) acc.at(-1).push(value);
                else acc.push([value]);
                return acc;
            }, []);
        };

        function updateDataObj() {
            dataObj[field.key] = rightFields.map(f => {
                let storageObj = { id: f.id };
                editFields.forEach(editF => {
                    let val = f[editF.key];
                    if (val !== undefined && val !== null && val !== '') {
                        storageObj[editF.key] = val;
                    }
                });
                return storageObj;
            });
        }

        function refresh(selectedItems = []) {
            leftSelect.innerHTML = leftFields.map((f, i) => `<option value="${i}">${t(f.label)}</option>`).join('');
            rightSelect.innerHTML = rightFields.map((f, i) => `<option value="${i}">${t(f.label)}</option>`).join('');
            rightFields.forEach((f, i) => {
                if (selectedItems.includes(f)) rightSelect.options[i].selected = true;
            });
            updateDataObj();
        };

        function transfer(fromArray, toArray, select, isToRight) {
            let indexes = getSelectedIndexes(select).sort((a, b) => b - a);
            if (!indexes.length) return;

            let selectedItems = indexes.map(i => {
                let item = fromArray[i];
                if (isToRight) {
                    editFields.forEach(editF => {
                        item[editF.key] = '';
                    });
                }
                return item;
            }).reverse();

            indexes.forEach(i => fromArray.splice(i, 1));
            toArray.push(...selectedItems);
            if (!isToRight) toArray.sort((a, b) => field.allFields.findIndex(f => f.id === a.id) - field.allFields.findIndex(f => f.id === b.id));
            refresh(selectedItems);
        }

        function reorder(direction) {
            let indexes = getSelectedIndexes(rightSelect);
            if (!indexes.length) return;
            let selectedItems = indexes.map(i => rightFields[i]);

            if (direction === 'top' || direction === 'bottom') {
                let unselected = rightFields.filter((f, i) => !indexes.includes(i));
                rightFields = direction === 'top' ? [...selectedItems, ...unselected] : [...unselected, ...selectedItems];
            } else {
                let groups = getIndexGroups(indexes);
                if (direction === 'up') {
                    groups.forEach(group => {
                        if (group[0] > 0) {
                            let items = rightFields.splice(group[0], group.length);
                            rightFields.splice(group[0] - 1, 0, ...items);
                        }
                    });
                } else if (direction === 'down') {
                    groups.reverse().forEach(group => {
                        if (group.at(-1) < rightFields.length - 1) {
                            let items = rightFields.splice(group[0], group.length);
                            rightFields.splice(group[0] + 1, 0, ...items);
                        }
                    });
                }
            }
            refresh(selectedItems);
        };

        let editBox = document.createElement('div');
        editBox.style.cssText = 'display: flex; flex-direction: column; gap: 8px; min-width: 350px;';
        editFields.forEach(editF => {
            let div = document.createElement('div');
            div.textContent = `${t(editF.label)}: `;

            let input = document.createElement('input');
            input.id = getUniqueId('editField');
            input.type = 'text';
            input.style.width = '100%';
            if (editF.placeholder) input.placeholder = editF.placeholder;
            input.addEventListener('input', () => {
                let indexes = getSelectedIndexes(rightSelect);
                indexes.forEach(i => {
                    rightFields[i][editF.key] = input.value;
                });
                updateDataObj();
            });

            div.appendChild(input);
            editBox.appendChild(div);

            inputMap[editF.key] = input;
        });

        let leftSelect = document.createElement('select');
        let rightSelect = document.createElement('select');
        [leftSelect, rightSelect].forEach(s => {
            s.multiple = true;
            s.size = field.size || 12;
            s.className = 'field-picker-select';
        });
        leftSelect.addEventListener('pointerdown', () => { rightSelect.selectedIndex = -1; });
        rightSelect.addEventListener('pointerdown', () => { leftSelect.selectedIndex = -1; });
        rightSelect.addEventListener('change', () => {
            let indexes = getSelectedIndexes(rightSelect);
            editFields.forEach(editF => {
                inputMap[editF.key].value = (indexes.length > 0) ? (rightFields[indexes[0]][editF.key] || '') : '';
            });
        });

        let btnBoxStyle = 'display: flex; flex-direction: column; gap: 4px;';

        let moveBox = document.createElement('div');
        moveBox.style.cssText = btnBoxStyle;
        jpxUtils.createButton(moveBox, { text: decodeURIComponent('%E2%86%92'), onClick: () => transfer(leftFields, rightFields, leftSelect, true) });
        jpxUtils.createButton(moveBox, { text: decodeURIComponent('%E2%86%90'), onClick: () => transfer(rightFields, leftFields, rightSelect, false) });

        let sortBox = document.createElement('div');
        sortBox.style.cssText = btnBoxStyle;
        jpxUtils.createButton(sortBox, { text: decodeURIComponent('%E2%86%91%E2%86%91'), onClick: () => reorder('top') });
        jpxUtils.createButton(sortBox, { text: decodeURIComponent('%E2%86%91'), onClick: () => reorder('up') });
        jpxUtils.createButton(sortBox, { text: decodeURIComponent('%E2%86%93'), onClick: () => reorder('down') });
        jpxUtils.createButton(sortBox, { text: decodeURIComponent('%E2%86%93%E2%86%93'), onClick: () => reorder('bottom') });

        pickerWrap.append(leftSelect, moveBox, rightSelect, sortBox, editBox);
        refresh();
    },

    object(container, field, dataObj) {
        renderSchema(container, field, dataObj[field.key]);
    },

    conditionsArray(container, field, dataObj) {
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];

        let wrap = document.createElement('div');
        container.appendChild(wrap);

        let listDiv = document.createElement('div');
        wrap.appendChild(listDiv);

        function createRow(item, index) {
            let selectId = getUniqueId('condition');

            let row = document.createElement('div');
            row.className = 'dynamic-array-row';
            row.style.marginBottom = '4px';

            let select = document.createElement('select');
            select.id = selectId;
            field.options.forEach(opt => {
                let option = document.createElement('option');
                option.value = opt.key;
                option.textContent = t(opt.label);
                select.appendChild(option);
            });
            select.value = item.key ?? field.options[0]?.key;
            row.appendChild(select);

            let inputDiv = document.createElement('div');
            inputDiv.style.display = 'inline-block';
            inputDiv.style.marginLeft = '8px';
            row.appendChild(inputDiv);

            function renderInput() {
                inputDiv.innerHTML = '';

                let selectedOption = field.options.find(option => option.key === select.value);
                if (!selectedOption) return;

                if ((item.key !== undefined && item.key !== select.value) || item.key === undefined) {
                    item.key = selectedOption.key;

                    switch (selectedOption.type) {
                        case 'boolean': item.value = false; break;
                        case 'text': item.value = ''; break;
                        case 'number': item.value = 0; break;
                        case 'rangeNumber': item.value = [0, 0]; break;
                        case 'array': item.value = []; break;
                        default: item.value = null;
                    }
                }

                renderField(inputDiv, {
                    key: 'value',
                    skipLabel: true,
                    label: selectedOption.label,
                    type: selectedOption.type,
                    itemSchema: selectedOption.itemSchema,
                    options: selectedOption.options,
                    multiSelectOptions: selectedOption.multiSelectOptions,
                    hasRange: selectedOption.hasRange,
                }, item);
            }

            select.onchange = () => { renderInput(); };

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.className = 'jpx-icon-btn jpx-icon-btn-danger';
            deleteButton.onclick = () => {
                dataObj[field.key].splice(index, 1);
                renderList();
            };
            row.appendChild(deleteButton);

            renderInput();
            return row;
        }

        function renderList() {
            listDiv.innerHTML = '';
            dataObj[field.key].forEach((item, index) => {
                listDiv.appendChild(createRow(item, index));
            });
        }

        let addActions = document.createElement('div');
        addActions.className = 'conditions-add-actions';

        let addButton = document.createElement('button');
        addButton.textContent = `${t('add')} ${t(field.key)}`;
        addButton.className = 'jpx-inline-btn';
        addButton.onclick = () => {
            let newItem = {};
            dataObj[field.key].push(newItem);
            let index = dataObj[field.key].length - 1;
            listDiv.appendChild(createRow(newItem, index));
        };

        addActions.appendChild(addButton);
        wrap.appendChild(addActions);

        renderList();
    }
};

function renderField(container, field, dataObj) {
    const renderer = fieldRenderers[field.type];
    if (renderer) renderer(container, field, dataObj);
}

function resolveSchema(schema, dataObj) {
    if (!schema.discriminator) return schema;
    const typeValue = dataObj[schema.discriminator];
    return schema.oneOf[typeValue];
}

function createEmptyObject(schema) {
    const obj = {};
    schema.properties.forEach(property => {
        if (property.type === 'constant') {
            obj[property.key] = property.value;
            return;
        }

        if (property.default !== undefined) {
            obj[property.key] = property.default;
            return;
        }

        const defaults = {
            text: '',
            number: 0,
            rangeNumber: [0,0],
            boolean: false,
            array: [],
            fieldPicker: [],
            object: () => createEmptyObject(property),
        };

        obj[property.key] = typeof defaults[property.type] === 'function' ? defaults[property.type]() : defaults[property.type] ?? undefined;
    });

    return obj;
}

function getUniqueId(prefix = 'input') {
    return `${prefix}_${idCounter++}`;
}

function mergeCfg(storedCfg, defaultCfg, mergedCfg, mergedType) {
    let vKey = mergedType === 'battle' ? 'battleVersion' : (mergedType === 'theme' ? 'themeVersion' : 'statsVersion');
    //patch 20260109
    if (mergedType === 'battle' && storedCfg) {
        if (storedCfg.version && !storedCfg.battleVersion) {
            storedCfg.battleVersion = storedCfg.version;
            delete storedCfg.version;
        }
    }
	//-
    if (!storedCfg?.[vKey] || storedCfg[vKey] < defaultCfg[vKey]) storedCfg = {};

    if (mergedType === 'battle') {
        for (const key of BATTLE_MODES) {
            let localObj = storedCfg[key];
			//patch 20260208
			key === '1H_Mage_General' && (localObj ??= storedCfg.Battlecaster_General);
			//-
            let isValid = localObj && Array.isArray(localObj.supports) && Array.isArray(localObj.attacks);
            mergedCfg[key] = isValid ? localObj : JSON.parse(JSON.stringify(defaultCfg[key]));

            //patch 20260103
            mergedCfg[key].attacks.forEach(attack => {
                if (attack.type === 'target' && 'bottomUp' in attack) {
                    attack.priorityRule = attack.bottomUp ? 'Bottom Up' : 'Top Down';
                    delete attack.bottomUp;
                }
            });
			//-
        }

        for (const key in defaultCfg) {
            if (BATTLE_MODES.includes(key)) continue;
            mergedCfg[key] = (key in storedCfg) ? storedCfg[key] : defaultCfg[key];
        }
    } else if (mergedType === 'stats') {
        for (const key in defaultCfg) {
            mergedCfg[key] = (key in storedCfg) ? storedCfg[key] : defaultCfg[key];
        }
    } else if (mergedType === 'theme') {
        for (const key in defaultCfg) {
            mergedCfg[key] = (key in storedCfg) ? storedCfg[key] : defaultCfg[key];
        }
    }
}

function getKeyBind(action) {
    let bind = userKeybinds[action];
    return `${bind.ctrl ? 'Ctrl + ' : ''}${bind.alt ? 'Alt + ' : ''}${bind.shift ? 'Shift + ' : ''}${bind.key === ' ' ? 'Space' : bind.key.toUpperCase()}`;
}

function captureShortcut(action) {
    if (keybindController && !keybindController.signal.aborted) keybindController.abort();
    keybindController = new AbortController();
    let signal = keybindController.signal;

    let btn = document.getElementById(`btn_${action}`);
    btn.textContent = '...';

    window.addEventListener('keydown', (e) => {
        e.preventDefault();

        if (e.key === 'Escape') {
            keybindController.abort();
            return;
        }

        if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

        userKeybinds[action] = {
            key: e.key,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            shift: e.shiftKey
        };

        btn.textContent = getKeyBind(action);
        keybindController.abort();
    }, { signal });

    window.addEventListener('mousedown', () => {
        keybindController.abort();
    }, { signal, once: true });

    signal.addEventListener('abort', () => {
        btn.textContent = getKeyBind(action);
    });
}

function renderSettings() {
    let overlay = document.getElementById('settings-overlay');
    if (overlay) {
        overlay.remove();
        return;
    }

    // Overlay background
    overlay = document.createElement('div');
    overlay.id = 'settings-overlay';

    // Block scroll on background page
    const preventBgScroll = (e) => {
        let target = e.target;
        while (target && target !== overlay) {
            if (target.id === 'settings-container') return;
            target = target.parentElement;
        }
        e.preventDefault();
    };
    overlay.addEventListener('wheel', preventBgScroll, { passive: false });

    // Floating window
    const settingsWindow = document.createElement('div');
    settingsWindow.className = 'settings-window';
    overlay.appendChild(settingsWindow);

    // Title bar (draggable)
    const titleBar = document.createElement('div');
    titleBar.className = 'settings-titlebar';
    const titleText = document.createElement('span');
    titleText.textContent = 'JPX-PLUS 配置菜单';
    titleBar.appendChild(titleText);
    settingsWindow.appendChild(titleBar);

    // Drag support for the window
    let _isDragging = false, _dragX = 0, _dragY = 0;
    let _wasCentered = true;
    titleBar.addEventListener('pointerdown', (e) => {
        _isDragging = true;
        if (_wasCentered) {
            const rect = settingsWindow.getBoundingClientRect();
            settingsWindow.style.position = 'fixed';
            settingsWindow.style.left = rect.left + 'px';
            settingsWindow.style.top = rect.top + 'px';
            settingsWindow.style.margin = '0';
            overlay.style.alignItems = 'stretch';
            overlay.style.justifyContent = 'stretch';
            _wasCentered = false;
        }
        _dragX = e.clientX - settingsWindow.getBoundingClientRect().left;
        _dragY = e.clientY - settingsWindow.getBoundingClientRect().top;
        titleBar.setPointerCapture(e.pointerId);
        e.preventDefault();
    });
    titleBar.addEventListener('pointermove', (e) => {
        if (!_isDragging) return;
        let newLeft = e.clientX - _dragX;
        let newTop = e.clientY - _dragY;
        newLeft = Math.max(0, Math.min(window.innerWidth - 100, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - 40, newTop));
        settingsWindow.style.left = newLeft + 'px';
        settingsWindow.style.top = newTop + 'px';
    });
    titleBar.addEventListener('pointerup', (e) => {
        _isDragging = false;
        titleBar.releasePointerCapture(e.pointerId);
    });

    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'settings-tabbar';
    settingsWindow.appendChild(tabBar);

    // Scrollable content area
    let container = document.createElement('div');
    container.id = 'settings-container';
    container.className = 'settings-content';
    settingsWindow.appendChild(container);

    let tabs = [
        {
            id: 'battle',
            text: t('cB.battleSettings'),
            saveBtnText: t('cB.saveBattleConfig'),
            exportBtnText: t('cB.exportBattleConfig'),
            importBtnText: t('cB.importBattleConfig'),
            render: renderBattleTab,
            onSave() {
                console.log(cfgBattle);
                localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
                localStorage.setItem(prefix + 'userKeybinds' + isekaiSuffix, JSON.stringify(userKeybinds));
            },
            onExport() {
                return { data: cfgBattle, fileName: 'cfgBattle.txt', depth: 3 };
            },
            onImport(content) {
                let data = JSON.parse(content);
                mergeCfg(data, cfgBattle, cfgBattle, 'battle');
                return { uiId: 'cfgBattle-ui', schema: cfgBattleSchema, cfg: cfgBattle, transModeKey: true };
            },
        },
        {
            id: 'theme',
            text: t('cT.themeSettings'),
            render: renderThemeTab,
        },
        {
            id: 'stats',
            text: t('cS.statsSettings'),
            saveBtnText: t('cS.saveStatsConfig'),
            exportBtnText: t('cS.exportStatsConfig'),
            importBtnText: t('cS.importStatsConfig'),
            render: renderStatsTab,
            onSave() {
                console.log(cfgStats);
                localStorage.setItem(prefix + 'cfgStats', JSON.stringify(cfgStats));
            },
            onExport() {
                return { data: cfgStats, fileName: 'cfgStats.txt', depth: 2 };
            },
            onImport(content) {
                let data = JSON.parse(content);
                mergeCfg(data, cfgStats, cfgStats, 'stats');
                return { uiId: 'cfgStats-ui', schema: cfgStatsSchema, cfg: cfgStats };
            },
        },
    ];
    tabs.forEach(tab => {
        tab.btn = document.createElement('button');
        tab.btn.className = 'settings-tab-btn';
        tab.btn.textContent = tab.text;
        tab.btn.addEventListener('click', () => switchTab(tab.id, tabs));
        tabBar.appendChild(tab.btn);

        tab.panel = document.createElement('div');
        tab.panel.id = `panel_${tab.id}`;
        tab.panel.style.display = 'none';

        tab.render(tab.panel);
        container.appendChild(tab.panel);
    });

    // Fixed footer with action buttons
    const footer = document.createElement('div');
    footer.className = 'settings-footer';

    const mkBtn = (id, text, cls, onClick) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.className = `stg-btn ${cls}`;
        btn.textContent = text;
        btn.addEventListener('click', (e) => {
            let result = onClick(btn, e);
            const handleTempText = (tempText) => {
                if (!tempText) return;
                let originalText = btn.textContent;
                btn.style.width = btn.offsetWidth + 'px';
                btn.textContent = tempText;
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.width = '';
                    btn.disabled = false;
                }, 1500);
            };
            if (result instanceof Promise) result.then(handleTempText).catch(handleTempText);
            else handleTempText(result);
        });
        footer.appendChild(btn);
        return btn;
    };

    mkBtn('save-button', '', 'primary', () => {
        let activeTab = tabs.find(t => t.panel.style.display === 'block');
        if (!activeTab || !activeTab.onSave) return t('cGen.error!');
        activeTab.onSave();
        return t('cGen.saved!');
    });

    mkBtn('export-button', '', '', () => {
        let activeTab = tabs.find(t => t.panel.style.display === 'block');
        if (!activeTab || !activeTab.onExport) return t('cGen.exportFailed!');
        let info = activeTab.onExport();
        let blob = new Blob([jpxUtils.stringifyLimited(info.data, info.depth)], { type: 'text/plain;charset=utf-8' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = info.fileName;
        a.click();
        URL.revokeObjectURL(url);
        return t('cGen.exported!');
    });

    mkBtn('import-button', '', '', (btn) => {
        let activeTab = tabs.find(t => t.panel.style.display === 'block');
        if (!activeTab || !activeTab.onImport) return t('cGen.importFailed!');
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.json';
        return new Promise((resolve, reject) => {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return resolve();
                try {
                    const content = await file.text();
                    let info = activeTab.onImport(content);
                    if (info.transModeKey) {
                        let modeKey = document.querySelector('select[data-role="battleMode"]')?.value;
                        if (modeKey) btn.dataset.battleMode = modeKey;
                    }
                    let oldUI = document.getElementById(info.uiId);
                    let newUI = document.createElement('div');
                    newUI.id = info.uiId;
                    if (oldUI) oldUI.replaceWith(newUI);
                    renderSchema(newUI, info.schema, info.cfg);
                    resolve(t('cGen.imported!'));
                } catch (err) {
                    console.error(err);
                    reject(t('cGen.importFailed!'));
                }
            });
            input.click();
        });
    });

    // Spacer pushes close button to right
    const spacer = document.createElement('div');
    spacer.className = 'spacer';
    footer.appendChild(spacer);

    mkBtn('close-button', t('cGen.closeSettings'), 'danger', () => {
        settingsWindow.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
        }, 150);
    });

    settingsWindow.appendChild(footer);
    document.body.appendChild(overlay);

    switchTab('battle', tabs);
}

function switchTab(targetId, tabs) {
    tabs.forEach(tab => {
        let isActive = (tab.id === targetId);

        tab.btn.classList.toggle('active', isActive);
        tab.panel.style.display = isActive ? 'block' : 'none';

        if (isActive) {
            let saveBtn = document.getElementById('save-button');
            let exportBtn = document.getElementById('export-button');
            let importBtn = document.getElementById('import-button');

            if (saveBtn) {
                saveBtn.textContent = tab.saveBtnText || 'Save Settings';
                saveBtn.style.display = tab.onSave ? 'block' : 'none';
            }
            if (exportBtn) {
                exportBtn.textContent = tab.exportBtnText || 'Export Settings';
                exportBtn.style.display = tab.onExport ? 'block' : 'none';
            }
            if (importBtn) {
                importBtn.textContent = tab.importBtnText || 'Import Settings';
                importBtn.style.display = tab.onImport ? 'block' : 'none';
            }
        }
    });
}

function renderBattleTab(parent) {
    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        console.warn('Failed to load cfgBattle. Using default cfgBattle.');
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');

    let keybindsUI = document.createElement('div');
    keybindsUI.style.cssText = 'display: flex; gap: 16px; flex-wrap: wrap; align-items: center;';
    Object.keys(KEYBINDS).forEach(action => {
        let row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 8px; align-items: center;';

        let span = document.createElement('span');
        span.textContent = t(`cB.${action}`) + ': ';
        row.appendChild(span);

        jpxUtils.createButton(row, {
            id: `btn_${action}`,
            text: getKeyBind(action),
            onClick: (btn, e) => {
                e.stopPropagation();
                captureShortcut(action);
            }
        });
        keybindsUI.appendChild(row);
    });
    parent.appendChild(keybindsUI);

    let cfgBattleUI = document.createElement('div');
    cfgBattleUI.id = 'cfgBattle-ui';
    parent.appendChild(cfgBattleUI);
    renderSchema(cfgBattleUI, cfgBattleSchema, cfgBattle);

    // Auto-save on any setting change (no need to click Save manually)
    cfgBattleUI.addEventListener('change', () => {
        localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    });

    let buttonsUI = document.createElement('div');
    buttonsUI.style.cssText = 'margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap;';

    jpxUtils.createButton(buttonsUI, {
        id: 'export-current-button',
        className: 'stg-btn',
        text: t('cB.exportCurrentBattleMode'),
        onClick: () => {
            let modeKey = document.querySelector('select[data-role="battleMode"]')?.value;
            if (!cfgBattle[modeKey]) return t('cGen.exportFailed!');
            let exportData = { [modeKey]: cfgBattle[modeKey], battleVersion: cfgBattle.battleVersion };
            let blob = new Blob([jpxUtils.stringifyLimited(exportData, 3)], { type: 'text/plain;charset=utf-8' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `cfgBattle_${modeKey}.txt`;
            a.click();
            URL.revokeObjectURL(url);

            return t('cGen.exported!');
        }
    });

    jpxUtils.createButton(buttonsUI, {
        id: 'reset-current-button',
        className: 'stg-btn danger',
        text: t('cB.resetCurrentBattleMode'),
        onClick: (btn) => {
            let modeKey = document.querySelector('select[data-role="battleMode"]')?.value;
            if (!defaultCfgBattle[modeKey]) return t('cGen.resetFailed!');
            cfgBattle[modeKey] = JSON.parse(JSON.stringify(defaultCfgBattle[modeKey]));
            btn.dataset.battleMode = modeKey;

            let oldUI = document.getElementById('cfgBattle-ui');
            let newUI = document.createElement('div');
            newUI.id = 'cfgBattle-ui';
            if (oldUI) {
                oldUI.replaceWith(newUI);
                renderSchema(newUI, cfgBattleSchema, cfgBattle);
            }

            return t('cGen.reset!');
        }
    });

    parent.appendChild(buttonsUI);
}

function renderThemeTab(parent) {
    let storedCfgTheme = {};
    try {
        storedCfgTheme = JSON.parse(localStorage.getItem(prefix + 'cfgTheme') || '{}');
    } catch (err) {
        console.warn('Failed to load cfgTheme. Using default cfgTheme.');
        storedCfgTheme = {};
    }
    mergeCfg(storedCfgTheme, defaultCfgTheme, cfgTheme, 'theme');

    let cfgThemeUI = document.createElement('div');
    cfgThemeUI.id = 'cfgTheme-ui';
    parent.appendChild(cfgThemeUI);
    renderSchema(cfgThemeUI, cfgThemeSchema, cfgTheme);

    // Auto-save on any setting change
    cfgThemeUI.addEventListener('change', () => {
        localStorage.setItem(prefix + 'cfgTheme', JSON.stringify(cfgTheme));
        applyDarkMode();
    });
}

function renderStatsTab(parent) {
    let storedCfgStats = {};
    try {
        storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
    } catch (err) {
        console.warn('Failed to load cfgStats. Using default cfgStats.');
        storedCfgStats = {};
    }
    mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');

    let cfgStatsUI = document.createElement('div');
    cfgStatsUI.id = 'cfgStats-ui';
    parent.appendChild(cfgStatsUI);
    renderSchema(cfgStatsUI, cfgStatsSchema, cfgStats);

    // Auto-save on any setting change
    cfgStatsUI.addEventListener('change', () => {
        localStorage.setItem(prefix + 'cfgStats', JSON.stringify(cfgStats));
    });

    let buttonsUI = document.createElement('div');
    buttonsUI.style.cssText = 'margin-top: 20px; display: flex; gap: 8px; flex-wrap: wrap;';

    jpxUtils.createButton(buttonsUI, {
        id: 'reset-cfgStats-button',
        className: 'stg-btn danger',
        text: t('cS.resetStatsSettings'),
        onClick: (btn) => {
            cfgStats = JSON.parse(JSON.stringify(defaultCfgStats));

            let oldUI = document.getElementById('cfgStats-ui');
            let newUI = document.createElement('div');
            newUI.id = 'cfgStats-ui';
            if (oldUI) {
                oldUI.replaceWith(newUI);
                renderSchema(newUI, cfgStatsSchema, cfgStats);
            }

            return t('cGen.reset!');
        }
    });

    jpxUtils.createButton(buttonsUI, {
        id: 'export-db-button',
        className: 'stg-btn',
        text: t('cS.exportDB'),
        onClick: async () => {
            let exportData = await exportIndexedDB();
            let blob = new Blob([jpxUtils.stringifyLimited(exportData, 3)], { type: 'application/json' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `battleStats_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);

            return t('cGen.exported!');
        }
    });

    jpxUtils.createButton(buttonsUI, {
        id: 'import-db-button',
        className: 'stg-btn',
        text: t('cS.importDB'),
        onClick: (btn) => {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';

            return new Promise((resolve, reject) => {
                input.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (!file) return resolve();
                    try {
                        let content = await file.text();
                        let json = JSON.parse(content);

                        const merge = confirm(t('cS.importConfirm'));
                        await importIndexedDB(json, merge);

                        resolve(t('cGen.imported!'));
                    } catch (err) {
                        console.error(err);
                        reject(t('cGen.importFailed!'));
                    }
                });

                input.click();
            });
        }
    });

    parent.appendChild(buttonsUI);
}

//Misc
function storeTmp() {
    if (log) {
        let btcp = document.querySelector('#btcp');
        let finishBattle = document.querySelector('img[src$="finishbattle.png"]');

        if (!btcp) {
            localStorage.setItem(prefix + 'monsterData' + isekaiSuffix, JSON.stringify(monsterData));
        }
        if (!finishBattle) {
            if (cfgBattle.recordBattleLog) {
                if (Array.isArray(battleLogRecord)) localStorage.setItem(prefix + 'battleLogRecord' + isekaiSuffix, JSON.stringify(battleLogRecord));
                /*patch*/
				else localStorage.removeItem(prefix + 'battleLogRecord' + isekaiSuffix)
            }
            localStorage.setItem(prefix + 'timeRecords' + isekaiSuffix, JSON.stringify(timeRecords));
            localStorage.setItem(prefix + 'combatRecords' + isekaiSuffix, JSON.stringify(combatRecords));
            localStorage.setItem(prefix + 'revenueRecords' + isekaiSuffix, JSON.stringify(revenueRecords));
        }
    }
}

//I18n
function initDoI18n() {
    const mergeI18N = () => {Object.assign(mergedI18N, jpxUtils.deepMerge(JSON.parse(JSON.stringify(I18N)), window.jpxI18N || {}));};
    let externalI18n = window.jpxI18N;
    Object.defineProperty(window, 'jpxI18N', {
        get: () => externalI18n,
        set: (v) => {
			externalI18n = v; mergeI18N();
			jpxPanelManager.updateContent();
	},
        configurable: true
    });
    mergeI18N();
}

function t(path, args = {}) {
    if (typeof path === 'number' || (!isNaN(path) && !isNaN(parseFloat(path)))) return String(path);
    if (typeof path !== 'string') return path;

    let keys = path.split('.');
    let lastKey = keys.at(-1);
    if (!isNaN(lastKey) && !isNaN(parseFloat(lastKey))) return String(lastKey);

    let text = jpxUtils.getValueByPath(mergedI18N, keys);
    if (text === undefined) text = jpxUtils.sentenceCase(lastKey);

    if (args && typeof args === 'object') {
        for (const prop in args) {
            text = text.split('${' + prop + '}').join(String(args[prop]));
        }
    }

    return text;
}

//Panel
function jpxPanelManager(panelType) {
    const ns = jpxPanelManager;
    if (ns._init) return ns;

	ns.currentType = panelType;

	ns.createCtrlWidget = function(type) {
		if (ns.ctrlWidget) return;
        ns.currentType = type || ns.currentType;
		ns.ctrlWidget = document.createElement('div');
		ns.ctrlWidget.id = 'ctrl-widget';
		if (cfgBattle.ctrlWidgetStyleText) ns.ctrlWidget.style.cssText = cfgBattle.ctrlWidgetStyleText;

		// Bring to front function
		if (!window.jpxWidgetZIndex) window.jpxWidgetZIndex = 10000;
		const bringToFront = () => {
			window.jpxWidgetZIndex++;
			ns.ctrlWidget.style.zIndex = window.jpxWidgetZIndex;
		};
		// Apply on any interaction with the widget
		ns.ctrlWidget.addEventListener('pointerdown', bringToFront);
		ns.ctrlWidget.addEventListener('mousedown', bringToFront);
		ns.ctrlWidget.addEventListener('click', bringToFront);

		// Header (drag handle)
		ns.headerDiv = document.createElement('div');
		ns.headerDiv.id = 'ctrl-widget-header';
		ns.headerDiv.textContent = 'JPX-PLUS';
		ns.ctrlWidget.appendChild(ns.headerDiv);

		// Body container
		ns.bodyDiv = document.createElement('div');
		ns.bodyDiv.id = 'ctrl-widget-body';
		ns.ctrlWidget.appendChild(ns.bodyDiv);

		// Info area
		ns.infoDiv = document.createElement('div');
		ns.infoDiv.className = 'cw-info';
		ns.bodyDiv.appendChild(ns.infoDiv);

		switch (ns.currentType) {
			case 'battle': {
				// --- Toggle: 自动开战 (包含开始战斗功能) ---
                ns.autoStartRow = ns._createToggleRow(
					() => t('cW.autoStartBattle'),
					() => isActiveBattle,
					() => { toggleAutoStart(); }
				);
				ns.bodyDiv.appendChild(ns.autoStartRow.row);

				// --- Toggle: 随机延迟 ---
                ns.delayToggleRow = ns._createToggleRow(
					() => t('cB.randomDelayEnabled'),
					() => cfgBattle.randomDelayEnabled,
					() => { toggleRandomDelay(); }
				);
				ns.bodyDiv.appendChild(ns.delayToggleRow.row);

				// --- Delay Info ---
				ns.delayInfoDiv = document.createElement('div');
				ns.delayInfoDiv.className = 'cw-delay-info';
				ns.bodyDiv.appendChild(ns.delayInfoDiv);

				// --- Delay Edit Buttons ---
				ns.delayEditDiv = document.createElement('div');
				ns.delayEditDiv.className = 'cw-delay-btns';
				ns.bodyDiv.appendChild(ns.delayEditDiv);

				// Mobile: settings button
				if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
					let settingsDiv = document.createElement('div');
					settingsDiv.textContent = t('cW.openSettings');
					settingsDiv.className = 'cw-row';
					settingsDiv.style.cssText = 'cursor: pointer; justify-content: center; font-weight: bold; color: #555;';
					settingsDiv.addEventListener('pointerdown', (e) => {
						e.stopPropagation();
						e.preventDefault();
						let proficiencyRecord = document.querySelector('#proficiency-record');
						if (proficiencyRecord) proficiencyRecord.style.left = '800px';
						renderSettings();
					});
					ns.bodyDiv.appendChild(settingsDiv);
				}
				break;
			}
		}

        document.body.appendChild(ns.ctrlWidget);

		// --- Drag support ---
		ns._initDrag();
		// Restore saved position
		ns._restorePosition();
	};

    // Helper: create a toggle row (button only)
    ns._createToggleRow = function(labelFn, stateFn, onToggle) {
        const row = document.createElement('div');
        row.className = 'cw-row';

        const btn = document.createElement('div');
        btn.className = 'cw-toggle-btn';
        btn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
        });
        row.appendChild(btn);

        return {
            row,
            update: () => {
                const isOn = stateFn();
                btn.textContent = labelFn();
                btn.classList.toggle('on', isOn);
                btn.classList.toggle('off', !isOn);
            }
        };
    };

	// Drag functionality
	ns._initDrag = function() {
		let isDragging = false;
		let dragOffsetX = 0, dragOffsetY = 0;

		ns.headerDiv.addEventListener('pointerdown', (e) => {
			if (e.button !== 0) return;
			isDragging = true;
			dragOffsetX = e.clientX - ns.ctrlWidget.getBoundingClientRect().left;
			dragOffsetY = e.clientY - ns.ctrlWidget.getBoundingClientRect().top;
			ns.headerDiv.setPointerCapture(e.pointerId);
			e.preventDefault();
		});

		ns.headerDiv.addEventListener('pointermove', (e) => {
			if (!isDragging) return;
			let newLeft = e.clientX - dragOffsetX;
			let newTop = e.clientY - dragOffsetY;
			// Clamp within viewport
			newLeft = Math.max(0, Math.min(window.innerWidth - ns.ctrlWidget.offsetWidth, newLeft));
			newTop = Math.max(0, Math.min(window.innerHeight - 30, newTop));
			ns.ctrlWidget.style.left = newLeft + 'px';
			ns.ctrlWidget.style.top = newTop + 'px';
			ns.ctrlWidget.style.transform = 'none';
		});

		ns.headerDiv.addEventListener('pointerup', (e) => {
			if (!isDragging) return;
			isDragging = false;
			ns.headerDiv.releasePointerCapture(e.pointerId);
			// Save position
			ns._savePosition();
		});
	};

	ns._savePosition = function() {
		try {
			const pos = {
				left: ns.ctrlWidget.style.left,
				top: ns.ctrlWidget.style.top
			};
			localStorage.setItem(prefix + 'ctrlWidgetPos' + isekaiSuffix, JSON.stringify(pos));
		} catch(e) {}
	};

	ns._restorePosition = function() {
		try {
			const saved = JSON.parse(localStorage.getItem(prefix + 'ctrlWidgetPos' + isekaiSuffix));
			if (saved && saved.left && saved.top) {
				ns.ctrlWidget.style.left = saved.left;
				ns.ctrlWidget.style.top = saved.top;
				ns.ctrlWidget.style.transform = 'none';
			}
		} catch(e) {}
	};

    ns.updateContent = function(type) {
		if (!ns.infoDiv) return;
		ns.currentType = type || ns.currentType;
		switch (ns.currentType) {
			case 'battle': {
				// Update header status dot
				if (ns.headerDiv) {
					ns.headerDiv.style.background = isActiveBattle ? '#4caf50' : '#555';
				}

				// Info rows
				ns.infoDiv.innerText = cfgBattle.ctrlWidgetRows
					.map(row => {
						let field = CTRLWIDGET_FIELDS.find(f => f.id === row.id);
						return field ? `${t(field.label)}: ${field.get()}` : null;
					})
					.filter(line => line !== null)
					.join('\n');

                    // Switch rows update
                    if (ns.battleToggleRow) ns.battleToggleRow.update();
                    if (ns.autoStartRow) ns.autoStartRow.update();
                    if (ns.delayToggleRow) ns.delayToggleRow.update();

                    // Delay info
                    if (ns.delayInfoDiv) {
                        let { min, max } = normalizeDelayRange(getUnifiedDelayRange());
                        ns.delayInfoDiv.textContent =
                            `延迟范围: ${min}-${max} | ` +
                            `本轮随机: 下一轮 ${lastRandomDelays.nextRound} / ` +
                            `操作 ${lastRandomDelays.action} / ` +
                            `用药 ${lastRandomDelays.item} / ` +
                            `切换 ${lastRandomDelays.toggle}`;
                    }

                    // Delay edit buttons
                    if (ns.delayEditDiv) {
                        ns.delayEditDiv.innerHTML = '';
                        let types = [
                            { isMin: true, label: '最小 ±50' },
                            { isMin: false, label: '最大 ±50' }
                        ];
                        types.forEach(type => {
                            let btn = document.createElement('button');
                            btn.textContent = type.label;
                            btn.addEventListener('pointerdown', (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (e.button === 0) {
                                    adjustDelay(50, type.isMin);
                                } else if (e.button === 2) {
                                    adjustDelay(-50, type.isMin);
                                }
                            });
                            btn.addEventListener('contextmenu', (e) => e.preventDefault());
                            ns.delayEditDiv.appendChild(btn);
                        });
                    }
				break;
			}
		}
    };

	ns.setBackground = function(color) {
		// Background now controlled by header; keep for compatibility
		if (ns.headerDiv) {
			if (color === '#0F0') ns.headerDiv.style.background = '#4caf50';
			else if (color === '#F00') ns.headerDiv.style.background = '#d32f2f';
			else if (color === '#FF0') ns.headerDiv.style.background = '#f9a825';
			else ns.headerDiv.style.background = color;
		}
	};

    ns._init = true;
    return ns;
}

//Market
function jpxMarket() {
    const ns = jpxMarket;
    if (ns._init) return ns;

    ns.getMarketPrice = async function () {
        let priceData = JSON.parse(localStorage.getItem(prefix + 'priceData' + isekaiSuffix) || '{}');
        let currentDate = new Date().toISOString().slice(0, 10);
        if (
            !priceData?.lastUpdate ||
            new Date(priceData.lastUpdate).toISOString().slice(0, 10) != currentDate
        ) {
            priceData = await this.updatePrice(priceData);
        }

        return priceData;
    };

    ns.updatePrice = async function (priceData) {
        let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
        let isekaiSuffixUrl = document.URL.includes('isekai') ? 'isekai/' : '';
        let urlArray = [
            `${location.origin}/${isekaiSuffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=co`,
            `${location.origin}/${isekaiSuffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=ma`,
            `${location.origin}/${isekaiSuffixUrl}?s=Bazaar&ss=mk&screen=browseitems&filter=tr`,
        ];
        if (!isekaiSuffix) {
            urlArray = urlArray.concat([
                `${location.origin}/?s=Bazaar&ss=mk&screen=browseitems&filter=ar`,
                `${location.origin}/?s=Bazaar&ss=mk&screen=browseitems&filter=fi`,
                `${location.origin}/?s=Bazaar&ss=mk&screen=browseitems&filter=mo`,
            ]);
        }
        let defaultPriceData = {
            //Stamina
            'Energy Drink': 400,

            //Material
            'Low-Grade Cloth': 2, 'Mid-Grade Cloth': 10, 'High-Grade Cloth': 50,
            'Low-Grade Leather': 2, 'Mid-Grade Leather': 10, 'High-Grade Leather': 50,
            'Low-Grade Metals': 2, 'Mid-Grade Metals': 10, 'High-Grade Metals': 50,
            'Low-Grade Wood': 2, 'Mid-Grade Wood': 10, 'High-Grade Wood': 50,
            'Scrap Cloth': 1, 'Scrap Leather': 1, 'Scrap Metal': 1, 'Scrap Wood': 1,
            'Energy Cell': 2,

            //Consumable
            //    Restorative
            'Health Draught': 1, 'Health Potion': 2, 'Health Elixir': 20,
            'Mana Draught': 2, 'Mana Potion': 4, 'Mana Elixir': 40,
            'Spirit Draught': 2, 'Spirit Potion': 4, 'Spirit Elixir': 40,
            'Last Elixir': 40,
            //    Infusion
            'Infusion of Flames': 8, 'Infusion of Frost': 8, 'Infusion of Storms': 8, 'Infusion of Lightning': 8, 'Infusion of Divinity': 8, 'Infusion of Darkness': 8,
            //    Scroll
            'Scroll of Swiftness': 8, 'Scroll of Protection': 8, 'Scroll of the Avatar': 20,
            'Scroll of Absorption': 4, 'Scroll of Shadows': 8, 'Scroll of Life': 12, 'Scroll of the Gods': 32,
            //    Shard
            'Voidseeker Shard': 10, 'Aether Shard': 50, 'Featherweight Shard': 10, 'Amnesia Shard': 50,
            'World Seed': 50,
            //    Special Item
            'Flower Vase': 200, 'Bubble-Gum': 200,

            //Token of Blood, Chaos Token, Soul Fragment
            'Token of Blood': 0, 'Chaos Token': 0, 'Soul Fragment': 0,

            //Food
            'Monster Chow': 1, 'Monster Edibles': 1, 'Monster Cuisine': 1, 'Happy Pills': 10,

            //Figurine
            'Twilight Sparkle Figurine': 10000, 'Rainbow Dash Figurine': 10000, 'Applejack Figurine': 10000, 'Fluttershy Figurine': 10000,
            'Pinkie Pie Figurine': 10000, 'Rarity Figurine': 10000, 'Trixie Figurine': 10000, 'Princess Celestia Figurine': 10000,
            'Princess Luna Figurine': 10000, 'Apple Bloom Figurine': 10000, 'Scootaloo Figurine': 10000, 'Sweetie Belle Figurine': 10000,
            'Big Macintosh Figurine': 10000, 'Spitfire Figurine': 10000, 'Derpy Hooves Figurine': 10000, 'Lyra Heartstrings Figurine': 10000,
            'Octavia Figurine': 10000, 'Zecora Figurine': 10000, 'Cheerilee Figurine': 10000, 'Vinyl Scratch Figurine': 10000,
            'Daring Do Figurine': 10000, 'Doctor Whooves Figurine': 10000, 'Berry Punch Figurine': 10000, 'Bon-Bon Figurine': 10000,
            'Fluffle Puff Figurine': 10000, 'Angel Bunny Figurine': 10000, 'Gummy Figurine': 10000,

            //Artifacts
            'Precursor Artifact': 2000,

            //Trophy
            'ManBearPig Tail': 200, 'Holy Hand Grenade of Antioch': 200, "Mithra's Flower": 200, 'Dalek Voicebox': 200, 'Lock of Blue Hair': 200,
            'Bunny-Girl Costume': 400, 'Hinamatsuri Doll': 400, 'Broken Glasses': 400,
            'Black T-Shirt': 800, 'Sapling': 800,
            'Unicorn Horn': 1000,
            'Noodly Appendage': 1000,

            //Crystal
            'Crystal of Vigor': 1, 'Crystal of Finesse': 1, 'Crystal of Swiftness': 1, 'Crystal of Fortitude': 1, 'Crystal of Cunning': 1, 'Crystal of Knowledge': 1,
            'Crystal of Flames': 1, 'Crystal of Frost': 1, 'Crystal of Lightning': 1, 'Crystal of Tempest': 1, 'Crystal of Devotion': 1, 'Crystal of Corruption': 1,

            //Upgrade Material
            'Wispy Catalyst': 1, 'Diluted Catalyst': 5, 'Regular Catalyst': 10, 'Robust Catalyst': 25, 'Vibrant Catalyst': 50, 'Coruscating Catalyst': 100,
        };
        let latestPriceData = {};

        if (!log || finishBattle) {
            priceData['lastUpdate'] = Date.now();
            await jpxUtils.xhrGet(urlArray).then((results)=>{
                console.log('jpxUtils.xhrGet Results:');
                console.log(results);
                for (let result of results){
                    if (result['status'] === 'rejected') {
                        console.error(result['reason']);
                        break;
                    }
                    try {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(result['value']['responseText'], 'text/html');
                        let itemListTrs = doc.querySelectorAll('#market_itemlist > table > tbody > tr');

                        itemListTrs.forEach((itemListTr, index) => {
                            if (index === 0) return;

                            let itemListTds = itemListTr.querySelectorAll('td');
                            if (itemListTds.length >= 4) {
                                let name = itemListTds[0].textContent.trim();
                                let bid = parseFloat(itemListTds[2].textContent.trim().replace(' C', '').replace(',', ''));
                                let defaultBid = defaultPriceData[name];

                                if (!isNaN(bid)) {
                                    if (!isNaN(defaultBid)) {
                                        if (bid >= defaultBid) {
                                            latestPriceData[name] = bid;
                                        } else {
                                            latestPriceData[name] = defaultBid;
                                        }
                                    } else {
                                        latestPriceData[name] = bid;
                                    }
                                } else if (!isNaN(defaultBid)) {
                                    latestPriceData[name] = defaultBid;
                                }
                            }
                        });
                    } catch (e) {
                        console.error('Parsing error for url: ' + result['value']['url']);
                    }
                }
            });
        }

        for (let latestPriceDataKey in latestPriceData) {
            priceData[latestPriceDataKey] = latestPriceData[latestPriceDataKey];
        }
        for (let defaultPriceDataKey in defaultPriceData) {
            if (!priceData[defaultPriceDataKey]) {
                priceData[defaultPriceDataKey] = defaultPriceData[defaultPriceDataKey];
            }
        }
        if (isekaiSuffix) {
            priceData['Energy Drink'] = 130000;
        }

        localStorage.setItem(prefix + 'priceData' + isekaiSuffix, JSON.stringify(priceData));

        return priceData;
    };

    ns._init = true;
    return ns;
}

//Utils
function jpxUtils() {
    const ns = jpxUtils;
    if (ns._init) return ns;

    ns.throttle = function (func, cooldownMillis, trailing = false) {
        let lastRan = 0;
        let timeoutId = null;
        let trailingThis = null;
        let trailingArgs = null;

        return (...args) => {
            if (Date.now() - lastRan > cooldownMillis) {
                lastRan = Date.now();
                func.call(this, ...args);
            } else if (trailing) {
                trailingThis = this;
                trailingArgs = args;
                if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        lastRan = Date.now();
                        timeoutId = null;
                        func.call(trailingThis, ...trailingArgs);
                    }, cooldownMillis - (Date.now() - lastRan));
                }
            }
        };
    };

    ns.secondsToTime = function (seconds) {
        let tHours = Math.floor(seconds / 3600);
        let tMinutes = Math.floor(seconds / 60) % 60;
        let tSeconds = Math.round(seconds % 60);
        let time =
            tHours.toString().padStart(2, '0') + ':' +
            tMinutes.toString().padStart(2, '0') + ':' +
            tSeconds.toString().padStart(2, '0');

        return time;
    };

    ns.daysSince = function(dateStr) {
        if (!dateStr) return null;
        let date = new Date(dateStr + 'T00:00:00Z');
        if (isNaN(date)) return null;

        let now = new Date();
        let today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

        return Math.floor((today - date) / (1000 * 60 * 60 * 24));
    };

    ns.getSortedArray = function(arr, getValue, asc = true) {
        if (!Array.isArray(arr) || !arr.length) return [];

        if (typeof getValue !== 'function') getValue = (item) => item;

        return [...arr].sort((a, b) => {
            let va = getValue(a);
            let vb = getValue(b);
            return asc ? va - vb : vb - va;
        });
    };

    ns.lowerFirst = function (str) {
        if (!str) return str;
        return str.charAt(0).toLowerCase() + str.slice(1);
    };

    ns.titleCase = function (str, multiWord = false) {
        if (!str) return str;
		if (!multiWord && /\s/.test(str)) return str;
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    ns.sentenceCase = function (str, multiWord = false) {
        if (!str) return str;
        if (!multiWord && /\s/.test(str)) return str;
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/^./, c => c.toUpperCase());
    };

    ns.matchAny = function (str, ...regexps) {
        for (const regexp of regexps) {
            let matches = str.match(regexp);
            if (matches) {
                return matches;
            }
        }
        return null;
    };

    ns.isEmpty = function (obj) {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) return false;
        }

        return true;
    };

    ns.inRange = function (value, range) {
        let [min, max] = range;
        return value >= min && value <= max;
    };

    ns.getValueByPath = function(obj, keys) {
        let current = obj;
        for (const key of keys) {
            if (current[key] === undefined) return undefined;
            current = current[key];
        }
        return current;
    }

    ns.deepMerge = function (target, source) {
        if (!source) return target;
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], this.deepMerge(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    }

    ns.getSortedKeys = function(order, keys) {
        let sortedKeys = order.filter(key => keys.includes(key));
        let extraKeys = keys.filter(key => !order.includes(key));
        return [...sortedKeys, ...extraKeys];
    };

    ns.inc = function (obj, key, step = 1) {
        if (!obj || key == null) return;
        obj[key] = (obj[key] ?? 0) + (step || 0);
    };

    ns.createButton = function (container, options) {
        let { id, className, cssText, text, disabled, onClick } = options;

        let btn = document.createElement('button');
        if (id) btn.id = id;
        if (className) btn.className = className;
        if (cssText) btn.style.cssText = cssText;
        if (text) btn.textContent = text;
        if (disabled) btn.disabled = true;
        container.appendChild(btn);

        if (onClick) {
            btn.addEventListener('click', (e) => {
                let result = onClick(btn, e);

                const handleTempText = (tempText) => {
                    if (!tempText) return;
                    let originalText = btn.textContent;
                    btn.style.width = btn.offsetWidth + 'px';
                    btn.textContent = tempText;
                    btn.disabled = true;

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.width = '';
                        btn.disabled = false;
                    }, 1500);
                };

                if (result instanceof Promise) result.then(handleTempText).catch(handleTempText);
                else handleTempText(result);
            });
        }

        return btn;
    };

    ns.createToast = function(content, duration = 3000, styleName) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; right: 16px; bottom: 16px; display: flex; flex-direction: column-reverse; gap: 8px; z-index: 9;';
            document.body.appendChild(container);
        }

        let toast = document.createElement('div');
        toast.textContent = content;
        toast.style.cssText = 'padding: 10px 14px; background: #333; color: #fff; font-size: 14px; cursor: pointer; opacity: 0; transition: opacity .2s;';
        if (styleName) toast.className = styleName;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');

        const close = () => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 200);
        };

        toast.addEventListener('pointerdown', close);
        setTimeout(close, duration);

        return toast;
    };

    ns.stringifyLimited = function(obj, maxPrettyLevel = 3) {
        function helper(value, level) {
            if (value && typeof value === 'object') {
                const isArray = Array.isArray(value);
                const entries = isArray ? value : Object.entries(value);

                if (level < maxPrettyLevel) {
                    if (isArray) {
                        return '[\n' +
                            value.map(value => '\t'.repeat(level + 1) + helper(value, level + 1))
                                .join(',\n') + '\n' +
                            '\t'.repeat(level) + ']';
                    } else {
                        return '{\n' +
                            Object.entries(value)
                                .map(([key, value]) => '\t'.repeat(level + 1) + JSON.stringify(key) + ': ' + helper(value, level + 1))
                                .join(',\n') + '\n' +
                            '\t'.repeat(level) + '}';
                    }
                } else {
                    return JSON.stringify(value);
                }
            } else {
                return JSON.stringify(value);
            }
        }

        return helper(obj, 0);
    }

    ns.toRegExp = function(input) {
        let match = input.match(/^\/(.*?)\/([dgimsuvy]*)$/);

        if (match) {
            let [, pattern, flags] = match;
            try {
                return new RegExp(pattern, flags);
            } catch (e) {
                console.error('Invalid regex syntax:', e.message);
                return null;
            }
        }

        return new RegExp(input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    ns.parseHVClasses = function (container, preserveSmallWords = false){
        let content = [...container?.children]
            .map(div => {
                const HVClasses = {
                    '2a': '.', '2b': ',', '2c': '!', '2d': '?', '2e': '%', '2f': '+', '2g': '-', '2h': '=', '2i': '/', '2j': '\\',
                    '2k': "'", '2l': '"', '2m': ':', '2n': ';', '2o': '(', '2p': ')', '2q': '[', '2r': ']', '2s': '_', '39': ' ',
                };

                let key = div.className.slice(-2);
                return HVClasses[key] ?? div.className.slice(-1);
            })
            .join('')
            .toLowerCase()
            .split(' ')
            .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : word)
            .join(' ');

        if (preserveSmallWords) {
            let smallWords = ['Of', 'The'];
            let regex = new RegExp(`(?<!^)\\b(${smallWords.join('|')})\\b(?<!$)`, 'g');
            content = content.replace(regex, match => match.toLowerCase());
        }

        return content;
    };

    ns.createTimeRecords = function() {
        return {
            action: 0,
            turn: 0,
            riddle: { lastTurn: -1, solved: 0, total: 0 },
            lastUse: {}
        };
    };

    ns.createCombatRecords = function() {
        return {
            use: {},
            physicalDealt: { glance:0, hit:0, crit:0, miss:0, evade:0, parryPartially:0, parry:0 },
            magicalDealt: { glance:0, hit:0, crit:0, miss:0, evade:0, resist50:0, resist75:0, resist90:0, resistPartially:0, resist:0 },
            physicalTaken: { glance:0, hit:0, crit:0, miss:0, evade:0, parryPartially:0, parry:0, blockPartially:0, block:0 },
            magicalTaken: { glance:0, hit:0, crit:0, miss:0, evade:0, resist50:0, resist75:0, resist90:0, resistPartially:0, resist:0, blockPartially:0, block:0 },
        };
    };

    ns.createRevenueRecords = function() {
        return {
            exp: 0,
            credit: 0,
            proficiency: {},
            equipment: {},
            material: {},
            consumable: {},
            token: {},
            food: {},
            figurine: {},
            artifact: {},
            trophy: {},
            crystal: {},
            staminaCost: 0,
            totalProfit: 0,
            finalProfit: 0,
        };
    };

    ns.xhrGet = async function(urlArray, interval = 250) {
        let promises = [];
        urlArray.forEach((url, index) => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.info('jpxUtils.xhrGet: ' + url);
                    let xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = () => {
                        if (xhr.status === 200) {
                            resolve({
                                url: url,
                                responseText: xhr.responseText,
                            });
                        } else {
                            reject('Failed to load: ' + url);
                        }
                    };
                    xhr.onerror = () => {
                        reject('XHR error for URL: ' + url);
                    };
                    xhr.send();
                }, index * interval);
            });
            promises.push(promise);
        });

        return Promise.allSettled(promises);
    };

    ns._init = true;
    return ns;
}

initDo();
