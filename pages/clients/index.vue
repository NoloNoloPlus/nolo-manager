<template>
    <c-box>
        <c-flex align="center" justify="center" wrap="wrap">
            <ClientCard v-for="id in 4" v-bind:key="id" :id="id" v-on:click.native="viewClient(id)"/>
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
        }
    }
</script>