import Vue from 'vue';
import Vuex from 'vuex';
import Big from "big.js";

Vue.use(Vuex);

function initialState() {
    return {
        currencyName: null,

        currency: Big(0),
        totalCurrencyEarned: Big(0),
        totalCurrencySpent: Big(0),

        cps: Big(0),

        clickPower: Big(1),
        clicks: Big(0),

        upgradeCount: 0,
        achievementCount: 0,

        goldenCurrencySpawned: 0,
        goldenCurrencyClicked: 0,
    };
}

export default new Vuex.Store({
    state: initialState(),
    mutations: {
        resetState(state) {
            Object.assign(state, initialState());
        },

        // currency
        setCurrencyName(state, n) {
            state.currencyName = n;
        },
        addCurrency(state, n) {
            state.currency = state.currency.plus(n);
            state.totalCurrencyEarned = state.totalCurrencyEarned.plus(n);
        },
        subtractCurrency(state, n) {
            state.currency = state.currency.minus(n);
            state.totalCurrencySpent = state.totalCurrencySpent.plus(n);
        },
        
        // clicks
        addClicks(state, n) {
            state.clicks = state.clicks.plus(n);
        },
        setClickPower(state, n) {
            state.clickPower = Big(n);
        },

        setCps(state, n) {
            state.cps = Big(n);
        },

        // upgrades/achievement tracking
        addUpgrade(state) {
            state.upgradeCount ++;
        },
        addAchievement(state) {
            state.achievementCount ++;
        },

        // golden currency
        addGoldenSpawned(state) {
            state.goldenCurrencySpawned ++;
        },
        addGoldenClicked(state) {
            state.goldenCurrencyClicked ++;
        },
    }
});
