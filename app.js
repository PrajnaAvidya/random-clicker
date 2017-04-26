"use strict";

Vue.filter('whole', function (value) {
    return parseInt(value);
});

Vue.filter('round', function (value) {
    if (value < 10) {
        return Number((value).toFixed(1));
    } else {
        return parseInt(value);
    }
});

new Vue({
    el: '#game',
    data: {
        crackers: 0,
        clicks: 0,
        cps: 0,
        buildings: [
            { name: 'Finger', baseCost: 15, baseCps: 0.1, description: 'Growing extra fingers will allow you to click more often.', owned: 0 },
            { name: 'Toddler', baseCost: 100, baseCps: 1, description: "These toddlers will eat crackers if you tell them they're cookies.", owned: 0 },
            { name: 'Kosher Bakery', baseCost: 1100, baseCps: 8, description: "These guys seem to know what they're doing.", owned: 0 },
            { name: 'Non-Kosher Bakery', baseCost: 12000, baseCps: 47, description: "These guys don't follow the rules!", owned: 0 }
        ],
        upgrades: [
            // finger
            { type: 'Finger', name: 'Double Tap', needed: 1, cost: 100, multiplier: 2, description: 'Doubles your finger clicks', active: false },
            { type: 'Finger', name: 'Quattro Tap', needed: 1, cost: 500, multiplier: 2, description: 'Doubles your finger clicks (again)', active: false },
            { type: 'Finger', name: 'Mega Tap', needed: 10, cost: 10000, multiplier: 2, description: 'Doubles your finger clicks (again!)', active: false }
        ],
    },
    computed: {
        //
    },
    methods: {
        // click
        crackerClick: function () {
            this.clicks++;
            this.crackers++;
        },

        // buildings
        buyBuilding: function (building) {
            if (this.crackers >= this.buildingCost(building)) {
                this.crackers -= this.buildingCost(building);
                building.owned += 1;

                this.recalculateCps();
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
        ownedBuildings: function () {
            return this.buildings.filter(function (building) {
                return building.owned > 0;
            });
        },

        // upgrades
        buyUpgrade: function (upgrade) {
            if (this.canBuyUpgrade(upgrade) && this.crackers >= upgrade.cost) {
                upgrade.active = true;
                this.crackers -= upgrade.cost;

                this.recalculateCps();
            }
        },
        activeUpgrades: function (buildingType) {
            return this.upgrades.filter(function (upgrade) {
                return upgrade.active && upgrade.type == buildingType;
            });
        },
        canBuyUpgrade: function (upgrade) {
            return this.buildingCount(upgrade.type) >= upgrade.needed;
        },

        // misc
        recalculateCps: function () {
            let cps = 0;
            let vm = this;
            this.ownedBuildings().forEach(function (building) {
                let buildingCps = building.baseCps * building.owned;
                // check upgrades
                let buildingUpgrades = vm.activeUpgrades(building.name);
                buildingUpgrades.forEach(function (upgrade) {
                    buildingCps *= upgrade.multiplier;
                });
                cps += buildingCps;
            });
            this.cps = cps;
        },
        tick: function () {
            this.crackers += this.cps / 10;
        }
    },
    mounted: function () {
        setInterval(function () {
            this.tick();
        }.bind(this), 100);
    }
});
