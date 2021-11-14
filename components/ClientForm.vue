<template>
    <c-box w="40em" p="5" maxW="90vw">
        <c-heading>Inserimento cliente</c-heading>
        <c-form-control w="100%">
            <c-form-label for="name">Name</c-form-label>
            <c-input id="name" type="text" v-model="name" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="password">Password</c-form-label>
            <c-input id="password" type="password" v-model="password" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Email</c-form-label>
            <c-input id="email" type="email" v-model="email" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="role">Role</c-form-label>
            <c-select id="role" placeholder="Select role" v-model="role">
                <option value="user">User</option>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
            </c-select>

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
                name: "",
                password: "",
                role: "",
                email: "",
            };
        },
        methods: {
            async handleClientSubmit() {
                const client = {
                    name: this.name,
                    password: this.password,
                    role: this.role,
                    email: this.email
                };
                //this.$emit("client-submit", client);
                await this.$axios.$post(`https://site202114.tw.cs.unibo.it/v1/users/`, client).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });
                console.log(client)
            },
        }
    };

</script>
