import Big from "big.js";

export default {
    data() {
        return {
            // debug flags
            cheatMode: false, // gives extra starting currency
            easyGolden: false, // constant golden spawns
            disableAutoLoad: false,
            disableAutoSave: true,

            // for fps calculations
            lastFrame: 0,

            // in-game state
            showLoading: true,
            currencyName: null, // this is saved in Stats, data.currencyName is used for front-end display only
            currency: Big(0), // this value is for front-end display only, buy/etc checks are done with Stats.state.currency
            buyAmount: 1, // how many buildings to buy at a time
            bonusCurrency: Big(0), // idle bonus
            bonusDialog: false, // show idle bonus dialog?
            currencyPulsing: false, // show currency pulsing effect
            currencyPulseLast: null, // timestamp when effect last started
            lastCps: Big(0), // last cps amount (used in tick)
            displayedCps: Big(0), // displayed cps amount (used in tick)
            lastClickPower: Big(1), // last click power (used in tick)
            displayedClickPower: Big(1), // displayed click power (used in tick)
            cpsTick: Big(0), // cps to add per tick
            clickPowerTick: Big(0), // click power to add per tick
            showUpgrades: false, // show upgrade panel?
            showAchievements: false, // show achievements panel?

            // TODO move to game-specific settings?
            startingCurrency: Big(0),
            buildingCostMultiplier: 0.15,
            // TODO add multiplier for upgrade scaling once ready

            // this stuff gets loaded from data files
            // TODO something something
            buildingNames: [],
            buildingIcons: [],
            buildings: [],
            upgrades: [],
            _sortedUpgrades: null,
            adjectives: [],
            icons: [],
            achievements: [],
            words: [],
            totalIcon: null,
            cpsIcon: null,
            clicksIcon: null,

            // golden currency stuff
            goldenTop: 250,
            goldenRight: 850,
            goldenActive: false,
            goldenMinimumTime: 300,
            goldenMaximumTime: 900,
            goldenStay: 13,
            goldenNext: 999999999999,
            goldenDisappear: 0,
            luckyActive: false,
            luckyAmount: Big(0),
            luckyLength: 10,
            luckyEnd: 0,
            frenzyActive: false,
            frenzyAmount: 7,
            frenzyLength: 77,
            clickFrenzyActive: false,
            clickFrenzyAmount: 777,
            clickFrenzyLength: 13,
            frenzyEnd: 0,
        }
    },
};
