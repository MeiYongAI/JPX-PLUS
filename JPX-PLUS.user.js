// ==UserScript==
// @name         JPX-PLUS
// @namespace    ijpx
// @author       MeiYongAI
// @version      2026.11.06.12
// @description  JPX-PLUS
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGdklEQVR4AeyZW2wUVRjHvxkqiBAFqSigQuoFEiAhEa2GbAUCmijSlIv4oJFwFQn6YqvR6IOJRlpeFBEplGDCA4hAimiiICBL1SomJEACKg2IgJZyMyCCZY7nN2E2ZZjZnZndtrvbbvr1zLl98//958zZzYwpAT/xj+b1ji+bOTVePXvhzuqZn+2qnvVNvHrW9mwItKAprrXZGrXWgFiS0gCddBzJpeC/02IYn1rWlfJzjedLjzc0jT3+28nRWRFaC5rQJlojWtGM9lRG+BoQXzmjiCQiasulC5dL92w7KLWLd8jy8o3G2oVfF2xa8q18vnRnVgRa0IQ2NKIVzWiHARY/IzwNYBmpy8ZeZalJ9Zv3yidvbS6o/2Kf/Hn4lF+erGlHI1ptzVo7DLDA5CXyOgPiy2fNYRnpRDetq9pi7Nn+i9e8nGhDOwywwGSzuZRfY4DtkpJlh/ceE5bV2cbzruG5V4UBFphEs9mMLTASBnCfKCWrTjQ0yVerfmgxJD8OYYINRlgdqoQBqtmoVKK671z3s9OXdyVsMMLqwNkG8HVhiDH5py/3GywZpzPfSthghBVm+GwDlFgv/HvhUjObBo35HDDCCjOcJr/wcORA/eECGjpCwAoz7KZ0uTwO6CP7T1B0iEiwanZTDHOkZVlKf1d2CHggYbUsS8Fu6nvhnr+bLlyhI9eiaNhAqVg23w6Ow+iHGXZTL4HeF89fysn7f+y0mPTq28uOKQsmhOEXmGHXK0BM/Xs51GRn8MRXFkjl7u1S89evGQlykbPPXXc6p0hatrzqGJF08NVOp4BZiegF4LSELBFaWv6SBBUbJD25yDlqWlmQ4RkZY0bNgtCoc1PNa83c7nNHNuDU0T/cuVq1znJnw3t34xvihPuETjslY5njHuOuRzZg15oN7lytWnc2vKAnYU8IsjFGNmDTosVSt2a9tPVKCGoA4043nqNIGpENIOvKl1+TipFjZObt90UO8gSJbWvj0rDvSJCh9pizjWeFOXYlyb+0DEiSN+NdwK94c7W8XvZOItwnadlXOXdJIMNyxgA3bKbqnQZkysn2yMNt4Zy35bHTFqTM6RXAJgd40A3Py5CcNgB4NsagG17eGeAFFLYtp1dAWFiv8Z0GeLmST22pWDpXQCqH8r2/cwXk+xVOxRdpBfA8kAeYBMc8y0t1omztD20AwDyzA5rgOOpDTOa3tzGhDQDYLdqrzT0mTL0tnzKFNsBPXJSrWXj3gDC+tMrY0Ab4qYgCM/iRhzzTHair92xvjcbQBpz8/ZinDj8Yz8FXG/1unaaj3ue4Oi2jRWgDDn7nfXWAGTyqOLA4NlO/wXVrN/p1Zbw9vAHf/+gromLDahn1zOSUr8uAxzCvROwxhFdfa7SFN0Dfn7wP8BMz4/33hMAIVoSzOVInyrVJfvDkrF30IUWbRWgDUIbIZFdpiL4VMIEVwY8l3h5TJ+gjh1ew+SUz12tOum2RDAA+lQlhhZGzatKzYaelPT6SAZyVK7VLvx9EOPV0ghw1+i1TOjmcuWHLyAZwok36/eDCsueEpUs9SjCX12sH9d4SZX66c0xDxDL4HzETV4+lW6mXL8dh0vBukblh5mRqLMywm5aoM917dmtONzFXkCuJEbVVHwjB1XVMoaRep98oM4YXqhyne96o82GGXV9789DNhT26RE3knocR3BoEVxdTgKWkzlVnjHteW9dhNsQ8ZIqydpumadwxqI90lA+sMNvscqXrVsAHDu1H0SEiwarZzdiLS88oUeuHFA9Kex/IFfdghRl2+2vQEPPjG3t0Kxgx5n7J9w+MsBqaWfTHNiA2Z/lWHHnwiaGqV9+eujk//2CDEVaYobQN4MAoUBWGGBdLpj5ANS8DNhhhdQATBsRmrGwwDJner6hQHp/+sNOfNyVMsMEIqwOWMICG2NyadWLI3EHDB8jE+Y8KS4b2XA4YYIEJNpuxBdA1BtAem72iWpR6Wn9X/jO1fLxi06A9FwPtMMACk83mArnOAPpxyeiqhuvfyxuKJwyX59+e0Fz85DDRiejO6kAjWm3NWjsMsMDkJdz0aqSN+6RkTs0UEWN8tx5da0eMHSylC0bL7KoyNe3Vx5pZVk/NK5FsCLSgCW1oRCuaRWuHARbx+fga4IyP6a/IEoxovuFWlpFpdqm6pW/P2v5Fhdv633vbjvYO+/xaC5rQhkbRWtEc09odDr/yfwAAAP//nlygdwAAAAZJREFUAwCEBED17v6rSAAAAABJRU5ErkJggg==
// @run-at       document-end
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        unsafeWindow
// @homepageURL  https://github.com/MeiYongAI/JPX-PLUS
// @supportURL   https://github.com/MeiYongAI/JPX-PLUS/issues
// @updateURL    https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS.user.js
// @downloadURL  https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS.user.js
// ==/UserScript==

// Keep the existing Battle API, confirmation handler and language pack in the page window.
(function jpxMain(window) {

let cfgBattle = {};
const settingsPlugins = new Map();
// Optional userscripts own their UI, network permissions and credentials.
window.JPXPlus = Object.freeze({
    apiVersion: 1,
    version: '2026.11.06.12',
    registerSettingsTab(plugin) {
        if (!plugin || !/^[a-z][a-zA-Z0-9-]{0,39}$/.test(plugin.id) ||
            ['battle', 'battleRules', 'keyBindings', 'stats'].includes(plugin.id) ||
            typeof plugin.render !== 'function' || typeof plugin.title !== 'function') return false;
        if (settingsPlugins.has(plugin.id)) return false;
        settingsPlugins.set(plugin.id, plugin);
        window.dispatchEvent(new Event('jpx:settings-plugin'));
        return true;
    }
});
let defaultCfgBattle = {
    "battleVersion": 20251216,
    "advanceToNextRound": false,
    // Retired automation fields remain inert for legacy configuration round trips.
    "autoStartBattle": false,
    "autoCheckIn": false,
    "dailyBattleTime": "08:00",
    "autoArena": false,
    "autoRingOfBlood": false,
    "autoRingOfBloodChallenges": [],
    "autoEncounter": false,
    "ajaxRound": false,
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
            {"type":"item","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"item","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.5]}]},
            {"type":"item","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"item","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"item","name":"Health Gem","conditions":[]},
            {"type":"spellSupport","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellSupport","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"item","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"item","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Heartseeker"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"toggle","name":"Spirit","toggled":true,"conditions":[{"key":"pOC","value":[6,10]}]},
            {"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[-1,0,"Heartseeker"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"item","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","name":"Weaken","targetCount":3,"tailSkip":0,"bottomUp":false,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tTypes","value":["Arena400","Arena500"],"offset":[0,0],"matched":[1,1]},{"key":"tIgnoredEffects","value":[1,9999,"Weakened"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"world","value":["Persistent"]},{"key":"tDaysSinceUpdate","value":[46,9999],"offset":[0,0],"matched":[1,1]},{"key":"tIgnoredEffects","value":[0,9999,"Imperiled","Searing Skin","Freezing Limbs","Turbulent Air","Deep Burns","Breached Defense","Blunted Attack"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"skill","name":"Scan","conditions":[{"key":"pActionCounts","value":[0,0,"Scan"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tName","value":"Yggdrasil","offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"skill","name":"Orbital Friendship Cannon","conditions":[{"key":"activeMonsters","value":[6,10]},{"key":"pOC","value":[9,10]},{"key":"pSpiritStatus","value":true}]},
            {"type":"smartDebuff","name":"Imperil","targetCount":3,"bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"smartDebuff","name":"Imperil","targetCount":3,"bottomUp":false,"tailSkip":-1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]},{"key":"activeBosses","value":[0,0]}]},
            {"type":"skill","name":"Merciful Blow","conditions":[{"key":"tTypes","value":["Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]},{"key":"tEffects","value":[0,9999,"Bleeding Wound"],"offset":[0,0],"matched":[1,1]},{"key":"tHP","value":[0.04,0.22],"offset":[0,0],"matched":[1,1]},{"key":"pOC","value":[4.5,10]}]},
            {"type":"skill","name":"Vital Strike","conditions":[{"key":"tTypes","value":["Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]},{"key":"tEffects","value":[0,9999,"Stunned"],"offset":[0,0],"matched":[1,1]},{"key":"tHP","value":[0.05,1],"offset":[0,0],"matched":[1,1]},{"key":"pOC","value":[2.5,10]}]},
            {"type":"normalAttack"}
        ]
    },
    "OneHanded_Tower": {
        "supports": [
            {"type":"item","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"item","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"item","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"item","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.6]}]},
            {"type":"item","name":"Health Gem","conditions":[]},
            {"type":"spellSupport","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellSupport","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"item","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"item","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Heartseeker"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"toggle","name":"Spirit","toggled":true,"conditions":[{"key":"pOC","value":[6,10]},{"key":"defeatedMonsters","value":[1,10]}]},
            {"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[-1,0,"Heartseeker"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"item","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]}]},
            {"type":"item","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]}]},
            {"type":"item","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","targetCount":3,"name":"Sleep","bottomUp":true,"tailSkip":1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Asleep"],"offset":[0,0],"matched":[1,1]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[36,9999]}]},
            {"type":"smartDebuff","targetCount":3,"name":"Weaken","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Weakened","Asleep"],"offset":[0,0],"matched":[1,1]},{"key":"roundCurrent","value":[10,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"smartDebuff","targetCount":3,"name":"Silence","bottomUp":true,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Asleep","Silenced"],"offset":[0,0],"matched":[1,1]},{"key":"roundCurrent","value":[15,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"smartDebuff","targetCount":3,"name":"Imperil","bottomUp":false,"tailSkip":-1,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[40,9999]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"toggle","name":"Spirit","toggled":true,"conditions":[{"key":"pOC","value":[6,10]}]},
            {"type":"skill","name":"Merciful Blow","conditions":[{"key":"tEffects","value":[0,9999,"Bleeding Wound"],"offset":[0,0],"matched":[1,1]},{"key":"tHP","value":[0.04,0.22],"offset":[0,0],"matched":[1,1]},{"key":"pOC","value":[4.5,10]},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[95,9999]}]},
            {"type":"skill","name":"Vital Strike","conditions":[{"key":"tEffects","value":[0,9999,"Stunned"],"offset":[0,0],"matched":[1,1]},{"key":"tHP","value":[0.05,1],"offset":[0,0],"matched":[1,1]},{"key":"pOC","value":[2.5,10]},{"key":"pSpiritStatus","value":true},{"key":"roundCurrent","value":[0,9999]},{"key":"floor","value":[60,9999]}]},
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
			{"type":"item","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
			{"type":"item","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.5]}]},
			{"type":"item","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
			{"type":"item","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
			{"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
			{"type":"item","name":"Health Gem","conditions":[]},
			{"type":"spellSupport","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
			{"type":"item","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
			{"type":"spellSupport","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
			{"type":"item","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
			{"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
			{"type":"item","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
			{"type":"item","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
			{"type":"item","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
			{"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
			{"type":"item","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
			{"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Heartseeker"]}]},
			{"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
			{"type":"spellSupport","name":"Heartseeker","conditions":[{"key":"pEffects","value":[-1,0,"Heartseeker"]}]},
			{"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
			{"type":"item","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]}
		],
		"attacks": [
			{"type":"smartDebuff","name":"Weaken","targetCount":3,"bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Weakened"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
			{"type":"smartDebuff","name":"Silence","targetCount":3,"bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Silenced"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
			{"type":"smartDebuff","name":"Imperil","targetCount":3,"bottomUp":false,"tailSkip":0,"maxAtFirst":4,"minMonstersLeft":5,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
			{"type":"kamisamaniNattaHi","code":"let{prefix:e,isekaiSuffix:n,battleType:t,towerFloor:r,roundInfo:i,vitals:o,spiritStatus:a,actionCounts:l,spellCooldowns:s,monsterData:g,monstersObj:{monsters:c,activeMonsters:f,bosses:u,activeBosses:d},actionHandlers:h,doSpellsDebuffGoNext:m,doSpellGoNext:P,doAttackGoNext:p,doToggleGoNext:B}=jpx,w=parseInt(localStorage.getItem(e+\"playerLevel\"+n)||1),x=(f[0].index,f.at(-1).index,l[\"Rending Blow\"]??0),v=\"-\"===s[\"Rending Blow\"]?9999:s[\"Rending Blow\"],R=(\"-\"===s[\"Shatter Strike\"]||s[\"Shatter Strike\"],d.reduce((e,n)=>!e||n.hpPercentage>e.hpPercentage?n:e,null)),S=f.reduce((e,n)=>!e||n.hpPercentage>e.hpPercentage?n:e,null),A=f.reduce((e,n)=>!e||T(n)>T(e)?n:e,null),G=w<300;function T(e){return g[e.index].maxHP*e.hpPercentage}function b({minTargets:e=1,minBossTargets:n=0,minNormalHP:t=.2,minBossHP:r=.1,minUnPA:i=0,minBossUnPA:o=0,bossPriority:a=!0}={}){let l=-1,s=0,g=0,f=0,u=0;for(let d=0;d<c.length;d++){if(!c[d]?.isAlive)continue;let h=0,m=0,P=0,p=0,B=Math.max(0,d-2),w=Math.min(c.length-1,d+2);for(let e=B;e<=w;e++){let n=c[e];if(!n?.isAlive)continue;let i=[\"Legendary\",\"Ultimate\",\"Arena300\",\"Arena400\",\"Arena500\"].includes(n.type);if(n.hpPercentage<(i?r:t))continue;h++,i&&m++;let o=n.effectObj[\"Penetrated Armor\"]?.turns;null!=o&&-1!==o||(P++,i&&p++)}m<n||(!a||0===m)&&h<e||p<o||(!a||0===p)&&P<i||(i>0||o>0?a?p>u||p===u&&(m>g||m===g&&h>s):P>f||P===f&&(h>s||h===s&&m>g):a?m>g||m===g&&h>s:h>s||h===s&&m>g)&&(l=d,s=h,g=m,f=P,u=p)}return l}let C=f.find(e=>\"Yggdrasil\"===e.name);if(C){if(o.oc>=2.5&&P(\"Great Cleave\",C))return!0;if(p(C))return!0}if(G)if(0===x){if((c.length>=3||f.length>=4)&&o.oc>=2.5&&P(\"Rending Blow\",c[b({minTargets:3,bossPriority:!1})]))return!0}else{if(f.length>=4&&o.oc>=3&&S.hpPercentage>.9&&P(\"Rending Blow\",c[b({minTargets:3})]))return!0;if(f.length>=6&&o.oc>=2.5&&S.hpPercentage>.7&&P(\"Rending Blow\",c[b({minTargets:3})]))return!0}if(!G&&f.length>=3){if(o.oc>=2.5&&P(\"Rending Blow\",c[b({minBossHP:.4,minBossUnPA:1})]))return!0;if(!a){if(o.oc>=2.5&&0===d.length&&P(\"Rending Blow\",c[b({minTargets:3,minNormalHP:.4})]))return!0;if(o.oc>=4.5&&R?.hpPercentage>.3&&P(\"Great Cleave\",A))return!0;if(o.oc>=6&&R?.hpPercentage<.3&&P(\"Rending Blow\",c[b({minTargets:3,minNormalHP:.4,minBossHP:.1})]))return!0;if(o.oc>=9&&S.hpPercentage>.7&&P(\"Great Cleave\",A))return!0}}if(i.current===i.total&&!a){if(o.oc>=2.5&&P(\"Great Cleave\",A))return!0;if(o.oc>=4&&P(\"Rending Blow\",c[b()]))return!0}if((!G||v<=1)&&f.length<=2&&o.oc>=(G?8:a?10:6)&&R?.hpPercentage>.4&&P(\"Great Cleave\",A))return!0;if(!G&&o.oc>=10&&S.hpPercentage>.7&&P(\"Rending Blow\",c[b({minTargets:2})]))return!0;if(!G&&o.oc>=10&&!a&&B(\"Spirit\"))return!0;if((!G||v<=1)&&o.oc>=10&&P(\"Great Cleave\",S))return!0;if(!G&&o.oc>=10&&P(\"Rending Blow\",c[b()]))return!0;if((!G||v<=1)&&o.oc>=10&&P(\"Shatter Strike\",c[b()]))return!0;if(!G&&R?.hpPercentage>.1&&p(A))return!0;let H=f.filter(e=>\"Normal\"===e.type),[N,y]=G&&H.length>0?H:f;return!(y&&1===Math.abs(N.index-y.index)||!p(N))||!!p(y.hpPercentage-N.hpPercentage>.2&&T(y)>T(N)?y:N)"}
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
            {"type":"item","name":"Spirit Gem","conditions":[{"key":"pSP","value":[0,0.9]}]},
            {"type":"item","name":"Spirit Potion","conditions":[{"key":"pSP","value":[0,0.5]}]},
            {"type":"item","name":"Last Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"item","name":"Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Spirit Elixir","conditions":[{"key":"pSP","value":[0,0.4]}]},
            {"type":"item","name":"Health Gem","conditions":[]},
            {"type":"spellSupport","name":"Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Potion","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"spellSupport","name":"Full-Cure","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"stop","customMessage":"Can't use Health Elixir","conditions":[{"key":"pHP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Gem","conditions":[{"key":"pMP","value":[0,0.8]}]},
            {"type":"item","name":"Mana Potion","conditions":[{"key":"pMP","value":[0,0.4]}]},
            {"type":"item","name":"Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"stop","customMessage":"Can't use Mana Elixir","conditions":[{"key":"pMP","value":[0,0.2]}]},
            {"type":"item","name":"Mystic Gem","conditions":[{"key":"pIgnoredEffects","value":[0,9999,"Channeling"]}]},
            {"type":"spellSupport","name":"Arcane Focus","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,100,"Arcane Focus"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[0,9999,"Channeling"]},{"key":"pEffects","value":[-1,50,"Regen"]}]},
            {"type":"spellSupport","name":"Arcane Focus","conditions":[{"key":"pEffects","value":[-1,0,"Arcane Focus"]}]},
            {"type":"spellSupport","name":"Regen","conditions":[{"key":"pEffects","value":[-1,0,"Regen"]}]},
            {"type":"item","name":"Health Draught","conditions":[{"key":"pEffects","value":[-1,0,"Regeneration"]},{"key":"monsters","value":[4,10]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Mana Draught","conditions":[{"key":"pEffects","value":[-1,0,"Replenishment"]},{"key":"pMP","value":[0,0.85]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]},
            {"type":"item","name":"Spirit Draught","conditions":[{"key":"pEffects","value":[-1,0,"Refreshment"]},{"key":"pSP","value":[0,0.9]},{"key":"battleTypes","value":["Arena","Colosseum","Battle1000","Tower","Item"]}]}
        ],
        "attacks": [
            {"type":"smartDebuff","targetCount":3,"name":"Weaken","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Weakened"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"smartDebuff","targetCount":3,"name":"Silence","bottomUp":false,"tailSkip":0,"maxAtFirst":10,"minMonstersLeft":10,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Silenced"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"smartDebuff","targetCount":3,"name":"Imperil","bottomUp":false,"tailSkip":0,"maxAtFirst":3,"minMonstersLeft":5,"conditions":[{"key":"tIgnoredEffects","value":[1,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tDaysSinceUpdate","value":[46,9999],"offset":[0,0],"matched":[1,1]},{"key":"tIgnoredEffects","value":[0,9999,"Imperiled","Searing Skin","Freezing Limbs","Turbulent Air","Deep Burns","Breached Defense","Blunted Attack"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"skill","name":"Scan","conditions":[{"key":"pActionCounts","value":[0,0,"Scan"]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tName","value":"Yggdrasil","offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled","Coalesced Mana"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Coalesced Mana"],"offset":[0,0],"matched":[1,1]},{"key":"tTypes","value":["Rare","Legendary","Ultimate","Arena300","Arena400","Arena500"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled","Coalesced Mana"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[{"key":"tEffects","value":[0,9999,"Imperiled"],"offset":[0,0],"matched":[1,1]}]},
            {"type":"target","priorityRule":"Top Down","conditions":[]},
            {"type":"spellDamage","name":"T3","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T2","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T1","conditions":[{"key":"activeMonsters","value":[2,10]}]},
            {"type":"spellDamage","name":"T3","conditions":[{"key":"pMP","value":[0.2,1]}]},
            {"type":"spellDamage","name":"T2","conditions":[{"key":"pMP","value":[0.2,1]}]},
            {"type":"spellDamage","name":"T1","conditions":[{"key":"pMP","value":[0.2,1]}]},
            {"type":"normalAttack"}
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
        {"id":"token","styleText":"color: #3a7540;"},
        {"id":"food","styleText":"color: #489eff;"},
        {"id":"figurine","styleText":"color: #25f;"},
        {"id":"artifact","styleText":"color: #25f;"},
        {"id":"trophy","styleText":"color: #7c4bff;"},
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
const JPX_DARK_COLORS = Object.freeze({ background: '#202226', surface: '#292c31', field: '#24272b', text: '#e5e0d8', muted: '#bbb2a6', accent: '#e2bc8c', border: '#5a534c', header: '#453b30', selected: '#514434', hover: '#3d3933' });
// Only transform built-in styles. User-supplied metric and panel colors keep priority.
function jpxThemeCSS(css) {
    const roles = {
        '#edebdf': 'background', '#e3e0d1': 'background', '#ece6d8': 'background',
        '#f9f6ec': 'surface', '#f4f1e5': 'surface', '#f5f1e7': 'surface', '#eee': 'surface',
        '#fffdf7': 'field', '#fff': 'field', '#ffffff': 'field',
        '#392d25': 'text', '#333': 'text',
        '#71634f': 'muted', '#79604f': 'muted', '#8c6551': 'muted', '#777': 'muted', '#666': 'muted', '#5c0d11': 'accent', '#9b4e03': 'accent',
        '#c8b49b': 'border', '#bda68e': 'border', '#ddd0bd': 'border', '#d3c5b2': 'border', '#b49369': 'border', '#baa080': 'border', '#e1d7c7': 'border', '#c1ab8c': 'border', '#ccc': 'border', '#888': 'border', '#444': 'border',
        '#e9d5ae': 'header', '#f2e6ce': 'header', '#ead9b8': 'selected', '#eddbb2': 'selected', '#e0e0e0': 'selected',
        '#f1e2c5': 'hover', '#eee2c9': 'hover', '#f0eadf': 'hover', '#f4e5c4': 'hover'
    };
    return css.replace(/#[\da-f]{3,8}\b|rgb\((?:92 13 17|155 78 3|244 229 196|237 235 223) \/ [\d.]+%\)/gi, color => {
        const role = roles[color.toLowerCase()];
        if (role) return 'var(--jpx-theme-' + role + ', ' + color + ')';
        const alpha = color.match(/^rgb\(([\d ]+) \/ ([\d.]+)%\)$/i);
        if (!alpha) return color;
        const [alphaRole, fallback] = { '92 13 17': ['accent', '#5c0d11'], '155 78 3': ['accent', '#9b4e03'],
            '244 229 196': ['hover', '#f4e5c4'], '237 235 223': ['background', '#edebdf'] }[alpha[1]];
        return 'color-mix(in srgb, var(--jpx-theme-' + alphaRole + ', ' + fallback + ') ' + alpha[2] + '%, transparent)';
    });
}
// Reuse the same converted styles in settings and temporary detail windows.
function ensureJpxStyle(doc = document) {
    if (ensureJpxStyle.source !== cfg.styleText) {
        ensureJpxStyle.source = cfg.styleText;
        ensureJpxStyle.css = jpxThemeCSS(cfg.styleText);
    }
    let style = doc.getElementById('jpx');
    if (!style) {
        style = doc.createElement('style');
        style.id = 'jpx';
        doc.head.appendChild(style);
    }
    if (style.textContent !== ensureJpxStyle.css) style.textContent = ensureJpxStyle.css;
    return style;
}
const JPX_SCROLLBAR_CSS = `
    :is(#settings-container .settings-tab-header, #settings-container [role=tabpanel], #settings-container .multiSelect-popup-panel, .jpx-records-table-scroll) { scrollbar-width: var(--jpx-scrollbar-width, thin); scrollbar-color: #5c0d11 #e3e0d1; }
    :is(#settings-container .settings-tab-header, #settings-container [role=tabpanel], #settings-container .multiSelect-popup-panel, .jpx-records-table-scroll)::-webkit-scrollbar { width: 9px; height: 9px; }
    :is(#settings-container .settings-tab-header, #settings-container [role=tabpanel], #settings-container .multiSelect-popup-panel, .jpx-records-table-scroll)::-webkit-scrollbar-track { background: #e3e0d1; }
    :is(#settings-container .settings-tab-header, #settings-container [role=tabpanel], #settings-container .multiSelect-popup-panel, .jpx-records-table-scroll)::-webkit-scrollbar-thumb { border: 2px solid #e3e0d1; background: #5c0d11; }
`;
const JPX_RECORD_IMAGE_CSS = `
        .jpx-record-image-actions { position: relative; z-index: 5; flex: none; color: #5c0d11; font: 13px/1.45 Arial, Helvetica, sans-serif; }
        .jpx-record-image-actions > summary, .jpx-record-image-actions button { box-sizing: border-box; min-height: 28px; padding: 3px 8px; border: 1px solid #c8b49b; border-radius: 4px; background: #fffdf7; color: inherit; font: inherit; cursor: pointer; }
        .jpx-record-image-actions > summary { display: none; list-style: none; }
        .jpx-record-image-actions > summary::after { content: ' ▾'; }
        .jpx-record-image-actions > summary::-webkit-details-marker { display: none; }
        .jpx-record-image-actions > div { display: grid; gap: 4px; }
        .jpx-record-image-actions button { text-align: center; white-space: nowrap; }
        html .jpx-record-image-actions button:is(:hover, :focus, :active) { background: #eee2c9; color: inherit; border-color: #c8b49b; }
        .jpx-record-image-actions button:disabled { cursor: wait; opacity: .6; }
        .jpx-record-image-toast { max-width: min(280px, calc(100vw - 32px)); box-sizing: border-box; padding: 8px 12px; border: 1px solid #c8b49b; border-radius: 4px; background: #f9f6ec; color: #5c0d11; box-shadow: 0 2px 6px #0002; font: 13px/1.45 Arial, Helvetica, sans-serif; overflow-wrap: anywhere; }
        .jpx-record-image-actions :focus-visible { outline: 1px solid #9b4e03; outline-offset: -1px; box-shadow: 0 0 0 2px rgb(155 78 3 / 12%); }
        @media (max-width: 650px), (pointer: coarse) { .jpx-record-image-actions > summary, .jpx-record-image-actions button { min-height: 40px; } }
        @media (max-width: 650px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px) {
            .jpx-record-image-toast { position: fixed; top: max(12px, env(safe-area-inset-top, 0px)); left: 50%; transform: translateX(-50%); width: max-content; max-width: min(320px, calc(100vw - 24px)); min-height: 44px; padding: 10px 14px; font-size: 14px; text-align: center; }
            .jpx-record-image-actions { position: fixed; right: 14px; bottom: max(14px, env(safe-area-inset-bottom, 0px)); }
            .jpx-record-image-actions > summary { display: flex; align-items: center; justify-content: center; gap: 4px; min-width: 80px; padding: 6px 10px; background: #f9f6ec; }
            .jpx-record-image-actions > summary::after { content: ' ▴'; }
            .jpx-record-image-actions > div { position: absolute; right: 0; bottom: calc(100% + 6px); display: grid; gap: 4px; width: max-content; max-width: calc(100vw - 28px); padding: 4px; border: 1px solid #c8b49b; border-radius: 6px; background: #f9f6ec; box-shadow: 0 2px 6px #0002; }
            .jpx-record-image-actions button { border-color: transparent; }
        }
`;
const JPX_RECORD_DETAIL_CSS = `
        ${JPX_RECORD_IMAGE_CSS}
        body.jpx-record-detail { margin: 0; background: #edebdf; }
        .jpx-record-detail { color: #392d25; font: 13px/1.45 Arial, Helvetica, sans-serif; }
        .jpx-record-detail * { box-sizing: border-box; }
        .jpx-record-detail-page { width: fit-content; max-width: min(1240px, 100%); margin: 0 auto; padding: 12px; }
        .jpx-record-detail-summary { display: grid; gap: 8px; margin-bottom: 12px; padding: 8px 10px; border: 1px solid #c8b49b; background: #f9f6ec; }
        .jpx-record-detail-summary:has(> .jpx-record-image-actions) { grid-template-columns: minmax(0, 1fr) auto; }
        .jpx-record-detail-summary > .jpx-record-image-actions { grid-column: 2; grid-row: 1 / 3; align-self: center; padding-left: 12px; border-left: 1px solid #ddd0bd; }
        .jpx-record-detail-summary > :not(.jpx-record-image-actions) { grid-column: 1; }
        .jpx-record-detail #info-records-div, .jpx-record-detail #time-records-div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 16px; text-align: left; white-space: normal; overflow-wrap: anywhere; }
        .jpx-record-detail #info-records-div { color: #5c0d11; font-weight: 600; }
        .jpx-record-detail #info-records-div > span { max-width: 100%; }
        .jpx-record-detail #time-records-div { font-size: 12px; color: #71634f; }
        .jpx-record-detail .jpx-record-metric { display: inline-flex; align-items: baseline; gap: 4px; white-space: nowrap; }
        .jpx-record-detail .jpx-record-metric strong { color: #392d25; font-weight: 600; font-variant-numeric: tabular-nums; }
        .jpx-record-detail-grid { display: grid; grid-template-columns: minmax(0, max-content) minmax(0, max-content); align-items: start; gap: 12px; }
        .jpx-record-detail-column { display: grid; align-content: start; gap: 12px; width: fit-content; min-width: 0; max-width: 100%; }
        .jpx-record-detail-scroll { width: fit-content; min-width: 0; max-width: 100%; overflow: auto; overscroll-behavior-x: contain; border: 1px solid #bda68e; background: #fffdf7; scrollbar-color: #5c0d11 #e3e0d1; }
        .jpx-record-detail-scroll:focus-visible { outline: 2px solid #9b4e03; outline-offset: 2px; }
        .jpx-record-detail table { width: auto; margin: 0 !important; border: 0; border-collapse: collapse; background: #fffdf7; font-size: 12px; font-variant-numeric: tabular-nums; }
        .jpx-record-detail td, .jpx-record-detail th { padding: 2px 4px; line-height: 1.5; vertical-align: middle; border: 1px solid #e1d7c7; }
        .jpx-record-detail tr:nth-child(even) { background-color: #f5f1e7; }
        .jpx-record-detail .records-table tr:nth-child(-n+2), .jpx-record-detail #combat-records-use-table tr:first-child { background: #e9d5ae; color: #5c0d11; font-weight: 700; }
        .jpx-record-detail .records-table tr:nth-child(2) { background: #f2e6ce; font-weight: 600; }
        .jpx-record-detail #combat-records-table { min-width: 0; }
        .jpx-record-detail #combat-records-table td { white-space: nowrap; }
        .jpx-record-detail #combat-records-table tr:nth-child(-n+2) > td { border-bottom-color: #e1d7c7; }
        .jpx-record-detail-scroll:has(> #combat-records-use-table) { width: 100%; contain: inline-size; }
        .jpx-record-detail #combat-records-use-table { width: 100%; table-layout: fixed; }
        .jpx-record-detail #combat-records-use-table td, .jpx-record-detail #combat-records-use-table th { border-color: #e1d7c7; }
        .jpx-record-detail #combat-records-use-table td { white-space: normal; overflow-wrap: anywhere; }
        .jpx-record-detail #combat-records-use-table td:first-child { width: 96px; vertical-align: top; }
        .jpx-record-detail #revenue-records-table { width: 500px; table-layout: auto; }
        .jpx-record-detail #revenue-records-table td { overflow-wrap: anywhere; }
        .jpx-record-detail #revenue-records-table tr:nth-child(n+3) > td:first-child:not([colspan]) { white-space: nowrap; }
        .jpx-record-detail #revenue-records-table tr:nth-child(n+3) > td:not(:first-child):not([colspan]) { text-align: right; white-space: nowrap; }
        @media (max-width: 1099px) {
            .jpx-record-detail-grid { grid-template-columns: minmax(0, 1fr); }
            .jpx-record-detail-page > .jpx-record-detail-summary { contain: inline-size; }
            .jpx-record-detail-page .jpx-record-detail-column, .jpx-record-detail-page .jpx-record-detail-scroll, .jpx-record-detail-page #combat-records-table { width: 100%; }
        }
        @media (max-width: 650px) { .jpx-record-detail-page { padding: 6px 6px 58px; } .jpx-record-detail-summary { padding: 6px 8px; } }
        @media (max-width: 650px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px) {
            .jpx-record-detail-page { padding-bottom: 58px; }
            .jpx-record-detail-summary:has(> .jpx-record-image-actions) { grid-template-columns: minmax(0, 1fr); }
            .jpx-record-detail-summary > .jpx-record-image-actions { padding-left: 0; border-left: 0; }
        }
        .jpx-record-final { display: grid; gap: 6px; min-width: 0; max-width: 100%; margin: 6px 0; text-align: left; }
        .jpx-record-final .jpx-record-detail-summary { margin: 0; }
        .jpx-record-final > a { margin: 0 !important; font-size: 12px !important; color: #5c0d11; }
        .jpx-record-final td, .jpx-record-final th { line-height: 1.4; }
        #btcp.jpx-final-result { box-sizing: border-box; display: block; width: 530px; min-width: 0; max-width: 530px; height: auto; min-height: 120px; max-height: 621px; overflow: auto; }
        /* Native result-panel div rules must not size or position the statistics. */
        #btcp.jpx-final-result #jpx-final-revenue, #btcp.jpx-final-result #jpx-final-revenue div { position: static; inset: auto; width: auto; min-width: 0; max-width: 100%; height: auto; min-height: 0; max-height: none; }
        #btcp.jpx-final-result #jpx-final-revenue { display: block; margin: 8px 0 0; }
        #btcp.jpx-final-result #jpx-final-revenue .jpx-record-detail-summary { margin: 0 0 6px; padding: 6px 8px; }
        #btcp.jpx-final-result #revenue-records-table { width: 100%; min-width: 480px; }
`;
let cfg = {
    //CSS
    styleText: `
        ${JPX_SCROLLBAR_CSS}
        #ctrl-widget { position: fixed; inset: auto 12px 12px auto; opacity: 1; z-index: 100; }
        #jpx-mobile-entry { display: none; position: fixed; z-index: 110; margin: 0; color: #5c0d11; font: 14px/1.4 Verdana, Arial, sans-serif; transform-origin: top left; }
        #jpx-mobile-entry > summary, #jpx-mobile-entry button { box-sizing: border-box; min-height: 44px; margin: 0; padding: 10px 12px; border: 1px solid #bda68e; border-radius: 3px; background: #edebdf; color: inherit; font: inherit; cursor: pointer; touch-action: manipulation; }
        #jpx-mobile-entry > summary { min-width: 72px; list-style-position: inside; user-select: none; }
        #jpx-mobile-entry > nav { position: absolute; bottom: calc(100% + 6px); left: 0; display: grid; gap: 4px; min-width: 116px; }
        #jpx-mobile-entry button { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; white-space: nowrap; }
        #jpx-mobile-entry svg { flex: none; width: 17px; height: 17px; }
        #jpx-mobile-entry :focus-visible { outline: 2px solid #9b4e03; outline-offset: 2px; }
        @media (pointer: coarse) { #jpx-mobile-entry { display: block; } }
        body:has(#hvut-top-config-icon) #jpx-mobile-entry { display: none; }
        #hvut-top .jpx-hvut-config > .hvut-top-config { visibility: hidden; }
        #hvut-top .jpx-hvut-config[data-jpx-open=true] > .hvut-top-config { visibility: visible; }
        body:has(#settings-container[open]) #jpx-mobile-entry { visibility: hidden; }
        .jpx-widget-card {
            --jpx-state-header: var(--jpx-manual-header, #b49c8e); --jpx-state-ink: var(--jpx-manual-ink, #3d2b22);
            --jpx-state-border: var(--jpx-manual-border, #896f60); --jpx-state-accent: var(--jpx-manual-border, #72513d);
            box-sizing: border-box; width: 196px; max-width: calc(100vw - 16px);
            height: auto; padding: 0; border: 1px solid var(--jpx-state-border); border-radius: 4px;
            background: #edebdf; color: var(--jpx-theme-text, #000); font: 12px/1.45 Arial, Helvetica, sans-serif;
            text-align: left; box-shadow: 0 2px 8px rgb(45 32 20 / 16%); overflow: hidden;
        }
        .jpx-widget-card[data-battle-state=auto] {
            --jpx-state-header: var(--jpx-auto-header, #86b16f); --jpx-state-ink: var(--jpx-auto-ink, #19351e);
            --jpx-state-border: var(--jpx-auto-border, #5c8248); --jpx-state-accent: var(--jpx-auto-border, #3c662c);
        }
        .jpx-widget-card[data-battle-state=waiting] {
            --jpx-state-header: var(--jpx-waiting-header, #d5ac4e); --jpx-state-ink: var(--jpx-waiting-ink, #49330b);
            --jpx-state-border: var(--jpx-waiting-border, #9a7625); --jpx-state-accent: var(--jpx-waiting-border, #805d0d);
        }
        /* Theme defaults also apply to the preview; inline custom colors keep priority. */
        html[data-jpx-theme=dark] .jpx-widget-card {
            --jpx-auto-header: #344d31; --jpx-auto-surface: #252d24; --jpx-auto-border: #6e925e; --jpx-auto-ink: #def0d3;
            --jpx-manual-header: #51443a; --jpx-manual-surface: #2b2927; --jpx-manual-border: #9a8270; --jpx-manual-ink: #f0e0d1;
            --jpx-waiting-header: #5c491f; --jpx-waiting-surface: #302c22; --jpx-waiting-border: #b2934c; --jpx-waiting-ink: #ffebb7;
            --jpx-widget-info-hover: rgb(255 255 255 / 6%);
        }
        /* Outrank native button hover/focus/active rules without overriding custom palette values. */
        #ctrl-widget .jpx-widget-drag, .jpx-widget-card .jpx-widget-drag {
            display: flex; box-sizing: border-box; align-items: center; gap: 6px;
            width: 100%; margin: 0; padding: 5px 8px; min-height: 28px;
            border: 0; border-bottom: 1px solid var(--jpx-state-border); border-radius: 0;
            background: var(--jpx-state-header); color: var(--jpx-state-ink); font: inherit; line-height: 1.2;
            text-align: left; cursor: grab; touch-action: none; user-select: none;
        }
        .jpx-widget-card .jpx-widget-drag > strong { font-size: 11px; letter-spacing: .3px; }
        .jpx-widget-card .jpx-widget-drag > svg { width: 12px; height: 12px; flex: none; margin-left: auto; opacity: .65; }
        .jpx-widget-card .jpx-widget-info { padding: 6px 8px; min-height: 20px; color: inherit; white-space: pre-line; cursor: pointer; }
        .jpx-widget-card .jpx-widget-info:empty { min-height: 24px; }
        .jpx-widget-card .jpx-widget-info:hover { background: var(--jpx-widget-info-hover, rgb(255 255 255 / 35%)); }
        .jpx-widget-card .jpx-widget-info-row { display: flex; align-items: baseline; gap: 8px; padding: 1px 0; }
        .jpx-widget-card .jpx-widget-info-label { flex: none; opacity: .75; }
        .jpx-widget-card .jpx-widget-info-value { margin-left: auto; min-width: 0; text-align: right; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
        .jpx-widget-card [data-row-id=isActiveBattle] .jpx-widget-info-value {
            box-sizing: border-box; min-width: 36px; padding-left: 6px;
            border-left: 3px solid var(--jpx-state-accent); font-weight: 700;
        }
        .jpx-widget-card .jpx-widget-actions { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--jpx-theme-border, #c9b7a2); }
        #ctrl-widget .jpx-widget-action, .jpx-widget-card .jpx-widget-action {
            display: inline-flex; align-items: center; justify-content: center; gap: 4px;
            box-sizing: border-box; width: 100%; min-height: 28px; padding: 4px; margin: 0;
            border: 0; border-radius: 0; background: transparent; color: inherit; font: inherit; cursor: pointer;
        }
        .jpx-widget-card .jpx-widget-action + .jpx-widget-action { border-left: 1px solid var(--jpx-theme-border, #c9b7a2); }
        .jpx-widget-card .jpx-widget-action svg { width: 13px; height: 13px; flex: none; }
        #ctrl-widget .jpx-widget-action:is(:hover, :focus-visible, :active),
        .jpx-widget-card .jpx-widget-action:is(:hover, :focus-visible, :active) { background: #f4e5c4; }
        .jpx-widget-card :focus-visible { outline: 2px solid #9b4e03; outline-offset: -2px; }
        #ctrl-widget.is-dragging, #ctrl-widget.is-dragging .jpx-widget-drag { cursor: grabbing; user-select: none; }
        #ctrl-widget.is-dragging { box-shadow: 0 4px 12px rgb(45 32 20 / 22%); }

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
                background: #edebdf;
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

        #info-records-div { font-weight: bold; }
        #info-records-div, #time-records-div { text-align: center; white-space: pre; }

        .records-table {
            border-top: 1px solid;
            border-bottom: 1px solid;
            border-collapse: collapse;
            background-color: #fff;

            & tr:nth-child(1) > td, & tr:nth-child(2) > td { text-align: center; }
            & tr:not(:nth-child(1), :nth-child(2)) > td:nth-child(1) { text-align: left; }
            & td { min-width: 40px; padding: 2px 4px; border-left: 1px solid; border-right: 1px solid; text-align: right; }
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
        .heading { font-weight: bold; margin: 8px 0; border-bottom: 1px solid #ccc; padding-bottom: 2px; }

        .array-row:not(.array-row .array-row) { border: 1px solid #888; background: #eee; padding: 4px; margin: 4px 0; position: relative; }

        .drag-handle { cursor: grab; user-select: none; }
        .drag-handle:active { cursor: grabbing; }

        .field-picker-select { width: 200px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; }
        .field-picker-select option:checked { background-color: #e0e0e0; }

        #settings-container.jpx-settings-dialog {
            position: fixed;
            box-sizing: border-box;
            inset: 0;
            width: min(820px, calc(100vw - 48px));
            height: min(780px, calc(100dvh - 112px));
            max-width: calc(100vw - 48px);
            max-height: calc(100dvh - 112px);
            margin: auto;
            padding: 3px;
            overflow: hidden;
            border: 2px solid #5c0d11;
            background: #edebdf;
            box-shadow: 0 12px 30px rgb(0 0 0 / 28%);
            color: #5c0d11;
            font: 13px/1.45 Verdana, Arial, sans-serif;
            text-align: left;
        }
        #settings-container.jpx-settings-dialog:focus { outline: none; }

        #settings-container.jpx-settings-dialog::backdrop { background: rgb(24 18 14 / 62%); }
        #settings-container .jpx-settings-window {
            display: flex;
            container: jpx-settings / inline-size;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            min-width: 0;
            flex-direction: column;
            border: 1px solid #5c0d11;
            background: #edebdf;
            text-align: left;
        }
        /* Layout gaps own button spacing; host margins overflow full-width list rows. */
        #settings-container button { margin: 0; }
        #settings-container button:not(.settings-tab-btn) {
            min-height: 29px;
            padding: 4px 8px;
            border: 1px solid rgb(92 13 17 / 30%);
            border-radius: 2px;
            background: #edebdf;
            color: #5c0d11;
            cursor: pointer;
        }
        #settings-container button:not(.settings-tab-btn):hover { background: #fff; }
        #settings-container button:not(.settings-tab-btn):disabled { opacity: .5; cursor: not-allowed; }
        #settings-container button,
        #settings-container .jpx-rule-item > summary,
        #settings-container .heading,
        #settings-container .jpx-settings-title {
            user-select: none;
            -webkit-user-select: none;
        }
        #settings-container input,
        #settings-container textarea,
        #settings-container [contenteditable=true] {
            user-select: text;
            -webkit-user-select: text;
        }
        #settings-container .jpx-settings-titlebar {
            display: flex;
            min-height: 46px;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            border-bottom: 1px solid #5c0d11;
            background: #edebdf;
        }
        #settings-container .jpx-settings-title { font-size: 15px; font-weight: 700; }
        #settings-container .jpx-settings-titlebar button {
            width: 34px;
            height: 34px;
            padding: 0;
            border: 1px solid transparent;
            background: transparent;
            color: #5c0d11;
            font-size: 20px;
        }
        #settings-container .jpx-settings-titlebar button:hover { border-color: #5c0d11; background: var(--jpx-theme-hover, #fff9); }
        #settings-container .jpx-settings-sidebar {
            display: flex;
            flex: none;
            width: 154px;
            flex-direction: column;
            min-width: 0;
            overflow: hidden;
            border-right: 1px solid #5c0d11;
            background: #e3e0d1;
        }
        #settings-container .jpx-settings-sidebar-toggle {
            display: flex;
            width: 56px;
            min-width: 0 !important;
            min-height: 38px;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            border: 0 !important;
            border-radius: 0 !important;
            border-bottom: 1px solid rgb(92 13 17 / 20%);
            background: transparent !important;
            color: #5c0d11;
            box-shadow: none !important;
            appearance: none;
        }
        #settings-container .jpx-settings-sidebar-toggle svg,
        #settings-container .settings-tab-btn svg {
            width: 18px;
            height: 18px;
            flex: none;
        }
        #settings-container .settings-tab-header {
            display: flex;
            min-height: 0;
            flex: 1;
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
            margin: 0;
            background: #e3e0d1;
            scrollbar-width: thin;
            scrollbar-color: #5c0d11 #e3e0d1;
        }
        #settings-container .jpx-settings-workspace {
            display: flex;
            min-width: 0;
            min-height: 0;
            flex: 1;
        }
        #settings-container .jpx-settings-panels {
            display: flex;
            min-width: 0;
            min-height: 0;
            flex: 1;
            flex-direction: column;
        }
        #settings-container .settings-tab-btn {
            display: grid;
            width: 100%;
            min-height: 42px;
            flex: none;
            grid-template-columns: 56px minmax(0, 1fr);
            align-items: center;
            gap: 0;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            border-bottom: 1px solid rgb(92 13 17 / 20%) !important;
            background: transparent !important;
            color: #5c0d11 !important;
            text-align: left;
            white-space: normal;
            box-shadow: none !important;
            appearance: none;
        }
        #settings-container .settings-tab-btn > svg { justify-self: center; }
        #settings-container .settings-tab-btn[aria-selected=true] {
            background: #edebdf !important;
            box-shadow: inset -3px 0 #5c0d11;
        }
        #settings-container .settings-tab-btn:hover,
        #settings-container .jpx-settings-sidebar-toggle:hover {
            background: rgb(237 235 223 / 72%) !important;
        }
        #settings-container .jpx-tab-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        #settings-container .jpx-settings-workspace.sidebar-collapsed .jpx-settings-sidebar { width: 56px; }
        #settings-container .jpx-settings-workspace.sidebar-collapsed .settings-tab-btn[aria-selected=true] { box-shadow: inset -3px 0 #5c0d11; }
        #settings-container .jpx-settings-workspace.sidebar-collapsed .jpx-tab-label { display: none; }
        #settings-container [role=tabpanel] {
            display: flex;
            min-height: 0;
            flex: 1;
            flex-direction: column;
            overflow: auto;
            padding: 14px 18px 12px;
            scrollbar-width: thin;
            scrollbar-color: #5c0d11 #e3e0d1;
        }
        #settings-container #cfgBattle-ui,
        #settings-container #cfgStats-ui {
            display: grid;
            min-width: 0;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 18px;
            align-content: start;
        }
        #settings-container #cfgBattle-rules-ui {
            display: grid;
            min-width: 0;
            grid-template-columns: minmax(0, 1fr);
            align-content: start;
        }
        #settings-container #cfgBattle-ui > .field-block,
        #settings-container #cfgBattle-rules-ui > .field-block,
        #settings-container #cfgStats-ui > .field-block { min-width: 0; }
        #settings-container #cfgBattle-ui > .field-block[data-field-type=heading],
        #settings-container #cfgBattle-ui > .field-block[data-field-key=ctrlWidgetRows],
        #settings-container #cfgBattle-rules-ui > .field-block[data-field-type=heading],
        #settings-container #cfgBattle-rules-ui > [data-role=battleMode],
        #settings-container #cfgStats-ui > .field-block[data-field-type=heading],
        #settings-container #cfgStats-ui > .field-block[data-field-type=fieldPicker] { grid-column: 1 / -1; }
        #settings-container .jpx-battle-mode-selects {
            display: flex !important;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }
        #settings-container .jpx-battle-mode-selects > div { margin-right: 0 !important; }
        #settings-container .jpx-rule-mode-header {
            display: grid; flex: none; align-items: center;
            grid-template-columns: repeat(3, minmax(0, max-content)) minmax(0, 1fr);
            gap: 6px 12px; padding-bottom: 10px;
        }
        #settings-container .jpx-rule-mode-selection,
        #settings-container .jpx-rule-mode-header .jpx-battle-mode-selects { display: contents !important; }
        #settings-container .jpx-rule-mode-header .jpx-battle-mode-selects > div,
        #settings-container .jpx-rule-mode-header .jpx-style-override {
            display: flex !important; flex-wrap: nowrap; align-items: center; gap: 4px; min-width: 0;
        }
        #settings-container .jpx-rule-mode-header label { flex: none; white-space: nowrap; }
        #settings-container .jpx-rule-mode-header select { flex: none; min-width: 0; max-width: 100%; }
        #settings-container .jpx-rule-mode-actions { display: flex; flex-wrap: nowrap; justify-self: end; gap: 4px; }
        #settings-container .jpx-rule-mode-actions button { flex: none; min-height: 30px; padding: 3px 8px; white-space: nowrap; }
        #settings-container #panel_battleRules { overflow: hidden; container: jpx-rules / inline-size; }
        @container jpx-rules (max-width: 580px) {
            #settings-container .jpx-rule-mode-header { grid-template-columns: minmax(0, max-content) minmax(0, 1fr); }
        }
        @container jpx-rules (max-width: 330px) {
            #settings-container .jpx-rule-mode-header .jpx-battle-mode-selects > div { grid-column: 1 / -1; }
        }
        #settings-container #cfgBattle-rules-ui,
        #settings-container #cfgBattle-rules-ui > [data-role=battleMode],
        #settings-container .jpx-rule-sections,
        #settings-container .jpx-rule-section:not([hidden]) {
            display: flex; flex: 1; flex-direction: column; min-height: 0; min-width: 0;
        }
        #settings-container #cfgBattle-rules-ui > [data-role=battleMode] { margin: 0; }
        #settings-container .jpx-rule-section[hidden],
        #settings-container .jpx-rule-section > .heading[hidden] { display: none; }
        #settings-container .jpx-battle-mode-selects { flex: none; padding-bottom: 10px; }
        #settings-container .jpx-rule-navigation { display: flex; flex: none; align-items: center; gap: 4px; border-bottom: 1px solid rgb(92 13 17 / 30%); margin-bottom: 6px; }
        #settings-container .jpx-rule-section-tabs { display: flex; flex-wrap: wrap; min-width: 0; gap: 0; }
        #settings-container .jpx-rule-section-tabs > button {
            padding: 6px 8px; min-height: 32px; border: 0; border-bottom: 2px solid transparent; border-radius: 0; background: transparent; color: #71634f;
        }
        #settings-container .jpx-rule-section-tabs > button[aria-pressed=true] { border-bottom-color: #5c0d11; color: #5c0d11; }
        #settings-container .jpx-rule-section-tabs > button[data-change-state] { box-shadow: inset 0 2px var(--jpx-change-color); }
        #settings-container .jpx-rule-section-controls { flex: none; margin-left: auto; }
        #settings-container .jpx-rule-section-controls .jpx-rule-list-toggle { padding: 3px 4px; border-color: transparent; background: transparent; }
        #settings-container .jpx-rule-section { margin: 0; }
        #settings-container .jpx-rule-scroll { flex: 1; min-height: 0; min-width: 0; overflow: auto; padding-right: 4px; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #5c0d11 #e3e0d1; }
        #settings-container .jpx-rule-add-actions { display: flex; flex: none; flex-wrap: wrap; gap: 4px; padding: 8px 0 6px; border-top: 1px solid rgb(92 13 17 / 30%); background: #edebdf; }
        #settings-container .jpx-rule-add-actions button { min-height: 28px; padding: 3px 6px; }
        #settings-container .jpx-keybinding-rule-group .jpx-rule-add-actions { position: sticky; bottom: 0; z-index: 2; }
        #settings-container .jpx-style-override { display: flex; align-items: center; gap: 4px; min-width: 0; }
        #settings-container .jpx-style-override-label { flex: none; }
        #settings-container .jpx-keybindings-settings {
            display: grid;
            min-width: 0;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px 12px;
            margin-bottom: 8px;
        }
        #settings-container .jpx-keybindings-settings > div {
            display: flex;
            min-width: 0;
            align-items: center;
            flex-wrap: wrap;
            gap: 4px;
        }
        #settings-container .jpx-settings-footer {
            display: flex;
            flex-wrap: wrap;
            min-height: 48px;
            flex: none;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            margin: 0 !important;
            padding: 7px 10px;
            border-top: 1px solid #5c0d11;
            background: #e3e0d1;
        }
        #settings-container .jpx-settings-file-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; min-width: 0; }
        #settings-container .jpx-settings-footer button {
            min-height: 30px;
            padding: 4px 10px;
            border: 1px solid #5c0d11;
            background: transparent;
            color: #5c0d11;
        }
        #settings-container .jpx-settings-footer button:hover { background: #fff; }
        #settings-container .jpx-settings-footer #save-button { background: #5c0d11; color: #fff; }
        #settings-container .jpx-settings-footer #save-button:hover { background: #9b4e03; }
        #settings-container .jpx-battle-rule-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 12px;
        }
        #settings-container button,
        #settings-container input,
        #settings-container select,
        #settings-container textarea { box-sizing: border-box; font: inherit; }
        #settings-container button,
        #settings-container select,
        #settings-container input,
        #settings-container textarea { accent-color: #5c0d11; }
        #settings-container button:focus-visible,
        #settings-container input:focus-visible,
        #settings-container select:focus-visible,
        #settings-container textarea:focus-visible {
            outline: 1px solid #9b4e03;
            outline-offset: -1px;
            box-shadow: 0 0 0 2px rgb(155 78 3 / 12%);
        }
        #settings-container .settings-tab-btn:focus-visible {
            outline: none;
            box-shadow: inset 0 0 0 1px #9b4e03, inset -3px 0 #5c0d11 !important;
        }
        #settings-container select {
            width: auto;
            max-width: min(100%, 320px);
            min-height: 30px;
            padding: 4px 7px;
            border: 1px solid rgb(92 13 17 / 32%);
            border-radius: 2px;
            background-color: #fff;
            color: #5c0d11;
        }
        #settings-container select:not([multiple]) { field-sizing: content; min-width: 0; }
        #settings-container select,
        #settings-container textarea { scrollbar-width: thin; scrollbar-color: #5c0d11 #e3e0d1; }
        @supports (appearance: base-select) {
            #settings-container select:not([multiple]),
            #settings-container select:not([multiple])::picker(select) { appearance: base-select; }
            #settings-container select:not([multiple]) { gap: 8px; cursor: pointer; background: #f9f6ec; }
            #settings-container select:not([multiple])::picker-icon { color: #5c0d11; }
            #settings-container select:not([multiple])::picker(select) {
                width: max-content;
                min-width: anchor-size(width);
                max-width: min(560px, calc(100vw - 32px));
                max-height: min(280px, 50dvh);
                box-sizing: border-box;
                padding: 3px;
                overflow: auto;
                border: 1px solid #5c0d11;
                border-radius: 2px;
                background: #edebdf;
                color: #5c0d11;
                box-shadow: 0 4px 12px rgb(36 18 15 / 18%);
                scrollbar-width: thin;
                scrollbar-color: #5c0d11 #e3e0d1;
            }
            #settings-container.jpx-settings-mobile select:not([multiple])::picker(select) {
                /* The native top layer escapes dialog transforms; zoom keeps anchor collision handling. */
                zoom: var(--settings-scale);
                min-width: calc(anchor-size(width) / var(--settings-scale));
                max-width: calc(var(--settings-width) - 24px);
                max-height: min(280px, calc(var(--settings-height) * .5));
            }
            #settings-container select:not([multiple]) option {
                box-sizing: border-box;
                min-height: 30px;
                padding: 5px 8px;
                gap: 8px;
                white-space: normal;
                overflow-wrap: anywhere;
                border-radius: 0;
                border-bottom: 1px solid rgb(92 13 17 / 12%);
            }
            #settings-container select:not([multiple]) option:checked { background: #eddbb2; }
            #settings-container select:not([multiple]) option:hover,
            #settings-container select:not([multiple]) option:focus { background: #f4e5c4; outline: 1px solid #9b4e03; outline-offset: -1px; }
        }
        #settings-container input:not([type=checkbox]):not([type=radio]),
        #settings-container textarea {
            max-width: 100%;
            min-height: 30px;
            padding: 4px 7px;
            border: 1px solid rgb(92 13 17 / 28%);
            border-radius: 2px;
            background: #fff;
            color: #5c0d11;
        }
        #settings-container textarea { width: min(100%, 780px); }
        #settings-container input[type=number] { field-sizing: content; width: 8ch; min-width: 7ch; max-width: min(18ch, 100%); }
        #settings-container input[type=text] { field-sizing: content; width: 20ch; min-width: min(16ch, 100%); max-width: min(48ch, 100%); }
        @supports (field-sizing: content) {
            #settings-container input[type=number],
            #settings-container input[type=text] { width: auto; }
        }
        #settings-container [data-field-key=ctrlWidgetStyleText] input { min-width: min(30ch, 100%); }
        #settings-container [data-field-key=controlPanel] { container-type: inline-size; }
        #settings-container .jpx-control-panel-editor { --stats-border: rgb(92 13 17 / 24%); --stats-surface: #f9f6ec; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.7fr); gap: 12px; align-items: start; }
        #settings-container .jpx-control-panel-editor > div { min-width: 0; }
        #settings-container .jpx-control-appearance-body { display: grid; grid-template-columns: minmax(0, 1fr) 214px; gap: 12px; align-items: start; }
        #settings-container .jpx-control-appearance-body > div { min-width: 0; }
        #settings-container .jpx-control-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 28px; margin-bottom: 6px; border-bottom: 1px solid rgb(92 13 17 / 24%); }
        #settings-container .jpx-control-appearance > .jpx-control-heading { flex-wrap: wrap; }
        #settings-container .jpx-control-count { font-size: 11px; color: #71634f; }
        #settings-container .jpx-control-panel-editor .jpx-control-list { max-height: none; }
        #settings-container .jpx-control-list .jpx-stats-row { min-height: 32px; }
        #settings-container .jpx-control-list .jpx-stats-select { min-height: 32px; padding-right: 94px; cursor: default; }
        #settings-container .jpx-control-panel-editor .jpx-control-list .jpx-stats-select[aria-pressed=true] { background: transparent; box-shadow: none; font-weight: normal; }
        #settings-container .jpx-control-list .jpx-stats-select:hover { background: #fff; }
        #settings-container .jpx-control-style { display: grid; gap: 6px; }
        #settings-container .jpx-control-style-row { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 6px; min-height: 28px; }
        #settings-container .jpx-control-style-row > label { flex: none; }
        #settings-container .jpx-control-style input[type=color] { width: 32px; height: 28px; min-width: 32px; padding: 1px; background: #fff; border: 1px solid rgb(92 13 17 / 24%); cursor: pointer; }
        #settings-container .jpx-control-opacity-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0 6px; margin-top: 2px; padding-top: 8px; border-top: 1px solid var(--stats-border); }
        #settings-container .jpx-control-opacity-row input { grid-column: 1 / -1; grid-row: 2; }
        #settings-container input[data-control-opacity] { flex: 1; width: 0; min-width: 44px; height: 28px; padding: 0; }
        #settings-container .jpx-control-opacity-row input[data-control-opacity] { width: 100%; min-width: 0; margin: 0; padding: 0; border: 0; background: transparent; }
        #settings-container [data-control-opacity-value] { min-width: 4ch; font-variant-numeric: tabular-nums; text-align: right; }
        #settings-container .jpx-control-preview-states { display: flex; gap: 4px; }
        #settings-container .jpx-control-preview-states button { min-height: 24px; padding: 2px 6px; margin: 0; font-size: 11px; border-color: transparent; }
        #settings-container .jpx-control-preview-states button[aria-pressed=true] { border-color: rgb(92 13 17 / 30%); background: #eddbb2; }
        #settings-container .jpx-control-preview-stage { display: flex; justify-content: center; padding: 8px; border: 1px solid rgb(92 13 17 / 18%); background: #f9f6ec; }
        #settings-container .jpx-control-preview-sample { max-width: 100%; opacity: 1; }
        #settings-container .jpx-control-preview-content { white-space: pre-line; overflow-wrap: anywhere; }
        #settings-container .jpx-control-preview-sample .jpx-widget-drag,
        #settings-container .jpx-control-preview-sample .jpx-widget-info,
        #settings-container .jpx-control-preview-sample .jpx-widget-action { cursor: default; }
        @container (max-width: 579px) {
            #settings-container .jpx-control-panel-editor { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            #settings-container .jpx-control-appearance-body { grid-template-columns: minmax(0, 1fr); }
        }
        @container (max-width: 479px) {
            #settings-container .jpx-control-panel-editor { grid-template-columns: minmax(0, 1fr); gap: 12px; }
        }
        #settings-container .jpx-settings-group { grid-column: 1 / -1; }
        #settings-container .jpx-settings-group-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 18px; }
        #settings-container .jpx-settings-group-fields > .field-block { min-width: 0; margin: 0; }
        #settings-container .jpx-settings-group-fields > [data-field-type=array],
        #settings-container .jpx-settings-group-fields > [data-field-type=fieldPicker],
        #settings-container .jpx-settings-group-fields > [data-field-key=ctrlWidgetStyleText] { grid-column: 1 / -1; }
        #settings-container .field-block[data-field-type=boolean] > label { display: inline-flex; align-items: flex-start; gap: 4px; max-width: 100%; }
        #settings-container .field-block[data-field-type=boolean] > label > input { flex: none; margin: 3px 0 0; }
        #settings-container .jpx-field-help { margin: 3px 0 0 24px; color: #79604f; font-size: 12px; line-height: 1.5; }
        #settings-container .jpx-settings-group .heading { margin-top: 12px; font-size: inherit; }
        #settings-container .jpx-settings-group:first-child .heading { margin-top: 0; }
        #settings-container button.jpx-delete-button { color: #b42328; }
        #settings-container button.jpx-delete-button:hover { color: #8f151b; background: #f7ddd6; border-color: #b42328; }
        #settings-container .jpx-delete-button svg,
        #settings-container .jpx-history-buttons svg { width: 14px; height: 14px; vertical-align: middle; flex: none; }
        #settings-container .jpx-history-buttons { display: flex; gap: 6px; margin-right: auto; }
        #settings-container .jpx-history-buttons button { display: inline-flex; gap: 5px; align-items: center; min-height: 30px; padding: 4px 8px; }
        #settings-container .jpx-history-buttons button:disabled { opacity: .45; cursor: default; }
        #settings-container .field-block { margin: 0 0 7px; }
        #settings-container .heading {
            margin: 14px 0 6px;
            padding: 5px 8px;
            border-bottom: 1px solid rgb(92 13 17 / 28%);
            background: #eddbb2;
            color: #5c0d11;
            font-weight: 700;
            text-align: left;
        }
        #settings-container .array-row:not(.array-row .array-row) {
            margin: 5px 0;
            padding: 6px 4px;
            border: 0;
            border-bottom: 1px solid rgb(92 13 17 / 18%);
            background: transparent;
        }
        #settings-container .jpx-rule-array-item {
            display: block;
            min-width: 0;
        }
        #settings-container .jpx-rule-item { min-width: 0; }
        #settings-container .jpx-rule-item > summary {
            display: grid;
            grid-template-columns: 26px 5px minmax(0, 1fr) auto;
            min-width: 0;
            min-height: 32px;
            align-items: center;
            gap: 4px 6px;
            cursor: pointer;
            list-style: none;
        }
        #settings-container .jpx-rule-item > summary::-webkit-details-marker { display: none; }
        #settings-container .jpx-rule-item > summary::before {
            grid-column: 2;
            grid-row: 1;
            width: 0;
            height: 0;
            flex: none;
            border-top: 4px solid transparent;
            border-bottom: 4px solid transparent;
            border-left: 5px solid #5c0d11;
            content: '';
        }
        #settings-container .jpx-rule-item[open] > summary::before { transform: rotate(90deg); }
        #settings-container .jpx-rule-summary-text { grid-column: 3; grid-row: 1; min-width: 0; }
        #settings-container .jpx-rule-item > summary > .drag-handle { grid-column: 1; grid-row: 1; }
        #settings-container .jpx-rule-item > summary > .jpx-array-item-actions { grid-column: 4; grid-row: 1; }
        #settings-container .jpx-rule-summary-heading { display: flex; min-width: 0; align-items: center; gap: 8px; }
        #settings-container .jpx-rule-item[open] .jpx-rule-item-meta,
        #settings-container .jpx-rule-item[open] .jpx-rule-item-preview { display: none; }
        #settings-container .jpx-rule-item-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; }
        #settings-container .jpx-rule-item-meta { margin-left: auto; color: #71634f; font-size: 11px; white-space: nowrap; }
        #settings-container .jpx-rule-item-preview { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #71634f; font-size: 11px; line-height: 18px; }
        #settings-container .jpx-keybinding-header { flex-wrap: wrap; gap: 6px; }
        #settings-container .jpx-rule-list-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 2px; padding-bottom: 2px; }
        #settings-container .jpx-rule-list-toolbar { display: flex; flex: none; align-items: center; justify-content: flex-end; margin: 0 0 0 auto; padding: 0; border: 0; }
        #settings-container .jpx-keybinding-header > .jpx-rule-list-toolbar { margin: 0 0 0 auto; padding: 0; border-bottom: 0; }
        #settings-container .jpx-rule-list-heading .jpx-rule-list-toggle { min-height: 25px; padding: 2px 6px; border-color: transparent; background: transparent; }
        #settings-container .jpx-rule-list-heading .jpx-rule-list-toggle:hover { border-color: rgb(92 13 17 / 25%); background: #f4e5c4; }
        #settings-container .jpx-rule-list-toggle { display: inline-flex; min-height: 30px; align-items: center; gap: 5px; padding: 3px 8px; font-size: 11px; }
        #settings-container .jpx-rule-list-toggle svg { width: 14px; height: 14px; }
        #settings-container .jpx-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
        #settings-container .jpx-rule-item > summary:focus-visible {
            outline: none;
            box-shadow: inset 0 0 0 1px #9b4e03;
            background: rgb(244 229 196 / 70%);
        }
        #settings-container .jpx-rule-array-item.is-disabled .jpx-rule-summary-text { opacity: .65; }
        #settings-container .jpx-rule-array-item.is-dragging { z-index: 2; opacity: .25; outline: 1px dashed #9b4e03; background: #f4e5c4; box-shadow: inset 0 0 0 1px rgb(155 78 3 / 25%); }
        #settings-container .jpx-rule-array-item.is-drop-before { box-shadow: inset 0 3px #9b4e03; background: #f4e5c4; }
        #settings-container .jpx-rule-array-item.is-drop-after { box-shadow: inset 0 -3px #9b4e03; background: #f4e5c4; }
        #settings-container .jpx-rule-drag-layer { position: fixed; z-index: 10000; overflow: hidden; pointer-events: none; }
        #settings-container .jpx-rule-drop-marker { position: absolute; z-index: 2; height: 3px; background: #9b4e03; box-shadow: 0 0 0 1px rgb(244 229 196 / 75%); pointer-events: none; }
        #settings-container .jpx-rule-drop-marker.over-preview { background: transparent; box-shadow: none; }
        #settings-container .jpx-rule-drop-marker::before, #settings-container .jpx-rule-drop-marker::after { content: ''; position: absolute; top: -3px; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
        #settings-container .jpx-rule-drop-marker::before { left: 0; border-left: 6px solid #9b4e03; }
        #settings-container .jpx-rule-drop-marker::after { right: 0; border-right: 6px solid #9b4e03; }
        #settings-container .jpx-rule-drag-image { position: absolute; top: 0; left: 0; z-index: 1; display: block; box-sizing: border-box; margin: 0; padding: 6px 10px; border: 1px solid #9b4e03; background: #f4e5c4; box-shadow: 0 4px 10px rgb(36 18 15 / 20%); opacity: 1; pointer-events: none; }
        #settings-container .jpx-rule-drag-label { display: block; width: min(calc(100% - var(--jpx-drag-label-x)), var(--jpx-drag-label-width)); margin-left: calc(var(--jpx-drag-label-x) - 11px); }
        #settings-container .jpx-rule-drag-grip { position: absolute; top: calc(var(--jpx-drag-handle-y) - 16px); left: calc(var(--jpx-drag-handle-x) - 14px); }
        #settings-container button.jpx-drag-grip,
        #settings-container .jpx-drag-grip {
            display: inline-flex; box-sizing: border-box; flex: none; align-items: center; justify-content: center;
            width: 26px; min-width: 26px; height: 30px; min-height: 30px; padding: 0;
            border: 1px solid transparent; border-radius: 2px; background: transparent; color: #8c6551;
            cursor: grab; touch-action: none; user-select: none;
        }
        #settings-container .jpx-drag-grip svg { width: 18px; height: 18px; }
        #settings-container button.jpx-drag-grip:hover,
        #settings-container .jpx-drag-grip:hover,
        #settings-container .jpx-drag-grip:focus-visible { color: #5c0d11; border-color: rgb(92 13 17 / 28%); background: #f4e5c4; }
        #settings-container .jpx-drag-grip:active { cursor: grabbing; }
        #settings-container .jpx-rule-array-item .drag-handle { cursor: grab; touch-action: none; user-select: none; }
        #settings-container .jpx-rule-array-item.is-dragging .drag-handle { cursor: grabbing; }
        #settings-container .jpx-rule-item-body { padding: 5px 0 3px 13px; border-top: 1px solid rgb(92 13 17 / 15%); }
        #settings-container .jpx-rule-item-body > .field-block:first-child[data-field-type=constant] { display: none; }
        #settings-container .jpx-array-item-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; }
        #settings-container .jpx-array-item-actions svg { width: 14px; height: 14px; vertical-align: middle; }
        #settings-container .jpx-rule-state-toggle { display: inline-flex; align-items: center; justify-content: center; }
        #settings-container .jpx-rule-state-toggle[data-enabled=false] { color: #71634f; }
        #settings-container .jpx-rule-state-toggle svg { width: 16px; height: 16px; }
        #settings-container [data-change-state] { --jpx-change-color: #975000; --jpx-change-bg: #f5ebd5; }
        #settings-container [data-change-state=added] { --jpx-change-color: #39633b; --jpx-change-bg: #e7eddf; }
        html[data-jpx-theme=dark] #settings-container [data-change-state] { --jpx-change-color: var(--jpx-theme-accent); --jpx-change-bg: var(--jpx-theme-selected); }
        html[data-jpx-theme=dark] #settings-container [data-change-state=added] { --jpx-change-color: #a4cfaa; --jpx-change-bg: #293a2d; }
        #settings-container .field-block[data-change-state],
        #settings-container .array-row[data-change-state]:not(.is-drop-before, .is-drop-after, .is-dragging),
        #settings-container .dynamic-array-row[data-change-state],
        #settings-container .jpx-keybindings-settings > [data-change-state],
        #settings-container .jpx-stats-edit-field[data-change-state] {
            background-color: var(--jpx-change-bg);
            box-shadow: inset 3px 0 var(--jpx-change-color);
        }
        #settings-container .field-block[data-change-state],
        #settings-container .jpx-keybindings-settings > [data-change-state],
        #settings-container .jpx-stats-edit-field[data-change-state] { border-radius: 2px; box-shadow: none; }
        #settings-container .field-block[data-field-type=array][data-change-state],
        #settings-container .field-block[data-field-type=conditionsArray][data-change-state],
        #settings-container .field-block[data-field-type=keyBasedObjectArray][data-change-state] { background: transparent; box-shadow: none; }
        #settings-container .jpx-stats-list .jpx-stats-row[data-change-state]:not(.is-drop-before, .is-drop-after, .is-dragging) > .jpx-stats-select { box-shadow: inset 3px 0 var(--jpx-change-color); }
        #settings-container .field-block[data-field-type=array][data-change-state] > div:first-child,
        #settings-container .field-block[data-field-type=keyBasedObjectArray][data-change-state] > div:first-child,
        #settings-container [data-change-state] > .jpx-keybinding-header {
            color: var(--jpx-change-color); border-bottom-color: var(--jpx-change-color); background-color: var(--jpx-change-bg);
        }
        #settings-container .field-block[data-field-type=conditionsArray][data-change-state] > button,
        #settings-container .jpx-stats-nav button[data-change-state] {
            color: var(--jpx-change-color); border-bottom-color: var(--jpx-change-color);
        }
        #settings-container .jpx-stats-row-label { flex: 1; }
        #settings-container .jpx-rule-array-item .jpx-array-item-actions button,
        #settings-container .jpx-stats-row .jpx-array-item-actions button {
            width: 27px;
            min-width: 27px;
            min-height: 27px;
            padding: 2px;
        }
        #settings-container .jpx-rule-sort-actions { display: inline-flex; gap: 0; margin-right: 5px; }
        #settings-container .jpx-rule-sort-actions > button { border-radius: 0; }
        #settings-container .jpx-rule-sort-actions > button + button { margin-left: -1px; }
        #settings-container .jpx-rule-sort-actions > button:first-child { border-radius: 2px 0 0 2px; }
        #settings-container .jpx-rule-sort-actions > button:last-child { border-radius: 0 2px 2px 0; }
        #settings-container .jpx-rule-sort-popover {
            position: fixed; inset: auto; box-sizing: border-box; margin: 0; padding: 10px;
            width: max-content; max-width: calc(100vw - 24px); border: 1px solid #5c0d11;
            background: #edebdf; color: #5c0d11; box-shadow: 0 4px 12px rgb(36 18 15 / 18%);
        }
        #settings-container .jpx-rule-sort-popover label { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; }
        #settings-container .jpx-rule-sort-popover input { width: 7ch; min-width: 7ch; }
        #settings-container .jpx-rule-sort-presets { display: flex; gap: 6px; margin-top: 8px; }
        #settings-container .dynamic-array-row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: start;
            gap: 6px 8px;
            margin: 8px 0 !important;
            padding: 8px;
            border: 1px solid rgb(92 13 17 / 22%);
            border-left: 2px solid #9b4e03;
            background: #f4f1e5;
        }
        #settings-container .dynamic-array-row > div { min-width: 0; max-width: 100%; margin-left: 0 !important; }
        #settings-container .dynamic-array-row > select { grid-column: 1; grid-row: 1; justify-self: start; max-width: 100%; }
        #settings-container .dynamic-array-row > button { grid-column: 2; grid-row: 1; min-width: 28px; min-height: 28px; margin: 0 !important; }
        #settings-container .dynamic-array-row > .jpx-condition-value,
        #settings-container .dynamic-array-row > .jpx-condition-extra { grid-column: 1 / -1; }
        #settings-container .jpx-condition-value { display: flex; flex-wrap: wrap; align-items: center; }
        #settings-container .jpx-condition-extra { display: flex; flex-wrap: wrap; gap: 6px 12px; padding-top: 6px; border-top: 1px solid rgb(92 13 17 / 16%); }
        #settings-container .jpx-condition-extra:empty { display: none; }
        #settings-container .jpx-range { display: inline-flex; max-width: 100%; align-items: center; flex-wrap: wrap; gap: 4px 6px; }
        #settings-container .jpx-range-inputs { display: inline-flex; align-items: center; gap: 4px; }
        #settings-container .jpx-range-inputs { min-width: 0; max-width: 100%; }
        #settings-container .jpx-range-inputs input { min-width: 7ch; max-width: min(18ch, calc((100% - 24px) / 2)); }
        #settings-container .field-picker { flex-wrap: wrap; gap: 8px; }
        #settings-container .field-picker-select {
            width: min(200px, 38vw);
            max-width: 100%;
            flex: 0 0 min(200px, 38vw);
            border-color: rgb(92 13 17 / 32%);
            border-radius: 2px;
        }
        #settings-container .multiSelect-popup { position: relative; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; width: 100%; min-width: 0; max-width: 100%; }
        #settings-container .multiSelect-summary { display: inline-flex; align-items: center; gap: 8px; width: max-content; min-width: 0; max-width: 100%; background: #f9f6ec; text-align: left; }
        #settings-container .multiSelect-value { min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
        #settings-container .multiSelect-summary::after { content: ''; flex: none; width: 5px; height: 5px; margin: -3px 2px 0; border-right: 1px solid currentColor; border-bottom: 1px solid currentColor; transform: rotate(45deg); }
        #settings-container .multiSelect-popup-panel {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 20;
            box-sizing: border-box;
            width: max-content;
            min-width: min(180px, 100%);
            max-width: 100%;
            max-height: min(280px, 50dvh);
            padding: 4px;
            overflow: auto;
            border: 1px solid #5c0d11;
            border-radius: 2px;
            background: #edebdf;
            box-shadow: 0 5px 14px rgb(36 18 15 / 18%);
            scrollbar-width: thin;
            scrollbar-color: #5c0d11 #e3e0d1;
        }
        #settings-container .multiSelect-popup-panel > span { display: flex !important; align-items: center; gap: 6px; margin: 0 !important; padding: 5px 6px; border-bottom: 1px solid rgb(92 13 17 / 12%); }
        #settings-container .multiSelect-popup-panel > span:has(input:checked) { background: #eddbb2; }
        #settings-container .multiSelect-popup-panel > span:hover { background: #f4e5c4; }
        #settings-container #cfgStats-ui {
            --stats-ink: #5c0d11;
            --stats-muted: #71634f;
            --stats-border: rgb(92 13 17 / 24%);
            --stats-surface: #f9f6ec;
            display: block;
        }
        #settings-container #cfgStats-ui [hidden] { display: none !important; }
        #settings-container .jpx-stats-nav { display: flex; flex-wrap: wrap; gap: 0; margin: 0 0 14px; border-bottom: 1px solid rgb(92 13 17 / 28%); }
        #settings-container .jpx-stats-nav button {
            min-height: 32px;
            margin: 0;
            padding: 6px 12px 7px;
            border: 0;
            border-bottom: 2px solid transparent;
            border-radius: 0;
            background: transparent;
            color: #71634f;
        }
        #settings-container .jpx-stats-nav button[aria-pressed=true] { border-bottom-color: #5c0d11; background: transparent; color: #5c0d11; }
        #settings-container .jpx-stats-help { margin: 4px 0 10px; color: #71634f; font-size: 12px; overflow-wrap: anywhere; }
        #settings-container #panel_stats { container: jpx-stats / inline-size; }
        #settings-container .jpx-stats-picker {
            display: grid;
            grid-template-columns: minmax(240px, .9fr) minmax(0, 1.1fr);
            grid-template-areas: 'selected editor';
            gap: 12px 16px;
            align-items: start;
        }
        #settings-container .jpx-stats-picker > div { min-width: 0; align-self: start; }
        #settings-container .jpx-stats-selected-pane { grid-area: selected; }
        #settings-container .jpx-stats-pane { min-width: 0; }
        #settings-container .jpx-stats-pane-heading { display: flex; min-height: 31px; align-items: center; gap: 8px; border-bottom: 1px solid rgb(92 13 17 / 24%); }
        #settings-container .jpx-stats-pane-heading > strong:first-child { color: #5c0d11; }
        #settings-container .jpx-stats-pane-count { margin-left: auto; color: #71634f; font-size: 11px; }
        #settings-container .jpx-stats-row > .jpx-array-item-actions,
        #settings-container .jpx-stats-drag-preview > .jpx-array-item-actions { position: absolute; inset: 0 4px 0 auto; flex-wrap: nowrap; pointer-events: none; }
        #settings-container .jpx-stats-row > .jpx-array-item-actions button { pointer-events: auto; }
        #settings-container .jpx-stats-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 6px 0; }
        #settings-container .jpx-stats-list { max-height: clamp(240px, calc(100dvh - 360px), 440px); overflow: auto; overscroll-behavior: contain; border: 1px solid var(--stats-border); background: var(--stats-surface); scrollbar-width: thin; scrollbar-color: #5c0d11 #e3e0d1; }
        #settings-container .jpx-stats-row { position: relative; display: flex; align-items: center; gap: 4px; min-height: 38px; border-bottom: 1px solid rgb(92 13 17 / 12%); }
        #settings-container button.jpx-stats-select { display: flex; flex: 1; min-width: 0; align-items: center; gap: 4px; align-self: stretch; padding: 3px 95px 3px 3px; border: 0; border-radius: 0; background: transparent; text-align: left; }
        #settings-container .jpx-stats-row:hover > button.jpx-stats-select { background: #fff; }
        #settings-container .jpx-stats-row > button.jpx-stats-select[aria-pressed=true] { background: #eddbb2; box-shadow: inset 3px 0 #5c0d11; }
        #settings-container .jpx-stats-row-label { min-width: 0; overflow-wrap: anywhere; }
        #settings-container .jpx-stats-row[data-enabled=false] .jpx-stats-row-label { opacity: .55; }
        #settings-container .jpx-stats-list .is-dragging { opacity: .35; cursor: grabbing; }
        #settings-container .jpx-stats-list .is-drop-before { box-shadow: inset 0 3px #9b4e03; }
        #settings-container .jpx-stats-list .is-drop-after { box-shadow: inset 0 -3px #9b4e03; }
        #settings-container .jpx-stats-drag-layer { position: fixed; z-index: 10000; overflow: hidden; pointer-events: none; }
        #settings-container .jpx-stats-drag-preview { position: absolute; box-sizing: border-box; display: flex; align-items: center; gap: 4px; background: #f4e5c4; border-bottom: 1px solid transparent; box-shadow: inset 0 0 0 1px #9b4e03, 0 3px 8px rgb(36 18 15 / 20%); }
        #settings-container .jpx-stats-drop-marker { position: absolute; z-index: 1; left: 0; right: 0; height: 3px; background: #9b4e03; }
        #settings-container .jpx-stats-drop-marker.over-preview { background: transparent; border-left: 5px solid #9b4e03; border-right: 5px solid #9b4e03; }
        #settings-container .jpx-stats-list button:focus-visible { outline: 1px solid #9b4e03; outline-offset: -1px; }
        #settings-container .jpx-stats-edit { grid-area: editor; position: sticky; top: 0; min-width: 0; padding-left: 16px; border-left: 1px solid var(--stats-border); }
        #settings-container .jpx-stats-edit-title { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; margin: 0 0 10px; padding: 5px 0 7px; border-bottom: 1px solid var(--stats-border); color: #5c0d11; overflow-wrap: anywhere; }
        #settings-container .jpx-stats-edit-title:has(.jpx-stats-name-edit) { flex-wrap: nowrap; gap: 4px; }
        #settings-container .jpx-stats-edit-title > strong { min-width: 0; }
        #settings-container .jpx-stats-edit-title input.jpx-stats-name-input { flex: 1; width: 0; min-height: 28px; }
        #settings-container button.jpx-stats-name-edit { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 20px; min-height: 22px; padding: 3px; border: 0; border-radius: 2px; background: transparent; color: var(--stats-muted); }
        #settings-container button.jpx-stats-name-edit:hover,
        #settings-container button.jpx-stats-name-edit[aria-expanded=true] { background: #e3e0d1; color: var(--stats-ink); }
        #settings-container .jpx-stats-name-edit svg { width: 12px; height: 12px; }
        #settings-container .jpx-stats-name-edit:focus-visible { outline: 2px solid var(--stats-ink); outline-offset: 2px; }
        #settings-container .jpx-stats-edit-field { display: grid; grid-template-columns: 7em minmax(0, 1fr); align-items: center; gap: 4px; margin: 0; }
        #settings-container .jpx-stats-edit input { width: 100%; field-sizing: fixed; min-width: 0; max-width: 100%; }
        #settings-container .jpx-stats-style-fields { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
        #settings-container .jpx-stats-edit-group { display: grid; min-width: 0; gap: 6px; margin: 0; padding: 0 0 12px; border: 0; border-bottom: 1px solid var(--stats-border); }
        #settings-container .jpx-stats-edit-group legend { padding: 0 0 6px; color: #71634f; font-weight: 700; }
        #settings-container .jpx-stats-edit input[data-style-field] { font: 12px/1.5 Consolas, monospace; }
        #settings-container .jpx-stats-style-control { display: flex; align-items: center; gap: 4px; min-width: 0; }
        #settings-container .jpx-stats-style-control > input[type=text] { flex: 1; width: 0; }
        #settings-container .jpx-stats-edit-field:has(.jpx-stats-palette),
        #settings-container .jpx-stats-color-heading { display: grid; grid-template-columns: 6em minmax(0, 1fr); align-items: center; gap: 4px; }
        #settings-container .jpx-stats-edit-field:has(.jpx-stats-palette) { align-items: start; }
        #settings-container .jpx-stats-edit-field:has(.jpx-stats-palette) > label { padding-top: 4px; }
        #settings-container .jpx-stats-style-control:has(.jpx-stats-palette) { display: block; }
        #settings-container .jpx-stats-palette { display: grid; grid-template-columns: 32px 32px minmax(44px, 1fr); align-items: center; gap: 8px; min-width: 0; }
        /* Keep the outer 6em label column at the same font size as the editable rows. */
        #settings-container .jpx-stats-color-heading { margin-bottom: 6px; color: var(--stats-muted); }
        #settings-container .jpx-stats-color-heading > div { display: grid; grid-template-columns: 32px 32px minmax(44px, 1fr); gap: 8px; text-align: center; font-size: 11px; }
        #settings-container .jpx-stats-color { display: flex; flex: none; cursor: pointer; }
        #settings-container .jpx-stats-color input[type=color] { width: 32px; height: 26px; min-height: 26px; padding: 1px; border: 1px solid var(--stats-border); background: #fff; cursor: pointer; }
        #settings-container .jpx-stats-color input[data-default=true] { border-style: dashed; }
        #settings-container .jpx-stats-preview { min-width: 0; }
        #settings-container .jpx-stats-preview-sample { display: block; min-width: 44px; padding: 3px 4px; box-sizing: border-box; border: 1px solid var(--stats-border); background: #edebdf; color: #5c0d11; font: 12px/18px Verdana, sans-serif; text-align: center; }
        #settings-container .jpx-stats-thresholds { margin-top: 12px; }
        #settings-container .jpx-stats-threshold-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        #settings-container .jpx-stats-threshold-heading button { min-height: 26px; padding: 2px 6px; }
        #settings-container .jpx-stats-threshold-list { display: grid; gap: 6px; max-height: 200px; overflow: auto; margin-top: 6px; }
        #settings-container .jpx-stats-threshold-row { display: grid; grid-template-columns: auto minmax(52px, 1fr) auto 32px 24px; align-items: center; gap: 6px; }
        #settings-container .jpx-stats-threshold-row > label { font-size: 12px; }
        #settings-container .jpx-stats-threshold-row input[type=color] { width: 32px; height: 28px; min-height: 28px; padding: 1px; border: 1px solid var(--stats-border); background: #fff; cursor: pointer; }
        #settings-container .jpx-stats-threshold-row button { min-height: 28px; min-width: 24px; padding: 0; border: 0; background: transparent; }
        #settings-container .jpx-stats-threshold-row:has(.jpx-stats-threshold-legacy) { grid-template-columns: minmax(0, 1fr) 24px; }
        #settings-container .jpx-stats-threshold-legacy { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 12px/1.5 Consolas, monospace; }
        #settings-container .jpx-stats-threshold-note { margin: 6px 0; font-size: 11px; color: var(--stats-muted); }
        #settings-container .jpx-stats-threshold-preview { margin-top: 8px; font-size: 12px; }
        #settings-container .jpx-stats-threshold-preview summary { cursor: pointer; color: var(--stats-muted); }
        #settings-container .jpx-stats-threshold-preview-controls { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 6px; }
        #settings-container .jpx-stats-threshold-preview input { width: 80px; }
        #settings-container .jpx-stats-threshold-match { flex-basis: 100%; font-size: 11px; color: var(--stats-muted); }
        #settings-container .jpx-stats-color input:focus-visible,
        #settings-container .jpx-stats-style-control button:focus-visible { outline: 2px solid var(--stats-ink); outline-offset: 2px; }
        #settings-container .jpx-stats-transfer, #settings-container .jpx-stats-cleanup { margin-top: 12px; padding: 12px; border: 1px solid rgb(92 13 17 / 28%); background: #f4f1e5; overflow-wrap: anywhere; }
        #settings-container .jpx-stats-transfer select { max-width: 100%; }
        @container jpx-stats (max-width: 540px) {
            #settings-container .jpx-stats-picker { grid-template-columns: minmax(0, 1fr); grid-template-areas: 'selected' 'editor'; }
            #settings-container .jpx-stats-edit { position: static; padding-left: 0; border-top: 1px solid var(--stats-border); border-left: 0; padding-top: 8px; }
            #settings-container .jpx-stats-list { max-height: 220px; }
            #settings-container .jpx-stats-style-fields { grid-template-columns: minmax(0, 1fr); }
        }
        @container jpx-stats (max-width: 360px) {
            #settings-container .jpx-stats-nav button { flex: 1 0 40%; padding: 6px 4px; }
            #settings-container .jpx-stats-style-fields { grid-template-columns: minmax(0, 1fr); }
        }
        @container jpx-settings (max-width: 600px) {
            #settings-container .jpx-rule-section-tabs > button { padding: 5px 4px; font-size: 11px; }
            #settings-container .jpx-rule-section-controls .jpx-rule-list-toggle { font-size: 10px; gap: 2px; }
            #settings-container .jpx-rule-item > summary { grid-template-columns: 26px 5px minmax(0, 1fr); }
            #settings-container .jpx-rule-item > summary > .jpx-array-item-actions { grid-column: 3; grid-row: 2; }
            #settings-container #cfgBattle-ui,
            #settings-container #cfgStats-ui { grid-template-columns: minmax(0, 1fr); }
            #settings-container #cfgBattle-rules-ui { grid-template-columns: minmax(0, 1fr); }
            #settings-container #cfgBattle-ui > .field-block,
            #settings-container #cfgBattle-rules-ui > .field-block,
            #settings-container #cfgStats-ui > .field-block { grid-column: 1; }
            #settings-container #cfgBattle-ui > [data-role=battleMode],
            #settings-container #cfgBattle-rules-ui > [data-role=battleMode],
            #settings-container #cfgBattle-ui > .field-block[data-field-key=ctrlWidgetRows],
            #settings-container #cfgStats-ui > .field-block[data-field-type=fieldPicker] { grid-column: 1; }
            #settings-container .jpx-keybindings-settings { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            #settings-container .jpx-settings-group-fields { grid-template-columns: minmax(0, 1fr); }
            #settings-container .field-picker-edit { min-width: 0 !important; max-width: 100%; }
        }
        #settings-container.jpx-settings-mobile {
            inset: var(--settings-top) auto auto var(--settings-left);
            width: var(--settings-width); height: var(--settings-height);
            max-width: none; max-height: none; margin: 0; padding: 0;
            border: 0; border-radius: 0; box-shadow: none;
            transform: scale(var(--settings-scale)); transform-origin: top left;
            font-size: 14px;
        }
        #settings-container.jpx-settings-mobile .jpx-settings-window { border: 0; }
        #settings-container.jpx-settings-mobile .jpx-settings-titlebar {
            flex: none; min-height: 44px; justify-content: flex-start; gap: 12px;
            padding: env(safe-area-inset-top, 0px) 10px 0;
        }
        #settings-container #jpx-theme-toggle { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: auto; min-width: 64px; height: 32px; margin-left: auto; margin-right: 8px; padding: 4px 8px; border: 1px solid #c8b49b; border-radius: 6px; background: #f9f6ec; font: 13px/1.4 Arial, sans-serif; }
        #settings-container #jpx-theme-toggle::before { content: ''; width: 12px; height: 12px; border: 1px solid currentColor; border-radius: 50%; background: linear-gradient(90deg, currentColor 50%, transparent 50%); }
        #settings-container.jpx-settings-mobile #jpx-theme-toggle { height: 40px; }
        html[data-jpx-theme=dark] :is(#settings-container, .jpx-records-page, .jpx-record-detail, .jpx-record-final, #jpx-mobile-entry) { color-scheme: dark; color: var(--jpx-theme-text); }
        html[data-jpx-theme=dark] #settings-container :is(input:not([type=color]):not([type=checkbox]):not([type=range]), select, textarea) { background-color: var(--jpx-theme-field); color: var(--jpx-theme-text); border-color: var(--jpx-theme-border); }
        html[data-jpx-theme=dark] #settings-container .jpx-rule-item { color: var(--jpx-theme-text); }
        html[data-jpx-theme=dark] #settings-container button.jpx-delete-button { color: #ff9295; }
        html[data-jpx-theme=dark] #settings-container button.jpx-delete-button:hover { color: #ffb4b6; background: #493034; border-color: #bb6c71; }
        html[data-jpx-theme=dark] .effect-duration > div { color: var(--jpx-theme-text); border-color: var(--jpx-theme-border); }
        html[data-jpx-theme=dark] .effect-duration > div[style*="aquamarine"] { background: #25483d !important; color: #b4efd4; }
        html[data-jpx-theme=dark] .effect-duration > div[style*="lavender"] { background: #3e3555 !important; color: #e3d4ff; }
        html[data-jpx-theme=dark] #settings-container .settings-tab-btn:hover, html[data-jpx-theme=dark] #settings-container .jpx-settings-sidebar-toggle:hover { background: var(--jpx-theme-hover) !important; }
        #settings-container #jpx-settings-menu-button { display: none; }
        #settings-container.jpx-settings-mobile #close-button { order: -1; width: auto; min-width: 64px; height: 40px; padding: 0 6px; font-size: 14px; }
        #settings-container.jpx-settings-mobile #jpx-settings-menu-button { display: inline-flex; margin-left: 0; width: 40px; height: 40px; align-items: center; justify-content: center; }
        #settings-container #jpx-settings-menu-button svg { width: 20px; height: 20px; }
        #settings-container.jpx-settings-mobile .jpx-settings-workspace { position: relative; flex-direction: column; }
        #settings-container.jpx-settings-mobile .jpx-settings-workspace .jpx-settings-sidebar {
            display: none; position: absolute; z-index: 2; inset: 6px 10px auto auto; box-sizing: border-box;
            width: max-content; max-width: calc(100% - 20px); max-height: calc(100% - 12px);
            padding: 3px; border: 1px solid #bda68e; border-radius: 3px;
            box-shadow: 0 3px 8px #0002;
        }
        #settings-container.jpx-settings-mobile.jpx-settings-navigation-open .jpx-settings-sidebar { display: flex; }
        #settings-container.jpx-settings-mobile .jpx-settings-sidebar-toggle { display: none; }
        #settings-container.jpx-settings-mobile .settings-tab-header { display: flex; flex-direction: column; overflow: auto; border: 0; }
        #settings-container.jpx-settings-mobile .settings-tab-btn {
            display: flex; width: 100%; min-width: 0; min-height: 40px;
            justify-content: flex-start; gap: 8px; padding: 6px 10px !important;
            border: 0 !important; text-align: left; font-size: 14px; line-height: 1.4;
        }
        #settings-container.jpx-settings-mobile .settings-tab-btn > svg { display: block; }
        #settings-container.jpx-settings-mobile .settings-tab-btn .jpx-tab-label { display: block; overflow: visible; }
        #settings-container.jpx-settings-mobile .settings-tab-btn[aria-selected=true] { box-shadow: inset 3px 0 #5c0d11 !important; }
        #settings-container.jpx-settings-mobile [role=tabpanel] { padding: 12px 10px; overscroll-behavior-y: contain; }
        #settings-container.jpx-settings-mobile .jpx-settings-footer {
            flex-wrap: nowrap; min-height: 0; gap: 8px;
            padding: 6px 10px max(6px, env(safe-area-inset-bottom, 0px));
        }
        #settings-container.jpx-settings-mobile .jpx-settings-file-actions { flex: 1; flex-wrap: nowrap; gap: 6px; }
        #settings-container.jpx-settings-mobile .jpx-settings-footer button { min-width: 40px; min-height: 40px; padding: 5px 6px; white-space: nowrap; }
        #settings-container.jpx-settings-mobile .jpx-settings-file-actions button { min-width: 64px; padding-inline: 4px; font-size: 12px; }
        #settings-container.jpx-settings-mobile .jpx-history-buttons { gap: 4px; }
        #settings-container.jpx-settings-mobile .jpx-history-buttons button { justify-content: center; }
        #settings-container.jpx-settings-mobile .jpx-history-label { display: none; }
        #settings-container.jpx-settings-mobile .jpx-history-buttons svg { width: 18px; height: 18px; }
        #settings-container.jpx-settings-mobile input:not([type=checkbox]):not([type=radio]),
        #settings-container.jpx-settings-mobile select,
        #settings-container.jpx-settings-mobile textarea { font-size: 16px; min-height: 36px; }
        #settings-container.jpx-settings-mobile input[type=color] { min-width: 40px; }
        #settings-container.jpx-settings-mobile .jpx-stats-palette,
        #settings-container.jpx-settings-mobile .jpx-stats-color-heading > div { grid-template-columns: 40px 40px minmax(44px, 1fr); }
        #settings-container.jpx-settings-mobile .jpx-stats-threshold-row { grid-template-columns: auto minmax(52px, 1fr) auto 40px 24px; }
        #settings-container.jpx-settings-mobile .jpx-stats-threshold-row:has(.jpx-stats-threshold-legacy) { grid-template-columns: minmax(0, 1fr) 24px; }
        ${JPX_RECORD_DETAIL_CSS}
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
let themeMode = readJpxTheme();
const themeDocuments = new Set();
const themeWindows = new WeakSet();
const cleanupKey = prefix + 'cleanupRequest';
const cleanupOwnerKey = prefix + 'cleanupOwner';
const cleanupHoldKey = prefix + 'cleanupHold';
let cleanupInProgress = false;
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
    spellMatch: /\('(?<name>[\w\s-]+)(?:\s\(x(?<stack>\d+)\))?',\s?(?<description>.*),\s?'?(?<turns>[\w\s-]+)'?\)/,
    //battleRecorder
    turnLog: /([^]+?)<tr><td class="tls">/,
    //timeRecorder
    action: />([^<>]+)<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
    action2: />([^<>]+)<\/td><\/tr><tr><td class="tlb?">[^<>]+<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
    zeroturn: /You use\s*(\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Bubble))/,
    use: /You (cast|use) ([\w\s-]+)/,
    //combatRecorder
    damage: /[^<>]+damage/g,
    damageTaken1: /(?<v>glances|hits|crits) you.*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageTaken2: /which (?<v>glances|hits|crits).*?(?<n>\d+).*?(?<t>\w+) damage/,
    spiritShield: /absorbs (\d+)/,
    damageDealt1: /(?:You|Your offhand attack|Arcane Blow) (?:(?<s>\d)x-)*(?<v>glance|hit|crit).*?(?<n>\d+).*?(?<t>\w+) damage/,
    damageDealt2: /(?:(?<s>\d)x-)*(?<v>glanced|hit|crit|eviscerated) for (?<n>\d+) (?<t>\w+) damage/,
    strike: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits.*?(\d+).*?(\w+) damage/,
    explode: /explodes for (\d+) (\w+) damage/,
    damagePlus: /for (\d+) damage/,
    damagePhysicalPlus: /(Bleeding Wound|Spreading Poison)/,
    damagePoints: /for (\d+) points of (\w+) damage/,
    debuffLog: /(?:<tr><td class="tlb?">[^<>]+(?: gains the effect | partially resists the effects of your spell\.| shrugs off the effects of your spell\.)+[^<>]*<\/td><\/tr>)+<tr><td class="tl">You cast [a-zA-Z]+\.<\/td><\/tr>/,
    debuffResist0: / gains the effect (?!Coalesced Mana)/g,
    debuffResist1: / partially resists the effects of your spell\./g,
    debuffResist3: / shrugs off the effects of your spell\./g,
    counter: />You counter/g,
    //    dealt magical
    magicalDealtMiss: / to connect\./g,
    magicalDealtEvade: / evades your spell\./g,
    magicalDealtResistPartially: / resists, and was/g,
    magicalDealtResist: / resists your spell\./g,
    //    dealt physical
    physicalDealtMiss: / its mark\./g,
    physicalDealtEvade: / dodges your attack\./g,
    physicalDealtParryPartially: / parries[^<>]+?(\d+)[^<>]+?(\w+) damage/g,
    physicalDealtParry: / parries your attack\./g,
    //    taken magical
    magicalTakenMiss: /(?:casts[^<>]+, but misses the attack\.|casts[^<>]+, missing you completely\.)/g,
    magicalTakenEvade: />You evade the attack\./g,
    magicalTakenResistPartially: / resist the attack/g,
    magicalTakenBlockPartially: /casts[^<>]+partially block (?:and|resist| )*the attack/g,
    magicalTakenBlock: /(?<!partially )block (?:and|resist| )*the attack\./g,
    //    taken physical
    physicalTakenMiss: /(?:uses[^<>]+, but misses the attack\.|(?:vigorously whiffs at a shadow|uses[^<>]+), missing you completely\.)/g,
    physicalTakenEvade: />You evade the attack from/g,
    physicalTakenParryPartially: /partially parry the attack/g,
    physicalTakenParry: /(?<!partially )parry the attack/g,
    physicalTakenBlockPartially: /(?:(?:uses[^<>]+|>)You|you) partially block (?:and|partially|parry| )*the attack/g,
    physicalTakenBlock: /(?<!partially )block (?:and|partially|parry| )*the attack/g,
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
let worldLevel = 0;
let towerFloor = 0;
let roundInfo = { current: 0, total: 0 };
let monsterData = [];
let allMonsterInfo = {};
let prevMonsterIds = '';
let monstersEffects = {};
let actionCounts = { history: [] };
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

const BATTLE_STYLES = ['OneHanded', '1H_Mage', 'TwoHanded', '2H_Mage', 'DualWielding', 'DW_Mage', 'NitenIchiryu', 'NI_Mage', 'Staff', 'Unarmed'];
const BATTLE_TYPES = ['Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'];
const BATTLE_MODES = BATTLE_STYLES.flatMap(style => ['General', ...BATTLE_TYPES].map(type => `${style}_${type}`));
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
const SPELLS_SUPPORT = ['Cure', 'Full-Cure', 'Regen', 'Haste', 'Protection', 'Absorb', 'Shadow Veil', 'Spark of Life', 'Spirit Shield', 'Heartseeker', 'Arcane Focus'];
const ITEMS = ['Mystic Gem', 'Health Gem', 'Health Draught', 'Health Potion', 'Health Elixir', 'Mana Gem', 'Mana Draught', 'Mana Potion', 'Mana Elixir',
    'Spirit Gem', 'Spirit Draught', 'Spirit Potion', 'Spirit Elixir', 'Last Elixir', 'Infusion of Flames', 'Infusion of Frost', 'Infusion of Storms', 'Infusion of Lightning',
    'Infusion of Divinity', 'Infusion of Darkness', 'Scroll of Swiftness', 'Scroll of Protection', 'Scroll of the Avatar', 'Scroll of Absorption', 'Scroll of Shadows',
    'Scroll of Life', 'Scroll of the Gods', 'Caffeinated Candy', 'Energy Drink', 'Flower Vase', 'Bubble-Gum'];
const SPELLS_DAMAGE = ['T1', 'T2', 'T3', 'Fiery Blast', 'Inferno', 'Flames of Loki', 'Freeze', 'Blizzard', 'Fimbulvetr', 'Gale', 'Downburst', 'Storms of Njord',
    'Shockblast', 'Chained Lightning', 'Wrath of Thor', 'Smite', 'Banishment', 'Paradise Lost', 'Corruption', 'Disintegrate', 'Ragnarok'];
const SPELLS_DEBUFF = ['Drain', 'Weaken', 'Imperil', 'Slow', 'Sleep', 'Confuse', 'Blind', 'Silence', 'Immobilize'];

const CTRLWIDGET_FIELDS = [
    { id: 'isActiveBattle', get: () => isActiveBattle ? t('cW.auto') : t('cW.manual') },
    { id: 'readyNext', get: () => readyNext },
    { id: 'networkDelay', get: () => (lastLogTimestamp > lastActionTimestamp ? lastLogTimestamp - lastActionTimestamp : '-') },
    { id: 'battleStyle', get: () => t(`cW.${battleStyle}`) + (/Staff|Mage/.test(battleStyle) ? ` (${t(`cW.${spellDamageBonus.maxType}`)})` : '') },
    { id: 'battleType', get: () => t(`cW.${battleType}`) + (worldLevel ? ` (WL${worldLevel})` : '') + (towerFloor ? ` (${towerFloor}F)` : '') },
    { id: 'battleMode', get: () => getBattleMode() },
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

    { id: 'parryPartially', type: 'resultPartially' },
    { id: 'resistPartially', type: 'resultPartially' },
    { id: 'blockPartially', type: 'resultPartially' },
    { id: 'resultPartiallyTotal', type: 'resultPartially', isTotal: true },
].map(f => ({ ...f, label: `cP.${f.id}` }));
const COMBAT_USE_FIELDS = [
    { id: 'action', keys: ['Attack', ...TOGGLE] },
    { id: 'item', keys: ['Mystic Gem', 'Health Gem', 'Mana Gem', 'Spirit Gem', 'Caffeinated Candy', 'Energy Drink'] },
    { id: 'skill', keys: SKILLS },
    { id: 'spellSupport', keys: SPELLS_SUPPORT },
    { id: 'spellDamage', keys: SPELLS_DAMAGE },
    { id: 'spellDebuff', keys: SPELLS_DEBUFF },
].map(f => ({ ...f, label: `cP.${f.id}`, keys: f.keys.map(key => ({ key, label: `cB.${key}`})) }));
const REVENUE_FIELDS = [
    { id: 'exp', type: 'simple' },
    { id: 'proficiency', type: 'list_paired',
        order: [
            'one-handed weapon', 'two-handed weapon', /*legacy901*/'dual wielding'/*legacy902*/, 'dual-wielding', 'staff',
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
const STATS_FILTERS = [
    { id: 'filter-aggregate', key: 'aggregate', type: 'checkbox', options: ['Aggregate by Day'] },
    { id: 'filter-world', key: 'world', type: 'checkbox', options: ['Persistent', 'Isekai'] },
    { id: 'filter-battleType', key: 'battleType', type: 'checkbox', options: ['Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'] },
    { id: 'filter-difficulties', key: 'difficulties', type: 'checkbox', options: ['20', '15', '10', '7', '4', '2', '1'] },
    { id: 'filter-result', key: 'result', type: 'checkbox', options: ['Victory', 'Defeat', 'Flee'] },
    { id: 'filter-roundTotal', key: 'roundTotal', type: 'rangeNumber', value: [0, 1000] },
    { id: 'filter-rows', key: 'rows', type: 'number', value: 50 }
].map(f => ({ ...f, label: `sP.${f.key}` }));
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
    { id: 'battleType', get: d => (d.battleType || '') + (d.worldLevel ? ` (WL${d.worldLevel})` : '') + (d.towerFloor ? ` (${d.towerFloor}F)` : ''), doI18n: true },
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

	{ id: 'eqP', equipmentQuality: 'Peerless', get: d => d.revenueRecords?.equipment?.Peerless_Avg ?? d.revenueRecords?.equipment?.Peerless?.length ?? 0 },
	{ id: 'eqL', equipmentQuality: 'Legendary', get: d => d.revenueRecords?.equipment?.Legendary_Avg ?? d.revenueRecords?.equipment?.Legendary?.length ?? 0 },
	{ id: 'eqM', equipmentQuality: 'Magnificent', get: d => d.revenueRecords?.equipment?.Magnificent_Avg ?? d.revenueRecords?.equipment?.Magnificent?.length ?? 0 },
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
	{ id: 'vase', get: d => getConsumable(d, 'Flower Vase') },
	{ id: 'gum', get: d => getConsumable(d, 'Bubble-Gum') },

    { id: 'caff', get: d => -d.combatRecords?.use?.['Caffeinated Candy'] || 0 },
    { id: 'ed', get: d => -d.combatRecords?.use?.['Energy Drink'] || 0 },
].map(f => ({ ...f, label: `sP.${f.id}` }));

// UI capability only. The original table still decides by the actual value's type.
// Consumable balances are objects and formatted duration is text in the original renderer.
const STATS_THRESHOLD_FIELDS = new Set([
    'level', 'round', 'turns', 'tps', 'finalProfit', 'credit', 'staminaCost', 'totalProfit',
    'pDGlance', 'pDHit', 'pDCrit', 'mDGlance', 'mDHit', 'mDCrit', 'mDRes', 'mDRes50',
    'mDRes75', 'mDRes90', 'mDResP', 'mDDRes0', 'mDDRes12', 'mDDRes3',
    'uCure', 'uFullCure', 'uCloakOfTheFallen', 'uImperil', 'eqP', 'eqL', 'eqM', 'cha', 'blo',
    'food', 'fig', 'arti', 'crys', 't2', 't36', 'lCharm', 'gCharm', 'caff', 'ed',
]);

const KEYBINDS = {
    openBattleRecords: { key: 'z', ctrl: false, alt: false, shift: false },
    toggleActive: { key: 'm', ctrl: false, alt: false, shift: false },
    openSettings: { key: ',', ctrl: false, alt: false, shift: false }
};
let userKeybinds = JSON.parse(localStorage.getItem(prefix + 'userKeybinds' + isekaiSuffix)) || { ...KEYBINDS };
let idCounter = 0;
const mkF = (key, type, extra = {}) => {
    const { prefix = 'cB.', label, ...otherExtra } = extra;
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
    if (useTarget) conds = conds.concat(conditionsTarget);
    if (conds.length > 0) properties.push(mkF('conditions', 'conditionsArray', { options: conds }));

    return { type: 'object', properties };
};
const conditionsGeneral = [
    mkF('world', 'array', { multiSelectOptions: ['Persistent', 'Isekai'], itemSchema: { type: 'text' } }),
    mkF('pLevel', 'rangeNumber'),
    mkF('pMaxSpellType', 'array', { multiSelectOptions: Object.keys(spellsDamageObj), popup: true, itemSchema: { type: 'text' } }),
    mkF('battleTypes', 'array', { multiSelectOptions: BATTLE_TYPES, popup: true, itemSchema: { type: 'text' } }),
    mkF('difficulty', 'array', { multiSelectOptions: Object.keys(difficultyMap), popup: true, itemSchema: { type: 'text' } }),
    mkF('roundCurrent', 'rangeNumber'),
    mkF('roundLeft', 'rangeNumber'),
    mkF('roundTotal', 'rangeNumber'),
    mkF('floor', 'rangeNumber'),
    mkF('pActionCooldown', 'array', { multiSelectOptions: [
        ...SKILLS, ...SPELLS_SUPPORT, ...ITEMS, ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.cooldownRange', popup: true, itemSchema: { type: 'text' } }),
	mkF('pActionHistory', 'array', { multiSelectOptions: [
        'Attack', ...TOGGLE, ...SKILLS, ...SPELLS_SUPPORT, ...ITEMS, ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.actionIndexRange', popup: true, itemSchema: { type: 'text' }, defaultValue: [1, 1] }),
    mkF('pActionCounts', 'array', { multiSelectOptions: [
        'Attack', ...TOGGLE, ...SKILLS, ...SPELLS_SUPPORT, ...ITEMS, ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.usesPerRoundRange', popup: true, itemSchema: { type: 'text' } }),
	mkF('pTotalActionCounts', 'array', { multiSelectOptions: [
        'Attack', ...TOGGLE, ...SKILLS, ...SPELLS_SUPPORT, ...ITEMS, ...SPELLS_DAMAGE, ...SPELLS_DEBUFF,
    ], hasRange: 'cB.usesRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('pHP', 'rangeNumber'),
    mkF('pMP', 'rangeNumber'),
    mkF('pSP', 'rangeNumber'),
    mkF('pOC', 'rangeNumber'),
    mkF('pSpiritStatus', 'boolean'),
    mkF('pEffects', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.remainingTurnsRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('pIgnoredEffects', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.remainingTurnsRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('pEffectStacks', 'array', { multiSelectOptions: PLAYER_EFFECTS, hasRange: 'cB.stacksRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('monsters', 'rangeNumber'),
    mkF('activeMonsters', 'rangeNumber'),
    mkF('defeatedMonsters', 'rangeNumber'),
    mkF('bosses', 'rangeNumber'),
    mkF('activeBosses', 'rangeNumber'),
    mkF('defeatedBosses', 'rangeNumber'),
    mkF('mLevel', 'rangeNumber'),
    mkF('mWithoutEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.monsterCountRange', popup: true, itemSchema: { type: 'text' } }),
];
const conditionsTarget = [
    mkF('tName', 'text'),
    mkF('tTypes', 'array', { multiSelectOptions: MONSTER_TYPES, popup: true, itemSchema: { type: 'text' } }),
    mkF('tClasses', 'array', { multiSelectOptions: MONSTER_CLASSES, popup: true, itemSchema: { type: 'text' } }),
    mkF('tPowerLevel', 'rangeNumber'),
    mkF('tIndex', 'rangeNumber'),
    mkF('tHP', 'rangeNumber'),
    mkF('tMP', 'rangeNumber'),
    mkF('tSP', 'rangeNumber'),
    mkF('tEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.remainingTurnsRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('tIgnoredEffects', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.remainingTurnsRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('tEffectStacks', 'array', { multiSelectOptions: Object.keys(effectSrc), hasRange: 'cB.stacksRange', popup: true, itemSchema: { type: 'text' } }),
    mkF('tDaysSinceUpdate', 'rangeNumber'),
].map(f => ({
    ...f,
    extraFields: [
        { key: 'offset', type: 'rangeNumber' },
        { key: 'matched', type: 'rangeNumber', defaultValue: [1, 1] },
    ].map(ef => ({ ...ef, label: `cB.${ef.key}` }))
}));
const cfgBattleSchema = {
    type: 'object',
    properties: [
        mkF('battleControls', 'group', { properties: [
            mkF('advanceToNextRound', 'boolean'),
            mkF('ctrlWidgetMouseEnter', 'boolean', { label: 'cB.panelMouseEnter' }),
            mkF('ajaxRound', 'boolean', { label: 'cB.ajaxRoundShort', help: 'cB.ajaxRound' }),
            mkF('dailyStaminaQuotaPlus', 'number'),
        ] }),
        mkF('battleDisplay', 'group', { properties: [
        mkF('showCooldowns', 'boolean'),
        mkF('showDurations', 'boolean'),
        mkF('showRealTimeProficiency', 'boolean'),
        mkF('showMonsterIndex', 'boolean'),
        mkF('showMonsterInfo', 'boolean'),
        mkF('showMonsterHP', 'boolean'),
        mkF('recordBattleLog', 'boolean'),
        mkF('quickbarExtend', 'array', { itemSchema: { type: 'text' } }),
        ] }),
        mkF('controlPanel', 'group', { controlPanelEditor: true, properties: [
        mkF('ctrlWidgetStyleText', 'text', { placeholder: 'opacity: 1;' }),
        mkF('ctrlWidgetRows', 'fieldPicker', { prefix: 'cW.', size: 8, allFields: CTRLWIDGET_FIELDS }),
        ] }),

        mkF('battleModeSettings', 'heading', { class: 'heading' }),
        {
            key: 'modes', type: 'dropdown', label: 'cB.modes',
            hasModeDropdown: 'battleMode',
            options: { 
                battleStyle: BATTLE_STYLES.map(key => ({ value: key, label: `cB.${key}` })),
                battleType: ['General', ...BATTLE_TYPES].map(key => ({ value: key, label: `cB.${key}` })),
            },
            flatten: '_',
            itemSchema: {
                type: 'object',
                properties: [
                    mkF('keyBindings', 'keyBasedObjectArray', {
                        class: 'heading',
                        collapsibleItems: true,
                        canDisable: true,
                        flatten: true,
                        itemSchema: {
                            type: 'object',
                            discriminator: 'type',
                            oneOf: {
                                target: mkItem('target', null, [{ key: 'priorityRule', type: 'dropdown', options: PRIORITY_RULES }], true, true),
                                spellSupport: mkItem('spellSupport', SPELLS_SUPPORT, true, true),
                                item: mkItem('item', ITEMS, true, true),
                                toggle: mkItem('toggle', TOGGLE, [{ key: 'toggled', type: 'boolean' }], true, true),
                                stop: mkItem('stop', null, [{ key: 'customMessage', type: 'text' }]),
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
								kamisamaniNattaHi: mkItem('kamisamaniNattaHi', null, [
									{ key: 'code', skipLabel: true, type: 'textarea' }
								], false, false),
                            }
                        }
                    }),
                    mkF('supports', 'array', {
                        class: 'heading',
                        collapsibleItems: true,
                        canDisable: true,
                        itemSchema: {
                            type: 'object',
                            discriminator: 'type',
                            oneOf: {
                                spellSupport: mkItem('spellSupport', SPELLS_SUPPORT, true, true),
                                item: mkItem('item', ITEMS, true, true),
                                toggle: mkItem('toggle', TOGGLE, [{ key: 'toggled', type: 'boolean' }]),
                                stop: mkItem('stop', null, [{ key: 'customMessage', type: 'text' }]),
                            }
                        }
                    }),
                    mkF('attacks', 'array', {
                        class: 'heading',
                        collapsibleItems: true,
                        canDisable: true,
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
								kamisamaniNattaHi: mkItem('kamisamaniNattaHi', null, [
									{ key: 'code', skipLabel: true, type: 'textarea' }
								], false, false),
                            }
                        }
                    })
                ]
            }
        }
    ]
};
const BATTLE_RULE_SCHEMA_KEYS = new Set(['battleModeSettings', 'modes']);
const cfgBattleSettingsSchema = {
    type: 'object',
    properties: cfgBattleSchema.properties.filter(field => !BATTLE_RULE_SCHEMA_KEYS.has(field.key))
};
const cfgBattleRulesSchema = {
    type: 'object',
    properties: cfgBattleSchema.properties.filter(field => field.key === 'modes')
};
const cfgStatsSchema = {
    type: 'object',
    properties: [
        mkF('basic', 'heading', { class: 'heading', prefix: 'cS.' }),
        mkF('combatRows', 'fieldPicker', {
            prefix: 'cS.',
            statsEditor: true,
            size: 16,
            allFields: COMBAT_FIELDS,
            editFields: [
                { key: 's_pd', group: 'outputDisplay' },
                { key: 's_md', group: 'outputDisplay' },
                { key: 's_td', group: 'outputDisplay' },
                { key: 's_pt', group: 'takenDisplay' },
                { key: 's_ps', group: 'takenDisplay' },
                { key: 's_mt', group: 'takenDisplay' },
                { key: 's_ms', group: 'takenDisplay' },
                { key: 's_tt', group: 'takenDisplay' },
            ].map(f => ({ ...f, label: `cS.${f.key}`, placeholder: 'background-color: red' })),
        }),
        mkF('revenueRows', 'fieldPicker', {
            prefix: 'cS.',
            statsEditor: true,
            size: 16,
            allFields: REVENUE_FIELDS,
            editFields: [
                { key: 'styleText', label: 'cS.styleText', placeholder: 'color: red;' },
            ],
        }),
        mkF('statsColumns', 'fieldPicker', {
            prefix: 'cS.',
            statsEditor: true,
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

let spellCooldowns;
let itemCooldowns;
let vitals;
let spiritStatus = false;
let playerEffectsObj;
let monstersObj;
let conditionsObj;

const I18N = {
    cGen: {
        settings: 'Settings', back: 'Back', save: 'Save', import: 'Import', export: 'Export', menu: 'Menu', statistics: 'Stats',
        lightTheme: 'Light', darkTheme: 'Dark', switchTheme: 'Switch light / dark theme',
        undo: 'Undo', redo: 'Redo', undoEmpty: 'Nothing to undo', redoEmpty: 'Nothing to redo',
        undoAction: 'Undo: ${label}', redoAction: 'Redo: ${label}',
        configEdit: 'Configuration', shortcutConfig: 'Shortcuts',
        importConfig: 'Import configuration', reorderRules: 'Reorder rules',
        rangeTo: 'to', rangeMin: 'Minimum', rangeMax: 'Maximum', on: 'On', off: 'Off', deleteCondition: 'Delete condition',
        collapseSidebar: 'Collapse sidebar', expandSidebar: 'Expand sidebar', settingsSections: 'Settings sections',
        expandAllRules: 'Expand all', collapseAllRules: 'Collapse all',
        dragRule: 'Drag to reorder', draggingRule: 'Dragging: ${label}', dropBefore: 'Insert before ${label}', dropAfter: 'Insert after ${label}',
        ruleMoved: 'Moved ${label} to position ${index}', dragCancelled: 'Drag canceled.', moveTop: 'Move to top', moveUp: 'Move up',
        moveToPosition: 'Move to', rulePosition: 'Position', moveApply: 'Move',
        moveDown: 'Move down', moveBottom: 'Move to bottom', duplicateRule: 'Duplicate rule',
        disableRule: 'Disable rule', enableRule: 'Enable rule', ruleDisabled: 'Disabled', ruleEnabled: 'Enabled',
        unsavedAdded: '+ New', unsavedModified: 'Edited', unsavedChange: 'Unsaved change',
        conditionCount: 'Conditions: ${count}', noConditions: 'No conditions', cancel: 'Cancel',
    },
    cW: {
        movePanel: 'Drag to move; arrow keys adjust; Home resets position',
        toggleBattle: 'Toggle automatic battle', waiting: 'Waiting',
        ctrlWidgetRows: 'Panel items', openStats: 'Stats', openSettings: 'Settings',
        isActiveBattle: 'Status', readyNext: 'Ready', networkDelay: 'Latency', battleStyle: 'Style', battleType: 'Battle', battleMode: 'Ruleset',
        OneHanded: 'One-handed', '1H_Mage': '1H Mage', TwoHanded: 'Two-handed', '2H_Mage': '2H Mage',
        DualWielding: 'Dual wield', DW_Mage: 'DW Mage', NitenIchiryu: 'Niten Ichiryu', NI_Mage: 'NI Mage',
    },
    sGen: {
        downloadBattleLog: 'Download log',
    },
    cB: {
        panelFields: 'Show in panel', panelTextColor: 'Text', panelOpacity: 'Panel opacity',
        panelPreview: 'Preview', panelMouseEnter: 'Hover panel to toggle auto battle',
        panelAppearance: 'Appearance', panelHeaderColor: 'Title bar', panelSurfaceColor: 'Background', panelBorderColor: 'Border',
        panelReorder: 'Reorder panel items',
        basicSettings: 'General', keyRules: 'Key rules', supports: 'Support', attackRules: 'Attack rules', modeTools: 'Ruleset actions',
        styleOverride: 'Override style', currentStyle: 'Detected style', applyStyle: 'Apply & reload',
        exportModeShort: 'Export', resetModeShort: 'Reset',
        battleControls: 'Battle controls', battleDisplay: 'Battle display', controlPanel: 'Control panel', ajaxRoundShort: 'Next round without reloading',
        advanceToNextRound: 'Auto next round',
        battleRecordWarning: 'Could not complete battle statistics. Keep this page open to inspect the result.',
        ajaxRound: "Enable AJAX for advancing to the next round. Disable it if other scripts don't support it.",
        showCooldowns: 'Quickbar cooldowns',
        quickbarExtend: 'Extra quickbar slots (e.g. ikey_p, Health Draught)',
        showDurations: 'Effect turns left',
        showRealTimeProficiency: 'Live proficiency gains',
        showMonsterIndex: 'Monster numbers',
        showMonsterInfo: 'Monster class, attack & power (requires Monster DB)',
        showMonsterHP: 'Monster HP (current / max)',
        recordBattleLog: 'Record full battle log',
        dailyStaminaQuotaPlus: 'Extra daily stamina',
        ctrlWidgetStyleText: 'Panel CSS',
        ctrlWidgetMouseEnter: 'Hover panel to toggle auto battle',

        battleModeSettings: 'Rulesets',
        battleRules: 'Battle rules',
        saveBattleConfig: 'Save battle settings', exportBattleConfig: 'Export battle settings', importBattleConfig: 'Import battle settings',
        openBattleRecords: 'Battle stats', openSettings: 'Settings', toggleActive: 'Toggle auto battle',

        keyBindings: 'Shortcuts', saveKeyBindings: 'Save shortcuts', duplicateKeys: 'Key already in use', addNewKeyBinding: 'Add shortcut',
        actionIndexRange: 'History position (1 = latest)', usesRange: 'Uses this battle',
        cooldownRange: 'Turns until ready', usesPerRoundRange: 'Uses this round', remainingTurnsRange: 'Turns left', stacksRange: 'Stacks', monsterCountRange: 'Monster count',

        spellSupport: 'Support spell', customMessage: 'Stop message',

        priorityRule: 'Target priority', smartDebuff: 'Smart debuff', targetCount: 'Targets', bottomUp: 'Bottom to top (J → A)',
        tailSkip: 'Trim targets (+N: skip last N; −N: keep first N)',
        maxAtFirst: 'Cast limit before 2 defeats',
        minMonstersLeft: 'Unlimited casts at ≤ N monsters left (after 2 defeats)', spellDebuff: 'Debuff spell', spellDamage: 'Damage spell', normalAttack: 'Normal attack', kamisamaniNattaHi: 'Kamisama ni Natta Hi',

        pLevel: 'Player level', pMaxSpellType: 'Strongest spell type', battleTypes: 'Battle types',
        roundCurrent: 'Current round', roundLeft: 'Rounds left', roundTotal: 'Total rounds', floor: 'Tower floor',
        pActionCooldown: 'Action cooldowns', pActionHistory: 'Recent actions', pActionCounts: 'Uses this round', pTotalActionCounts: 'Uses this battle',
        pHP: 'Player HP %', pMP: 'Player MP %', pSP: 'Player SP %', pOC: 'Player OC',
        pSpiritStatus: 'Spirit stance', pEffects: 'Player effects', pIgnoredEffects: 'Excluded player effects', pEffectStacks: 'Player effect stacks',
        monsters: 'Total monsters', activeMonsters: 'Monsters left', defeatedMonsters: 'Monsters defeated',
        bosses: 'Total bosses', activeBosses: 'Bosses left', defeatedBosses: 'Bosses defeated',
        mLevel: 'Monster level', mWithoutEffects: 'Monsters missing effects',

        offset: 'Target offset', matched: 'Matching targets',
        tName: 'Monster name', tTypes: 'Monster types', tClasses: 'Monster classes', tPowerLevel: 'Monster power level', tIndex: 'Monster position',
        tHP: 'Monster HP', tMP: 'Monster MP', tSP: 'Monster SP', tEffects: 'Monster effects', tIgnoredEffects: 'Excluded monster effects', tEffectStacks: 'Monster effect stacks', tDaysSinceUpdate: 'Days since monster update',

        OneHanded: 'One-handed', '1H_Mage': '1H Mage', TwoHanded: 'Two-handed', '2H_Mage': '2H Mage',
        DualWielding: 'Dual wield', DW_Mage: 'DW Mage', NitenIchiryu: 'Niten Ichiryu', NI_Mage: 'NI Mage',

		reloadWarning: 'Reload this page? Save your changes first.',
		importCustomCodeWarning: 'This configuration contains custom JavaScript code that will be executed as part of the battle automation.\n\nOnly import configurations from trusted sources. Malicious code may access or modify data available to this page or perform actions on your behalf.\n\nDo you want to continue?',
    },
    cS: {
        s_pd: 'Physical', s_md: 'Magical', s_td: 'Total', s_pt: 'Physical',
        s_ps: 'Physical (spirit)', s_mt: 'Magical', s_ms: 'Magical (spirit)', s_tt: 'Total',
        styleText: 'CSS style', displaySettings: 'Display settings', outputDisplay: 'Damage dealt', takenDisplay: 'Damage taken',

        exportDB: 'Export records', importDB: 'Import records',
        statsSettings: 'Stats', saveStatsConfig: 'Save stats settings', exportStatsConfig: 'Export stats settings', importStatsConfig: 'Import stats settings',
        cleanup: 'Clear all JPX-PLUS data',
        cleanupScope: 'Deletes settings, shortcuts, temporary data and all battle records for both worlds on this site. Export anything you need first. This cannot be undone.',
        cleanupConfirm: 'Permanently clear all JPX-PLUS data? Close other game tabs first. This page will reload to perform cleanup. This cannot be undone.',
        cleanupBattle: 'Leave the battle or puzzle page before clearing data.',
        cleanupRun: 'Clear permanently', cleanupRunning: 'Clearing local data…',
        cleanupBlocked: 'The database is still in use. Close other game and statistics tabs; cleanup will continue automatically.',
        cleanupFailed: 'Cleanup did not finish. Reload this page to retry.',
        cleanupDone: 'JPX-PLUS local data cleared. Reload to start with default settings.',
        cleanupOther: 'Cleanup started in another tab. Close this tab, or reload after cleanup finishes.',
        cleanupReload: 'Reload page',
        importConfirm: 'Do you want to merge the imported data?\nPress OK to only add new records (Merge), or Cancel to overwrite existing data (Overwrite).',
        section_combatRows: 'Combat', section_revenueRows: 'Loot & earnings', section_statsColumns: 'Columns', section_data: 'Data',
        help_combatRows: 'Choose combat stats to show. Select one to change its colors.',
        help_revenueRows: 'Choose loot and earnings to show. Select one to change its colors.',
        help_statsColumns: 'Choose columns for the stats table.',
        help_data: 'Import or export battle records, or clear all JPX-PLUS local data.',
        allFields: 'Items', enabledCount: '${count} / ${total} enabled', reorderFields: 'Reorder stats',
        enableField: 'Enable item', disableField: 'Disable item',
        reorderHint: 'Drag to reorder · Alt + ↑ / ↓ also works',
        styleHelp: 'Leave blank for defaults. Save to apply.',
        textColor: 'Text', backgroundColor: 'Fill', defaultColor: 'Default',
        livePreview: 'Preview',
        appearance: 'Colors',
        renameColumn: 'Rename column', confirmName: 'Confirm name',
        renameHelp: 'Enter to confirm, Esc to cancel. Clear to use the original name.',
        previewValue: 'Sample value', thresholdTitle: 'Color by value', thresholdAdd: 'Add rule',
        thresholdAtLeast: 'At least', thresholdDelete: 'Delete color rule',
        thresholdEmpty: 'No rules. Uses the color above.', thresholdOrder: 'The highest matching threshold wins.',
        thresholdTry: 'Try a value', thresholdMatched: 'Uses ≥ ${value}', thresholdBase: 'Uses the color above',
        thresholdLegacy: 'Saved rule', thresholdLegacyHelp: 'This rule is kept as saved and cannot be edited here.',
        thresholdHelp: 'Threshold format: 500:#c31dcf, 1000:red',
        invalidConfig: 'Invalid statistics configuration.', invalidBackup: 'Invalid statistics database backup.',
        importPreview: 'Import preview', importSummary: '${count} battle records', importMode: 'Import mode',
        importMerge: 'Add new records only', importReplace: 'Replace all records', importConfirmAction: 'Import',
    },
    tP: {
        't/s': 't/s',
    },
    cP: {
        damageDealt: 'Damage dealt', damageTaken: 'Damage taken',
        damagePlus: 'Bonus damage', damageTotal: 'Total damage',
        resultTotal: 'Total',
        resist50: 'Resist 50', resist75: 'Resist 75', resist90: 'Resist 90',
        parryPartially: 'Partial Parry', resistPartially: 'Partial Resist', blockPartially: 'Partial Block', resultPartiallyTotal: 'Partial Total',
        critStack: 'Crit Stacks', debuffResist: 'Debuff Resists', debuffResist0: 'Resist 0', 'debuffResist1-2': 'Resist 1-2', debuffResist3: 'Resist 3',
        spellSupport: 'Supportive', spellDamage: 'Offensive', spellDebuff: 'Deprecating',
    },
    rP: {
        unitPrice: 'Unit price', drop: 'Drops', use: 'Used', balance: 'Net', finalProfit: 'Net profit',
        'dual-wielding': 'dual-wielding',
        'staff': 'staff',
    },
    sP: {
        image: 'Image', downloadImage: 'Download image', copyImage: 'Copy image',
        imageWorking: 'Creating image…', imageCopied: 'Image copied', imageDownloaded: 'Image downloaded',
        imageUnavailable: 'Records are still loading.',
        imageCopyUnavailable: 'Copy unavailable. Download instead.',
        imageCopyFailed: 'Copy failed. Allow clipboard access or download instead.',
        imageFailed: 'Image failed. Try fewer rows or columns.',
        imageTooLarge: 'Image too large. Use fewer rows or columns.',
        'jpxStats': 'Battle stats',
        'battleDetails': 'Battle details',
        filters: 'Filters', difficulties: 'Difficulty', result: 'Result', rows: 'Rows',
        refreshRecords: 'Refresh', recordCount: '${count} records', dayCount: '${count} days',
        noRecords: 'No matching records', noColumns: 'Choose columns in Stats settings.',
        loadingRecords: 'Loading records…', recordsError: 'Could not load records',
        openRecord: 'View details', rangeMin: 'Minimum rounds', rangeMax: 'Maximum rounds',

        roundTotal: 'Total rounds', deltaTime: 'Duration', tps: 'Turns/s', finalProfit: 'Net profit', 'Aggregate by Day': 'Group by day',

        pDGlance: 'PDGlance', pDHit: 'PDHit', pDCrit: 'PDCrit', mDGlance: 'MDGlance', mDHit: 'MDHit', mDCrit: 'MDCrit',
        mDRes: 'MDRes', mDRes50: 'MDRes50', mDRes75: 'MDRes75', mDRes90: 'MDRes90', mDResP: 'MDResP', mDDRes0: 'MDDRes0', mDDRes12: 'MDDRes12', mDDRes3: 'MDDRes3',

        uCure: 'Cure', uFullCure: 'FCure', uCloakOfTheFallen: 'Spark', uImperil: 'Imp',
        eqP: 'EqP', eqL: 'EqL', eqM: 'EqM',
        lCharm: 'LCh', gCharm: 'GCh',
        hd: 'HD', md: 'MD', sd: 'SD', hp: 'HP', mp: 'MP', sp: 'SP', he: 'HE', me: 'ME', se: 'SE', le: 'LE', ed: 'ED',
    }
};
const mergedI18N = {};

function initHvutEntry() {
    if (window.top !== window.self || initHvutEntry.refresh) return;
    let active;
    const setOpen = (host, open) => {
        host.dataset.jpxOpen = String(open);
        host.querySelector('#hvut-top-config-icon')?.setAttribute('aria-expanded', String(open));
        active = open ? host : active === host ? null : active;
    };
    const attach = top => {
        const gear = top?.querySelector('#hvut-top-config-icon'), host = gear?.parentElement;
        if (!host) return;
        if (!host.classList.contains('jpx-hvut-config')) {
            host.classList.add('jpx-hvut-config');
            gear.tabIndex = 0;
            gear.setAttribute('role', 'button');
            gear.setAttribute('aria-label', t('cGen.menu'));
            setOpen(host, false);
            host.addEventListener('pointerenter', event => {
                if (event.pointerType === 'mouse' && prepare(top)) setOpen(host, true);
            });
            host.addEventListener('pointerleave', event => {
                if (event.pointerType === 'mouse') setOpen(host, false);
            });
        }
        const menu = host.querySelector('.hvut-top-config');
        if (!menu) return;
        for (const [key, action] of [['settings', renderSettings], ['statistics', openBattleRecords]]) {
            if (menu.querySelector(`[data-jpx-hvut-action="${key}"]`)) continue;
            // HVUT styles its menu's direct div children; reuse them without a second theme.
            const item = document.createElement('div');
            item.id = `jpx-hvut-${key}`;
            item.dataset.jpxHvutAction = key;
            item.setAttribute('role', 'button');
            item.tabIndex = 0;
            item.textContent = `JPX-PLUS ${t('cGen.' + key)}`;
            item.addEventListener('click', () => { setOpen(host, false); action(); });
            item.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); item.click(); }
            });
            menu.append(item);
        }
        return menu;
    };
    const prepare = top => {
        // HVUT creates this submenu on the first mouseenter, including on touch devices.
        if (top && !top.querySelector('.hvut-top-config')) top.dispatchEvent(new MouseEvent('mouseenter'));
        return attach(top);
    };
    const discover = event => attach(event.target.closest?.('#hvut-top'));
    document.addEventListener('pointerover', discover, { passive: true });
    document.addEventListener('focusin', discover);
    document.addEventListener('click', event => {
        const gear = event.target.closest?.('#hvut-top-config-icon');
        if (gear && prepare(gear.closest('#hvut-top'))) {
            event.preventDefault(); event.stopImmediatePropagation();
            setOpen(gear.parentElement, gear.parentElement.dataset.jpxOpen !== 'true');
        } else if (active) setOpen(active, false);
    }, true);
    document.addEventListener('pointerdown', event => { if (active && !active.contains(event.target)) setOpen(active, false); }, { passive: true });
    document.addEventListener('keydown', event => {
        const gear = event.target.closest?.('#hvut-top-config-icon');
        if (gear && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); gear.click(); }
        if (event.key === 'Escape' && active) {
            const trigger = active.querySelector('#hvut-top-config-icon');
            setOpen(active, false); trigger?.focus(); event.stopPropagation();
        }
    });
    initHvutEntry.refresh = () => {
        document.querySelectorAll('[data-jpx-hvut-action]').forEach(item => {
            item.textContent = `JPX-PLUS ${t('cGen.' + item.dataset.jpxHvutAction)}`;
        });
        document.querySelector('.jpx-hvut-config #hvut-top-config-icon')?.setAttribute('aria-label', t('cGen.menu'));
    };
    attach(document.getElementById('hvut-top'));
}

function initMobileEntry() {
    if (window.top !== window.self || location.hash === '#jpx-records') return;
    if (document.getElementById('jpx-mobile-entry')) { initMobileEntry.refresh?.(); return; }
    const entry = document.createElement('details');
    entry.id = 'jpx-mobile-entry';
    const summary = document.createElement('summary');
    summary.textContent = 'JPX-PLUS';
    const menu = document.createElement('nav');
    const labels = [];
    for (const [key, icon, action] of [['settings', 'battle', renderSettings], ['statistics', 'stats', openBattleRecords]]) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.mobileAction = key;
        const label = document.createElement('span');
        labels.push([label, key]);
        button.append(createSettingsIcon(icon), label);
        button.addEventListener('click', event => {
            event.stopPropagation();
            entry.open = false;
            summary.focus({ preventScroll: true });
            action();
        });
        menu.append(button);
    }
    entry.append(summary, menu);
    document.body.append(entry);
    const coarse = window.matchMedia('(pointer: coarse)');
    const place = () => {
        if (!coarse.matches) { entry.open = false; return; }
        const view = window.visualViewport, scale = 1 / (view?.scale || 1);
        entry.style.transform = `scale(${scale})`;
        entry.style.left = `${(view?.offsetLeft || 0) + 8 * scale}px`;
        entry.style.top = `${(view?.offsetTop || 0) + (view?.height || innerHeight) - 52 * scale}px`;
    };
    initMobileEntry.refresh = () => {
        labels.forEach(([element, key]) => { element.textContent = t('cGen.' + key); });
        menu.setAttribute('aria-label', t('cGen.menu'));
        place();
    };
    document.addEventListener('pointerdown', event => { if (entry.open && !entry.contains(event.target)) entry.open = false; });
    entry.addEventListener('keydown', event => {
        if (event.key === 'Escape') { entry.open = false; summary.focus(); event.stopPropagation(); }
    });
    window.addEventListener('resize', place);
    window.visualViewport?.addEventListener('resize', place);
    window.visualViewport?.addEventListener('scroll', place);
    coarse.addEventListener('change', place);
    initMobileEntry.refresh();
}

function readJpxTheme() {
    try { return localStorage.getItem('jpx_theme') === 'dark' ? 'dark' : 'light'; }
    catch { return 'light'; }
}

function applyJpxTheme(doc = document) {
    const root = doc.documentElement;
    root.dataset.jpxTheme = themeMode;
    for (const [key, color] of Object.entries(JPX_DARK_COLORS)) {
        if (themeMode === 'dark') root.style.setProperty('--jpx-theme-' + key, color);
        else root.style.removeProperty('--jpx-theme-' + key);
    }
    doc.querySelectorAll('.jpx-control-appearance, .jpx-stats-palette').forEach(panel => panel._jpxRefreshTheme?.());
    const toggle = doc.getElementById('jpx-theme-toggle');
    if (toggle) {
        toggle.textContent = t(themeMode === 'dark' ? 'cGen.darkTheme' : 'cGen.lightTheme');
        toggle.setAttribute('aria-checked', String(themeMode === 'dark'));
        toggle.setAttribute('aria-label', t('cGen.darkTheme'));
        toggle.title = t('cGen.switchTheme');
    }
    themeDocuments.add(doc);
    const win = doc.defaultView;
    if (win && !themeWindows.has(win)) {
        themeWindows.add(win);
        win.addEventListener('storage', event => {
            if (event.storageArea !== win.localStorage || (event.key !== 'jpx_theme' && event.key !== null)) return;
            themeMode = readJpxTheme(); refreshJpxTheme();
        });
        win.addEventListener('pagehide', () => themeDocuments.delete(doc));
    }
}

function refreshJpxTheme() {
    for (const doc of themeDocuments) {
        try {
            if (doc.defaultView?.closed) themeDocuments.delete(doc);
            else applyJpxTheme(doc);
        } catch { themeDocuments.delete(doc); }
    }
}

function toggleJpxTheme() {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('jpx_theme', next); }
    catch { return t('cGen.error!'); }
    themeMode = next; refreshJpxTheme();
}

function requestJpxCleanup() {
    if (document.querySelector('#textlog, #riddlemaster')) { window.alert(t('cS.cleanupBattle')); return; }
    if (!window.confirm(t('cS.cleanupScope') + '\n\n' + t('cS.cleanupConfirm'))) return;
    const token = crypto.randomUUID();
    sessionStorage.setItem(cleanupOwnerKey, token);
    localStorage.setItem(cleanupKey, token);
    cleanupInProgress = true;
    isActiveBattle = false;
    window.removeEventListener('beforeunload', storeTmp);
    window.location.reload();
}

// Reload before deleting so old timers, drafts and unload saves cannot restore data.
function renderJpxCleanup(owner) {
    cleanupInProgress = true;
    const panel = document.createElement('main'), title = document.createElement('h2');
    const status = document.createElement('p'), actions = document.createElement('div');
    panel.id = 'jpx-cleanup-page';
    panel.style.cssText = jpxThemeCSS('box-sizing:border-box;max-width:520px;margin:24px auto;padding:16px;border:1px solid #c8b49b;background:#f9f6ec;color:#5c0d11;font:14px/1.6 Arial,sans-serif;');
    document.body.style.cssText = jpxThemeCSS('margin:12px;background:#edebdf;');
    actions.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;';
    status.setAttribute('role', 'status');
    let message = owner ? 'cleanupRunning' : 'cleanupOther';
    let finished = false;
    const reload = jpxUtils.createButton(actions, { history: false, onClick: () => {
        sessionStorage.removeItem(cleanupHoldKey);
        if (!localStorage.getItem(cleanupKey)) {
            Object.keys(sessionStorage).filter(key => key.startsWith(prefix)).forEach(key => sessionStorage.removeItem(key));
        }
        window.location.reload();
    } });
    const retry = jpxUtils.createButton(actions, { history: false, onClick: requestJpxCleanup });
    for (const button of [reload, retry]) button.style.cssText = jpxThemeCSS('min-height:40px;padding:6px 12px;border:1px solid #c8b49b;border-radius:4px;background:#fffdf7;color:inherit;font:inherit;cursor:pointer;');
    const update = () => {
        title.textContent = t('cS.cleanup'); status.textContent = t('cS.' + message);
        reload.textContent = t('cS.cleanupReload'); retry.textContent = t('cS.cleanupRun');
        reload.hidden = owner && !finished && message !== 'cleanupFailed';
        retry.hidden = owner;
    };
    initDoI18n(update); update();
    if (!document.querySelector('meta[name=viewport]')) {
        const viewport = document.createElement('meta'); viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1'; document.head.append(viewport);
    }
    panel.append(title, status, actions); document.body.replaceChildren(panel);
    if (!owner) return;
    const fail = error => { console.error('JPX cleanup failed:', error); message = 'cleanupFailed'; update(); };
    try {
        const request = indexedDB.deleteDatabase('jpx');
        request.onblocked = () => { message = 'cleanupBlocked'; update(); };
        request.onerror = () => fail(request.error);
        request.onsuccess = () => {
            try {
                for (const storage of [localStorage, sessionStorage]) {
                    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
                    keys.filter(key => key?.startsWith(prefix) && key !== cleanupKey && key !== cleanupOwnerKey)
                        .forEach(key => storage.removeItem(key));
                }
                localStorage.removeItem(cleanupKey); sessionStorage.removeItem(cleanupOwnerKey);
                finished = true; message = 'cleanupDone'; update();
            } catch (error) { fail(error); }
        };
    } catch (error) { fail(error); }
}

function initDo() {
    applyJpxTheme();
    const cleanupRequest = localStorage.getItem(cleanupKey);
    if (cleanupRequest || sessionStorage.getItem(cleanupHoldKey) || sessionStorage.getItem(cleanupOwnerKey)) {
        renderJpxCleanup(!!cleanupRequest && sessionStorage.getItem(cleanupOwnerKey) === cleanupRequest);
        return;
    }
    if (location.hash === '#jpx-records') {
        initDoI18n(() => renderBattleRecordsPage(window));
        renderBattleRecordsPage(window);
        return;
    }
    ensureJpxStyle();

    window.addEventListener('beforeunload', storeTmp);
    document.addEventListener('pointerdown', (e) => {
        if (!e.target.closest('.multiSelect-popup-panel, .multiSelect-summary')) {
            document.querySelectorAll('.multiSelect-popup-panel').forEach(p => p.style.display = 'none');
            document.querySelectorAll('.multiSelect-summary').forEach(summary => summary.setAttribute('aria-expanded', 'false'));
        }
    });
    const throttledActionManager = jpxUtils.throttle(actionManager, 75);
    document.addEventListener('keydown', (e) => onKeyDown(e, throttledActionManager), true);

    initDoI18n();
    initHvutEntry();
    initMobileEntry();

    let queries = location.search.match(regExp.locationQueries) || [];
    let queriesObj = Object.fromEntries(queries.map(
        (query) => {
            return query.split('=', 2);
        }
    ));
    log = document.querySelector('#textlog');
    loadBattleConfig();

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
        if (
            (queriesObj.s === 'Bazaar' && queriesObj.ss === 'am' && queriesObj.screen === 'modify') ||
            (queriesObj.s === 'Battle' && queriesObj.ss === 'iw')
        ) {
            let equipForm = document.querySelector('#equipform');
            if (!equipForm) return;

            let observer = new MutationObserver(() => {
                let iwinfo = document.getElementById('iwinfo');
                if (!iwinfo) return;

                let info = {};
                iwinfo.querySelectorAll('tr').forEach(tr => {
                    let [keyTd, valueTd] = tr.querySelectorAll('td');
                    info[keyTd.textContent.slice(0, -1)] = valueTd.textContent;
                });
                localStorage.setItem(prefix + 'worldLevel' + isekaiSuffix, info['World Level']);
                localStorage.setItem(prefix + 'difficulty' + isekaiSuffix, info['Difficulty'].split(' ')[0]);
            });

            observer.observe(equipForm, { childList: true, subtree: true });
        }

        if (queriesObj.s === 'Battle') {
            let levelReadout = document.querySelector('#level_readout > div > div')?.innerText;
            let playerInfo = levelReadout?.match(regExp.playerInfo);
            if (playerInfo) {
                let difficulty = localStorage.getItem(prefix + 'difficulty' + isekaiSuffix) || 'undefined';
                let playerLevel = parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix)) || 0;
                if (difficulty != playerInfo[1]) localStorage.setItem(prefix + 'difficulty' + isekaiSuffix, playerInfo[1]);
                if (playerLevel != playerInfo[1]) localStorage.setItem(prefix + 'playerLevel' + isekaiSuffix, playerInfo[2]);
            }
            let staminaReadout = document.querySelector('#stamina_readout > div > div')?.innerText;
            let staminaInfo = staminaReadout?.match(regExp.staminaInfo)?.[1];
            if (staminaInfo) {
                let stamina = parseFloat(localStorage.getItem(prefix + 'stamina' + isekaiSuffix)) || 80;
                if (stamina != staminaInfo) localStorage.setItem(prefix + 'stamina' + isekaiSuffix, staminaInfo);
            }
        }

        let persona = localStorage.getItem(prefix + 'persona' + isekaiSuffix) || 'undefined';
        let personaSelected = document.querySelector('#persona_form > select > option[selected]')?.innerText;
        if (personaSelected && persona != personaSelected) {
            localStorage.setItem(prefix + 'persona' + isekaiSuffix, personaSelected);
        }

        let spcArray = Array.from(document.querySelectorAll('.spc'));
        let spellDamageBonus = spcArray.find(spc =>
            spc.innerText.includes('Spell Damage Bonus') || jpxUtils.parseHVClasses(spc.querySelector('div')).includes('Spell Damage Bonus')
        );
        if (spellDamageBonus) {
            let rows = spellDamageBonus.nextElementSibling.querySelectorAll('tr');
            let maxValue = -Infinity;
            let maxType = "";

            rows.forEach((tr) => {
                let tds = tr.querySelectorAll('td');
                if (tds.length < 2) return;

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

        return;
    }
}

function loadBattleConfig() {
    let storedCfgBattle = {};
    try {
        storedCfgBattle = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) || '{}');
    } catch (err) {
        console.error('Failed to load cfgBattle. Using default cfgBattle.');
        console.error(err);
        storedCfgBattle = {};
    }
    mergeCfg(storedCfgBattle, defaultCfgBattle, cfgBattle, 'battle');
}

// The translator keeps English in light DOM and renders Chinese in closed shadow roots.
// Remove only its transparent wrappers from a read-only snapshot: jpx's log patterns
// depend on native td/strong boundaries. Leave both the live DOM and game markup intact.
function getBattleLogHTML(element = log) {
    return (element?.innerHTML || '').replace(/<\/?hv-battle-text\b[^>]*>/gi, '');
}

function initDoBattle() {
    doInitDoBattle = true;
    window.addEventListener('mousemove', () => {
        if (!jpxPanelManager.ready) jpxPanelManager.ready = true;
    });
    document.addEventListener('DOMContentLoaded', reDoBattle);

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
        battleStyle = spellDamageBonus.maxValue <= 70 ? 'OneHanded' : '1H_Mage';
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
    let battleTypeLog = getBattleLogHTML().match(regExp.battleTypeLog);
    if (battleTypeLog) {
        if (battleTypeLog[1].includes('arena challenge') && !battleTypeLog[1].includes('Round 1 / 1)')) {
            battleType = 'Arena';
        } else if (battleTypeLog[1].includes('random encounter')) {
            battleType = 'Encounter';
        } else if (battleTypeLog[1].includes('arena challenge') && battleTypeLog[1].includes('Round 1 / 1)')) {
            battleType = 'Colosseum';
        } else if (battleTypeLog[1].includes('Grindfest')) {
            battleType = 'Battle1000';
        } else if (battleTypeLog[1].includes('Item World')) {
            battleType = 'Item';
        } else if (battleTypeLog[1].includes('The Tower')) {
            battleType = 'Tower';
            let floor = battleTypeLog[1].match(regExp.floor);
            if (floor) towerFloor = floor[1];
        }
    }
    if (battleType)localStorage.setItem(prefix + 'battleType' + isekaiSuffix, battleType);
    else battleType = localStorage.getItem(prefix + 'battleType' + isekaiSuffix) || '';

    //World Level
    if (battleType === 'Item') {
        worldLevel = parseInt(localStorage.getItem(prefix + 'worldLevel' + isekaiSuffix)) || 0;
    //Tower Floor
    } else if (battleType === 'Tower') {
        if (towerFloor) localStorage.setItem(prefix + 'towerFloor' + isekaiSuffix, towerFloor);
        else towerFloor = parseInt(localStorage.getItem(prefix + 'towerFloor' + isekaiSuffix)) || 0;

        let difficulty = 'PFUDOR';;
        if (jpxUtils.inRange(towerFloor, [1, 6])) difficulty = 'Normal';
        else if (jpxUtils.inRange(towerFloor, [7, 13])) difficulty = 'Hard';
        else if (jpxUtils.inRange(towerFloor, [14, 19])) difficulty = 'Nightmare';
        else if (jpxUtils.inRange(towerFloor, [20, 26])) difficulty = 'Hell';
        else if (jpxUtils.inRange(towerFloor, [27, 33])) difficulty = 'Nintendo';
        else if (jpxUtils.inRange(towerFloor, [34, 39])) difficulty = 'IWBTH';
        localStorage.setItem(prefix + 'difficulty' + isekaiSuffix, difficulty);
    }

    preDoBattle();

    if (battleType === 'Arena' && roundInfo.total >= 90) {
        localStorage.setItem(prefix + 'difficulty' + isekaiSuffix, 'PFUDOR');
    }
}

function reDoBattle(e) {
    if (e?.isTrusted) return;
    if (document.querySelector('#riddlemaster')) {
        riddleRecorder();
        return;
    }

    isActiveBattle = false;
    if (cfgBattle.ctrlWidgetMouseEnter) jpxPanelManager.ready = false;
    monsterData = [];
    localStorage.removeItem(prefix + 'monsterData' + isekaiSuffix);
    allMonsterInfo = {};
    actionCounts = { history: [] };
    monstersEffects = {};
    log = document.querySelector('#textlog');
    log && preDoBattle();
    jpxPanelManager.setBackground('#fef');
    jpxPanelManager.dispatchState();
}

function preDoBattle() {
    //Round
    let round = getBattleLogHTML().match(regExp.round);
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
    const monsterLogHTML = getBattleLogHTML();
    while ((matches = regExp.monster.exec(monsterLogHTML)) !== null) {
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
    } else if (storedMonsterData.length) {
        monsterData = storedMonsterData;
    } else {
        [...document.getElementsByClassName('btm1')].forEach((monster_btm1, index) => {
            let levelContainer = monster_btm1.querySelector('.btm2 div:last-child');
            monsterData.push({
                id: 0,
                name: monster_btm1.id,
                level: parseInt(levelContainer.textContent.trim() || jpxUtils.parseHVClasses(levelContainer)),
                maxHP: 100,
            });
        });
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
	obs.observe(log.firstElementChild || (log.prepend(document.createElement('tbody')), log.firstElementChild), { childList: true });

    preRender();
}

// A final log may be observed more than once; share the same recording operation.
function recordFinalBattle() {
    if (!recordFinalBattle.pending) {
        recordFinalBattle.pending = Promise.resolve().then(() => battleRecordPlayer()).catch(error => {
            console.error('Battle statistics could not finish:', error);
            jpxUtils.createToast(t('cB.battleRecordWarning'), 10000);
        });
    }
    return recordFinalBattle.pending;
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

        if (finishBattle) {
            btcp.setAttribute('style', 'display: block; width: max-content; min-width: 380px; max-width: 530px; height: auto; min-height: 120px; max-height: 621px; overflow: auto;');
            btcp.classList.add('jpx-final-result');

            recordFinalBattle();

            localStorage.removeItem(prefix + 'battleLogRecord' + isekaiSuffix);
            localStorage.removeItem(prefix + 'timeRecords' + isekaiSuffix);
            localStorage.removeItem(prefix + 'combatRecords' + isekaiSuffix);
            localStorage.removeItem(prefix + 'revenueRecords' + isekaiSuffix);

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
    conditionsObj = null;

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

function goNext() {
    if (document.querySelector('#riddlemaster')) return;
    if (isActiveBattle) {
        jpxPanelManager.setBackground('#4f4');

        //End of Round
        let btcp = document.querySelector('#btcp');
        let finishBattle = document.querySelector('img[src$="finishbattle.png"]');
        if (finishBattle) return;
        if (!monstersObj.activeMonsters[0]) {
            if (btcp) {
                if (cfgBattle.ajaxRound) {
                    btcp.onclick = async function() {
                        if (btcp.style.visibility === 'hidden') return;
                        btcp.style.visibility = 'hidden';

                        function bindRiddleForm(riddleform) {
                            let submitting = false;
                            let timer;

                            riddleform.addEventListener('submit', e => {
                                e.preventDefault();

                                if (submitting) return;
                                submitting = true;
                                timer = setTimeout(() => { submitting = false; }, 10000);

                                let formData = new FormData(riddleform);
                                let submitBtn = document.querySelector('#riddlesubmit');
                                if (submitBtn?.name) formData.append(submitBtn.name, submitBtn.value);

                                fetch(riddleform.action || location.href, {
                                    method: 'POST',
                                    body: new URLSearchParams(formData),
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Cache-Control': 'max-age=0',
                                    },
                                })
                                .then(response => response.redirected ? location.href = response.url : response.text())
                                .then(html => updateBattleMain(new DOMParser().parseFromString(html, 'text/html')))
                                .catch(err => {
                                    console.error('Submission failed: ', err);
                                    jpxUtils.createToast('Submission failed: ' + err);
                                })
                                .finally(() => {
                                    submitting = false;
                                    clearTimeout(timer);
                                });
                            });
                        }

                        function updateBattleMain(doc) {
                            let main = document.querySelector('#battle_main');
                            let mainNew = doc.querySelector('#battle_main');

                            document.querySelector('#riddle-panel')?.remove();
                            clearInterval(window.timer);

                            if (main && mainNew) {
                                main.replaceWith(mainNew);
                            } else {
                                document.body.innerHTML = doc.body.innerHTML;
                            }

                            let t = setTimeout(() => {}, 0);
                            for (let i = t; i > 0 && i > t - 100; clearInterval(i--));
                            window.battle = new window.Battle();
                            document.dispatchEvent(new Event('DOMContentLoaded'));
                        }

                        await jpxUtils.xhrGet([location.href]).then((results) => {
                            for (let result of results) {
                                if (result.status === 'rejected') {
                                    console.error(result.reason);
                                    break;
                                }
                                try {
                                    let parser = new DOMParser();
                                    let doc = parser.parseFromString(result.value.responseText, 'text/html');

                                    if (doc.querySelector('#riddlemaster')) {
                                        let riddlePanel = document.createElement('div');
                                        riddlePanel.id = 'riddle-panel';
                                        riddlePanel.style.cssText = 'position:fixed; top:0; left:0; z-index:9999; border:2px solid black; overflow:auto;';
                                        riddlePanel.appendChild(document.importNode(doc.body, true));
                                        document.body.appendChild(riddlePanel);

                                        bindRiddleForm(riddlePanel.querySelector('#riddleform'));

                                        let script = document.createElement('script');
                                        script.type = 'text/javascript';
                                        script.innerHTML = doc.getElementsByTagName('script')[2]?.innerHTML.replace('e("riddleform").submit();', 'e("riddleform")?.requestSubmit();');
                                        riddlePanel.querySelector('#mainpane').appendChild(script);

                                        document.dispatchEvent(new Event('DOMContentLoaded'));
                                    } else {
                                        updateBattleMain(doc);
                                    }
                                } catch (e) {
                                    console.error('Parsing error for url:', result.value.url);
                                }
                            }
                        });
                    }
                }

                if (cfgBattle.advanceToNextRound) {
                    btcp.click();
                    btcp.style.visibility = 'hidden';
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
                    if (isActiveBattle && !document.querySelector('#riddlemaster')) smartBattle();
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

function onKeyDown(e, throttledActionManager) {
    if (jpxUtils.keyCaptureController) return;

    let target = e.target;
    // Focused panel controls own their arrows, Home, Enter and Space keys.
    if (target.closest?.('#ctrl-widget') && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Enter', ' ', 'Escape'].includes(e.key)) return;
    if (
        e.isComposing ||
        (target instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file'].includes(target.type) && !target.readOnly && !target.disabled) ||
        (target instanceof HTMLTextAreaElement && !target.readOnly && !target.disabled) ||
        target.isContentEditable
    ) return;

    let currentKB = 'kb_' + jpxUtils.formatKeyCombo({
        key: e.key,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey
    }, '+');

    if (document.getElementById('settings-container')?.open) {
        if (!e.repeat && userKeybinds.openSettings && currentKB === 'kb_' + jpxUtils.formatKeyCombo(userKeybinds.openSettings, '+')) {
            e.preventDefault();
            e.stopPropagation();
            renderSettings();
        }
        return;
    }

    if (!e.repeat) {
        for (const [action, bind] of Object.entries(userKeybinds)) {
            if (currentKB === ('kb_' + jpxUtils.formatKeyCombo(bind, '+'))) {
                e.preventDefault();
                keybindHandlers[action]?.();
                return;
            }
        }
    }

    if (!log || isActiveBattle || !monstersObj.activeMonsters[0]) return;
    let actions = cfgBattle[getBattleMode()][currentKB];
    if (actions) {
        e.preventDefault();
        (e.repeat ? throttledActionManager : actionManager)(actions);
    }
}

function toggleActive() {
    if (!log) return;
    isActiveBattle = !isActiveBattle;
    if (isActiveBattle) readyNext = 0;
    jpxPanelManager.updateContent('battle');
    jpxPanelManager.setBackground(isActiveBattle ? '#4f4' : '#fef');
    if (isActiveBattle) goNext();
    jpxPanelManager.dispatchState();
}

//Battle Smart
function smartBattle() {
    let { supports, attacks } = cfgBattle[getBattleMode()];
    if (supports.length < 1) {
        isActiveBattle = false;
        readyNext = '\nWith so few conditions, you might die in auto-battle.';
        jpxPanelManager.updateContent('battle');
        jpxPanelManager.setBackground('#ff5');
        return true;
    }
    if (actionManager(supports)) return true;
    if (actionManager(attacks)) return true;

    isActiveBattle = false;
    readyNext = '\nNo available action.';
    jpxPanelManager.updateContent('battle');
    jpxPanelManager.setBackground('#ff5');

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
            if (!isUnDebuffed(j - 1) || !isUnDebuffed(j) || !isUnDebuffed(j + 1)) continue;
            doSpellGoNext(name, monsters[j]);
            return true;
        }
    }
    if (targetCount >= 2) {
        for (let i = startIndex; i < endIndex; i++) {
            let j = getIndex(i);
            if (!isUnDebuffed(j - 1) || !isUnDebuffed(j)) continue;
            if ((targetCount === 2 && !bottomUp || targetCount === 3) && i === startIndex && monsters[j + dir]?.isAlive) {
                doSpellGoNext(name, monsters[j + dir]);
            } else if ((targetCount === 2 && bottomUp || targetCount === 3) && i === endIndex - 1 && monsters[j - dir]?.isAlive) {
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
            if (!isUnDebuffed(j - 1) || !monsters[j]?.isAlive || !isUnDebuffed(j + 1)) continue;
            doSpellGoNext(name, monsters[j]);
            return true;
        }
    }
    for (let i = startIndex; i < endIndex; i++) {
        let j = getIndex(i);
        if (!isUnDebuffed(j)) continue;
        if ((targetCount === 2 && !bottomUp || targetCount === 3) && i === startIndex && monsters[j + dir]?.isAlive) {
            doSpellGoNext(name, monsters[j + dir]);
        } else if ((targetCount === 2 && bottomUp || targetCount === 3) && i === endIndex - 1 && monsters[j - dir]?.isAlive) {
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
    if (monster?.isAlive && spellCooldowns[spell] === 0) {
        cast(spell);
        monster.click();
        return true;
    }
    return false;
}

function doAttackGoNext(monster) {
    readyNext = 0;
    if (monster?.isAlive) {
        monster.click();
        return true;
    }
    return false;
}

function doToggleGoNext(name) {
    readyNext = 0;
    let state = document.querySelector('#ckey_' + name.toLowerCase());
    if (state) {
        dummy.setAttribute('onclick', state.getAttribute('onmouseover'));
        dummy.click();
        state.click();
        return true;
    }
    return false;
}

function cast(name) {
    let spell = document.querySelector('.bts > div[onclick][onmouseover*="\'' + name + '\'"]');
    if (document.getElementsByClassName('btii')[0].textContent != name && spell) {
        dummy.setAttribute('onclick', spell.getAttribute('onmouseover'));
        dummy.click();
        spell.click();
    }
}

function use(name) {
    let id = Object.entries(itemMap).find(([id, _name]) => _name === name)?.[0];
    if (!id) return;

    let itemArray = Array.from(document.querySelectorAll('.bti3 > div[onclick][onmouseover]'));
    let item = itemArray.find(div => div.outerHTML.includes(id));
    if (item) {
        dummy.setAttribute('onclick', item.getAttribute('onmouseover'));
        dummy.click();
        item.click();
    }
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
                if (spellIconID) {
                    innerImg.src = '/y/a/' + spellIconID + '.png';
                } else {
                    innerImg.src = itemSrc.find(rule => rule.keys.some(key => {
                        if (name === 'ikey_p') return quickbarObj[name].name.includes(key);
                        return name.includes(key);
                    }))?.src ?? '/y/e/channeling.png';
                }

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
        oc = Math.round(10 * parseInt(ocBar.style.width, 10) / vitalCfg.widthOC * 1000) / 1000;
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

    let hpPercentage = Math.round(parseInt(document.querySelector('img[src$="green.png"]').style.width, 10) / vitalCfg.widthHP * 1000) / 1000;
    let mpPercentage = Math.round(parseInt(document.querySelector('img[src$="bar_blue.png"]').style.width, 10) / vitalCfg.widthMP * 1000) / 1000;
    let spPercentage = Math.round(parseInt(document.querySelector('img[src$="bar_red.png"]').style.width, 10) / vitalCfg.widthSP * 1000) / 1000;

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
            } else if (turns === 'decaying') {
                displayTurns = '';
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
            level: 0,
            name: 'Unknown',
            type: 'Normal',
            hpPercentage: 0,
            mpPercentage: 0,
            spPercentage: 0,
            isAlive: monster_btm1.hasAttribute('onclick'),
            effectObj: {},
            monster_btm1: monster_btm1,
        };

        //level
        let monster_btm2 = monster_btm1.querySelector('.btm2');
        let levelContainer = monster_btm2.querySelector('div:last-child');
        monster.level = parseInt(levelContainer.textContent.trim() || jpxUtils.parseHVClasses(levelContainer));
        //index
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

    let turnLog = getBattleLogHTML().match(regExp.turnLog)?.[0];
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

function initConditions() {
    let { monsters, activeMonsters, bosses, activeBosses } = monstersObj;

    const generalHandlers = {
        world: arr => arr.includes(!isekaiSuffix ? 'Persistent' : 'Isekai'),
        pLevel: range => jpxUtils.inRange(parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix) || 1), range),
        pMaxSpellType: arr => arr.includes(spellDamageBonus.maxType),
        battleTypes: arr => arr.includes(battleType),
        difficulty: arr => arr.includes(localStorage.getItem(prefix + 'difficulty' + isekaiSuffix) || 'PFUDOR'),
        roundCurrent: range => jpxUtils.inRange(roundInfo.current, range),
        roundLeft: range => jpxUtils.inRange(roundInfo.total - roundInfo.current, range),
        roundTotal: range => jpxUtils.inRange(roundInfo.total, range),
        floor: range => (battleType !== 'Tower' || jpxUtils.inRange(towerFloor, range)),
        pActionCooldown: arr => {
            let range = arr.slice(0, 2);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ? spellsDamageObj[spellDamageBonus.maxType][tier - 1] : action;
                let cooldown = spellCooldowns[action2] ?? itemCooldowns[action2];
                if (cooldown === '-') cooldown = 9999;
                return jpxUtils.inRange(cooldown, range);
            });
        },
		pActionHistory: arr => {
            let range = arr.slice(0, 2).map(n => n - 1);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ? spellsDamageObj[spellDamageBonus.maxType][tier - 1] : action;
				return actionCounts.history.some((act, index) => act === action2 && jpxUtils.inRange(index, range));
            });
        },
        pActionCounts: arr => {
            let range = arr.slice(0, 2);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ? spellsDamageObj[spellDamageBonus.maxType][tier - 1] : action;
                return jpxUtils.inRange(actionCounts[action2] ?? 0, range);
            });
        },
		pTotalActionCounts: arr => {
            let range = arr.slice(0, 2);
            let actions = arr.slice(2);

            return actions.every(action => {
                let tier = action.match(/^T(\d)$/)?.[1];
                let action2 = tier ? spellsDamageObj[spellDamageBonus.maxType][tier - 1] : action;
				return jpxUtils.inRange(combatRecords.use[action2] || revenueRecords.consumable[action2]?.use || 0, range);
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
        monsters: range => jpxUtils.inRange(monsters.length, range),
        activeMonsters: range => jpxUtils.inRange(activeMonsters.length, range),
        defeatedMonsters: range => jpxUtils.inRange(monsters.length - activeMonsters.length, range),
        bosses: range => jpxUtils.inRange(bosses.length, range),
        activeBosses: range => jpxUtils.inRange(activeBosses.length, range),
        defeatedBosses: range => jpxUtils.inRange(bosses.length - activeBosses.length, range),
        mLevel: range => jpxUtils.inRange(monsters[0].level, range),
        mWithoutEffects: arr => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);
            return jpxUtils.inRange(activeMonsters.filter(activeMonster => effects.some(effect => activeMonster.effectObj[effect]?.turns == null)).length, range);
        },
    };

    const targetHandlers = {
        tName: (str, t) => {
            let regex = jpxUtils.toRegExp(str);
            return !regex || regex.test(t.name);
        },
        tTypes: (arr, t) => arr.includes(t.type),
        tClasses: (arr, t) => arr.includes(allMonsterInfo?.[`mkey_${(t.index + 1) % 10}`]?.monsterClass),
        tPowerLevel: (range, t) => jpxUtils.inRange(allMonsterInfo?.[`mkey_${(t.index + 1) % 10}`]?.plvl, range),
        tIndex: (range, t) => jpxUtils.inRange(t.index, range.map(n => n = n > 0 ? n - 1 : n === 0 ? 0 : monsters.length + n)),
        tHP: (range, t) => jpxUtils.inRange(t.hpPercentage, range),
        tMP: (range, t) => jpxUtils.inRange(t.mpPercentage, range),
        tSP: (range, t) => jpxUtils.inRange(t.spPercentage, range),
        tEffects: (arr, t) => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let turns = t.effectObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        tIgnoredEffects: (arr, t) => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return !effects.some(effect => {
                let turns = t.effectObj[effect]?.turns ?? -1;
                if (turns === 'permanent') turns = 9999;
                return isNaN(+turns) || jpxUtils.inRange(+turns, range);
            });
        },
        tEffectStacks: (arr, t) => {
            let range = arr.slice(0, 2);
            let effects = arr.slice(2);

            return effects.every(effect => {
                let stack = t.effectObj[effect]?.stack ?? -1;
                return isNaN(+stack) || jpxUtils.inRange(+stack, range);
            });
        },
        tDaysSinceUpdate: (range, t) => {
            let lastUpdate = allMonsterInfo?.[`mkey_${(t.index + 1) % 10}`]?.lastUpdate;
            let deltaDays = lastUpdate ? jpxUtils.daysSince(lastUpdate) : 9999;
            return !jpxUtils.isEmpty(allMonsterInfo) && jpxUtils.inRange(deltaDays, range);
        },
    };

    return { generalHandlers, targetHandlers };
}

function checkConditions(conditions, target, checkGlobal = true, checkTarget = true) {
    let { monsters, activeMonsters, bosses, activeBosses } = monstersObj;

    if (jpxUtils.isEmpty(conditionsObj)) conditionsObj = initConditions();
    let { generalHandlers, targetHandlers } = conditionsObj;

    return conditions.every(condition => {
        let { key, value, offset = [0, 0], matched = [1, 1] } = condition;

        if (key in generalHandlers && checkGlobal) {
            return generalHandlers[key](value) === true;
        }

        if (key in targetHandlers && checkTarget) {
            if (!target) return false;
            let successCount = 0;

            for (let i = target.index + offset[0]; i <= target.index + offset[1]; i++) {
                if (i < 0 || i > monsters.length - 1) continue;
                let m = activeMonsters.find(activeMonster => activeMonster.index === i);
                if (m && targetHandlers[key](value, m) === true) successCount++;
            }

            return jpxUtils.inRange(successCount, matched);
        }

        return true;
    });
}

const kamisamaCache = new Map();
function getKamisama(code) {
	if (!kamisamaCache.has(code)) kamisamaCache.set(code, new Function('jpx', `'use strict';\n${code}`));
	return kamisamaCache.get(code);
}

const actionHandlers = {
    stop(action, monster) {
        const { customMessage, conditions } = action;

        if (checkConditions(conditions, monster, true, !!monster)) {

            // A rule stop waits for a fresh battle update; keep auto armed so
            // manual healing can clear the condition, as in upstream JPX.
            readyNext = `Stop: ${customMessage}`;
            jpxPanelManager.updateContent('battle');
            jpxPanelManager.setBackground('#ff5');
            jpxPanelManager.dispatchState();
            return true;
        }
        return false;
    },

    spellSupport(action, monster) {
        const { name, conditions } = action;

        if (
            spellCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, !!monster)
        ) {
            readyNext = 0;
            cast(name);
            return true;
        }
        return false;
    },

    item(action, monster) {
        const { name, conditions } = action;

        if (
            itemCooldowns[name] === 0 &&
            checkConditions(conditions, monster, true, !!monster)
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
            doToggleGoNext(name)
        );
    },

    target(action, monster) {
        const { priorityRule, conditions } = action;
        if (!checkConditions(conditions, monster, true, false)) return null;

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

        return list.find(activeMonster => checkConditions(conditions, activeMonster, false)) ?? null;
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
            monster &&
            checkConditions(conditions, monster) &&
            doSpellGoNext(name, monster)
        );
    },

    spellDamage(action, monster) {
        const { name, conditions } = action;
        let tier = name.match(/^T(\d)$/)?.[1];
        let spell = tier ? spellsDamageObj[spellDamageBonus.maxType][tier - 1] : name;
        return (
            monster &&
            checkConditions(conditions, monster) &&
            doSpellGoNext(spell, monster)
        );
    },

    skill(action, monster) {
        const { name, conditions } = action;
        return (
            monster &&
            checkConditions(conditions, monster) &&
            doSpellGoNext(name, monster)
        );
    },

    normalAttack(action, monster) {
        return (
            monster &&
            doAttackGoNext(monster)
        )
    },

	kamisamaniNattaHi(action) {
		const { code } = action;
		try {
			const fn = getKamisama(code);

			return fn({
				prefix, isekaiSuffix,
				battleStyle, battleType, worldLevel, towerFloor, roundInfo,
				monsterData, allMonsterInfo, monstersEffects, monstersObj,
				actionCounts, spellDamageBonus, spellCooldowns, itemCooldowns, vitals, spiritStatus, playerEffectsObj,
				actionHandlers, doSpellsDebuffGoNext, doSpellGoNext, doAttackGoNext, doToggleGoNext,
			}) === true;
		} catch (e) {
			console.error('kamisama action error:', e);
			jpxUtils.createToast('kamisama action error: ' + e, 5000);
			isActiveBattle = false;

			if (cfgBattle.ctrlWidgetMouseEnter) jpxPanelManager.ready = false;
			readyNext = 0;
			jpxPanelManager.updateContent('battle');
			jpxPanelManager.setBackground('#fef');
			jpxPanelManager.dispatchState();
			return true;
		}
	},
};

function actionManager(actions) {
    let targetPhase = false;
    let targetMonster = null;
    let targetLocked = false;

    for (const action of actions) {
        const handler = actionHandlers[action.type];
        if (!handler) continue;
        if (action.disabled === true) continue;

        if (action.type === 'target') {
            targetPhase = true;
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

        if (action.type !== 'smartDebuff' && action.type !== 'kamisamaniNattaHi' && targetPhase && !targetMonster) continue;
        if (handler(action, targetMonster)) return true;
        targetLocked = false;
    }

    return false;
}

//Battle Record
function battleRecorder() {
    let turnLog = getBattleLogHTML().match(regExp.turnLog)?.[0];
    if (!turnLog) return;

    let action = turnLog.match(regExp.action)?.[1];
    if (!action) {
        if (!turnLog.includes('<strong>Scanning')) return;
        turnLog = turnLog.replace(/[\t\r\n]+/g, '').replace(/>\s+</g, '><');
        action = 'You use Scan';
    }
    if (action.includes('gains the effect')) {
        let action2 = turnLog.match(regExp.action2)?.[1];
        action2 && (action = action2);
    }

    let use = action.match(regExp.use)?.[2];
    if (cfgBattle.recordBattleLog) battleLogRecorder();
    timeRecorder(turnLog, action, use);
    combatRecorder(turnLog, action, use);
    revenueRecorder(turnLog, action, use);
}

function battleLogRecorder() {
    let tdArray = Array.from(log.querySelectorAll('td'));
    let tlsArray = Array.from(log.querySelectorAll('.tls'));
    if (regExp.battleTypeLog.test(getBattleLogHTML(tdArray.at(-1))) & tlsArray.length === 1) {
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
			actionCounts.history.unshift(use);
            use === 'Scan' && updateMonsterInfo();
        }
    } else if (action.includes('Spirit Stance Engaged')) {
        jpxUtils.inc(combatRecords.use, 'Spirit');
        jpxUtils.inc(actionCounts, 'Spirit');
		actionCounts.history.unshift('Spirit');
    } else if (action.includes('Defending.')) {
        jpxUtils.inc(combatRecords.use, 'Defend');
        jpxUtils.inc(actionCounts, 'Defend');
		actionCounts.history.unshift('Defend');
    } else if (action.includes('Focusing.')) {
        jpxUtils.inc(combatRecords.use, 'Focus');
        jpxUtils.inc(actionCounts, 'Focus');
		actionCounts.history.unshift('Focus');
    } else {
        jpxUtils.inc(combatRecords.use, 'Attack');
        jpxUtils.inc(actionCounts, 'Attack');
		actionCounts.history.unshift('Attack');
    }

    if (turnLog.includes('You gain the effect Cloak of the Fallen.')) {
        jpxUtils.inc(combatRecords.use, 'Cloak of the Fallen');
        jpxUtils.inc(actionCounts, 'Cloak of the Fallen');
    }

    let damage = turnLog.match(regExp.damage);
    if (damage) {
        for (let i = 0; i < damage.length; i++) {
            let damageTaken = jpxUtils.matchAny(damage[i], regExp.damageTaken1, regExp.damageTaken2);
            let spiritShield = damage[i].match(regExp.spiritShield);
            let damageDealt = jpxUtils.matchAny(damage[i], regExp.damageDealt1, regExp.damageDealt2);
            let strike = damage[i].match(regExp.strike);
            let explode = damage[i].match(regExp.explode);
            let damagePlus = damage[i].match(regExp.damagePlus);
            let damagePoints = damage[i].match(regExp.damagePoints);

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
                if (regExp.damagePhysicalPlus.test(damage[i])) {
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
    let debuffLog = turnLog.match(regExp.debuffLog)?.[0];
    if (debuffLog) {
        let debuffResist0 = debuffLog.match(regExp.debuffResist0)?.length || 0;
        let debuffResist1 = debuffLog.match(regExp.debuffResist1)?.length || 0;
        let debuffResist3 = debuffLog.match(regExp.debuffResist3)?.length || 0;
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
    combatRecordsFactory(regExp.magicalDealtMiss, 'magicalDealt', 'miss');
    combatRecordsFactory(regExp.magicalDealtEvade, 'magicalDealt', 'evade');
    combatRecordsFactory(regExp.magicalDealtResistPartially, 'magicalDealt', 'resistPartially');
    combatRecordsFactory(regExp.magicalDealtResist, 'magicalDealt', 'resist');

    //Physical Dealt
    combatRecordsFactory(regExp.physicalDealtMiss, 'physicalDealt', 'miss');
    combatRecordsFactory(regExp.physicalDealtEvade, 'physicalDealt', 'evade');
    combatRecordsFactory(regExp.physicalDealtParryPartially, 'physicalDealt', 'parryPartially');
    combatRecordsFactory(regExp.physicalDealtParry, 'physicalDealt', 'parry');

    //Magical Taken
    combatRecordsFactory(regExp.magicalTakenMiss, 'magicalTaken', 'miss');
    combatRecordsFactory(regExp.magicalTakenEvade, 'magicalTaken', 'evade');
    combatRecordsFactory(regExp.magicalTakenBlockPartially, 'magicalTaken', 'blockPartially');
    combatRecordsFactory(regExp.magicalTakenBlock, 'magicalTaken', 'block');
    combatRecordsFactory(regExp.magicalTakenResistPartially, 'magicalTaken', 'resistPartially');

    //Physical Taken
    combatRecordsFactory(regExp.physicalTakenMiss, 'physicalTaken', 'miss');
    combatRecordsFactory(regExp.physicalTakenEvade, 'physicalTaken', 'evade');
    combatRecordsFactory(regExp.physicalTakenParryPartially, 'physicalTaken', 'parryPartially');
    combatRecordsFactory(regExp.physicalTakenParry, 'physicalTaken', 'parry');
    combatRecordsFactory(regExp.physicalTakenBlockPartially, 'physicalTaken', 'blockPartially');
    combatRecordsFactory(regExp.physicalTakenBlock, 'physicalTaken', 'block');

    //Counter
    combatRecordsFactory(regExp.counter, 'use', 'Counter');
}

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
		actionCounts.history.unshift(use);
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
                        jpxUtils.inc(revenueRecords.material, drop[3], +drop[1].match(/\d+/)?.[0] || 1);
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
                if (drop[3].includes('World Seed')) {
                    revenueRecords['consumable'][drop[3]] ??= { use: 0, drop: 0 };
                    revenueRecords['consumable'][drop[3]]['drop'] += +drop[1].match(/\d+/)?.[0] || 1;
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

async function battleRecordPlayer(doFinal = true) {
    function revenueCalc(revenueRecords, priceData) {
        let revenueSnapshot = JSON.parse(JSON.stringify(revenueRecords));

        for (const [categoryKey, categoryValue] of Object.entries(revenueSnapshot)) {
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
                revenueSnapshot['totalProfit'] += categoryValue['profit'];
            }
        }

        revenueSnapshot['totalProfit'] = Math.round(revenueSnapshot['totalProfit'] + (revenueSnapshot['credit'] || 0));
        return revenueSnapshot;
    }

    function getStaminaCost() {
        if (battleType === 'Encounter' || battleType === 'Colosseum') return 0;

        let stamina = parseFloat(localStorage.getItem(prefix + 'stamina' + isekaiSuffix)) || 80;
        let greatCost = !isekaiSuffix ? 0.03 : 0.06;
        let normalCost = !isekaiSuffix ? 0.02 : 0.04;
        let greatRoundQuota = Math.floor(Math.max(0, stamina - (battleType === 'Battle1000' ? 1 : 0) - 60) / greatCost);
        let greatRound = Math.min(greatRoundQuota, roundInfo.current);
        let normalRound = roundInfo.current - greatRound;
        let staminaCost = greatRound * greatCost + normalRound * normalCost;

        if (battleType === 'Battle1000') staminaCost += 1;
        return staminaCost;
    }

    if (Object.keys(cfgStats).length < 1) {
        let storedCfgStats = {};
        try {
            storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
        } catch (err) {
            console.warn('Failed to load cfgStats. Using default cfgStats.');
            storedCfgStats = {};
        }
        mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');
        delete cfgStats.darkMode;
    }

    let startTime = timeRecords['startTime'] || 0;
    let timestamp = new Date(timeRecords['startTime']).toISOString().slice(0, 19).replace('T', ' ');
    let date = timestamp.slice(0, 10);
    let result = 'inProgress';
    if (getBattleLogHTML().includes('You are Victorious!') && roundInfo.current === roundInfo.total) {
        result = 'Victory';
    } else if (getBattleLogHTML().includes('You have been defeated.')) {
        result = 'Defeat';
    } else if (getBattleLogHTML().includes('You have escaped from the battle.')) {
        result = 'Flee';
    }
    let deltaSeconds = (Date.now() - startTime) / 1000;
    let deltaTime = jpxUtils.secondsToTime(deltaSeconds, true);
    let action = timeRecords['action'];
    let tps = Math.round(action / deltaSeconds * 100) / 100;

    let priceData = await jpxMarket.getMarketPrice(doFinal);
    let revenueSnapshot = revenueCalc(revenueRecords, priceData);
    let staminaCost = getStaminaCost();

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
        revenueSnapshot['staminaCost'] = Math.round((staminaCost - Math.max(0, staminaQuota)) * 10) / 10;
    } else {
        revenueSnapshot['staminaCost'] = 0;
    }

    if (doFinal) {
        staminaRecords.staminaCost = Math.round((staminaRecords.staminaCost + staminaCost) * 10) / 10;
        localStorage.setItem(prefix + 'staminaRecords' + isekaiSuffix, JSON.stringify(staminaRecords));
    }

    //Final Profit
    let staminaUnitPrice = priceData['Energy Drink'] / 10;
    let staminaProfit = Math.round(-revenueSnapshot['staminaCost'] * staminaUnitPrice * 10) / 10;
    revenueSnapshot['finalProfit'] = Math.round((revenueSnapshot['totalProfit'] + staminaProfit) * 10) / 10;

    let battleRecords = {
        world: !isekaiSuffix ? 'Persistent' : 'Isekai',
        timestamp: timestamp,
        date: date,
        playerLevel: parseInt(localStorage.getItem(prefix + 'playerLevel' + isekaiSuffix)) || 0,
        difficulty: difficultyMap[localStorage.getItem(prefix + 'difficulty' + isekaiSuffix)] || 0,
        persona: localStorage.getItem(prefix + 'persona' + isekaiSuffix),
        battleType: battleType,
        worldLevel: worldLevel,
        towerFloor: towerFloor,
        roundInfo: roundInfo,
        result: result,
        deltaSeconds: deltaSeconds,
        deltaTime: deltaTime,
        turns: timeRecords.action,
        tps: tps,
        riddle: timeRecords.riddle.total,
        combatRecords: combatRecords,
        revenueRecords: revenueSnapshot,
    }

    let battleLogEl = cfgBattle.recordBattleLog ? battleLogPlayer() : null;
    let timeRecordEl = document.querySelector('#time-records-div') || timeRecordPlayer(battleRecords);
    let combatRecordEl = document.querySelector('#combat-records-table') || combatRecordPlayer(combatRecords);
    let combatRecord_UseEl = document.querySelector('#combat-records-use-table') || combatRecordPlayer_Use(combatRecords);
    let revenueRecordEl = document.querySelector('#revenue-records-table') || revenueRecordPlayer(revenueSnapshot, priceData);

    if (doFinal) {
        const combatPanel = document.getElementById('jpx-final-combat') || document.createElement('div');
        combatPanel.id = 'jpx-final-combat';
        combatPanel.className = 'jpx-record-detail jpx-record-detail-column jpx-record-final';
        combatPanel.replaceChildren(...[battleLogEl, createRecordTableScroll(combatRecordEl, document), createRecordTableScroll(combatRecord_UseEl, document)].filter(Boolean));
        log.parentNode.prepend(combatPanel);

        const revenuePanel = document.getElementById('jpx-final-revenue') || document.createElement('div');
        revenuePanel.id = 'jpx-final-revenue';
        revenuePanel.className = 'jpx-record-detail jpx-record-final';
        const summary = document.createElement('div');
        summary.className = 'jpx-record-detail-summary';
        summary.append(timeRecordEl);
        revenuePanel.replaceChildren(summary, createRecordTableScroll(revenueRecordEl, document));
        const resultPanel = document.querySelector('#btcp');
        if (resultPanel) {
            resultPanel.classList.add('jpx-final-result');
            resultPanel.append(revenuePanel);
        }

        await storeBattleRecords(battleRecords)
            .then(result => console.log(result))
            .catch(err => console.error('Save failed: ', err));
    } else {
        newWindowRecordPlayer(document.querySelector('#time-records-div'), battleRecords, timeRecordEl, combatRecordEl, combatRecord_UseEl, revenueRecordEl);
    }

    cfgBattle.recordBattleLog && console.log(battleLogRecord);
    console.log(timeRecords);
    console.log(combatRecords);
    console.log(revenueSnapshot);
    console.log(battleRecords);
}

function battleLogPlayer() {
    let blob = new Blob([JSON.stringify(battleLogRecord, null, '\t')], { type: 'text/plain;charset=utf-8' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.innerText = t('sGen.downloadBattleLog');
    a.style.cssText = 'display: block; margin: 10px 0px; text-align: left; font-size: 200%;';
    a.href = url;
    a.download = 'battleLog.txt';
    return a;
}

function timeRecordPlayer(battleRecords) {
    let div = document.createElement('div');
    div.id = 'time-records-div';

    let riddleSolved = 
        timeRecords?.startTime && battleRecords.timestamp === new Date(timeRecords.startTime).toISOString().slice(0, 19).replace('T', ' ') &&
        timeRecords.riddle.solved < battleRecords.riddle ? `${timeRecords.riddle.solved} / ` : '';
    [
        [t('tP.turns'), battleRecords.turns.toLocaleString()],
        [t('sP.deltaTime'), battleRecords.deltaTime],
        [t('tP.t/s'), battleRecords.tps],
        [t('tP.riddle'), `${riddleSolved}${battleRecords.riddle}`],
        [t('tP.spark'), battleRecords.combatRecords.use['Cloak of the Fallen'] || 0],
    ].forEach(([label, value]) => {
        const metric = document.createElement('span');
        metric.className = 'jpx-record-metric';
        const number = document.createElement('strong');
        number.textContent = value;
        metric.append(label + ' ', number);
        div.append(metric);
    });
    return div;
}

function combatRecordPlayer(combatRecords) {
    let table = document.createElement('table');
    table.id = 'combat-records-table';
    table.className = 'records-table';
    table.innerHTML = '<colgroup><col><col span="7"></colgroup>';
    let tbody = document.createElement('tbody');

    let innerHTML = `
        <tr>
            <td rowspan="2"></td>
            <td colspan="3">${t('cP.damageDealt')}</td>
            <td colspan="4">${t('cP.damageTaken')}</td>
        </tr>
        <tr>
            <td>${t('cP.physical')}</td><td>${t('cP.magical')}</td><td>${t('cP.total')}</td>
            <td>${t('cP.physical')}</td><td>${t('cP.magical')}</td><td>${t('cP.spirit')}</td><td>${t('cP.total')}</td>
        </tr>`;

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
        let order = ['label', 'pd', 'md', 'td', 'pt', 'mt', 'pts', 'tt'];

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
        if (row.disabled === true) return;
        let excludeIds = ['resist50', 'resist75', 'resist90'];
        if (excludeIds.includes(row.id)) return;

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
                innerHTML += `<td style="text-align: left;">${t('cP.total')}</td><td>${(debuffResistTotal || '').toLocaleString()}</td>`;
            }
            innerHTML += '<td colspan="4"></td></tr>';
        } else if (critStack) {
            innerHTML += `<tr><td>${i}x-${t('cP.crit')}</td><td>${(critStack || '').toLocaleString()}</td><td colspan="6"></td></tr>`;
        }
    }

    tbody.innerHTML = innerHTML;
    table.appendChild(tbody);
    return table;
}

function combatRecordPlayer_Use(combatRecords) {
    let table = document.createElement('table');
    table.id = 'combat-records-use-table';
    table.innerHTML = '<colgroup><col style="width:96px"><col></colgroup>';
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
    return table;
}

function revenueRecordPlayer(revenueRecords, priceData) {
    let table = document.createElement('table');
    table.id = 'revenue-records-table';
    table.className = 'records-table';
    table.innerHTML = '<colgroup><col><col span="3"><col><col></colgroup>';
    let tbody = document.createElement('tbody');

    let innerHTML = `
        <tr style="border: 1px solid;"><td colspan="6">${t('rP.revenue')}</td></tr>
        <tr style="border: 1px solid;">
            <td style="text-align: left;">${t('rP.name')}</td>
            <td>${t('rP.drop')}</td><td>${t('rP.use')}</td><td>${t('rP.balance')}</td><td>${t('rP.unitPrice')}</td><td>${t('rP.profit')}</td>
        </tr>`;

    cfgStats.revenueRows.forEach(row => {
        if (row.disabled === true) return;
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
                    if (field.type === 'list_flat' && Array.isArray(data[sortedKey])) items.push(...data[sortedKey]);
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
                    let balance = field.type === 'grid_detailed' ? Math.round((value.drop - value.use) * 10) / 10 : value;
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
                let staminaQuotaTotal = 24 + (cfgBattle.dailyStaminaQuotaPlus && !isekaiSuffix ? cfgBattle.dailyStaminaQuotaPlus : 0);
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
    return table;
}

async function createRecordImageBlob(root) {
    if (!root?.isConnected || root.closest('[aria-busy=true]')) throw new Error(t('sP.imageUnavailable'));
    const doc = root.ownerDocument, win = doc.defaultView;
    const detail = root.classList.contains('jpx-record-detail-page'), clone = root.cloneNode(true);
    const properties = ['display', 'box-sizing', 'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style',
        'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'vertical-align', 'white-space', 'overflow-wrap',
        'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius', 'border-collapse', 'border-spacing',
        'table-layout', 'flex-direction', 'flex-wrap', 'align-items', 'align-content', 'justify-content', 'gap', 'grid-template-columns'];
    const originals = [root, ...root.querySelectorAll('*')], copies = [clone, ...clone.querySelectorAll('*')];
    originals.forEach((node, index) => {
        const copy = copies[index], style = win.getComputedStyle(node);
        copy.removeAttribute('style');
        for (const property of properties) copy.style.setProperty(property, style.getPropertyValue(property));
        copy.style.position = 'static'; copy.style.overflow = 'visible'; copy.style.maxHeight = 'none';
        copy.style.outline = 'none'; copy.style.boxShadow = 'none';
        // Export only local text and styling, without loading linked assets.
        for (const attribute of [...copy.attributes]) if (/^on/i.test(attribute.name)) copy.removeAttribute(attribute.name);
    });
    clone.querySelectorAll('.jpx-record-image-actions, script, style, img, iframe, object, embed, link').forEach(node => node.remove());
    clone.style.margin = '0';
    if (detail) {
        const combatWidth = Math.ceil(root.querySelector('#combat-records-table').getBoundingClientRect().width),
            revenueWidth = Math.ceil(root.querySelector('#revenue-records-table').getBoundingClientRect().width);
        clone.style.width = (combatWidth + revenueWidth + 40) + 'px'; clone.style.maxWidth = 'none'; clone.style.padding = '12px';
        const grid = clone.querySelector('.jpx-record-detail-grid');
        if (grid) grid.style.gridTemplateColumns = (combatWidth + 2) + 'px ' + (revenueWidth + 2) + 'px';
        clone.querySelectorAll('.jpx-record-detail-column, .jpx-record-detail-summary').forEach(node => {
            node.style.gridTemplateColumns = 'minmax(0, 1fr)'; node.style.minWidth = '0'; node.style.width = '100%';
        });
        clone.querySelectorAll('table').forEach(table => {
            table.style.width = table.id === 'combat-records-use-table' ? '100%' : (table.id === 'combat-records-table' ? combatWidth : revenueWidth) + 'px';
        });
        clone.querySelectorAll('#combat-records-use-table td:first-child').forEach(cell => cell.style.width = '96px');
    } else {
        clone.style.width = Math.ceil(root.getBoundingClientRect().width) + 'px'; clone.style.minWidth = '0';
    }
    // Inline styles keep the image independent of media queries and duplicate IDs.
    [clone, ...clone.querySelectorAll('*')].forEach(node => { node.removeAttribute('id'); node.removeAttribute('class'); });
    const stage = doc.createElement('div');
    stage.style.cssText = 'position:fixed;left:-100000px;top:0;width:max-content;pointer-events:none;';
    stage.setAttribute('aria-hidden', 'true'); stage.append(clone); doc.body.append(stage);
    let width, height, markup;
    try {
        width = Math.ceil(Math.max(clone.scrollWidth, clone.getBoundingClientRect().width)) + 16;
        height = Math.ceil(Math.max(clone.scrollHeight, clone.getBoundingClientRect().height)) + 16;
        const content = doc.createElement('div');
        content.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        content.style.cssText = 'box-sizing:border-box;width:' + width + 'px;padding:8px;';
        content.style.backgroundColor = win.getComputedStyle(doc.body).backgroundColor;
        content.style.color = win.getComputedStyle(doc.body).color;
        content.append(clone); markup = new win.XMLSerializer().serializeToString(content);
    } finally { stage.remove(); }
    const scale = Math.min(2, 4096 / width, 4096 / height, Math.sqrt(12000000 / (width * height)));
    if (!Number.isFinite(scale) || scale < .5) throw new Error(t('sP.imageTooLarge'));
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '"><foreignObject width="100%" height="100%">' + markup + '</foreignObject></svg>';
    const image = new win.Image();
    await new Promise((resolve, reject) => {
        image.onload = resolve; image.onerror = () => reject(new Error(t('sP.imageFailed')));
        image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
    const canvas = doc.createElement('canvas');
    canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error(t('sP.imageFailed'));
    context.fillStyle = win.getComputedStyle(doc.body).backgroundColor; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error(t('sP.imageFailed'))), 'image/png'));
}

function createRecordImageActions(doc, getContent) {
    const win = doc.defaultView, menu = doc.createElement('details');
    const compact = win.matchMedia('(max-width: 650px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px)');
    menu.className = 'jpx-record-image-actions';
    const summary = doc.createElement('summary');
    summary.textContent = t('sP.image');
    const actions = doc.createElement('div');
    actions.setAttribute('role', 'group'); actions.setAttribute('aria-label', t('sP.image'));
    const notify = (message, success = false) => {
        if (success && compact.matches) menu.open = false;
        doc.querySelectorAll('.jpx-record-image-toast').forEach(toast => toast.remove());
        const toast = jpxUtils.createToast(message, success ? 2400 : 5000, 'jpx-record-image-toast', doc);
        ['padding', 'background', 'color', 'font-size'].forEach(property => toast.style.removeProperty(property));
        toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
    };
    const buttons = [];
    for (const action of ['download', 'copy']) {
        const button = doc.createElement('button');
        button.type = 'button'; button.dataset.imageAction = action;
        button.textContent = t(action === 'copy' ? 'sP.copyImage' : 'sP.downloadImage');
        button.onclick = async () => {
            if (action === 'copy' && (!win.isSecureContext || !win.ClipboardItem || !win.navigator.clipboard?.write)) {
                notify(t('sP.imageCopyUnavailable')); return;
            }
            const restoreFocus = menu.contains(doc.activeElement);
            buttons.forEach(item => item.disabled = true);
            menu.setAttribute('aria-busy', 'true');
            let imageError;
            const image = Promise.resolve().then(() => createRecordImageBlob(getContent())).catch(error => { imageError = error; throw error; });
            image.catch(() => {});
            try {
                if (action === 'copy') {
                    // Pass a Blob promise during the gesture, using the clicked window's clipboard.
                    await win.navigator.clipboard.write([new win.ClipboardItem({ 'image/png': image })]);
                    notify(t('sP.imageCopied'), true);
                } else {
                    const url = win.URL.createObjectURL(await image), link = doc.createElement('a');
                    link.href = url;
                    link.download = ((doc.title || 'battle-statistics') + '_' + new Date().toISOString().slice(0, 10) + '.png').replace(/[<>:"/\|?*]/g, '-');
                    doc.body.append(link); link.click(); link.remove();
                    win.setTimeout(() => win.URL.revokeObjectURL(url), 30000);
                    notify(t('sP.imageDownloaded'), true);
                }
            } catch (error) {
                notify(imageError?.message || t(action === 'copy' ? 'sP.imageCopyFailed' : 'sP.imageFailed'));
            } finally {
                menu.removeAttribute('aria-busy'); buttons.forEach(item => item.disabled = false);
                if (restoreFocus && menu.isConnected && (doc.activeElement === doc.body || menu.contains(doc.activeElement))) {
                    (compact.matches && !menu.open ? summary : button).focus({ preventScroll: true });
                }
            }
        };
        buttons.push(button); actions.append(button);
    }
    menu.append(summary, actions);
    const closeOutside = event => { if (compact.matches && !menu.contains(event.target)) menu.open = false; };
    const cleanup = () => doc.removeEventListener('pointerdown', closeOutside, true);
    const updateLayout = () => { cleanup(); menu.open = !compact.matches; };
    compact.addEventListener('change', updateLayout);
    updateLayout();
    menu.addEventListener('toggle', () => {
        cleanup();
        if (menu.isConnected && compact.matches && menu.open) doc.addEventListener('pointerdown', closeOutside, true);
    });
    menu.dispose = () => { cleanup(); compact.removeEventListener('change', updateLayout); };
    menu.addEventListener('keydown', event => { if (compact.matches && event.key === 'Escape') { menu.open = false; summary.focus(); event.stopPropagation(); } });
    return menu;
}

function createRecordTableScroll(table, doc, doClone = false) {
    const scroll = doc.createElement('div');
    scroll.className = 'jpx-record-detail-scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', table.id === 'revenue-records-table' ? t('rP.revenue') : table.id === 'combat-records-use-table' ? t('cP.used') : t('cP.damageDealt') + ' / ' + t('cP.damageTaken'));
    scroll.appendChild(doClone ? table.cloneNode(true) : table);
    return scroll;
}

function newWindowRecordPlayer(doClone, battleRecords, timeRecordEl, combatRecordEl, combatRecord_UseEl, revenueRecordEl) {
    let newWin = window.open();
    if (!newWin) return;
    let doc = newWin.document;
    doc.title = t('sP.battleDetails') + ' · ' + (battleRecords.timestamp || battleRecords.date || '');
    doc.documentElement.lang = document.documentElement.lang || 'en';
    const viewport = doc.createElement('meta');
    viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1';
    doc.head.append(viewport);
    ensureJpxStyle(doc);
    doc.body.className = 'jpx-record-detail';
    doc.documentElement.style.scrollbarColor = 'var(--jpx-theme-accent, #5c0d11) var(--jpx-theme-background, #e3e0d1)';
    applyJpxTheme(doc);

    let container = doc.createElement('main');
    container.className = 'jpx-record-detail-page';
    const summary = doc.createElement('header');
    summary.className = 'jpx-record-detail-summary';
    const grid = doc.createElement('div');
    grid.className = 'jpx-record-detail-grid';

    let left = doc.createElement('div');
    left.className = 'jpx-record-detail-column';

    let info = doc.createElement('div');
    info.id = 'info-records-div';
    [
        battleRecords.timestamp,
        t(`sP.${battleRecords.world}`),
        t(`sP.${battleRecords.battleType || ''}`) + (battleRecords.worldLevel ? ` (WL${battleRecords.worldLevel})` : '') + (battleRecords.towerFloor ? ` (${battleRecords.towerFloor}F)` : ''),
        `${battleRecords.roundInfo.current}/${battleRecords.roundInfo.total}` + (battleRecords.result !== 'Victory' ? ` (${t(`sP.${battleRecords.result}`)})` : ''),
        t(`sP.${Object.keys(difficultyMap).find(key => difficultyMap[key] === battleRecords.difficulty)}`),
        `LV: ${battleRecords.playerLevel}`,
    ].forEach(text => {
        const item = doc.createElement('span');
        item.textContent = text;
        info.appendChild(item);
    });
    summary.appendChild(info);
    if (timeRecordEl) summary.appendChild(doClone ? timeRecordEl.cloneNode(true) : timeRecordEl);

    let right = doc.createElement('div');
    right.className = 'jpx-record-detail-column';
    grid.append(left, right);
    container.append(summary, grid);
    doc.body.appendChild(container);

    [[combatRecordEl, left], [combatRecord_UseEl, left], [revenueRecordEl, right]].forEach(([el, column]) => {
        if (!el) return;
        column.appendChild(createRecordTableScroll(el, doc, doClone));
    });
    summary.append(createRecordImageActions(doc, () => container));
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
            const db = event.target.result;
            db.onversionchange = () => db.close();
            resolve(db);
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
    newWindow = window.open(new URL((isekaiSuffix ? '/isekai/' : '/') + '#jpx-records', location.origin).href);
}

function renderBattleRecordsPage(targetWindow = window) {
    if (Object.keys(cfgStats).length < 1) {
        let storedCfgStats = {};
        try {
            storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
        } catch (err) {
            console.warn('Failed to load cfgStats. Using default cfgStats.');
            storedCfgStats = {};
        }
        mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');
        delete cfgStats.darkMode;
    }

    newWindow = targetWindow;
    const doc = targetWindow.document;
    const previousImageActions = doc.querySelector('.jpx-record-image-actions');
    previousImageActions?.dispose?.(); previousImageActions?.remove();
    const filterState = targetWindow._jpxRecordsFilterState ||= { open: false, inputs: null };
    const previousFilters = doc.getElementById('filtersDiv');
    if (previousFilters) filterState.inputs = [...previousFilters.querySelectorAll('input')].map(input => ({ value: input.value, checked: input.checked }));
    filterState.cleanup?.();
    doc.head.replaceChildren();
    doc.body.replaceChildren();
    doc.body.removeAttribute('style');
    doc.title = t('sP.jpxStats');
    doc.documentElement.lang = document.documentElement.lang || 'en';
    const viewport = doc.createElement('meta');
    viewport.name = 'viewport'; viewport.content = 'width=device-width, initial-scale=1';
    doc.head.append(viewport);
    doc.head.appendChild(doc.createElement('style')).textContent = jpxThemeCSS(`
        ${JPX_SCROLLBAR_CSS}
        * { box-sizing: border-box; }
        ${JPX_RECORD_IMAGE_CSS}
        body { margin: 0; background: #edebdf; color: #392d25; font: 13px/1.45 Arial, Helvetica, sans-serif; }
        html[data-jpx-theme=dark] body { color-scheme: dark; }
        button, input { font: inherit; color: inherit; }
        button, input[type=checkbox] { cursor: pointer; }
        input { accent-color: #5c0d11; }
        :focus-visible { outline: 1px solid #9b4e03; outline-offset: -1px; box-shadow: 0 0 0 2px rgb(155 78 3 / 12%); }
        .jpx-records-page { display: flex; flex-direction: column; gap: 8px; height: 100vh; height: 100dvh; min-height: 480px; padding: 10px; }
        .jpx-records-filter-toggle { display: none; flex: none; align-self: flex-start; min-height: 40px; padding: 6px 10px; border: 1px solid #c8b49b; background: #f9f6ec; color: #5c0d11; }
        .jpx-records-filter-popup { position: fixed; inset: auto; margin: 0; padding: 0; width: min(420px, calc(100vw - 16px)); max-width: calc(100vw - 16px); border: 1px solid #c8b49b; background: #f9f6ec; color: #392d25; overflow: auto; overscroll-behavior: contain; box-shadow: 0 3px 10px rgb(36 18 15 / 16%); }
        .jpx-records-filter-popup::backdrop { background: transparent; pointer-events: none; }
        #filtersDiv { flex: none; display: grid; grid-template-columns: max-content minmax(0, 1fr) max-content max-content; align-items: center; gap: 8px 16px; border: 1px solid #c8b49b; padding: 8px 12px; background: #f9f6ec; }
        #filtersDiv > .jpx-record-image-actions { align-self: center; justify-self: end; padding-left: 16px; border-left: 1px solid #ddd0bd; }
        #filtersDiv > .jpx-record-image-actions > div { grid-auto-rows: 32px; align-items: center; }
        .jpx-records-filter-scope, .jpx-records-filter-match, .jpx-records-filter-tools { display: grid; gap: 4px; min-width: 0; }
        .jpx-records-filter-match, .jpx-records-filter-tools { padding-left: 16px; border-left: 1px solid #ddd0bd; }
        .jpx-records-filter { display: flex; align-items: center; gap: 8px; min-height: 32px; min-width: 0; max-width: 100%; }
        .jpx-records-filter-label { flex: none; color: #5c0d11; font-weight: 700; line-height: 28px; }
        .jpx-records-filter-scope .jpx-records-filter-label { flex-basis: 40px; }
        .jpx-records-filter-match .jpx-records-filter-label { flex-basis: 68px; }
        .jpx-records-filter-options { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; min-width: 0; }
        .jpx-records-filter-options label { --option-bg: #fffdf7; --option-border: #d3c5b2; position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center; min-height: 32px; padding: 4px 6px; border: 1px solid transparent; border-radius: 8px; cursor: pointer; user-select: none; touch-action: manipulation; }
        .jpx-records-filter-options label::before { content: ''; position: absolute; inset: 2px 0; z-index: -1; border: 1px solid var(--option-border); border-radius: 8px; background: var(--option-bg); pointer-events: none; }
        .jpx-records-filter-options label:has(input:checked) { --option-bg: #ead9b8; --option-border: #b49369; color: #5c0d11; }
        @media (hover: hover) { .jpx-records-filter-options label:not(:has(input:checked)):hover { --option-bg: #f0eadf; --option-border: #c1ab8c; } }
        .jpx-records-filter-options label:has(input:focus-visible)::before { outline: 1px solid #9b4e03; outline-offset: -1px; box-shadow: 0 0 0 2px rgb(155 78 3 / 12%); }
        #filtersDiv input[type=checkbox] { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; }
        .jpx-records-filter-tools .jpx-records-filter-label { flex: none; font-weight: normal; }
        .jpx-records-tools-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; min-width: 0; }
        .jpx-records-filter-tools .jpx-records-filter { flex-wrap: wrap; gap: 0 8px; }
        .jpx-records-range { display: inline-flex; align-items: center; gap: 6px; }
        #filtersDiv input[type=number] { width: 68px; min-width: 0; height: 28px; padding: 2px 5px; border: 1px solid #bda68e; border-radius: 2px; background: #fffdf7; }
        .jpx-records-table-scroll { --jpx-scrollbar-width: auto; flex: 1; min-height: 140px; min-width: 0; overflow: auto; border: 1px solid #bda68e; background: #fffdf7; overscroll-behavior: contain; }
        #battleStatsTable { border-collapse: separate; border-spacing: 0; width: max-content; min-width: 100%; font-size: 12px; font-variant-numeric: tabular-nums; }
        #battleStatsTable th, #battleStatsTable td { padding: 5px 10px; height: 30px; border-right: 1px solid #e1d7c7; border-bottom: 1px solid #e1d7c7; white-space: nowrap; text-align: left; }
        #battleStatsTable th { position: sticky; top: 0; z-index: 2; background: #e9d5ae; color: #5c0d11; font-weight: 700; }
        #battleStatsTable tr { --record-row-bg: #fffdf7; background: var(--record-row-bg); }
        #battleStatsTable tbody tr:nth-child(even) { --record-row-bg: #f5f1e7; }
        #battleStatsTable tbody tr[data-summary] { --record-row-bg: #ece6d8; font-weight: 700; }
        #battleStatsTable tbody tr:hover, #battleStatsTable tbody tr:focus-within { --record-row-bg: #f1e2c5; }
        #battleStatsTable tbody td:hover, #battleStatsTable tbody td:focus-visible { outline: 1px solid #baa080; outline-offset: -1px; }
        #battleStatsTable td.tooltip { position: relative; cursor: help; }
        #battleStatsTable .jpx-records-number { text-align: right; }
        #battleStatsTable [data-column=date] { position: sticky; left: 0; z-index: 1; background: var(--record-row-bg, #fffdf7); box-shadow: 1px 0 #c8b49b; }
        #battleStatsTable th[data-column=date] { top: 0; z-index: 3; background: #e9d5ae; }
        .jpx-records-detail { display: block; border: 0; padding: 0; background: none; color: inherit; font: inherit; text-align: left; text-decoration: underline; text-decoration-color: #bda68e; text-underline-offset: 3px; }
        .jpx-records-detail:hover { color: #5c0d11; text-decoration-color: currentColor; }
        #battleStatsTable td.tooltip:is(:hover, :focus-visible)::after { content: attr(content); position: absolute; z-index: 4; right: 0; bottom: calc(100% + 4px); width: max-content; max-width: min(420px, calc(100vw - 32px)); padding: 6px 8px; border: 1px solid #bda68e; border-radius: 2px; background: #f9f6ec; color: #5c0d11; box-shadow: 0 2px 4px #0002; font: 12px/1.5 Arial, Helvetica, sans-serif; white-space: pre-wrap; overflow-wrap: anywhere; text-align: left; pointer-events: none; }
        #battleStatsTable tr:nth-child(-n+2) td.tooltip::after { bottom: auto; top: calc(100% + 4px); }
        .jpx-records-message { margin: 0; padding: 28px 16px; text-align: center; color: #71634f; }
        @media (max-width: 1199px) {
            #filtersDiv { grid-template-columns: max-content minmax(0, 1fr) max-content; }
            .jpx-records-filter-match { grid-column: 2 / -1; }
            .jpx-records-filter-tools { grid-column: 1 / 3; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 24px; border-left: 0; border-top: 1px solid #ddd0bd; padding: 8px 0 0; }
            #filtersDiv > .jpx-record-image-actions { grid-column: 3; grid-row: 2; }
            .jpx-records-tools-row { gap: 6px 24px; }
        }
        @media (min-width: 651px) and (pointer: coarse) { #filtersDiv > .jpx-record-image-actions > div { grid-auto-rows: minmax(40px, auto); } }
        @media (max-width: 650px) {
            .jpx-records-page { padding: 6px; }
            #filtersDiv { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 8px; }
            .jpx-records-filter-match { grid-column: auto; border-left: 0; padding-left: 0; }
            .jpx-records-filter-tools { grid-column: 1 / -1; }
            .jpx-records-filter-scope .jpx-records-filter-label, .jpx-records-filter-match .jpx-records-filter-label { flex-basis: 76px; }
            .jpx-records-filter-tools, .jpx-records-tools-row { gap: 6px 12px; }
            #battleStatsTable th, #battleStatsTable td { padding: 5px 8px; }
        }
        @media (max-width: 650px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px) {
            .jpx-records-page { min-height: 0; padding: 6px; }
            .jpx-record-image-actions { right: 108px; }
            .jpx-record-image-actions > div { right: -94px; }
            .jpx-records-filter-toggle { display: flex; align-items: center; justify-content: center; min-width: 80px; position: fixed; right: 14px; bottom: max(14px, env(safe-area-inset-bottom, 0px)); z-index: 4; border-radius: 4px; box-shadow: 0 2px 6px #0002; }
            .jpx-records-filter-options label, #filter-aggregate label { min-height: 40px; }
            .jpx-records-filter-options label::before { inset-block: 4px; }
            #filtersDiv input[type=number] { height: 40px; }
            .jpx-records-table-scroll { min-height: min(140px, 35dvh); }
            .jpx-records-table-scroll::after { content: ''; display: block; height: 52px; }
        }
        .jpx-records-filter-popup #filtersDiv { min-height: 0; grid-template-columns: minmax(0, 1fr); align-content: start; gap: 6px; padding: 8px; border: 0; }
        .jpx-records-filter-popup .jpx-records-filter-match { grid-column: auto; border-left: 0; padding-left: 0; }
        .jpx-records-filter-popup .jpx-records-filter-tools { grid-column: 1 / -1; }
        .jpx-records-filter-popup .jpx-records-filter-scope .jpx-records-filter-label, .jpx-records-filter-popup .jpx-records-filter-match .jpx-records-filter-label { flex-basis: 70px; }
        .jpx-records-filter-popup .jpx-records-filter-tools, .jpx-records-filter-popup .jpx-records-tools-row { gap: 6px 12px; }
        @media (min-width: 651px) {
            .jpx-records-filter-popup { width: min(640px, calc(100vw - 16px)); }
            .jpx-records-filter-popup #filtersDiv { grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); }
            .jpx-records-filter-popup .jpx-records-filter-match { border-left: 1px solid #ddd0bd; padding-left: 12px; }
        }
    `);
    applyJpxTheme(doc);
    const page = doc.createElement('main');
    page.className = 'jpx-records-page';
    const tableRegion = doc.createElement('div');
    tableRegion.className = 'jpx-records-table-scroll';
    tableRegion.tabIndex = 0;
    tableRegion.setAttribute('role', 'region');
    tableRegion.setAttribute('aria-label', t('sP.jpxStats'));
    const message = doc.createElement('p');
    message.className = 'jpx-records-message'; message.textContent = t('sP.loadingRecords');
    tableRegion.append(message);
    let revision = 0;
    const refresh = async () => {
        const request = ++revision, filters = getFilters(targetWindow);
        tableRegion.setAttribute('aria-busy', 'true');
        try {
            const records = await getBattleRecordsRender(filters);
            if (targetWindow.closed || request !== revision) return;
            renderDynamicTable(records, cfgStats.statsColumns, tableRegion);
        } catch (error) {
            if (targetWindow.closed || request !== revision) return;
            const notice = doc.createElement('p');
            notice.className = 'jpx-records-message'; notice.textContent = t('sP.recordsError');
            tableRegion.replaceChildren(notice);
            console.error('Could not load battle records:', error);
        } finally {
            if (!targetWindow.closed && request === revision) tableRegion.setAttribute('aria-busy', 'false');
        }
    };
    filterState.refresh = refresh;
    const filters = filterState.filters || createFilter(targetWindow, () => filterState.refresh?.());
    filterState.filters = filters;
    if (filterState.inputs) [...filters.querySelectorAll('input')].forEach((input, index) => {
        const saved = filterState.inputs[index];
        if (saved) { input.value = saved.value; input.checked = saved.checked; }
    });
    // Reuse live input nodes during redraws, including a language-pack refresh.
    filters.setAttribute('aria-label', t('sP.filters'));
    for (const field of STATS_FILTERS) {
        const group = filters.querySelector('#' + field.id);
        const label = group.querySelector('.jpx-records-filter-label');
        if (label) label.textContent = t(field.label);
        if (field.type === 'checkbox') group.querySelectorAll('label').forEach(label => {
            const input = label.querySelector('input');
            for (const node of [...label.childNodes]) if (node !== input) node.remove();
            label.append(doc.createTextNode(t('sP.' + input.value)));
        });
        if (field.type === 'rangeNumber') ['min', 'max'].forEach((part, index) => group.querySelector('.range-' + part).setAttribute('aria-label', t(index ? 'sP.rangeMax' : 'sP.rangeMin')));
    }
    const filterButton = doc.createElement('button');
    filterButton.type = 'button'; filterButton.className = 'jpx-records-filter-toggle';
    filterButton.textContent = t('sP.filters') + ' ▴';
    filterButton.setAttribute('aria-label', t('sP.filters'));
    filterButton.setAttribute('aria-controls', 'jpx-records-filter-popup');
    const popup = doc.createElement('div');
    popup.id = 'jpx-records-filter-popup'; popup.className = 'jpx-records-filter-popup';
    popup.popover = 'auto'; popup.setAttribute('role', 'region'); popup.setAttribute('aria-label', t('sP.filters'));
    filterButton.popoverTargetElement = popup;
    const imageActions = createRecordImageActions(doc, () => tableRegion.querySelector('#battleStatsTable'));
    const compactFilters = targetWindow.matchMedia('(max-width: 650px), (pointer: coarse) and (orientation: landscape) and (max-height: 600px)');
    let disposed = false, changingLayout = false;
    const positionFilters = () => {
        if (disposed || !compactFilters.matches) return;
        const rect = filterButton.getBoundingClientRect(), view = targetWindow.visualViewport;
        const left = view?.offsetLeft || 0, top = view?.offsetTop || 0;
        const width = view?.width || targetWindow.innerWidth, height = view?.height || targetWindow.innerHeight;
        const popupWidth = Math.min(width > 650 ? 640 : 420, width - 16);
        const popupBottom = Math.min(top + height - 8, rect.top - 6);
        Object.assign(popup.style, { left: `${Math.max(left + 8, Math.min(rect.right - popupWidth, left + width - popupWidth - 8))}px`,
            top: 'auto', bottom: `${targetWindow.innerHeight - popupBottom}px`, width: `${popupWidth}px`, maxHeight: `${Math.max(0, popupBottom - top - 8)}px` });
    };
    const updateFilterLayout = () => {
        if (disposed) return;
        changingLayout = true;
        if (compactFilters.matches) {
            if (imageActions.parentNode !== doc.body) { imageActions.open = false; doc.body.append(imageActions); }
            if (filters.parentNode !== popup) popup.append(filters);
            positionFilters();
            if (filterState.open && !popup.matches(':popover-open')) popup.showPopover();
            else if (!filterState.open && popup.matches(':popover-open')) popup.hidePopover();
        } else {
            if (popup.matches(':popover-open')) popup.hidePopover();
            if (filters.parentNode !== page) page.prepend(filters);
            if (imageActions.parentNode !== filters) { imageActions.open = true; filters.append(imageActions); }
        }
        changingLayout = false;
        filterButton.setAttribute('aria-expanded', String(popup.matches(':popover-open')));
    };
    popup.addEventListener('beforetoggle', event => {
        if (disposed) return;
        const open = event.newState === 'open';
        if (!changingLayout) filterState.open = open;
        filterButton.setAttribute('aria-expanded', String(open));
        if (open) positionFilters();
    });
    compactFilters.addEventListener('change', updateFilterLayout);
    targetWindow.addEventListener('resize', positionFilters);
    targetWindow.visualViewport?.addEventListener('resize', positionFilters);
    targetWindow.visualViewport?.addEventListener('scroll', positionFilters);
    filterState.cleanup = () => {
        disposed = true; compactFilters.removeEventListener('change', updateFilterLayout);
        targetWindow.removeEventListener('resize', positionFilters);
        targetWindow.visualViewport?.removeEventListener('resize', positionFilters);
        targetWindow.visualViewport?.removeEventListener('scroll', positionFilters);
        if (popup.matches(':popover-open')) popup.hidePopover();
    };
    page.append(filterButton, tableRegion);
    doc.body.append(page, popup);
    updateFilterLayout();
    refresh();
}

async function getBattleRecordsRender(filters = getFilters()) {
    const db = await openDB();
    const transaction = db.transaction('battleRecords', 'readonly');
    const objectStore = transaction.objectStore('battleRecords');

    let battleRecords = [];
    let indexName = filters.aggregate ? 'date' : 'default';

    let keyRange = IDBKeyRange.bound(0, 'z');
    let source = (indexName === 'default' ? objectStore : objectStore.index(indexName));
    let i = 0;

    return new Promise(resolve => {
        const req = source.openCursor(keyRange, 'prevunique');
        req.onsuccess = function(e) {
            let cursor = e.target.result;

            if (!cursor || i >= filters.rows) {
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
    if (filters.world && !filters.world.includes(data.world)) return false;
    if (filters.battleType && !filters.battleType.includes(data.battleType)) return false;
    if (filters.difficulties && !filters.difficulties.includes(data.difficulty.toString())) return false;
    if (filters.result && !filters.result.includes(data.result)) return false;
    if (filters.roundTotal && !jpxUtils.inRange(data.roundInfo.total, filters.roundTotal)) return false;

    return data;
}

function generateAggregate(data_array, type, timestamp_name = null) { //type: Average, Total
    if (data_array.length === 0) {
        return false
    } else {
        let length = type === 'Average' ? data_array.length : 1;
        let new_data = {
            date: timestamp_name || t(`sP.${type}`),
            roundInfo: {
                current: Math.round(data_array.map(x => x.roundInfo.current).reduce((a,b) => a + b, 0) / length * 100) / 100,
                total: Math.round(data_array.map(x => x.roundInfo.total).reduce((a,b) => a + b, 0) / length * 100) / 100,
            },
            deltaSeconds: Math.round(data_array.map(x => x.deltaSeconds).reduce((a,b) => a + b, 0) / length * 1000) / 1000,
            deltaTime: '',
            turns: Math.round(data_array.map(x => x.turns).reduce((a,b) => a + b, 0) / length * 100) / 100,
            tps: 0,
            riddle: Math.round(data_array.map(x => x.riddle).reduce((a,b) => a + b, 0) / length * 100) / 100,
            combatRecords: jpxUtils.createCombatRecords(),
            revenueRecords: jpxUtils.createRevenueRecords(),
        };
        new_data.deltaTime = jpxUtils.secondsToTime(new_data.deltaSeconds, true);
        new_data.tps = Math.round(new_data.turns / new_data.deltaSeconds * 100) / 100;

        for (let i = 0; i < data_array.length; i++) {
            for (const [categoryKey, categoryValue] of Object.entries(data_array[i].combatRecords)) {
                for (const [fieldKey, fieldValue] of Object.entries(categoryValue)) {
                    jpxUtils.inc(new_data.combatRecords[categoryKey], fieldKey, fieldValue);
                }
            }
            for (const [categoryKey, categoryValue] of Object.entries(data_array[i].revenueRecords)) {
                switch (categoryKey) {
                    case ('exp'):
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
                                ['drop', 'use', 'balance'].forEach(prop => {
                                    jpxUtils.inc(new_data.revenueRecords[categoryKey][key], prop, value[prop]);
                                });
                            }
                        }
                        break;
                    case ('proficiency'):
                    case ('material'):
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
        new_data.revenueRecords.staminaCost = Math.round(new_data.revenueRecords.staminaCost * 10) / 10;
        for (const [key, value] of Object.entries(new_data.revenueRecords.proficiency)) {
            new_data.revenueRecords.proficiency[key] = Math.round(value * 1000) / 1000;
        }

        if (type === 'Average') {
            for (const [categoryKey, categoryValue] of Object.entries(new_data.combatRecords)) {
                for (const [fieldKey, fieldValue] of Object.entries(categoryValue)) {
                    new_data.combatRecords[categoryKey][fieldKey] = Math.round(fieldValue / length * 10) / 10;
                }
            }
            for (const [categoryKey, categoryValue] of Object.entries(new_data.revenueRecords)) {
                switch (categoryKey) {
                    case ('exp'):
                    case ('credit'):
                    case ('staminaCost'):
                    case ('totalProfit'):
                    case ('finalProfit'):
                        new_data.revenueRecords[categoryKey] = Math.round(categoryValue / length * 10) / 10;
                        break;
					case ('equipment'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            new_data.revenueRecords[categoryKey][key] ??= [];
							new_data.revenueRecords[categoryKey][`${key}_Avg`] = Math.round(new_data.revenueRecords[categoryKey][key].length / length * 10) / 10;
                        }
                        break;
                    case ('consumable'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                ['drop', 'use', 'balance'].forEach(prop => {
                                    new_data.revenueRecords[categoryKey][key][prop] = Math.round(value[prop] / length * 10) / 10;
                                });
                            }
                        }
                        break;
                    case ('proficiency'):
                        for (const [key, value] of Object.entries(categoryValue)) {
                            if (key != 'total' && key != 'profit') {
                                new_data.revenueRecords[categoryKey][key] = Math.round(value / length * 1000) / 1000;
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

function createFilter(targetWindow = newWindow, onChange) {
    const doc = targetWindow.document;
    let filtersDiv = doc.createElement('div');
    filtersDiv.id = 'filtersDiv';
    filtersDiv.setAttribute('role', 'group');
    filtersDiv.setAttribute('aria-label', t('sP.filters'));
    const groups = new Map();
    for (const filter of STATS_FILTERS) {
        const group = doc.createElement('div');
        group.id = filter.id; group.className = 'jpx-records-filter';
        group.setAttribute('role', 'group');
        const label = doc.createElement('span');
        label.id = filter.id + '-label';
        label.className = 'jpx-records-filter-label'; label.textContent = t(filter.label);
        if (filter.id !== 'filter-aggregate') {
            group.append(label);
            group.setAttribute('aria-labelledby', label.id);
        }
        const options = doc.createElement('div');
        options.className = 'jpx-records-filter-options';
        switch (filter.type) {
            case 'checkbox': {
                for (const opt of filter.options) {
                    let isChecked = true;
                    if (filter.id === 'filter-aggregate') isChecked = false;
                    if (filter.id === 'filter-world') isChecked = !isekaiSuffix ? opt === 'Persistent' : opt === 'Isekai';
                    const option = doc.createElement('label');
                    const input = doc.createElement('input');
                    input.type = 'checkbox'; input.value = opt; input.checked = isChecked;
                    option.append(input, doc.createTextNode(t(`sP.${opt}`)));
                    options.append(option);
                }
                break;
            }
            case 'rangeNumber': {
                options.className = 'jpx-records-range';
                for (const [index, part] of ['min', 'max'].entries()) {
                    if (index) options.append(doc.createTextNode('–'));
                    const input = doc.createElement('input');
                    input.type = 'number'; input.className = 'range-' + part; input.value = filter.value[index];
                    input.setAttribute('aria-label', t(index ? 'sP.rangeMax' : 'sP.rangeMin'));
                    options.append(input);
                }
                break;
            }
            case 'number': {
                const input = doc.createElement('input');
                input.type = 'number'; input.value = filter.value;
                input.setAttribute('aria-labelledby', label.id);
                options.append(input);
                break;
            }
        }
        group.append(options); groups.set(filter.id, group);
    }
    const scope = doc.createElement('div');
    scope.className = 'jpx-records-filter-scope';
    scope.append(groups.get('filter-world'), groups.get('filter-result'));
    const match = doc.createElement('div');
    match.className = 'jpx-records-filter-match';
    match.append(groups.get('filter-battleType'), groups.get('filter-difficulties'));
    const tools = doc.createElement('div');
    tools.className = 'jpx-records-filter-tools';
    const toolsRow = doc.createElement('div');
    toolsRow.className = 'jpx-records-tools-row';
    toolsRow.append(groups.get('filter-rows'), groups.get('filter-aggregate'));
    tools.append(groups.get('filter-roundTotal'), toolsRow);
    filtersDiv.append(scope, match, tools);
    filtersDiv.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT') {
            if (onChange) { onChange(); return; }
            getBattleRecordsRender(getFilters(targetWindow)).then(battleRecords => {
                if (!targetWindow.closed) renderDynamicTable(battleRecords, cfgStats.statsColumns, targetWindow.document.body);
            });
        }
    });

    return filtersDiv;
}

function getFilters(targetWindow = newWindow) {
    let filters = {};

    STATS_FILTERS.forEach(filter => {
        let filterEl = targetWindow.document.getElementById(filter.id);
        if (!filterEl) return;

        switch (filter.type) {
            case 'checkbox': {
                let checked = Array.from(filterEl.querySelectorAll('input:checked')).map(x => x.value);
                filters[filter.key] = filter.options.length === 1 ? !!checked.length : checked;
                break;
            }
            case 'rangeNumber': {
                filters[filter.key] = [parseInt(filterEl.querySelector('.range-min').value) ?? 0, parseInt(filterEl.querySelector('.range-max').value) ?? 9999];
                break;
            }
            case 'number': {
                filters[filter.key] = parseInt(filterEl.querySelector('input').value) ?? 0;
                break;
            }
        }
    });

    return filters;
}

function renderDynamicTable(battleRecords, displayedColumns, parent) {
    const doc = parent.ownerDocument;
    const scrollLeft = parent.scrollLeft, scrollTop = parent.scrollTop;
    parent.querySelector('#battleStatsTable')?.remove();
    parent.querySelectorAll(':scope > .jpx-records-message').forEach(node => node.remove());

    let activeFields = displayedColumns.filter(column => column.disabled !== true).map(column => {
        let baseField = STATS_FIELDS.find(f => f.id === column.id);
        return baseField ? { ...baseField, ...column } : null;
    }).filter(f => f);

    const records = battleRecords.filter(record => record && typeof record === 'object');
    if (!activeFields.length) {
        const message = doc.createElement('p');
        message.className = 'jpx-records-message';
        message.setAttribute('role', 'status');
        message.textContent = t('sP.noColumns');
        parent.append(message);
        return;
    }
    let table = doc.createElement('table');
    table.id = 'battleStatsTable';
    table.setAttribute('aria-label', t('sP.jpxStats'));

    let thead = doc.createElement('thead');
    const headerRow = doc.createElement('tr');
    for (const field of activeFields) {
        const th = doc.createElement('th');
        th.scope = 'col'; th.dataset.column = field.id;
        if (field.style) th.style.cssText = field.style;
        th.textContent = field.customName || t(field.label);
        if (STATS_THRESHOLD_FIELDS.has(field.id)) th.classList.add('jpx-records-number');
        headerRow.append(th);
    }
    thead.append(headerRow);
    table.appendChild(thead);

    let tbody = doc.createElement('tbody');

    const columnThresholds = new Map();
    const parseColorThresholds = (str) => {
        if (!str) return [];
        return str.split(',').map(s => {
            const [value, color] = s.split(':');
            return { min: parseFloat(value.trim()), color: color?.trim() };
        }).filter(thr => !isNaN(thr.min)).sort((a, b) => b.min - a.min);
    };

    for (const [index, record] of records.entries()) {
        let tr = doc.createElement('tr');
        if (index < 2 && [t('sP.Total'), t('sP.Average')].includes(record.date)) tr.dataset.summary = '';

        for (const field of activeFields) {
            let td = doc.createElement('td');
            td.dataset.column = field.id;
            let value = field.get(record);

            if (field.styleText) td.style.cssText = field.styleText;
            if (field.doI18n) value = t(`sP.${value}`);
            if (field.id === 'date') {
                const detail = doc.createElement('button');
                detail.type = 'button'; detail.className = 'jpx-records-detail';
                detail.textContent = value || '';
                detail.title = t('sP.openRecord');
                detail.setAttribute('aria-label', t('sP.openRecord') + ': ' + (value || ''));
                detail.addEventListener('click', () => {
                    jpxMarket.getMarketPrice(false).then((priceData) => {
                        newWindowRecordPlayer(
                            false,
                            record,
                            timeRecordPlayer(record),
                            combatRecordPlayer(record.combatRecords),
                            combatRecordPlayer_Use(record.combatRecords),
                            revenueRecordPlayer(record.revenueRecords, priceData)
                        );
                    });
                });
                td.append(detail);
            } else if (value && typeof value === 'object' && 'drop' in value) {
                td.classList.add('tooltip', 'jpx-records-number');
                const details = `${t('sP.drop')}: ${value.drop.toLocaleString()}\n${t('sP.use')}: ${value.use.toLocaleString()}`;
                td.setAttribute('content', details);
                td.tabIndex = 0;
                td.setAttribute('aria-label', value.balance.toLocaleString() + '; ' + details);
                td.textContent = value.balance.toLocaleString();
            } else if (typeof value === 'number') {
                td.classList.add('jpx-records-number');
                td.textContent = value.toLocaleString();

                if (field.colorThresholds) {
                    let thresholds = columnThresholds.get(field);
                    if (!thresholds) {
                        thresholds = parseColorThresholds(field.colorThresholds);
                        columnThresholds.set(field, thresholds);
                    }
                    let match = thresholds.find(thr => value >= thr.min);
                    if (match) td.style.color = match.color;
                }
            } else {
                td.textContent = value || '';
            }

            const equipment = record.revenueRecords?.equipment?.[field.equipmentQuality];
            if (field.equipmentQuality && Array.isArray(equipment) && equipment.length) {
                const names = equipment.filter(name => typeof name === 'string' && name.trim()).join('\n');
                if (names) {
                    td.classList.add('tooltip');
                    td.setAttribute('content', names);
                    td.tabIndex = 0;
                    td.setAttribute('aria-label', td.textContent + '; ' + names);
                }
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    parent.appendChild(table);
    if (!records.length) {
        const message = doc.createElement('p');
        message.className = 'jpx-records-message'; message.setAttribute('role', 'status');
        message.textContent = t('sP.noRecords'); parent.append(message);
    }
    parent.scrollLeft = scrollLeft; parent.scrollTop = scrollTop;
}

//Settings
let settingsEditHistory = null;
let statsSettingsView = { section: 'combatRows', fields: {} };
let battleRulesView = { section: 'supports', scroll: {} };
const settingsChangeBindings = new WeakMap();

// List scroll belongs to the dialog view, never to saved/exported statistics configuration.
function captureStatsListScroll(container) {
    container?.querySelectorAll('.jpx-stats-list[data-stats-field]').forEach(list => {
        const view = statsSettingsView.fields[list.dataset.statsField];
        if (view && list.isConnected && list.getClientRects().length) view.scrollTop = list.scrollTop;
    });
}

function restoreStatsListScroll(container) {
    container?.querySelectorAll('.jpx-stats-list[data-stats-field]').forEach(list => {
        const view = statsSettingsView.fields[list.dataset.statsField];
        if (view && list.isConnected && list.getClientRects().length) list.scrollTop = view.scrollTop || 0;
    });
}

// Bind actual configuration values, not input text or transient editor state.
function bindSettingsChange(element, data, key, badgeTarget = element, item = false) {
    element.dataset.jpxChangeBound = '';
    settingsChangeBindings.set(element, { data, key, badgeTarget, item });
}

function createSettingsChangeTracker(container, readData) {
    const identities = new WeakMap();
    let nextIdentity = 0;
    const roots = () => ({ battle: cfgBattle, shortcuts: userKeybinds, stats: cfgStats });
    const identity = item => {
        if (item.id !== undefined) return `field:${item.id}`;
        if (!identities.has(item)) identities.set(item, ++nextIdentity);
        return identities.get(item);
    };
    // Sidecar identities survive undo/redo without adding metadata to saved/exported configuration.
    function captureIdentities() {
        const result = {};
        function visit(value, path, entries) {
            if (!value || typeof value !== 'object') return;
            Object.entries(value).forEach(([key, child]) => {
                const childPath = [...path, key];
                if (Array.isArray(value) && child && typeof child === 'object') entries.push([childPath, identity(child)]);
                visit(child, childPath, entries);
            });
        }
        Object.entries(roots()).forEach(([scope, value]) => { result[scope] = []; visit(value, [], result[scope]); });
        return result;
    }
    function restoreIdentities(data, snapshot, scopes = Object.keys(data)) {
        scopes.forEach(scope => (snapshot[scope] || []).forEach(([path, id]) => {
            const item = path.reduce((value, key) => value?.[key], data[scope]);
            if (item && typeof item === 'object') identities.set(item, id);
        }));
    }
    const saved = {};
    function save(scopes, initial = false) {
        const data = readData(), ids = captureIdentities();
        scopes.forEach(scope => { saved[scope] = JSON.parse(data[scope]); });
        restoreIdentities(saved, ids, scopes);
        if (!initial) refresh();
    }
    // Empty containers materialized by the legacy renderer are equivalent to missing containers.
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined) return b && typeof b === 'object' && Object.entries(b).every(([key, value]) =>
            !key.startsWith('kb_') && equal(undefined, value));
        if (b === undefined) return equal(b, a);
        if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
        if (Array.isArray(a) && a.length !== b.length) return false;
        return [...new Set([...Object.keys(a), ...Object.keys(b)])].every(key =>
            (!key.startsWith('kb_') || (key in a) === (key in b)) && equal(a[key], b[key]));
    }
    function refresh() {
        const matches = new WeakMap();
        function match(current, baseline, moved = false) {
            if (!current || typeof current !== 'object') return;
            matches.set(current, { baseline, moved });
            if (Array.isArray(current)) {
                const old = Array.isArray(baseline) ? baseline : [];
                const oldById = new Map(old.filter(v => v && typeof v === 'object').map(v => [identity(v), v]));
                // Imports/reset recreate objects. Reuse unchanged entries first, then same-kind
                // replacements at the same position; copies cannot claim an identity still in use.
                const objects = current.filter(v => v && typeof v === 'object');
                const claimed = new Set(objects.map(identity).filter(id => oldById.has(id)));
                const adopt = (value, previous) => {
                    const id = identity(previous);
                    identities.set(value, id);
                    claimed.add(id);
                };
                objects.filter(value => value.id === undefined && !oldById.has(identity(value))).forEach(value => {
                    const previous = old.find(entry => entry && typeof entry === 'object' && !claimed.has(identity(entry)) && equal(value, entry));
                    if (previous) adopt(value, previous);
                });
                current.forEach((value, index) => {
                    if (!value || typeof value !== 'object' || value.id !== undefined || oldById.has(identity(value))) return;
                    const previous = old[index];
                    const kind = value.type ? 'type' : value.key ? 'key' : null;
                    if (kind && previous && !claimed.has(identity(previous)) && value[kind] === previous[kind] && value.name === previous.name) adopt(value, previous);
                });
                const currentIds = current.filter(v => v && typeof v === 'object').map(identity);
                const currentIdSet = new Set(currentIds);
                const oldCommon = old.filter(v => v && typeof v === 'object' && currentIdSet.has(identity(v))).map(identity);
                const currentCommon = currentIds.filter(id => oldById.has(id));
                const unchanged = equal(current, old);
                current.forEach((value, index) => {
                    if (!value || typeof value !== 'object') return;
                    const id = identity(value);
                    match(value, unchanged ? old[index] : oldById.get(id),
                        !unchanged && oldById.has(id) && oldCommon.indexOf(id) !== currentCommon.indexOf(id));
                });
            } else Object.entries(current).forEach(([key, value]) => match(value, baseline?.[key]));
        }
        Object.entries(roots()).forEach(([scope, value]) => match(value, saved[scope]));
        container.querySelectorAll('[data-jpx-change-bound]').forEach(element => {
            const binding = settingsChangeBindings.get(element);
            if (!binding) return;
            const { data, key, item, badgeTarget } = binding;
            const info = matches.get(data);
            let state = '';
            if (info) {
                if (item) state = info.baseline === undefined ? 'added' : !equal(data, info.baseline) || info.moved ? 'modified' : '';
                else {
                    const read = typeof key === 'function' ? key : value => value?.[key];
                    if (typeof key === 'string' && key.startsWith('kb_') && !(key in (info.baseline || {}))) state = 'added';
                    else if (!equal(read(data), read(info.baseline))) state = 'modified';
                }
            }
            // A new row carries one color marker; its default fields need no repeated highlighting.
            if (element.parentElement?.closest('[data-change-state=added], .dynamic-array-row')) state = '';
            let badge = [...badgeTarget.children].find(child => child.classList.contains('jpx-change-badge'));
            if (state) {
                element.dataset.changeState = state;
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'jpx-change-badge jpx-sr-only';
                    badgeTarget.append(badge);
                }
                const label = t(state === 'added' ? 'cGen.unsavedAdded' : 'cGen.unsavedModified');
                if (badge.textContent !== label) badge.textContent = label;
                badge.title = t('cGen.unsavedChange');
                badge.dataset.state = state;
            } else {
                delete element.dataset.changeState;
                badge?.remove();
            }
        });
    }
    save(['battle', 'shortcuts', 'stats'], true);
    // Shortcut edits take effect immediately and survive closing the dialog in the legacy UI.
    // Compare those to persistence so reopening cannot silently label an unsaved binding clean.
    try { saved.shortcuts = JSON.parse(localStorage.getItem(prefix + 'userKeybinds' + isekaiSuffix)) || { ...KEYBINDS }; }
    catch { saved.shortcuts = { ...KEYBINDS }; }
    // Navigation can rebuild an editor without changing data (for example selecting a stats row).
    const observer = new MutationObserver(records => {
        // Text captions, previews and disclosure icons are view updates. Only
        // rebuilding bound fields requires scanning configuration badges again.
        if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
            node.nodeType === 1 && (node.matches('[data-jpx-change-bound]') || node.querySelector('[data-jpx-change-bound]'))))) refresh();
    });
    observer.observe(container, { childList: true, subtree: true });
    return { refresh, save, captureIdentities, restore: (snapshot, scopes) => restoreIdentities(roots(), snapshot, scopes), dispose: () => observer.disconnect() };
}

// Editing history is scoped to one open dialog. Persistence remains an explicit save action.
function createSettingsEditHistory(container, toolbar, restoreView) {
    const entries = [];
    let position = 0;
    let disposed = false;
    let restoring = false;
    let mergeKey = null;
    let lastEditTime = 0;
    let colorEdit = null;
    const pendingInputs = new WeakMap();
    const scopes = ['battle', 'shortcuts', 'stats'];

    function readData() {
        // Merely visiting an empty mode materializes empty arrays in the legacy renderer.
        // Treat absent and empty modes alike, so navigation never marks the configuration dirty.
        const battle = { ...cfgBattle };
        BATTLE_MODES.forEach(key => {
            const mode = battle[key];
            if (mode && Object.entries(mode).every(([name, value]) =>
                (name === 'supports' || name === 'attacks') && Array.isArray(value) && !value.length)) delete battle[key];
        });
        return { battle: JSON.stringify(battle), shortcuts: JSON.stringify(userKeybinds), stats: JSON.stringify(cfgStats) };
    }
    function capture() {
        captureStatsListScroll(container);
        const activeRules = container.querySelector('.jpx-rule-section:not([hidden])');
        const mode = container.querySelector('[data-role=battleMode]')?.dataset.currentValue;
        if (activeRules?.getClientRects().length) battleRulesView.scroll[`${mode}:${activeRules.dataset.fieldKey}`] = activeRules.querySelector('.jpx-rule-scroll').scrollTop;
        const expanded = [];
        const visit = (value, path) => {
            if (!value || typeof value !== 'object') return;
            if (fieldRenderers.expandedRuleItems.has(value)) expanded.push(path);
            Object.entries(value).forEach(([key, child]) => visit(child, [...path, key]));
        };
        visit(cfgBattle, []);
        return { data: readData(), identities: changes.captureIdentities(), view: {
            tab: container.querySelector('[role=tab][aria-selected=true]')?.id.slice(4) || 'battle',
            mode: container.querySelector('[data-role=battleMode]')?.dataset.currentValue,
            scroll: [...container.querySelectorAll('[role=tabpanel]')].map(panel => [panel.id, panel.scrollTop]),
            expanded,
            stats: JSON.parse(JSON.stringify(statsSettingsView)),
            rules: JSON.parse(JSON.stringify(battleRulesView)),
        } };
    }
    const buttons = document.createElement('div');
    buttons.className = 'jpx-history-buttons';
    toolbar.prepend(buttons);
    const undoButton = jpxUtils.createButton(buttons, { id: 'undo-settings-button', history: false, onClick: () => undo() });
    const redoButton = jpxUtils.createButton(buttons, { id: 'redo-settings-button', history: false, onClick: () => redo() });
    for (const [button, name] of [[undoButton, 'undo'], [redoButton, 'redo']]) {
        const label = document.createElement('span');
        label.className = 'jpx-history-label';
        label.textContent = t(`cGen.${name}`);
        button.append(createSettingsIcon(name), label);
        button.setAttribute('aria-label', t(`cGen.${name}`));
    }
    const changes = createSettingsChangeTracker(container, readData);
    function update() {
        if (disposed) return;
        changes.refresh();
        undoButton.disabled = position === 0;
        redoButton.disabled = position === entries.length;
        undoButton.title = position ? t('cGen.undoAction', { label: entries[position - 1].label }) + ' (Ctrl+Z)' : t('cGen.undoEmpty');
        redoButton.title = position < entries.length ? t('cGen.redoAction', { label: entries[position].label }) + ' (Ctrl+Y / Ctrl+Shift+Z)' : t('cGen.redoEmpty');
    }
    function finish(before, label, typingKey = null) {
        if (disposed || restoring || !before) return;
        const after = capture();
        const changed = scopes.filter(key => before.data[key] !== after.data[key]);
        if (!changed.length) return;
        const previous = entries[position - 1];
        if (typingKey && typingKey === mergeKey && position === entries.length && previous && Date.now() - lastEditTime < 900) {
            previous.after = after;
            previous.changed = scopes.filter(key => previous.before.data[key] !== after.data[key]);
            if (!previous.changed.length) { entries.pop(); position--; }
        } else {
            entries.splice(position);
            entries.push({ before, after, changed, label });
            if (entries.length > 60) entries.shift();
            position = entries.length;
        }
        mergeKey = typingKey;
        lastEditTime = Date.now();
        update();
    }
    // Native color pickers and range sliders stream input events while dragging. Snapshot once per gesture,
    // keeping live model/preview updates separate from the expensive full-dialog history scan.
    function flushColorEdit() {
        if (!colorEdit) return;
        const pending = colorEdit;
        colorEdit = null;
        finish(pending.before, pending.label);
        // A picker may return to its starting color, leaving no history entry to update buttons.
        undoButton.disabled = position === 0;
        redoButton.disabled = position === entries.length;
    }
    function run(label, action) {
        if (disposed || restoring) return action();
        flushColorEdit();
        mergeKey = null;
        const before = capture();
        try { return action(); }
        finally { finish(before, label); }
    }
    function apply(entry, snapshot) {
        restoring = true;
        mergeKey = null;
        fieldRenderers.dragState.cancel?.();
        jpxUtils.keyCaptureController?.abort();
        try {
            if (entry.changed.includes('battle')) cfgBattle = JSON.parse(snapshot.data.battle);
            if (entry.changed.includes('shortcuts')) userKeybinds = JSON.parse(snapshot.data.shortcuts);
            if (entry.changed.includes('stats')) cfgStats = JSON.parse(snapshot.data.stats);
            changes.restore(snapshot.identities, entry.changed);
            statsSettingsView = JSON.parse(JSON.stringify(snapshot.view.stats || { section: 'combatRows', fields: {} }));
            battleRulesView = snapshot.view.rules || { section: 'supports', scroll: {} };
            fieldRenderers.expandedRuleItems = new WeakSet();
            snapshot.view.expanded.forEach(path => {
                const item = path.reduce((value, key) => value?.[key], cfgBattle);
                if (item && typeof item === 'object') fieldRenderers.expandedRuleItems.add(item);
            });
            restoreView(snapshot.view);
        } finally {
            restoring = false;
            update();
        }
    }
    function undo() {
        flushColorEdit();
        if (position > 0) { const entry = entries[--position]; apply(entry, entry.before); }
    }
    function redo() {
        flushColorEdit();
        if (position < entries.length) { const entry = entries[position++]; apply(entry, entry.after); }
    }
    function beforeInput(event) {
        if (restoring || event.target.closest('.jpx-battle-mode-selects')) return;
        if (event.target.matches?.('input[type=color], input[type=range]')) {
            if (colorEdit?.target !== event.target) flushColorEdit();
            if (!colorEdit) {
                colorEdit = { target: event.target, before: capture(),
                    label: event.target.getAttribute('aria-label') || event.target.labels?.[0]?.textContent.trim() || t('cGen.configEdit') };
            }
            return;
        }
        flushColorEdit();
        pendingInputs.set(event, capture());
    }
    function afterInput(event) {
        const target = event.target;
        if (!target.matches?.('input, textarea, select')) return;
        if (target.matches('input[type=color], input[type=range]')) {
            if (event.type === 'change') flushColorEdit();
            else if (colorEdit) {
                undoButton.disabled = false;
                redoButton.disabled = true;
            }
            return;
        }
        const label = target.getAttribute('aria-label') || target.labels?.[0]?.textContent.trim() || target.closest('[data-edit-label]')?.dataset.editLabel || t('cGen.configEdit');
        finish(pendingInputs.get(event), label, event.type === 'input' && target.matches('input:not([type=checkbox]), textarea') ? target.id : null);
        pendingInputs.delete(event);
    }
    const endTyping = () => { flushColorEdit(); mergeKey = null; };
    const beforeAction = event => { if (colorEdit && event.target !== colorEdit.target) flushColorEdit(); };
    function onKeyDown(event) {
        beforeAction(event);
        if (jpxUtils.keyCaptureController || event.isComposing || !(event.ctrlKey || event.metaKey) || event.altKey) return;
        if (event.target.closest('input, textarea, [contenteditable=true]')) return;
        const key = event.key.toLowerCase();
        if (key !== 'z' && key !== 'y') return;
        event.preventDefault();
        event.stopPropagation();
        if (key === 'y' || event.shiftKey) redo();
        else undo();
    }
    ['input', 'change'].forEach(type => {
        container.addEventListener(type, beforeInput, true);
        container.addEventListener(type, afterInput);
    });
    container.addEventListener('focusout', endTyping);
    container.addEventListener('pointerdown', beforeAction, true);
    container.addEventListener('click', beforeAction, true);
    container.addEventListener('keydown', onKeyDown, true);
    update();
    return {
        run,
        flushColorEdit,
        markSaved: scopes => { flushColorEdit(); changes.save(scopes); },
        breakTypingGroup: endTyping,
        dispose() {
            flushColorEdit();
            disposed = true;
            changes.dispose();
            entries.length = 0;
            ['input', 'change'].forEach(type => {
                container.removeEventListener(type, beforeInput, true);
                container.removeEventListener(type, afterInput);
            });
            container.removeEventListener('focusout', endTyping);
            container.removeEventListener('pointerdown', beforeAction, true);
            container.removeEventListener('click', beforeAction, true);
            container.removeEventListener('keydown', onKeyDown, true);
        },
    };
}

function getBattleMode(defaultBattleStyle = 'Unarmed') {
    let modeKey = `${battleStyle || defaultBattleStyle}_${battleType}`;

    if (!jpxUtils.isEmpty(cfgBattle[modeKey])) {
        const isValid = value => Array.isArray(value) && value.length > 0;
        if (
            isValid(cfgBattle[modeKey].supports) || isValid(cfgBattle[modeKey].attacks) ||
            Object.entries(cfgBattle[modeKey]).some(([key, value]) => key.startsWith('kb_') && isValid(value))
        ) {
            return modeKey;
        }
    }

    return `${battleStyle || defaultBattleStyle}_General`;
}

function renderSchema(container, schema, data) {
    container.innerHTML = '';

    if (schema.type === 'object') {
        schema.properties.forEach(field => {
            let fieldDiv = document.createElement('div');
            fieldDiv.className = 'field-block';
            fieldDiv.dataset.fieldKey = field.key;
            fieldDiv.dataset.fieldType = field.type;
            renderField(fieldDiv, field, data);
            container.appendChild(fieldDiv);
        });
    }
}

function renderBattleRuleSections(container, schema, data, mode) {
    container.className = 'jpx-rule-sections';
    const navigation = document.createElement('div');
    navigation.className = 'jpx-rule-navigation';
    const nav = document.createElement('div');
    nav.className = 'jpx-rule-section-tabs';
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-label', t('cB.battleRules'));
    const controls = document.createElement('div');
    controls.className = 'jpx-rule-section-controls';
    navigation.append(nav, controls);
    const sections = new Map();
    const select = key => {
        fieldRenderers.dragState.cancel?.();
        jpxUtils.keyCaptureController?.abort();
        container.querySelectorAll('.jpx-rule-sort-popover:popover-open').forEach(menu => menu.hidePopover());
        container.querySelectorAll('.multiSelect-popup-panel').forEach(panel => panel.style.display = 'none');
        container.querySelectorAll('.multiSelect-summary').forEach(button => button.setAttribute('aria-expanded', 'false'));
        battleRulesView.section = key;
        sections.forEach(({ panel, button, scroll, toolbar }, id) => {
            const selected = id === key;
            if (!panel.hidden && panel.isConnected) battleRulesView.scroll[`${mode}:${id}`] = scroll.scrollTop;
            panel.hidden = !selected;
            button.setAttribute('aria-pressed', String(selected));
            button.tabIndex = selected ? 0 : -1;
            if (selected) {
                controls.replaceChildren(...(toolbar ? [toolbar] : []));
                const top = battleRulesView.scroll[`${mode}:${id}`] || 0;
                requestAnimationFrame(() => {
                    if (panel.isConnected && !panel.hidden) scroll.scrollTop = top;
                });
            }
        });
    };
    ['supports', 'attacks', 'keyBindings'].forEach(key => {
        const field = schema.properties.find(field => field.key === key);
        const label = key === 'keyBindings' ? 'cB.keyRules' : key === 'attacks' ? 'cB.attackRules' : field.label;
        const button = jpxUtils.createButton(nav, { text: t(label), history: false, onClick: () => select(key) });
        button.dataset.ruleSection = key;
        button.id = `jpx-rule-section-${key}`;
        bindSettingsChange(button, data, key === 'keyBindings'
            ? value => Object.fromEntries(Object.entries(value || {}).filter(([name]) => name.startsWith('kb_')))
            : key);
        const panel = document.createElement('section');
        panel.className = 'field-block jpx-rule-section';
        panel.dataset.fieldKey = key;
        panel.dataset.fieldType = field.type;
        panel.id = `jpx-rule-panel-${key}`;
        panel.hidden = true;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', button.id);
        button.setAttribute('aria-controls', panel.id);
        renderField(panel, { ...field, fixedActions: true }, data);
        const heading = panel.querySelector(':scope > .heading');
        const toolbar = heading?.querySelector('.jpx-rule-list-toolbar');
        if (heading) heading.hidden = true;
        const scroll = panel.querySelector(':scope > .jpx-rule-scroll');
        scroll.addEventListener('scroll', () => {
            if (!panel.hidden) battleRulesView.scroll[`${mode}:${key}`] = scroll.scrollTop;
        });
        sections.set(key, { panel, button, scroll, toolbar });
    });
    nav.addEventListener('keydown', event => {
        const keys = [...sections.keys()];
        const index = keys.indexOf(event.target.closest('[data-rule-section]')?.dataset.ruleSection);
        if (index < 0) return;
        const next = { ArrowLeft: (index + keys.length - 1) % keys.length, ArrowRight: (index + 1) % keys.length, Home: 0, End: keys.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select(keys[next]);
        sections.get(keys[next]).button.focus({ preventScroll: true });
    });
    container.replaceChildren(navigation, ...[...sections.values()].map(section => section.panel));
    select(sections.has(battleRulesView.section) ? battleRulesView.section : 'supports');
}

// Small static SVGs keep the userscript self-contained and inherit the HV palette.
// Chromium dismisses a native picker before delivering a second click to its input,
// then the click's default action opens it again. Remember the observed :open state
// only while the popup is actually present, and suppress that one reopening click.
function bindSettingsNativePickers(container) {
    if (!CSS.supports('selector(input:open)')) return () => {};
    let watched = null, opened = null, suppress = null, frame = 0, pendingFrames = 0;
    const pickerFor = target => {
        if (!(target instanceof Element)) return null;
        const input = target.closest('input') || target.closest('label')?.control;
        return input && container.contains(input) && input.matches('input[type=color], input[type=time]') ? input : null;
    };
    const stop = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        watched = opened = null;
    };
    const sample = () => {
        frame = 0;
        if (!watched?.isConnected || !container.open) { stop(); return; }
        if (watched.matches(':open')) {
            opened = watched;
            pendingFrames = 2;
        } else {
            opened = null;
            if (--pendingFrames <= 0) { stop(); return; }
        }
        frame = requestAnimationFrame(sample);
    };
    const watch = input => {
        watched = input;
        pendingFrames = 2;
        if (!frame) frame = requestAnimationFrame(sample);
    };
    const onPointerDown = event => {
        suppress = null;
        if (event.button !== 0) return;
        const input = pickerFor(event.target);
        if (!input) { stop(); return; }
        if (opened === input || input.matches(':open')) {
            suppress = input;
            event.preventDefault();
            // Some engines deliver pointerdown before dismissing the native popup.
            if (input.matches(':open')) {
                const type = input.type, value = input.value;
                input.type = 'text';
                input.type = type;
                input.value = value;
            }
            opened = null;
        }
        watch(input);
    };
    const onClick = event => {
        const input = pickerFor(event.target);
        if (input && input === suppress) {
            event.preventDefault();
            suppress = null;
            settingsEditHistory?.flushColorEdit();
        } else if (input) watch(input);
    };
    const onKeyDown = event => {
        const input = pickerFor(event.target);
        if (input) watch(input);
    };
    container.addEventListener('pointerdown', onPointerDown, true);
    container.addEventListener('click', onClick, true);
    container.addEventListener('keydown', onKeyDown, true);
    return () => {
        stop();
        container.removeEventListener('pointerdown', onPointerDown, true);
        container.removeEventListener('click', onClick, true);
        container.removeEventListener('keydown', onKeyDown, true);
    };
}

function createSettingsIcon(name) {
    const paths = {
        battle: 'M4 21v-7m0-4V3m8 18v-4m0-4V3m8 18V10m0-4V3M1 14h6m2-1h6m2-3h6',
        battleRules: 'M9 5h12M9 12h12M9 19h12M3 4l1 1 2-2M3 11l1 1 2-2M3 18l1 1 2-2',
        keyBindings: 'M7 4v16M17 4v16M4 7h16M4 17h16M9 4v3m6-3v3M9 17v3m6-3v3',
        stats: 'M4 3v18h17M9 17v-6m5 6V7m5 10V4',
        plugin: 'M8 3v4m8-4v4M5 7h14v3a7 7 0 0 1-14 0V7m7 10v4',
        edit: 'M14 4l5 5M4 18l5-1L20 6a2.8 2.8 0 0 0-4-4L5 13l-1 5M3 22h18',
        confirm: 'M5 12l4 4L19 6',
        collapse: 'M9 3v18M15 9l-3 3 3 3',
        expand: 'M9 3v18m4-12 3 3-3 3',
        collapseRules: 'M7 16l5-5 5 5M7 8l5-5 5 5',
        expandRules: 'M7 8l5 5 5-5M7 16l5 5 5-5',
        up: 'M12 20V4m-6 6 6-6 6 6',
        down: 'M12 4v16m-6-6 6 6 6-6',
        sort: 'M7 3v18m-3-3 3 3 3-3M14 5h7M14 11h5M14 17h3',
        ruleEnabled: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M8 12l3 3 5-6',
        ruleDisabled: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M8 12h8',
        delete: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
        undo: 'M3 4v6h6M3 10l5-5a8 8 0 1 1-1 12',
        redo: 'M21 4v6h-6m6 0-5-5a8 8 0 1 0 1 12',
    };
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.8');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('focusable', 'false');
    if (name === 'grip') {
        icon.setAttribute('fill', 'currentColor');
        icon.setAttribute('stroke', 'none');
        for (const x of [8, 16]) for (const y of [5, 12, 19]) {
            const dot = document.createElementNS(icon.namespaceURI, 'circle');
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', '1.7');
            icon.appendChild(dot);
        }
        return icon;
    }
    const path = document.createElementNS(icon.namespaceURI, 'path');
    path.setAttribute('d', paths[name]);
    icon.appendChild(path);
    return icon;
}

function createSettingsMoveButtons(parent, index, count, move) {
    const actions = document.createElement('div');
    actions.className = 'jpx-rule-sort-actions';
    parent.append(actions);
    for (const [step, icon, key] of [[-1, 'up', 'moveUp'], [1, 'down', 'moveDown']]) {
        jpxUtils.createButton(actions, { icon, text: t(`cGen.${key}`), className: `jpx-rule-${icon}`,
            disabled: index + step < 0 || index + step >= count, history: false,
            onClick: () => move(index + step, `.jpx-rule-${icon}:not(:disabled)`) });
    }
    return actions;
}

// Fixed descendants of the scaled mobile dialog use its local CSS coordinates.
function getSettingsCoordinateSpace(element) {
    const dialog = element.closest('#settings-container.jpx-settings-mobile');
    if (!dialog) return { left: 0, top: 0, scale: 1 };
    const rect = dialog.getBoundingClientRect();
    return { left: rect.left, top: rect.top, scale: parseFloat(dialog.style.getPropertyValue('--settings-scale')) || 1 };
}

function positionSettingsMultiSelect(summary) {
    const wrap = summary.parentElement, panel = wrap.querySelector('.multiSelect-popup-panel');
    if (!panel || panel.style.display === 'none') return;
    // Local offsets also follow the mobile dialog's scale and wrapped rows.
    panel.style.left = `${Math.max(0, Math.min(summary.offsetLeft, wrap.clientWidth - panel.offsetWidth))}px`;
    panel.style.top = `${summary.offsetTop + summary.offsetHeight}px`;
}

function positionSettingsPopover(anchor, menu) {
    const rect = anchor.getBoundingClientRect();
    const { scale } = getSettingsCoordinateSpace(anchor);
    const view = window.visualViewport;
    const left = view?.offsetLeft || 0, top = view?.offsetTop || 0;
    const right = left + (view?.width || innerWidth), bottom = top + (view?.height || innerHeight);
    const margin = 8 * scale, gap = 4 * scale;
    // Top-layer popovers do not inherit their parent's transform.
    menu.style.transformOrigin = 'top left';
    menu.style.transform = `scale(${scale})`;
    menu.style.maxWidth = `${Math.max(0, (right - left - margin * 2) / scale)}px`;
    const below = bottom - rect.bottom - margin - gap, above = rect.top - top - margin - gap;
    menu.style.maxHeight = `${Math.max(0, Math.max(below, above)) / scale}px`;
    const size = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(left + margin, Math.min(rect.right - size.width, right - size.width - margin))}px`;
    menu.style.top = `${Math.max(top + margin, size.height <= below ? rect.bottom + gap : rect.top - size.height - gap)}px`;
}

function openRuleSortMenu(anchor, index, count, move) {
    const current = anchor.closest('.array-row').querySelector('.jpx-rule-sort-popover');
    if (current?.matches(':popover-open')) { current.hidePopover(); return; }
    document.querySelectorAll('.jpx-rule-sort-popover:popover-open').forEach(menu => menu.hidePopover());
    const menu = document.createElement('div');
    menu.className = 'jpx-rule-sort-popover';
    menu.id = getUniqueId('ruleSort');
    menu.popover = 'auto';
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', t('cGen.reorderRules'));
    const label = document.createElement('label');
    label.textContent = t('cGen.moveToPosition');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = String(count);
    input.step = '1';
    input.required = true;
    input.value = String(index + 1);
    input.setAttribute('aria-label', t('cGen.rulePosition'));
    const total = document.createElement('span');
    total.textContent = `/ ${count}`;
    label.append(input, total);
    const apply = () => {
        if (!input.reportValidity()) return;
        menu.hidePopover();
        move(input.valueAsNumber - 1);
    };
    jpxUtils.createButton(label, { text: t('cGen.moveApply'), history: false, onClick: apply });
    const presets = document.createElement('div');
    presets.className = 'jpx-rule-sort-presets';
    for (const [key, destination] of [['moveTop', 0], ['moveBottom', count - 1]]) {
        jpxUtils.createButton(presets, { text: t(`cGen.${key}`), disabled: index === destination, history: false,
            onClick: () => { menu.hidePopover(); move(destination); } });
    }
    input.addEventListener('keydown', event => {
        if (event.key === 'Enter') { event.preventDefault(); apply(); }
    });
    menu.addEventListener('toggle', event => {
        if (event.newState === 'closed') {
            if (anchor.getAttribute('aria-controls') === menu.id) {
                anchor.setAttribute('aria-expanded', 'false');
                anchor.removeAttribute('aria-controls');
                anchor.popoverTargetElement = null;
            }
            menu.remove();
        }
    });
    menu.append(label, presets);
    anchor.closest('.array-row').append(menu);
    anchor.setAttribute('aria-controls', menu.id);
    anchor.setAttribute('aria-expanded', 'true');
    // Keep the trigger inside the popover's light-dismiss boundary.
    anchor.popoverTargetElement = menu;
    menu.showPopover();
    positionSettingsPopover(anchor, menu);
    input.focus({ preventScroll: true });
    input.select();
}

// Transient row metadata belongs to this dialog, not to the runtime's selected-row array.
let controlPanelEditorState = null;

// Preserve unrelated legacy declarations, including values this browser does not recognize.
function setControlPanelStyleProperty(css, property, value, priority) {
    const chunks = [];
    let start = 0, depth = 0, quote = '', comment = false;
    for (let index = 0; index < css.length; index++) {
        const char = css[index], next = css[index + 1];
        if (comment) { if (char === '*' && next === '/') { comment = false; index++; } continue; }
        if (quote) {
            if (char === '\\') index++;
            else if (char === quote) quote = '';
            continue;
        }
        if (char === '/' && next === '*') { comment = true; index++; continue; }
        if (char === '"' || char === "'") { quote = char; continue; }
        if ('([{'.includes(char)) depth++;
        else if (')]}'.includes(char)) depth = Math.max(0, depth - 1);
        else if (char === ';' && depth === 0) { chunks.push(css.slice(start, index + 1)); start = index + 1; }
    }
    chunks.push(css.slice(start));
    let found = false;
    const replacement = value + (priority ? ' !important' : '');
    const result = chunks.map(chunk => {
        const match = chunk.match(/^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)([\w-]+)(\s*:)/);
        if (!match || match[2].toLowerCase() !== property) return chunk;
        found = true;
        return match[0] + ' ' + replacement + (chunk.endsWith(';') ? ';' : '');
    }).join('');
    return found ? result : result + (result.trim() && !result.trimEnd().endsWith(';') ? ';' : '') +
        (result ? ' ' : '') + property + ': ' + replacement + ';';
}

function renderControlPanelSettings(container, field, data) {
    if (!settingsEditHistory || !controlPanelEditorState ||
        (controlPanelEditorState.history && controlPanelEditorState.history !== settingsEditHistory)) {
        controlPanelEditorState = { history: settingsEditHistory, retained: new Map(), selected: null, previewState: 'manual' };
    }
    const state = controlPanelEditorState;
    state.history = settingsEditHistory;
    const element = (tag, className, text) => {
        const el = document.createElement(tag);
        el.className = className;
        if (text) el.textContent = text;
        return el;
    };
    container.classList.add('jpx-settings-group');
    const title = element('h3', 'heading', t(field.label));
    title.id = getUniqueId('controlPanel');
    container.setAttribute('role', 'group');
    container.setAttribute('aria-labelledby', title.id);
    const layout = element('div', 'jpx-control-panel-editor');
    const rowsPane = element('div', '');
    const appearance = element('div', 'jpx-control-appearance');
    layout.append(rowsPane, appearance);
    container.append(title, layout);
    const updatePreview = renderControlPanelAppearance(appearance, data, state, element);
    renderControlPanelRows(rowsPane, data, state, element, updatePreview);
}

function renderControlPanelAppearance(container, data, state, element) {
    const heading = element('div', 'jpx-control-heading');
    heading.append(element('strong', '', t('cB.panelAppearance')));
    const states = element('div', 'jpx-control-preview-states');
    states.setAttribute('role', 'group');
    states.setAttribute('aria-label', t('cB.panelPreview'));
    const stateKeys = ['auto', 'manual', 'waiting'];
    const stateButtons = stateKeys.map(key => {
        const button = jpxUtils.createButton(states, {
            text: t('cW.' + key), history: false,
            onClick: () => { settingsEditHistory?.flushColorEdit(); state.previewState = key; update(); },
        });
        button.dataset.controlPreviewState = key;
        return button;
    });
    heading.append(states);
    const body = element('div', 'jpx-control-appearance-body');
    const controls = element('div', 'jpx-control-style');
    const colorRow = element('div', 'jpx-control-style-row');
    const colorLabel = element('label', '', t('cB.panelTextColor'));
    const color = element('input', '');
    color.type = 'color';
    color.id = getUniqueId('controlColor');
    color.dataset.controlColor = '';
    colorLabel.htmlFor = color.id;
    colorRow.append(colorLabel, color);
    const opacityRow = element('div', 'jpx-control-style-row jpx-control-opacity-row');
    const opacityLabel = element('label', '', t('cB.panelOpacity'));
    const opacity = element('input', '');
    opacity.type = 'range';
    opacity.min = '0'; opacity.max = '100'; opacity.step = '1';
    opacity.id = getUniqueId('controlOpacity');
    opacity.dataset.controlOpacity = '';
    opacityLabel.htmlFor = opacity.id;
    const amount = element('output', '');
    amount.dataset.controlOpacityValue = '';
    amount.htmlFor = opacity.id;
    opacityRow.append(opacityLabel, opacity, amount);
    controls.append(colorRow);
    const paletteInputs = new Map();
    for (const [key, labelKey] of [['header', 'panelHeaderColor'], ['surface', 'panelSurfaceColor'], ['border', 'panelBorderColor']]) {
        const row = element('div', 'jpx-control-style-row');
        const label = element('label', '', t('cB.' + labelKey));
        const input = element('input', '');
        input.type = 'color';
        input.id = getUniqueId('controlPalette');
        input.dataset.controlPalette = key;
        label.htmlFor = input.id;
        input.addEventListener('input', () => {
            const property = `--jpx-${state.previewState}-${key}`;
            const changes = { [property]: input.value };
            let bridgeBorder = false;
            if (key === 'border') {
                readStyle();
                const oldColor = parsed.getPropertyValue('border-top-color');
                bridgeBorder = !!oldColor && oldColor !== 'var(--jpx-state-border)';
                if (bridgeBorder) {
                    // Keep unedited states unchanged when adapting an older explicit border.
                    const previousColor = getComputedStyle(sample).borderTopColor;
                    for (const otherState of stateKeys.filter(value => value !== state.previewState)) {
                        const otherProperty = `--jpx-${otherState}-border`;
                        if (!parsed.getPropertyValue(otherProperty)) changes[otherProperty] = previousColor;
                    }
                }
            }
            if (key === 'header') {
                const rgb = input.value.match(/\w{2}/g).map(value => {
                    const channel = parseInt(value, 16) / 255;
                    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
                });
                const luminance = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
                changes[`--jpx-${state.previewState}-ink`] = luminance > .179 ? '#000000' : '#ffffff';
            }
            write(changes, input, bridgeBorder);
        });
        row.append(label, input);
        controls.append(row);
        paletteInputs.set(key, { input, labelKey });
    }
    controls.append(opacityRow);
    const stage = element('div', 'jpx-control-preview-stage');
    const sample = element('div', 'jpx-control-preview-sample');
    sample.setAttribute('aria-label', t('cB.panelPreview'));
    const previewParts = createControlWidgetContents(sample, true);
    const content = previewParts.info;
    content.classList.add('jpx-control-preview-content');
    stage.append(sample);
    body.append(controls, stage);
    container.append(heading, body);
    bindSettingsChange(controls, data, 'ctrlWidgetStyleText');
    const parsed = document.createElement('span').style;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const readStyle = () => { parsed.cssText = typeof data.ctrlWidgetStyleText === 'string' ? data.ctrlWidgetStyleText : ''; };
    const paletteProperties = stateKeys.flatMap(key => ['header', 'surface', 'border', 'ink'].map(part => `--jpx-${key}-${part}`));
    const borderProperties = ['top', 'right', 'bottom', 'left'].flatMap(side => ['width', 'style', 'color'].map(part => `border-${side}-${part}`));
    const syncColor = (input, rawColor, source) => {
        if (input._jpxRawColor === rawColor) return;
        input._jpxRawColor = rawColor;
        if (source !== input) {
            context.fillStyle = '#000000'; context.fillRect(0, 0, 1, 1);
            context.fillStyle = rawColor; context.fillRect(0, 0, 1, 1);
            input.value = '#' + [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => v.toString(16).padStart(2, '0')).join('');
        }
    };
    function update(source) {
        readStyle();
        for (const property of ['color', 'opacity', 'font-weight', 'font-style', 'text-decoration-line', ...paletteProperties, ...borderProperties]) {
            const value = parsed.getPropertyValue(property), priority = parsed.getPropertyPriority(property);
            if (sample.style.getPropertyValue(property) !== value || sample.style.getPropertyPriority(property) !== priority) {
                if (value) sample.style.setProperty(property, value, priority);
                else sample.style.removeProperty(property);
            }
        }
        setControlWidgetState(sample, state.previewState);
        const surfaceStyle = getComputedStyle(sample);
        syncColor(color, surfaceStyle.color, source);
        color.title = t('cB.panelTextColor');
        const palette = { header: getComputedStyle(previewParts.header).backgroundColor, surface: surfaceStyle.backgroundColor, border: surfaceStyle.borderTopColor };
        const stateLabel = t('cW.' + state.previewState);
        for (const [key, { input, labelKey }] of paletteInputs) {
            syncColor(input, palette[key], source);
            input.title = stateLabel + ' · ' + t('cB.' + labelKey);
            input.setAttribute('aria-label', input.title);
        }
        const rawOpacity = parsed.opacity;
        const numericOpacity = rawOpacity ? Number(rawOpacity.replace(/%$/, '')) / (rawOpacity.endsWith('%') ? 100 : 1) : 1;
        const percent = Math.round(Math.max(0, Math.min(1, Number.isFinite(numericOpacity) ? numericOpacity : 1)) * 100);
        if (source !== opacity) opacity.value = String(percent);
        const valueText = percent + '%';
        if (amount.textContent !== valueText) amount.textContent = valueText;
        const examples = { isActiveBattle: stateLabel, readyNext: '0', networkDelay: '120 ms',
            battleStyle: t('cW.OneHanded'), battleType: t('cW.Arena'), battleMode: 'OneHanded_General', round: '12 / 100' };
        const rows = (Array.isArray(data.ctrlWidgetRows) ? data.ctrlWidgetRows : []).map(row => {
            const base = CTRLWIDGET_FIELDS.find(field => field.id === row?.id);
            return base ? { id: row.id, label: t(base.label), value: examples[base.id] } : null;
        }).filter(row => row !== null);
        updateControlWidgetRows(content, rows);
        stateButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.controlPreviewState === state.previewState)));
    }
    function write(changes, source, bridgeBorder = false) {
        readStyle();
        let css = typeof data.ctrlWidgetStyleText === 'string' ? data.ctrlWidgetStyleText : '';
        for (const [property, value] of Object.entries(changes)) {
            css = setControlPanelStyleProperty(css, property, value, parsed.getPropertyPriority(property));
        }
        if (bridgeBorder) css += (css.trimEnd().endsWith(';') ? '' : ';') + ' border-color: var(--jpx-state-border) !important;';
        data.ctrlWidgetStyleText = css;
        update(source);
    }
    color.addEventListener('input', () => write({ color: color.value }, color));
    opacity.addEventListener('input', () => write({ opacity: String(Number(opacity.value) / 100) }, opacity));
    container._jpxRefreshTheme = update;
    update();
    // Schema fields are built off-DOM; resolve theme colors once their styles can apply.
    if (!sample.isConnected) queueMicrotask(() => { if (sample.isConnected) update(); });
    return update;
}

function renderControlPanelRows(container, data, state, element, updatePreview) {
    const heading = element('div', 'jpx-control-heading');
    const count = element('span', 'jpx-control-count');
    heading.append(element('strong', '', t('cB.panelFields')), count);
    const list = element('div', 'jpx-stats-list jpx-control-list');
    list.setAttribute('role', 'list');
    list.setAttribute('aria-label', t('cB.panelFields'));
    container.append(heading, list);
    bindSettingsChange(container, data, 'ctrlWidgetRows');
    const known = new Set(CTRLWIDGET_FIELDS.map(field => field.id));
    const selected = () => Array.isArray(data.ctrlWidgetRows) ? data.ctrlWidgetRows : [];
    const activeIds = () => [...new Set(selected().filter(row => known.has(row?.id)).map(row => row.id))];
    const copy = value => JSON.parse(JSON.stringify(value));
    const focusRow = (id, selector = '.jpx-stats-select') => list.querySelector(`[data-field-id="${id}"] ${selector}`)?.focus({ preventScroll: true });
    function move(id, destination) {
        const ids = activeIds(), from = ids.indexOf(id);
        if (from < 0) return;
        destination = Math.max(0, Math.min(ids.length - 1, destination));
        if (from === destination) return;
        const action = () => {
            ids.splice(destination, 0, ids.splice(from, 1)[0]);
            const rows = selected();
            const reordered = ids.flatMap(id => rows.filter(row => row?.id === id));
            data.ctrlWidgetRows = rows.map(row => known.has(row?.id) ? reordered.shift() : row);
            state.selected = id;
            refresh();
            focusRow(id);
        };
        if (settingsEditHistory) settingsEditHistory.run(t('cB.panelReorder'), action);
        else action();
    }
    const cancelDrag = bindStatsListDrag(list, move);
    function refresh() {
        cancelDrag();
        const rows = selected(), ids = activeIds();
        // Active configuration always wins over an older retained copy, including after undo/import.
        ids.forEach(id => state.retained.set(id, rows.flatMap((row, index) => row?.id === id ? [{ row: copy(row), index }] : [])));
        if (!state.selected || !known.has(state.selected)) state.selected = ids[0] || CTRLWIDGET_FIELDS[0].id;
        const ordered = [...ids, ...CTRLWIDGET_FIELDS.map(field => field.id).filter(id => !ids.includes(id))];
        count.textContent = `${ids.length} / ${CTRLWIDGET_FIELDS.length}`;
        list.replaceChildren();
        ordered.forEach(id => {
            const base = CTRLWIDGET_FIELDS.find(field => field.id === id), index = ids.indexOf(id), enabled = index >= 0;
            const row = element('div', 'jpx-stats-row');
            row.dataset.fieldId = id;
            row.dataset.enabled = String(enabled);
            row.setAttribute('role', 'listitem');
            const select = jpxUtils.createButton(row, {
                className: 'jpx-stats-select', history: false, onClick: () => {
                    state.selected = id;
                    list.querySelectorAll('.jpx-stats-select').forEach(button => button.setAttribute('aria-pressed', String(button === select)));
                },
            });
            select.setAttribute('aria-pressed', String(state.selected === id));
            const grip = element('span', enabled ? 'jpx-stats-grip jpx-drag-grip' : 'jpx-drag-grip');
            grip.append(createSettingsIcon('grip'));
            grip.setAttribute('aria-hidden', 'true');
            if (enabled) grip.title = t('cS.reorderHint');
            select.append(grip, element('span', 'jpx-stats-row-label', t(base.label)));
            select.addEventListener('keydown', event => {
                if (enabled && event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
                    event.preventDefault(); move(id, index + (event.key === 'ArrowUp' ? -1 : 1));
                }
            });
            const actions = element('div', 'jpx-array-item-actions');
            row.append(actions);
            createSettingsMoveButtons(actions, enabled ? index : 0, enabled ? ids.length : 0, destination => move(id, destination));
            const toggle = jpxUtils.createButton(actions, {
                text: `${t(enabled ? 'cS.disableField' : 'cS.enableField')}: ${t(base.label)}`,
                icon: enabled ? 'ruleEnabled' : 'ruleDisabled', className: 'jpx-rule-state-toggle',
                onClick: () => {
                    if (enabled) data.ctrlWidgetRows = selected().filter(row => row?.id !== id);
                    else {
                        const restored = state.retained.get(id) || [{ row: { id }, index: selected().length }];
                        const next = [...selected()];
                        restored.forEach(({ row, index }) => next.splice(Math.min(index, next.length), 0, copy(row)));
                        data.ctrlWidgetRows = next;
                    }
                    state.selected = id;
                    refresh();
                    focusRow(id, '.jpx-rule-state-toggle');
                },
            });
            toggle.dataset.enabled = String(enabled);
            toggle.setAttribute('aria-pressed', String(enabled));
            list.append(row);
        });
        updatePreview();
    }
    refresh();
}

const fieldRenderers = {
    expandedRuleItems: new WeakSet(),
    group(container, field, dataObj) {
        if (field.controlPanelEditor) return renderControlPanelSettings(container, field, dataObj);
        container.classList.add('jpx-settings-group');
        const heading = document.createElement('h3');
        heading.className = 'heading';
        heading.id = getUniqueId(field.key);
        heading.textContent = t(field.label);
        container.setAttribute('role', 'group');
        container.setAttribute('aria-labelledby', heading.id);
        const fields = document.createElement('div');
        fields.className = 'jpx-settings-group-fields';
        renderSchema(fields, { type: 'object', properties: field.properties }, dataObj);
        container.append(heading, fields);
    },
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
            <label for="${checkboxId}">
                <input type="checkbox" id="${checkboxId}" ${dataObj[key] ? 'checked' : ''}>
                ${t(field.label)}
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
        input.oninput = event => dataObj[key] = event.target.value;
    },

	textarea(container, field, dataObj) {
		let key = field.key;
		let inputId = getUniqueId(key);
		container.innerHTML = `
			${field.skipLabel ? '' : `<label for="${inputId}">${t(field.label)}</label>`}
			<textarea id="${inputId}" rows="${field.rows ?? 10}" cols="${field.cols ?? 130}"></textarea>
		`;

		let textarea = container.querySelector('textarea');
		if (field.placeholder) textarea.placeholder = field.placeholder;
		textarea.value = dataObj[key] ?? '';
		textarea.oninput = event => dataObj[key] = event.target.value;
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

    time(container, field, dataObj) {
        const input = document.createElement('input');
        input.type = 'time';
        input.step = '60';
        input.required = true;
        input.id = getUniqueId(field.key);
        input.value = dataObj[field.key] ?? '08:00';
        input.oninput = event => dataObj[field.key] = event.target.value;
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = t(field.label) + ': ';
        container.append(label, input);
    },

    rangeNumber(container, field, dataObj) {
        let key = field.key;
        if (!Array.isArray(dataObj[key])) dataObj[key] = [0, 0];
        let idMin = getUniqueId(`${key}_min`);
        let idMax = getUniqueId(`${key}_max`);

        container.classList.add('jpx-range');
        container.innerHTML = `
            ${field.skipLabel ? '' : `<label for="${idMin}">${t(field.label)}</label>`}
            <span class="jpx-range-inputs">
                <input id="${idMin}" type="number" value="${dataObj[key][0]}">
                <span>${t('cGen.rangeTo')}</span>
                <input id="${idMax}" type="number" value="${dataObj[key][1]}">
            </span>
        `;
        container.querySelector(`#${idMin}`).setAttribute('aria-label', `${t(field.label)}: ${t('cGen.rangeMin')}`);
        container.querySelector(`#${idMax}`).setAttribute('aria-label', `${t(field.label)}: ${t('cGen.rangeMax')}`);

        container.querySelector(`#${idMin}`).oninput = event => dataObj[key][0] = +event.target.value;
        container.querySelector(`#${idMax}`).oninput = event => dataObj[key][1] = +event.target.value;
    },

    dropdown(container, field, dataObj) {
        function createSelectComponent(field, dataObj) {
            let component = {
                element: document.createElement('div'),
                getValue: () => {},
                setValue: (value) => {},
                onchange: () => {}
            };

            if (!Array.isArray(field.options) && typeof field.options === 'object') {
                let selects = {};
                component.element.className = 'jpx-battle-mode-selects';

                component.getValue = () => {
                    let values = Object.keys(field.options).map(key => jpxUtils.parseValue(selects[key].value));
                    return field.flatten ? values.join(field.flatten) : values;
                };

                component.setValue = (value) => {
                    let values = value;
                    if (field.flatten && typeof value === 'string') {
                        if (field.flatten === '_') values = value.split(/_(?!Mage(?:_|$))/);
                        else values = value.split(field.flatten);
                    }
                    Object.keys(field.options).forEach((key, i) => { if (values?.[i] !== undefined) selects[key].value = values[i]; });
                };

                for (const [subLabel, subOptions] of Object.entries(field.options)) {
                    let subWrap = document.createElement('div');
                    subWrap.style.display = 'inline-block';
                    subWrap.style.marginRight = '8px';

                    let select = createSelect(subOptions);
                    let label = document.createElement('label');
                    label.textContent = t(`cB.${subLabel}`);
                    subWrap.appendChild(label);
                    label.htmlFor = select.id;
                    select.onchange = () => component.onchange();
                    subWrap.appendChild(select);
                    selects[subLabel] = select;
                    component.element.appendChild(subWrap);
                };
            } else {
                let select = createSelect(field.options);
                component.element = select;
                component.getValue = () => jpxUtils.parseValue(select.value);
                component.setValue = (value) => { select.value = value; };
                select.onchange = () => component.onchange();
            }

            return component;
        }

        function createSelect(options) {
            let select = document.createElement('select');
            select.id = getUniqueId(field.key)
            options.forEach(opt => {
                let option = document.createElement('option');
                option.value = opt.value;
                option.textContent = t(opt.label);
                select.appendChild(option);
            });

            return select;
        }

        let selectComponent = createSelectComponent(field, dataObj);

        let initValue = dataObj[field.key];
        if (initValue === undefined) {
            if (Array.isArray(field.options)) {
                initValue = field.options[0]?.value;
            } else {
                let defaultVals = Object.values(field.options).map(opts => (opts[0]?.value));
                initValue = field.flatten ? defaultVals.join(field.flatten) : defaultVals;
            }
        }

        if (field.hasModeDropdown) {
            container.dataset.role = field.hasModeDropdown;
            
            let selectContent = document.createElement('div');
            selectComponent.onchange = () => {
                fieldRenderers.dragState.cancel?.();
                selectContent.innerHTML = '';
                let currentValue = selectComponent.getValue();
                container.dataset.currentValue = currentValue;
                if (jpxUtils.isEmpty(dataObj[currentValue])) dataObj[currentValue] = {};
                renderBattleRuleSections(selectContent, field.itemSchema, dataObj[currentValue], currentValue);
            };

            container.appendChild(selectComponent.element);
            container.appendChild(selectContent);

            let modeKey = getBattleMode('OneHanded');
            let importBtn = document.getElementById('import-button');
            let resetBtn = document.getElementById('reset-current-button');
            let finalKey = (importBtn?.dataset.battleMode) || (resetBtn?.dataset.battleMode) || modeKey;

            if (importBtn) delete importBtn.dataset.battleMode;
            if (resetBtn) delete resetBtn.dataset.battleMode;

            if (finalKey) selectComponent.setValue(finalKey);
            selectComponent.onchange(); 

        } else {
            let wrap = document.createElement('div');
            let label = document.createElement('label');
            label.htmlFor = selectComponent.element.id;
            label.textContent = t(field.label);
            wrap.appendChild(label);

            selectComponent.setValue(initValue);
            dataObj[field.key] = selectComponent.getValue();

            selectComponent.onchange = () => dataObj[field.key] = selectComponent.getValue();

            wrap.appendChild(selectComponent.element);
            container.appendChild(wrap);
        }
    },

    dragState: { pointerId: null, fromIndex: null, groupId: null, sourceRow: null, sourceHandle: null, dragImage: null, dragLayer: null, dropMarker: null, dropRow: null, dropPosition: null, startX: 0, startY: 0, pointerX: 0, pointerY: 0, handleOffsetX: 0, handleOffsetY: 0, grabOffsetY: 0, frameId: null, cancel: null, dragging: false },
    array(container, field, dataObj) {
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];
        let arrayGroupId = Symbol('array-group');
        const renderedRuleItems = new Map();
        const liveRegion = document.createElement('span');
        liveRegion.className = 'jpx-sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        let updateAllRulesToggle = () => {};
        let toolbar = null;

        if (!field.skipLabel) container.innerHTML = `<div${field.class ? ` class="${field.class}"` : ''} style="font-weight:bold; margin-bottom:4px;">${t(field.label)}</div>`;

        if (field.collapsibleItems) {
            toolbar = document.createElement('div');
            toolbar.className = 'jpx-rule-list-toolbar';
            let allRulesToggle;
            updateAllRulesToggle = () => {
                const allExpanded = renderedRuleItems.size > 0 && [...renderedRuleItems.values()].every(details => details.open);
                if (allRulesToggle.getAttribute('aria-expanded') === String(allExpanded)) return;
                const label = t(allExpanded ? 'cGen.collapseAllRules' : 'cGen.expandAllRules');
                const caption = document.createElement('span');
                caption.textContent = label;
                allRulesToggle.replaceChildren(createSettingsIcon(allExpanded ? 'collapseRules' : 'expandRules'), caption);
                allRulesToggle.title = label;
                allRulesToggle.setAttribute('aria-label', label);
                allRulesToggle.setAttribute('aria-expanded', String(allExpanded));
            };
            allRulesToggle = jpxUtils.createButton(toolbar, {
                className: 'jpx-rule-list-toggle',
                history: false,
                onClick: () => {
                    const shouldExpand = [...renderedRuleItems.values()].some(details => !details.open);
                    for (const [item, details] of renderedRuleItems) {
                        details.open = shouldExpand;
                        if (shouldExpand) fieldRenderers.expandedRuleItems.add(item);
                        else fieldRenderers.expandedRuleItems.delete(item);
                    }
                    updateAllRulesToggle();
                }
            });
            toolbar.append(allRulesToggle, liveRegion);
            updateAllRulesToggle();
        }
        let listDiv = document.createElement('div');
        if (field.fixedActions) listDiv.className = 'jpx-rule-scroll';
        container.appendChild(listDiv);
        if (field.collapsibleItems) {
            if (!field.skipLabel) {
                const heading = container.firstElementChild;
                heading.classList.add('jpx-rule-list-heading');
                heading.appendChild(toolbar);
            } else {
                container.insertBefore(toolbar, listDiv);
            }
        }
        if (!field.collapsibleItems) container.appendChild(liveRegion);
        const addBar = field.collapsibleItems ? document.createElement('div') : null;
        if (addBar) {
            addBar.className = 'jpx-rule-add-actions';
            container.append(addBar);
        }
        const scrollContainer = () => field.fixedActions ? listDiv : container.closest('.jpx-rule-scroll, [role=tabpanel]');

        const ruleRows = () => [...listDiv.children].filter(row => row.classList.contains('jpx-rule-array-item'));
        const clearDropTargets = () => listDiv.querySelectorAll('.is-drop-before, .is-drop-after').forEach(target => {
            target.classList.remove('is-drop-before', 'is-drop-after');
        });
        const getRuleLabel = item => {
            const label = item?.name ? t(`cB.${item.name}`) : item?.customMessage || '';
            return `${t(`cB.${item?.type || field.key}`)}${label ? `: ${label}` : ''}`;
        };
        const clearDragState = (announcement = '') => {
            const drag = fieldRenderers.dragState;
            const handle = drag.sourceHandle;
            const pointerId = drag.pointerId;
            cancelAnimationFrame(drag.frameId);
            drag.sourceRow?.classList.remove('is-dragging');
            drag.sourceHandle?.setAttribute('aria-grabbed', 'false');
            drag.dragLayer?.remove();
            clearDropTargets();
            drag.pointerId = null;
            drag.fromIndex = null;
            drag.groupId = null;
            drag.sourceRow = null;
            drag.sourceHandle = null;
            drag.dragImage = null;
            drag.dragLayer = null;
            drag.dropMarker = null;
            drag.dropRow = null;
            drag.dropPosition = null;
            drag.handleOffsetX = 0;
            drag.handleOffsetY = 0;
            drag.grabOffsetY = 0;
            drag.frameId = null;
            drag.cancel = null;
            drag.dragging = false;
            window.removeEventListener('blur', cancelRuleDrag);
            window.removeEventListener('resize', cancelRuleDrag);
            if (handle?.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
            if (announcement) liveRegion.textContent = announcement;
        };
        const cancelRuleDrag = () => {
            if (fieldRenderers.dragState.groupId === arrayGroupId) clearDragState(t('cGen.dragCancelled'));
        };
        const updateDropTarget = (x, y) => {
            const drag = fieldRenderers.dragState;
            const area = getDragBounds();
            const { scale } = getSettingsCoordinateSpace(listDiv);
            const inside = x >= area.left && x < area.right && y >= area.top && y < area.bottom;
            const hovered = inside ? document.elementFromPoint(x, y)?.closest('.jpx-rule-array-item') : null;
            if (!hovered || hovered.parentElement !== listDiv || hovered === drag.sourceRow) {
                clearDropTargets();
                if (drag.dropMarker) drag.dropMarker.style.display = 'none';
                drag.dropRow = null;
                drag.dropPosition = null;
                return;
            }
            const bounds = hovered.getBoundingClientRect();
            const position = y < bounds.top + bounds.height / 2 ? 'before' : 'after';
            if (drag.dropMarker) {
                const markerTop = position === 'before' ? bounds.top : bounds.bottom - 3 * scale;
                const preview = drag.dragImage.getBoundingClientRect();
                // Keep the landing cue at both edges without drawing a line through the lifted text.
                drag.dropMarker.classList.toggle('over-preview', markerTop < preview.bottom && markerTop + 3 * scale > preview.top);
                drag.dropMarker.style.display = 'block';
                drag.dropMarker.style.left = '0';
                drag.dropMarker.style.width = '100%';
                drag.dropMarker.style.top = `${(markerTop - area.top) / scale}px`;
            }
            if (drag.dropRow === hovered && drag.dropPosition === position) return;
            clearDropTargets();
            hovered.classList.add(`is-drop-${position}`);
            drag.dropRow = hovered;
            drag.dropPosition = position;
            const targetIndex = ruleRows().indexOf(hovered);
            liveRegion.textContent = t(position === 'before' ? 'cGen.dropBefore' : 'cGen.dropAfter', {
                label: getRuleLabel(dataObj[field.key][targetIndex])
            });
        };
        const getDragBounds = () => {
            const listBounds = listDiv.getBoundingClientRect();
            const panelBounds = scrollContainer()?.getBoundingClientRect();
            const view = window.visualViewport;
            const viewLeft = view?.offsetLeft || 0, viewTop = view?.offsetTop || 0;
            const viewRight = viewLeft + (view?.width || innerWidth), viewBottom = viewTop + (view?.height || innerHeight);
            const left = Math.max(viewLeft, listBounds.left, panelBounds?.left ?? viewLeft);
            const top = Math.max(viewTop, listBounds.top, panelBounds?.top ?? viewTop);
            const right = Math.min(viewRight, listBounds.right, panelBounds?.right ?? viewRight);
            const bottom = Math.min(viewBottom, listBounds.bottom, panelBounds?.bottom ?? viewBottom,
                addBar?.getClientRects().length ? addBar.getBoundingClientRect().top : viewBottom);
            return { left, top, right: Math.max(left, right), bottom: Math.max(top, bottom) };
        };
        const startRuleDrag = (row, handle, event) => {
            const drag = fieldRenderers.dragState;
            const sourceIndex = ruleRows().indexOf(row);
            if (sourceIndex < 0) return;
            drag.fromIndex = sourceIndex;
            drag.groupId = arrayGroupId;
            drag.pointerId = event.pointerId;
            drag.sourceRow = row;
            drag.sourceHandle = handle;
            drag.dragging = true;
            const rowBounds = row.getBoundingClientRect();
            const handleBounds = handle.getBoundingClientRect();
            const summary = row.querySelector('.jpx-rule-summary-text');
            const summaryBounds = summary?.getBoundingClientRect();
            const { scale } = getSettingsCoordinateSpace(row);
            drag.handleOffsetX = handleBounds.left + handleBounds.width / 2 - rowBounds.left;
            drag.handleOffsetY = summaryBounds && handleBounds.top >= summaryBounds.bottom
                ? 10 * scale + summaryBounds.height + handleBounds.height / 2
                : handleBounds.top + handleBounds.height / 2 - rowBounds.top;
            drag.grabOffsetY = drag.handleOffsetY + drag.startY - handleBounds.top - handleBounds.height / 2;
            row.classList.add('is-dragging');
            handle.setAttribute('aria-grabbed', 'true');
            liveRegion.textContent = t('cGen.draggingRule', { label: getRuleLabel(dataObj[field.key][sourceIndex]) });

            const dragLayer = document.createElement('div');
            dragLayer.className = 'jpx-rule-drag-layer';
            dragLayer.setAttribute('aria-hidden', 'true');
            container.appendChild(dragLayer);
            drag.dragLayer = dragLayer;
            const dragImage = document.createElement('div');
            dragImage.className = 'jpx-rule-drag-image';
            dragImage.setAttribute('aria-hidden', 'true');
            dragImage.style.width = `${rowBounds.width / scale}px`;
            dragImage.style.minHeight = `${(drag.handleOffsetY + handleBounds.height / 2) / scale + 6}px`;
            dragImage.style.setProperty('--jpx-drag-handle-x', `${drag.handleOffsetX / scale}px`);
            dragImage.style.setProperty('--jpx-drag-handle-y', `${drag.handleOffsetY / scale}px`);
            const labelPreview = summary?.cloneNode(true);
            if (labelPreview) {
                labelPreview.classList.add('jpx-rule-drag-label');
                dragImage.style.setProperty('--jpx-drag-label-width', `${summaryBounds.width / scale}px`);
                dragImage.style.setProperty('--jpx-drag-label-x', `${(summaryBounds.left - rowBounds.left) / scale}px`);
                dragImage.appendChild(labelPreview);
            }
            const gripPreview = document.createElement('span');
            gripPreview.className = 'jpx-rule-drag-grip jpx-drag-grip';
            gripPreview.appendChild(createSettingsIcon('grip'));
            dragImage.appendChild(gripPreview);
            dragLayer.appendChild(dragImage);
            drag.dragImage = dragImage;
            const dropMarker = document.createElement('div');
            dropMarker.className = 'jpx-rule-drop-marker';
            dropMarker.style.display = 'none';
            dropMarker.setAttribute('aria-hidden', 'true');
            dragLayer.appendChild(dropMarker);
            drag.dropMarker = dropMarker;
            drag.frameId = requestAnimationFrame(trackRuleDrag);
        };
        function updateDragImage(x, y) {
            const drag = fieldRenderers.dragState;
            if (!drag.dragImage) return;
            const bounds = getDragBounds();
            const space = getSettingsCoordinateSpace(listDiv);
            Object.assign(drag.dragLayer.style, {
                left: `${(bounds.left - space.left) / space.scale}px`, top: `${(bounds.top - space.top) / space.scale}px`,
                width: `${(bounds.right - bounds.left) / space.scale}px`, height: `${(bounds.bottom - bounds.top) / space.scale}px`
            });
            const image = drag.dragImage.getBoundingClientRect();
            // Rule sorting has one axis: retain the row's horizontal position and the original grab point.
            const top = Math.max(0, Math.min(bounds.bottom - bounds.top - image.height, y - drag.grabOffsetY - bounds.top));
            drag.dragImage.style.left = `${(drag.sourceRow.getBoundingClientRect().left - bounds.left) / space.scale}px`;
            drag.dragImage.style.top = `${top / space.scale}px`;
        }
        function trackRuleDrag() {
            const drag = fieldRenderers.dragState;
            if (drag.groupId !== arrayGroupId || !drag.dragging) return;
            if (!drag.sourceRow.isConnected || !listDiv.getClientRects().length) {
                cancelRuleDrag();
                return;
            }
            const bounds = getDragBounds();
            const panel = scrollContainer();
            const { pointerX: x, pointerY: y } = drag;
            const edge = 28 * getSettingsCoordinateSpace(listDiv).scale;
            if (panel && x >= bounds.left && x < bounds.right && y >= bounds.top && y < bounds.bottom) {
                if (y < bounds.top + edge && panel.scrollTop > 0) {
                    panel.scrollTop -= 8;
                } else if (y > bounds.bottom - edge && panel.scrollTop + panel.clientHeight < panel.scrollHeight) {
                    panel.scrollTop += 8;
                }
            }
            updateDragImage(x, y);
            updateDropTarget(x, y);
            drag.frameId = requestAnimationFrame(trackRuleDrag);
        }
        listDiv.addEventListener('pointerdown', event => {
            const handle = event.target.closest('.drag-handle');
            const row = handle?.closest('.jpx-rule-array-item');
            if (!row || !listDiv.contains(row) || !event.isPrimary || event.button !== 0) return;
            const drag = fieldRenderers.dragState;
            if (drag.pointerId !== null) return;
            drag.pointerId = event.pointerId;
            drag.groupId = arrayGroupId;
            drag.fromIndex = ruleRows().indexOf(row);
            drag.sourceRow = row;
            drag.sourceHandle = handle;
            drag.startX = event.clientX;
            drag.startY = event.clientY;
            drag.pointerX = event.clientX;
            drag.pointerY = event.clientY;
            drag.cancel = cancelRuleDrag;
            window.addEventListener('blur', cancelRuleDrag);
            window.addEventListener('resize', cancelRuleDrag);
            try { handle.setPointerCapture(event.pointerId); } catch {}
            event.preventDefault();
        });
        container.addEventListener('pointermove', event => {
            const drag = fieldRenderers.dragState;
            if (drag.groupId !== arrayGroupId || drag.pointerId !== event.pointerId) return;
            drag.pointerX = event.clientX;
            drag.pointerY = event.clientY;
            if (!drag.dragging && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) >= 6 * getSettingsCoordinateSpace(listDiv).scale) {
                startRuleDrag(drag.sourceRow, drag.sourceHandle, event);
            }
            if (!drag.dragging) return;
            updateDragImage(event.clientX, event.clientY);
            updateDropTarget(event.clientX, event.clientY);
        });
        const finishRuleDrag = event => {
            const drag = fieldRenderers.dragState;
            if (drag.groupId !== arrayGroupId || drag.pointerId !== event.pointerId) return;
            if (!drag.dragging) {
                clearDragState();
                return;
            }
            updateDropTarget(event.clientX, event.clientY);
            const from = drag.fromIndex;
            const targetIndex = ruleRows().indexOf(drag.dropRow);
            const target = targetIndex + (drag.dropPosition === 'after' ? 1 : 0);
            if (targetIndex < 0 || target === from || target === from + 1) {
                clearDragState(t('cGen.dragCancelled'));
                return;
            }
            const moved = dataObj[field.key][from];
            const label = getRuleLabel(moved);
            const move = () => {
                dataObj[field.key].splice(from, 1);
                const destination = target > from ? target - 1 : target;
                dataObj[field.key].splice(destination, 0, moved);
                clearDragState(t('cGen.ruleMoved', { label, index: destination + 1 }));
                renderArray();
            };
            if (settingsEditHistory) settingsEditHistory.run(t('cGen.reorderRules'), move);
            else move();
        };
        container.addEventListener('pointerup', finishRuleDrag);
        container.addEventListener('lostpointercapture', event => {
            if (fieldRenderers.dragState.groupId === arrayGroupId && fieldRenderers.dragState.pointerId === event.pointerId) cancelRuleDrag();
        });
        container.addEventListener('pointercancel', event => {
            if (fieldRenderers.dragState.groupId === arrayGroupId && fieldRenderers.dragState.pointerId === event.pointerId) {
                clearDragState(t('cGen.dragCancelled'));
            }
        });

        function renderRowButtons(row, index) {
            const isTop = index === 0;
            const isBottom = index === dataObj[field.key].length - 1;

            const disabled = dataObj[field.key][index].disabled === true;
            if (field.collapsibleItems) row.classList.toggle('is-disabled', disabled);
            else row.style.opacity = disabled ? '0.5' : '1';
            const actions = document.createElement('div');
            actions.className = 'jpx-array-item-actions';
            const summary = row.querySelector(':scope > .jpx-rule-item > summary');
            (summary || row).appendChild(actions);
            const actionButton = (label, options, parent = actions) => {
                const button = jpxUtils.createButton(parent, options);
                button.title = t(label);
                button.setAttribute('aria-label', t(label));
                return button;
            };

            const moveTo = (destination, focus = '.drag-handle') => {
                const items = dataObj[field.key];
                if (!Number.isInteger(destination) || destination < 0 || destination >= items.length || destination === index) return;
                const move = () => {
                    const moved = items.splice(index, 1)[0];
                    items.splice(destination, 0, moved);
                    renderArray();
                    const movedRow = ruleRows()[destination];
                    (movedRow?.querySelector(focus) || movedRow?.querySelector('.drag-handle'))?.focus({ preventScroll: true });
                    movedRow?.scrollIntoView({ block: 'nearest' });
                    liveRegion.textContent = t('cGen.ruleMoved', { label: getRuleLabel(moved), index: destination + 1 });
                };
                if (settingsEditHistory) settingsEditHistory.run(t('cGen.reorderRules'), move);
                else move();
            };
            let handle = actionButton('cGen.dragRule', { className: 'drag-handle jpx-drag-grip', history: false }, summary || actions);
            if (summary) summary.prepend(handle);
            handle.replaceChildren(createSettingsIcon('grip'));
            handle.setAttribute('aria-grabbed', 'false');
            handle.setAttribute('aria-keyshortcuts', 'Alt+ArrowUp Alt+ArrowDown Alt+Home Alt+End');
            handle.title = `${t('cGen.dragRule')} · Alt+↑/↓ · Alt+Home/End`;
            handle.draggable = false;
            handle.addEventListener('keydown', event => {
                if (!event.altKey) return;
                const target = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: dataObj[field.key].length - 1 }[event.key];
                if (target === undefined) return;
                event.preventDefault();
                event.stopPropagation();
                moveTo(target);
            });
            const sortActions = createSettingsMoveButtons(actions, index, dataObj[field.key].length, moveTo);
            const sortMenu = actionButton('cGen.reorderRules', { history: false,
                onClick: (button, event) => {
                    // The target association prevents light dismissal; this handler owns toggling.
                    event.preventDefault();
                    openRuleSortMenu(button, index, dataObj[field.key].length, moveTo);
                } }, sortActions);
            sortMenu.append(createSettingsIcon('sort'));
            sortMenu.setAttribute('aria-haspopup', 'dialog');
            sortMenu.setAttribute('aria-expanded', 'false');
            actionButton('cGen.duplicateRule', { text: decodeURIComponent('%E2%A7%89'), onClick: () => {
                const copy = JSON.parse(JSON.stringify(dataObj[field.key][index]));
                dataObj[field.key].splice(index + 1, 0, copy);
                if (field.collapsibleItems) fieldRenderers.expandedRuleItems.add(copy);
                renderArray();
            }});
            if (field.canDisable) {
                const toggle = actionButton(disabled ? 'cGen.enableRule' : 'cGen.disableRule', {
                    className: 'jpx-rule-state-toggle',
                    onClick: () => {
                        if (dataObj[field.key][index]?.disabled === true) {
                            delete dataObj[field.key][index].disabled;
                        } else if (dataObj[field.key][index] && typeof dataObj[field.key][index] === 'object') {
                            dataObj[field.key][index].disabled = true;
                        }
                        renderArray();
                    }
                });
                toggle.dataset.enabled = String(!disabled);
                const status = document.createElement('span');
                status.className = 'jpx-sr-only';
                status.id = getUniqueId('rule-state');
                status.textContent = t(disabled ? 'cGen.ruleDisabled' : 'cGen.ruleEnabled');
                toggle.append(status);
                toggle.setAttribute('aria-describedby', status.id);
                toggle.prepend(createSettingsIcon(disabled ? 'ruleDisabled' : 'ruleEnabled'));
                toggle.title = `${t(disabled ? 'cGen.ruleDisabled' : 'cGen.ruleEnabled')} · ${t(disabled ? 'cGen.enableRule' : 'cGen.disableRule')}`;
            }
            actionButton('delete', { text: t('delete'), className: 'jpx-delete-button', onClick: () => {
                dataObj[field.key].splice(index, 1);
                renderArray();
            }});
        };

        function renderAddButtons(addContainer) {
            const addAction = (targetSchema) => {
                const item = targetSchema.type === 'text' ? '' : createEmptyObject(targetSchema);
                dataObj[field.key].push(item);
                if (field.collapsibleItems) fieldRenderers.expandedRuleItems.add(item);
                renderArray();
                if (field.collapsibleItems) {
                    const row = ruleRows().at(-1);
                    if (row?.isConnected) {
                        row.scrollIntoView({ block: 'start' });
                        (row.querySelector('.object-item input, .object-item select, .object-item textarea') || row.querySelector('summary'))?.focus({ preventScroll: true });
                    }
                }
            };

            if (field.itemSchema.discriminator) {
                for (const [typeKey, subSchema] of Object.entries(field.itemSchema.oneOf)) {
                    jpxUtils.createButton(addContainer, {
                        text: `${t('add')} ${t(subSchema.properties.find(item => item.type === 'constant')?.label)}`,
                        onClick: () => addAction(subSchema)
                    });
                };
            } else {
                jpxUtils.createButton(addContainer, { text: t('add'), onClick: () => addAction(field.itemSchema) });
            }
        };

        function renderMultiSelectMode() {
            if (field.hasRange) {
                if (dataObj[field.key].length < 2) dataObj[field.key].unshift(0, 0);
                let rangeBox = document.createElement('div');
                rangeBox.style.cssText = 'display: inline-flex; align-items: baseline;  margin-right: 8px;';
                fieldRenderers.rangeNumber(rangeBox, { ...field, label: field.hasRange, skipLabel: false }, dataObj);
                listDiv.appendChild(rangeBox);
            }

            if (field.popup) {
                listDiv.classList.add('multiSelect-popup');
                let summary = document.createElement('button');
                summary.type = 'button';
                summary.className = 'multiSelect-summary';
                summary.setAttribute('aria-haspopup', 'group');
                summary.setAttribute('aria-expanded', 'false');
                const selectedText = document.createElement('span');
                selectedText.className = 'multiSelect-value';
                summary.appendChild(selectedText);
                summary.onclick = (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.multiSelect-popup-panel').forEach(p => {
                        let isHidden = panel.style.display === 'none';
                        if (p === panel) panel.style.display = isHidden ? 'block' : 'none';
                        else p.style.display = 'none';
                    });
                    document.querySelectorAll('.multiSelect-summary').forEach(item => {
                        item.setAttribute('aria-expanded', String(item === summary && panel.style.display !== 'none'));
                    });
                    positionSettingsMultiSelect(summary);
                };
                let panel = document.createElement('div');
                panel.className = 'multiSelect-popup-panel';
                panel.id = getUniqueId(`${field.key}_options`);
                panel.setAttribute('role', 'group');
                summary.setAttribute('aria-controls', panel.id);
                panel.style.display = 'none';
                panel.onclick = (e) => e.stopPropagation();

                listDiv.style.position = 'relative';
                listDiv.append(summary, panel);

                const updateSummary = () => {
                    let values = field.hasRange ? dataObj[field.key].slice(2) : dataObj[field.key];
                    let labels = values.map(v => t(field.multiSelectOptions.find(opt => opt.value === v)?.label || v));
                    selectedText.textContent = labels.join(', ') || t('cB.clickToSelect');
                    summary.title = labels.join(', ');
                    positionSettingsMultiSelect(summary);
                };

                renderCheckboxes(panel, updateSummary);
                updateSummary();
            } else {
                listDiv.classList.add('jpx-checkbox-options');
                renderCheckboxes(listDiv);
            }

            function renderCheckboxes(targetContainer, onUpdate) {
                field.multiSelectOptions.forEach(opt => {
                    let id = getUniqueId(`${field.key}_${opt.value}`);
                    let span = document.createElement('span');
                    span.style.cssText = 'display: inline-flex; align-items: center; margin-right: 8px;';

                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = id;
                    checkbox.checked = dataObj[field.key].includes(opt.value);
                    checkbox.onchange = e => {
                        if (e.target.checked) {
                            if (!dataObj[field.key].includes(opt.value)) dataObj[field.key].push(opt.value);
                        } else {
                            if (field.hasRange) dataObj[field.key] = [...dataObj[field.key].slice(0, 2), ...dataObj[field.key].slice(2).filter(v => v !== opt.value)];
                            else dataObj[field.key] = dataObj[field.key].filter(v => v !== opt.value);
                        }
                        if (onUpdate) onUpdate();
                    };

                    let label = document.createElement('label');
                    label.htmlFor = id;
                    label.textContent = t(opt.label);

                    span.append(checkbox, label)
                    targetContainer.appendChild(span);
                });
            }
        }

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
                    if (field.collapsibleItems) {
                        row.classList.add('jpx-rule-array-item');
                        const details = document.createElement('details');
                        details.className = 'jpx-rule-item';
                        details.open = fieldRenderers.expandedRuleItems.has(value);
                        const summary = document.createElement('summary');
                        const summaryText = document.createElement('span');
                        summaryText.className = 'jpx-rule-summary-text';
                        const heading = document.createElement('span');
                        heading.className = 'jpx-rule-summary-heading';
                        const name = document.createElement('span');
                        name.className = 'jpx-rule-item-name';
                        const meta = document.createElement('span');
                        meta.className = 'jpx-rule-item-meta';
                        const preview = document.createElement('span');
                        preview.className = 'jpx-rule-item-preview';
                        heading.append(name, meta);
                        summaryText.append(heading, preview);
                        summary.appendChild(summaryText);
                        const updateSummary = () => {
                            const type = t(`cB.${value.type}`);
                            const label = value.name ? t(`cB.${value.name}`) : value.customMessage || '';
                            const nameText = `${index + 1}. ${label ? `${type} · ${label}` : type}`;
                            if (name.textContent !== nameText) { name.textContent = nameText; name.title = nameText; }
                            const conditions = value.conditions || [];
                            const metaText = [t('cGen.conditionCount', { count: conditions.length }), value.disabled ? t('cGen.ruleDisabled') : ''].filter(Boolean).join(' · ');
                            if (meta.textContent !== metaText) meta.textContent = metaText;
                            const previewText = conditions.length ? conditions.map(condition => {
                                const raw = condition.value;
                                const formatted = Array.isArray(raw)
                                    ? raw.map(v => typeof v === 'string' ? t(`cB.${v}`) : String(v)).join(' / ')
                                    : typeof raw === 'boolean' ? t(raw ? 'cGen.on' : 'cGen.off') : typeof raw === 'string' ? raw : String(raw);
                                return `${t(`cB.${condition.key}`)}: ${formatted}`;
                            }).join('；') : t('cGen.noConditions');
                            if (preview.textContent !== previewText) { preview.textContent = previewText; preview.title = previewText; }
                        };
                        objDiv.classList.add('jpx-rule-item-body');
                        objDiv.addEventListener('input', updateSummary);
                        objDiv.addEventListener('change', updateSummary);
                        objDiv.addEventListener('click', updateSummary);
                        details.addEventListener('toggle', () => {
                            if (!details.isConnected) return;
                            // Bulk disclosure already updates the view state once.
                            if (fieldRenderers.expandedRuleItems.has(value) !== details.open) {
                                if (details.open) fieldRenderers.expandedRuleItems.add(value);
                                else fieldRenderers.expandedRuleItems.delete(value);
                                updateAllRulesToggle();
                            }
                            if (!details.open) {
                                objDiv.querySelectorAll('.multiSelect-popup-panel').forEach(panel => panel.style.display = 'none');
                                objDiv.querySelectorAll('.multiSelect-summary').forEach(input => input.setAttribute('aria-expanded', 'false'));
                            }
                        });
                        updateSummary();
                        details.append(summary, objDiv);
                        renderedRuleItems.set(value, details);
                        row.appendChild(details);
                    } else row.appendChild(objDiv);
                }

                if (itemSchema.type === 'object') bindSettingsChange(row, value, null,
                    row.querySelector('.jpx-rule-summary-heading') || row, true);
                renderRowButtons(row, index);
                listDiv.appendChild(row);
            });

            renderAddButtons(addBar || listDiv);
        };

        function renderArray() {
            for (const [item, details] of renderedRuleItems) {
                if (details.open) fieldRenderers.expandedRuleItems.add(item);
                else fieldRenderers.expandedRuleItems.delete(item);
            }
            renderedRuleItems.clear();
            const scrollTop = listDiv.scrollTop;
            listDiv.innerHTML = '';
            addBar?.replaceChildren();
            if (field.multiSelectOptions) renderMultiSelectMode();
            else renderDynamicListMode();
            if (field.collapsibleItems) updateAllRulesToggle();
            listDiv.scrollTop = scrollTop;
        }

        renderArray();
    },

    fieldPicker(container, field, dataObj) {
        if (field.statsEditor) return renderStatsFieldPicker(container, field, dataObj);
        let editFields = field.editFields || [];
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];

        container.innerHTML = `<div${field.class ? ` class="${field.class}"` : ''} style="margin-top:8px;">${t(field.label)}</div>`;

        let pickerWrap = document.createElement('div');
        pickerWrap.className = 'field-picker';
        pickerWrap.style.cssText = 'display: flex; gap: 12px; align-items: center; padding-left: 10px;';
        container.appendChild(pickerWrap);

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
        editBox.className = 'field-picker-edit';
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

    keyBasedObjectArray(container, field, dataObj) {
        let targetData = field.flatten ? dataObj : dataObj[field.key];

        container.innerHTML = `<div${field.class ? ` class="${field.class}"` : ''} style="font-weight:bold; margin-bottom:4px;">${t(field.label)}</div>`;

        let listDiv = document.createElement('div');
        if (field.fixedActions) listDiv.className = 'jpx-rule-scroll';
        container.appendChild(listDiv);
        const addBindingBar = document.createElement('div');
        addBindingBar.className = 'jpx-rule-add-actions';
        container.append(addBindingBar);

        function renderKeyBinding(key) {
            let row = document.createElement('div');
            row.className = 'jpx-keybinding-rule-group';
            row.style.cssText = 'border: 1px solid #444; padding: 10px; margin-bottom: 15px;';

            let header = document.createElement('div');
            header.className = 'jpx-keybinding-header';
            header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 5px;';

            let span = document.createElement('span');
            span.append(`${t('cB.binding')}: `);
            jpxUtils.createButton(span, {
                text: jpxUtils.formatKeyCombo(key, ' + '),
                onClick: (btn, e) => {
                    let originalText = btn.textContent;
                    btn.textContent = '...';
                    jpxUtils.captureKeyCombo(
                        (result) => {
                            let newKey = 'kb_' + result.comboString;
                            if (newKey === key) return renderAll();
                            if (targetData[newKey]) {
                                jpxUtils.createToast(t('cB.duplicateKeys'));
                                return renderAll();
                            }

                            let newEntries = Object.entries(targetData).map(([k, v]) => (k === key ? [newKey, v] : [k, v]));
                            for (const k in targetData) delete targetData[k];
                            Object.assign(targetData, Object.fromEntries(newEntries));

                            renderAll();
                        },
                        () => { btn.textContent = originalText; }
                    );
                }
            });
            header.appendChild(span);

            const deleteBindingButton = jpxUtils.createButton(header, {
                text: t('delete'),
                className: 'jpx-delete-button',
                onClick: () => { if(confirm(`${t('delete')} ${jpxUtils.formatKeyCombo(key, ' + ')}?`)) { delete targetData[key]; renderAll(); } } 
            });

            row.appendChild(header);
            bindSettingsChange(row, targetData, key, span);

            let arrayContainer = document.createElement('div');
            renderField(arrayContainer, {
                key,
                skipLabel: true,
                type: 'array',
                canDisable: field.canDisable,
                collapsibleItems: field.collapsibleItems,
                itemSchema: field.itemSchema,
            }, targetData);
            const toolbar = arrayContainer.querySelector(':scope > .jpx-rule-list-toolbar');
            if (toolbar) header.insertBefore(toolbar, deleteBindingButton);
            row.appendChild(arrayContainer);

            listDiv.appendChild(row);
        }

        function renderAll() {
            listDiv.innerHTML = '';
            Object.keys(targetData).forEach(k => {
                if (field.flatten && k.startsWith('kb_')) {
                    renderKeyBinding(k);
                } else if (!field.flatten) {
                    renderKeyBinding(k);
                }
            });
        }

        jpxUtils.createButton(addBindingBar, {
            text: t('cB.addNewKeyBinding'),
            onClick: (btn, e) => {
                let originalText = btn.textContent;
                btn.textContent = `... ${t('cB.recording')} ...`;
                jpxUtils.captureKeyCombo(
                    (result) => {
                        let newKey = 'kb_' + result.comboString;
                        if (targetData[newKey]) {
                            jpxUtils.createToast(t('cB.duplicateKeys'));
                        } else {
                            targetData[newKey] = [];
                        }
                        renderAll();
                        requestAnimationFrame(() => listDiv.lastElementChild?.scrollIntoView({ block: 'start' }));
                        btn.textContent = originalText;
                    },
                    () => { btn.textContent = originalText; }
                );
            }
        });

        renderAll();
    },

    conditionsArray(container, field, dataObj) {
        if (!Array.isArray(dataObj[field.key])) dataObj[field.key] = [];

        let listDiv = document.createElement('div');
        container.appendChild(listDiv);

        function createRow(item, index) {
            let selectId = getUniqueId('condition');

            let row = document.createElement('div');
            row.className = 'dynamic-array-row';

            let select = document.createElement('select');
            select.id = selectId;
            select.setAttribute('aria-label', `${t('conditions')} ${index + 1}`);
            field.options.forEach(opt => {
                let option = document.createElement('option');
                option.value = opt.key;
                option.textContent = t(opt.label);
                select.appendChild(option);
            });
            select.value = item.key ?? field.options[0]?.key;
            row.appendChild(select);

            let inputDiv = document.createElement('div');
            inputDiv.className = 'jpx-condition-value';
            row.appendChild(inputDiv);

            let extraDiv = document.createElement('div');
            extraDiv.className = 'jpx-condition-extra';
            row.appendChild(extraDiv);

            function renderInput() {
                inputDiv.innerHTML = '';
                inputDiv.classList.remove('jpx-range');
                extraDiv.innerHTML = '';

                let selectedOption = field.options.find(option => option.key === select.value);
                if (!selectedOption) return;

                if ((item.key !== undefined && item.key !== select.value) || item.key === undefined) {
                    Object.keys(item).forEach(k => delete item[k]);
                    item.key = selectedOption.key;
                    item.value = getDefaultValue(selectedOption.type, selectedOption.defaultValue);
                }

                if (selectedOption.extraFields) {
                    selectedOption.extraFields.forEach(f => {
                        if (item[f.key] === undefined) item[f.key] = getDefaultValue(f.type, f.defaultValue);
                    });
                }

                renderField(inputDiv, {
                    ...selectedOption,
                    key: 'value',
                    skipLabel: true,
                }, item);

                if (selectedOption.extraFields) {
                    selectedOption.extraFields.forEach(f => {
                        let wrap = document.createElement('div');
                        renderField(wrap, f, item);
                        extraDiv.appendChild(wrap);
                    });
                }
            }

            function getDefaultValue(type, defaultValue) {
                if (defaultValue !== undefined) return JSON.parse(JSON.stringify(defaultValue));

                switch (type) {
                    case 'boolean': return false;
                    case 'text': return '';
                    case 'number': return 0;
                    case 'rangeNumber': return [0, 0];
                    case 'array': return [];
                    case 'dropdown': return '';
                    default: return null;
                }
            }

            select.onchange = () => { renderInput(); };

            let deleteButton = jpxUtils.createButton(row, {
                className: 'jpx-delete-button',
                onClick: () => {
                    dataObj[field.key].splice(index, 1);
                    renderList();
                }
            });
            deleteButton.title = t('cGen.deleteCondition');
            deleteButton.setAttribute('aria-label', t('cGen.deleteCondition'));
            deleteButton.replaceChildren(createSettingsIcon('delete'));

            renderInput();
            bindSettingsChange(row, item, null, row, true);
            return row;
        }

        function renderList() {
            listDiv.innerHTML = '';
            dataObj[field.key].forEach((item, index) => {
                listDiv.appendChild(createRow(item, index));
            });
        }

        jpxUtils.createButton(container, {
            text: `${t('add')} ${t(field.key)}`,
            onClick: () => {
                let newItem = {};
                dataObj[field.key].push(newItem);
                let index = dataObj[field.key].length - 1;
                listDiv.appendChild(createRow(newItem, index));
            }
        });

        renderList();
    }
};

function renderField(container, field, dataObj) {
    if (field.label) container.dataset.editLabel = t(field.label);
    const renderer = fieldRenderers[field.type];
    if (renderer) renderer(container, field, dataObj);
    if (field.help) {
        const help = document.createElement('p');
        help.className = 'jpx-field-help';
        help.id = getUniqueId('help');
        help.textContent = t(field.help);
        container.querySelector('input, select, textarea')?.setAttribute('aria-describedby', help.id);
        container.appendChild(help);
    }
    if (!['group', 'heading', 'constant'].includes(field.type) && !field.hasModeDropdown) {
        const key = field.type === 'keyBasedObjectArray' && field.flatten
            ? value => Object.fromEntries(Object.entries(value || {}).filter(([name]) => name.startsWith('kb_')))
            : field.key;
        const badgeTarget = container.querySelector(':scope > label, :scope > .jpx-rule-list-heading') || container;
        bindSettingsChange(container, dataObj, key, badgeTarget);
    }
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
            keyBasedObjectArray: {},
        };

        obj[property.key] = typeof defaults[property.type] === 'function' ? defaults[property.type]() : defaults[property.type] ?? undefined;
    });

    return obj;
}

function getUniqueId(prefix = 'input') {
    return `${prefix}_${idCounter++}`;
}

function mergeCfg(storedCfg, defaultCfg, mergedCfg, mergedType) {
    let vKey = mergedType === 'battle' ? 'battleVersion' : 'statsVersion';
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
            if (localObj && Array.isArray(localObj.supports) && Array.isArray(localObj.attacks)) {
                mergedCfg[key] = localObj;
            } else {
                if (jpxUtils.isEmpty(defaultCfg[key])) continue;
                mergedCfg[key] = JSON.parse(JSON.stringify(defaultCfg[key]));
            }

            mergedCfg[key].supports.forEach(support => {
                //patch 20260309
                if (support.type === 'spellInstant' || support.type === 'spellDuration') {
                    support.type = 'spellSupport';
                } else if (support.type === 'itemInstant' || support.type === 'itemDuration') {
                    support.type = 'item';
                }
                //-
            });
            mergedCfg[key].attacks.forEach(attack => {
                //patch 20260103
                if (attack.type === 'target' && 'bottomUp' in attack) {
                    attack.priorityRule = attack.bottomUp ? 'Bottom Up' : 'Top Down';
                    delete attack.bottomUp;
                }
                //-
                //patch 20260507
                if (attack.type === 'smartDebuff') {
                    attack.targetCount = jpxUtils.parseValue(attack.targetCount);
                }
                //-
            });
        }

        for (const key in defaultCfg) {
            if (BATTLE_MODES.includes(key)) continue;
            mergedCfg[key] = (key in storedCfg) ? storedCfg[key] : defaultCfg[key];
        }
    } else if (mergedType === 'stats') {
        for (const key in defaultCfg) {
            mergedCfg[key] = JSON.parse(JSON.stringify((key in storedCfg) ? storedCfg[key] : defaultCfg[key]));
        }
        normalizeStatsConfig(mergedCfg);
    }
}

function renderSettings() {
    let container = document.getElementById('settings-container');
    if (container) {
        if (container.open) container.close();
        else container.remove();
        return;
    }

    ensureJpxStyle();

    const previouslyFocused = document.activeElement;
    container = document.createElement('dialog');
    container.id = 'settings-container';
    container.className = 'jpx-settings-dialog';
    container.tabIndex = -1;
    container.setAttribute('aria-label', 'JPX-PLUS');
    let editHistory = null;
    const disposeNativePickers = bindSettingsNativePickers(container);

    let windowPanel = document.createElement('div');
    windowPanel.className = 'jpx-settings-window';

    let titleBar = document.createElement('div');
    titleBar.className = 'jpx-settings-titlebar';

    let title = document.createElement('strong');
    title.className = 'jpx-settings-title';
    title.textContent = 'JPX-PLUS';
    titleBar.appendChild(title);
    const themeToggle = jpxUtils.createButton(titleBar, { id: 'jpx-theme-toggle', history: false, onClick: toggleJpxTheme });
    themeToggle.setAttribute('role', 'switch');

    let closeButton = jpxUtils.createButton(titleBar, {
        id: 'close-button',
        text: '×',
        onClick: () => container.close()
    });
    closeButton.setAttribute('aria-label', t('cGen.closeSettings'));
    const navigationButton = jpxUtils.createButton(titleBar, {
        id: 'jpx-settings-menu-button', history: false,
        onClick: () => setMobileNavigation(!container.classList.contains('jpx-settings-navigation-open'), true),
    });
    navigationButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    navigationButton.setAttribute('aria-controls', 'jpx-settings-navigation');
    navigationButton.setAttribute('aria-expanded', 'false');
    navigationButton.setAttribute('aria-label', t('cGen.settingsSections'));
    windowPanel.appendChild(titleBar);

    let tabHeader = document.createElement('nav');
    tabHeader.className = 'settings-tab-header';
    tabHeader.id = 'jpx-settings-navigation';
    tabHeader.setAttribute('role', 'tablist');
    tabHeader.setAttribute('aria-label', t('cGen.settingsSections'));
    let settingsWorkspace = document.createElement('div');
    settingsWorkspace.className = 'jpx-settings-workspace';
    let settingsPanels = document.createElement('div');
    settingsPanels.className = 'jpx-settings-panels';
    const sidebar = document.createElement('div');
    sidebar.className = 'jpx-settings-sidebar';
    let sidebarCollapsed = localStorage.getItem(prefix + 'settingsSidebarCollapsed') === 'true';
    const sidebarToggle = jpxUtils.createButton(sidebar, {
        className: 'jpx-settings-sidebar-toggle',
        onClick: () => {
            sidebarCollapsed = !sidebarCollapsed;
            localStorage.setItem(prefix + 'settingsSidebarCollapsed', String(sidebarCollapsed));
            updateSidebar();
        }
    });
    sidebarToggle.setAttribute('aria-controls', tabHeader.id);
    function updateSidebar() {
        settingsWorkspace.classList.toggle('sidebar-collapsed', sidebarCollapsed);
        const label = t(sidebarCollapsed ? 'cGen.expandSidebar' : 'cGen.collapseSidebar');
        sidebarToggle.setAttribute('aria-expanded', String(!sidebarCollapsed));
        sidebarToggle.setAttribute('aria-label', label);
        sidebarToggle.title = label;
        sidebarToggle.replaceChildren(createSettingsIcon(sidebarCollapsed ? 'expand' : 'collapse'));
    }
    updateSidebar();
    sidebar.appendChild(tabHeader);
    settingsWorkspace.append(sidebar, settingsPanels);
    function setMobileNavigation(open, focus = false) {
        const mobile = container.classList.contains('jpx-settings-mobile');
        open = mobile && open;
        container.classList.toggle('jpx-settings-navigation-open', open);
        sidebar.inert = mobile && !open;
        navigationButton.setAttribute('aria-expanded', String(open));
        if (open) {
            fieldRenderers.dragState.cancel?.();
            closeMultiSelectPopups();
            container.querySelectorAll('[popover]:popover-open').forEach(popup => popup.hidePopover());
        }
        if (focus) (open ? tabHeader.querySelector('[aria-selected=true]') : navigationButton)?.focus({ preventScroll: true });
    }
    windowPanel.appendChild(settingsWorkspace);
    const viewport = window.visualViewport;
    const touchMedia = window.matchMedia('(pointer: coarse)');
    // Compensate the game's initial shrink-to-fit only. Subsequent pinch zoom
    // keeps its normal magnification; the game viewport itself is untouched.
    let pageScale = 1 / Math.min(1, viewport?.scale || 1);
    let screenWidth = Math.round((viewport?.width || window.innerWidth) * (viewport?.scale || 1));
    const updateSettingsViewport = () => {
        const width = viewport?.width || window.innerWidth;
        const height = viewport?.height || window.innerHeight;
        const physicalWidth = width * (viewport?.scale || 1);
        const physicalHeight = height * (viewport?.scale || 1);
        // Rotation can also magnify the fixed-width game. A pinch leaves the
        // physical viewport width unchanged, so its magnification is retained.
        if (Math.abs(Math.round(physicalWidth) - screenWidth) > 1) {
            pageScale = 1 / (viewport?.scale || 1);
            screenWidth = Math.round(physicalWidth);
        }
        const mobile = physicalWidth <= 650 || (touchMedia.matches && physicalWidth <= 1024 && physicalHeight <= 600);
        const changed = mobile !== container.classList.contains('jpx-settings-mobile');
        container.classList.toggle('jpx-settings-mobile', mobile);
        if (mobile) {
            container.style.setProperty('--settings-left', `${viewport?.offsetLeft || 0}px`);
            container.style.setProperty('--settings-top', `${viewport?.offsetTop || 0}px`);
            container.style.setProperty('--settings-width', `${width / pageScale}px`);
            container.style.setProperty('--settings-height', `${height / pageScale}px`);
            container.style.setProperty('--settings-scale', pageScale);
        }
        if (changed || !tabHeader.hasAttribute('aria-orientation')) {
            tabHeader.setAttribute('aria-orientation', 'vertical');
            closeButton.textContent = mobile ? `‹ ${t('cGen.back')}` : '×';
            closeButton.setAttribute('aria-label', t(mobile ? 'cGen.back' : 'cGen.closeSettings'));
            title.textContent = mobile ? t('cGen.settings') : 'JPX-PLUS';
        }
        if (changed) setMobileNavigation(false);
        if (changed) switchTab(tabs.find(tab => tab.btn.getAttribute('aria-selected') === 'true')?.id || 'battle', tabs);
        container.querySelectorAll('.multiSelect-summary[aria-expanded=true]').forEach(positionSettingsMultiSelect);
    };
    tabHeader.addEventListener('keydown', event => {
        const currentIndex = tabs.findIndex(tab => tab.btn === event.target.closest('[role=tab]'));
        if (currentIndex < 0) return;
        let nextIndex = currentIndex;
        const vertical = tabHeader.getAttribute('aria-orientation') === 'vertical';
        if ((vertical && event.key === 'ArrowDown') || (!vertical && event.key === 'ArrowRight')) nextIndex = (currentIndex + 1) % tabs.length;
        else if ((vertical && event.key === 'ArrowUp') || (!vertical && event.key === 'ArrowLeft')) nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[nextIndex].btn.focus();
        switchTab(tabs[nextIndex].id, tabs);
    });

    function closeMultiSelectPopups() {
        container.querySelectorAll('.multiSelect-popup-panel').forEach(panel => panel.style.display = 'none');
        container.querySelectorAll('.multiSelect-summary').forEach(summary => summary.setAttribute('aria-expanded', 'false'));
    }
    const onPointerDown = event => {
        if (container.classList.contains('jpx-settings-navigation-open') &&
            !sidebar.contains(event.target) && !navigationButton.contains(event.target)) {
            setMobileNavigation(false, sidebar.contains(document.activeElement));
        }
        if (!event.target.closest?.('.multiSelect-popup-panel, .multiSelect-summary')) closeMultiSelectPopups();
    };
    const onNavigationFocus = event => {
        if (container.classList.contains('jpx-settings-navigation-open') &&
            !sidebar.contains(event.target) && !navigationButton.contains(event.target)) setMobileNavigation(false);
    };
    const onKeyDown = event => {
        if (event.key !== 'Escape') return;
        if (container.classList.contains('jpx-settings-navigation-open')) {
            event.preventDefault();
            event.stopPropagation();
            setMobileNavigation(false, true);
            return;
        }
        if (fieldRenderers.dragState.cancel) {
            event.preventDefault();
            event.stopPropagation();
            fieldRenderers.dragState.cancel();
            return;
        }
        const sortMenu = container.querySelector('.jpx-rule-sort-popover:popover-open');
        if (sortMenu) {
            event.preventDefault();
            event.stopPropagation();
            const anchor = container.querySelector(`[aria-controls="${sortMenu.id}"]`);
            sortMenu.hidePopover();
            anchor?.focus({ preventScroll: true });
            return;
        }
        const hasOpenPopup = [...container.querySelectorAll('.multiSelect-popup-panel')]
            .some(panel => panel.style.display !== 'none');
        if (hasOpenPopup) {
            event.preventDefault();
            event.stopPropagation();
            closeMultiSelectPopups();
        }
    };
    const cleanup = () => {
        disposeNativePickers();
        editHistory?.dispose();
        if (settingsEditHistory === editHistory) settingsEditHistory = null;
        jpxUtils.keyCaptureController?.abort();
        fieldRenderers.dragState.cancel?.();
        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('keydown', onKeyDown, true);
        container.removeEventListener('focusin', onNavigationFocus);
        window.removeEventListener('resize', updateSettingsViewport);
        viewport?.removeEventListener('resize', updateSettingsViewport);
        viewport?.removeEventListener('scroll', updateSettingsViewport);
        touchMedia.removeEventListener('change', updateSettingsViewport);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    container.addEventListener('focusin', onNavigationFocus);
    container.addEventListener('close', () => {
        cleanup();
        container.remove();
        if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    }, { once: true });

    function saveBattleConfig() {
        let modeKey = document.querySelector('[data-role="battleMode"]')?.dataset.currentValue;
        for (const key of BATTLE_MODES) {
            if (
                key !== modeKey && !key.includes('_General') && cfgBattle[key] && jpxUtils.isEmpty(defaultCfgBattle[key]) &&
                Array.isArray(cfgBattle[key].supports) && cfgBattle[key].supports.length === 0 &&
                Array.isArray(cfgBattle[key].attacks) && cfgBattle[key].attacks.length === 0 &&
                !Object.keys(cfgBattle[key]).some(key => key.startsWith('kb_'))
            ) {
                delete cfgBattle[key];
                jpxUtils.createToast(`Removed empty ruleset: ${key}`, 5000);
            }
        }
        console.log(cfgBattle);
        localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
        localStorage.setItem(prefix + 'userKeybinds' + isekaiSuffix, JSON.stringify(userKeybinds));
        jpxPanelManager.refreshAppearance?.();
    }

    function saveKeyBindings() {
        localStorage.setItem(prefix + 'userKeybinds' + isekaiSuffix, JSON.stringify(userKeybinds));
    }

    function refreshBattleViews() {
        [
            { id: 'cfgBattle-ui', schema: cfgBattleSettingsSchema },
            { id: 'cfgBattle-rules-ui', schema: cfgBattleRulesSchema },
        ].forEach(({ id, schema }) => {
            let oldUI = document.getElementById(id);
            if (!oldUI) return;
            let newUI = document.createElement('div');
            newUI.id = id;
            oldUI.replaceWith(newUI);
            if (schema === cfgBattleRulesSchema) renderBattleRulesUI(newUI);
            else renderSchema(newUI, schema, cfgBattle);
        });
    }

    function exportBattleConfig() {
        return { data: cfgBattle, fileName: `cfgBattle${!isekaiSuffix ? '_Persistent' : '_Isekai'}.txt`, depth: 3 };
    }

    function importBattleConfig(content) {
        let data = JSON.parse(content);
        if ([...BATTLE_MODES, 'Battlecaster_General'].some(key => Object.entries(data[key] || {}).some(([group, rules]) =>
            (group === 'supports' || group === 'attacks' || group.startsWith('kb_')) &&
            Array.isArray(rules) && rules.some(rule => rule?.type === 'kamisamaniNattaHi'))) && !confirm(t('cB.importCustomCodeWarning'))) {
            throw new Error('Custom code import rejected');
        }
        mergeCfg(data, cfgBattle, cfgBattle, 'battle');
        return { refreshBattleViews: true, transModeKey: true };
    }

    // Load every configuration before taking the history baseline, but build each
    // tab only when visited. Battle rules can contain thousands of hidden controls.
    loadStatsSettingsConfig();
    statsSettingsView = { section: 'combatRows', fields: {} };
    battleRulesView = { section: 'supports', scroll: {} };
    let tabs = [
        {
            id: 'battle',
            text: t('cB.basicSettings'),
            saveBtnText: t('cB.saveBattleConfig'),
            exportBtnText: t('cB.exportBattleConfig'),
            importBtnText: t('cB.importBattleConfig'),
            render: renderBattleTab,
            onSave: saveBattleConfig,
            onExport: exportBattleConfig,
            onImport: importBattleConfig,
        },
        {
            id: 'keyBindings',
            text: t('cB.keyBindings'),
            saveBtnText: t('cB.saveKeyBindings'),
            render: renderKeybindingsTab,
            onSave: saveKeyBindings,
            showTransfer: false,
        },
        {
            id: 'battleRules',
            text: t('cB.battleRules'),
            saveBtnText: t('cB.saveBattleConfig'),
            exportBtnText: t('cB.exportBattleConfig'),
            importBtnText: t('cB.importBattleConfig'),
            render: renderBattleRulesTab,
            onSave: saveBattleConfig,
            onExport: exportBattleConfig,
            onImport: importBattleConfig,
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
                validateStatsConfig(data);
                mergeCfg(data, cfgStats, cfgStats, 'stats');
                delete cfgStats.darkMode;
                return { refreshStats: true };
            },
        },
    ];
    function mountTab(tab) {
        tab.btn = jpxUtils.createButton(tabHeader, {
            className: 'settings-tab-btn',
            text: tab.text,
            history: false,
            onClick: () => {
                editHistory?.breakTypingGroup(); switchTab(tab.id, tabs);
                if (container.classList.contains('jpx-settings-mobile')) setMobileNavigation(false, true);
            },
        });
        tab.btn.id = `tab_${tab.id}`;
        const tabLabel = document.createElement('span');
        tabLabel.className = 'jpx-tab-label';
        tabLabel.textContent = tab.text;
        tab.btn.replaceChildren(createSettingsIcon(tab.plugin ? 'plugin' : tab.id), tabLabel);
        tab.btn.title = tab.text;
        tab.btn.setAttribute('aria-label', tab.text);
        tab.btn.setAttribute('role', 'tab');
        tab.btn.setAttribute('aria-controls', `panel_${tab.id}`);
        tab.btn.setAttribute('aria-selected', 'false');

        tab.panel = document.createElement('div');
        tab.panel.id = `panel_${tab.id}`;
        tab.panel.setAttribute('role', 'tabpanel');
        tab.panel.setAttribute('aria-labelledby', tab.btn.id);
        tab.panel.style.display = 'none';

        tab.rendered = false;
        settingsPanels.appendChild(tab.panel);
    }
    tabs.forEach(mountTab);
    const draftWorld = isekaiSuffix ? 'Isekai' : 'Persistent';
    const selectedDraftMode = () => document.querySelector('[data-role="battleMode"]')?.dataset.currentValue || getBattleMode('OneHanded');
    const hasDraftRules = mode => mode && Array.isArray(mode.supports) && Array.isArray(mode.attacks) &&
        (mode.supports.length || mode.attacks.length || Object.entries(mode).some(([key, value]) => key.startsWith('kb_') && Array.isArray(value) && value.length));
    const readDraftBattle = world => {
        if (world === draftWorld) return cfgBattle;
        if (!['Persistent', 'Isekai'].includes(world)) return null;
        try {
            const saved = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + (world === 'Isekai' ? '_isekai' : '')) || 'null');
            if (!saved || Array.isArray(saved) || typeof saved !== 'object' ||
                (saved.battleVersion || saved.version || 0) < defaultCfgBattle.battleVersion) return null;
            // Apply existing migrations on this detached copy, without filling an unvisited world with defaults.
            mergeCfg(saved, { battleVersion: defaultCfgBattle.battleVersion }, saved, 'battle');
            return saved;
        } catch { return null; }
    };
    const mountPlugins = () => {
        for (const plugin of settingsPlugins.values()) {
            if (tabs.some(tab => tab.id === plugin.id)) continue;
            const tab = { id: plugin.id, text: String(plugin.title()), plugin: true, showTransfer: false,
                render: parent => plugin.render(parent, {
                    version: window.JPXPlus.version,
                    translate: t,
                    notify: message => jpxUtils.createToast(String(message)),
                    listDrafts() {
                        const drafts = [], selected = selectedDraftMode();
                        for (const world of [draftWorld, draftWorld === 'Persistent' ? 'Isekai' : 'Persistent']) {
                            const data = readDraftBattle(world);
                            if (!data) continue;
                            const modes = BATTLE_MODES.filter(mode => hasDraftRules(data[mode]));
                            const source = world === draftWorld ? 'draft' : 'saved';
                            for (const mode of modes) drafts.push({ kind: 'battle-mode', world, mode, source,
                                supports: data[mode].supports.length, attacks: data[mode].attacks.length,
                                current: world === draftWorld && mode === selected });
                            if (modes.length) drafts.push({ kind: 'battle', world, source, modes: modes.length, current: world === draftWorld });
                        }
                        drafts.push({ kind: 'stats', world: 'Any', source: 'draft', current: true });
                        return drafts;
                    },
                    getDraft(kind, selection = {}) {
                        if (!['battle-mode', 'battle', 'stats'].includes(kind)) throw new Error('Invalid configuration type');
                        const world = selection.world || (kind === 'stats' ? 'Any' : draftWorld);
                        if (kind === 'stats' ? world !== 'Any' : !['Persistent', 'Isekai'].includes(world)) throw new Error('Invalid configuration world');
                        const battle = kind === 'stats' ? null : readDraftBattle(world);
                        if (kind !== 'stats' && !battle) throw new Error('Configuration unavailable');
                        const mode = selection.mode || selectedDraftMode();
                        if (kind === 'battle-mode' && (!BATTLE_MODES.includes(mode) || !hasDraftRules(battle[mode]))) throw new Error('Configuration unavailable');
                        const data = kind === 'stats' ? cfgStats : kind === 'battle' ? battle :
                            { battleVersion: battle.battleVersion, [mode]: battle[mode] };
                        return JSON.parse(JSON.stringify({ schemaVersion: 1, kind, title: '', description: '',
                            world,
                            ...(kind === 'battle-mode' ? { mode } : {}), scriptVersion: window.JPXPlus.version, config: data }));
                    },
                    importConfig(envelope) {
                        if (!container.isConnected || !container.open) throw new Error('Settings closed');
                        const copy = JSON.parse(JSON.stringify(envelope), (key, value) => {
                            if (['__proto__', 'prototype', 'constructor'].includes(key)) throw new Error('Invalid configuration key');
                            return value;
                        });
                        if (!copy || !['battle-mode', 'battle', 'stats'].includes(copy.kind) || !copy.config ||
                            Array.isArray(copy.config) || typeof copy.config !== 'object') throw new Error('Invalid configuration');
                        const target = copy.kind === 'stats' ? 'stats' : 'battleRules';
                        const targetTab = tabs.find(item => item.id === target);
                        let config = copy.config;
                        if (copy.kind === 'battle-mode') {
                            if (!BATTLE_MODES.includes(copy.mode) || !config[copy.mode]) throw new Error('Invalid battle mode');
                            config = { battleVersion: config.battleVersion, [copy.mode]: config[copy.mode] };
                        }
                        const versionKey = copy.kind === 'stats' ? 'statsVersion' : 'battleVersion';
                        const requiredVersion = copy.kind === 'stats' ? defaultCfgStats.statsVersion : defaultCfgBattle.battleVersion;
                        if ((config[versionKey] || config.version || 0) < requiredVersion) throw new Error('Unsupported configuration version');
                        if (copy.kind !== 'stats') {
                            // Use the editor's schema so a plugin cannot import rules it cannot render.
                            const groups = cfgBattleSchema.properties.find(field => field.key === 'modes').itemSchema.properties;
                            const conditions = new Map([...conditionsGeneral, ...conditionsTarget].map(field => [field.key, field]));
                            const object = value => value && typeof value === 'object' && !Array.isArray(value);
                            for (const mode of [...BATTLE_MODES, 'Battlecaster_General']) {
                                if (!(mode in config)) continue;
                                const data = config[mode];
                                if (copy.kind === 'battle' && object(data) && !Object.keys(data).length) continue;
                                if (!object(data) || !Array.isArray(data.supports) || !Array.isArray(data.attacks)) throw new Error('Invalid battle rules');
                                for (const [key, rules] of Object.entries(data)) {
                                    const group = groups.find(field => field.key === (key.startsWith('kb_') ? 'keyBindings' : key));
                                    if (!group) continue;
                                    if (!Array.isArray(rules)) throw new Error('Invalid battle rules');
                                    for (const rule of rules) {
                                        if (!object(rule) || !Object.hasOwn(group.itemSchema.oneOf, rule.type) ||
                                            ('conditions' in rule && !Array.isArray(rule.conditions))) throw new Error('Unsupported battle rule');
                                        for (const condition of rule.conditions || []) {
                                            const field = object(condition) && conditions.get(condition.key);
                                            if (!field || (field.type === 'boolean' ? typeof condition.value !== 'boolean' :
                                                field.type === 'text' ? typeof condition.value !== 'string' : !Array.isArray(condition.value))) throw new Error('Invalid battle condition');
                                        }
                                    }
                                }
                            }
                        }
                        // Build the target before applying the import; lazy renderers load saved settings.
                        switchTab(target, tabs);
                        editHistory.run(t('cGen.importConfig'), () => {
                            const info = targetTab.onImport(JSON.stringify(config));
                            if (copy.mode) document.getElementById('import-button').dataset.battleMode = copy.mode;
                            if (info.refreshStats) renderStatsSettingsUI(document.getElementById('cfgStats-ui'));
                            else refreshBattleViews();
                        });
                        return true;
                    }
                }) };
            tabs.push(tab); mountTab(tab);
        }
    };
    mountPlugins();
    window.addEventListener('jpx:settings-plugin', mountPlugins);
    container.addEventListener('close', () => window.removeEventListener('jpx:settings-plugin', mountPlugins), { once: true });

    let buttonsUI = document.createElement('div');
    buttonsUI.className = 'jpx-settings-footer';

    jpxUtils.createButton(buttonsUI, {
        id: 'export-button',
        onClick: () => {
            let activeTab = tabs.find(t => t.panel.style.display === 'flex');
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
        }
    });

    jpxUtils.createButton(buttonsUI, {
        id: 'import-button',
        onClick: (btn) => {
            let activeTab = tabs.find(t => t.panel.style.display === 'flex');
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
                        if (!container.isConnected) return resolve();
                        editHistory.run(t('cGen.importConfig'), () => {
                        let info = activeTab.onImport(content);

                        if (info.transModeKey) {
                            let modeKey = document.querySelector('[data-role="battleMode"]')?.dataset.currentValue;
                            if (modeKey) btn.dataset.battleMode = modeKey;
                        }

                        if (info.refreshBattleViews) {
                            refreshBattleViews();
                        } else if (info.refreshStats) {
                            renderStatsSettingsUI(document.getElementById('cfgStats-ui'));
                        } else {
                            let oldUI = document.getElementById(info.uiId);
                            let newUI = document.createElement('div');
                            newUI.id = info.uiId;
                            if (oldUI) oldUI.replaceWith(newUI);
                            renderSchema(newUI, info.schema, info.cfg);
                        }
                        });

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

    jpxUtils.createButton(buttonsUI, {
        id: 'save-button',
        history: false,
        onClick: (btn) => {
            let activeTab = tabs.find(t => t.panel.style.display === 'flex');
            if (!activeTab || !activeTab.onSave) return t('cGen.error!');
            if (activeTab.onSave() === false) return t('cGen.error!');
            editHistory.markSaved(activeTab.id === 'stats' ? ['stats'] : activeTab.id === 'keyBindings' ? ['shortcuts'] : ['battle', 'shortcuts']);
            editHistory.breakTypingGroup();
            return t('cGen.saved!');
        }
    });

    const fileActions = document.createElement('div');
    fileActions.className = 'jpx-settings-file-actions';
    fileActions.append(...buttonsUI.children);
    buttonsUI.appendChild(fileActions);
    windowPanel.appendChild(buttonsUI);
    container.appendChild(windowPanel);
    document.body.appendChild(container);

    applyJpxTheme();
    switchTab('battle', tabs);
    editHistory = createSettingsEditHistory(container, buttonsUI, view => {
        closeMultiSelectPopups();
        if (view.mode) document.getElementById('import-button').dataset.battleMode = view.mode;
        refreshBattleViews();
        const shortcuts = tabs.find(tab => tab.id === 'keyBindings');
        if (shortcuts.rendered) {
            shortcuts.panel.replaceChildren();
            renderKeybindingsTab(shortcuts.panel);
        }
        const stats = document.getElementById('cfgStats-ui');
        if (stats) renderStatsSettingsUI(stats, true);
        switchTab(view.tab, tabs);
        view.scroll.forEach(([id, top]) => { document.getElementById(id).scrollTop = top; });
    });
    settingsEditHistory = editHistory;
    updateSettingsViewport();
    window.addEventListener('resize', updateSettingsViewport);
    viewport?.addEventListener('resize', updateSettingsViewport);
    viewport?.addEventListener('scroll', updateSettingsViewport);
    touchMedia.addEventListener('change', updateSettingsViewport);
    container.showModal();
    container.focus({ preventScroll: true });
}

function switchTab(targetId, tabs) {
    if (targetId !== 'stats') captureStatsListScroll(document.getElementById('cfgStats-ui'));
    tabs.forEach(tab => {
        let isActive = (tab.id === targetId);
        if (isActive && !tab.rendered) {
            tab.render(tab.panel);
            tab.rendered = true;
        }
        if (!isActive) tab.panel.querySelectorAll('[popover]:popover-open').forEach(popup => popup.hidePopover());

        tab.btn.setAttribute('aria-selected', String(isActive));
        tab.panel.style.display = isActive ? 'flex' : 'none';

        if (isActive) {
            const footer = document.querySelector('#settings-container .jpx-settings-footer');
            if (footer) footer.style.display = tab.plugin ? 'none' : '';
            const mobile = document.getElementById('settings-container')?.classList.contains('jpx-settings-mobile');
            if (mobile) document.querySelector('#settings-container .jpx-settings-title').textContent = tab.text;
            let saveBtn = document.getElementById('save-button');
            let exportBtn = document.getElementById('export-button');
            let importBtn = document.getElementById('import-button');

            if (saveBtn) {
                saveBtn.textContent = mobile ? t('cGen.save') : tab.saveBtnText || 'Save Settings';
                saveBtn.title = tab.saveBtnText || 'Save Settings';
            }
            if (exportBtn) {
                exportBtn.textContent = mobile ? t('cGen.export') : tab.exportBtnText || 'Export Settings';
                exportBtn.title = tab.exportBtnText || 'Export Settings';
                exportBtn.style.display = tab.showTransfer === false ? 'none' : '';
            }
            if (importBtn) {
                importBtn.textContent = mobile ? t('cGen.import') : tab.importBtnText || 'Import Settings';
                importBtn.title = tab.importBtnText || 'Import Settings';
                importBtn.style.display = tab.showTransfer === false ? 'none' : '';
            }
        }
    });
    if (targetId === 'stats') restoreStatsListScroll(document.getElementById('cfgStats-ui'));
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

    let cfgBattleUI = document.createElement('div');
    cfgBattleUI.id = 'cfgBattle-ui';
    parent.appendChild(cfgBattleUI);
    renderSchema(cfgBattleUI, cfgBattleSettingsSchema, cfgBattle);
}

function renderKeybindingsTab(parent) {
    const intro = document.createElement('div');
    intro.className = 'heading';
    intro.textContent = t('cB.keyBindings');
    parent.appendChild(intro);

    let keybindsUI = document.createElement('div');
    keybindsUI.className = 'jpx-keybindings-settings';
    Object.keys(KEYBINDS).forEach(action => {
        let row = document.createElement('div');
        bindSettingsChange(row, userKeybinds, action);

        let span = document.createElement('span');
        span.textContent = t(`cB.${action}`) + ': ';
        row.appendChild(span);

        jpxUtils.createButton(row, {
            id: `btn_${action}`,
            text: jpxUtils.formatKeyCombo(userKeybinds[action], ' + '),
            onClick: (btn, e) => {
                e.stopPropagation();
                let originalText = btn.textContent;
                btn.textContent = '...';
                jpxUtils.captureKeyCombo(
                    (result) => {
                        userKeybinds[action] = {
                            key: result.key,
                            ctrl: result.ctrl,
                            alt: result.alt,
                            shift: result.shift
                        };
                        btn.textContent = jpxUtils.formatKeyCombo(userKeybinds[action], ' + ');
                    },
                    () => { btn.textContent = originalText; }
                );
            }
        });
        keybindsUI.appendChild(row);
    });
    parent.appendChild(keybindsUI);
}

function renderBattleRulesUI(container) {
    renderSchema(container, cfgBattleRulesSchema, cfgBattle);
    // Keep mode-level actions mounted when import, reset or history rebuilds the rule editor.
    const selection = container.parentElement.querySelector('.jpx-rule-mode-selection');
    selection.replaceChildren(container.querySelector('.jpx-battle-mode-selects'));
}

function renderBattleRulesTab(parent) {
    const modeHeader = document.createElement('div');
    modeHeader.className = 'jpx-rule-mode-header';
    const modeSelection = document.createElement('div');
    modeSelection.className = 'jpx-rule-mode-selection';
    const modeActions = document.createElement('div');
    modeActions.className = 'jpx-rule-mode-actions';
    modeHeader.append(modeSelection, modeActions);
    parent.append(modeHeader);
    let cfgBattleRulesUI = document.createElement('div');
    cfgBattleRulesUI.id = 'cfgBattle-rules-ui';
    parent.appendChild(cfgBattleRulesUI);
    renderBattleRulesUI(cfgBattleRulesUI);

    const exportModeButton = jpxUtils.createButton(modeActions, {
        id: 'export-current-button',
        text: t('cB.exportModeShort'),
        onClick: () => {
            let modeKey = document.querySelector('[data-role="battleMode"]')?.dataset.currentValue;
            if (!cfgBattle[modeKey]) return t('cGen.exportFailed!');
            let exportData = { [modeKey]: cfgBattle[modeKey], battleVersion: cfgBattle.battleVersion };
            let blob = new Blob([jpxUtils.stringifyLimited(exportData, 3)], { type: 'text/plain;charset=utf-8' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = `cfgBattle${!isekaiSuffix ? '_Persistent' : '_Isekai'}_${modeKey}.txt`;
            a.click();
            URL.revokeObjectURL(url);

            return t('cGen.exported!');
        }
    });

    exportModeButton.title = t('cB.exportCurrentBattleMode');
    exportModeButton.setAttribute('aria-label', exportModeButton.title);

    const resetModeButton = jpxUtils.createButton(modeActions, {
        id: 'reset-current-button',
        text: t('cB.resetModeShort'),
        onClick: (btn) => {
            let modeKey = document.querySelector('[data-role="battleMode"]')?.dataset.currentValue;
            cfgBattle[modeKey] = !jpxUtils.isEmpty(defaultCfgBattle[modeKey]) ? JSON.parse(JSON.stringify(defaultCfgBattle[modeKey])) : {};
            btn.dataset.battleMode = modeKey;

            let oldUI = document.getElementById('cfgBattle-rules-ui');
            let newUI = document.createElement('div');
            newUI.id = 'cfgBattle-rules-ui';
            if (oldUI) {
                oldUI.replaceWith(newUI);
                renderBattleRulesUI(newUI);
            }

            return t('cGen.reset!');
        }
    });
	
    resetModeButton.title = t('cB.resetCurrentBattleMode');
    resetModeButton.setAttribute('aria-label', resetModeButton.title);

    const styleControl = document.createElement('div');
    styleControl.className = 'jpx-style-override';
    const choices = [['melee', 'fire', 0], ['fireMage', 'fire', 9999], ['coldMage', 'cold', 9999], ['windMage', 'wind', 9999], ['elecMage', 'elec', 9999], ['holyMage', 'holy', 9999], ['darkMage', 'dark', 9999]];
    let current = spellDamageBonus;
    try { current = JSON.parse(localStorage.getItem(prefix + 'spellDamageBonus' + isekaiSuffix)) || current; }
    catch { /* Retain the current page's detected value if storage is unreadable. */ }
    const selected = choices.find(([, type, value]) => current.maxType === type && current.maxValue === value);
    const label = document.createElement('label');
    label.id = 'jpx-style-override-label';
    label.className = 'jpx-style-override-label';
    label.textContent = t('cB.force');
    const select = document.createElement('select');
    select.id = 'jpx-style-override-select';
    label.htmlFor = select.id;
    if (!selected) {
        const detected = document.createElement('option');
        detected.value = '';
        detected.textContent = t('cB.currentStyle');
        detected.disabled = true;
        select.append(detected);
    }
    choices.forEach(([name]) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = t(`cB.${name}`);
        select.append(option);
    });
    const currentValue = selected?.[0] || '';
    select.value = currentValue;
    select.addEventListener('change', () => {
        const choice = choices.find(([name]) => name === select.value);
        if (!choice || select.value === currentValue) return;
        if (!confirm(t('cB.reloadWarning'))) { select.value = currentValue; return; }
        const [, type, value] = choice;
        localStorage.setItem(prefix + 'spellDamageBonus' + isekaiSuffix, JSON.stringify({ maxType: type, maxValue: value }));
        window.location.href = window.location.href;
    });
    styleControl.append(label, select);
    modeHeader.insertBefore(styleControl, modeActions);
}

// Legacy lists contain only displayed fields. Keep their order/styles and append missing fields disabled.
function normalizeStatsConfig(data) {
    for (const field of cfgStatsSchema.properties.filter(field => field.statsEditor)) {
        const known = new Set(field.allFields.map(item => item.id)), seen = new Set();
        const items = (Array.isArray(data[field.key]) ? data[field.key] : []).filter(item => {
            if (!item || !known.has(item.id) || seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
        });
        for (const base of field.allFields) {
            if (!seen.has(base.id)) items.push({ ...defaultCfgStats[field.key].find(item => item.id === base.id), id: base.id, disabled: true });
        }
        data[field.key] = items;
    }
}

function validateStatsConfig(data) {
    const invalid = () => { throw new Error(t('cS.invalidConfig')); };
    if (!data || Array.isArray(data) || typeof data !== 'object' ||
        !['statsVersion', 'combatRows', 'revenueRows', 'statsColumns'].some(key => key in data)) invalid();
    for (const field of cfgStatsSchema.properties.filter(field => field.statsEditor)) {
        if (!(field.key in data)) continue;
        const seen = new Set();
        if (!Array.isArray(data[field.key])) invalid();
        for (const item of data[field.key]) {
            if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id)) invalid();
            seen.add(item.id);
            if ('disabled' in item && typeof item.disabled !== 'boolean') invalid();
            if (field.editFields.some(edit => edit.key in item && typeof item[edit.key] !== 'string')) invalid();
        }
    }
}

function validateStatsBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || !data.stores || typeof data.stores !== 'object' ||
        !Array.isArray(data.stores.battleRecords)) throw new Error(t('cS.invalidBackup'));
    for (const record of data.stores.battleRecords) {
        if (!record || typeof record !== 'object' || !Number.isFinite(Number(record.timestamp))) throw new Error(t('cS.invalidBackup'));
    }
}

function renderStatsImportPreview(parent, data, fileName) {
    parent.querySelector('.jpx-stats-transfer')?.remove();
    const panel = document.createElement('div');
    panel.className = 'jpx-stats-transfer';
    const title = document.createElement('strong');
    title.textContent = t('cS.importPreview');
    const summary = document.createElement('p');
    summary.className = 'jpx-stats-help';
    summary.textContent = `${fileName} · ${t('cS.importSummary', { count: data.stores.battleRecords.length })}`;
    const modeLabel = document.createElement('label');
    modeLabel.textContent = t('cS.importMode');
    const mode = document.createElement('select');
    mode.innerHTML = `<option value="merge">${t('cS.importMerge')}</option><option value="replace">${t('cS.importReplace')}</option>`;
    modeLabel.appendChild(mode);
    const actions = document.createElement('div');
    actions.className = 'jpx-stats-toolbar';
    const confirmButton = jpxUtils.createButton(actions, {
        text: t('cS.importConfirmAction'), history: false, onClick: async button => {
            button.disabled = true;
            try {
                await importIndexedDB(data, mode.value === 'merge');
                panel.remove();
                jpxUtils.createToast(t('cGen.imported!'));
            } catch (error) {
                console.error(error);
                button.disabled = false;
                jpxUtils.createToast(t('cGen.importFailed!'), 5000);
            }
        }
    });
    jpxUtils.createButton(actions, { text: t('cGen.cancel'), history: false, onClick: () => panel.remove() });
    panel.append(title, summary, modeLabel, actions);
    parent.appendChild(panel);
}

// Keep the preview clipped to this list and retain the original grab point.
function bindStatsListDrag(list, moveField) {
    let drag = null;
    let suppressClick = false;
    const clearMarkers = () => list.querySelectorAll('.is-drop-before, .is-drop-after').forEach(row => row.classList.remove('is-drop-before', 'is-drop-after'));
    const bounds = () => {
        const rect = list.getBoundingClientRect();
        const panel = list.closest('[role=tabpanel]').getBoundingClientRect();
        const { scale } = getSettingsCoordinateSpace(list);
        return { left: Math.max(rect.left, panel.left), right: Math.min(rect.left + list.clientWidth * scale, panel.right),
            top: Math.max(rect.top, panel.top), bottom: Math.min(rect.top + list.clientHeight * scale, panel.bottom) };
    };
    const cancel = () => {
        if (!drag) return;
        const old = drag;
        drag = null;
        cancelAnimationFrame(old.frame);
        old.row.classList.remove('is-dragging');
        old.layer?.remove();
        clearMarkers();
        if (fieldRenderers.dragState.cancel === cancel) fieldRenderers.dragState.cancel = null;
        window.removeEventListener('blur', cancel);
        window.removeEventListener('resize', cancel);
        if (old.handle.hasPointerCapture(old.pointerId)) old.handle.releasePointerCapture(old.pointerId);
        if (old.started) {
            suppressClick = true;
            setTimeout(() => { suppressClick = false; }, 0);
        }
    };
    function update() {
        const area = bounds(), row = drag.row.getBoundingClientRect();
        const space = getSettingsCoordinateSpace(list);
        Object.assign(drag.layer.style, { left: `${(area.left - space.left) / space.scale}px`, top: `${(area.top - space.top) / space.scale}px`,
            width: `${Math.max(0, area.right - area.left) / space.scale}px`, height: `${Math.max(0, area.bottom - area.top) / space.scale}px` });
        const top = Math.max(0, Math.min(area.bottom - area.top - row.height, drag.y - drag.offsetY - area.top));
        Object.assign(drag.preview.style, { left: `${(row.left - area.left) / space.scale}px`, top: `${top / space.scale}px` });
        clearMarkers();
        drag.target = null;
        drag.marker.hidden = true;
        if (drag.x < area.left || drag.x >= area.right || drag.y < area.top || drag.y >= area.bottom) return;
        const target = document.elementFromPoint(drag.x, drag.y)?.closest('.jpx-stats-row');
        if (!target || target.parentElement !== list || target === drag.row) return;
        const rect = target.getBoundingClientRect();
        drag.target = target;
        drag.after = drag.y >= rect.top + rect.height / 2;
        target.classList.add(drag.after ? 'is-drop-after' : 'is-drop-before');
        const markerTop = (drag.after ? rect.bottom - 3 * space.scale : rect.top) - area.top;
        drag.marker.hidden = false;
        drag.marker.style.top = `${markerTop / space.scale}px`;
        drag.marker.classList.toggle('over-preview', markerTop < top + row.height && markerTop + 3 * space.scale > top);
    }
    function track() {
        if (!drag?.started) return;
        if (!list.isConnected || !list.getClientRects().length) { cancel(); return; }
        const area = bounds();
        const edge = 24 * getSettingsCoordinateSpace(list).scale;
        if (drag.x >= area.left && drag.x < area.right && drag.y >= area.top && drag.y < area.bottom) {
            if (drag.y < area.top + edge) list.scrollTop -= 5;
            else if (drag.y > area.bottom - edge) list.scrollTop += 5;
        }
        update();
        drag.frame = requestAnimationFrame(track);
    }
    list.addEventListener('pointerdown', event => {
        const handle = event.target.closest('.jpx-stats-grip');
        if (!handle || !event.isPrimary || event.button !== 0) return;
        fieldRenderers.dragState.cancel?.();
        const row = handle.closest('.jpx-stats-row');
        drag = { row, handle, pointerId: event.pointerId, x: event.clientX, y: event.clientY,
            startX: event.clientX, startY: event.clientY, offsetY: event.clientY - row.getBoundingClientRect().top };
        fieldRenderers.dragState.cancel = cancel;
        window.addEventListener('blur', cancel);
        window.addEventListener('resize', cancel);
        handle.setPointerCapture(event.pointerId);
        event.preventDefault();
    });
    list.addEventListener('pointermove', event => {
        if (!drag || drag.pointerId !== event.pointerId) return;
        drag.x = event.clientX;
        drag.y = event.clientY;
        const { scale } = getSettingsCoordinateSpace(list);
        if (!drag.started && Math.hypot(drag.x - drag.startX, drag.y - drag.startY) >= 6 * scale) {
            drag.started = true;
            const rect = drag.row.getBoundingClientRect();
            drag.layer = document.createElement('div');
            drag.layer.className = 'jpx-stats-drag-layer';
            drag.layer.setAttribute('aria-hidden', 'true');
            drag.layer.inert = true;
            drag.preview = document.createElement('div');
            drag.preview.className = 'jpx-stats-drag-preview';
            Object.assign(drag.preview.style, { width: `${rect.width / scale}px`, height: `${rect.height / scale}px`, fontWeight: getComputedStyle(drag.row).fontWeight });
            drag.preview.append(...[...drag.row.children].map(child => child.cloneNode(true)));
            drag.marker = document.createElement('div');
            drag.marker.className = 'jpx-stats-drop-marker';
            drag.layer.append(drag.preview, drag.marker);
            list.append(drag.layer);
            drag.row.classList.add('is-dragging');
            drag.frame = requestAnimationFrame(track);
        }
        if (drag.started) update();
    });
    list.addEventListener('pointerup', event => {
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (drag.started) {
            drag.x = event.clientX;
            drag.y = event.clientY;
            update();
        }
        const id = drag.row.dataset.fieldId;
        const rows = [...list.querySelectorAll(':scope > .jpx-stats-row')];
        const from = rows.indexOf(drag.row), target = rows.indexOf(drag.target);
        let destination = target + (drag.after ? 1 : 0);
        if (from < destination) destination--;
        cancel();
        if (target >= 0 && destination !== from) {
            moveField(id, destination);
            list.querySelector('.jpx-stats-select[aria-pressed=true]')?.focus({ preventScroll: true });
        }
    });
    for (const type of ['pointercancel', 'lostpointercapture']) list.addEventListener(type, event => {
        if (drag?.pointerId === event.pointerId) cancel();
    });
    list.addEventListener('click', event => {
        if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    return cancel;
}

// Native color inputs edit individual CSS properties; opening them never changes the stored style.
function renderStatsColorControls(container, input, updateStyle) {
    const parsed = document.createElement('span').style;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const palette = document.createElement('div');
    palette.className = 'jpx-stats-palette';
    container.append(palette);
    const colors = [['color', 'textColor', '#5c0d11'], ['background-color', 'backgroundColor', '#edebdf']];
    const controls = colors.map(([property, titleKey, fallback]) => {
        const label = document.createElement('label');
        label.className = 'jpx-stats-color';
        const picker = document.createElement('input');
        picker.type = 'color';
        picker.id = getUniqueId('statsColor');
        picker.dataset.colorProperty = property;
        picker.setAttribute('aria-label', input.getAttribute('aria-label') + ': ' + t('cS.' + titleKey));
        label.append(picker);
        palette.append(label);
        picker.addEventListener('input', () => {
            parsed.cssText = input.value;
            parsed.setProperty(property, picker.value, parsed.getPropertyPriority(property));
            input.value = parsed.cssText;
            updateStyle(picker);
        });
        return { picker, property, fallback };
    });
    const preview = document.createElement('div');
    preview.className = 'jpx-stats-preview';
    const sample = document.createElement('span');
    sample.className = 'jpx-stats-preview-sample';
    sample.textContent = '1,234';
    sample.setAttribute('aria-label', input.getAttribute('aria-label') + ': ' + t('cS.livePreview'));
    preview.append(sample);
    palette.append(preview);
    const syncColors = sourcePicker => {
        parsed.cssText = input.value;
        // Copy only visual properties: arbitrary CSS must never move or cover the settings UI.
        for (const property of ['color', 'background-color', 'font-weight', 'font-style', 'text-decoration-line']) {
            const value = parsed.getPropertyValue(property);
            if (sample.style.getPropertyValue(property) !== value) sample.style.setProperty(property, value);
        }
        const computed = getComputedStyle(sample);
        for (const control of controls) {
            const { picker, property, fallback } = control;
            const color = parsed.getPropertyValue(property);
            const resolvedColor = computed.getPropertyValue(property) || color || fallback;
            if (control.lastColor === color && control.lastResolvedColor === resolvedColor) continue;
            control.lastColor = color;
            control.lastResolvedColor = resolvedColor;
            // Do not write back to the open native picker or read pixels on each drag event.
            if (picker !== sourcePicker) {
                context.clearRect(0, 0, 1, 1);
                context.fillStyle = fallback;
                context.fillRect(0, 0, 1, 1);
                context.fillStyle = resolvedColor;
                context.fillRect(0, 0, 1, 1);
                const hex = '#' + [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => value.toString(16).padStart(2, '0')).join('');
                if (picker.value !== hex) picker.value = hex;
            }
            picker.dataset.default = String(!color);
            picker.title = picker.getAttribute('aria-label') + ': ' + (color || t('cS.defaultColor'));
        }
    };
    palette._jpxRefreshTheme = syncColors;
    if (!sample.isConnected) queueMicrotask(() => { if (sample.isConnected) syncColors(); });
    return syncColors;
}

// Keep original comma-separated tokens verbatim until that particular rule is edited.
// The runtime parser remains unchanged, including ordering and legacy parseFloat behavior.
function renderStatsThresholdControls(container, item, view) {
    const element = (tag, className, text) => {
        const el = document.createElement(tag);
        el.className = className;
        if (text) el.textContent = text;
        return el;
    };
    const section = element('div', 'jpx-stats-thresholds');
    const heading = element('div', 'jpx-stats-threshold-heading');
    const title = element('strong', '', t('cS.thresholdTitle'));
    title.id = getUniqueId('statsThresholdTitle');
    section.setAttribute('role', 'group');
    section.setAttribute('aria-labelledby', title.id);
    heading.append(title);
    const list = element('div', 'jpx-stats-threshold-list');
    const note = element('p', 'jpx-stats-threshold-note');
    const legacyNote = element('p', 'jpx-stats-threshold-note', t('cS.thresholdLegacyHelp'));
    const preview = element('details', 'jpx-stats-threshold-preview');
    preview.append(element('summary', '', t('cS.thresholdTry')));
    const previewControls = element('div', 'jpx-stats-threshold-preview-controls');
    const previewLabel = element('label', '', t('cS.previewValue'));
    const previewInput = element('input', '');
    previewInput.type = 'number';
    previewInput.step = 'any';
    previewInput.id = getUniqueId('statsThresholdPreview');
    previewInput.dataset.thresholdPreview = '';
    previewInput.value = view.previewValue ?? '1234';
    previewLabel.htmlFor = previewInput.id;
    const sample = element('span', 'jpx-stats-preview-sample');
    sample.setAttribute('aria-label', t('cS.livePreview'));
    const matchText = element('output', 'jpx-stats-threshold-match');
    matchText.setAttribute('for', previewInput.id);
    previewControls.append(previewLabel, previewInput, element('span', '', '→'), sample, matchText);
    preview.append(previewControls);
    const readTokens = () => item.colorThresholds ? item.colorThresholds.split(',') : [];
    const writeTokens = tokens => {
        if (tokens.length) item.colorThresholds = tokens.join(',');
        else delete item.colorThresholds;
        syncPreview();
    };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const pickerColor = color => {
        if (!color || /currentcolor|inherit|initial|unset|revert|var\(|env\(/i.test(color)) return null;
        // A native opaque picker cannot faithfully edit context-dependent or transparent legacy colors.
        context.fillStyle = '#000000';
        context.fillStyle = color;
        const first = context.fillStyle;
        context.fillStyle = '#ffffff';
        context.fillStyle = color;
        if (first !== context.fillStyle) return null;
        context.clearRect(0, 0, 1, 1);
        context.fillRect(0, 0, 1, 1);
        const rgba = [...context.getImageData(0, 0, 1, 1).data];
        return rgba[3] === 255 ? '#' + rgba.slice(0, 3).map(value => value.toString(16).padStart(2, '0')).join('') : null;
    };
    function syncPreview() {
        const style = document.createElement('span').style;
        style.cssText = item.styleText || '';
        // Deliberately match renderDynamicTable, including invalid colors and duplicate minima.
        const thresholds = readTokens().map(token => {
            const [value, color] = token.split(':');
            return { min: parseFloat(value.trim()), color: color?.trim() };
        }).filter(threshold => !isNaN(threshold.min)).sort((a, b) => b.min - a.min);
        const number = previewInput.valueAsNumber;
        const match = thresholds.find(threshold => number >= threshold.min);
        if (match) style.color = match.color;
        sample.removeAttribute('style');
        for (const property of ['color', 'background-color', 'font-weight', 'font-style']) {
            sample.style.setProperty(property, style.getPropertyValue(property));
        }
        const valueText = Number.isFinite(number) ? number.toLocaleString() : '—';
        if (sample.textContent !== valueText) sample.textContent = valueText;
        const ruleText = !Number.isFinite(number) ? '' : match
            ? t('cS.thresholdMatched', { value: String(match.min) }) : t('cS.thresholdBase');
        if (matchText.textContent !== ruleText) matchText.textContent = ruleText;
    }
    function renderRules() {
        list.replaceChildren();
        const tokens = readTokens();
        let hasLegacy = false;
        tokens.forEach((token, index) => {
            const row = element('div', 'jpx-stats-threshold-row');
            row.dataset.thresholdIndex = index;
            const parts = token.split(':');
            const minText = parts[0].trim(), colorText = parts[1]?.trim();
            const hex = pickerColor(colorText);
            const editable = parts.length === 2 && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(minText)
                && Number.isFinite(Number(minText)) && hex;
            if (editable) {
                const minLabel = element('label', '', t('cS.thresholdAtLeast'));
                const min = element('input', '');
                min.id = getUniqueId('statsThresholdMin');
                min.type = 'number';
                min.step = 'any';
                min.value = String(Number(minText));
                min.dataset.thresholdMin = '';
                minLabel.htmlFor = min.id;
                const colorLabel = element('label', '', t('cS.textColor'));
                const color = element('input', '');
                color.id = getUniqueId('statsThresholdColor');
                color.type = 'color';
                color.value = hex;
                color.title = colorText;
                color.dataset.thresholdColor = '';
                colorLabel.htmlFor = color.id;
                min.addEventListener('input', () => {
                    const valid = min.validity.valid && Number.isFinite(min.valueAsNumber);
                    min.setAttribute('aria-invalid', String(!valid));
                    if (!valid) return;
                    const current = readTokens();
                    const colon = current[index].indexOf(':');
                    current[index] = min.value + current[index].slice(colon);
                    writeTokens(current);
                });
                min.addEventListener('blur', () => {
                    if (min.getAttribute('aria-invalid') === 'true') {
                        min.value = String(Number(readTokens()[index].split(':')[0]));
                        min.removeAttribute('aria-invalid');
                    }
                });
                color.addEventListener('input', () => {
                    const current = readTokens();
                    current[index] = current[index].slice(0, current[index].indexOf(':') + 1) + color.value;
                    color.title = color.value;
                    writeTokens(current);
                });
                row.append(minLabel, min, colorLabel, color);
            } else {
                hasLegacy = true;
                const legacy = element('span', 'jpx-stats-threshold-legacy', token || t('cS.thresholdLegacy'));
                legacy.title = t('cS.thresholdLegacy') + ': ' + token;
                row.append(legacy);
            }
            const remove = jpxUtils.createButton(row, {
                text: '×', className: 'jpx-stats-threshold-delete', historyLabel: t('cS.thresholdDelete'),
                onClick: () => {
                    const current = readTokens();
                    current.splice(index, 1);
                    writeTokens(current);
                    renderRules();
                    (list.children[Math.min(index, list.children.length - 1)]?.querySelector('input, button') || add).focus();
                },
            });
            remove.title = t('cS.thresholdDelete');
            remove.setAttribute('aria-label', remove.title);
            list.append(row);
        });
        note.textContent = t(tokens.length ? 'cS.thresholdOrder' : 'cS.thresholdEmpty');
        note.hidden = tokens.length === 1;
        legacyNote.hidden = !hasLegacy;
        preview.hidden = !tokens.length;
        syncPreview();
    }
    const add = jpxUtils.createButton(heading, {
        text: t('cS.thresholdAdd'), className: 'jpx-stats-threshold-add',
        onClick: () => {
            const tokens = readTokens();
            tokens.push('0:#5c0d11');
            writeTokens(tokens);
            renderRules();
            const min = list.lastElementChild.querySelector('[data-threshold-min]');
            min.focus();
            min.select();
        },
    });
    previewInput.addEventListener('input', () => { view.previewValue = previewInput.value; syncPreview(); });
    section.append(heading, list, note, legacyNote, preview);
    bindSettingsChange(section, item, 'colorThresholds');
    container.append(section);
    renderRules();
    return syncPreview;
}

function renderStatsFieldPicker(container, field, data) {
    const view = statsSettingsView.fields[field.key] ||= { selected: data[field.key][0]?.id };
    const labelFor = item => t(field.allFields.find(base => base.id === item.id)?.label || item.id);
    const element = (tag, className, text) => {
        const el = document.createElement(tag);
        el.className = className;
        if (text) el.textContent = text;
        return el;
    };
    const picker = element('div', 'jpx-stats-picker');
    const selectedPane = element('div', 'jpx-stats-pane jpx-stats-selected-pane');
    const selectedHeading = element('div', 'jpx-stats-pane-heading');
    const count = element('span', 'jpx-stats-pane-count');
    count.setAttribute('role', 'status');
    count.setAttribute('aria-atomic', 'true');
    const selectedList = element('div', 'jpx-stats-list');
    selectedList.dataset.statsField = field.key;
    selectedList.addEventListener('scroll', () => {
        if (selectedList.isConnected && selectedList.getClientRects().length) view.scrollTop = selectedList.scrollTop;
    });
    selectedList.setAttribute('role', 'list');
    selectedList.setAttribute('aria-label', t('cS.allFields'));
    selectedHeading.append(element('strong', '', t('cS.allFields')), count);
    selectedPane.append(selectedHeading, selectedList);
    const editor = element('div', 'jpx-stats-edit');
    editor.id = getUniqueId('statsEditor');
    picker.append(selectedPane, editor);
    container.append(picker);

    const selectedButton = () => selectedList.querySelector('.jpx-stats-select[aria-pressed=true]');
    const moveField = (id, destination) => {
        const items = data[field.key], index = items.findIndex(item => item.id === id);
        if (index < 0 || destination < 0 || destination >= items.length || destination === index) return;
        const move = () => {
            items.splice(destination, 0, items.splice(index, 1)[0]);
            view.selected = id;
            refresh();
            selectedButton()?.scrollIntoView({ block: 'nearest' });
        };
        if (settingsEditHistory) settingsEditHistory.run(t('cS.reorderFields'), move);
        else move();
    };
    const cancelDrag = bindStatsListDrag(selectedList, moveField);

    function renderEditor() {
        editor.replaceChildren();
        const item = data[field.key].find(item => item.id === view.selected);
        editor.hidden = !item;
        if (!item) return;
        const title = element('div', 'jpx-stats-edit-title');
        const titleText = element('strong', '', item.customName || labelFor(item));
        title.append(titleText);
        editor.append(title);
        if (field.key === 'statsColumns') {
            const nameInput = element('input', 'jpx-stats-name-input');
            nameInput.type = 'text';
            nameInput.id = getUniqueId('statsColumnName');
            nameInput.dataset.editKey = 'customName';
            nameInput.hidden = true;
            nameInput.placeholder = labelFor(item);
            nameInput.setAttribute('aria-label', t('cS.renameColumn'));
            nameInput.title = t('cS.renameHelp');
            let editing = false, initialValue = '';
            const finishName = (commit, focus = false) => {
                if (!editing) return;
                editing = false;
                const changed = commit && nameInput.value !== initialValue;
                const apply = () => {
                    if (changed) {
                        if (nameInput.value.trim()) item.customName = nameInput.value;
                        else delete item.customName;
                        const row = selectedButton();
                        if (row) row.querySelector('.jpx-stats-row-label').textContent = `${data[field.key].indexOf(item) + 1}. ${item.customName || labelFor(item)}`;
                        titleText.textContent = item.customName || labelFor(item);
                    }
                    nameInput.hidden = true;
                    titleText.hidden = false;
                    rename.replaceChildren(createSettingsIcon('edit'));
                    rename.title = t('cS.renameColumn');
                    rename.setAttribute('aria-label', rename.title);
                    rename.setAttribute('aria-expanded', 'false');
                };
                if (changed && settingsEditHistory) settingsEditHistory.run(t('cS.renameColumn'), apply);
                else apply();
                if (focus) rename.focus({ preventScroll: true });
            };
            title.append(nameInput);
            const rename = jpxUtils.createButton(title, {
                className: 'jpx-stats-name-edit', text: t('cS.renameColumn'), icon: 'edit', history: false,
                onClick: () => {
                    if (editing) { finishName(true, true); return; }
                    initialValue = item.customName || labelFor(item);
                    nameInput.value = initialValue;
                    editing = true;
                    titleText.hidden = true;
                    nameInput.hidden = false;
                    rename.replaceChildren(createSettingsIcon('confirm'));
                    rename.title = t('cS.confirmName');
                    rename.setAttribute('aria-label', rename.title);
                    rename.setAttribute('aria-expanded', 'true');
                    nameInput.focus();
                    nameInput.select();
                },
            });
            rename.setAttribute('aria-controls', nameInput.id);
            rename.setAttribute('aria-expanded', 'false');
            // Confirming with the mouse must not blur/commit and immediately reopen the editor.
            rename.addEventListener('pointerdown', event => { if (editing) event.preventDefault(); });
            nameInput.addEventListener('blur', () => finishName(true));
            nameInput.addEventListener('keydown', event => {
                if (event.isComposing) return;
                if (event.key === 'Enter' || event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    finishName(event.key === 'Enter', true);
                }
            });
            bindSettingsChange(title, item, 'customName');
        }
        const colorHeading = element('div', 'jpx-stats-color-heading');
        colorHeading.setAttribute('aria-hidden', 'true');
        const colorLabels = element('div', '');
        for (const key of ['textColor', 'backgroundColor', 'livePreview']) colorLabels.append(element('span', '', t('cS.' + key)));
        colorHeading.append(element('span', ''), colorLabels);
        editor.append(colorHeading);
        const styles = element('div', 'jpx-stats-style-fields');
        const groups = new Map();
        let syncThresholdPreview;
        for (const edit of field.editFields) {
            if (edit.key === 'colorThresholds' || edit.key === 'customName') continue;
            if (!groups.has(edit.group)) {
                const group = element(edit.group ? 'fieldset' : 'div', 'jpx-stats-edit-group');
                if (edit.group) group.append(element('legend', '', t(`cS.${edit.group}`)));
                groups.set(edit.group, group);
                styles.append(group);
            }
            const row = element('div', 'jpx-stats-edit-field');
            const label = element('label', '', t(edit.key === 'styleText' ? 'cS.appearance' : edit.label));
            const control = element('div', 'jpx-stats-style-control');
            const input = element('input', '');
            input.type = 'text';
            input.id = getUniqueId('statsField');
            label.htmlFor = input.id;
            input.value = item[edit.key] || '';
            input.placeholder = edit.placeholder || '';
            input.spellcheck = false;
            input.dataset.editKey = edit.key;
            input.dataset.styleField = '';
            input.title = t('cS.styleHelp');
            input.setAttribute('aria-label', edit.group ? `${t(`cS.${edit.group}`)}: ${t(edit.label)}` : t(edit.label));
            let syncColors;
            const updateStyle = sourcePicker => {
                if (input.value) item[edit.key] = input.value;
                else delete item[edit.key];
                syncColors?.(sourcePicker);
                syncThresholdPreview?.();
            };
            input.addEventListener('input', updateStyle);
            control.append(input);
            if (edit.key.startsWith('s_') || edit.key === 'styleText') {
                input.hidden = true;
                syncColors = renderStatsColorControls(control, input, updateStyle);
                syncColors();
            }
            row.append(label, control);
            bindSettingsChange(row, item, edit.key);
            groups.get(edit.group).append(row);
        }
        editor.append(styles);
        if (field.key === 'statsColumns' && STATS_THRESHOLD_FIELDS.has(item.id)) {
            syncThresholdPreview = renderStatsThresholdControls(editor, item, view);
        }
    }

    function selectField(id) {
        settingsEditHistory?.flushColorEdit();
        if (view.selected === id) return;
        view.selected = id;
        refresh();
    }
    function refresh() {
        settingsEditHistory?.flushColorEdit();
        cancelDrag();
        const items = data[field.key];
        if (!items.some(item => item.id === view.selected)) view.selected = items[0]?.id;
        count.textContent = t('cS.enabledCount', { count: items.filter(item => item.disabled !== true).length, total: items.length });
        // A newly constructed or hidden list has no meaningful DOM scroll position yet.
        const scrollTop = selectedList.childElementCount && selectedList.getClientRects().length
            ? selectedList.scrollTop : view.scrollTop || 0;
        view.scrollTop = scrollTop;
        selectedList.replaceChildren();
        items.forEach((item, index) => {
            const row = element('div', 'jpx-stats-row');
            row.setAttribute('role', 'listitem');
            row.dataset.fieldId = item.id;
            row.dataset.selected = String(item.id === view.selected);
            row.dataset.enabled = String(item.disabled !== true);
            selectedList.append(row);
            const button = jpxUtils.createButton(row, {
                className: 'jpx-stats-select', history: false,
                onClick: () => { selectField(item.id); selectedButton()?.focus({ preventScroll: true }); }
            });
            const grip = element('span', 'jpx-stats-grip jpx-drag-grip');
            grip.append(createSettingsIcon('grip'));
            grip.title = t('cS.reorderHint');
            grip.setAttribute('aria-hidden', 'true');
            button.append(grip, element('span', 'jpx-stats-row-label', `${index + 1}. ${item.customName || labelFor(item)}`));
            button.title = labelFor(item);
            bindSettingsChange(row, item, null, row, true);
            button.setAttribute('aria-pressed', String(item.id === view.selected));
            button.setAttribute('aria-controls', editor.id);
            button.addEventListener('keydown', event => {
                if (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
                    event.preventDefault();
                    moveField(item.id, index + (event.key === 'ArrowUp' ? -1 : 1));
                    selectedButton()?.focus({ preventScroll: true });
                    return;
                }
                const next = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: items.length - 1 }[event.key];
                if (next === undefined) return;
                event.preventDefault();
                selectField(items[Math.max(0, Math.min(next, items.length - 1))].id);
                selectedButton()?.focus();
            });
            const actions = element('div', 'jpx-array-item-actions');
            row.append(actions);
            createSettingsMoveButtons(actions, index, items.length, destination => {
                moveField(item.id, destination); selectedButton()?.focus({ preventScroll: true });
            });
            const enabled = item.disabled !== true;
            const toggle = jpxUtils.createButton(actions, {
                text: `${t(enabled ? 'cS.disableField' : 'cS.enableField')}: ${item.customName || labelFor(item)}`,
                icon: enabled ? 'ruleEnabled' : 'ruleDisabled', className: 'jpx-rule-state-toggle', onClick: () => {
                    if (enabled) item.disabled = true;
                    else delete item.disabled;
                    view.selected = item.id;
                    refresh();
                    selectedButton()?.closest('.jpx-stats-row').querySelector('.jpx-rule-state-toggle').focus({ preventScroll: true });
                }
            });
            toggle.dataset.enabled = String(enabled);
            toggle.setAttribute('aria-pressed', String(enabled));
        });
        if (selectedList.getClientRects().length) selectedList.scrollTop = scrollTop;
        renderEditor();
    }
    refresh();
}

function renderStatsSettingsUI(container, restoringView = false) {
    settingsEditHistory?.flushColorEdit();
    if (!restoringView) captureStatsListScroll(container);
    normalizeStatsConfig(cfgStats);
    container.replaceChildren();
    const nav = document.createElement('div');
    nav.className = 'jpx-stats-nav';
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-label', t('cS.statsSettings'));
    container.append(nav);
    const fields = cfgStatsSchema.properties.filter(field => field.statsEditor);
    const sections = [...fields.map(field => field.key), 'data'];
    const panels = new Map(), buttons = new Map();
    const selectSection = (key, initial = false) => {
        if (!initial) captureStatsListScroll(container);
        statsSettingsView.section = key;
        panels.forEach((panel, id) => {
            panel.hidden = id !== key;
        });
        buttons.forEach((button, id) => button.setAttribute('aria-pressed', String(id === key)));
        restoreStatsListScroll(container);
    };
    sections.forEach(key => {
        const button = jpxUtils.createButton(nav, { text: t(`cS.section_${key}`), history: false, onClick: () => selectSection(key) });
        button.dataset.statsSection = key;
        if (key !== 'data') bindSettingsChange(button, cfgStats, key);
        const panel = document.createElement('section');
        panel.id = `jpx-stats-${key}`;
        panel.hidden = true;
        button.setAttribute('aria-controls', panel.id);
        button.id = `jpx-stats-nav-${key}`;
        panel.setAttribute('aria-labelledby', button.id);
        button.addEventListener('keydown', event => {
            const index = sections.indexOf(key);
            const next = { ArrowLeft: (index + sections.length - 1) % sections.length, ArrowRight: (index + 1) % sections.length, Home: 0, End: sections.length - 1 }[event.key];
            if (next === undefined) return;
            event.preventDefault();
            selectSection(sections[next]);
            buttons.get(sections[next]).focus();
        });
        panels.set(key, panel);
        buttons.set(key, button);
        container.append(panel);
        button.title = t(`cS.help_${key}`);
        if (key === 'data') renderStatsDataActions(panel);
        else {
            const field = fields.find(field => field.key === key);
            const editor = document.createElement('div');
            editor.dataset.fieldKey = key;
            panel.append(editor);
            renderStatsFieldPicker(editor, field, cfgStats);
        }
    });
    selectSection(sections.includes(statsSettingsView.section) ? statsSettingsView.section : sections[0], true);
}

function loadStatsSettingsConfig() {
    let storedCfgStats = {};
    try {
        storedCfgStats = JSON.parse(localStorage.getItem(prefix + 'cfgStats') || '{}');
    } catch (err) {
        console.warn('Failed to load cfgStats. Using default cfgStats.');
        storedCfgStats = {};
    }
    mergeCfg(storedCfgStats, defaultCfgStats, cfgStats, 'stats');
    delete cfgStats.darkMode;
}

function renderStatsTab(parent) {
    let cfgStatsUI = document.createElement('div');
    cfgStatsUI.id = 'cfgStats-ui';
    parent.appendChild(cfgStatsUI);
    renderStatsSettingsUI(cfgStatsUI);
}

function renderStatsDataActions(parent) {
    let buttonsUI = document.createElement('div');
    buttonsUI.className = 'jpx-stats-toolbar';

    jpxUtils.createButton(buttonsUI, {
        id: 'reset-cfgStats-button',
        text: t('cS.resetStatsSettings'),
        onClick: (btn) => {
            cfgStats = JSON.parse(JSON.stringify(defaultCfgStats));
            delete cfgStats.darkMode;
            renderStatsSettingsUI(document.getElementById('cfgStats-ui'));
        }
    });

    jpxUtils.createButton(buttonsUI, {
        id: 'export-db-button',
        text: t('cS.exportDB'),
        history: false,
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
        text: t('cS.importDB'),
        history: false,
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

                        validateStatsBackup(json);
                        if (parent.isConnected) renderStatsImportPreview(parent, json, file.name);
                        resolve();
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
    const cleanup = document.createElement('section');
    cleanup.className = 'jpx-stats-cleanup';
    const title = document.createElement('strong'), description = document.createElement('p');
    title.textContent = t('cS.cleanup');
    description.className = 'jpx-stats-help'; description.textContent = t('cS.cleanupScope');
    cleanup.append(title, description);
    jpxUtils.createButton(cleanup, { id: 'cleanup-data-button', text: t('cS.cleanupRun'), history: false, onClick: requestJpxCleanup });
    parent.append(cleanup);
}

//Misc
function storeTmp() {
    if (cleanupInProgress) return;
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
                else localStorage.removeItem(prefix + 'battleLogRecord' + isekaiSuffix);
            }
            localStorage.setItem(prefix + 'timeRecords' + isekaiSuffix, JSON.stringify(timeRecords));
            localStorage.setItem(prefix + 'combatRecords' + isekaiSuffix, JSON.stringify(combatRecords));
            localStorage.setItem(prefix + 'revenueRecords' + isekaiSuffix, JSON.stringify(revenueRecords));
        }
    }
}

//I18n
function initDoI18n(onChange) {
    const mergeI18N = () => {Object.assign(mergedI18N, jpxUtils.deepMerge(JSON.parse(JSON.stringify(I18N)), window.jpxI18N || {}));};
    let externalI18n = window.jpxI18N;
    Object.defineProperty(window, 'jpxI18N', {
        get: () => externalI18n,
        set: (v) => {
            externalI18n = v; mergeI18N();
            refreshJpxTheme();
            if (onChange) { onChange(); return; }
            jpxPanelManager.updateContent();
            initMobileEntry.refresh?.();
            initHvutEntry.refresh?.();
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

// Shared by the live floating widget and the appearance preview.
function createControlWidgetContents(root, preview = false) {
    root.classList.add('jpx-widget-card');
    const header = document.createElement(preview ? 'div' : 'button');
    header.className = 'jpx-widget-drag';
    if (!preview) {
        header.type = 'button';
        header.title = t('cW.movePanel');
        header.setAttribute('aria-label', header.title);
    }
    const title = document.createElement('strong');
    title.textContent = 'JPX-PLUS';
    header.append(title, createSettingsIcon('grip'));
    const info = document.createElement('div');
    info.className = 'jpx-widget-info';
    if (!preview) {
        info.tabIndex = 0;
        info.setAttribute('role', 'button');
        info.setAttribute('aria-label', t('cW.toggleBattle'));
    }
    const actions = document.createElement('div');
    actions.className = 'jpx-widget-actions';
    const buttons = {};
    for (const [key, icon, label] of [['stats', 'stats', 'openStats'], ['settings', 'battle', 'openSettings']]) {
        const button = document.createElement(preview ? 'span' : 'button');
        button.className = 'jpx-widget-action';
        if (!preview) button.type = 'button';
        button.dataset.widgetAction = key;
        const text = document.createElement('span');
        text.textContent = t('cW.' + label);
        button.append(createSettingsIcon(icon), text);
        actions.append(button);
        buttons[key] = button;
    }
    root.append(header, info, actions);
    return { header, info, ...buttons };
}

function updateControlWidgetRows(container, rows) {
    let nodes = container._jpxRows;
    if (!nodes || nodes.length !== rows.length || rows.some((row, index) => nodes[index].id !== row.id)) {
        nodes = rows.map(row => {
            const element = document.createElement('div');
            element.className = 'jpx-widget-info-row';
            element.dataset.rowId = row.id;
            const label = document.createElement('span');
            label.className = 'jpx-widget-info-label';
            const value = document.createElement('span');
            value.className = 'jpx-widget-info-value';
            element.append(label, value);
            return { id: row.id, element, label, value };
        });
        container.replaceChildren(...nodes.map(row => row.element));
        container._jpxRows = nodes;
    }
    rows.forEach((row, index) => {
        const label = row.label + ':';
        const value = row.id === 'isActiveBattle' && container._jpxBattleState
            ? t('cW.' + container._jpxBattleState) : String(row.value ?? '');
        if (nodes[index].label.textContent !== label) nodes[index].label.textContent = label;
        if (nodes[index].value.textContent !== value) nodes[index].value.textContent = value;
    });
}

function setControlWidgetState(root, state) {
    if (root.dataset.battleState !== state) root.dataset.battleState = state;
    const info = root.querySelector('.jpx-widget-info'), label = t('cW.' + state);
    if (info) {
        info._jpxBattleState = state;
        const status = info._jpxRows?.find(row => row.id === 'isActiveBattle')?.value;
        if (status && status.textContent !== label) status.textContent = label;
        if (info.getAttribute('role') === 'button') {
            const name = t('cW.toggleBattle') + ': ' + label, pressed = String(state === 'auto');
            if (info.getAttribute('aria-label') !== name) info.setAttribute('aria-label', name);
            if (info.getAttribute('aria-pressed') !== pressed) info.setAttribute('aria-pressed', pressed);
        }
    }
    const color = `var(--jpx-${state}-surface, ${{ auto: '#edf1e4', manual: '#edebdf', waiting: '#f6edcf' }[state]})`;
    if (root._jpxSurface !== color) { root.style.backgroundColor = color; root._jpxSurface = color; }
}

function bindControlWidgetPosition(widget, handle, owner) {
    const key = prefix + 'ctrlWidgetPosition' + isekaiSuffix;
    let preferred = null, drag = null, frame = 0;
    try {
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
        if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) preferred = { left: saved.left, top: saved.top };
    } catch { /* Invalid or inaccessible position storage uses the viewport corner. */ }
    const viewport = () => {
        const view = window.visualViewport;
        return { left: view?.offsetLeft || 0, top: view?.offsetTop || 0,
            width: view?.width || innerWidth, height: view?.height || innerHeight };
    };
    function place(position) {
        const view = viewport(), margin = 8;
        const width = widget.offsetWidth, height = widget.offsetHeight;
        const maxLeft = view.left + Math.max(margin, view.width - width - margin);
        const maxTop = view.top + Math.max(margin, view.height - height - margin);
        const desired = position || { left: maxLeft - 4, top: maxTop - 4 };
        const left = Math.max(view.left + margin, Math.min(maxLeft, desired.left));
        const top = Math.max(view.top + margin, Math.min(maxTop, desired.top));
        // Home stays anchored to the viewport edge as rows/fonts change height.
        // Numeric top/left would leave one stale frame until ResizeObserver runs.
        widget.style.setProperty('left', position ? left + 'px' : 'auto', 'important');
        widget.style.setProperty('top', position ? top + 'px' : 'auto', 'important');
        widget.style.setProperty('right', position ? 'auto' : (innerWidth - left - width) + 'px', 'important');
        widget.style.setProperty('bottom', position ? 'auto' : (innerHeight - top - height) + 'px', 'important');
        return { left, top };
    }
    function constrain() {
        // Existing appearance declarations stay intact; viewport placement is owned by dragging.
        for (const [property, value] of [['position', 'fixed'], ['right', 'auto'], ['bottom', 'auto'],
            ['transform', 'none'], ['margin', '0'], ['min-width', '0'], ['min-height', '0']]) widget.style.setProperty(property, value, 'important');
        const view = viewport();
        widget.style.setProperty('max-width', Math.max(0, view.width - 16) + 'px', 'important');
        widget.style.setProperty('max-height', Math.max(0, view.height - 16) + 'px', 'important');
        widget.style.setProperty('overflow-y', 'auto', 'important');
        return place(preferred);
    }
    const schedule = () => {
        if (frame || drag || !widget.isConnected) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            if (drag || !widget.isConnected) return;
            const before = widget.getBoundingClientRect(), after = constrain();
            if (Math.abs(before.left - after.left) > 1 || Math.abs(before.top - after.top) > 1) owner.suppressHover = true;
        });
    };
    const save = position => {
        preferred = position;
        try { if (position) localStorage.setItem(key, JSON.stringify(position)); else localStorage.removeItem(key); }
        catch { /* Dragging still works when local storage is unavailable. */ }
    };
    function finish(cancel = false) {
        if (!drag) return;
        const current = drag;
        drag = null;
        if (current.moved && !cancel) preferred = current.latest;
        // Resizing can occur while pointer capture is active; apply deferred size limits now.
        const finalPosition = constrain();
        if (current.moved) {
            owner.suppressHover = true;
            if (cancel) place(current.start);
            else save(finalPosition);
        }
        owner.dragging = false;
        widget.classList.remove('is-dragging');
        if (handle.hasPointerCapture(current.id)) handle.releasePointerCapture(current.id);
    }
    handle.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.isPrimary === false || drag) return;
        event.preventDefault();
        event.stopPropagation();
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        const rect = widget.getBoundingClientRect();
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY,
            start: { left: rect.left, top: rect.top }, latest: null, moved: false };
        handle.setPointerCapture(event.pointerId);
        handle.focus({ preventScroll: true });
    });
    handle.addEventListener('pointermove', event => {
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
        if (!drag.moved && Math.hypot(dx, dy) < 4) return;
        event.preventDefault();
        drag.moved = true;
        owner.dragging = true;
        widget.classList.add('is-dragging');
        drag.latest = place({ left: drag.start.left + dx, top: drag.start.top + dy });
    });
    handle.addEventListener('pointerup', event => { if (drag?.id === event.pointerId) finish(); });
    for (const type of ['pointercancel', 'lostpointercapture']) handle.addEventListener(type, event => {
        if (drag?.id === event.pointerId) finish(true);
    });
    handle.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); });
    handle.addEventListener('keydown', event => {
        if (event.key === 'Escape' && drag) { event.preventDefault(); event.stopPropagation(); finish(true); return; }
        if (event.key === 'Home') { event.preventDefault(); owner.suppressHover = true; save(null); constrain(); return; }
        const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
        if (!direction || event.ctrlKey || event.metaKey || event.altKey || drag) return;
        event.preventDefault();
        owner.suppressHover = true;
        const rect = widget.getBoundingClientRect(), step = event.shiftKey ? 10 : 1;
        save(place({ left: rect.left + direction[0] * step, top: rect.top + direction[1] * step }));
    });
    window.addEventListener('blur', () => finish(true));
    widget.addEventListener('mouseleave', event => {
        if (!drag && !event.buttons) owner.suppressHover = false;
    });
    const rememberPointer = event => { owner.lastPointer = { x: event.clientX, y: event.clientY }; };
    widget.addEventListener('pointermove', rememberPointer, true);
    widget.addEventListener('pointerdown', rememberPointer, true);
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    new ResizeObserver(schedule).observe(widget);
    constrain();
    return { refresh: constrain, cancel: () => finish(true) };
}

//Panel
function jpxPanelManager(panelType) {
    const ns = jpxPanelManager;
    if (ns._init) return ns;

    ns.ready = true;
    ns.currentType = panelType;

    ns.createCtrlWidget = function(type) {
        if (ns.ctrlWidget) {
            !document.querySelector('#ctrl-widget') && document.body.appendChild(ns.ctrlWidget);
            ns.refreshAppearance();
            return;
        }
        ns.currentType = type || ns.currentType;
        ns.ctrlWidget = document.createElement('div');
        ns.ctrlWidget.id = 'ctrl-widget';
        ns.ctrlWidget.className = 'jpx-floating-widget';
        if (cfgBattle.ctrlWidgetStyleText) ns.ctrlWidget.style.cssText = cfgBattle.ctrlWidgetStyleText;
        const parts = createControlWidgetContents(ns.ctrlWidget);
        ns.parts = parts;
        ns.infoDiv = parts.info;

        switch (ns.currentType) {
            case 'battle': {
                const throttledToggleBattle = jpxUtils.throttle(toggleActive, 200);
                ns.infoDiv.addEventListener('pointerdown', (e) => {
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    if (ns.dragging) return;
                    e.stopPropagation();
                    throttledToggleBattle();
                });
                ns.infoDiv.addEventListener('keydown', event => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault(); event.stopPropagation();
                    if (!event.repeat && !ns.dragging) throttledToggleBattle();
                });
                ns.infoDiv.addEventListener('mouseenter', event => {
                    if (!cfgBattle.ctrlWidgetMouseEnter || !ns.ready || ns.dragging || event.buttons) return;
                    if (ns.suppressHover) {
                        ns.suppressHover = false;
                        const pointer = ns.lastPointer;
                        if (pointer && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) < 1) return;
                    }
                    throttledToggleBattle();
                });
                parts.stats.addEventListener('click', event => {
                    event.stopPropagation();
                    battleRecordPlayer(false);
                });
                parts.settings.addEventListener('click', event => {
                    event.stopPropagation();
                    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                        let proficiencyRecord = document.querySelector('#proficiency-record');
                        if (proficiencyRecord) proficiencyRecord.style.left = '800px';
                    }
                    renderSettings();
                });

                break;
            }
        }

        ns.setBackground(isActiveBattle ? '#4f4' : '#fef');
        ns.updateContent();
        document.body.appendChild(ns.ctrlWidget);
        ns.position = bindControlWidgetPosition(ns.ctrlWidget, parts.header, ns);
        ns.dispatchState();
    };

    ns.refreshAppearance = function() {
        if (!ns.ctrlWidget) return;
        ns.ctrlWidget.style.cssText = typeof cfgBattle.ctrlWidgetStyleText === 'string' ? cfgBattle.ctrlWidgetStyleText : '';
        ns.ctrlWidget._jpxSurface = null;
        ns.setBackground(ns.background || (isActiveBattle ? '#4f4' : '#fef'));
        ns.updateContent();
        ns.position?.refresh();
    };

    ns.updateContent = function(type) {
        if (!ns.infoDiv) return;
        ns.currentType = type || ns.currentType;
        switch (ns.currentType) {
            case 'battle': {
                const rows = cfgBattle.ctrlWidgetRows.map(row => {
                    const field = CTRLWIDGET_FIELDS.find(field => field.id === row.id);
                    return field ? { id: row.id, label: t(field.label), value: field.get() } : null;
                }).filter(row => row !== null);
                setControlWidgetState(ns.ctrlWidget, ns.warning ? 'waiting' : isActiveBattle ? 'auto' : 'manual');
                updateControlWidgetRows(ns.infoDiv, rows);
                const moveLabel = t('cW.movePanel');
                if (ns.parts.header.title !== moveLabel) ns.parts.header.title = moveLabel;
                if (ns.parts.header.getAttribute('aria-label') !== moveLabel) ns.parts.header.setAttribute('aria-label', moveLabel);
                for (const [key, label] of [['stats', 'openStats'], ['settings', 'openSettings']]) {
                    const text = ns.parts[key].lastElementChild, value = t('cW.' + label);
                    if (text.textContent !== value) text.textContent = value;
                }
                break;
            }
        }
    };

    ns.setBackground = function(color) {
        // Preserve event colors while using quieter colors on the visible panel.
        const style = document.createElement('span').style;
        style.background = color;
        ns.background = style.background;
        ns.warning = ns.background === 'rgb(255, 255, 85)';
        if (ns.ctrlWidget) setControlWidgetState(ns.ctrlWidget, ns.warning ? 'waiting' : isActiveBattle ? 'auto' : 'manual');
    };

    ns.dispatchState = function() {
        setTimeout(()=> {
            window.dispatchEvent(new CustomEvent('jpx_ctrlWidget_update', {
                detail: {
                    active: isActiveBattle,
                    background: ns.background,
                    suffix: isekaiSuffix,
                    timestamp: Date.now()
                }
            }));
        }, 0);
    };

    ns._init = true;
    return ns;
}

//Market
function jpxMarket() {
    const ns = jpxMarket;
    if (ns._init) return ns;

    ns.defaultPriceData = {
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
        'Voidseeker Shard': 10, 'Aether Shard': 50, 'Featherweight Shard': 10, 'Amnesia Shard': 50, 'World Seed': 50,
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
    }

    ns.getMarketPrice = async function (update = true) {
        let priceData = JSON.parse(localStorage.getItem(prefix + 'priceData' + isekaiSuffix) || '{}');
        if (!update) return priceData.lastUpdate ? priceData : ns.defaultPriceData;

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
        let latestPriceData = {};

        if (!log || finishBattle) {
            priceData['lastUpdate'] = Date.now();
            await jpxUtils.xhrGet(urlArray).then((results) => {
                console.log('jpxUtils.xhrGet Results:');
                console.log(results);
                for (let result of results){
                    if (result.status === 'rejected') {
                        console.error(result.reason);
                        break;
                    }
                    try {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(result.value.responseText, 'text/html');
                        let itemListTrs = doc.querySelectorAll('#market_itemlist > table > tbody > tr');

                        itemListTrs.forEach((itemListTr, index) => {
                            if (index === 0) return;

                            let itemListTds = itemListTr.querySelectorAll('td');
                            if (itemListTds.length >= 4) {
                                let name = itemListTds[0].textContent.trim();
                                let bid = parseFloat(itemListTds[2].textContent.trim().replace(' C', '').replace(',', ''));
                                let defaultBid = ns.defaultPriceData[name];

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
                        console.error('Parsing error for url: ' + result.value.url);
                    }
                }
            });
        }

        for (let latestPriceDataKey in latestPriceData) {
            priceData[latestPriceDataKey] = latestPriceData[latestPriceDataKey];
        }
        for (let defaultPriceDataKey in ns.defaultPriceData) {
            if (!priceData[defaultPriceDataKey]) {
                priceData[defaultPriceDataKey] = ns.defaultPriceData[defaultPriceDataKey];
            }
        }
        if (isekaiSuffix) {
            priceData['Energy Drink'] = 0;
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

    ns.secondsToTime = function (seconds, showMillisecond = false) {
        let tHours = Math.floor(seconds / 3600);
        let tMinutes = Math.floor(seconds / 60) % 60;
        let tSeconds = showMillisecond ? Math.floor(seconds % 60) : Math.round(seconds % 60);
        let time =
            tHours.toString().padStart(2, '0') + ':' +
            tMinutes.toString().padStart(2, '0') + ':' +
            tSeconds.toString().padStart(2, '0');

        if (showMillisecond) {
            let tMilliseconds = seconds.toFixed(3).split('.')[1];
            time += '.' + tMilliseconds;
        }

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

    ns.parseValue = (val) => {
        if (typeof val === 'string' && val.trim() !== '' && !isNaN(val)) return Number(val);
        return val;
    };

    ns.isEmpty = function (obj) {
        if (!obj || typeof obj !== 'object') return true;
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
    };

    ns.deepMerge = function (target, source) {
        if (!source) return target;
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], ns.deepMerge(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    };

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
        let { id, className, cssText, text, icon, disabled, onClick, history = true, historyLabel } = options;

        let btn = document.createElement('button');
        if (id) btn.id = id;
        if (className) btn.className = className;
        if (cssText) btn.style.cssText = cssText;
        if (text) btn.textContent = text;
        if (disabled) btn.disabled = true;
        if (icon || btn.classList.contains('jpx-delete-button')) {
            btn.setAttribute('aria-label', text || t('delete'));
            btn.title = text || t('delete');
            btn.replaceChildren(createSettingsIcon(icon || 'delete'));
        }
        container.appendChild(btn);

        if (onClick) {
            btn.addEventListener('click', (e) => {
                let invoke = () => onClick(btn, e);
                let result = settingsEditHistory && history !== false && btn.closest('#settings-container')
                    ? settingsEditHistory.run(historyLabel || btn.getAttribute('aria-label') || btn.textContent || 'Configuration', invoke)
                    : invoke();

                const handleTempText = (tempText) => {
                    if (!tempText) return;
                    let originalText = btn.textContent;
                    btn.style.width = btn.offsetWidth + 'px';
                    btn.textContent = tempText;
                    btn.disabled = true;

                    setTimeout(() => {
                        // Switching sections may already have replaced the button's caption.
                        if (btn.textContent === tempText) btn.textContent = originalText;
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

    ns.createToast = function(content, duration = 3000, styleName, targetDocument = document) {
        const targetWindow = targetDocument.defaultView;
        let container = targetDocument.getElementById('toast-container');
        if (!container) {
            container = targetDocument.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = 'position: fixed; right: 16px; bottom: 16px; display: flex; flex-direction: column-reverse; gap: 8px; z-index: 99999;';
            targetDocument.body.appendChild(container);
        }

        let toast = targetDocument.createElement('div');
        toast.textContent = content;
        toast.style.cssText = 'padding: 10px 14px; background: #333; color: #fff; font-size: 14px; cursor: pointer; opacity: 0; transition: opacity .2s;';
        if (styleName) toast.className = styleName;
        container.appendChild(toast);
        targetWindow.requestAnimationFrame(() => toast.style.opacity = '1');

        const close = () => {
            toast.style.opacity = '0';
            targetWindow.setTimeout(() => toast.remove(), 200);
        };

        toast.addEventListener('pointerdown', close);
        targetWindow.setTimeout(close, duration);

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
    };

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
    };

    ns.keyCaptureController = null;
    ns.captureKeyCombo = function(onComplete, onAbort) {
        if (ns.keyCaptureController) ns.keyCaptureController.abort();
        let currentController = new AbortController();
        ns.keyCaptureController = currentController;
        let signal = currentController.signal;
        const history = settingsEditHistory;

        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            if (e.key === 'Escape') { currentController.abort(); return; }
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

            let result = {
                key: e.key,
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                comboString: '',
            };
            result.comboString = ns.formatKeyCombo(result, '+');

            currentController.abort();
            if (onComplete) {
                if (history && history === settingsEditHistory) history.run(t('cGen.shortcutConfig'), () => onComplete(result));
                else onComplete(result);
            }
        }, { signal });
        window.addEventListener('pointerdown', () => {
            currentController.abort();
        }, { signal, once: true });

        signal.addEventListener('abort', () => {
            if (ns.keyCaptureController === currentController) ns.keyCaptureController = null;
            if (onAbort) onAbort();
        });
    };
    
    ns.formatKeyCombo = function(input, separator = '+') {
        if (input == null) return 'Unassigned';

        let key, ctrl, alt, shift;
        if (typeof input === 'string') {
            let pureKey = input.startsWith('kb_') ? input.slice(3) : input;
            let isPlusKey = pureKey === '+' || pureKey.endsWith('++');
            let parts = pureKey.split('+');
            key = isPlusKey ? '+' : parts.pop();
            ctrl = parts.includes('Ctrl');
            alt = parts.includes('Alt');
            shift = parts.includes('Shift');
        } else {
            ({ key, ctrl, alt, shift } = input);
        }

        let result = [];
        if (ctrl) result.push('Ctrl');
        if (alt) result.push('Alt');
        if (shift) result.push('Shift');
        result.push(key === ' ' ? 'SPACE' : key.toUpperCase());
        return result.join(separator);
    };

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

window.addEventListener('storage', event => {
    if (event.key !== cleanupKey || !event.newValue || cleanupInProgress) return;
    cleanupInProgress = true; isActiveBattle = false;
    sessionStorage.setItem(cleanupHoldKey, '1');
    window.removeEventListener('beforeunload', storeTmp);
    window.location.reload();
});
window.dispatchEvent(new Event('jpx:ready'));
initDo();
})(typeof unsafeWindow === 'undefined' ? window : unsafeWindow);
