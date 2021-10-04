<template>
    <c-box p="5" w="40em" maxW="90vw">
        <c-heading>Back Office Login Form</c-heading>
        <c-form-control>
            <c-form-label for="username">Username</c-form-label>
            <c-input id="username" v-model="username" placeholder="Username" />
        </c-form-control>
        <c-form-control>
            <c-form-label for="username">Password</c-form-label>
            <c-input v-model="password" type="password" placeholder="Password" />
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="login">Login</c-button>
        </c-form-control>
        
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
        methods: {
            login() {
                /*this.$store.dispatch("login", {
                    username: this.username,
                    password: this.password,
                });*/
                const user = {
                    username: this.username,
                    password: this.password,
                };
                console.log(user);
            },
        },
    };

</script>
