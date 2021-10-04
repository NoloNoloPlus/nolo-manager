<template>
    <c-flex align="center" justify="center" wrap="wrap">
        <ClientCard v-for="id in 4" v-bind:key="id" :id="id"/>
    </c-flex>
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
        }
    }
</script>