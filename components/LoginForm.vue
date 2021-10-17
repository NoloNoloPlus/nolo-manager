<template>
    <c-box p="5" w="40em" maxW="90vw">
        <c-heading>Back Office Login Form</c-heading>
        <c-form-control :is-invalid="isInvalid">
            <c-form-label for="username">Email</c-form-label>
            <c-input id="email" v-model="email" type="email" placeholder="Email" />
            
        </c-form-control>
        
        <c-form-control :is-invalid="isInvalid">
            <c-form-label for="password">Password</c-form-label>
            <c-input v-model="password" id="password" type="password" placeholder="Password" />
        </c-form-control>
        <c-form-control pt="1em">
            <c-button variant-color="blue" @click="login">Login</c-button>
        </c-form-control>

        <c-text pt="1em">{{errorMessage}}</c-text>
        
    </c-box>

</template>

<script>
    export default {
        data() {
            return {
                email: "",
                password: "",
                errorMessage: "",
                isInvalid: false
            };
        },
        methods: {
            async login() {
                /*this.$store.dispatch("login", {
                    username: this.username,
                    password: this.password,
                });*/
                const user = {
                    email: this.email,
                    password: this.password,
                };
                //console.log(user);
                this.$axios.setHeader("Accept", "application/json");
                this.$axios.setHeader("Content-Type", "application/json");
                this.$axios.interceptors.response.use(response => {
                    return response;
                }, error => {
                    if (error.response.status === 401) {
                        this.isInvalid = true;
                        console.log("Wrong credentials");
                        this.$store.commit("setUserTokens", null);
                        this.errorMessage = "Operation error: wrong credentials";
                    }
                    return error;
                });
                let response = await this.$axios.post("https://site202114.tw.cs.unibo.it/v1/auth/login", user);
                console.log(response);
                if (response.status === 200) {
                    this.errorMessage = "Operation successful";
                    this.isInvalid = false;
                    this.$axios.setToken(response.data.tokens.access.token, "Bearer");
                    this.$store.commit("setUserTokens", response.data.tokens);
                    //console.log(this.$store.state.userTokens);
                }
            },
        },
    };

</script>
