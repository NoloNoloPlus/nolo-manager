<template>
    <c-flex w="80%" direction="column">
        
        <div v-if="$fetchState.pending">fetching...</div>

        <c-flex v-else direction="column" align="center" mt="1em">
            <c-heading size="sm">{{this.rental.id}}</c-heading>
            <c-text>Status: {{(this.rental.closed) ? "closed" : "not closed"}}</c-text>
            <c-button v-if="!this.rental.closed" variant-color="orange" @click="closeRental">Close</c-button>

            <br>
            <c-box border-width="1px" p="3em" pt="1em">
                <c-heading size="lg" mb="1em">Rented by: {{this.rental.userName}}</c-heading>
                <c-box v-for="(product, id) of this.rental.products" v-bind:key="id">
                    <c-heading size="md" align="center" mb="1em">{{product.name}}</c-heading>
                    <c-text>product discounts: {{product.discounts}}</c-text>
                    <br>
                    <c-box v-for="(instance, i) of product.instances" v-bind:key="i">
                        <c-heading size="sm">{{instance.name}}</c-heading>
                        <c-text>instance discounts: {{instance.discounts}}</c-text>
                        <c-box v-for="(dateRange, i) of instance.dateRanges" v-bind:key="i">
                            <c-text>Date range {{i}}</c-text>
                            <c-text>from: {{dateRange.from}}</c-text>
                            <c-text>to: {{dateRange.to}}</c-text>
                            <c-text>date range discounts: {{dateRange.discounts}}</c-text>
                        </c-box>
                        <hr>
                        <br>
                    </c-box>
                    <br>
                </c-box>
            </c-box>

            <c-text>Discounts: {{this.rental.discounts}}</c-text>

            <c-text>Approved by: {{this.rental.approvedByName}}</c-text>
            
        </c-flex>
    </c-flex>
</template>

<script>

import config from '../config'

export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            rental: {}
        }
    },
    async fetch() {
        let response = await this.$axios.$get(config.apiPrefix + `/rentals/${this.id}`).catch(error => {
            console.log(error)
        })

        this.rental = response

        for (const productId of Object.keys(this.rental.products)) {
            const product = await this.$axios.$get(config.apiPrefix + `/products/${productId}`).catch(error => {
                console.log(error)
            })

            this.rental.products[productId].name = product.name
            
            for (const instanceId of Object.keys(this.rental.products[productId].instances)) {
                this.rental.products[productId].instances[instanceId].name = product.instances[instanceId].name
            }
        }

        const user = await this.$axios.$get(config.apiPrefix + `/users/${this.rental.userId}`).catch(error => {
            console.log(error)
        })

        this.rental.userName = user.firstName + ' ' + user.lastName

        const approver = await this.$axios.$get(config.apiPrefix + `/users/${this.rental.approvedBy}`).catch(error => {
            console.log(error)
        })

        this.rental.approvedByName = approver.firstName + ' ' + approver.lastName
    },
    fetchOnServer: false,
    methods: {
        async closeRental() {
            console.log("closing rental")
            let response = await this.$axios.$put(config.apiPrefix + `/rentals/${this.rental.id}/`, {
                closed: true
            }).catch(error => {
                console.log(error)
            })
        }
    }
}

</script>