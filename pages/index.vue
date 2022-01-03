<template>
    <c-flex align="center" justify="center" direction="column">
        <c-heading>Revenue by user</c-heading>
        <BarChart :x="userRevenue.x" :y="userRevenue.y" :label="'Revenue by user'" :yPrecision="2"/>
        <br>
        <c-heading># of rentals by user</c-heading>
        <BarChart :x="userRentals.x" :y="userRentals.y" :label="'Rentals by user'"/>
        <br>
        <c-heading>Revenue by products</c-heading>
        <BarChart :x="productRevenue.x" :y="productRevenue.y" :label="'Revenue by product'" :yPrecision="2"/>
        <br>
        <c-heading># of rentals by product</c-heading>
        <BarChart :x="productRentals.x" :y="productRentals.y" :label="'Rentals by product'"/>
        <br>
        <c-heading># of instances per product</c-heading>
        <BarChart :x="productInstances.x" :y="productInstances.y" :label="'Instances per product'"/>
        <br>
        <c-heading>
            Revenue by instances of 
            <c-select v-model="selectedProductForInstanceRevenue" placeholder="Select Product">
                <option v-for="product in products" v-bind:key="product.id" :value="product.id">{{ product.name }}</option>
            </c-select>
        </c-heading>
        <BarChart :x="instanceRevenueForSelectedProduct.x" :y="instanceRevenueForSelectedProduct.y" :label="'Revenue by instance'" :yPrecision="2"/>
        <br>
        <c-heading>
            # of rentals by instances of 
            <c-select v-model="selectedProductForInstanceRentals" placeholder="Select Product">
                <option v-for="product in products" v-bind:key="product.id" :value="product.id">{{ product.name }}</option>
            </c-select>
        </c-heading>
        <BarChart :x="instanceRentalsForSelectedProduct.x" :y="instanceRentalsForSelectedProduct.y" :label="'Rentals by instance'"/>
    </c-flex>
</template>

<script>

import { instancePrice, productPrice, rentalPrice } from '../common/price'
import config from '../config'

export default {
    data() {
        return {
            rentals: [],
            products: {},
            errorMessage: '',
            userToName: {},
            selectedProductForInstanceRevenue: '',
            selectedProductForInstanceRentals: ''
        }
    },
    computed: {
        userRevenue: function () {
            const revenue = {}
            for (const rental of this.rentals) {
                const discountedPrice = rentalPrice(rental)
                const userId = rental.userId

                if (!revenue[userId]) {
                    revenue[userId] = 0
                }

                revenue[userId] += discountedPrice
            }

            const sortedUsers = Object.keys(revenue).sort((a, b) => revenue[b] - revenue[a])

            const sortedUserNames = sortedUsers.map(userId => this.userToName[userId] || userId)

            return { x: sortedUserNames, y: sortedUsers.map(userId => revenue[userId])}
        },
        userRentals: function () {
            const rentals = {}
            for (const rental of this.rentals) {
                const userId = rental.userId

                if (!rentals[userId]) {
                    rentals[userId] = 0
                }

                rentals[userId] += 1
            }

            const sortedUsers = Object.keys(rentals).sort((a, b) => rentals[b] - rentals[a])

            const sortedUserNames = sortedUsers.map(userId => this.userToName[userId] || userId)

            return { x: sortedUserNames, y: sortedUsers.map(userId => rentals[userId])}
        },
        productRevenue: function () {
            const revenue = {}
            for (const rental of this.rentals) {
                for (const [productId, product] of Object.entries(rental.products)) {
                    const discountedPrice = productPrice(product)
                    if (!revenue[productId]) {
                        revenue[productId] = 0
                    }

                    revenue[productId] += discountedPrice
                }
            }

            const sortedProducts = Object.keys(revenue).sort((a, b) => revenue[b] - revenue[a])

            const sortedProductNames = sortedProducts.map(productId => this.products[productId]?.name || productId)

            return { x: sortedProductNames, y: sortedProducts.map(productId => revenue[productId])}
        },
        productRentals: function () {
            const rentals = {}
            for (const rental of this.rentals) {
                for (const [productId, product] of Object.entries(rental.products)) {
                    if (!rentals[productId]) {
                        rentals[productId] = 0
                    }

                    rentals[productId] += 1
                }
            }

            const sortedProducts = Object.keys(rentals).sort((a, b) => rentals[b] - rentals[a])

            const sortedProductNames = sortedProducts.map(productId => this.products[productId]?.name || productId)

            return { x: sortedProductNames, y: sortedProducts.map(productId => rentals[productId])}
        },
        productInstances: function () {
            const count = {}
            for (const [productId, product] of Object.entries(this.products)) {
                if (!count[productId]) {
                    count[productId] = 0
                }

                count[productId] += Object.keys(product.instances).length
            }

            const sortedProducts = Object.keys(count).sort((a, b) => count[b] - count[a])

            const sortedProductNames = sortedProducts.map(productId => this.products[productId]?.name || productId)

            return { x: sortedProductNames, y: sortedProducts.map(productId => count[productId])}
        },
        instanceRevenueForSelectedProduct: function () {
            const revenue = {}

            for (const rental of this.rentals){
                if (rental.products[this.selectedProductForInstanceRevenue]) {
                    for (const [instanceId, instance] of Object.entries(rental.products[this.selectedProductForInstanceRevenue].instances)) {
                        const discountedPrice = instancePrice(instance)
                        if (!revenue[instanceId]) {
                            revenue[instanceId] = 0
                        }

                        revenue[instanceId] += discountedPrice
                    }
                }
            }

            const sortedInstances = Object.keys(revenue).sort((a, b) => revenue[b] - revenue[a])

            const sortedInstanceNames = sortedInstances.map(instanceId => this.products[this.selectedProductForInstanceRevenue].instances[instanceId].name || instanceId)

            return { x: sortedInstanceNames, y: sortedInstances.map(instanceId => revenue[instanceId])}
        },
        instanceRentalsForSelectedProduct: function () {
            const rentals = {}

            for (const rental of this.rentals){
                if (rental.products[this.selectedProductForInstanceRentals]) {
                    for (const [instanceId, instance] of Object.entries(rental.products[this.selectedProductForInstanceRentals].instances)) {
                        if (!rentals[instanceId]) {
                            rentals[instanceId] = 0
                        }

                        rentals[instanceId] += 1
                    }
                }
            }

            const sortedInstances = Object.keys(rentals).sort((a, b) => rentals[b] - rentals[a])

            const sortedInstanceNames = sortedInstances.map(instanceId => this.products[this.selectedProductForInstanceRentals].instances[instanceId].name || instanceId)

            return { x: sortedInstanceNames, y: sortedInstances.map(instanceId => rentals[instanceId])}
        }
    },
    head() {
        return {
            title: "Home"
        }
    },
    async fetch() {
        let response = await this.$axios.$get(config.apiPrefix + `/rentals`).catch(error => {
            console.log(error)
        })

        this.rentals = response.results
        console.log(this.rentals)

        response = await this.$axios.$get(config.apiPrefix + `/users`).catch(error => {
            console.log(error)
        })

        const newUserToName = {...this.userToName}
        
        for (const user of response.results) {
            newUserToName[user.id] = user.firstName + ' ' + user.lastName
        }

        this.userToName = newUserToName

        response = await this.$axios.$get(config.apiPrefix + '/products').catch(error => {
            console.log(error)
        })

        const newProducts = {}

        for (const product of response.results) {
            newProducts[product.id] = product
        }

        this.products = newProducts
        
    },
    methods: {
    }
}

</script>