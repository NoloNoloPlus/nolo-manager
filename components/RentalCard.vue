<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em" v-on:click.native="viewRental(rental.id)">
        <p v-if="$fetchState.pending">pending...</p>
        <div v-else>
            <c-tag size="sm" :variant-color="statusTagColor(this.rental.status)">{{this.rental.status}}</c-tag>
            <c-heading size="xs">{{this.rental.id}}</c-heading>
            <c-heading size="sm">{{this.rental.products[Object.keys(this.rental.products)[0]].name}}</c-heading>
            <c-text>by user: {{this.rental.userName}}</c-text>
            <c-text>{{this.rental.from}} - {{this.rental.to}}</c-text>
            <c-text>approved by: {{this.rental.approvedByName}}</c-text>
        </div>
    </c-box>
</template>

<script>
    import config from '../config'
    import { format } from 'date-format-parse'

    export default {
        props:{
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
            await this.$axios.$get(config.apiPrefix + `/rentals/${this.id}`)
                .then(response => {
                    this.rental = response
                })
                .catch(error => {
                    console.log(error)
                })
            
            let minFrom = null
            let maxTo = null
            
            for (const productId of Object.keys(this.rental.products)) {
                const product = await this.$axios.$get(config.apiPrefix + `/products/${productId}`).catch(error => {
                    console.log(error)
                })

                this.rental.products[productId].name = product.name
                
                for (const instanceId of Object.keys(this.rental.products[productId].instances)) {
                    this.rental.products[productId].instances[instanceId].name = product.instances[instanceId].name

                    for (const dateRange of this.rental.products[productId].instances[instanceId].dateRanges) {
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

            this.rental.from = format(minFrom, 'YYYY/MM/DD')
            this.rental.to = format(maxTo, 'YYYY/MM/DD')
            
            const user = await this.$axios.$get(config.apiPrefix + `/users/${this.rental.userId}`).catch(error => {
                console.log(error)
            })

            this.rental.userName = user.firstName + ' ' + user.lastName

            const approver = await this.$axios.$get(config.apiPrefix + `/users/${this.rental.approvedBy}`).catch(error => {
                console.log(error)
            })
            //console.log(response);
            this.rental.approvedByName = approver.firstName + ' ' + approver.lastName
        },
        fetchOnServer: false,
        methods: {
            viewRental(id) {
                this.$router.push({path: '/rentals/'+id})
            },
            statusTagColor(status) {
                switch (status) {
                    case 'ready':
                        return 'green'
                    case 'active':
                        return 'blue'
                    case 'closed':
                        return 'red'
                    default:
                        return 'primary'
                }
            }
        }

    }
</script>

<style>
</style>