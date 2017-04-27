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

                <div class="row building" v-for="building in buildings" v-if="building.owned > 0 || showBuilding(building)">
                    <div class="col-xs-3">

                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="buildingText(building)"></span></span>
                        {{ building.name }}<br />({{ building.owned }} owned)
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-default" @click="buyBuilding(building)" :disabled="!canBuyBuilding(building)">Buy 1 ({{ buildingCost(building) | crackers }})</button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-default" @click="buyBuilding(building, 10)" :disabled="!canBuyBuilding(building, 10)">Buy 10 ({{ buildingCost(building, 10) | crackers }})</button>
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-default" @click="buyBuilding(building, 100)" :disabled="!canBuyBuilding(building, 100)">Buy 100 ({{ buildingCost(building, 100) | crackers }})</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="row upgrades">
                <h3>Upgrades</h3>

                <div class="row upgrade" v-for="upgrade in orderBy(upgrades, 'cost')" v-if="!upgrade.active && canBuyUpgrade(upgrade)">
                    <div class="col-xs-12">
                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span v-html="upgradeText(upgrade)"></span></span>
                        <span class="upgrade-link" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost | crackers }})</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Big from 'big.js';

    export default {
        data: function () {
            return {
                crackers: Big(1E21),
                totalCrackers: Big(0),
                clicks: Big(0),
                cps: Big(0),
                clickPower: Big(1),

                buildings: [
                    { name: 'Finger', baseCost: Big(15), baseCps: Big(0.1), currentCps: Big(0.1), description: "Growing extra fingers will allow you to click more often. Autoclicks once every 10 seconds.", showAt: 0, owned: 0 },
                    { name: 'Toddler', baseCost: Big(100), baseCps: Big(1), currentCps: Big(1), description: "These toddlers will eat crackers if you tell them they're cookies.", showAt: Big(0), owned: 0 },
                    { name: 'Kosher Bakery', baseCost: Big(1100), baseCps: Big(8), currentCps: Big(8), description: "These guys seem to know what they're doing.", showAt: Big(15), owned: 0 },
                    { name: 'Non-Kosher Bakery', baseCost: Big(12000), baseCps: Big(47), currentCps: Big(47), description: "These guys don't follow the rules!", showAt: Big(100), owned: 0 },
                    { name: 'Tea Club', baseCost: Big(130000), baseCps: Big(260), currentCps: Big(260), description: "These ladies LOVE crackers with their tea", showAt: Big(1100), owned: 0 },
                    { name: 'Cracker Factory', baseCost: Big(1.4E6), baseCps: Big(1400), currentCps: Big(1400), description: "Seems only logical", showAt: Big(12000), owned: 0 },
                    { name: 'Cracker Warehouse', baseCost: Big(20E6), baseCps: Big(7800), currentCps: Big(7800), description: "We need more space to store all these crackers!", showAt: Big(130000), owned: 0 },
                    { name: 'Food Lab', baseCost: Big(330E6), baseCps: Big(44000), currentCps: Big(44000), description: "Genetically engineered crackers?", showAt: Big(1.4E6), owned: 0 },
                ],

                upgrades: [
                    // production
                    { type: 'Cracker', name: 'Store Brand Crackers', needed: Big(50000), cost: Big(999999), multiplier: 1.01, description: 'Meh', active: false },
                    { type: 'Cracker', name: 'Fancy Store Crackers', needed: Big(250000), cost: Big(5E6), multiplier: 1.01, description: 'Ok I guess', active: false },
                    { type: 'Cracker', name: 'Rye Crackers', needed: Big(500000), cost: Big(10E6), multiplier: 1.01, description: 'Better than cardboard', active: false },
                    { type: 'Cracker', name: 'Sugared Crackers', needed: Big(2.5E6), cost: Big(50E6), multiplier: 1.01, description: 'Gross?', active: false },
                    { type: 'Cracker', name: 'Saltine Crackers', needed: Big(5E6), cost: Big(100E6), multiplier: 1.01, description: 'That seems reasonable', active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(25E6), cost: Big(500E6), multiplier: 1.02, description: 'Need Description', active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(50E6), cost: Big(1E9), multiplier: 1.02, description: 'Need Description', active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(250E6), cost: Big(5E9), multiplier: 1.02, description: 'Need Description', active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(500E6), cost: Big(10E9), multiplier: 1.02, description: 'Need Description', active: false },
                    { type: 'Cracker', name: 'Need Name', needed: Big(2.5E9), cost: Big(50E9), multiplier: 1.02, description: 'Need Description', active: false },
                    // 4% etc

                    // finger (cursor)
                    { type: 'Finger', name: 'Double Tap', needed: 1, cost: Big(100), multiplier: 2, description: 'Tap faster', active: false },
                    { type: 'Finger', name: 'Quattro Tap', needed: 1, cost: Big(500), multiplier: 2, description: 'Tap faster!', active: false },
                    { type: 'Finger', name: 'Mega Tap', needed: 10, cost: Big(10000), multiplier: 2, description: 'Tap even faster!!', active: false },
                    { type: 'Finger', name: 'Middle Finger', needed: 20, cost: Big(100000), addition: 0.1, description: 'Put that thing away.', active: false },
                    { type: 'Finger', name: 'Double Middle Finger', needed: 40, cost: Big(10E6), addition: 0.5, description: 'Put those away.', active: false },
                    { type: 'Finger', name: 'Extra Middle Fingers', needed: 80, cost: Big(100E6), addition: 5, description: "Now that's just rude.", active: false },
                    { type: 'Finger', name: 'Super Finger', needed: 120, cost: Big(1E9), addition: 50, description: "No decorum at all.", active: false },
                    { type: 'Finger', name: 'Super Duper Finger', needed: 160, cost: Big(10E9), addition: 500, description: "Need Description", active: false },
                    { type: 'Finger', name: 'Mega Finger', needed: 200, cost: Big(10E12), addition: 5000, description: "Need Description", active: false },
                    { type: 'Finger', name: 'Turbo Finger', needed: 240, cost: Big(100E12), addition: 50000, description: "Need Description", active: false },
                    { type: 'Finger', name: 'Ultra Finger', needed: 280, cost: Big(1E12), addition: 500000, description: "Need Description", active: false },
                    { type: 'Finger', name: 'Ultimate Finger', needed: 320, cost: Big(10E15), addition: 5000000, description: "Need Description", active: false },

                    // toddler (grandma)
                    { type: 'Toddler', name: 'Timeout', needed: 1, cost: Big(1000), multiplier: 2, description: 'These toddlers need to learn some discipline', active: false },
                    { type: 'Toddler', name: 'Daycare', needed: 5, cost: Big(5000), multiplier: 2, description: 'Finally, some me time!', active: false },
                    { type: 'Toddler', name: 'Play Date', needed: 25, cost: Big(50000), multiplier: 2, description: 'An active social life is good for productivity', active: false },
                    { type: 'Toddler', name: 'ADHD Meds', needed: 50, cost: Big(5E6), multiplier: 2, description: "That's better...", active: false },
                    { type: 'Toddler', name: 'Jack', needed: 100, cost: Big(500E6), multiplier: 2, description: "Like that movie?", active: false },
                    { type: 'Toddler', name: 'Jack & Jill', needed: 150, cost: Big(50E9), multiplier: 2, description: "The worst Adam Sandler movie", active: false },
                    { type: 'Toddler', name: 'Need Name', needed: 200, cost: Big(50E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Toddler', name: 'Need Name', needed: 250, cost: Big(50E15), multiplier: 2, description: "Need Description", active: false },

                    // kosher bakery (farm)
                    { type: 'Kosher Bakery', name: 'Torah', needed: 1, cost: Big(11000), multiplier: 2, description: 'Got to follow the rules', active: false },
                    { type: 'Kosher Bakery', name: 'Another Torah', needed: 5, cost: Big(55000), multiplier: 2, description: 'More to go around', active: false },
                    { type: 'Kosher Bakery', name: 'Rabbi', needed: 25, cost: Big(550000), multiplier: 2, description: "This rabbi doesn't come cheap", active: false },
                    { type: 'Kosher Bakery', name: 'Rabbi Council', needed: 50, cost: Big(55E6), multiplier: 2, description: "These rabbis don't come cheap", active: false },
                    { type: 'Kosher Bakery', name: 'Passover Bonus', needed: 100, cost: Big(5.5E9), multiplier: 2, description: "What does that even mean?", active: false },
                    { type: 'Kosher Bakery', name: 'Need Name', needed: 150, cost: Big(550E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Kosher Bakery', name: 'Need Name', needed: 200, cost: Big(550E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Kosher Bakery', name: 'Need Name', needed: 250, cost: Big(550E15), multiplier: 2, description: "Need Description", active: false },

                    // non-kosher bakery (mine)
                    { type: 'Non-Kosher Bakery', name: 'Knockoff Torah', needed: 1, cost: Big(120000), multiplier: 2, description: "This doesn't seem legit...", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Another Knockoff Torah', needed: 5, cost: Big(600000), multiplier: 2, description: "??", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Rabbi', needed: 25, cost: Big(6E6), multiplier: 2, description: "I don't think his beard is real", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Rabbi Council', needed: 50, cost: Big(600E6), multiplier: 2, description: "I have a bad feeling about this", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Passover Bonus', needed: 100, cost: Big(60E9), multiplier: 2, description: "What does that even mean?!", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Need Name', needed: 150, cost: Big(6E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Need Name', needed: 200, cost: Big(6E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Need Name', needed: 250, cost: Big(6E18), multiplier: 2, description: "Need Description", active: false },

                    // tea club (factory)
                    { type: 'Tea Club', name: 'Strumpets', needed: 1, cost: Big(1.3E6), multiplier: 2, description: "What are we, savages?", active: false },
                    { type: 'Tea Club', name: 'Valet', needed: 5, cost: Big(6.5E6), multiplier: 2, description: "I'm too rich to park my car", active: false },
                    { type: 'Tea Club', name: 'Servant', needed: 25, cost: Big(65E6), multiplier: 2, description: "It's not technically slavery!", active: false },
                    { type: 'Tea Club', name: 'Free trade tea', needed: 50, cost: Big(6.5E9), multiplier: 2, description: "I feel so much better about this", active: false },
                    { type: 'Tea Club', name: 'Slavery tea', needed: 100, cost: Big(650E9), multiplier: 2, description: "Suffering tastes better", active: false },
                    { type: 'Tea Club', name: 'Need Name', needed: 150, cost: Big(65E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Tea Club', name: 'Need Name', needed: 200, cost: Big(65E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Tea Club', name: 'Need Name', needed: 250, cost: Big(65E18), multiplier: 2, description: "Need Description", active: false },

                    // cracker factory (bank)
                    { type: 'Cracker Factory', name: 'Strumpets', needed: 1, cost: Big(14E6), multiplier: 2, description: "What are we, savages?", active: false },
                    { type: 'Cracker Factory', name: 'Valet', needed: 5, cost: Big(70E6), multiplier: 2, description: "I'm too rich to park my car", active: false },
                    { type: 'Cracker Factory', name: 'Servant', needed: 25, cost: Big(700E6), multiplier: 2, description: "It's not technically slavery!", active: false },
                    { type: 'Cracker Factory', name: 'Free trade tea', needed: 50, cost: Big(70E9), multiplier: 2, description: "I feel so much better about this", active: false },
                    { type: 'Cracker Factory', name: 'Slavery tea', needed: 100, cost: Big(7E12), multiplier: 2, description: "Suffering tastes better", active: false },
                    { type: 'Cracker Factory', name: 'Need Name', needed: 150, cost: Big(700E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Factory', name: 'Need Name', needed: 200, cost: Big(700E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Factory', name: 'Need Name', needed: 250, cost: Big(700E18), multiplier: 2, description: "Need Description", active: false },

                    // cracker warehouse (temple)
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 1, cost: Big(200E6), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 5, cost: Big(1E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 25, cost: Big(10E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 50, cost: Big(1E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 100, cost: Big(100E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 150, cost: Big(10E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 200, cost: Big(10E18), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Cracker Warehouse', name: 'Need Name', needed: 250, cost: Big(10E21), multiplier: 2, description: "Need Description", active: false },

                    // food lab (wizard tower)
                    { type: 'Food Lab', name: 'Need Name', needed: 1, cost: Big(3.3E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 5, cost: Big(16.5E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 25, cost: Big(165E9), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 50, cost: Big(16.5E12), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 100, cost: Big(1.65E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 150, cost: Big(165E15), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 200, cost: Big(165E18), multiplier: 2, description: "Need Description", active: false },
                    { type: 'Food Lab', name: 'Need Name', needed: 250, cost: Big(165E21), multiplier: 2, description: "Need Description", active: false },
                ],
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
                this.clickPower = this.upgradeMultiplier('Finger') + this.upgradeAddition();
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
                return this.totalCrackers.gte(building.showAt);
            },
            canBuyBuilding: function (building, amount = 1) {
                return this.crackers.gte(this.buildingCost(building, amount));
            },
            buyBuilding: function (building, amount = 1) {
                if (this.canBuyBuilding(building, amount)) {
                    this.crackers = this.crackers.minus(this.buildingCost(building, amount));
                    building.owned += amount;

                    this.recalculateCps();
                    this.recalculateClickPower();
                }
            },
            buildingCost: function (building, amount = 1) {
                Big.RM = 3;
                return building.baseCost.times(Big(1.15).pow(building.owned + amount).minus(Big(1.15).pow(building.owned))).div(0.15).round();
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
                let buildingText = building.description;
                buildingText += "<br />Each " + building.name + " produces " + building.currentCps + " crackers per second";
                buildingText += "<br />" + building.owned + " " + building.name + " owned producing " + (building.currentCps * building.owned) + " crackers per second";
                return buildingText;
            },

            // upgrades
            canBuyUpgrade: function (upgrade) {
                if (upgrade.type == 'Cracker') {
                    return this.crackers.gte(upgrade.needed);
                } else {
                    return this.buildingCount(upgrade.type) >= upgrade.needed;
                }
            },
            buyUpgrade: function (upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.crackers.gte(upgrade.cost)) {
                    this.crackers = this.crackers.minus(upgrade.cost);
                    upgrade.active = true;

                    this.recalculateCps();
                    this.recalculateClickPower();
                }
            },
            activeUpgrades: function (buildingType) {
                return this.upgrades.filter(function (upgrade) {
                    return upgrade.active && upgrade.type == buildingType;
                });
            },
            upgradeMultiplier: function (buildingType) {
                let multiplier = 1;
                this.activeUpgrades(buildingType).forEach(function (upgrade) {
                    if (upgrade.multiplier != null) {
                        multiplier *= upgrade.multiplier;
                    }
                });
                return multiplier;
            },
            upgradeAddition: function () {
                let addition = 0;
                this.activeUpgrades('Finger').forEach(function (upgrade) {
                    if (upgrade.addition != null) {
                        addition += upgrade.addition;
                    }
                });
                return addition * this.otherBuildingCount('Finger');
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

            // tick
            tick: function () {
                this.crackers = this.crackers.plus(this.cps.div(10));
                this.totalCrackers = this.totalCrackers.plus(this.cps.div(10));
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
            setInterval(function () {
                this.tick();
            }.bind(this), 100);
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
    
    .upgrade-link {
        text-decoration: underline;
    }
    
    .buildings,
    .upgrades {
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
</style>