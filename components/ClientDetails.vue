<template>
    <c-box p="2em" w="100%">
        <c-heading as="h4" size="md" pb="1em">Client {{client.id}} <c-tag>{{client.role}}</c-tag></c-heading>
        <c-stat v-if="this.client.role == 'user'" border-width="1px" p="1em">
            <c-stat-label><c-stat-arrow type="increase" />Total own rentals profit</c-stat-label>
            <c-stat-number>{{formattedTotalRevenue}}</c-stat-number>
            <c-stat-helper-text>nothing to see</c-stat-helper-text>
        </c-stat>
        <c-stat v-if="this.client.role != 'user'" border-width="1px" p="1em">
            <c-stat-label><c-stat-arrow type="increase" />Total approved rentals profit</c-stat-label>
            <c-stat-number>{{formattedTotalApprovedRevenue}}</c-stat-number>
            <c-stat-helper-text>nothing to see</c-stat-helper-text>
        </c-stat>
        <c-heading v-if="this.ownRentals.length > 0" as="h2" size="md" align="center">Own rentals</c-heading>
        <c-flex align="center" justify="center" wrap="wrap">
            <RentalCard v-for="rental of ownRentals" v-bind:key="rental.id" :id="rental.id"/>
        </c-flex>
        <c-heading v-if="this.approvedRentals.length > 0" as="h2" size="md" align="center">Approved rentals</c-heading>
        <c-flex align="center" justify="center" wrap="wrap">
            <RentalCard v-for="rental of approvedRentals" v-bind:key="rental.id" :id="rental.id"/>
        </c-flex>
        <c-stack is-inline align="center" mt="2em">
            <c-avatar :name="client.firstName + ' ' + client.lastName" :src="client.avatar" size="lg"></c-avatar>
            <c-form-control w="100%">
                <c-form-label for="avatar">Avatar</c-form-label>
                <c-input id="avatar" type="text" v-model="client.avatarUrl"/>
            </c-form-control>
        </c-stack>
        <c-form-control w="100%">
            <c-form-label for="name">First Name</c-form-label>
            <c-input id="firstName" type="text" v-model="client.firstName"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="name">Last Name</c-form-label>
            <c-input id="lastName" type="text" v-model="client.lastName"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Email</c-form-label>
            <c-input id="email" type="email" v-model="client.email"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Company</c-form-label>
            <c-input id="company" type="text" v-model="client.company"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Street Line 1</c-form-label>
            <c-input id="company" type="text" v-model="client.address.street.line1"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Street Line 2</c-form-label>
            <c-input id="company" type="text" v-model="client.address.street.line2"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">City</c-form-label>
            <c-input id="city" type="text" v-model="client.address.city"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">State</c-form-label>
            <c-input id="state" type="text" v-model="client.address.state"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">ZIP code</c-form-label>
            <c-input id="zip" type="text" v-model="client.address.zip"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Country</c-form-label>
            <c-input id="country" type="text" v-model="client.address.country"/>
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="handleClientEdit">Edit</c-button>
        </c-form-control>
        <c-form-control pt="1em">
            <c-button v-if="this.$store.state.userTokens == null" variant-color="red" disabled>Not Authenticated</c-button>
            <c-button v-else variant-color="red" @click="removeProduct()">Remove user</c-button>
        </c-form-control>
        <c-box mt="1em">
            <c-alert v-if="isInvalid" status="error">{{errorMessage}}</c-alert>
            <c-alert v-if="!isInvalid && errorMessage != ''" status="success">{{errorMessage}}</c-alert>    
        </c-box>    
    </c-box>
</template>

<script>
    import config from '../config.js';
    import { rentalPrice, formatPrice } from '../common/price.js';

    export default {
        props:{
            id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                client: {
                    avatarUrl: "https://thumbs.gfycat.com/CautiousFatArmedcrab-max-1mb.gif",
                    address: {
                        street: {
                            line1: '',
                            line2: ''
                        }
                    }
                },
                isInvalid: false,
                errorMessage: "",
                ownRentals: {},
                approvedRentals: {},
                totalRevenue: 0,
                totalApprovedRevenue: 0
            }
        },
        watch: {
            client: {
                handler(newValue, oldValue) {
                    this.isInvalid = false;
                    this.errorMessage = "";
                },
                deep: true
            }

        },
        computed: {
            formattedTotalRevenue() {
                return formatPrice(this.totalRevenue);
            },
            formattedTotalApprovedRevenue() {
                return formatPrice(this.totalApprovedRevenue);
            }
        },
        async fetch() {
            await this.$axios.$get(config.apiPrefix + `/users/${this.id}`).then(resp => {
                this.client = resp
            }).catch(error => {
                console.log(error)
            })

            console.log("client", this.client)

            await this.$axios.$get(config.apiPrefix + `/rentals?userId=${this.id}`).then(resp => {
                this.ownRentals = resp.results
            }).catch(error => {
                console.log(error)
            })

            console.log("Own rentals", this.ownRentals);

            for(let rental of this.ownRentals) {
                this.totalRevenue += rentalPrice(rental)
            }

            await this.$axios.$get(config.apiPrefix + `/rentals?approvedBy=${this.id}`).then(resp => {
                this.approvedRentals = resp.results
            }).catch(error => {
                console.log(error)
            })

            for(let rental of this.approvedRentals) {
                this.totalApprovedRevenue += rentalPrice(rental)
            }
            
        },
        fetchOnServer: false,
        methods: {
            async handleClientEdit() {
                let client = this.client;
                delete client.id;
                delete client.isEmailVerified;
                delete client._id;
                delete client.__ob__;
                delete client.address._id;
                delete client.address.street._id;
                console.log(client)
                await this.$axios.$patch(config.apiPrefix + `/users/${this.id}`, client).then(resp => {
                    this.isInvalid = false;
                    this.errorMessage = "User edited successfully";
                }).catch(error => {
                    this.isInvalid = true;
                    this.errorMessage = error.response.data.message
                })
            },
            async removeClient() {
                let response = await this.$axios.$delete(config.apiPrefix + `/users/${this.id}`).catch(err => {
                    console.log(err)
                });
                console.log(response)
                this.$router.push('/users')
            }
        }
    }

</script>
