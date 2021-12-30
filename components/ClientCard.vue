<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em">
        <p v-if="$fetchState.pending">pending...</p>
        <div v-else>
            <c-tag v-if="client.role == 'admin'" size="sm" variant-color="cyan">{{client.role}}</c-tag>
            <c-tag v-else size="sm">{{client.role}}</c-tag>
            <c-heading s="h4" size="xs">{{client.id}}</c-heading>
            
            <c-stack is-inline align="center">
                <c-avatar :name="client.firstName + ' ' + client.lastName" :src="client.avatar" size="lg"></c-avatar>
                <c-heading size="md">{{client.firstName}}</c-heading>
                <c-heading size="md">{{client.lastName}}</c-heading>
            </c-stack>
            <c-text>{{client.email}}</c-text>
            <c-text>{{client.preferences}}</c-text>
        </div>
    </c-box>
</template>

<script>
    import config from '../config'

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
                    avatar: "https://thumbs.gfycat.com/CautiousFatArmedcrab-max-1mb.gif"
                }
            }
        },
        async fetch() {
            await this.$axios.$get(config.apiPrefix + `/users/${this.id}`)
                .then(response => {
                    this.client = response
                })
                .catch(error => {
                    console.log(error)
                })
            //console.log(response);
        },
        fetchOnServer: false

    }
</script>

<style>
</style>