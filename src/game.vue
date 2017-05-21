<template>
    <v-app>
        <v-container fluid="fluid">
            <v-layout>
                <v-flex md5>
                    <v-layout class="totals">

                        <h2>{{ currency | currency }} {{ currencyName}}s</h2>
                        <h3 class="red" v-show="luckyActive">Lucky! ({{ luckyAmount | currency }} bonus)</h3>

                        <h3>Per second: {{ displayedCps | round }}</h3>
                        <h4 class="red" v-show="frenzyActive">FRENZY! (x{{ this.frenzyAmount }} production)</h4>

                        <h4>Per click: {{ displayedClickPower | currency }}</h4>
                        <h5 class="red" v-show="clickFrenzyActive">CLICK FRENZY!!! (x{{ this.clickFrenzyAmount }} clicks)</h5>

                    </v-layout>

                    <center>
                        <div class="row currency" id="currency" @click="click"></div>
                    </center>
                </v-flex>

                <v-flex md4>
                    <v-layout class="buildings">
                        <h3>Buildings</h3>

                        <div class="buy-sell-buttons">
                            <v-btn dark default class="green" :class="{ active:this.buyAmount == 1 }" @click.native="setBuyAmount(1)">Buy 1</v-btn>
                            <v-btn dark default class="green" :class="{ active:this.buyAmount == 10 }" @click.native="setBuyAmount(10)">Buy 10</v-btn>
                            <v-btn dark default class="green" :class="{ active:this.buyAmount == 100 }" @click.native="setBuyAmount(100)">Buy 100</v-btn>
                        </div>

                        <v-layout class="building" v-for="building in buildings" :key="building" v-if="building.owned > 0 || showBuilding(building)">
                            <v-flex xs5>
                                <span v-if="building.unlocked" v-tooltip:top="{ html: buildingText(building) }"><v-icon dark>{{ building.icon }}</v-icon></span>
                                <span :class="{ redacted:building.unlocked == false }">{{ building.name }}</span>
                                <span>({{ building.owned }} owned)</span>
                            </v-flex>
                            <v-flex xs7>
                                <v-btn dark default @click.native="buyBuilding(building)" :disabled="!canBuyBuilding(building)">Buy ({{ building.buyCost | currency }})</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-flex>

                <v-flex md3>
                    <v-layout class="upgrades" v-if="showUpgrades">
                        <h3>Upgrades</h3>

                        <div class="upgrade" v-for="upgrade in sortedUpgrades" v-if="!upgrade.active && (canBuyUpgrade(upgrade) || canSeeUpgrade(upgrade))">
                            <span v-tooltip:top="{ html: upgradeText(upgrade) }"><v-icon dark>{{ upgrade.icon }}</v-icon></span>
                            <span class="upgrade-link" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost | currency }})</span>
                        </div>
                    </v-layout>

                    <v-layout class="achievements" v-if="showAchievements">
                        <h3>Achievements</h3>

                        <div class="achievement" v-for="achievement in achievements" v-if="achievement.unlocked">
                            <span v-tooltip:top="{ html: achievementText(achievement) }"><v-icon dark>{{ achievement.icon }}</v-icon></span>
                            <span>{{ achievement.name }}</span>
                        </div>
                    </v-layout>

                    <div class="game-utils">
                        <v-btn dark default class="blue" @click.native="saveGame">Save Game</v-btn>
                        <v-btn dark default class="red" @click.native="hardReset">Hard Reset</v-btn>
                    </div>
                </v-flex>
            </v-layout>

            <GameAlerts></GameAlerts>

            <v-dialog v-model="bonusDialog">
                <v-card>
                    <v-card-row>
                        <v-card-title>Bonus {{ currencyName }}s</v-card-title>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text>
                            While you were away, you earned {{ bonusCurrency | currency }} bonus {{ currencyName }}s!
                        </v-card-text>
                    </v-card-row>
                    <v-card-row actions>
                        <v-btn dark default @click.native="bonusDialog = false">Cool!</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>

            <div v-if="goldenActive" class="golden" @click="clickGolden" :style="{ top: goldenTop+'px', right: goldenRight+'px' }">
                <img src="/static/cracker-golden.png">
            </div>

        </v-container>
    </v-app>
</template>

