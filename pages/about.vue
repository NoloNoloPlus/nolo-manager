<template>
  <c-box class="container" p="4">
    <c-heading>About</c-heading>
    <c-text>This is the about page!!</c-text>
    <c-input placeholder="your input" v-model="inputValue" />
    <c-text>This is your input: {{ inputValue }}</c-text>
    <hr>
    <c-box>
        <c-button variant-color="blue" @click="toggleVisibility">toggle visibility</c-button>
        <c-text v-if="isVisible">i am visible now!</c-text>
    </c-box>
  </c-box>
</template>

<script>
    export default {
        data() {
            return {
            inputValue: "",
            isVisible: true,
            };
        },
        methods: {
            toggleVisibility() {
                this.isVisible = !this.isVisible;
            }
        }
    };
</script>
