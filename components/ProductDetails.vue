<template>
    <c-flex w="80%" direction="column">
        <div v-if="$fetchState.pending">fetching...</div>

        <!-- MAIN ARTICLE INFO SECTION -->
        <c-flex v-else direction="column" align="center" mt="1em">
            <c-heading>{{ this.product.name }}</c-heading>
            <client-only>
                <star-rating :border-width="0" :item-size="20" :spacing="20" :read-only="true" :rating="this.product.stars" :increment="0.01"></star-rating>
            </client-only>
            <c-text>{{this.product.description}}</c-text>
            <vueper-slides slide-image-inside style="width:100%;" fixed-height="10em" class="no-shadow"
                :visible-slides="3" slide-multiple :gap="3" :slide-ratio="1 / 4" :dragging-distance="200"
                :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                <vueper-slide v-for="(slide, i) in slides" :key="i" :image="slide.image" :title="slide.title"
                    :content="slide.content" />
            </vueper-slides>

            <!-- QUOTE SECTION -->
            <c-flex w="100%" justify="space-around" bg="#eee" p="1em">
                <v-date-picker v-model="range" :model-config="modelConfig" :masks="masks" @dayclick="onDayClick" is-range/>
                <c-flex direction="column" align="center">
                    <c-text>Start date: {{parseDate(this.range.start)}}</c-text>
                    <c-text>End date: {{parseDate(this.range.end)}}</c-text>
                    <c-button v-if="this.$store.state.userTokens == null" variant-color="blue" disabled>Not Authenticated</c-button>
                    <c-button v-else variant-color="blue" @click="getQuote">Get quote</c-button>
                    <c-text v-if="this.quotePrice == ''"></c-text>
                    <c-text fontSize="6xl" v-else as="b" mt="0.5em">{{this.quotePrice}}€</c-text>
                </c-flex>
            </c-flex>

            <!-- AVAILABILITES SECTION -->
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
                quotePrice: '',
                slides: [],
                availabilites: [],
                range: {
                    start: (new Date()).toISOString().split('T')[0],
                    end: (new Date()).toISOString().split('T')[0]
                },
                modelConfig: {
                    start: {
                        timeAdjust: '00:00:00',
                        type: 'string',
                        mask: 'YYYY-MM-DD'
                    },
                    end: {
                        timeAdjust: '23:59:59',
                        type: 'string',
                        mask: 'YYYY-MM-DD'
                    },
                },
                masks: {
                    input: 'YYYY-MM-DD'
                },
                options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
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
        fetchOnServer: false,
        methods:{
            parseDate(date){
                return (new Date(date)).toISOString().split('T')[0]
            },
            async getQuote() {
                var range = {
                    from: this.range.start,
                    to: this.range.end
                }
                let quote = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/products/${this.id}/quote`, {
                    params: range
                }).catch(err => {
                    console.log(err)
                });
                this.quotePrice = quote.price;
                console.log(quote)
            },
            onDayClick() {
                this.quotePrice = '';
            }
        }
    }

</script>

<style>
    .vueperslide__image {
        background-size: contain;
        background-repeat: no-repeat;
    }

</style>
