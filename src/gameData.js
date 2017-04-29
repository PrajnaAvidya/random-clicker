import Big from 'big.js';

export default {
    buildingNames: ["Abbey", "A-frame", "Aircraft Hangar", "Airport Terminal", "Amphitheater", "Apartment Building", "Aqueduct", "Arch", "Arena", "Armory", "Assembly Hall", "Barn", "Barracks", "Beach House", "Boathouse", "Boarding House", "Bowling Alley", "Bridge", "Brownstone", "Bungalow", "Bunkhouse", "Bunker", "Cabana", "Cabin", "Capitol", "Carport", "Castle", "Catacomb", "Cathedral", "Chalet", "Chapel", "Chateau", "Church", "Cinema", "City Hall", "Clubhouse", "College", "Compound", "Concert Hall", "Condominium", "Conservatory", "Cottage", "Courthouse", "Crypt", "Depot", "Detached House", "Dock", "Dome", "Dormitory", "Double Wide", "Duplex", "Dwelling", "Embassy", "Exposition Hall", "Factory", "Farm", "Farmhouse", "Ferry Slip", "Ferry Terminal", "Firehouse", "Fire Station", "Folly", "Forge", "Fort", "Fortress", "Foundry", "Gallery", "Garage", "Gas Station", "Gazebo", "Geodesic Dome", "Granary", "Greenhouse", "Gym", "Gymnasium", "Hall", "Hangar", "Haunted House", "Headquarters", "High-rise", "Home", "Hospital", "Hostel", "Hotel", "Hot House", "House", "Houseboat", "Housing Project", "Hunting Lodge", "Hut", "Igloo", "Jail", "Kiosk", "Laboratory", "Lean-to", "Library", "Lighthouse", "Lodge", "Log Cabin", "Longhouse", "Mall", "Manor", "Manse", "Mansion", "Marina", "Market", "Mausoleum", "Meeting Hall", "Mill", "Minaret", "Mobile Home", "Monastery", "Monument", "Mosque", "Motel", "Museum", "Nuclear Power Plant", "Nursing Home", "Observatory", "Office Building", "Opera House", "Outbuilding", "Outhouse", "Pagoda", "Palace", "Parking Garage", "Parliament", "Pavilion", "Plant", "Playhouse", "Police Station", "Pool House", "Post Office", "Power Plant", "Prefab Building", "Prison", "Pump House", "Pyramid", "Quonset Hut", "Railway Station", "Ranch", "Rectory", "Refinery", "Residence", "Restaurant", "Roller Rink", "Roundhouse", "Rowhouse", "School", "Shack", "Shed", "Shelter", "Shopping Center", "Shopping Mall", "Shrine", "Silo", "Skating Rink", "Skyscraper", "Skyway", "Smokestack", "Spire", "Split-level House", "Stable", "Stadium", "State House", "Station", "Steeple", "Store", "Storehouse", "Strip Mall", "Structure", "Studio", "Supermarket", "Symphony", "Synagogue", "Temple", "Tenement", "Tent", "Terminal", "Theater", "Tipi", "Toll House", "Tomb", "Tower", "Townhouse", "Treehouse", "Triplex", "Tudor House", "University", "Vault", "Vicarage", "Villa", "Warehouse", "Watermill", "Workshop", "Yurt"],

    buildings: [
        { name: 0, baseCost: Big(15), buyCost: Big(15), baseCps: Big(0.1), currentCps: Big(0.1), description: "", unlocked: false, showAt: 0, owned: 0 },
        { name: 1, baseCost: Big(100), buyCost: Big(100), baseCps: Big(1), currentCps: Big(1), description: "", unlocked: false, showAt: Big(0), owned: 0 },
        { name: 2, baseCost: Big(1100), buyCost: Big(1100), baseCps: Big(8), currentCps: Big(8), description: "", unlocked: false, showAt: Big(15), owned: 0 },
        { name: 3, baseCost: Big(12000), buyCost: Big(12000), baseCps: Big(47), currentCps: Big(47), description: "", unlocked: false, showAt: Big(100), owned: 0 },
        { name: 4, baseCost: Big(130000), buyCost: Big(130000), baseCps: Big(260), currentCps: Big(260), description: "", unlocked: false, showAt: Big(1100), owned: 0 },
        { name: 5, baseCost: Big(1.4E6), buyCost: Big(1.4E6), baseCps: Big(1400), currentCps: Big(1400), description: "", unlocked: false, showAt: Big(12000), owned: 0 },
        { name: 6, baseCost: Big(20E6), buyCost: Big(20E6), baseCps: Big(7800), currentCps: Big(7800), description: "", unlocked: false, showAt: Big(130000), owned: 0 },
        { name: 7, baseCost: Big(330E6), buyCost: Big(330E6), baseCps: Big(44000), currentCps: Big(44000), description: "", unlocked: false, showAt: Big(1.4E6), owned: 0 },
        { name: 8, baseCost: Big(5.1E9), buyCost: Big(5.1E9), baseCps: Big(260000), currentCps: Big(260000), description: "", unlocked: false, showAt: Big(20E6), owned: 0 },
        { name: 9, baseCost: Big(75E9), buyCost: Big(75E9), baseCps: Big(1.6E6), currentCps: Big(1.6E6), description: "", unlocked: false, showAt: Big(330E6), owned: 0 },
        { name: 10, baseCost: Big(1E12), buyCost: Big(1E12), baseCps: Big(10E6), currentCps: Big(10E6), description: "", unlocked: false, showAt: Big(5.1E9), owned: 0 },
        { name: 11, baseCost: Big(14E12), buyCost: Big(14E12), baseCps: Big(65E6), currentCps: Big(65E6), description: "", unlocked: false, showAt: Big(75E9), owned: 0 },
        { name: 12, baseCost: Big(170E12), buyCost: Big(170E12), baseCps: Big(430E6), currentCps: Big(430E6), description: "", unlocked: false, showAt: Big(1E12), owned: 0 },
        { name: 13, baseCost: Big(2.1E15), buyCost: Big(2.1E15), baseCps: Big(2.9E12), currentCps: Big(2.9E12), description: "", unlocked: false, showAt: Big(14E12), owned: 0 },
    ],

    buildingUpgradeNeeds: [
        // cursor type
        [1, 1, 10, 20, 40, 80, 120, 160, 200, 240, 280, 320],
        // everything else
        [1, 5, 25, 50, 100, 150, 200, 250],
    ],

    buildingUpgradeAmounts: [
        // cursor type
        ['m2', 'm2', 'm2', 'a0.1', 'a0.5', 'a5', 'a50', 'a500', 'a5000', 'a50000', 'a500000', 'a5000000'],
        // everything else
        ['m2', 'm2', 'm2', 'm2', 'm2', 'm2', 'm2', 'm2'],
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

        { type: 8, costs: [51E9, 255E9, 2.55E12, 255E12, 25.5E15, 2.55E18, 2.5521, 2.55E24] },

        { type: 9, costs: [750E9, 3.75E12, 37.5E12, 3.75E15, 375E15, 37.5E18, 37.5E21, 37.5E24] },

        { type: 10, costs: [10E12, 50E12, 500E12, 50E15, 5E18, 500E18, 500E21, 500E24] },

        { type: 11, costs: [140E12, 700E12, 7E15, 700E15, 70E18, 7E21, 7E24, 7E27] },

        { type: 12, costs: [1.7E15, 8.5E15, 85E15, 8.5E18, 850E18, 85E21, 85E24, 85E27] },

        { type: 13, costs: [21E15, 105E15, 1.05E18, 105E18, 10.5E21, 1.05E24, 1.05E27, 1.05E30] },
    ],

    buildingAchivements: [
        { type: 0, name: 'Click', total: Big(1), unlocked: false },
        { type: 0, name: 'Double Click', total: Big(2), unlocked: false },

        { type: 1, name: 'Grandma basics', total: Big(1), unlocked: false },
        { type: 1, name: 'Grandma proficiency', total: Big(50), unlocked: false }
    ],

    productionUpgrades: [
        { needed: Big(50000), cost: Big(999999), multiplier: 1.01, description: '' },
        { needed: Big(250000), cost: Big(5E6), multiplier: 1.01, description: '' },
        { needed: Big(500000), cost: Big(10E6), multiplier: 1.01, description: '' },
        { needed: Big(2.5E6), cost: Big(50E6), multiplier: 1.01, description: '' },
        { needed: Big(5E6), cost: Big(100E6), multiplier: 1.01, description: '' },
        { needed: Big(25E6), cost: Big(500E6), multiplier: 1.02, description: '' },
        { needed: Big(50E6), cost: Big(1E9), multiplier: 1.02, description: '' },
        { needed: Big(250E6), cost: Big(5E9), multiplier: 1.02, description: '' },
        { needed: Big(500E6), cost: Big(10E9), multiplier: 1.02, description: '' },
        { needed: Big(2.5E9), cost: Big(50E9), multiplier: 1.02, description: '' },
        // 4% etc
    ],

    productionAchievements: [
        // total
        { total: Big(1) },
        { total: Big(1000) },

        // cps
        { cps: Big(1) },
        { cps: Big(10) },

        // clicking
        { clicks: Big(10000) },
        { clicks: Big(100000) },
    ],

    adjectives: ['Adorable', 'Ancient', 'Angry', 'Awesome', 'Beautiful', 'Better', 'Big', 'Brave', 'Bright', 'Calm', 'Clean', 'Clever', 'Cold', 'Colossal', 'Cool', 'Curly', 'Delicious', 'Delightful', 'Eager', 'Early', 'Elegant', 'Fancy', 'Fast', 'Famous', 'Full', 'Fresh', 'Gentle', 'Gifted', 'Gigantic', 'Glamorous', 'Great', 'Handsome', 'Happy', 'Heavy', 'Hot', 'Huge', 'Immense', 'Jolly', 'Kind', 'Large', 'Long', 'Lively', 'Lovely', 'Magnificent', 'Mammouth', 'Massive', 'Modern', 'Nice', 'Perfect', 'Powerful', 'Proud', 'Quick', 'Rapid', 'Rich', 'Smart', 'Silly', 'Simple', 'Sparkling', 'Strong', 'Sweet', 'Swift', 'Tall', 'Thin', 'Thundering', 'Victorious', 'Witty', 'Young', 'Zealous'],
}
