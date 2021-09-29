<template>
    <c-box w="40em" p="5" maxW="90vw">
        <c-heading>Add a product</c-heading>
        <labeled-input label="Product name" v-model="product.name" />
        <labeled-input label="Product description" v-model="product.description" />
        <labeled-input label="Cover image" type="file" v-model="product.cover" />
        <labeled-input label="Other images" type="file" v-model="product.images" multiple/>
    </c-box>
</template>

<script>
    export default {
        data() {
            return {
                product: {
                    name: '',
                    description: '',
                    cover: '',
                    images: []
                }
            }
        }
    }
</script>