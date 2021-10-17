<template>
    <c-flex align="center" justify="center" direction="column" mt="1em">
        <c-input-group w="60%">
            <c-input placeholder="Search" v-model="searchInput"/>
            <c-input-right-addon p="0">
                <c-icon-button @click="search(searchInput)" variant-color="blue" aria-label="Search database" icon="arrow-forward" w="100%"/>
            </c-input-right-addon>
        </c-input-group>
                <c-flex align="center" justify="center" wrap="wrap">
            <ProductCard v-for="id of products" v-bind:key="id" :id="id"/>
        </c-flex>
    </c-flex>
    
</template>

<script>
    export default {
        data() {
            return {
                products: [],
                searchInput: ""
            }
        },
        async fetch() {
            let response = await this.$axios.$get('https://site202114.tw.cs.unibo.it/v1/products/');
            for(var product of response.results) {
                this.products.push(product.id);
            }
            console.log(this.products);
        },
        fetchOnServer: false,
        methods: {
            async search(input) {
                console.log(input)
                const params = new URLSearchParams();
                params.append('keywords', input);
                let response = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/products?keywords="Windsow"`, {keywords: "Windsor"});
                console.log(response);
            }
        }
    }
</script>