<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em">
        <p v-if="$fetchState.pending">pending...</p>
        <div v-else>
            <c-heading size="xs">{{this.rental.id}}</c-heading>
            <c-box v-for="product of rental.products" v-bind:key="product.id">
                <c-text>Product discounts: {{product.discounts}}</c-text>
                <br>
                <c-box v-for="(instance, id) of product.instances" v-bind:key="id" border-width="1px">
                    <c-text>Instance {{id}}</c-text>
                    <c-box v-for="(dateRange, i) of instance.dateRanges" v-bind:key="i">
                        <c-text>from: {{dateRange.from}}</c-text>
                        <c-text>to: {{dateRange.to}}</c-text>
                        <c-text>price: {{dateRange.price}}</c-text>
                        <c-text>date range discounts: {{dateRange.discounts}}</c-text>
                        <br>
                    </c-box>
                    <c-text>Instance discounts: {{instance.discounts}}</c-text>
                </c-box>
            </c-box>
        </div>
    </c-box>
</template>

<script>
    import config from '../config'

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
            //console.log(response);
        },
        fetchOnServer: false

    }
</script>

<style>
</style>