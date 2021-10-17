<template>
    <c-flex justify="space-around" align="center" h="3em">
        <NuxtLink to="/">
            <c-heading size="md">Home</c-heading>
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
        <NuxtLink to="/login">
            <c-heading v-if="this.$store.state.userTokens != null" size="md">Logged</c-heading>
            <c-heading v-else size="md">Login</c-heading>
        </NuxtLink> 


    </c-flex>
</template>

