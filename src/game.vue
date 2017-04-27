<template>
    <div class="row">
        <a class="tooltips" href="#">CSS Tooltips<span>Tooltip</span></a>

        <div class="col-md-3">
            <div class="row totals">
                <span class="total-crackers"><h1>{{ crackers | whole }} crackers</h1></span>
                <span class="crackers-per-second"><h2>Per second: {{ cps | round }}</h2></span>
                <span class="crackers-per-click"><h3>Per click: {{ clickPower | whole }}</h3></span>
            </div>

            <div class="row cracker">
                <img src="/images/cracker.png" v-on:click="crackerClick" />
            </div>
        </div>

        <div class="col-md-5 col-md-offset-1">
            <div class="row buildings">
                <h3>Buildings</h3>

                <div class="row building" v-for="building in buildings" v-if="building.owned > 0 || showBuilding(building)">
                    <div class="col-xs-4">

                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span>{{ building.description }}</span></span>
                        {{ building.name }} ({{ building.owned }})
                    </div>
                    <div class="col-xs-2">
                        <button class="btn btn-default" @click="buyBuilding(building)">Buy ({{ buildingCost(building) }})</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="row upgrades">
                <h3>Upgrades</h3>

                <div class="row upgrade" v-for="upgrade in orderBy(upgrades, 'cost')" v-if="!upgrade.active && canBuyUpgrade(upgrade)">
                    <div class="col-xs-12">
                        <span class="glyphicon glyphicon-info-sign tooltips" aria-hidden="true"><span>{{ upgradeText(upgrade) }} </span></span>
                        <span class="upgrade-link" @click="buyUpgrade(upgrade)">{{ upgrade.type }}: {{ upgrade.name }} ({{ upgrade.cost }})</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                crackers: 0,
                totalCrackers: 0,
                clicks: 0,
                cps: 0,
                clickPower: 1,

                buildings: [
                    { name: 'Finger', baseCost: 15, baseCps: 0.1, description: 'Growing extra fingers will allow you to click more often.', showAt: 0, owned: 0 },
                    { name: 'Toddler', baseCost: 100, baseCps: 1, description: "These toddlers will eat crackers if you tell them they're cookies.", showAt: 0, owned: 0 },
                    { name: 'Kosher Bakery', baseCost: 1100, baseCps: 8, description: "These guys seem to know what they're doing.", showAt: 15, owned: 0 },
                    { name: 'Non-Kosher Bakery', baseCost: 12000, baseCps: 47, description: "These guys don't follow the rules!", showAt: 100, owned: 0 },
                    { name: 'Tea Club', baseCost: 130000, baseCps: 260, description: "These people LOVE crackers with their tea", showAt: 1100, owned: 0 },
                    { name: 'Cracker Factory', baseCost: 1400000, baseCps: 1400, description: "Seems only logical", showAt: 12000, owned: 0 },
                ],

                upgrades: [
                    // production
                    { type: 'Cracker', name: 'Store Brand Crackers', needed: 50000, cost: 999999, multiplier: 1.01, description: 'Meh', active: false },
                    { type: 'Cracker', name: 'Fancy Store Crackers', needed: 250000, cost: 5000000, multiplier: 1.01, description: 'Ok I guess', active: false },
                    { type: 'Cracker', name: 'Rye Crackers', needed: 500000, cost: 10000000, multiplier: 1.01, description: 'Better than cardboard', active: false },
                    { type: 'Cracker', name: 'Sugared Crackers', needed: 2500000, cost: 50000000, multiplier: 1.01, description: 'Gross?', active: false },
                    { type: 'Cracker', name: 'Salted Crackers', needed: 5000000, cost: 100000000, multiplier: 1.01, description: 'Ugh what?', active: false },
                    // 2% etc

                    // finger (cursor)
                    { type: 'Finger', name: 'Double Tap', needed: 1, cost: 100, multiplier: 2, description: 'Tap faster', active: false },
                    { type: 'Finger', name: 'Quattro Tap', needed: 1, cost: 500, multiplier: 2, description: 'Tap faster!', active: false },
                    { type: 'Finger', name: 'Mega Tap', needed: 10, cost: 10000, multiplier: 2, description: 'Tap even faster!!', active: false },
                    { type: 'Finger', name: 'Middle Finger', needed: 20, cost: 100000, addition: 0.1, description: 'Put that thing away.', active: false },
                    { type: 'Finger', name: 'Double Middle Finger', needed: 40, cost: 10000000, addition: 0.5, description: 'Put those away.', active: false },
                    { type: 'Finger', name: 'Extra Middle Fingers', needed: 80, cost: 100000000, addition: 5, description: "Now that's just rude.", active: false },
                    { type: 'Finger', name: 'Super Finger', needed: 120, cost: 1000000000, addition: 50, description: "No decorum at all.", active: false },
                    { type: 'Finger', name: 'Super Duper Finger', needed: 160, cost: 10000000000, addition: 500, description: "...", active: false },
                    { type: 'Finger', name: 'Mega Finger', needed: 200, cost: 10000000000000, addition: 5000, description: "...!?...", active: false },
                    // 240
                    // 280
                    // 320

                    // toddler (grandma)
                    { type: 'Toddler', name: 'Timeout', needed: 1, cost: 1000, multiplier: 2, description: 'These toddlers need to learn some discipline', active: false },
                    { type: 'Toddler', name: 'Daycare', needed: 5, cost: 5000, multiplier: 2, description: 'Finally, some me time!', active: false },
                    { type: 'Toddler', name: 'Play Date', needed: 25, cost: 50000, multiplier: 2, description: 'An active social life is good for productivity', active: false },
                    { type: 'Toddler', name: 'ADHD Meds', needed: 50, cost: 5000000, multiplier: 2, description: "That's better...", active: false },
                    { type: 'Toddler', name: 'Jack', needed: 100, cost: 500000000, multiplier: 2, description: "You like that movie?", active: false },
                    // 150
                    // 200
                    // 250

                    // kosher bakery (farm)
                    { type: 'Kosher Bakery', name: 'Torah', needed: 1, cost: 11000, multiplier: 2, description: 'Got to follow the rules', active: false },
                    { type: 'Kosher Bakery', name: 'Another Torah', needed: 5, cost: 55000, multiplier: 2, description: 'More to go around', active: false },
                    { type: 'Kosher Bakery', name: 'Rabbi', needed: 25, cost: 550000, multiplier: 2, description: "This rabbi doesn't come cheap", active: false },
                    { type: 'Kosher Bakery', name: 'Rabbi Council', needed: 50, cost: 55000000, multiplier: 2, description: "These rabbis don't come cheap", active: false },
                    { type: 'Kosher Bakery', name: 'Passover Bonus', needed: 100, cost: 5500000000, multiplier: 2, description: "What does that even mean?", active: false },
                    // 150
                    // 200
                    // 250

                    // non-kosher bakery (mine)
                    { type: 'Non-Kosher Bakery', name: 'Knockoff Torah', needed: 1, cost: 120000, multiplier: 2, description: "This doesn't seem legit...", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Another Knockoff Torah', needed: 5, cost: 600000, multiplier: 2, description: "??", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Rabbi', needed: 25, cost: 6000000, multiplier: 2, description: "I don't think his beard is real", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Rabbi Council', needed: 50, cost: 600000000, multiplier: 2, description: "I have a bad feeling about this", active: false },
                    { type: 'Non-Kosher Bakery', name: 'Fake Passover Bonus', needed: 100, cost: 60000000000, multiplier: 2, description: "What does that even mean?!", active: false },
                    // 150
                    // 200
                    // 250

                    // tea club (factory)
                    { type: 'Tea Club', name: 'Strumpets', needed: 1, cost: 1300000, multiplier: 2, description: "What are we, savages?", active: false },
                    { type: 'Tea Club', name: 'Valet', needed: 5, cost: 6500000, multiplier: 2, description: "I'm too rich to park my car", active: false },
                    { type: 'Tea Club', name: 'Servant', needed: 25, cost: 65000000, multiplier: 2, description: "It's not technically slavery!", active: false },
                    { type: 'Tea Club', name: 'Free trade tea', needed: 50, cost: 6500000000, multiplier: 2, description: "I feel so much better about this", active: false },
                    { type: 'Tea Club', name: 'Slavery tea', needed: 100, cost: 650000000000, multiplier: 2, description: "Suffering tastes better", active: false },
                    // 150
                    // 200
                    // 250

                    // cracker factory (bank)
                    { type: 'Cracker Factory', name: 'Strumpets', needed: 1, cost: 14000000, multiplier: 2, description: "What are we, savages?", active: false },
                    { type: 'Cracker Factory', name: 'Valet', needed: 5, cost: 70000000, multiplier: 2, description: "I'm too rich to park my car", active: false },
                    { type: 'Cracker Factory', name: 'Servant', needed: 25, cost: 700000000, multiplier: 2, description: "It's not technically slavery!", active: false },
                    { type: 'Cracker Factory', name: 'Free trade tea', needed: 50, cost: 70000000000, multiplier: 2, description: "I feel so much better about this", active: false },
                    { type: 'Cracker Factory', name: 'Slavery tea', needed: 100, cost: 7000000000000, multiplier: 2, description: "Suffering tastes better", active: false },
                    // 150
                    // 200
                    // 250
                ],
            }
        },
        computed: {

        },
        methods: {
            // clicking/cps
            crackerClick: function () {
                this.clicks += this.clickPower;
                this.crackers += this.clickPower;
                this.totalCrackers += this.clickPower;
            },
            recalculateClickPower: function () {
                this.clickPower = this.upgradeMultiplier('Finger') + this.upgradeAddition();
            },
            recalculateCps: function () {
                let cps = 0;
                let vm = this;
                this.ownedBuildings().forEach(function (building) {
                    cps += building.baseCps * building.owned * vm.upgradeMultiplier(building.name);
                });

                // add finger additive upgrades
                cps += this.upgradeAddition();

                // add production upgrades
                cps *= this.upgradeProduction();

                this.cps = cps;
            },

            // buildings
            showBuilding: function (building) {
                return this.totalCrackers >= building.showAt;
            },
            buyBuilding: function (building) {
                if (this.crackers >= this.buildingCost(building)) {
                    this.crackers -= this.buildingCost(building);
                    building.owned += 1;

                    this.recalculateCps();
                    this.recalculateClickPower();
                }
            },
            buildingCost: function (building) {
                return Math.ceil(building.baseCost * Math.pow(1.15, building.owned));
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

            // upgrades
            canBuyUpgrade: function (upgrade) {
                if (upgrade.type == 'Cracker') {
                    return this.crackers >= upgrade.needed;
                } else {
                    return this.buildingCount(upgrade.type) >= upgrade.needed;
                }
            },
            buyUpgrade: function (upgrade) {
                if (this.canBuyUpgrade(upgrade) && this.crackers >= upgrade.cost) {
                    upgrade.active = true;
                    this.crackers -= upgrade.cost;

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
                    upgradeText += ' (Multiplies ' + upgrade.type + ' production by ' + upgrade.multiplier + ')';
                } else if (upgrade.addition != null) {
                    upgradeText += ' (Adds ' + upgrade.addition + ' cracker production for every non-' + upgrade.type + ' building owned)';
                }
                return upgradeText;
            },

            // tick
            tick: function () {
                this.crackers += this.cps / 10;
                this.totalCrackers += this.cps / 10;
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