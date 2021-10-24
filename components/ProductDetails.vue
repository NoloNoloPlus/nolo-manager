<template>
    <c-flex w="80%" direction="column">
        <div v-if="$fetchState.pending">fetching...</div>
        <c-flex v-else direction="column" align="center">
            <c-heading>{{ this.product.name }}</c-heading>
            <c-text>{{this.product.description}}</c-text>
            <vueper-slides slide-image-inside style="width:100%;" fixed-height="20em" class="no-shadow"
                :visible-slides="3" slide-multiple :gap="3" :slide-ratio="1 / 4" :dragging-distance="200"
                :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                <vueper-slide v-for="(slide, i) in slides" :key="i" :image="slide.image" :title="slide.title"
                    :content="slide.content" />
            </vueper-slides>
            <client-only>
                <star-rating :border-width="0" :item-size="30" :spacing="10" :read-only="true" :rating="this.product.stars" :increment="0.01"></star-rating>
            </client-only>
            <c-text>Updated at {{this.product.updatedAt}}</c-text>
            <c-text>Created at {{this.product.createdAt}}</c-text>

        </c-flex>
    </c-flex>
</template>

<script>
    import {
        VueperSlides,
        VueperSlide
    } from 'vueperslides';
    import 'vueperslides/dist/vueperslides.css'

    export default {
        components: {
            VueperSlides,
            VueperSlide
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                product: {
                    coverImage: ''
                },
                slides: []
            }
        },
        async fetch() {
            let response = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/products/${this.id}`);
            this.product = response;
            this.slides.push({
                title: '',
                content: '',
                image: this.product.coverImage
            })
            for (var image of this.product.otherImages) {
                //console.log(image)
                this.slides.push({
                    title: '',
                    content: '',
                    image: image
                })
            }
            console.log(response);
        },
        fetchOnServer: false
    }

</script>

<style>
    .vueperslide__image {
        background-size: contain;
        background-repeat: no-repeat;
    }

</style>
