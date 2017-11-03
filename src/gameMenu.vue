<template>
    <v-layout class="game-menu">
        <v-btn default class="blue" @click.native="menu = true">Menu</v-btn>

        <v-dialog v-model="menu" fullscreen transition="dialog-bottom-transition" :overlay=false
        scrollable>
            <v-card>
                <v-toolbar style="flex: 0 0 auto;" dark class="primary">
                    <v-btn icon @click.native="menu = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Menu</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-list three-line subheader>
                        <v-subheader>Options</v-subheader>

                        <v-list-tile avatar>
                            <v-list-tile-action>
                                <v-checkbox v-model="alerts"></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Achievement Alerts</v-list-tile-title>
                                <v-list-tile-sub-title>Show alerts when unlocking new achievements</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile avatar>
                            <v-list-tile-action>
                                <v-checkbox v-model="sounds"></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Sounds</v-list-tile-title>
                                <v-list-tile-sub-title>Play game sounds?</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-btn color="blue" @click.native="saveGame()">Save Game</v-btn>
                    <v-btn color="red" @click.native="hardReset()">Hard Reset</v-btn>
                </v-card-text>

                <div style="flex: 1 1 auto;"></div>
            </v-card>
        </v-dialog>

    </v-layout>
</template>

<script>
    import EventBus from './eventBus.js';
    import Options from './options.js';

    export default {
        data() {
            return {
                menu: false,
                options: Options,
            }
        },

        computed: {
            alerts: {
                get: function() {
                    return this.getOption("alerts");
                },
                set: function(setting) {
                    this.setOption("alerts", setting);
                }
            },
            sounds: {
                get: function() {
                    return this.getOption("sounds");
                },
                set: function(setting) {
                    this.setOption("sounds", setting);
                }
            }
        },

        methods: {
            getOption(option) {
                return this.options[option];
            },
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

            // open/close menu
            EventBus.$on('toggleMenu', this.toggleMenu);

            // recieve options from game
            EventBus.$on('sendOptions', function (options) {
                for (let key in options) {
                    vm.options[key] = options[key];
                }
            });
        }
    };
</script>

<style>
    .game-menu {
        margin-top: 30px;
    }
</style>
