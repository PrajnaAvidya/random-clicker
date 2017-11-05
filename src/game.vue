<template>
    <v-app>
        <v-container fluid="fluid">
            <v-layout>
                <v-flex sm5>
                    <v-layout class="totals">
                        <h2>{{ currency | currency }} {{ currencyName }}s</h2>
                        <h3 class="red bonusMessage" v-show="luckyActive">Lucky! ({{ luckyAmount | currency }} bonus)</h3>

                        <h3>Per second: {{ displayedCps | round }}</h3>
                        <h4 class="red bonusMessage" v-show="frenzyActive">FRENZY! (x{{ frenzyAmount }} production)</h4>

                        <h4>Per click: {{ displayedClickPower | currency }}</h4>
                        <h5 class="red bonusMessage" v-show="clickFrenzyActive">CLICK FRENZY!!! (x{{ clickFrenzyAmount }} clicks)</h5>
                    </v-layout>

                    <center>
                        <div class="row currency" v-bind:class="{ pulse: currencyPulsing, frenzy: getOption('animation') && (frenzyActive || clickFrenzyActive || luckyActive) }" id="currency" @click="click">
                        </div>
                    </center>
                </v-flex>

                <v-flex sm4>
                    <v-layout class="buildings">
                        <h3>Buildings</h3>

                        <div class="buy-sell-buttons">
                            <v-btn default class="green" :class="{ active:buyAmount == 1 }" @click.native="setBuyAmount(1)">Buy 1</v-btn>
                            <v-btn default class="green" :class="{ active:buyAmount == 10 }" @click.native="setBuyAmount(10)">Buy 10</v-btn>
                            <v-btn default class="green" :class="{ active:buyAmount == 100 }" @click.native="setBuyAmount(100)">Buy 100</v-btn>
                        </div>

                        <v-layout class="building" v-for="(building, buildingIndex) in buildings" :key="buildingIndex" v-if="building.owned > 0 || showBuilding(building)">
                            <v-flex xs5>
                                <div v-if="building.unlocked">
                                    <v-tooltip left v-if="building.unlocked">
                                        <span slot="activator">
                                            <v-icon light>{{ building.icon }}</v-icon>
                                            {{ building.name }} ({{ building.owned }} owned)
                                        </span>
                                        <span v-html="buildingText(building)"></span>
                                    </v-tooltip>
                                </div>
                                <div v-else>
                                    <span slot="activator">
                                        <v-icon light>{{ building.icon }}</v-icon>
                                        <span :class="{ redacted:building.unlocked == false }">{{ building.name }}</span>
                                    </span>
                                </div>
                            </v-flex>
                            <v-flex xs7>
                                <v-btn default @click.native="buyBuilding(building)" :disabled="!canBuyBuilding(building)">Buy ({{ building.buyCost | currency }})</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-flex>

                <v-flex sm3>
                    <transition-group name="scale-transition" tag="div">
                        <v-layout class="upgrades" v-if="showUpgrades" key="div">
                            <h3>Upgrades</h3>

                            <v-container class="scroll-y">
                                <div class="upgrade" v-for="upgrade in sortedUpgrades" v-if="!upgrade.active && (canBuyUpgrade(upgrade) || canSeeUpgrade(upgrade))">
                                    <v-tooltip left>
                                        <span slot="activator">
                                            <v-icon light>{{ upgrade.icon }}</v-icon>
                                            <span class="upgrade-link" :class="{ cantbuy:!canBuyUpgrade(upgrade), canafford:canAffordUpgrade(upgrade) }" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost | currency }})</span>
                                        </span>
                                        <span v-html="upgradeText(upgrade)"></span>
                                    </v-tooltip>
                                    
                                </div>
                            </v-container>
                        </v-layout>
                    </transition-group>

                    <transition-group name="scale-transition" tag="div">
                        <v-layout class="achievements" v-if="showAchievements" key="div">
                            <h3>Achievements</h3>

                            <v-container class="scroll-y">
                                <div class="achievement" v-for="achievement in achievements" v-if="achievement.unlocked">
                                    <v-tooltip left>
                                        <span slot="activator">
                                            <v-icon light>{{ achievement.icon }}</v-icon>
                                            <span>{{ achievement.name }}</span>
                                        </span>
                                        <span v-html="achievement.description"></span>
                                    </v-tooltip>
                                </div>
                            </v-container>
                        </v-layout>
                    </transition-group>

                    <GameMenu></GameMenu>
                </v-flex>
            </v-layout>

            <GameAlerts></GameAlerts>

            <v-dialog v-model="bonusDialog">
                <v-card>
                    <v-card-title>
                        <v-card-title>Bonus {{ currencyName }}s</v-card-title>
                    </v-card-title>
                    <v-card-text>
                        While you were away, you earned {{ bonusCurrency | currency }} bonus {{ currencyName }}s!
                    </v-card-text>
                    <v-card-actions>
                        <v-btn default @click.native="bonusDialog = false">Cool!</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <div v-if="goldenActive" class="golden" @click="clickGolden" :style="{ top: goldenTop+'px', right: goldenRight+'px' }">
                <img src="/static/cracker-golden.png">
            </div>

        </v-container>
    </v-app>
