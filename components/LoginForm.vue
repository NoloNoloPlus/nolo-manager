<template>
    <c-box p="5" w="40em" maxW="90vw">
        <c-heading>Back Office Login Form</c-heading>
        <labeled-input label="Username" type="text" v-model="username"></labeled-input>
        <labeled-input label="Password" type="password" v-model="password"></labeled-input>
        <c-button variant-color="blue">Submit</c-button>
    </c-box>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: "",
            };
        },
    };

</script>
