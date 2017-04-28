<template>
    <div class="row">
        <div class="col-md-3">
            <div class="row totals">
                <span class="total-crackers"><h1>{{ crackers | crackers }} crackers</h1></span>
                <span class="crackers-per-second"><h2>Per second: {{ cps | round }}</h2></span>
                <span class="crackers-per-click"><h3>Per click: {{ clickPower | crackers }}</h3></span>
            </div>

            <div class="row cracker">
                <img src="/images/cracker.png" v-on:click="crackerClick" />
            </div>
        </div>

        <div class="col-md-6">
            <div class="row buildings">
                <h3>Buildings</h3>

                <div class="row buy-sell-buttons">
                    <div class="col-xs-12">
                        <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 1 }" @click="setBuyAmount(1)">Buy 1</button>
                        <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 10 }" @click="setBuyAmount(10)">Buy 10</button>
                        <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 100 }" @click="setBuyAmount(100)">Buy 100</button>
                    </div>
                </div>

                <div class="row building" v-for="building in buildings" v-if="building.owned > 0 || showBuilding(building)">
                    <div class="col-xs-3">

                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="buildingText(building)"></span></span>
                        <span v-bind:class="{ redacted:building.unlocked == false }">{{ building.name }}</span>
                        <br /> ({{ building.owned }} owned)
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-default" @click="buyBuilding(building)" :disabled="!canBuyBuilding(building)">Buy ({{ building.buyCost | crackers }})</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="row upgrades" v-if="showUpgrades">
                <h3>Upgrades</h3>

                <div class="row upgrade" v-for="upgrade in sortedUpgrades" v-if="!upgrade.active && canBuyUpgrade(upgrade)">
                    <div class="col-xs-12">
                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="upgradeText(upgrade)"></span></span>
                        <span class="upgrade-link" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost | crackers }})</span>
                    </div>
                </div>
            </div>

            <div class="row achievements" v-if="showAchievements">
                <h3>Achievements</h3>
                <div class="col-xs-12">
                    <div class="row achievement" v-for="achievement in achievements" v-if="achievement.unlocked">
                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="achievementText(achievement)"></span></span>
                        {{ achievement.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import GameData from './gameData.js';
    import Big from 'big.js';

    export default {
        data: function () {
            return {
                crackers: Big(100),
                totalCrackers: Big(0),
                clicks: Big(0),
                cps: Big(0),
                clickPower: Big(1),
                buyAmount: 1,
                showUpgrades: false,
                showAchievements: false,
                achievementCount: 0,

                buildingNames: [],
                buildings: [],

                upgrades: [
                    // production
                    { type: 'Cracker', name: 'Store Brand Crackers', needed: Big(50000), cost: Big(999999), multiplier: 1.01, description: 'Meh', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Fancy Store Crackers', needed: Big(250000), cost: Big(5E6), multiplier: 1.01, description: 'Ok I guess', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Rye Crackers', needed: Big(500000), cost: Big(10E6), multiplier: 1.01, description: 'Better than cardboard', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Sugared Crackers', needed: Big(2.5E6), cost: Big(50E6), multiplier: 1.01, description: 'Gross?', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Saltine Crackers', needed: Big(5E6), cost: Big(100E6), multiplier: 1.01, description: 'That seems reasonable', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(25E6), cost: Big(500E6), multiplier: 1.02, description: 'Need Description', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(50E6), cost: Big(1E9), multiplier: 1.02, description: 'Need Description', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(250E6), cost: Big(5E9), multiplier: 1.02, description: 'Need Description', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(500E6), cost: Big(10E9), multiplier: 1.02, description: 'Need Description', unlocked: false, active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(2.5E9), cost: Big(50E9), multiplier: 1.02, description: 'Need Description', unlocked: false, active: false },
                    // 4% etc
                ],

                _sortedUpgrades: null,

                achievements: [
                    // total crackers
                    { type: 'Cracker', name: 'Cracker', total: Big(1), unlocked: false },
                    { type: 'Cracker', name: 'Crackers', total: Big(1000), unlocked: false },

                    // cps
                    { type: 'Cracker', name: 'Casual baking', cps: Big(1), unlocked: false },
                    { type: 'Cracker', name: 'Hardcore baking', cps: Big(10), unlocked: false },

                    // clicking
                    { type: 'Cracker', name: 'Clicktastic', clicks: Big(10000), unlocked: false },
                    { type: 'Cracker', name: 'Clickathon', clicks: Big(100000), unlocked: false },
                ],
            }
        },

        computed: {
            sortedUpgrades: function () {
                if (this._sortedUpgrades == null) {
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
            // clicking/cps
            crackerClick: function () {
                this.clicks = this.clicks.plus(this.clickPower);
                this.crackers = this.crackers.plus(this.clickPower);
                this.totalCrackers = this.totalCrackers.plus(this.clickPower);
            },
            recalculateClickPower: function () {
                this.clickPower = this.upgradeMultiplier(this.buildingNames[0]).plus(this.upgradeAddition());
            },
            recalculateCps: function () {
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

                this.cps = cps;
            },

            // buildings
            showBuilding: function (building) {
                if (building.unlocked == false && this.totalCrackers.gte(building.baseCost)) {
                    building.unlocked = true;
                }
                return this.totalCrackers.gte(building.showAt);
            },
            canBuyBuilding: function (building) {
                return this.crackers.gte(this.buildingCost(building, this.buyAmount));
            },
            buyBuilding: function (building) {
                if (this.canBuyBuilding(building, this.buyAmount)) {
                    this.crackers = this.crackers.minus(this.buildingCost(building));
                    building.owned += this.buyAmount;
                    building.unlocked = true; // just in case

                    this.showUpgrades = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                    this.recalculateBuyCosts();
                    this.checkAchievements();
                }
            },
            buildingCost: function (building) {
                Big.RM = 3;
                return building.baseCost.times(Big(1.15).pow(building.owned + this.buyAmount).minus(Big(1.15).pow(building.owned))).div(0.15).round();
            },
            buildingCount: function (buildingName) {
                return this.buildings.find(function (building) {
                    return building.name == buildingName;
                }).owned;
            },
            otherBuildingCount: function (buildingName) {
                let buildingCount = 0;
                this.buildings.find(function (building) {
                    if (building.name != buildingName) {
                        buildingCount += building.owned;
                    }
                });
                return buildingCount;
            },
            ownedBuildings: function () {
                return this.buildings.filter(function (building) {
                    return building.owned > 0;
                });
            },
            buildingText: function (building) {
                if (building.unlocked == false) {
                    return null;
                }
                let buildingText = building.description;
                buildingText += "<br />Each " + building.name + " produces " + building.currentCps + " crackers per second";
                buildingText += "<br />" + building.owned + " " + building.name + " owned producing " + this.$options.filters.round(building.currentCps * building.owned) + " crackers per second";
                return buildingText;
            },
            setBuyAmount: function (amount) {
                this.buyAmount = amount;

                this.recalculateBuyCosts();
            },
            recalculateBuyCosts: function () {
                let vm = this;
                this.buildings.forEach(function (building) {
                    building.buyCost = vm.buildingCost(building);
                });
            },

            // upgrades
            canBuyUpgrade: function (upgrade) {
                if (upgrade.unlocked == true) {
                    return true;
                }
                if (upgrade.type == 'Cracker') {
                    if (this.crackers.gte(upgrade.needed)) {
                        upgrade.unlocked = true;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (this.buildingCount(upgrade.type) >= upgrade.needed) {
                        upgrade.unlocked = true;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            buyUpgrade: function (upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.crackers.gte(upgrade.cost)) {
                    this.crackers = this.crackers.minus(upgrade.cost);
                    upgrade.active = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                    this.checkAchievements();
                }
            },
            activeUpgrades: function (buildingType) {
                return this.upgrades.filter(function (upgrade) {
                    return upgrade.active && upgrade.type == buildingType;
                });
            },
            upgradeMultiplier: function (buildingType) {
                let multiplier = Big(1);
                this.activeUpgrades(buildingType).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        multiplier = multiplier.times(upgrade.multiplier);
                    }
                });
                return multiplier;
            },
            upgradeAddition: function () {
                let addition = Big(0);
                this.activeUpgrades(this.buildingNames[0]).forEach(function (upgrade) {
                    if (upgrade.addition != null) {
                        addition = addition.plus(upgrade.addition);
                    }
                });
                return addition * this.otherBuildingCount(this.buildingNames[0]);
            },
            upgradeProduction: function () {
                let production = 1;
                this.activeUpgrades('Cracker').forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        production *= upgrade.multiplier;
                    }
                });
                return production;
            },
            upgradeText: function (upgrade) {
                let upgradeText = upgrade.description;
                if (upgrade.multiplier != null) {
                    upgradeText += '<br/>Multiplies ' + upgrade.type + ' production by ' + upgrade.multiplier + 'x';
                } else if (upgrade.addition != null) {
                    upgradeText += '<br/>Adds ' + upgrade.addition + ' cracker production for every non-' + upgrade.type + ' building owned';
                }
                return upgradeText;
            },

            // achievements
            checkAchievements: function () {
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
                    } else if (achievement.type == 'Cracker') {
                        if (vm.totalCrackers.gte(achievement.total)) {
                            vm.unlockAchievement(achievement);
                        }
                    } else {
                        if (vm.buildingCount(achievement.type) >= achievement.total) {
                            vm.unlockAchievement(achievement);
                        }
                    }
                });
            },
            lockedAchievements: function () {
                return this.achievements.filter(function (achievement) {
                    return achievement.unlocked == false;
                });
            },
            unlockAchievement: function (achievement) {
                achievement.unlocked = true;
                this.achievementCount++;
                this.showAchievements = true;
            },
            achievementText: function (achievement) {
                if (achievement.cps != null) {
                    return 'Reached a total of ' + achievement.cps + ' cps';
                } else if (achievement.clicks != null) {
                    return 'Generated a total of ' + achievement.clicks + ' crackers using clicks';
                } else if (achievement.type == 'Cracker') {
                    return 'Generated a total of ' + achievement.total + ' crackers';
                } else {
                    return 'Built a total of ' + achievement.total + ' ' + achievement.type;
                }
            },

            // tick function
            tick: function () {
                this.crackers = this.crackers.plus(this.cps.div(10));
                this.totalCrackers = this.totalCrackers.plus(this.cps.div(10));
            },

            // misc/setup
            generateBuildings: function () {
                let buildingNames = this.shuffleArray(GameData.buildingNames);
                for (let i = 0; i < GameData.buildings.length; i++) {
                    let buildingName = buildingNames.pop();
                    let building = GameData.buildings[i];
                    building.name = buildingName;
                    this.buildings.push(building);
                    this.buildingNames.push(buildingName);
                }
            },
            generateUpgrades: function () {
                let vm = this;
                GameData.buildingUpgrades.forEach(function (upgrade) {
                    let buildingIndex = upgrade.type;
                    upgrade.type = vm.buildingNames[buildingIndex];
                    vm.upgrades.push(upgrade);
                });
            },
            generateAchievements: function () {
                let vm = this;
                GameData.buildingAchivements.forEach(function (achievement) {
                    let buildingIndex = achievement.type;
                    achievement.type = vm.buildingNames[buildingIndex];
                    vm.achievements.push(achievement);
                });
            },
            shuffleArray: function (array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }
        },
        filters: {
            round: function (value) {
                if (value < 10) {
                    return Number((value).toFixed(1));
                } else if (value <= 9999999999) {
                    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return value.toExponential(3);
                }
            },
            crackers: function (value) {
                if (value <= 9999999999) {
                    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                    return value.toExponential(3);
                }
            }
        },
        mounted: function () {
            this.generateBuildings();
            this.generateUpgrades();
            this.generateAchievements();

            setInterval(function () {
                this.tick();
            }.bind(this), 100);

            setInterval(function () {
                this.checkAchievements();
            }.bind(this), 2000);
        }
    }

