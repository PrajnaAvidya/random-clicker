<template>
    <div class="game container">
        <div class="row">
            <div class="col-md-4">
                <div class="row totals">
                    <div class="total-currency">
                        <h1>{{ currency | currency }} {{ currencyName}}s</h1>
                    </div>
                    <div class="currency-per-second">
                        <h2>Per second: {{ cps | round }}</h2>
                    </div>
                    <div class="currency-per-click">
                        <h3>Per click: {{ clickPower | currency }}</h3>
                    </div>
                </div>

                <div class="row currency" id="currency" v-on:click="click"></div>
            </div>

            <div class="col-md-5">
                <div class="row buildings">
                    <div class="row">
                        <h3>Buildings</h3>
                    </div>

                    <div class="row buy-sell-buttons">
                        <div class="col-xs-12">
                            <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 1 }" @click="setBuyAmount(1)">Buy 1</button>
                            <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 10 }" @click="setBuyAmount(10)">Buy 10</button>
                            <button class="btn btn-default" v-bind:class="{ active:this.buyAmount == 100 }" @click="setBuyAmount(100)">Buy 100</button>
                        </div>
                    </div>

                    <div class="row building" v-for="building in buildings" v-if="building.owned > 0 || showBuilding(building)">
                        <div class="col-xs-5">
                            <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="buildingText(building)"></span></span>
                            <span v-bind:class="{ redacted:building.unlocked == false }">{{ building.name }}</span>
                            <br /> ({{ building.owned }} owned)
                        </div>
                        <div class="col-xs-2">
                            <button class="btn btn-default" @click="buyBuilding(building)" :disabled="!canBuyBuilding(building)">Buy ({{ building.buyCost | currency }})</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="row upgrades" v-if="showUpgrades">
                    <h3>Upgrades</h3>

                    <div class="row upgrade" v-for="upgrade in sortedUpgrades" v-if="!upgrade.active && (canBuyUpgrade(upgrade) || canSeeUpgrade(upgrade))">
                        <div class="col-xs-12">
                            <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="upgradeText(upgrade)"></span></span>
                            <span class="upgrade-link" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost | currency }})</span>
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

        <div class="row menu">
            <div class="col-md-3 col-md-offset-9">
                <button class="btn btn-default" @click="saveGame()">Save Game</button>
                <button class="btn btn-danger" @click="hardReset()">Hard Reset</button>
            </div>
        </div>
    </div>
</template>

