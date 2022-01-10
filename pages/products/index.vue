<template>
    <c-flex align="center" justify="center" direction="column" mt="1em">
        <c-input-group w="60%">
            <c-input placeholder="Search" v-model="searchInput"/>
            <c-input-right-addon p="0">
                <c-icon-button @click="search(searchInput)" variant-color="blue" aria-label="Search database" icon="arrow-forward" w="100%"/>
            </c-input-right-addon>
        </c-input-group>
        <c-flex>
            <c-stat border-width="1px" p="1em" m="1em" w="16em">
                <c-stat-label><c-stat-arrow type="increase" />Average profit per product</c-stat-label>
                <c-stat-number>{{formattedAverageProfit}}</c-stat-number>
                <c-stat-helper-text>nothing to see</c-stat-helper-text>
            </c-stat>
            <c-stat border-width="1px" p="1em" m="1em" w="16em">
                <c-stat-label><c-stat-arrow type="increase" />Total profit</c-stat-label>
                <c-stat-number>{{formattedTotalProfit}}</c-stat-number>
                <c-stat-helper-text>nothing to see</c-stat-helper-text>
            </c-stat>
        </c-flex>


        <c-flex align="center" justify="center" wrap="wrap">
            <ProductCard v-for="id of products" v-bind:key="id" :id="id"/>
        </c-flex>
    </c-flex>
</template>

<script>

    import config from '../../config.js'

    import { rentalPrice, formatPrice } from '../../common/price.js'

    export default {
        data() {
            return {
                products: [],
                searchInput: "",
                rentals: [],
                totalProfit: 0,
                averageProfit: 0
            }
        },
        watch: {
            rentals: function() {
                this.totalProfit = this.rentals.reduce((acc, rental) => acc + rentalPrice(rental, true), 0) || "loading..."
                this.averageProfit = this.totalProfit / this.rentals.length || "loading..."
            }
        },
        computed: {
            formattedTotalProfit() {
                return formatPrice(this.totalProfit);
            },
            formattedAverageProfit() {
                console.log("length", this.products.length)
                console.log("total profit", this.totalProfit)
                return formatPrice(this.totalProfit / this.products.length)
            }
        },
        async fetch() {
            let response = await this.$axios.$get(config.apiPrefix + '/products/');
            for(var product of response.results) {
                this.products.push(product.id);
            }
            console.log(this.products);

            this.rentals = (await this.$axios.$get(config.apiPrefix + '/rentals/')).results;
        },
        fetchOnServer: false,
        methods: {
            async search(input) {
                console.log(input)
                const params = new URLSearchParams();
                params.append('keywords', input);
                let response = await this.$axios.$get(config.apiPrefix + `/products?keywords=${encodeURI(input)}`);
                if(response.results.length > 0) {
                    this.products = [];
                    for(var product of response.results) {
                        this.products.push(product.id);
                    }
                }
                console.log(response);
            }
        }
    }
</script>