<template>
    <c-flex w="80%" direction="column">
        
        <div v-if="$fetchState.pending">fetching...</div>

        <c-flex v-else direction="column" align="center" mt="1em">
            <c-heading size="sm">{{this.rental.id}}</c-heading>
            <c-text>Status: {{this.rental.status}}</c-text>
            <c-button v-if="this.rental.status != 'closed'" variant-color="orange" @click="closeRental">Close</c-button>

            <br>
            <c-box border-width="1px" p="3em" pt="1em" w="30em">
                <c-heading size="lg" mb="1em">Rented by: {{this.rental.userName}}</c-heading>
                <c-stat border-width="1px" p="1em">
                    <c-stat-label><c-stat-arrow type="increase" />Profit</c-stat-label>
                    <c-stat-number>{{formattedRentalPrice}}</c-stat-number>
                    <c-stat-helper-text>{{rentalDateRange}}</c-stat-helper-text>
                </c-stat>
                <c-box v-for="(product, id) of this.rental.products" v-bind:key="id">
                    <c-heading size="md" align="center" mb="1em" mt="1em">{{product.name}}</c-heading>
                    <c-heading size="md" mb="1em">Product discounts:</c-heading>
                    <c-box v-for="(discount, id) of product.discounts" v-bind:key="id" mb="1em" border-width="1px" p="1em">
                        <c-heading size="md">- {{discount.name}}</c-heading>
                        <c-heading size="sm">{{discount.description}}</c-heading>
                        <c-text>Value: {{discount.value}}</c-text>
                        <c-text>Type: {{discount.type}}</c-text>
                    </c-box>
                    <br>
                    <c-box v-for="(instance, i) of product.instances" v-bind:key="i">
                        <c-heading size="sm">{{instance.name}}</c-heading>
                        <c-heading size="md">Instance discounts</c-heading>
                        <c-box v-for="(discount, id) of instance.discounts" v-bind:key="id" mb="1em" border-width="1px" p="1em">
                            <c-heading size="md">- {{discount.name}}</c-heading>
                            <c-heading size="sm">{{discount.description}}</c-heading>
                            <c-text>Value: {{discount.value}}</c-text>
                            <c-text>Type: {{discount.type}}</c-text>
                        </c-box>
                        <c-box v-for="(dateRange, i) of instance.dateRanges" v-bind:key="i">
                            <c-text>- Date range {{i}}</c-text>
                            <c-text>from: {{dateRange.from}}</c-text>
                            <c-text>to: {{dateRange.to}}</c-text>
                            <c-heading size="md">Date range discounts</c-heading>
                            <c-box v-for="(discount, id) of dateRange.discounts" v-bind:key="id" mb="1em" border-width="1px" p="1em">
                                <c-heading size="md">- {{discount.name}}</c-heading>
                                <c-heading size="sm">{{discount.description}}</c-heading>
                                <c-text>Value: {{discount.value}}</c-text>
                                <c-text>Type: {{discount.type}}</c-text>
                            </c-box>
                        </c-box>
                        <hr>
                        <br>
                    </c-box>
                    <br>
                </c-box>
            </c-box>

            <c-text v-if="this.rental.discounts.length > 0">Discounts: {{this.rental.discounts}}</c-text>

            <c-text>Approved by: {{this.rental.approvedByName}}</c-text>
            <c-button v-if="this.rental.approvedByName == '-'" variant-color="green" @click="approveRental">Approve</c-button>
            
        </c-flex>
    </c-flex>
</template>

<script>

import config from '../config'
import { rentalPrice, formatPrice } from '../common/price'
import { format } from 'date-format-parse'

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
    computed: {
        rentalPrice: function() {
            return rentalPrice(this.rental)
        },
        rentalDateRange: function() {
            let minFrom = null
            let maxTo = null

            for (const productId of Object.keys(this.rental.products)) {
                const product = this.rental.products[productId]

                for (const instanceId of Object.keys(product.instances)) {
                    const instance = product.instances[instanceId]

                    for (const dateRange of instance.dateRanges) {
                        const from = new Date(dateRange.from)
                        const to = new Date(dateRange.to)

                        if (minFrom === null || from < minFrom) {
                            minFrom = from
                        }

                        if (maxTo === null || to > maxTo) {
                            maxTo = to
                        }
                    }
                }
            }

            return `${format(minFrom, 'DD MMM YYYY')} - ${format(maxTo, 'DD MMM YYYY')}`
        },
        formattedRentalPrice: function() {
            return formatPrice(this.rentalPrice)
        }
    },
    async fetch() {
        let response = await this.$axios.$get(config.apiPrefix + `/rentals/${this.id}`).catch(error => {
            console.log(error)
        })

        this.rental = response
        console.log("Rental:", this.rental)

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

        let approver;

        if(this.rental.approvedBy) {
            approver = await this.$axios.$get(config.apiPrefix + `/users/${this.rental.approvedBy}`).catch(error => {
            console.log(error)
        })
        }
        
        if(approver) {
            this.rental.approvedByName = approver.firstName + ' ' + approver.lastName
        } else {
            this.rental.approvedByName = '-'
        }
    },
    fetchOnServer: false,
    methods: {
        async closeRental() {
            console.log("closing rental")
            let response = await this.$axios.$post(config.apiPrefix + `/rentals/${this.rental.id}/close`).catch(error => {
                console.log(error)
            })
            this.$nuxt.refresh();
        },
        async approveRental() {
            console.log("approving rental")
            let response = await this.$axios.$put(config.apiPrefix + `/rentals/${this.rental.id}`, {
                approvedBy: localStorage.getItem('userId')
            }).catch(error => {
                console.log(error)
            })
            this.$nuxt.refresh();
        }
    }
}

</script>