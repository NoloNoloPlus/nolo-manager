<template>
        <c-box w="40em" p="5" maxW="90vw">
            <c-heading>Inserimento cliente</c-heading>
            <labeled-input label="Username" type="text" v-model="username"></labeled-input>
            <labeled-input label="Password" type="password" v-model="password"></labeled-input>
            <labeled-input label="Address" type="text" v-model="address"></labeled-input>
            <labeled-input label="Avatar" type="file" v-model="avatar"></labeled-input>
            <labeled-input label="Preferences" type="text" v-model="preferences"></labeled-input>
            <c-button variant-color="blue">Add</c-button>
        </c-box>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: "",
                address: "",
                avatar: "",
                preferences: "",
            };
        },
    };

</script>
