import Utils from './utils';
import Options from './options.js';
import Stats from './stats.js';
import DefaultData from './defaultData.js';
import Big from "big.js";

function getSaveVersion() {
    return '0.1';
}

export default  {
    /*async new() {
        // load default data
        let data = DefaultData.data();
    },*/

    save(data) {
        let saveData = {
            version: getSaveVersion(),

            // misc state
            buildingCostMultiplier: data.buildingCostMultiplier,
            buildingNames: data.buildingNames,
            buildings: data.buildings,
            upgrades: data.upgrades,
            achievements: data.achievements,
            timestamp: Utils.unixTimestamp(),
            buyAmount: data.buyAmount,

            // options/stats
            options: Options.state,
            stats: Stats.state,
        };

        localStorage.setItem("SaveGame", JSON.stringify(saveData));
    },

    load() {
        // load default data
        let data = DefaultData.data();

        // load save data
        let saveData = JSON.parse(localStorage.getItem("SaveGame"));

        // TODO migrate old save version
        // if (saveData.version != "0.1") etc

        // load stats/options
        Options.replaceState(saveData.options);
        Stats.replaceState(Utils.convertObjectToBig(saveData.stats));

        data.currencyName = Stats.state.currencyName;
        document.title = Stats.state.currencyName + ' Clicker';
        data.currency = Big(0); // this will be looped in, display only
        data.displayedCps = Big(0);
        data.displayedClickPower = Big(1);
        data.buildingNames = saveData.buildingNames;
        data.buildingCostMultiplier = saveData.buildingCostMultiplier;
        data.buyAmount = saveData.buyAmount;

        // TODO below stuff should be integrated with the same function as newgame?
        
        // parse buildings/upgrades/achievements (cast numbers to big.js)
        let buildings = [];
        let showUpgrades = false;
        saveData.buildings.forEach(function (saveBuilding) {
            let building = {
                name: saveBuilding.name,
                flavorText: saveBuilding.flavorText,
                baseCost: Big(saveBuilding.baseCost),
                buyCost: Big(saveBuilding.buyCost),
                baseCps: Big(saveBuilding.baseCps),
                currentCps: Big(saveBuilding.currentCps),
                description: saveBuilding.description,
                unlocked: saveBuilding.unlocked,
                showAt: saveBuilding.showAt,
                owned: saveBuilding.owned,
                icon: saveBuilding.icon,
            };
            if (building.owned > 0) {
                showUpgrades = true;
            }
            buildings.push(building);
        });
        data.buildings = buildings;

        let upgrades = [];
        saveData.upgrades.forEach(function (saveUpgrade) {
            let upgrade = {
                type: saveUpgrade.type,
                name: saveUpgrade.name,
                flavorText: saveUpgrade.flavorText,
                needed: saveUpgrade.needed,
                cost: Big(saveUpgrade.cost),
                icon: saveUpgrade.icon,
                unlocked: saveUpgrade.unlocked,
                active: saveUpgrade.active,
            };
            if (saveUpgrade.buildingUpgrade == true) {
                upgrade.buildingUpgrade = true;
            }
            if (saveUpgrade.buildingType) {
                upgrade.buildingType = saveUpgrade.buildingType;
            }
            if (saveUpgrade.tierOneForCpsUpgrade) {
                upgrade.tierOneForCpsUpgrade = saveUpgrade.tierOneForCpsUpgrade;
            }
            if (saveUpgrade.addition != null) {
                upgrade.addition = saveUpgrade.addition;
            }
            if (saveUpgrade.multiplier != null) {
                upgrade.multiplier = saveUpgrade.multiplier;
            }
            if (upgrade.unlocked) {
                showUpgrades = true;
            }

            upgrades.push(upgrade);
        });
        data.upgrades = upgrades;
        data.showUpgrades = showUpgrades;

        let achievements = [];
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

            achievements.push(achievement);
        });
        data.achievements = achievements;
        data.showAchievements = showAchievements;

        // calculate bonus currency
        let timeDifference = Utils.unixTimestamp() - saveData.timestamp;
        data.bonusCurrency = Stats.state.cps.div(2).times(timeDifference).round();
        if (data.bonusCurrency.gt(0)) {
            Stats.commit('addCurrency', data.bonusCurrency);
            if (data.bonusCurrency.gte(Big(Stats.state.currency).div(5))) {
                // show dialog if earned enough bonus currency
                data.bonusDialog = true;
            }
        }

        return data;
    }
};
