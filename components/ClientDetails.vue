<template>
    <c-box p="2em" w="60%">
        <c-heading as="h4" size="md" pb="1em">Client {{client.id}}</c-heading>
        <c-stack is-inline align="center">
            <c-avatar :name="client.username" :src="client.avatar" size="lg"></c-avatar>
            <c-form-control w="100%">
                <c-form-label for="avatar">Avatar</c-form-label>
                <c-input id="avatar" type="file" v-model="avatar"/>
            </c-form-control>
        </c-stack>
        <c-form-control w="100%">
            <c-form-label for="username">Username</c-form-label>
            <c-input id="username" type="text" v-model="client.username"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="username">Address</c-form-label>
            <c-input id="username" type="text" v-model="client.address"/>
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="username">Preferenze</c-form-label>
            <c-input id="username" type="text" v-model="client.preferences"/>
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
                type: Number,
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
            let response = await this.$http.$get('https://randomuser.me/api/?seed=' + this.id)
            this.client = {
                id: response.info.seed,
                username: response.results[0].login.username,
                avatar: response.results[0].picture.medium,
                address: response.results[0].location.street.name,
                preferences: "preferenze..."
            }
            //console.log(this.client.avatar)
        },
        fetchOnServer: false,
        methods: {
            handleClientEdit() {
                //something
            }
        }
    }

</script>
