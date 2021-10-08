<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em">
        <p v-if="$fetchState.pending">pending...</p>
        <div v-else>
            <c-heading as="h4" size="md">Client {{id}}</c-heading>
            <c-stack is-inline align="center">
                <c-avatar :name="client.username" :src="client.avatar" size="lg"></c-avatar>
                <c-heading size="lg">{{client.username}}</c-heading>
            </c-stack>
            <c-text>{{client.address}}</c-text>
            <c-text>{{client.preferences}}</c-text>
        </div>
        
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
                client: {
                    avatar: "https://thumbs.gfycat.com/CautiousFatArmedcrab-max-1mb.gif"
                }
            }
        },
        async fetch() {
            let response = await this.$http.$get('https://randomuser.me/api/?seed='+this.id)
            this.client = {
                id: response.info.seed,
                username: response.results[0].login.username,
                avatar: response.results[0].picture.medium,
                address: response.results[0].location.street.name,
                preferences: "preferenze..."
            }
            //console.log(this.client.avatar)
        },
        fetchOnServer: false

    }
</script>