<template>
    <c-box w="40em" p="5" maxW="90vw">
        <c-heading>Inserimento cliente</c-heading>
        <c-form-control w="100%">
            <c-form-label for="name">First Name</c-form-label>
            <c-input id="firstName" type="text" v-model="firstName" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="name">Last Name</c-form-label>
            <c-input id="lastName" type="text" v-model="lastName" />
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
            <c-form-label for="email">Address Line 1</c-form-label>
            <c-input id="text" type="text" v-model="address.street.line1" />
        </c-form-control>
        <c-form-control w="100%">
            <c-form-label for="email">Address Line 2</c-form-label>
            <c-input id="text" type="text" v-model="address.street.line2" />
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
    import config from '../config'

    export default {
        data() {
            return {
                firstName: "",
                lastName: "",
                password: "",
                role: "",
                email: "",
                address: {
                    street: {
                        line1: "",
                        line2: ""
                    },
                    city: " ",
                    state: " ",
                    zip: " ",
                    country: " "
                }
            };
        },
        methods: {
            async handleClientSubmit() {
                const client = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    password: this.password,
                    role: this.role,
                    email: this.email,
                    address: this.address
                };
                //this.$emit("client-submit", client);
                await this.$axios.$post(config.apiPrefix + `/users/`, client).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });
                console.log(client)
            },
        }
    };

</script>