</template>

<script>
    import Big from "big.js";
    import EventBus from './eventBus.js';
    import Words from "./words.js";
    import Options from './gameOptions.js';
    import GameData from "./gameData.js";
    import Stats from "./gameStats.js";
    import Utils from "./utils.js";
    import Particles from "./particles.js";

    export default {
        data: function () {
            return this.defaultData();
        },

        computed: {
            sortedUpgrades() {
                if (!this._sortedUpgrades) {
                    // sort upgrades by cost (1 time)
                    let sortedUpgrades = this.upgrades;
                    sortedUpgrades.sort(function (a, b) {
                        return a.cost.minus(b.cost);
                    });
                    this._sortedUpgrades = sortedUpgrades;
                }

                return this._sortedUpgrades;
            }
        },

        methods: {
            defaultData() {
                return {
                    // debug flags
                    cheatMode: false, // gives extra starting currency
                    easyGolden: false, // constant golden spawns
                    disableLoad: false, // don't load saved games
                    disableAutoSave: false, // don't auto save

                    // for fps calculations
                    lastFrame: 0,

                    // in-game state
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

                    // audio (gets loaded)
                    clickSound: 'tick.ogg',
                    goldenSpawnSound: 'bell.ogg',
                    goldenClickSound: 'chaching.ogg',
                }
            },

            getOption(option) {
                return Options.state[option];
            },

            unixTimestamp() {
                return Math.round((new Date()).getTime() / 1000);
            },

            // clicking/currency/cps
            click() {
                if (Options.state.sounds) {
                    this.clickSound.play();
                }

                // add to overall stats
                Stats.commit('addClicks', Stats.state.clickPower);
                
                // add to display/stats currency
                this.addCurrency(Stats.state.clickPower, !this.clickFrenzyActive);

                // enable pulsing
                if (Options.state.animation) {
                    this.currencyPulsing = true;
                    this.currencyPulseLast = this.unixTimestamp();
                }
            },
            addCurrency(amount, loop = false) {
                Stats.commit('addCurrency', amount);

                // loop in currency effect (or not)
                if (loop && !(amount == 1 || Stats.state.cps.gte(amount.times(10)))) {
                    this.loopCurrency(amount);
                } else {
                    this.currency = this.currency.plus(amount);
                }
            },
            subtractCurrency(amount, loop = false) {
                Stats.commit('subtractCurrency', amount);

                // loop in currency effect (or not)
                if (loop && !(amount == 1 || Stats.state.cps.gte(amount.times(10)))) {
                    this.loopCurrency(amount.times(-1), 166);
                } else {
                    this.currency = this.currency.minus(amount);
                }
            },
            // show currency ticking up effect (when clicking & loading)
            // this.currency is only used for front-end display
            loopCurrency(amount, ms = 333) {
                let vm = this;
                let loopAmount = 10;
                if (amount.abs().lt(10)) {
                    loopAmount = amount;
                }
                let tickAmount = amount.div(loopAmount);
                for (let i = 0; i < loopAmount; i++) {
                    setTimeout(function timer() {
                        vm.currency = vm.currency.plus(tickAmount);
                    }, i * ms / loopAmount);
                }
            },
            recalculateClickPower() {
                let clickPower = this.upgradeMultiplier(this.buildingNames[0]).plus(this.upgradeAddition());

                let cpsMultiplierBonus = this.upgradeMultiplier('Clicking').minus(1).times(Stats.state.cps);

                // add frenzy bonus
                if (this.frenzyActive) {
                    cpsMultiplierBonus = cpsMultiplierBonus.times(this.frenzyAmount);
                }

                // add multiplier bonus
                clickPower = clickPower.plus(cpsMultiplierBonus);

                // add click frenzy bonus
                if (this.clickFrenzyActive) {
                    clickPower = clickPower.times(this.clickFrenzyAmount);
                }

                Stats.commit('setClickPower', clickPower);
            },
            recalculateCps() {
                let cps = Big(0);
                let vm = this;
                this.ownedBuildings().forEach(function (building) {
                    let buildingCps = building.baseCps.times(vm.upgradeMultiplier(building.name));
                    building.currentCps = buildingCps;
                    cps = cps.plus(buildingCps.times(building.owned));
                });

                // add finger additive upgrades
                cps = cps.plus(this.upgradeAddition())

                // add production upgrades
                cps = cps.times(this.upgradeProduction());

                // add frenzy bonus
                if (this.frenzyActive) {
                    cps = cps.times(this.frenzyAmount);
                }

                Stats.commit('setCps', cps);
            },

            // buildings
            showBuilding(building) {
                if (building.unlocked == false && Stats.state.totalCurrencyEarned.gte(building.baseCost)) {
                    building.unlocked = true;
                }
                return Stats.state.totalCurrencyEarned.gte(building.showAt);
            },
            canBuyBuilding(building) {
                return Stats.state.currency.gte(this.buildingCost(building));
            },
            buyBuilding(building) {
                if (this.canBuyBuilding(building)) {
                    this.subtractCurrency(this.buildingCost(building), true);
                    building.owned += this.buyAmount;
                    building.unlocked = true; // just in case

                    this.showUpgrades = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                    this.recalculateBuyCosts();
                    this.checkAchievements();
                }
            },
            buildingCost(building) {
                Big.RM = 3;
                return building.baseCost.times(Big(1 + this.buildingCostMultiplier).pow(building.owned + this.buyAmount).minus(Big(1 + this.buildingCostMultiplier).pow(building.owned))).div(this.buildingCostMultiplier).round();
            },
            buildingCount(buildingName) {
                return this.buildings.find(function (building) {
                    return building.name == buildingName;
                }).owned;
            },
            otherBuildingCount(buildingName) {
                let buildingCount = 0;
                this.buildings.find(function (building) {
                    if (building.name != buildingName) {
                        buildingCount += building.owned;
                    }
                });
                return buildingCount;
            },
            ownedBuildings() {
                return this.buildings.filter(function (building) {
                    return building.owned > 0;
                });
            },
            buildingText(building) {
                if (building.unlocked == false) {
                    return null;
                }
                let buildingCps = building.currentCps * building.owned;
                let buildingCpsPercent = 100 * buildingCps / Stats.state.cps;
                //let buildingText = building.description;
                let buildingText = "Each " + building.name + " produces " + building.currentCps + " " + Stats.state.currencyName + "s per second";
                buildingText += "<br />" + building.owned + " " + building.name + " owned producing " + Utils.round(buildingCps) + " " +  Stats.state.currencyName + "s per second (" + Utils.round(buildingCpsPercent) + "% of total)";
                return buildingText;
            },
            setBuyAmount(amount) {
                this.buyAmount = amount;

                this.recalculateBuyCosts();
            },
            recalculateBuyCosts() {
                let vm = this;
                this.buildings.forEach(function (building) {
                    building.buyCost = vm.buildingCost(building);
                });
            },

            // upgrades
            canAffordUpgrade(upgrade) {
                return Stats.state.currency.gte(upgrade.cost);
            },
            canBuyUpgrade(upgrade) {
                if (upgrade.type == Stats.state.currencyName) {
                    if (Stats.state.currency.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    }
                } else if (upgrade.type == 'Clicking') {
                    if (Stats.state.clicks.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    }
                } else if (upgrade.type == 'Buildings') {
                    let canBuy = true;
                    this.buildings.forEach(function (building) {
                        if (building.owned < upgrade.needed) {
                            canBuy = false;
                        }
                    });
                    return canBuy;
                } else if (this.buildingCount(upgrade.type) >= upgrade.needed) {
                    upgrade.unlocked = true;
                    return true;
                }

                return false;
            },
            canSeeUpgrade(upgrade) {
                if (upgrade.unlocked == true) {
                    return true;
                }

                if (upgrade.type != 'Clicking' && upgrade.type != 'Buildings' && upgrade.type != Stats.state.currencyName && this.buildingCount(upgrade.type) == 0) {
                    return false;
                }
                if (upgrade.type == Stats.state.currencyName) {
                    if (Stats.state.currency.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    }
                } else if (upgrade.type == 'Clicking') {
                    if (Stats.state.clicks.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    }
                } else if (upgrade.type == 'Buildings') {
                    return this.canBuyUpgrade(upgrade);
                } else if (upgrade.cost == this.nextUpgrade(upgrade.type).cost) {
                    upgrade.unlocked = true;
                    return true;
                }

                return false;
            },
            buyUpgrade(upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.canAffordUpgrade(upgrade)) {
                    this.subtractCurrency(upgrade.cost, true);
                    upgrade.active = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                    this.checkAchievements();

                    Stats.commit('addUpgrade');
                }
            },
            activeUpgrades(buildingType) {
                return this.upgrades.filter(function (upgrade) {
                    return upgrade.active && upgrade.type == buildingType;
                });
            },
            nextUpgrade(buildingType) {
                let vm = this;
                return this.upgrades.find(function (upgrade) {
                    return !upgrade.active && upgrade.type == buildingType && upgrade.needed > vm.buildingCount(buildingType);
                });
            },
            upgradeMultiplier(buildingType) {

                let multiplier = Big(1);
                this.activeUpgrades(buildingType).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        multiplier = multiplier.times(upgrade.multiplier);
                    }
                });
                return multiplier;
            },
            upgradeAddition() {
                let addition = Big(0);
                this.activeUpgrades(this.buildingNames[0]).forEach(function (upgrade) {
                    if (upgrade.addition != null) {
                        addition = addition.plus(upgrade.addition);
                    }
                });
                return addition * this.otherBuildingCount(this.buildingNames[0]);
            },
            upgradeProduction() {
                let production = 1;
                this.activeUpgrades(Stats.state.currencyName).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        production *= upgrade.multiplier;
                    }
                });
                this.activeUpgrades("Buildings").forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        production *= upgrade.multiplier;
                    }
                });
                return production;
            },
            upgradeText(upgrade) {
                let description = '';

                // production upgrade
                if (upgrade.type == Stats.state.currencyName || upgrade.type == "Buildings") {
                    description += "Multiplies " + Stats.state.currencyName + " production by " + upgrade.multiplier + "x";
                    return description;
                }

                // clicking upgrade
                if (upgrade.type == "Clicking") {
                    description += 'Clicking gains 1% of your ' + Stats.state.currencyName + ' per second';
                    return description;
                }

                // building upgrade
                if (upgrade.multiplier > 0) {
                    description += "Multiplies " + upgrade.type + " production by " + upgrade.multiplier + "x";
                    if (upgrade.type == this.buildingNames[0]) {
                        description += "<br /><strong>Also multiplies clicks</strong>";
                    }
                } else if (upgrade.addition > 0) {
                    description += "Adds " + upgrade.addition + " " + Stats.state.currencyName + " production for every non-" + upgrade.type + " building owned";
                    if (upgrade.type == this.buildingNames[0]) {
                        description += "<br /><strong>Also adds to clicks</strong>";
                    }
                }
                if (this.buildingCount(upgrade.type) < upgrade.needed) {
                    description += "<br /><strong>Requires: " + upgrade.needed + " " + upgrade.type + "</strong>";
                }
                
                return description;
            },

            // achievements
            checkAchievements() {
                let vm = this;
                this.lockedAchievements().forEach(function (achievement) {
                    if (achievement.cps != null) {
                        if (Stats.state.cps.gte(achievement.cps)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else if (achievement.clicks != null) {
                        if (Stats.state.clicks.gte(achievement.clicks)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else if (achievement.type == Stats.state.currencyName) {
                        if (Stats.state.totalCurrencyEarned.gte(achievement.total)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else {
                        if (vm.buildingCount(achievement.type) >= achievement.total) {
                            vm.unlockAchievement(achievement);
                        }
                    }
                });
            },
            lockedAchievements() {
                return this.achievements.filter(function (achievement) {
                    return achievement.unlocked == false;
                });
            },
            unlockAchievement(achievement) {
                achievement.unlocked = true;
                this.showAchievements = true;

                if (Options.state.alerts) {
                    EventBus.$emit('addAlert', achievement);
                }

                Stats.commit('addAchievement');
            },

            // tick function
            tick(timestamp) {
                let progress = timestamp - this.lastFrame;
                this.lastFrame = timestamp;

                // how much to add this frame
                let division = 1000 / progress;
                let currencyIncrement = Stats.state.cps.div(division);

                // check for bonus end
                if (this.luckyActive) {
                    if (this.unixTimestamp() > this.luckyEnd) {
                        this.luckyActive = false;
                    }
                }
                if (this.clickFrenzyActive) {
                    if (this.unixTimestamp() > this.clickFrenzyEnd) {
                        this.clickFrenzyActive = false;
                        this.recalculateCps();
                        this.recalculateClickPower();
                    }
                }
                if (this.frenzyActive) {
                    if (this.unixTimestamp() > this.frenzyEnd) {
                        this.frenzyActive = false;
                        this.recalculateCps();
                        this.recalculateClickPower();
                    }
                }

                // increment currency
                this.addCurrency(currencyIncrement);

                if (!this.lastCps.eq(Stats.state.cps)) {
                    this.lastCps = Stats.state.cps;
                    this.cpsTick = Stats.state.cps.minus(this.displayedCps).div(division / 2);
                }
                if (!this.displayedCps.eq(Stats.state.cps)) {
                    this.displayedCps = this.displayedCps.plus(this.cpsTick);
                    if (this.displayedCps.gt(Stats.state.cps)) {
                        this.displayedCps = Stats.state.cps;
                    }
                }

                if (!this.lastClickPower.eq(Stats.state.clickPower)) {
                    this.lastClickPower = Stats.state.clickPower;
                    this.clickPowerTick = Stats.state.clickPower.minus(this.displayedClickPower).div(division / 2);
                }
                if (!this.displayedClickPower.eq(Stats.state.clickPower)) {
                    this.displayedClickPower = this.displayedClickPower.plus(this.clickPowerTick);
                    if (this.displayedClickPower.gt(Stats.state.clickPower)) {
                        this.displayedClickPower = Stats.state.clickPower;
                    }
                }

                if (!this.goldenActive && (this.easyGolden || this.unixTimestamp() >= this.goldenNext)) {
                    this.spawnGolden();
                } else if (this.goldenActive) {
                    if (this.unixTimestamp() > this.goldenDisappear) {
                        this.goldenActive = false;
                        this.initGolden();
                    }
                }

                window.requestAnimationFrame(this.tick);
            },

            // generate stuff
            generateBuildings() {
                let buildingNames = Utils.shuffleArray(this.words.buildingNames);
                for (let i = 0; i < GameData.buildings.length; i++) {
                    let buildingName = buildingNames.pop();
                    let building = JSON.parse(JSON.stringify(GameData.buildings[i]));
                    let buildingIcon = this.icons.pop();
                    building.baseCost = Big(building.baseCost);
                    building.buyCost = Big(building.baseCost);
                    building.baseCps = Big(building.baseCps);
                    building.currentCps = Big(building.baseCps);
                    building.unlocked = false;
                    building.name = buildingName;
                    building.owned = 0;
                    if (i >= 2) {
                        building.showAt = Big(GameData.buildings[(i - 2)].baseCost);
                    } else {
                        building.showAt = Big(0);
                    }
                    building.icon = buildingIcon;

                    this.buildings.push(building);
                    this.buildingNames.push(buildingName);
                    this.buildingIcons.push(buildingIcon);
                }
            },
            generateUpgrades() {
                let vm = this;

                // cps upgrades
                this.cpsIcon = this.icons.pop();
                GameData.productionUpgrades.forEach(function (productionUpgrade) {
                    let upgrade = {
                        type: Stats.state.currencyName,
                        name: vm.adjectives.pop() + " " + Stats.state.currencyName + "s",
                        needed: Big(productionUpgrade.needed),
                        cost: Big(productionUpgrade.cost),
                        multiplier: productionUpgrade.multiplier,
                        unlocked: false,
                        active: false,
                        icon: vm.cpsIcon,
                    };

                    vm.upgrades.push(upgrade);
                });

                // X of every building production upgrades
                GameData.buildingProductionUpgrades.forEach(function (buildingUpgrade) {
                    let upgrade = {
                        type: 'Buildings',
                        name: vm.adjectives.pop() + " " + Stats.state.currencyName + "s",
                        needed: Big(buildingUpgrade.needed),
                        cost: Big(buildingUpgrade.cost),
                        multiplier: buildingUpgrade.multiplier,
                        unlocked: false,
                        active: false,
                        icon: vm.cpsIcon,
                    };

                    vm.upgrades.push(upgrade);
                });

                // building upgrades
                let upgradeIndex = 0;
                GameData.buildingUpgradeCosts.forEach(function (upgradeParams) {
                    let upgradeCosts = upgradeParams.costs;
                    let upgradeNeeds = GameData.buildingUpgradeNeeds[1];
                    let upgradeAmounts = GameData.buildingUpgradeAmounts[1];
                    if (upgradeIndex == 0) {
                        upgradeNeeds = GameData.buildingUpgradeNeeds[0];
                        upgradeAmounts = GameData.buildingUpgradeAmounts[0];
                    }

                    for (let i = 0; i < upgradeNeeds.length; i++) {
                        let upgrade = {
                            type: vm.buildingNames[upgradeIndex],
                            name: vm.adjectives.pop() + " " + vm.buildingNames[upgradeIndex] + "s",
                            needed: upgradeNeeds[i],
                            cost: Big(upgradeCosts[i]),
                            unlocked: false,
                            active: false,
                            icon: vm.buildingIcons[upgradeIndex]
                        };

                        // parse amount
                        if (upgradeAmounts[i].substr(0, 1) == "m") {
                            upgrade.multiplier = parseInt(upgradeAmounts[i].substr(1));
                        } else if (upgradeAmounts[i].substr(0, 1) == "a") {
                            upgrade.addition = parseFloat(upgradeAmounts[i].substr(1));
                        }

                        vm.upgrades.push(upgrade);
                    }

                    upgradeIndex++;
                });

                // clicking upgrades
                this.clicksIcon = this.icons.pop();
                GameData.clickingUpgrades.forEach(function (upgradeParams) {
                    let upgrade = {
                        type: 'Clicking',
                        name: vm.adjectives.pop() + " Mouse",
                        multiplier: upgradeParams.multiplier,
                        needed: Big(upgradeParams.needed),
                        cost: Big(upgradeParams.cost),
                        unlocked: false,
                        active: false,
                        icon: vm.clicksIcon,
                    };

                    vm.upgrades.push(upgrade);
                });
            },
            generateAchievements() {
                let vm = this;

                this.totalIcon = this.icons.pop();
                GameData.productionAchievements.forEach(function (productionAchievement) {
                    let achievement = {
                        type: Stats.state.currencyName,
                        name: vm.adjectives.pop() + " " + Stats.state.currencyName + "s",
                        unlocked: false,
                    };

                    if (productionAchievement.total != null) {
                        achievement.total = Big(productionAchievement.total);
                        achievement.icon = vm.totalIcon;
                        achievement.description = "Generated a total of " + productionAchievement.total + " " + Stats.state.currencyName + "s";
                    } else if (productionAchievement.cps != null) {
                        achievement.cps = Big(productionAchievement.cps);
                        achievement.icon = vm.cpsIcon;
                        achievement.description = "Reached a total of " + productionAchievement.cps + " " + Stats.state.currencyName + "/sec";
                    } else if (productionAchievement.clicks != null) {
                        achievement.clicks = Big(productionAchievement.clicks);
                        achievement.icon = vm.clicksIcon;
                        achievement.description = "Generated a total of " + productionAchievement.clicks + " " + Stats.state.currencyName + "s using clicks";
                    }

                    vm.achievements.push(achievement);
                });

                GameData.buildingAchievements.forEach(function (buildingAchivement) {
                    let upgradeIndex = buildingAchivement.type;

                    let achievement = {
                        type: vm.buildingNames[upgradeIndex],
                        name: vm.adjectives.pop() + " " + vm.buildingNames[upgradeIndex],
                        total: Big(buildingAchivement.total),
                        unlocked: false,
                        icon: vm.buildingIcons[upgradeIndex],
                        description: "Built a total of " + buildingAchivement.total + " " + vm.buildingNames[upgradeIndex],
                    };

                    vm.achievements.push(achievement);
                });
            },

            // golden
            initGolden() {
                this.goldenNext = this.unixTimestamp() + Math.floor(Math.random() * (this.goldenMaximumTime - this.goldenMinimumTime)) + this.goldenMinimumTime;
                this.goldenDisappear = this.goldenNext + this.goldenStay;
            },
            spawnGolden() {
                let x = document.body.offsetWidth;
                let y = document.body.offsetHeight;

                let randomX = Math.floor(Math.random() * x);
                let randomY = Math.floor(Math.random() * y);

                this.goldenRight = randomX;
                this.goldenTop = randomY;
                this.goldenActive = true;

                Stats.commit('addGoldenSpawned');

                if (Options.state.sounds) {
                    this.goldenSpawnSound.play();
                }
            },
            clickGolden() {
                // 0 - 99
                let roll = Math.floor(Math.random() * 100);
                if (roll >= 95 && !this.clickFrenzyActive) {
                    // click frenzy
                    this.clickFrenzyActive = true;
                    this.clickFrenzyEnd = this.unixTimestamp() + this.clickFrenzyLength;
                } else if (roll >= 47 && !this.frenzyActive) {
                    // frenzy
                    this.frenzyActive = true;
                    this.frenzyEnd = this.unixTimestamp() + this.frenzyLength;
                } else {
                    // lucky
                    let bonus1 = Stats.state.cps.times(900);
                    let bonus2 = Stats.state.currency.times(0.15);
                    this.luckyAmount = bonus1;
                    if (bonus1.gt(bonus2)) {
                        this.luckyAmount = bonus2;
                    }
                    this.luckyAmount = this.luckyAmount.plus(13)
                    this.luckyActive = true;
                    this.luckyEnd = this.unixTimestamp() + this.luckyLength;

                    this.addCurrency(this.luckyAmount, true);
                }

                if (Options.state.sounds) {
                    this.goldenClickSound.play();
                }

                this.recalculateCps();
                this.recalculateClickPower();

                Stats.commit('addGoldenClicked');

                this.goldenActive = false;
                this.initGolden();
            },

            // new/save/load
            newGame() {
                // load default data
                Object.assign(this.$data, this.defaultData());
                this._sortedUpgrades = null;

                // reset stats/options
                Stats.commit('resetState');
                Options.commit('resetState');
                EventBus.$emit('updateOptions');

                // load word lists
                this.words = JSON.parse(JSON.stringify(Words));

                // get currency name & adjectives
                //this.currencyName = Utils.shuffleArray(GameData.currencies).pop();
                let currencyName = 'Cracker';
                Stats.commit('setCurrencyName', currencyName);
                this.currencyName = currencyName;
                document.title = currencyName + ' Clicker';
                this.adjectives = Utils.shuffleArray(this.words.adjectives);
                this.icons = Utils.shuffleArray(this.words.icons);

                // generate stuff
                this.generateBuildings();
                this.generateUpgrades();
                this.generateAchievements();

                // loop in starting currency (if any)
                if (this.startingCurrency.gt(0)) {
                    this.addCurrency(this.startingCurrency, true);
                }
            },
            hardReset() {
                if (confirm("Are you sure?")) {
                    if(confirm("Are you REALLY sure? You will lose EVERYTHING for hard resetting with no prestige bonus!")) {
                        // start new game
                        this.newGame();
                        this.loadSounds();
                        this.initGolden();

                        // save game
                        this.saveGame();

                        // clear alerts & toggle menu
                        EventBus.$emit('clearAlerts');
                        EventBus.$emit('toggleMenu');
                        EventBus.$emit('send');
                    }
                }
            },
            saveGame() {
                let saveData = {
                    // misc state
                    buildingCostMultiplier: this.buildingCostMultiplier,
                    buildingNames: this.buildingNames,
                    buildings: this.buildings,
                    upgrades: this.upgrades,
                    achievements: this.achievements,
                    timestamp: this.unixTimestamp(),
                    buyAmount: this.buyAmount,

                    options: Options.state,
                    stats: Stats.state,
                };

                localStorage.setItem("SaveGame", JSON.stringify(saveData));

                console.log("Game Saved");
            },
            loadGame(saveJson) {
                let saveData = JSON.parse(saveJson);
                let vm = this;

                // load stats/options
                Options.replaceState(saveData.options);
                EventBus.$emit('updateOptions');
                Stats.replaceState(Utils.convertObjectToBig(saveData.stats));

                this.currencyName = Stats.state.currencyName;
                document.title = Stats.state.currencyName + ' Clicker';
                this.currency = Big(0); // this will be looped in, display only
                this.displayedCps = Big(0);
                this.displayedClickPower = Big(1);
                this.buildingNames = saveData.buildingNames;
                this.buildingCostMultiplier = saveData.buildingCostMultiplier;
                this.buyAmount = saveData.buyAmount;

                // TODO below stuff should be integrated with the same function as newgame?
                
                // parse buildings/upgrades/achievements (cast numbers to big.js)
                this.buildings = [];
                let showUpgrades = false;
                saveData.buildings.forEach(function (saveBuilding) {
                    let building = {
                        name: saveBuilding.name,
                        baseCost: Big(saveBuilding.baseCost),
                        buyCost: Big(saveBuilding.buyCost),
                        baseCps: Big(saveBuilding.baseCps),
                        currentCps: Big(saveBuilding.currentCps),
                        description: saveBuilding.description,
                        unlocked: saveBuilding.unlocked,
                        showAt: saveBuilding.showAt,
                        owned: saveBuilding.owned,
                        icon: saveBuilding.icon
                    };
                    if (building.owned > 0) {
                        showUpgrades = true;
                    }
                    vm.buildings.push(building);
                });

                this.upgrades = [];
                saveData.upgrades.forEach(function (saveUpgrade) {
                    let upgrade = {
                        type: saveUpgrade.type,
                        name: saveUpgrade.name,
                        needed: saveUpgrade.needed,
                        cost: Big(saveUpgrade.cost),
                        icon: saveUpgrade.icon,
                        unlocked: saveUpgrade.unlocked,
                        active: saveUpgrade.active
                    };
                    if (saveUpgrade.addition != null) {
                        upgrade.addition = saveUpgrade.addition;
                    }
                    if (saveUpgrade.multiplier != null) {
                        upgrade.multiplier = saveUpgrade.multiplier;
                    }
                    if (upgrade.unlocked) {
                        showUpgrades = true;
                    }

                    vm.upgrades.push(upgrade);
                });
                this.showUpgrades = showUpgrades;

                this.achievements = [];
                let showAchievements = false;
                saveData.achievements.forEach(function (saveAchievement) {
                    let achievement = {
                        type: saveAchievement.type,
                        name: saveAchievement.name,
                        unlocked: saveAchievement.unlocked,
                        icon: saveAchievement.icon,
                        description: saveAchievement.description,
                    };
                    if (saveAchievement.total != null) {
                        achievement.total = Big(saveAchievement.total);
                    }
                    if (saveAchievement.cps != null) {
                        achievement.cps = Big(saveAchievement.cps);
                    }
                    if (saveAchievement.clicks != null) {
                        achievement.clicks = Big(saveAchievement.clicks);
                    }

                    if (achievement.unlocked) {
                        showAchievements = true;
                    }

                    vm.achievements.push(achievement);
                });
                this.showAchievements = showAchievements;

                // calculate bonus currency
                let timeDifference = this.unixTimestamp() - saveData.timestamp;
                this.bonusCurrency = Stats.state.cps.div(2).times(timeDifference).round();

                // show dialog if earned over 10% saved currency
                if (this.bonusCurrency.gt(0) && this.bonusCurrency.gte(Big(Stats.state.currency).div(10))) {
                    this.bonusDialog = true;
                }

                // loop in currency (already added to Stats so don't use addCurrency)
                let startingCurrency = Big(Stats.state.currency).plus(this.bonusCurrency);
                if (startingCurrency.gt(0)) {
                    this.loopCurrency(startingCurrency, 500);
                }

                console.log("Game Loaded");
                //this.saveGame();
            },
            loadSounds() {
                this.clickSound = new Audio('/static/' + this.clickSound);
                this.goldenSpawnSound = new Audio('/static/' + this.goldenSpawnSound);
                this.goldenClickSound = new Audio('/static/' + this.goldenClickSound);
            },
        },
        filters: {
            round(value) {
                return Utils.round(value);
            },
            currency(value) {
                return Utils.currency(value);
            }
        },
        mounted() {
            // load game or new
            if (!this.disableLoad && localStorage.getItem("SaveGame") != null) {
                this.loadGame(localStorage.getItem("SaveGame"));
            } else {
                this.newGame();
                if (this.cheatMode) {
                    this.addCurrency(1000);
                }
            }
            // load audio
            this.loadSounds();

            // check achievements every couple seconds
            setInterval(function () {
                this.checkAchievements();
            }.bind(this), 2000);

            // auto save every 30 seconds
            setInterval(function () {
                if (!this.disableAutoSave) {
                    this.saveGame();
                }
            }.bind(this), 30000);

            // check for currency pulse end every second
            setInterval(function() {
                if (this.currencyPulseLast && this.unixTimestamp() > this.currencyPulseLast) {
                    this.currencyPulsing = false;
                }
            }.bind(this), 1000);

            // init next golden currency
            this.initGolden();

            // start update loop (dynamic fps)
            window.requestAnimationFrame(this.tick);

            // start particle effects
            Particles.setupParticles();

            // add event listeners for other components
            let vm = this;
            EventBus.$on('saveGame', this.saveGame);
            EventBus.$on('hardReset', this.hardReset);
        }
    };
</script>

<style>
    .left-panel {
        margin-right: 20px;
    }

    .totals,
    .currency,
    .buildings,
    .upgrades,
    .achievements {
        margin-top: 30px;
        flex-direction: column;
    }

    .upgrades, .achievements {
        max-height: 400px;
    }

    .totals,
    .currency {
        align-items: center;
    }

    .currency {
        height: 350px;
        background-image: url("/static/cracker.png");
        background-position: center;
        background-repeat: no-repeat;
    }

    .buy-sell-buttons {
        margin-bottom: 20px;
    }

    .upgrade-link {
        text-decoration: underline;
    }

    .building {
        margin-bottom: 10px;
    }

    .upgrade {
        margin-bottom: 5px;
    }

    .golden {
        position: absolute;
        opacity: 0.75;
    }

    .active {
        filter: brightness(85%);
    }

    .cantbuy {
        text-decoration-line: line-through;
        color: #999;
    }

    .canafford {
        font-weight: bolder;
    }

    .bonusMessage {
        padding: 5px;
    }

    /* "spoiler" effect */
    .redacted {
        color: black;
        background-color: black;
        white-space: nowrap;
        -moz-transform: rotate(.8deg) skewx(-12deg);
        transform: rotate(.8deg) skewx(-12deg);
        -moz-box-shadow: 3px 0 2px #444;
        box-shadow: 3px 0 2px #444;
        border: 1px dotted #555;
        background: -moz-linear-gradient(180deg, #000, #222);
    }

    /* currency pulsing effect */
    .pulse {
        -webkit-animation: pulsate 1s ease-out;
        -webkit-animation-iteration-count: infinite;
    }
    @-webkit-keyframes pulsate {
        0% {-webkit-transform: scale(1.0, 1.0);}
        50% {-webkit-transform: scale(1.05, 1.05);}
        100% {-webkit-transform: scale(1.0, 1.0);}
    }
    .frenzy {
        -webkit-animation: frenzy 0.5s ease-out;
        -webkit-animation-iteration-count: infinite;
    }
    @-webkit-keyframes frenzy {
        0% {-webkit-transform: scale(1.0, 1.0);}
        50% {-webkit-transform: scale(1.15, 1.15);}
        100% {-webkit-transform: scale(1.0, 1.0);}
    }
</style>