<script>
    import GameData from "./gameData.js";
    import Big from "big.js";
    import Sketch from "sketch-js";

    export default {
        data: function () {
            return this.defaultData();
        },

        computed: {
            sortedUpgrades: function () {
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
            // default data
            defaultData: function () {
                return {
                    // disable for debug
                    enableLoad: true,

                    // for fps calculations
                    lastFrame: 0,

                    currencyName: null,
                    currency: Big(0),
                    totalCurrency: Big(0),
                    currencySuffix: '',
                    clicks: Big(0),
                    cps: Big(0),
                    clickPower: Big(1),
                    buyAmount: 1,
                    showUpgrades: false,
                    showAchievements: false,
                    achievementCount: 0,

                    buildingCostMultiplier: 0.15,
                    buildingNames: [],
                    buildings: [],

                    upgrades: [],
                    _sortedUpgrades: null,

                    adjectives: [],

                    achievements: [],
                }
            },

            // clicking/cps
            click: function () {
                let vm = this;
                let loopAmount = Big(10);
                if (this.clickPower < 10) {
                    loopAmount = Big(this.clickPower);
                }
                let clickAmount = this.clickPower.div(loopAmount);
                for (let i = 0; i < loopAmount; i++) {
                    setTimeout(function timer() {
                        vm.clicks = vm.clicks.plus(clickAmount);
                        vm.currency = vm.currency.plus(clickAmount);
                        vm.totalCurrency = vm.totalCurrency.plus(clickAmount);
                    }, i * 333 / loopAmount);
                }
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
                if (building.unlocked == false && this.totalCurrency.gte(building.baseCost)) {
                    building.unlocked = true;
                }
                return this.totalCurrency.gte(building.showAt);
            },
            canBuyBuilding: function (building) {
                return this.currency.gte(this.buildingCost(building, this.buyAmount));
            },
            buyBuilding: function (building) {
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
            buildingCost: function (building) {
                Big.RM = 3;
                return building.baseCost.times(Big(1 + this.buildingCostMultiplier).pow(building.owned + this.buyAmount).minus(Big(1 + this.buildingCostMultiplier).pow(building.owned))).div(this.buildingCostMultiplier).round();
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
                let buildingCps = building.currentCps * building.owned;
                let buildingCpsPercent = 100 * buildingCps / this.cps;
                //let buildingText = building.description;
                let buildingText = "Each " + building.name + " produces " + building.currentCps + " " + this.currencyName + "s per second";
                buildingText += "<br />" + building.owned + " " + building.name + " owned producing " + this.$options.filters.round(buildingCps) + " " + this.currencyName + "s per second (" + this.$options.filters.round(buildingCpsPercent) + "% of total)";
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

                if (upgrade.type == this.currencyName) {
                    if (this.currency.gte(upgrade.needed)) {
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
            canSeeUpgrade: function (upgrade) {
                if (upgrade.unlocked == true) {
                    return true;
                }

                if (upgrade.type != this.currencyName && this.buildingCount(upgrade.type) == 0) {
                    return false;
                }
                if (upgrade.type == this.currencyName) {
                    if (this.currency.gte(upgrade.needed / 10)) {
                        upgrade.unlocked = true;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (upgrade.cost == this.nextUpgrade(upgrade.type).cost) {
                        upgrade.unlocked = true;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            buyUpgrade: function (upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.currency.gte(upgrade.cost)) {
                    this.currency = this.currency.minus(upgrade.cost);
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
            nextUpgrade: function (buildingType) {
                let vm = this;
                return this.upgrades.find(function (upgrade) {
                    return !upgrade.active && upgrade.type == buildingType && upgrade.needed > vm.buildingCount(buildingType);
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
                this.activeUpgrades(this.currencyName).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        production *= upgrade.multiplier;
                    }
                });
                return production;
            },
            upgradeText: function (upgrade) {
                let upgradeText = '';// upgrade.description;
                if (upgrade.multiplier != null) {
                    upgradeText += "Multiplies " + upgrade.type + " production by " + upgrade.multiplier + "x";
                    if (upgrade.type == this.buildingNames[0]) {
                        upgradeText += "<br/>Also multiplies clicks";
                    }
                } else if (upgrade.addition != null) {
                    upgradeText += "Adds " + upgrade.addition + " " + this.currencyName + " production for every non-" + upgrade.type + " building owned";
                    if (upgrade.type == this.buildingNames[0]) {
                        upgradeText += "<br/>Also adds to clicks";
                    }
                }
                if (upgrade.type != this.currencyName && this.buildingCount(upgrade.type) < upgrade.needed) {
                    upgradeText += "Requires " + upgrade.needed + " " + upgrade.type;
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
            tick: function (timestamp) {
                let progress = timestamp - this.lastFrame;
                this.lastFrame = timestamp;

                let division = 1000 / progress;
                this.currency = this.currency.plus(this.cps.div(division));
                this.totalCurrency = this.totalCurrency.plus(this.cps.div(division))

                window.requestAnimationFrame(this.tick);
            },

            // generate stuff
            generateBuildings: function () {
                let buildingNames = this.shuffleArray(GameData.buildingNames);
                for (let i = 0; i < GameData.buildings.length; i++) {
                    let buildingName = buildingNames.pop();
                    let building = GameData.buildings[i];
                    building.buyCost = Big(building.baseCost);
                    building.currentCps = Big(building.baseCps);
                    building.unlocked = false;
                    building.name = buildingName;
                    building.owned = 0;
                    if (i >= 2) {
                        building.showAt = Big(GameData.buildings[(i - 2)].buyCost);
                    } else {
                        building.showAt = Big(0);
                    }

                    this.buildings.push(building);
                    this.buildingNames.push(buildingName);
                }
            },
            generateUpgrades: function () {
                let vm = this;
                GameData.productionUpgrades.forEach(function (productionUpgrade) {
                    let upgrade = {
                        type: vm.currencyName,
                        name: vm.adjectives.pop() + " " + vm.currencyName + "s",
                        needed: Big(productionUpgrade.needed),
                        cost: Big(productionUpgrade.cost),
                        multiplier: productionUpgrade.multiplier,
                        description: "Need Description",
                        unlocked: false, active: false
                    };

                    vm.upgrades.push(upgrade)
                });

                GameData.buildingUpgradeCosts.forEach(function (upgradeParams) {
                    let upgradeIndex = upgradeParams.type;
                    upgradeParams.type = vm.buildingNames[upgradeIndex];

                    let upgradeCosts = upgradeParams.costs;

                    let upgradeNeeds = GameData.buildingUpgradeNeeds[1];
                    let upgradeAmounts = GameData.buildingUpgradeAmounts[1];
                    if (upgradeIndex == 0) {
                        upgradeNeeds = GameData.buildingUpgradeNeeds[0];
                        upgradeAmounts = GameData.buildingUpgradeAmounts[0];
                    }

                    for (let i = 0; i < upgradeNeeds.length; i++) {
                        let upgrade = {
                            type: upgradeParams.type,
                            name: vm.adjectives.pop() + " " + upgradeParams.type + "s",
                            needed: upgradeNeeds[i],
                            cost: Big(upgradeCosts[i]),
                            description: "Need Description",
                            unlocked: false,
                            active: false,
                        };

                        // parse amount
                        if (upgradeAmounts[i].substr(0, 1) == "m") {
                            upgrade.multiplier = parseInt(upgradeAmounts[i].substr(1));
                        } else if (upgradeAmounts[i].substr(0, 1) == "a") {
                            upgrade.addition = parseFloat(upgradeAmounts[i].substr(1));
                        }

                        vm.upgrades.push(upgrade)
                    }
                });
            },
            generateAchievements: function () {
                let vm = this;

                GameData.productionAchievements.forEach(function (productionAchievement) {
                    let achievement = {
                        type: vm.currencyName,
                        name: vm.adjectives.pop() + " " + vm.currencyName + "s",
                        unlocked: false,
                    };

                    if (productionAchievement.total != null) {
                        achievement.total = Big(productionAchievement.total);
                    } else if (productionAchievement.cps != null) {
                        achievement.cps = Big(productionAchievement.cps);
                    } else if (productionAchievement.clicks != null) {
                        achievement.clicks = Big(productionAchievement.clicks);
                    }

                    vm.achievements.push(achievement);
                });

                GameData.buildingAchivements.forEach(function (buildingAchivement) {
                    let upgradeIndex = buildingAchivement.type;

                    let achievement = {
                        type: vm.buildingNames[upgradeIndex],
                        name: vm.adjectives.pop() + " " + vm.buildingNames[upgradeIndex],
                        total: Big(buildingAchivement.total),
                        unlocked: false,
                    };

                    vm.achievements.push(achievement);
                });
            },

            // setup/save
            newGame: function () {
                // get currency name & adjectives
                this.currencyName = this.shuffleArray(GameData.currencies).pop();
                document.title = this.currencyName + ' Clicker';
                this.adjectives = this.shuffleArray(GameData.adjectives);

                // generate stuff
                this.generateBuildings();
                this.generateUpgrades();
                this.generateAchievements();

                // save fresh game
                this.saveGame();
            },
            hardReset: function () {
                if (confirm("Are you sure?")) {
                    Object.assign(this.$data, this.defaultData())
                    this.newGame();
                }
            },
            saveGame: function () {
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
                };

                localStorage.setItem("SaveGame", JSON.stringify(saveData));
            },
            loadGame: function (saveJson) {
                let saveData = JSON.parse(saveJson);
                let vm = this;

                this.currencyName = saveData.currencyName;
                document.title = this.currencyName + ' Clicker';
                this.currency = Big(saveData.currency);
                this.totalCurrency = Big(saveData.totalCurrency);
                this.clicks = Big(saveData.clicks);
                this.cps = Big(saveData.cps);
                this.clickPower = Big(saveData.clickPower);
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
                        owned: saveBuilding.owned
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
                        unlocked: saveAchievement.unlocked
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
            },

            // randomize array
            shuffleArray: function (array) {
                for (let i = array.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    let temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            },

            // particles/canvas effects
            setupParticles: function () {
                let vm = this;

                let particleImage = new Image();
                particleImage.src = '/static/cracker.png';

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
                let maxParticles = 50;

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
            round: function (value) {
                if (isNaN(value)) {
                    return 0;
                }
                if (value < 10) {
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
            currency: function (value) {
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
        mounted: function () {
            if (this.enableLoad && localStorage.getItem("SaveGame") != null) {
                this.loadGame(localStorage.getItem("SaveGame"));
            } else {
                this.newGame();
            }

            // check achievements every couple seconds
            setInterval(function () {
                this.checkAchievements();
            }.bind(this), 2000);

            // auto save every 30 seconds
            setInterval(function () {
                this.saveGame();
            }.bind(this), 30000);

            // start tick loop (dynamic fps)
            window.requestAnimationFrame(this.tick);

            // start particle effects
            this.setupParticles();
        }
    }

</script>

<style>
    #game {
        padding: 50px;
    }
    
    .totals,
    .currency {
        text-align: center;
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
    
    .menu {
        margin-top: 50px;
    }
    /* "spoiler" effect */
    
    .redacted {
        color: black;
        background-color: black;
        white-space: nowrap;
        -moz-transform: rotate(.8deg) skewx(-12deg);
        -moz-box-shadow: 3px 0 2px #444;
        border: 1px dotted #555;
        background: -moz-linear-gradient(180deg, #000, #222);
    }
    /* tooltips */
    
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
        content: "";
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
</style>