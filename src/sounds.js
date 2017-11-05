import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

function defaultSounds() {
    return {
        clickSound: new Audio('/static/tick.ogg'),
        goldenSpawnSound: new Audio('/static/bell.ogg'),
        goldenClickSound: new Audio('/static/chaching.ogg'),
    };
}

export default new Vuex.Store({
    state: defaultSounds(),
    actions: {
        play(context, sound) {
            context.state[sound].play();
        }
    }
});
