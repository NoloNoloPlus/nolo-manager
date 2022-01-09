<template>
    
    <c-flex w="80%" direction="column">
        
        <div v-if="$fetchState.pending">fetching...</div>

        <c-flex v-else direction="column" align="center" mt="1em">
            <c-heading>{{ this.product.name }}</c-heading>
            <c-text>{{this.product.description}}</c-text>
            <vueper-slides slide-image-inside style="width:100%;" fixed-height="10em" class="no-shadow"
                :visible-slides="3" slide-multiple :gap="3" :slide-ratio="1 / 4" :dragging-distance="200"
                :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                <vueper-slide v-for="(slide, i) in slides" :key="i" :image="slide.image" :title="slide.title"
                    :content="slide.content" />
            </vueper-slides>

            <c-box w="100%" bg="#eee">
                <c-flex w="100%" justify="space-around" p="1em">
                    <v-date-picker id="picker" v-model="range" :attributes="attrs" :model-config="modelConfig" :masks="masks" @dayclick="onDayClick" is-range/>
                    <c-flex direction="column" align="center">
                        <c-text>Start date: {{parseDate(this.range.start)}}</c-text>
                        <c-text>End date: {{parseDate(this.range.end)}}</c-text>
                        <c-button v-if="this.$store.state.userTokens == null" variant-color="blue" disabled>Not Authenticated</c-button>
                        <c-button v-else variant-color="blue" @click="getQuote">Get quote</c-button>
                        <c-text v-if="this.quotePrice == ''"></c-text>
                        <c-text fontSize="6xl" v-else as="b" mt="0.5em">{{this.quotePrice}}€</c-text>
                        <c-button v-if="this.$store.state.userTokens == null" variant-color="green" disabled>Not Authenticated</c-button>
                        <c-box v-else-if="this.quotePrice">
                            <c-form-control w="100%">
                                <c-form-label for="clientEmail">Client email</c-form-label>
                                <c-input id="clientEmail" type="text" v-model="clientEmail" />
                            </c-form-control>
                            <c-button variant-color="green" @click="createRental(quote)">Create rental</c-button>
                        </c-box>
                        
                    </c-flex>
                </c-flex>
                
                <c-box v-if="this.quotePrice">
                    <c-heading align="center">Breakdown</c-heading>
                    <c-box v-for="instance of this.quote.instances" v-bind:key="instance.id" p="1em">
                        <c-heading as="h1" size="lg">- {{instance.name}}</c-heading>
                        <c-text>Status: {{instance.currentStatus}}</c-text>
                        <c-heading as="h3" size="md">Discounts:</c-heading>
                        <c-text v-for="discount in instance.discounts" v-bind:key="discount">{{discount}}</c-text>
                        <c-text v-if="instance.discounts.length == 0">No discounts</c-text>
                        <c-box v-for="(dateRange, i) of instance.dateRanges" v-bind:key="i">
                            <c-heading as="h3" size="md" mt="1em">Period {{i}}</c-heading>
                            <c-text>from: {{dateRange.from}}</c-text>
                            <c-text>to: {{dateRange.to}}</c-text>
                            <c-text>price: {{dateRange.price}}€</c-text>
                            <c-heading as="h4" size="sm" mt="0.5em">Period discounts: </c-heading>
                            <c-box v-for="discount in dateRange.discounts" v-bind:key="discount">
                                <c-text>{{discount.name}}</c-text>
                                <c-text fontSize="xs">{{discount.description}}</c-text>
                                <c-text>Value: {{discount.value}}</c-text>
                                <c-text>Type: {{discount.type}}</c-text>
                            </c-box>
                            <c-text v-if="dateRange.discounts.length == 0">No discounts</c-text>
                        </c-box>
                    </c-box>
                </c-box>
                
            </c-box>
            
            
            <c-heading>Instances</c-heading>
            <c-box v-for="instance of this.instances" v-bind:key="instance.id" border-width="1px" p="1em" w="100%">
                <c-heading size="md">{{instance.name || "no name"}}
                    <c-tag v-if="instance.currentStatus == 'new'" variant-color="vue" size="sm">
                         {{instance.currentStatus}}
                    </c-tag>
                    <c-tag v-else-if="instance.currentStatus == 'worn'" variant-color="yellow" size="sm">
                        {{instance.currentStatus}}
                    </c-tag>
                    <c-tag v-else-if="instance.currentStatus == 'broken'" variant-color="red" size="sm">
                        {{instance.currentStatus}}
                    </c-tag>
                    <c-tag v-else-if="instance.currentStatus == 'repairing'" variant-color="orange" size="sm">
                        {{instance.currentStatus}}
                    </c-tag>
                    <c-tag v-else-if="instance.currentStatus == 'obliterated'" variant-color="indigo" size="sm">
                        {{instance.currentStatus}}
                    </c-tag>
                </c-heading>
                
                <c-box v-for="(avail, index) of instance.availability" v-bind:key="index">
                    <br>
                    <c-heading size="sm">Period {{index}}</c-heading>
                    <c-text>from: {{avail.from}}</c-text>
                    <c-text>to: {{avail.to}}</c-text>
                    <c-text>price: {{avail.price}}</c-text>
                </c-box>
                <br>
                <c-button variant-color="orange" @click="openInstanceModal(instance.id)">Edit</c-button>
                <c-button variant-color="red" @click="removeInstance(instance.id)">Remove</c-button>
            
                <c-modal :is-open="isModalOpen && instance && modalId == instance.id" :on-close="() => {isModalOpen = false}">
                    
                    <c-modal-content ref="content">
                        <c-modal-header>Editing instance {{instance.id}}</c-modal-header>
                        <c-modal-close-button />
                        <c-modal-body>
                            <c-form-control w="100%">
                                <c-form-label for="name">Instance name</c-form-label>
                                <c-input id="instanceName" type="text" v-model="instanceName" />
                            </c-form-control>
                            <br>

                            <c-form-control w="100%">
                                <c-form-label for="name">Current status/condition</c-form-label>
                                <c-select v-model="instanceStatus" placeholder="Select status/condition">
                                    <option value="new">New</option>
                                    <option value="worn">Worn</option>
                                    <option value="broken">Broken</option>
                                    <option value="repairing">Repairing</option>
                                    <option value="obliterated">Obliterated</option>
                                </c-select>
                            </c-form-control>
                            <br>
                            
                            <c-form-control w="100%">
                                <c-form-label>Instance period</c-form-label>
                                <c-select v-model="availNumber" placeholder="Select period">
                                    <option v-for="(avail, i) of instance.availability" :value="i" v-bind:key="i">Period {{i}}</option>
                                </c-select>
                            </c-form-control>
                            
                            <c-form-control w="100%">
                                <c-input-group>
                                    <c-input-left-addon w="5em">From</c-input-left-addon>
                                    <c-input id="instanceAvailFrom" type="text" v-model="instanceAvailFrom" />
                                </c-input-group>
                            </c-form-control>
                            <c-form-control w="100%">
                                <c-input-group>
                                    <c-input-left-addon w="5em">To</c-input-left-addon>
                                    <c-input id="instanceAvailTo" type="text" v-model="instanceAvailTo" />
                                </c-input-group>
                            </c-form-control>
                            <c-form-control w="100%">
                                <c-input-group>
                                    <c-input-left-addon w="5em">Price</c-input-left-addon>
                                    <c-input id="instanceAvailPrice" type="text" v-model="instanceAvailPrice" />
                                </c-input-group>
                            </c-form-control>
                            
                        </c-modal-body>
                        <c-modal-footer>
                        <c-button variant-color="blue" mr="3" @click="editInstance(instance.id)">
                            Save
                        </c-button>
                        <c-button @click="() => {isModalOpen = false}">Cancel</c-button>
                        </c-modal-footer>
                    </c-modal-content>
                    <c-modal-overlay />
                    
                </c-modal>
                
            </c-box>
            <c-button variant-color="green" mb="0.5em" @click="addInstance()">Add</c-button>
            


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
                isModalOpen: false,
                modalId: -1,
                editingInstance: "",
                instanceName: "",
                instanceStatus: "",
                clientEmail: "",
                instanceAvails: [{
                    from: "",
                    to: "",
                    price: ""
                }],
                instanceAvailFrom: "",
                instanceAvailTo: "",
                instanceAvailPrice: 0,
                availNumber: -1,
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
        watch: {
            availNumber: function (newVal, oldVal) {
                this.instanceAvailFrom = this.instanceAvails[newVal].from
                this.instanceAvailTo = this.instanceAvails[newVal].to
                this.instanceAvailPrice = this.instanceAvails[newVal].price
            },
            instanceAvailFrom: function (newVal, oldVal) {
                this.editingInstance.availability[this.availNumber].from = newVal
            },
            instanceAvailTo: function (newVal, oldVal) {
                this.editingInstance.availability[this.availNumber].to = newVal
            },
            instanceAvailPrice: function (newVal, oldVal) {
                this.editingInstance.availability[this.availNumber].price = newVal
            },
            instanceStatus: function (newVal, oldVal) {
                this.editingInstance.currentStatus = newVal
            },
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
            console.log('Product: ', this.product)
            for (const [instanceId, instance] of Object.entries(this.product.instances)) {
                newInstances.push({...instance, id: instanceId});
            }

            this.instances = JSON.parse(JSON.stringify(newInstances)); // copies obj without ref

            // NB lo slash alla fine
            let rentability = await this.$axios.$get(config.apiPrefix + `/products/${this.id}/rentability`);

            console.log("rentability:",rentability)

            const nameToNumber = {}
            let i = 0
            for (const [key, value] of Object.entries(rentability)) {
                nameToNumber[key] = i
                i++
            }

            for(const [key, value] of Object.entries(rentability)) {
                for(const range of value) {
                    console.log("period: ", range);
                    this.attrs.push({
                        key: key,
                        dot: this.colors[nameToNumber[key]],
                        dates: {
                            start: new Date(range.from),
                            end: new Date(range.to)
                        },
                        popover: {
                            label: key
                        }
                    })
                }
                
                
            }

            console.log("fetch ended")

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
                console.log("Quote: ", quote)
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
            openInstanceModal(id) {
                this.isModalOpen = true;
                this.modalId = id;
                this.editingInstance = this.product.instances[id];
                this.instanceName = this.product.instances[id].name;
                this.instanceStatus = this.product.instances[id].currentStatus;
                this.instanceAvails = Object.values(this.product.instances[id].availability);
                this.availNumber = 0;
            },
            async editInstance(id) {
                console.log("editing instance: ", id)
                let modifiedProduct = this.product;

                this.editingInstance.name = this.instanceName;

                modifiedProduct.instances[id] = this.editingInstance;

                delete modifiedProduct.id;

                for(const [_, value] of Object.entries(modifiedProduct.instances)){
                    delete value.id;
                }

                console.log("Modified product", modifiedProduct)

                let response = await this.$axios.$put(config.apiPrefix + `/products/${this.id}`, modifiedProduct).catch(err => {
                    console.log(err)
                });

                this.isModalOpen = false;
                this.instanceName = "";
                this.$nuxt.refresh();
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

                let resp = await this.$axios.$get(config.apiPrefix +`/users?email=${encodeURI(this.clientEmail)}`).catch(err => {
                    console.log(err)
                });

                console.log("resp: ", resp)

                if(resp.results.length == 0) {
                    alert("Email not found")
                    return;
                }

                let id = resp.results[0].id;

                const body = {
                    products: {
                        [this.id]: {
                            instances: formattedInstances
                        }
                    },
                    userId: id,
                    approvedBy: localStorage.getItem('userId')
                }

                let response = await this.$axios.$post(config.apiPrefix + '/rentals/', body)
                console.log(response)
                if(response.products) {
                    this.$router.push('/rentals')
                }
            },
            async addInstance() {
                console.log("adding empty instance");
                let modifiedProduct = this.product;
                const instanceNum = Object.keys(modifiedProduct.instances).length;
                var s = "000" + instanceNum;
                const instanceId = "a"+s.substr(s.length-3);

                modifiedProduct.instances[instanceId] = {
                    name: 'New Instance',
                    availability: [{
                        from: '1970-01-01',
                        to: '1970-01-01',
                        price: 0
                    }]
                }

                delete modifiedProduct.id;

                for(const [_, value] of Object.entries(modifiedProduct.instances)){
                    delete value.id;
                }

                console.log("Product with added instance", modifiedProduct)

                let response = await this.$axios.$put(config.apiPrefix + `/products/${this.id}`, modifiedProduct).catch(err => {
                    console.log(err)
                });
                console.log('Refetching... addInstance');
                this.$nuxt.refresh();
                console.log('Finished refetching addInstance');
            },
            async removeInstance(id) {
                console.log("removing instance: ", id)
                let modifiedProduct = this.product;
                delete modifiedProduct.instances[id];

                delete modifiedProduct.id;

                for(const [_, value] of Object.entries(modifiedProduct.instances)){
                    delete value.id;
                }

                console.log("Modified product", modifiedProduct)

                let response = await this.$axios.$put(config.apiPrefix + `/products/${this.id}`, modifiedProduct).catch(err => {
                    console.log(err)
                });

                console.log('Refetching... removeInstance');
                this.$nuxt.refresh();
                
                console.log('Finished refetching removeInstance');
            }
        }
    }

</script>

<style>
    .vueperslide__image {
        background-size: contain;
        background-repeat: no-repeat;
    }

    #myodal {
        z-index: 100 !important;
    }

    #picker {
        z-index: 0;
    }

</style>
