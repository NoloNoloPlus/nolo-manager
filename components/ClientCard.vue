<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em">
        <p v-if="$fetchState.pending">pending...</p>
        <div v-else>
            <c-heading as="h4" size="md">Client {{id}}</c-heading>
            <c-stack is-inline align="center">
                <c-avatar :name="client.username" :src="client.avatar" size="lg"></c-avatar>
                <c-heading size="lg">{{client.name}}</c-heading>
            </c-stack>
            <c-text>{{client.email}}</c-text>
            <c-text>{{client.preferences}}</c-text>
        </div>
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
                    avatar: "https://thumbs.gfycat.com/CautiousFatArmedcrab-max-1mb.gif"
                }
            }
        },
        async fetch() {
            let response = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/users/${this.id}`);
            //console.log(response);
            this.client = response;
        },
        fetchOnServer: false

    }
</script>