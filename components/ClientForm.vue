<template>
    <c-box w="40em" p="5" maxW="90vw">
        <c-heading>Inserimento cliente</c-heading>
        <c-form-control w="100%">
            <c-form-label for="username">Username</c-form-label>
            <c-input id="username" type="text" v-model="username" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="password">Password</c-form-label>
            <c-input id="password" type="password" v-model="password" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="address">Address</c-form-label>
            <c-input id="address" type="text" v-model="address" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="avatar">Avatar</c-form-label>
            <c-input id="avatar" type="file" v-model="avatar" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="preferences">Preferenze</c-form-label>
            <c-input id="preferences" type="text" v-model="preferences" />
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="handleClientSubmit">Add</c-button>
        </c-form-control>
    </c-box>
</template>

<script>
    export default {
        data() {
            return {
                username: "",
                password: "f",
                address: "",
                avatar: "",
                preferences: "",
            };
        },
        methods: {
            handleClientSubmit() {
                const client = {
                    username: this.username,
                    password: this.password,
                    address: this.address,
                    avatar: this.avatar,
                    preferences: this.preferences,
                };
                //this.$emit("client-submit", client);
                console.log(client)
            },
        }
    };

</script>