<script>
    import GameData from "./gameData.js";

    import Words from "./words.js";
    import Big from "big.js";
    import Sketch from "sketch-js";

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
                    // debug mode doesn't load game & starts with a lot of currency + fast golden crackers
                    debug: false,

                    // for fps calculations
                    lastFrame: 0,

                    // game data
                    currencyName: null,
                    currency: Big(0),
                    startingCurrency: Big(1E12),
                    totalCurrency: Big(0),
                    bonusCurrency: Big(0),
                    bonusDialog: false,
                    currencySuffix: '',
                    clicks: Big(0),
                    cps: Big(0),
                    lastCps: Big(0),
                    displayedCps: Big(0),
                    cpsTick: Big(0),
                    clickPower: Big(1),
                    lastClickPower: Big(1),
                    displayedClickPower: Big(1),
                    clickPowerTick: Big(0),
                    buyAmount: 1,
                    showUpgrades: false,
                    showAchievements: false,
                    achievementCount: 0,

                    buildingCostMultiplier: 0.15,

                    // this stuff gets loaded from data files
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

                    // golden crackers
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

            unixTimestamp() {
                return Math.round((new Date()).getTime() / 1000);
            },

            // clicking/cps
            click() {
                this.clickSound.play();

                // add to overall stats
                this.clicks = this.clicks.plus(this.clickPower);
                this.totalCurrency = this.totalCurrency.plus(this.clickPower);

                // skip loop if cps is too high or clickPower = 1
                if (this.clickPower == 1 || this.clickFrenzyActive || this.cps.gte(this.clickPower.times(10))) {
                    this.currency = this.currency.plus(this.clickPower);
                    return;
                }

                this.loopCurrency(this.clickPower);
            },
            // show currency ticking up effect (when clicking & loading)
            loopCurrency(amount, ms = 333) {
                let vm = this;
                let loopAmount = 10;
                if (amount < 10) {
                    loopAmount = amount;
                }
                let clickAmount = amount.div(loopAmount);
                for (let i = 0; i < loopAmount; i++) {
                    setTimeout(function timer() {
                        vm.currency = vm.currency.plus(clickAmount);
                    }, i * ms / loopAmount);
                }
            },
            recalculateClickPower() {
                let clickPower = this.upgradeMultiplier(this.buildingNames[0]).plus(this.upgradeAddition());

                // add click frenzy bonus
                if (this.clickFrenzyActive) {
                    clickPower = clickPower.times(this.clickFrenzyAmount);
                }

                let cpsMultiplierBonus = this.upgradeMultiplier('Clicking').minus(1).times(this.cps);

                // add frenzy bonus
                if (this.frenzyActive) {
                    cpsMultiplierBonus = cpsMultiplierBonus.times(this.frenzyAmount);
                }
                this.clickPower = clickPower.plus(cpsMultiplierBonus);
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

                this.cps = cps;
            },

            // buildings
            showBuilding(building) {
                if (building.unlocked == false && this.totalCurrency.gte(building.baseCost)) {
                    building.unlocked = true;
                }
                return this.totalCurrency.gte(building.showAt);
            },
            canBuyBuilding(building) {
                return this.currency.gte(this.buildingCost(building, this.buyAmount));
            },
            buyBuilding(building) {
                if (this.canBuyBuilding(building, this.buyAmount)) {
                    this.currency = this.currency.minus(this.buildingCost(building));
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
                let buildingCpsPercent = 100 * buildingCps / this.cps;
                //let buildingText = building.description;
                let buildingText = "Each " + building.name + " produces " + building.currentCps + " " + this.currencyName + "s per second";
                buildingText += "\n" + building.owned + " " + building.name + " owned producing " + this.$options.filters.round(buildingCps) + " " + this.currencyName + "s per second (" + this.$options.filters.round(buildingCpsPercent) + "% of total)";
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
            canBuyUpgrade(upgrade) {
                if (upgrade.type == this.currencyName) {
                    if (this.currency.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    }

                    return false;
                } else {
                    if (upgrade.type == 'Clicking') {
                        if (this.clicks.gte(upgrade.cost)) {
                            upgrade.unlocked = true;
                            return true;
                        }
                    } else if (this.buildingCount(upgrade.type) >= upgrade.needed) {
                        upgrade.unlocked = true;
                        return true;
                    }

                    return false;
                }
            },
            canSeeUpgrade(upgrade) {
                if (upgrade.unlocked == true) {
                    return true;
                }

                if (upgrade.type != 'Clicking' && upgrade.type != this.currencyName && this.buildingCount(upgrade.type) == 0) {
                    return false;
                }
                if (upgrade.type == this.currencyName) {
                    if (this.currency.gte(upgrade.needed / 10)) {
                        upgrade.unlocked = true;
                        return true;
                    }

                    return false;
                } else {
                    if (upgrade.type == 'Clicking') {
                        if (this.clicks.gte(upgrade.needed)) {
                            upgrade.unlocked = true;
                            return true;
                        }
                    } else if (upgrade.cost == this.nextUpgrade(upgrade.type).cost) {
                        upgrade.unlocked = true;
                        return true;
                    }

                    return false;
                }
            },
            buyUpgrade(upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.currency.gte(upgrade.cost)) {
                    this.currency = this.currency.minus(upgrade.cost);
                    upgrade.active = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                    this.checkAchievements();
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
                this.activeUpgrades(this.currencyName).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        production *= upgrade.multiplier;
                    }
                });
                return production;
            },
            upgradeText(upgrade) {
                let upgradeText = '';// upgrade.description;
                if (upgrade.type == 'Clicking') {
                    upgradeText += 'Clicking gains 1% of your ' + this.currencyName + ' per second';
                } else if (upgrade.multiplier != null) {
                    upgradeText += "Multiplies " + upgrade.type + " production by " + upgrade.multiplier + "x";
                    if (upgrade.type == this.buildingNames[0]) {
                        upgradeText += "\nAlso multiplies clicks";
                    }
                } else if (upgrade.addition != null) {
                    upgradeText += "Adds " + upgrade.addition + " " + this.currencyName + " production for every non-" + upgrade.type + " building owned";
                    if (upgrade.type == this.buildingNames[0]) {
                        upgradeText += "\nAlso adds to clicks";
                    }
                }
                if (upgrade.type != 'Clicking' && upgrade.type != this.currencyName && this.buildingCount(upgrade.type) < upgrade.needed) {
                    upgradeText += "\nRequires " + upgrade.needed + " " + upgrade.type;
                }

                return upgradeText;
            },

            // achievements
            checkAchievements() {
                let vm = this;
                this.lockedAchievements().forEach(function (achievement) {
                    if (achievement.cps != null) {
                        if (vm.cps.gte(achievement.cps)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else if (achievement.clicks != null) {
                        if (vm.clicks.gte(achievement.clicks)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else if (achievement.type == vm.currencyName) {
                        if (vm.totalCurrency.gte(achievement.total)) {
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
                this.achievementCount++;
                this.showAchievements = true;

                Event.fire('addAlert', achievement.name)
            },
            achievementText(achievement) {
                if (achievement.cps != null) {
                    return "Reached a total of " + achievement.cps + " " + this.currencyName + "/sec";
                } else if (achievement.clicks != null) {
                    return "Generated a total of " + achievement.clicks + " " + this.currencyName + "s using clicks";
                } else if (achievement.type == this.currencyName) {
                    return "Generated a total of " + achievement.total + " " + this.currencyName + "s";
                } else {
                    return "Built a total of " + achievement.total + " " + achievement.type;
                }
            },

            // tick function
            tick(timestamp) {
                let progress = timestamp - this.lastFrame;
                this.lastFrame = timestamp;

                // how much to add this frame
                let division = 1000 / progress;
                let currencyIncrement = this.cps.div(division);

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
                this.currency = this.currency.plus(currencyIncrement);
                this.totalCurrency = this.totalCurrency.plus(currencyIncrement);

                if (!this.lastCps.eq(this.cps)) {
                    this.lastCps = this.cps;
                    this.cpsTick = this.cps.minus(this.displayedCps).div(division / 2);
                }
                if (!this.displayedCps.eq(this.cps)) {
                    this.displayedCps = this.displayedCps.plus(this.cpsTick);
                    if (this.displayedCps.gt(this.cps)) {
                        this.displayedCps = this.cps;
                    }
                }

                if (!this.lastClickPower.eq(this.clickPower)) {
                    this.lastClickPower = this.clickPower;
                    this.clickPowerTick = this.clickPower.minus(this.displayedClickPower).div(division / 2);
                }
                if (!this.displayedClickPower.eq(this.clickPower)) {
                    this.displayedClickPower = this.displayedClickPower.plus(this.clickPowerTick);
                    if (this.displayedClickPower.gt(this.clickPower)) {
                        this.displayedClickPower = this.clickPower;
                    }
                }

                if (!this.goldenActive && this.unixTimestamp() >= this.goldenNext) {
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
                let buildingNames = this.shuffleArray(this.words.buildingNames);
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
                        type: vm.currencyName,
                        name: vm.adjectives.pop() + " " + vm.currencyName + "s",
                        needed: Big(productionUpgrade.needed),
                        cost: Big(productionUpgrade.cost),
                        multiplier: productionUpgrade.multiplier,
                        description: "Need Description",
                        unlocked: false,
                        active: false,
                        icon: vm.cpsIcon,
                    };

                    vm.upgrades.push(upgrade)
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
                            description: "Need Description",
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

                        vm.upgrades.push(upgrade)
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
                        description: "Need Description",
                        unlocked: false,
                        active: false,
                        icon: vm.clicksIcon,
                    };

                    vm.upgrades.push(upgrade)
                });
            },
            generateAchievements() {
                let vm = this;

                this.totalIcon = this.icons.pop();
                GameData.productionAchievements.forEach(function (productionAchievement) {
                    let achievement = {
                        type: vm.currencyName,
                        name: vm.adjectives.pop() + " " + vm.currencyName + "s",
                        unlocked: false,
                    };

                    if (productionAchievement.total != null) {
                        achievement.total = Big(productionAchievement.total);
                        achievement.icon = vm.totalIcon;
                    } else if (productionAchievement.cps != null) {
                        achievement.cps = Big(productionAchievement.cps);
                        achievement.icon = vm.cpsIcon;
                    } else if (productionAchievement.clicks != null) {
                        achievement.clicks = Big(productionAchievement.clicks);
                        achievement.icon = vm.clicksIcon;
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
                    };

                    vm.achievements.push(achievement);
                });

                console.log(this.achievements);
            },

            // setup/save
            newGame() {
                // load default data
                Object.assign(this.$data, this.defaultData());
                this._sortedUpgrades = null;

                // load word lists
                this.words = JSON.parse(JSON.stringify(Words));

                // get currency name & adjectives
                //this.currencyName = this.shuffleArray(GameData.currencies).pop();
                this.currencyName = 'Cracker';
                document.title = this.currencyName + ' Clicker';
                this.adjectives = this.shuffleArray(this.words.adjectives);
                this.icons = this.shuffleArray(this.words.icons);

                // generate stuff
                this.generateBuildings();
                this.generateUpgrades();
                this.generateAchievements();

                // loop in starting currency (if any)
                if (this.startingCurrency.gt(0)) {
                    this.loopCurrency(this.startingCurrency, 500);
                }
            },
            hardReset() {
                if (confirm("Are you sure?")) {
                    // start new game
                    this.newGame();
                    this.loadSounds();
                    this.initGolden();
                }
            },
            saveGame() {
                let saveData = {
                    currencyName: this.currencyName,
                    currency: this.currency,
                    totalCurrency: this.totalCurrency,
                    clicks: this.clicks,
                    cps: this.cps,
                    clickPower: this.clickPower,
                    buyAmount: this.buyAmount,
                    showUpgrades: this.showUpgrades,
                    showAchievements: this.showAchievements,
                    achievementCount: this.achievementCount,
                    buildingCostMultiplier: this.buildingCostMultiplier,
                    buildingNames: this.buildingNames,
                    buildings: this.buildings,
                    upgrades: this.upgrades,
                    achievements: this.achievements,
                    timestamp: this.unixTimestamp(),
                };

                localStorage.setItem("SaveGame", JSON.stringify(saveData));

                console.log("Game Saved");
            },
            loadGame(saveJson) {
                let saveData = JSON.parse(saveJson);
                let vm = this;

                this.currencyName = saveData.currencyName;
                document.title = this.currencyName + ' Clicker';
                this.currency = Big(0); // this will be looped in
                this.totalCurrency = Big(saveData.totalCurrency);
                this.clicks = Big(saveData.clicks);
                this.cps = Big(saveData.cps);
                this.displayedCps = Big(0);
                this.clickPower = Big(saveData.clickPower);
                this.displayedClickPower = Big(1);
                this.buyAmount = saveData.buyAmount;
                this.showUpgrades = saveData.showUpgrades;
                this.showAchievements = saveData.showAchievements;
                this.achievementCount = saveData.achievementCount;
                this.buildingNames = saveData.buildingNames;
                this.buildingCostMultiplier = saveData.buildingCostMultiplier;

                // parse buildings/upgrades/achievements (cast numbers to big.js)
                this.buildings = [];
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

                        description: saveUpgrade.description,
                        unlocked: saveUpgrade.unlocked,
                        active: saveUpgrade.active
                    };
                    if (saveUpgrade.addition != null) {
                        upgrade.addition = saveUpgrade.addition;
                    }
                    if (saveUpgrade.multiplier != null) {
                        upgrade.multiplier = saveUpgrade.multiplier;
                    }

                    vm.upgrades.push(upgrade);
                });

                this.achievements = [];
                saveData.achievements.forEach(function (saveAchievement) {
                    let achievement = {
                        type: saveAchievement.type,
                        name: saveAchievement.name,
                        unlocked: saveAchievement.unlocked,
                        icon: saveAchievement.icon,
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

                    vm.achievements.push(achievement);
                });

                // calculate bonus currency
                let timeDifference = this.unixTimestamp() - saveData.timestamp;
                this.bonusCurrency = this.cps.div(2).times(timeDifference).round();

                // show dialog if earned over 5% saved currency
                if (this.bonusCurrency.gt(0) && this.bonusCurrency.gte(Big(saveData.currency).div(20))) {
                    this.bonusDialog = true;
                }

                // loop in currency
                let startingCurrency = Big(saveData.currency).plus(this.bonusCurrency);
                if (startingCurrency.gt(0)) {
                    this.loopCurrency(startingCurrency, 500);
                }

                console.log("Game Loaded");
            },
            loadSounds() {
                this.clickSound = new Audio('/static/' + this.clickSound);
                this.goldenSpawnSound = new Audio('/static/' + this.goldenSpawnSound);
                this.goldenClickSound = new Audio('/static/' + this.goldenClickSound);
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

                this.goldenSpawnSound.play();
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
                    let bonus1 = this.cps.times(900);
                    let bonus2 = this.currency.times(0.15);
                    this.luckyAmount = bonus1;
                    if (bonus1.gt(bonus2)) {
                        this.luckyAmount = bonus2;
                    }
                    this.luckyAmount = this.luckyAmount.plus(13)
                    this.luckyActive = true;
                    this.luckyEnd = this.unixTimestamp() + this.luckyLength;
                    this.loopCurrency(this.luckyAmount, 500);
                }

                this.goldenClickSound.play();

                this.recalculateCps();
                this.recalculateClickPower();

                this.goldenActive = false;
                this.initGolden();
            },

            // randomize array
            shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            },

            // particles/canvas effects
            setupParticles() {
                let vm = this;

                let particleImage = new Image();
                particleImage.src = '/static/cracker-small.png';

                class CurrencyParticle {
                    constructor(x, y) {
                        this.init(x, y);
                    };
                    init(x = 0.0, y = 0.0) {
                        this.alive = true;
                        this.life = 1;

                        this.x = x;
                        this.y = y;

                        this.wander = random(0.5, 2.0);
                        this.drag = random(0.9, 0.99);

                        this.vx = random(-5, 5);
                        this.vy = random(-5, -2);
                    };
                    move() {
                        if (this.alive) {
                            this.x += this.vx;
                            this.y += this.vy;

                            this.vx *= this.drag;
                            this.vy += 0.5;

                            this.life *= 0.98;
                            this.alive = this.life > 0.05;
                        }
                    };
                    draw(ctx) {
                        if (this.alive) {
                            ctx.drawImage(particleImage, this.x, this.y, 40, 40);
                        }
                    };
                }

                class NumberParticle {
                    constructor(x, y) {
                        this.init(x, y);
                    };
                    init(x = 0.0, y = 0.0, clickPower = 1) {
                        this.alive = true;
                        this.life = 1;

                        this.x = x + random(-10.0, 10.0);
                        this.y = y;

                        this.clickPower = clickPower;
                    };
                    move() {
                        if (this.alive) {
                            this.y -= 0.75;
                            this.life -= 0.015;
                            this.alive = this.life > 0.05;
                        }
                    };
                    draw(ctx) {
                        if (this.alive) {
                            ctx.font = "bold 22px Helvetica Neue";
                            ctx.fillStyle = "rgba(0, 0, 0, " + this.life + ")";
                            ctx.fillText("+" + this.clickPower, this.x, this.y);
                        }
                    };
                }

                let currencyParticles = [];
                let currencyPool = [];
                let numberParticles = [];
                let numberPool = [];
                let maxParticles = 33;

                Sketch.create({
                    container: document.getElementById('currency'),
                    fullscreen: false,
                    width: 350,
                    height: 350,
                    click() {
                        this.spawnCurrencyParticle(this.mouse.x, this.mouse.y);
                        this.spawnNumberParticle(this.mouse.x, this.mouse.y);
                    },

                    spawnCurrencyParticle(x, y) {
                        if (currencyParticles.length >= maxParticles) {
                            currencyPool.push(currencyParticles.shift());
                        }

                        let particle = new CurrencyParticle();
                        particle.init(x, y);
                        currencyParticles.push(particle);
                    },

                    spawnNumberParticle(x, y) {
                        if (numberParticles.length >= maxParticles) {
                            numberPool.push(numberParticles.shift());
                        }

                        let particle = new NumberParticle();
                        let clickPower = vm.$options.filters.round(vm.clickPower);
                        particle.init(x, y, clickPower);
                        numberParticles.push(particle);
                    },

                    update() {
                        let i, particle;
                        for (i = currencyParticles.length - 1; i >= 0; i--) {
                            currencyParticles[i].move();
                        }
                        for (i = numberParticles.length - 1; i >= 0; i--) {
                            numberParticles[i].move();
                        }
                    },

                    draw() {
                        for (let i = currencyParticles.length - 1; i >= 0; i--) {
                            currencyParticles[i].draw(this);
                        }
                        for (let i = numberParticles.length - 1; i >= 0; i--) {
                            numberParticles[i].draw(this);
                        }
                    }
                });
            },
        },
        filters: {
            round(value) {
                if (isNaN(value)) {
                    return 0;
                }
                if (value < 10) {
                    // TODO maybe bump this up
                    return Number((value).toFixed(1));
                } else if (value <= 999999) {
                    return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    // display pretty formatted number
                    let displayedValue = new Big(value);
                    let suffixes = ["", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
                    let index = Math.floor((displayedValue.e) / 3);
                    if (index >= suffixes.length) {
                        // outside of range
                        return value.toExponential(3);
                    }
                    let suffix = suffixes[Math.floor((displayedValue.e) / 3)];
                    let sigFig = (displayedValue.e % 3);
                    displayedValue.e = 3 + sigFig;
                    return displayedValue.div(1000).toPrecision(4 + sigFig) + ' ' + suffix;
                }
            },
            currency(value) {
                if (isNaN(value)) {
                    return 0;
                }
                if (value <= 999999) {
                    return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    // display pretty formatted number
                    let displayedValue = new Big(value);
                    let suffixes = ["", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
                    let index = Math.floor((displayedValue.e) / 3);
                    if (index >= suffixes.length) {
                        // outside of range
                        return value.toExponential(3);
                    }
                    let suffix = suffixes[Math.floor((displayedValue.e) / 3)];
                    let sigFig = (displayedValue.e % 3);
                    displayedValue.e = 3 + sigFig;
                    return displayedValue.div(1000).toPrecision(4 + sigFig) + ' ' + suffix;
                }
            }
        },
        mounted() {
            if (!this.debug && localStorage.getItem("SaveGame") != null) {
                this.loadGame(localStorage.getItem("SaveGame"));
            } else {
                this.newGame();
            }

            // check for debug mode
            if (this.debug) {
                this.currency = Big(1E21);
                //this.clickPower = Big(100);
                //this.goldenMinimumTime = 3;
                //this.goldenMaximumTime = 5;
            }

            // load audio
            this.loadSounds();

            // check achievements every couple seconds
            setInterval(function () {
                this.checkAchievements();
            }.bind(this), 2000);

            // auto save every 30 seconds
            setInterval(function () {
                this.saveGame();
            }.bind(this), 30000);

            // init next golden cracker
            this.initGolden();

            // start update loop (dynamic fps)
            window.requestAnimationFrame(this.tick);

            // start particle effects
            this.setupParticles();
        }
    }

</script>

<style>
    .left-panel {
        margin-right: 20px;
    }

    .totals,
    .currency,
    .buildings,
    .upgrades,
    .achievements,
    .game-utils {
        margin-top: 30px;
        flex-direction: column;
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

    .redacted {
        /* "spoiler" effect */
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

    [data-tooltip]:before {
        font-size: 12px;
        height: 60px;
    }

    canvas {
        align-self: center;
    }
</style>