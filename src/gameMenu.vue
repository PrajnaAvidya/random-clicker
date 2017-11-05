<template>
    <v-layout class="game-menu">
        <v-btn default class="blue" @click.native="menu = true">Menu</v-btn>

        <v-dialog v-model="menu" fullscreen transition="dialog-bottom-transition" :overlay=false
        scrollable>
            <v-card>
                <v-toolbar style="flex: 0 0 auto;" class="primary">
                    <v-btn icon @click.native="menu = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Menu</v-toolbar-title>
                </v-toolbar>

                <v-tabs v-model="activeTab">
                    <v-tabs-bar class="blue">
                        <v-tabs-slider color="red"></v-tabs-slider>
                        <v-tabs-item href="#options">
                            <span class="tab-heading">Options</span>
                        </v-tabs-item>
                        <v-tabs-item href="#stats">
                            <span class="tab-heading">Statistics</span>
                        </v-tabs-item>
                        
                    </v-tabs-bar>

                    <v-tabs-items>
                        <v-tabs-content id="options">
                            <v-card-text>
                                <v-list three-line subheader>
                                    <v-subheader>Options</v-subheader>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="options" value="alerts"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Achievement Alerts</v-list-tile-title>
                                            <v-list-tile-sub-title>Show alerts when unlocking new achievements</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="options" value="sounds"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Sounds</v-list-tile-title>
                                            <v-list-tile-sub-title>Play game sounds?</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="options" value="particles"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Particle Effects</v-list-tile-title>
                                            <v-list-tile-sub-title>Show particle effects when clicking? (may slow performance)</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="options" value="animation"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Animation</v-list-tile-title>
                                            <v-list-tile-sub-title>Enable Cracker animation?</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </v-list>

                                <v-btn color="blue" @click.native="saveGame()">Save Game</v-btn>
                                <v-btn color="red" @click.native="hardReset()">Hard Reset</v-btn>
                            </v-card-text>
                        </v-tabs-content>

                        <v-tabs-content id="stats">
                            <v-card-text>
                                <v-list three-line subheader>
                                    <v-subheader>Statistics</v-subheader>

                                    <v-list-tile>
                                        Total Crackers earned: {{ getStat('totalCurrencyEarned') }}
                                    </v-list-tile>

                                    <v-list-tile>
                                        Total Crackers earned by clicking: {{ getStat('clicks') }}
                                    </v-list-tile>

                                    <v-list-tile>
                                        Total Crackers spent: {{ getStat('totalCurrencySpent') }}
                                    </v-list-tile>

                                    <v-list-tile>
                                        Upgrades purchased: {{ getStat('upgradeCount') }}
                                    </v-list-tile>

                                    <v-list-tile>
                                        Achievements unlocked: {{ getStat('achievementCount') }}
                                    </v-list-tile>
                                </v-list>
                            </v-card-text>
                        </v-tabs-content>
                    </v-tabs-items>
                </v-tabs>

                <div style="flex: 1 1 auto;"></div>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>
    import EventBus from './eventBus.js';
    import Options from './gameOptions.js';
    import Stats from "./gameStats.js";
    import Utils  from "./utils.js";

    export default {
        data() {
            return {
                menu: false,
                activeTab: null,
                options: [],
                stats: {},
                watchOptions: true,
            }
        },

        watch: {
            // update options when changed
            options: function(settings) {
                if (this.watchOptions) {
                    let optionsObject = {};
                    for (let setting in Options.state) {
                        optionsObject[setting] = settings.includes(setting);
                    }
                    Options.replaceState(optionsObject);
                }
            }
        },

        methods: {
            saveGame() {
                EventBus.$emit('saveGame');
            },
            hardReset() {
                EventBus.$emit('hardReset');
            },
            toggleMenu() {
                this.menu = !this.menu;
            },

            getStat(stat) {
                return this.stats[stat];
            },
            updateStats() {
                this.stats = {};
                for (let key in Stats.state) {
                    this.stats[key] = Utils.currency(Stats.state[key]);
                }
            },
            updateOptions() {
                this.watchOptions = false;
                this.options = [];
                for (let key in Options.state) {
                    if (Options.state[key] == true) {
                        this.options.push(key);
                    }
                }
                this.watchOptions = true;
            }
        },

        mounted() {
            // events
            let vm = this;
            EventBus.$on('toggleMenu', this.toggleMenu);
            EventBus.$on('updateOptions', function () {
                vm.updateOptions();
            });

            // update stats every few seconds
            setInterval(function () {
                this.updateStats();
            }.bind(this), 5000);
        }
    };
</script>

<style>
    .game-menu {
        margin-top: 30px;
    }
    .tab-heading {
        color: black;
    }
</style>
