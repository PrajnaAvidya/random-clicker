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
                                            <v-checkbox v-model="optionSettings" value="alerts"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Achievement Alerts</v-list-tile-title>
                                            <v-list-tile-sub-title>Show alerts when unlocking new achievements</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="optionSettings" value="sounds"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Sounds</v-list-tile-title>
                                            <v-list-tile-sub-title>Play game sounds?</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="optionSettings" value="particles"></v-checkbox>
                                        </v-list-tile-action>
                                        <v-list-tile-content>
                                            <v-list-tile-title>Particle Effects</v-list-tile-title>
                                            <v-list-tile-sub-title>Show particle effects when clicking? (may slow performance)</v-list-tile-sub-title>
                                        </v-list-tile-content>
                                    </v-list-tile>

                                    <v-list-tile>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="optionSettings" value="animation"></v-checkbox>
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
                    </v-tabs-items>
                </v-tabs>

                <div style="flex: 1 1 auto;"></div>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>
    import EventBus from './eventBus.js';
    import Options from './options.js';
    import Stats from "./gameStats.js";

    export default {
        data() {
            return {
                menu: false,
                activeTab: null,
                options: Options,
                optionSettings: [],
                allSettings: [],
            }
        },

        watch: {
            // update options when changed
            optionSettings: function(settings) {
                let vm = this;
                this.allSettings.forEach(function (setting) {
                    vm.setOption(setting, settings.includes(setting));
                });
            }
        },

        methods: {
            setOption(option, value) {
                this.options[option] = value;
                EventBus.$emit('setOption', option, value);
            },
            saveGame() {
                EventBus.$emit('saveGame');
            },
            hardReset() {
                EventBus.$emit('hardReset');
            },
            toggleMenu() {
                this.menu = !this.menu;
            }
        },

        mounted() {
            // add event listeners
            let vm = this;

            // get all setting keys from Options object
            for (let key in Options) {
                this.allSettings.push(key);
            }

            // open/close menu
            EventBus.$on('toggleMenu', this.toggleMenu);

            // recieve options from game
            EventBus.$on('sendOptions', function (options) {
                this.optionSettings = [];
                for (let key in options) {
                    vm.options[key] = options[key];
                    if (options[key] == true) {
                        vm.optionSettings.push(key);
                    }
                }
            });
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
