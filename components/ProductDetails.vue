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
            <c-box w="100%" bg="#eee">
                <c-flex w="100%" justify="space-around" p="1em">
                    <v-date-picker v-model="range" :attributes="attrs" :model-config="modelConfig" :masks="masks" @dayclick="onDayClick" is-range/>
                    <c-flex direction="column" align="center">
                        <c-text>Start date: {{parseDate(this.range.start)}}</c-text>
                        <c-text>End date: {{parseDate(this.range.end)}}</c-text>
                        <c-button v-if="this.$store.state.userTokens == null" variant-color="blue" disabled>Not Authenticated</c-button>
                        <c-button v-else variant-color="blue" @click="getQuote">Get quote</c-button>
                        <c-text v-if="this.quotePrice == ''"></c-text>
                        <c-text fontSize="6xl" v-else as="b" mt="0.5em">{{this.quotePrice}}€</c-text>
                        <c-button v-if="this.$store.state.userTokens == null" variant-color="green" disabled>Not Authenticated</c-button>
                        <c-button v-else-if="this.quotePrice" variant-color="green" @click="createRental(quote)">Create rental</c-button>
                    </c-flex>
                </c-flex>
                <c-box v-if="this.quotePrice"></c-box>
                    <c-heading align="center">Breakdown</c-heading>
                    <c-box v-for="(instance, i) in this.instances" :key="i" mt="1em">
                        <c-box v-for="(dataRange, j) in instance.dateRanges" :key="j" mt="0.5em">
                            <c-heading size="sm">Instance: {{instance.name}}</c-heading>
                            <c-text>Status: {{instance.currentStatus}}</c-text>
                            <c-text>From: {{(new Date(dataRange.from)).toLocaleDateString()}}</c-text>
                            <c-text>To: {{(new Date(dataRange.to)).toLocaleDateString()}}</c-text>
                            <c-text>Price per day: {{dataRange.price.$numberDecimal}}€</c-text>
                            <c-box v-for="(discount, k) in dataRange.discounts" :key="k">
                                <c-text>Discount name: {{discount.name}}</c-text>
                                <c-text>Discount description: {{discount.description}}</c-text>
                                <c-text>Discount type: {{discount.type}}</c-text>
                                <c-text>Discount value: {{discount.value}}</c-text>
                            </c-box>
                        </c-box>
                    </c-box>
                </c-box>
            </c-box>
            

            <!-- INSTANCES SECTION -->
            <c-heading>Instances</c-heading>
            <c-box v-for="instance of this.instances" v-bind:key="instance.id" border-width="1px" p="1em" w="50%">
                <c-text>{{instance.name}}</c-text>
                <c-box v-for="(avail, index) of instance.availability" v-bind:key="index">
                    <c-text>availability:</c-text>
                    <c-text>from: {{avail.from}}</c-text>
                    <c-text>to: {{avail.to}}</c-text>
                    <c-text>price: {{avail.price.$numberDecimal}}</c-text>
                </c-box>
                
                <c-button variant-color="red" @click="removeInstance(avail.id)">Remove</c-button>
            </c-box>


            <c-text>Updated at {{this.product.updatedAt}}</c-text>
            <c-text>Created at {{this.product.createdAt}}</c-text>

            <c-form-control pt="1em">
                <c-button v-if="this.$store.state.userTokens == null" variant-color="red" disabled>Not Authenticated</c-button>
                <c-button v-else variant-color="red" @click="removeProduct()">Remove product</c-button>
            </c-form-control>

        </c-flex>
    </c-flex>
</template>

<script>
    import {
        VueperSlides,
        VueperSlide
    } from 'vueperslides';
    import 'vueperslides/dist/vueperslides.css'

    import { productPrice } from '../common/price'

    import config from '../config'

    import { format } from 'date-format-parse'

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
                quote: {},
                instances: [],
                slides: [],
                availabilites: [],
                range: {
                    start: (new Date()).toISOString().split('T')[0],
                    end: (new Date()).toISOString().split('T')[0]
                },
                attrs: [],
                colors: ['red', 'green', 'blue', 'yellow', 'purple'],
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
            let response = await this.$axios.$get(config.apiPrefix + `/products/${this.id}`);
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

            const newInstances = [];
            console.log('TESSST')
            console.log('Product: ', this.product)
            for (const [instanceId, instance] of Object.entries(this.product.instances)) {
                newInstances.push({...instance, id: instanceId});
            }

            this.instances = newInstances;
            console.log('aaa')
            console.log(this.instances)

            // non so perché rifaccio una get TODO sistemare
            let avails = await this.$axios.$get(config.apiPrefix + `/products/${this.id}/`);

            const nameToNumber = {}

            let i = 0
            for (const [instanceName, instance] of Object.entries(avails)) {
                nameToNumber[instanceName] = i
                i++
            }

            for(const [key, value] of Object.entries(avails)){
                this.availabilites.push({
                    id: key,
                    ranges: value.availability
                })

                const name = key;

                console.log(value.availability)

                console.log("debug")

                for(const range of value.availability){
                    console.log(range)
                    this.attrs.push({
                        key: name,
                        dot: this.colors[nameToNumber[name]],
                        dates: {
                            start: range.from,
                            end: range.to
                        },
                        popover: {
                            label: name
                        }
                    })
                }
            }

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
                let quote = await this.$axios.$get(config.apiPrefix + `/products/${this.id}/quote`, {
                    params: range
                }).catch(err => {
                    console.log(err)
                });
                this.quote = quote;
                this.quotePrice = productPrice(quote);
                console.log(quote)
            },
            onDayClick() {
                this.quotePrice = '';
            },
            async removeProduct() {
                let response = await this.$axios.$delete(config.apiPrefix + `/products/${this.id}`).catch(err => {
                    console.log(err)
                });
                console.log(response)
                this.$router.push('/products')
            },
            async removeInstance(id) {
                let response = await this.$axios.$put(config.apiPrefix + `/products/${this.id}`, {
                    action: 'remove'
                }).catch(err => {
                    console.log(err)
                });
            },
            async createRental(quote) {
                const formattedInstances = {};

                for (const [instanceId, instance] of Object.entries(quote.instances)) {
                    formattedInstances[instanceId] = {
                        dateRanges: []
                    }
                    for (let i = 0; i < instance.dateRanges.length; i++) {
                        formattedInstances[instanceId].dateRanges.push({
                            from: format(instance.dateRanges[i].from, 'YYYY-MM-DD'),
                            to: format(instance.dateRanges[i].to, 'YYYY-MM-DD')
                        })
                    }
                }

                const body = {
                    products: {
                        [this.id]: {
                            instances: formattedInstances
                        }
                    },
                    userId: '61c46bc7067f2850986310d5', // Guglielmo Baudo, TODO: let the manager choose
                    approvedBy: localStorage.getItem('userId')
                }

                let response = await this.$axios.$post(config.apiPrefix + '/rentals/', body)
                console.log(response)
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
