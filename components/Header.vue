<template>
    <c-flex justify="space-around" align="center" h="3em">
        <NuxtLink to="/">
            <c-heading size="md">Home</c-heading>
        </NuxtLink>
        <NuxtLink to="../">
            <c-button size="md" variant-color="orange">Front office</c-button>
        </NuxtLink>
        <NuxtLink to="../backoffice/">
            <c-button size="md" variant-color="orange">Back office</c-button>
        </NuxtLink>
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
        <c-menu>
            <c-menu-button right-icon="chevron-down" variant-color="indigo">
                <c-heading size="md">Rentals</c-heading>
            </c-menu-button>
            <c-menu-list>
                <NuxtLink to="/rentals">
                    <c-menu-item>
                        <c-heading size="sm">All rentals</c-heading>
                    </c-menu-item>
                </NuxtLink>
                <NuxtLink to="/rentals/add">
                    <c-menu-item>
                        <c-heading size="sm">Add rental</c-heading>
                    </c-menu-item>
                </NuxtLink>
            </c-menu-list>
        </c-menu>
        <NuxtLink to="/login">
            <c-heading v-if="this.$store.state.userTokens != null" size="sm" align="center">Logged: {{this.email}}</c-heading>
            <c-heading v-else size="md">Login</c-heading>
        </NuxtLink> 


    </c-flex>
</template>

<script>
    import config from '../config.js'

    export default {
        data() {
            return {
                email: ""
            }
        },
        beforeMount() {
            var userTokens = localStorage.getItem('userTokens')
            const error = '';
            if (userTokens) {
                let response = this.$axios.$get(config.apiPrefix + '/rentals/').catch(err => {
                    error = err;
                    console.log(err);
                });
                if(error) {
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

