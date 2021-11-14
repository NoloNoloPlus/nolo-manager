<template>
    <c-box>
        <c-flex align="center" justify="center" wrap="wrap">
            <ClientCard v-for="id of clients" v-bind:key="id" :id="id" v-on:click.native="viewClient(id)"/>
        </c-flex>
    </c-box>
</template>

<script>
    export default {
        data() {
            return {
                clients: []
            }
        },
        head() {
            return {
                title: "Clients"
            }
        },
        methods: {
            viewClient(id) {
                this.$router.push({path: '/clients/'+id})
            }
        },
        async fetch() {
            let response = await this.$axios.$get(`https://site202114.tw.cs.unibo.it/v1/users/`);
            console.log(response);
            for(var client of response.results) {
                this.clients.push(client.id);
            }
        },
        fetchOnServer: false
    }
</script>