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
                }
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
            handleClientEdit() {
                //something
            }
        }
    }

</script>
