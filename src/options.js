import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function defaultOptions() {
    return {
        alerts: true,
        sounds: true,
        particles: true,
        animation: true,
    };
}

export default new Vuex.Store({
    state: defaultOptions(),
    mutations: {
        resetState(state) {
            Object.assign(state, defaultOptions());
        }
    }
});
