// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';

// event system
window.Event = new class {
    constructor() {
        this.vue = new Vue();
    }

    fire(event, data = null) {
        this.vue.$emit(event, data);
    }

    listen(event, callback) {
        this.vue.$on(event, callback);
    }
}

// game alerts component
import GameAlerts from './gameAlerts.vue';
Vue.component('GameAlerts', GameAlerts);

// main game
import Game from './game.vue';

// frontend package
Vue.use(Vuetify);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#game',
    components: { Game, GameAlerts }
});
