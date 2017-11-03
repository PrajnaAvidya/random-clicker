<template>
    <v-layout>
        <v-flex md8 offset-md2>
            <div class="alerts">
                <v-alert dismissible color="info" transition="scale-transition" v-for="(alert, alertIndex) in alerts" :key="alertIndex" v-model="alert.show">
                    <v-tooltip top>
                        <span slot="activator">{{ alert.name }}</span>
                        <span>{{ alert.description }}</span>
                    </v-tooltip>
                </v-alert>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        data() {
            return {
                showAlert: true,
                alerts: []
            }
        },

        computed: {
            // return alerts in reverse order (newest on top)
            reverseAlerts: function() {
                return this.alerts.reverse();
            },
        },

        methods: {
            addAlert(alert) {
                if (this.alerts.length >= 5) {
                    this.alerts.shift();
                }

                this.alerts.push(
                    { name: alert.name, description: alert.description, show: true }
                );
            },

            clearAlerts(alert) {
                this.alerts = [];
            }
        },

        mounted() {
            let vm = this;
            Event.listen('addAlert', function (alert) {
                vm.addAlert(alert);
            });
            Event.listen('clearAlerts', function () {
                vm.clearAlerts();
            });
        }
    };
</script>

<style>
    .alerts {
        margin-top: 30px;
        display: flex;
        flex-direction: column-reverse;
    }
    .alert {
        width: 100%;
    }
</style>
