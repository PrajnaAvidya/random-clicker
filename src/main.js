// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// load main stuff
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';

Vue.use(Vuex);
Vue.use(Vuetify);

// load css
import 'vuetify/dist/vuetify.min.css';

// components
import GameAlerts from './gameAlerts.vue';
import GameMenu from './gameMenu.vue';
Vue.component('GameAlerts', GameAlerts);
Vue.component('GameMenu', GameMenu);

// game
import Game from './game.vue';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#game',
    components: { Game }
});
