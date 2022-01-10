<template>
    <c-flex justify="space-around" align="center" h="3em">
        <NuxtLink to="/">
            <c-heading size="md">Home</c-heading>
        </NuxtLink>
        <a href="https://site202114.tw.cs.unibo.it/">
            <c-button size="md" variant-color="orange">Front office</c-button>
        </a>
        <a href="https://site202114.tw.cs.unibo.it/back">
            <c-button size="md" variant-color="orange">Back office</c-button>
        </a>
        <c-menu>
            <c-menu-button right-icon="chevron-down" variant-color="blue">
                <c-heading size="md">Clients</c-heading>
            </c-menu-button>
            <c-menu-list>
                <NuxtLink to="/clients">
                    <c-menu-item>
                        <c-heading size="sm">All clients</c-heading>
                    </c-menu-item>
                </NuxtLink>
                <NuxtLink to="/clients/add">
                    <c-menu-item>
                        <c-heading size="sm">Add client</c-heading>
                    </c-menu-item>
                </NuxtLink>
            </c-menu-list>
        </c-menu>
        <c-menu>
            <c-menu-button right-icon="chevron-down" variant-color="red">
                <c-heading size="md">Products</c-heading>
            </c-menu-button>
            <c-menu-list>
                <NuxtLink to="/products">
                    <c-menu-item>
                        <c-heading size="sm">All products</c-heading>
                    </c-menu-item>
                </NuxtLink>
                <NuxtLink to="/products/add">
                    <c-menu-item>
                        <c-heading size="sm">Add product</c-heading>
                    </c-menu-item>
                </NuxtLink>
            </c-menu-list>
        </c-menu>
       <NuxtLink to="/rentals">
            <c-button size="md" variant-color="indigo">Rentals</c-button>
        </NuxtLink>
        <NuxtLink to="/login">
            <c-heading v-if="this.$store.state.userTokens != null" size="sm" align="center">Logged: {{comp_email}}</c-heading>
            <c-heading v-else size="md">Login</c-heading>
        </NuxtLink> 


    </c-flex>
</template>

<script>
    import config from '../config.js'

    export default {
        data() {
            return {
                email: "",
                response: "",
                error: ""
            }
        },
        computed: {
            comp_email: function() {
                return localStorage.getItem('userEmail')
            }
        },
        async beforeMount() {
            var userTokens = localStorage.getItem('userTokens')
            if (userTokens) {
                /*
                let response = await this.$axios.$get(config.apiPrefix + '/rentals/').catch(err => {
                    this.error = err;
                    console.log("Non sei un manager")
                    console.log(err);
                });
                */
                //console.log("response", response);
                if(false) {
                    localStorage.clear();
                    this.email = ""
                    this.$router.push({
                        path: `/login`,
                    })
                } else {
                    userTokens = JSON.parse(userTokens)
                    console.log("setting user tokens by header")
                    console.log(userTokens)
                    this.$axios.setToken(userTokens.access.token, "Bearer");
                    this.$store.commit("setUserTokens", userTokens);
                    this.email = localStorage.getItem('userEmail')
                }
            }
        }
    }
</script>

