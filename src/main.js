"use strict";

import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import Game from './game.vue'

Vue.use(Vue2Filters)

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
    components: { Game }
});
