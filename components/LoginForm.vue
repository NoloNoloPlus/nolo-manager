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

        <c-box mt="1em">
            <c-alert v-if="isInvalid" status="error">{{errorMessage}}</c-alert>
            <c-alert v-if="!isInvalid && errorMessage != ''" status="success">Login successful</c-alert>    
        </c-box>    
        
        
    </c-box>

</template>

<script>
    import config from '../config'

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
                let response = await this.$axios.post(config.apiPrefix + "/auth/login", user);
                console.log("login data: ", response);
                if (response.status === 200) {
                    const userTokens = JSON.parse(JSON.stringify(response.data.tokens))
                    this.errorMessage = "Operation successful";
                    this.isInvalid = false;
                    localStorage.setItem("userTokens", JSON.stringify(userTokens));
                    localStorage.setItem("userEmail", user.email);
                    localStorage.setItem("userId", response.data.user.id);
                    this.$axios.setToken(userTokens.access.token, "Bearer");
                    this.$store.commit("setUserTokens", userTokens);
                    console.log("user tokens:")
                    console.log(userTokens);
                }
            },
        },
    };

</script>