</script>

<style>
    #game {
        padding: 50px;
    }
    
    .totals,
    .cracker {
        text-align: center;
    }
    
    .buy-sell-buttons {
        margin-bottom: 20px;
    }
    
    .upgrade-link {
        text-decoration: underline;
    }
    
    .buildings,
    .upgrades,
    .achievements {
        margin-top: 50px;
    }
    
    .building {
        margin-bottom: 10px;
    }
    
    .upgrade {
        margin-bottom: 5px;
    }
    
    .tooltips {
        position: relative;
        display: inline;
    }
    
    .tooltips span {
        position: absolute;
        width: 300px;
        color: #FFFFFF;
        background: #000000;
        line-height: 24px;
        text-align: center;
        visibility: hidden;
        border-radius: 6px;
        font-family: "Helvetica Neue, Helvetica, Arial, sans-serif";
        font-weight: bold;
        padding-right: 5px;
        padding-left: 5px;
    }
    
    .tooltips span:after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -8px;
        width: 0;
        height: 0;
        border-top: 8px solid #000000;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
    }
    
     :hover.tooltips span {
        visibility: visible;
        opacity: 0.8;
        bottom: 30px;
        left: 50%;
        margin-left: -76px;
        z-index: 999;
    }
    
    .redacted {
        color: black;
        background-color: black;
        white-space: nowrap;
        -moz-transform: rotate(.8deg) skewx(-12deg);
        -moz-box-shadow: 3px 0 2px #444;
        border: 1px dotted #555;
        background: -moz-linear-gradient(180deg, #000, #222);
    }
</style>