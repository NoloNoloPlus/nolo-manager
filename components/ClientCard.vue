<template>
    <c-box border-width="1px">
        <c-heading as="h4" size="md">Client {{client.id}}</c-heading>
        <c-stack is-inline>
            <c-avatar :src="client.avatar" size="xl"></c-avatar>
            <c-heading>{{client.username}}</c-heading>
        </c-stack>
        <c-text>{{client.address}}</c-text>
        <c-text>{{client.preferences}}</c-text>
    </c-box>
</template>

<script>
    export default {
        props:{
            client:Object
        },
    }
</script>