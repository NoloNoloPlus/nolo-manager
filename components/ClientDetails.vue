<template>
    <c-box p="2em" w="60%">
        <c-heading as="h4" size="md" pb="1em">Client {{client.id}}</c-heading>
        <c-stack is-inline align="center">
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
                errorMessage: ""
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
        async fetch() {
            let response;
            await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/users/${this.id}`).then(resp => {
                this.client = resp
            }).catch(error => {
                console.log(error)
            })
            console.log(response)
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
                await this.$axios.$patch(`https://site202114.tw.cs.unibo.it/v1/users/${this.id}`, client).then(resp => {
                    this.isInvalid = false;
                    this.errorMessage = "User edited successfully";
                }).catch(error => {
                    this.isInvalid = true;
                    this.errorMessage = error.response.data.message
                })
            },
            async removeClient() {
                let response = await this.$axios.$delete(`https://site202114.tw.cs.unibo.it/v1/users/${this.id}`).catch(err => {
                    console.log(err)
                });
                console.log(response)
                this.$router.push('/users')
            }
        }
    }

</script>
