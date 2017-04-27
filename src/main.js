"use strict";

import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import Game from './game.vue'

Vue.use(Vue2Filters)

new Vue({
    el: '#game',
    components: { Game }
});
