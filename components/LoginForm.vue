<template>
    <c-box p="5">
    <c-heading>Back Office Login Form</c-heading>
        <labeled-input label="Username" type="text" v-model="username"></labeled-input>
        <labeled-input label="Password" type="password" v-model="password"></labeled-input>
    </c-box>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
}
</script>