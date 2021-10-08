<template>
    <c-box w="40em" p="5" maxW="90vw">
        <c-heading>Add a product</c-heading>
        <c-form-control>
            <c-form-label for="name">Product name</c-form-label>
            <c-input id="name" v-model="name" placeholder="product name" />
        </c-form-control>
        <c-form-control>
            <c-form-label for="description">Product description</c-form-label>
            <c-input id="description" v-model="description" placeholder="product description" />
        </c-form-control>
        <c-form-control>
            <c-form-label for="cover">Cover image</c-form-label>
            <c-input id="cover" type="file" v-model="cover"/>
        </c-form-control>
        <c-form-control>
            <c-form-label for="images">Other images</c-form-label>
            <c-input id="images" type="file" v-model="images" multiple/>
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="addProduct">Aggiungi</c-button>
        </c-form-control>
    </c-box>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                description: '',
                cover: '',
                images: ''
            }
        },
        methods: {
            addProduct() {
                const product = {
                    name: this.name,
                    description: this.description,
                    cover: this.cover,
                    images: this.images
                }
                console.log(product);
            }
        }
    }
</script>