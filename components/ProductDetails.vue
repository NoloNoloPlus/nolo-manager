<template>
    <c-flex w="80%" direction="column">
        <div v-if="$fetchState.pending">fetching...</div>
        <c-flex v-else direction="column" align="center" mt="5em">
            <vueper-slides slide-image-inside style="width:100%;" fixed-height="20em" class="no-shadow"
                :visible-slides="3" slide-multiple :gap="3" :slide-ratio="1 / 4" :dragging-distance="200"
                :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                <vueper-slide v-for="(slide, i) in slides" :key="i" :image="slide.image" :title="slide.title"
                    :content="slide.content" />
            </vueper-slides>
            <c-heading>{{ this.product.name }}</c-heading>
            <c-text>{{this.product.description}}</c-text>
            <client-only>
                <star-rating :border-width="0" :item-size="30" :spacing="10" :read-only="true" :rating="this.product.stars" :increment="0.01"></star-rating>
            </client-only>
            <c-divider h="1px"/>
            <c-heading>Availabilites</c-heading>
            <c-text v-for="aval of availabilites" v-bind:key="aval.id" border-width="1px" p="1em" w="50%">
                {{aval.id}}
                <c-text v-for="range of aval.ranges" v-bind:key="range.price.$numberDecimal*Math.random()">
                    <c-text>from: {{range.from}}</c-text>
                    <c-text>to: {{range.to}}</c-text>
                    <c-text>price: {{range.price.$numberDecimal}}</c-text>
                    <br>
                </c-text>
            </c-text>


            <c-text>Updated at {{this.product.updatedAt}}</c-text>
            <c-text>Created at {{this.product.createdAt}}</c-text>
            <v-date-picker v-model="date" mode="dateTime" :timezone="timezone" />

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
                slides: [],
                availabilites: [],
                date: new Date()
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
            let avails = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/products/${this.id}/`);
            for(const [key, value] of Object.entries(avails)){
                this.availabilites.push({
                    id: key,
                    ranges: value.availability
                })
            }
            console.log(this.availabilites)
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
