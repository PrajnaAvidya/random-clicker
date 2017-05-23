<template>
    <v-layout class="alerts">
        <v-flex md8 offset-md2>
            <v-alert info dismissible v-for="alert in alerts" :key="alert" v-model="alert.show">
                <span v-tooltip:top="{ html: alert.description }">
                    {{ alert.name }}
                </span>
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

    .alert {
        height: 12px !important;
    }

    .alert__dismissible {
        align-self: center;
    }
</style>