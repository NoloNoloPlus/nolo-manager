<template>
    <c-box>
        <c-flex align="center" justify="center" wrap="wrap">
            <RentalCard v-for="rental of rentals" v-bind:key="rental.id" :id="rental.id" v-on:click.native="viewRental(id)"/>
        </c-flex>
        <c-alert v-if="errorMessage" status="error">{{this.errorMessage}}</c-alert>
    </c-box>
</template>

<script>
    import config from "../../config"

    export default {
        data() {
            return {
                rentals: [],
                errorMessage: '',
            }
        },
        head() {
            return {
                title: "Rentals"
            }
        },
        async fetch() {
            let response;
            await this.$axios.$get(config.apiPrefix + `/rentals/`).then(resp => {
                response = resp;
                console.log(response);
                for(var rental of response.results) {
                    this.rentals.push(rental);
                }
            }).catch(error => {
                this.errorMessage = error.response.data.message;
                console.log(error)
            })
        },
        fetchOnServer: false,
        methods: {
            viewRental(id) {
                this.$router.push({path: '/rentals/'+id})
            }
        }
    }
</script>