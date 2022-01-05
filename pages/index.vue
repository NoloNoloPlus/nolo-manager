<template>

    <c-flex align="center" justify="center" direction="column">
        <c-tabs is-fitted>
    <c-tab-list>
      <c-tab>Users stats</c-tab>
      <c-tab>Products stats</c-tab>
      <c-tab>Rentals stats</c-tab>
      <c-tab>Employees stats</c-tab>
    </c-tab-list>
        
    <c-tab-panels>
      <c-tab-panel w="70vw">
          <c-flex align="center" direction="column">
            <c-heading>Revenue by user</c-heading>
            <c-flex justify="center">
                <BarChart :x="userRevenue.x" :y="userRevenue.y" :label="'Revenue by user'" :yPrecision="2"/>
                <DoughnutChart :x="userRevenue.x" :y="userRevenue.y" :label="'Revenue by user'" :yPrecision="2"/>
            </c-flex>
            
            <br>
            <c-heading># of rentals by user</c-heading>
            <c-flex justify="center">
                <BarChart :x="userRentals.x" :y="userRentals.y" :label="'Rentals by user'"/>
                <DoughnutChart :x="userRentals.x" :y="userRentals.y" :label="'Rentals by user'"/>
            </c-flex>
            
            <br>
          </c-flex>
      </c-tab-panel>
      <c-tab-panel w="70vw">
        <c-flex align="center" direction="column">
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
            <br>
            <c-heading>
                Instance status per product
                <c-select v-model="selectedProductForInstanceStatus" placeholder="Select Product">
                    <option v-for="product in products" v-bind:key="product.id" :value="product.id">{{ product.name }}</option>
                </c-select>
            </c-heading>
            <BarChart :x="instanceStatusForSelectedProduct.x" :y="instanceStatusForSelectedProduct.y" :label="'Instance status'"/>
        </c-flex>
      </c-tab-panel>
      <c-tab-panel w="70vw">
        <c-flex align="center" direction="column">
            <c-heading>Revenue by rentals</c-heading>
            <BarChart :x="rentalRevenue.x" :y="rentalRevenue.y" :label="'Revenue by rental'" :yPrecision="2"/>
            <br>
            <c-heading>Active rentals by date</c-heading>
            <LineChart :x="activeRentalsByDay.x" :y="activeRentalsByDay.y" :label="'Active rentals by date'" :yPrecision="2" nDays="100"/>
            <br>
        </c-flex>
      </c-tab-panel>
      <c-tab-panel>
        <c-flex align="center" direction="column">
            <c-heading>Revenue by employee</c-heading>
            <BarChart :x="rentalRevenueByApprover.x" :y="rentalRevenueByApprover.y" :label="'Revenue by employee'" :yPrecision="2"/> 
            <br>
        </c-flex>
      </c-tab-panel>
    </c-tab-panels>
  </c-tabs>
    </c-flex>
</template>

<script>

import { instancePrice, productPrice, rentalPrice } from '../common/price'
import config from '../config'
import { format } from 'date-format-parse'

export default {
    data() {
        return {
            rentals: [],
            products: {},
            errorMessage: '',
            userToName: {},
            selectedProductForInstanceRevenue: '',
            selectedProductForInstanceRentals: '',
            selectedProductForInstanceStatus: ''
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
        },
        rentalRevenue: function () {
            const revenue = {}
            for (const rental of this.rentals) {
                const discountedPrice = rentalPrice(rental)
                if (!revenue[rental.id]) {
                    revenue[rental.id] = 0
                }

                revenue[rental.id] += discountedPrice
            }

            const sortedRentals = Object.keys(revenue).sort((a, b) => revenue[b] - revenue[a])

            return { x: sortedRentals, y: sortedRentals.map(rentalId => revenue[rentalId])}
        },
        instanceStatusForSelectedProduct: function () {
            const status = {}

            for (const productId of Object.keys(this.products)) {
                if (productId === this.selectedProductForInstanceStatus) {
                    for (const [instanceId, instance] of Object.entries(this.products[productId].instances)) {
                        if (!status[instance.currentStatus]) {
                            status[instance.currentStatus] = 0
                        }

                        status[instance.currentStatus] += 1
                    }
                    break;
                }
            }

            const sortedStatuses = Object.keys(status).sort((a, b) => status[b] - status[a])

            return { x: sortedStatuses, y: sortedStatuses.map(statusId => status[statusId])}
        },
        rentalRevenueByApprover: function() {
            const revenue = {}
            for (const rental of this.rentals) {
                const discountedPrice = rentalPrice(rental)
                if (!revenue[rental.approvedBy]) {
                    revenue[rental.approvedBy] = 0
                }

                revenue[rental.approvedBy] += discountedPrice
            }

            const sortedRentals = Object.keys(revenue).sort((a, b) => revenue[b] - revenue[a])

            return { x: sortedRentals, y: sortedRentals.map(approvedBy => revenue[approvedBy])}
            
        },
        activeRentalsByDay: function () {
            const activeRentals = {}

            for (const rental of this.rentals) {
                const { from, to } = this.rentalExtrema(rental)
                console.log('from:', from, 'to:', to);

                for (let date = from; date <= to; date.setDate(date.getDate() + 1)) {
                    const dateString = format(date, 'YYYY-MM-DD')
                    if (!activeRentals[dateString]) {
                        activeRentals[dateString] = 0
                    }

                    activeRentals[dateString] += 1
                }
            }
            
            const dates = Object.keys(activeRentals).sort((a, b) => new Date(a) - new Date(b))
            const rentals = dates.map(date => activeRentals[date])

            return { x: dates, y: rentals }
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
        rentalExtrema: function(rental) {
            let from = null;
            let to = null;
            for (const product of Object.values(rental.products)) {
                for (const instance of Object.values(product.instances)) {
                    for (const dateRange of instance.dateRanges) {
                        console.log('DateRange:', dateRange);
                        if (from === null || dateRange.from < from) {
                            from = new Date(dateRange.from)
                        }
                        if (to === null || dateRange.to > to) {
                            to = new Date(dateRange.to)
                        }
                    }
                }
            }
            return { from, to }
        },
    }
}

</script>