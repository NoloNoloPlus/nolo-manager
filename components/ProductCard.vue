<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em" height="30em">
        <div v-if="$fetchState.pending">fetching...</div>
        <div v-else>
            <c-image width="100%" height="20em" objectFit="cover" :src="this.product.coverImage" :alt="this.product.name"></c-image>
            <c-heading as="h4" size="md">{{this.product.name}}</c-heading>
            <c-text as="i">{{this.product.description}}</c-text>
            <c-divider></c-divider>
            <c-text>Altre info boh</c-text>
        </div>
    </c-box>
</template>

<script>
export default {
    props:{
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            product: {
                coverImage: ''
            }
        }
    },
    async fetch() {
        let response = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/products/${this.id}`);
        this.product = response;
        console.log(this.product.coverImage)
    },
    fetchOnServer: false
}
</script>

