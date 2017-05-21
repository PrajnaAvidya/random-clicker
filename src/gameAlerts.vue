<template>
    <v-row class="alerts">
        <v-col md8 offset-md2>
            <v-alert info dismissible v-for="alert in alerts" :key="alert" v-model="alert.show">
                {{ alert.name }}
            </v-alert>
        </v-col>
    </v-row>
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
                    { name: alert, show: true }
                );
            }
        },

        mounted() {
            let vm = this;
            Event.listen('addAlert', function (alert) {
                vm.addAlert(alert);
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