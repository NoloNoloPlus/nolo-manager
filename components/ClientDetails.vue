<template>
    <c-box p="2em" w="60%">
        <c-heading as="h4" size="md" pb="1em">Client {{client.id}}</c-heading>
        <c-stack is-inline align="center">
            <c-avatar :name="client.name" :src="client.avatar" size="lg"></c-avatar>
            <c-form-control w="100%">
                <c-form-label for="avatar">Avatar</c-form-label>
                <c-input id="avatar" type="file" v-model="avatar"/>
            </c-form-control>
        </c-stack>
        <c-form-control w="100%">
            <c-form-label for="name">Name</c-form-label>
            <c-input id="name" type="text" v-model="client.name"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Email</c-form-label>
            <c-input id="email" type="email" v-model="client.email"/>
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="handleClientEdit">Edit</c-button>
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
                avatar: '',
                client: {
                    avatar: "https://thumbs.gfycat.com/CautiousFatArmedcrab-max-1mb.gif"
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
                response = resp;
                this.client = {
                    name: response.name,
                    id: response.id,
                    email: response.email,
                }
            }).catch(error => {
                console.log(error)
            })
            console.log(response)
        },
        fetchOnServer: false,
        methods: {
            async handleClientEdit() {
                await this.$axios.$patch(`https://site202114.tw.cs.unibo.it/v1/users/${this.id}`, {
                    name: this.client.name,
                    email: this.client.email
                }).then(resp => {
                    this.isInvalid = false;
                    this.errorMessage = "User edited successfully";
                }).catch(error => {
                    this.isInvalid = true;
                    this.errorMessage = error.response.data.message
                })
            }
        }
    }

</script>
