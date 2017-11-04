import Vue from 'vue';
import Vuex from 'vuex';
import Big from "big.js";

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        currency: new Big(0),
        totalCurrencyEarned: new Big(0),
        totalCurrencySpent: new Big(0),
    },
    mutations: {
        addCurrency(state, n) {
            state.currency = state.currency.plus(n);
        },
        addTotalCurrencyEarned(state, n) {
            state.totalCurrencyEarned = state.totalCurrencyEarned.plus(n);
        },
        subtractCurrency(state, n) {
            state.currency = state.currency.minus(n);
        },
        addTotalCurrencySpent(state, n) {
            state.totalCurrencySpent = state.totalCurrencySpent.plus(n);
        }
    },
    actions: {
        addCurrency (context, n) {
            context.commit('addCurrency', n);
            context.commit('addTotalCurrencyEarned', n);
        },
        subtractCurrency (context, n) {
            context.commit('subtractCurrency', n);
            context.commit('addTotalCurrencySpent', n);
        }
    }
});
