export default {
    buildings: [
        // cursor
        { name: 0, baseCost: 15, baseCps: 0.1 },

        // grandma
        { name: 1, baseCost: 100, baseCps: 1 },

        // farm
        { name: 2, baseCost: 1100, baseCps: 8 },

        // mine
        { name: 3, baseCost: 12000, baseCps: 47 },

        // factory
        { name: 4, baseCost: 130000, baseCps: 260 },

        // bank
        { name: 5, baseCost: 1.4E6, baseCps: 1400 },

        // temple
        { name: 6, baseCost: 20E6, baseCps: 7800 },

        // wizard tower
        { name: 7, baseCost: 330E6, baseCps: 44000 },

        // shipment
        { name: 8, baseCost: 5.1E9, baseCps: 260000 },

        // alchemy lab
        { name: 9, baseCost: 75E9, baseCps: 1.6E6 },

        // portal
        { name: 10, baseCost: 1E12, baseCps: 10E6 },

        // time machine
        { name: 11, baseCost: 14E12, baseCps: 65E6 },

        // antimatter condenser
        { name: 12, baseCost: 170E12, baseCps: 430E6 },

        // prism
        { name: 13, baseCost: 2.1E15, baseCps: 2.9E12 },
    ],

    buildingUpgradeNeeds: [
        // currency type
        [1, 1, 10, 20, 40, 80, 120, 160, 200, 240, 280, 320],

        // everything else
        [1, 5, 25, 50, 100, 150, 200, 250],
    ],

    buildingUpgradeAmounts: [
        // currency type
        ["m2", "m2", "m2", "a0.1", "a0.5", "a5", "a50", "a500", "a5000", "a50000", "a500000", "a5000000"],

        // everything else
        ["m2", "m2", "m2", "m2", "m2", "m2", "m2", "m2"],
    ],

    clickingUpgrades: [
        { needed: 1000, cost: 50000, multiplier: 1.01 },
        { needed: 100000, cost: 5E6, multiplier: 1.01 },
        { needed: 10E6, cost: 500E6, multiplier: 1.01 },
        { needed: 1E9, cost: 50E9, multiplier: 1.01 },
        { needed: 100E9, cost: 5E12, multiplier: 1.01 },
        { needed: 10E12, cost: 500E12, multiplier: 1.01 },
        { needed: 1E15, cost: 50E15, multiplier: 1.01 },
        { needed: 100E15, cost: 5E18, multiplier: 1.01 },
        { needed: 10E18, cost: 500E18, multiplier: 1.01 },
        { needed: 1E21, cost: 50E21, multiplier: 1.01 },
    ],

    tierOneUpgradeTypes: [
        // TODO requires 15 buildingType & 1 tier1 building.
        // makes tier1 twice as efficient and +1% CpS per n/tier1 where n is upgrade #
        { 'buildingType': 2, cost: 55000 }
    ],

    buildingUpgradeCosts: [
        { type: 0, costs: [100, 500, 10000, 100000, 10E6, 100E6, 1E9, 10E9, 10E12, 100E12, 1E15, 10E15] },

        { type: 1, costs: [1000, 5000, 50000, 5E6, 500E6, 50E9, 50E12, 50E15] },

        { type: 2, costs: [11000, 55000, 550000, 55E6, 5.5E9, 550E9, 550E12, 550E15] },

        { type: 3, costs: [120000, 600000, 6E6, 600E6, 60E9, 6E12, 6E15, 6E18] },

        { type: 4, costs: [1.3E6, 6.5E6, 65E6, 6.5E9, 650E9, 65E12, 65E15, 65E18] },

        { type: 5, costs: [14E6, 70E6, 700E6, 70E9, 7E12, 700E12, 700E15, 700E18] },

        { type: 6, costs: [200E6, 1E9, 10E9, 1E12, 100E12, 10E15, 10E18, 10E21] },

        { type: 7, costs: [3.3E9, 16.5E9, 165E9, 16.5E12, 1.65E15, 165E15, 165E18, 165E21] },

        { type: 8, costs: [51E9, 255E9, 2.55E12, 255E12, 25.5E15, 2.55E18, 2.55E21, 2.55E24] },

        { type: 9, costs: [750E9, 3.75E12, 37.5E12, 3.75E15, 375E15, 37.5E18, 37.5E21, 37.5E24] },

        { type: 10, costs: [10E12, 50E12, 500E12, 50E15, 5E18, 500E18, 500E21, 500E24] },

        { type: 11, costs: [140E12, 700E12, 7E15, 700E15, 70E18, 7E21, 7E24, 7E27] },

        { type: 12, costs: [1.7E15, 8.5E15, 85E15, 8.5E18, 850E18, 85E21, 85E24, 85E27] },

        { type: 13, costs: [21E15, 105E15, 1.05E18, 105E18, 10.5E21, 1.05E24, 1.05E27, 1.05E30] },
    ],

    buildingAchievements: [
        { type: 0, total: 1 },
        { type: 0, total: 2 },

        { type: 1, total: 1 },
        { type: 1, total: 50 }

        // TODO more
    ],

    productionUpgrades: [
        { needed: 50000, cost: 999999, multiplier: 1.01 },
        { needed: 250000, cost: 5E6, multiplier: 1.01 },
        { needed: 500000, cost: 10E6, multiplier: 1.01 },
        { needed: 2.5E6, cost: 50E6, multiplier: 1.01 },
        { needed: 5E6, cost: 100E6, multiplier: 1.01 },
        { needed: 25E6, cost: 500E6, multiplier: 1.02 },
        { needed: 50E6, cost: 1E9, multiplier: 1.02 },
        { needed: 250E6, cost: 5E9, multiplier: 1.02 },
        { needed: 500E6, cost: 10E9, multiplier: 1.02 },
        { needed: 2.5E9, cost: 50E9, multiplier: 1.02 },
        { needed: 5E9, cost: 100E9, multiplier: 1.04 },
        { needed: 5E9, cost: 100E9, multiplier: 1.04 },
        { needed: 25E9, cost: 500E9, multiplier: 1.02 },
        { needed: 50E9, cost: 1E12, multiplier: 1.02 },
        { needed: 250E9, cost: 5E12, multiplier: 1.02 },
        { needed: 500E9, cost: 10E12, multiplier: 1.02 },
        { needed: 2.5E12, cost: 50E12, multiplier: 1.02 },
        { needed: 25E12, cost: 500E12, multiplier: 1.02 },
        { needed: 50E12, cost: 1E15, multiplier: 1.02 },
        { needed: 50E12, cost: 1E15, multiplier: 1.02 },
        { needed: 500E12, cost: 10E15, multiplier: 1.02 },
        { needed: 500E12, cost: 10E15, multiplier: 1.02 },
        { needed: 2.5E15, cost: 50E15, multiplier: 1.04 },
        { needed: 2.5E15, cost: 50E15, multiplier: 1.04 },
        { needed: 5E15, cost: 100E15, multiplier: 1.03 },
        { needed: 25E15, cost: 500E15, multiplier: 1.03 },
        { needed: 50E15, cost: 1E18, multiplier: 1.03 },
        { needed: 250E15, cost: 5E18, multiplier: 1.03 },
        { needed: 2.5E18, cost: 50E18, multiplier: 1.03 },
        { needed: 5E18, cost: 100E18, multiplier: 1.04 },
        { needed: 25E18, cost: 500E18, multiplier: 1.04 },
        { needed: 50E18, cost: 1E21, multiplier: 1.04 },
        { needed: 250E18, cost: 5E21, multiplier: 1.04 },
        { needed: 500E18, cost: 10E21, multiplier: 1.04 },
        { needed: 2.5E21, cost: 50E21, multiplier: 1.04 },
        { needed: 5E21, cost: 100E21, multiplier: 1.04 },
        { needed: 25E21, cost: 500E21, multiplier: 1.04 },
        { needed: 50E21, cost: 1E24, multiplier: 1.04 },
        { needed: 250E21, cost: 5E24, multiplier: 1.04 },
        { needed: 500E21, cost: 10E24, multiplier: 1.04 },
        { needed: 2.5E24, cost: 50E24, multiplier: 1.04 },
        { needed: 5E24, cost: 100E24, multiplier: 1.04 },
        { needed: 25E24, cost: 500E24, multiplier: 1.04 },
        // TODO upgrade expansions e.g. "box of brand biscuits" & holiday events
    ],

    // X of every building upgrades
    buildingProductionUpgrades: [
        { needed: 100, cost: 1E21, multiplier: 1.1 },
        { needed: 150, cost: 1E24, multiplier: 1.1 },
        { needed: 200, cost: 1E27, multiplier: 1.1 },
        { needed: 250, cost: 1E30, multiplier: 1.1 },
        { needed: 300, cost: 1E33, multiplier: 1.1 },
    ],

    productionAchievements: [
        // total
        { total: 1 },
        { total: 1000 },
        { total: 100000 },
        { total: 1E6 },
        { total: 100E6 },
        { total: 1E9 },
        { total: 100E9 },
        { total: 1E12 },
        { total: 100E12 },
        { total: 1E15 },
        { total: 100E15 },
        { total: 1E18 },
        { total: 100E18 },
        { total: 1E21 },
        { total: 100E21 },
        { total: 1E24 },
        { total: 100E24 },
        { total: 1E27 },
        { total: 100E27 },
        { total: 1E30 },
        { total: 100E30 },
        { total: 1E33 },
        { total: 100E33 },

        // cps
        { cps: 1 },
        { cps: 10 },
        { cps: 100 },
        { cps: 1000 },
        { cps: 10000 },
        { cps: 100000 },
        { cps: 1E6 },
        { cps: 1E7 },
        { cps: 1E8 },
        { cps: 1E9 },
        { cps: 1E10 },
        { cps: 1E11 },
        { cps: 1E12 },
        { cps: 1E13 },
        { cps: 1E14 },
        { cps: 1E15 },
        { cps: 1E16 },
        { cps: 1E17 },
        { cps: 1E18 },

        // clicking
        { clicks: 1000 },
        { clicks: 100000 },
        { clicks: 10E6 },
        { clicks: 1E9 },
        { clicks: 1E12 },
        { clicks: 1E15 },
        { clicks: 1E18 },
    ],
};
