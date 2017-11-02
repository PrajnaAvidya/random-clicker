<template>
    <v-layout class="alerts">
        <v-flex md8 offset-md2>
            <v-alert dismissible color="info" value="true" v-for="(alert, alertIndex) in reverseAlerts" :key="alertIndex" v-model="alert.show">
                <v-tooltip top>
                    <span slot="activator">{{ alert.name }}</span>
                    <span>{{ alert.description }}</span>
                </v-tooltip>
            </v-alert>
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
            })
            Event.listen('clearAlerts', function () {
                vm.clearAlerts();
            })
        }
    }

</script>

<style>
    .alerts {
        margin-top: 30px;
        flex-direction: column;
    }
</style>