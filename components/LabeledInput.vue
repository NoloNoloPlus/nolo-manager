<template>
    <c-form-control>
        <c-form-label for="email">{{label}}</c-form-label>
        <c-input :type="type"/>
        <c-form-helper-text id="email-helper-text">
            {{helper}}
        </c-form-helper-text>
    </c-form-control>
</template>

<script>

export default ({
    props:{
        label: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        helper: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        console.log(props);
    },
})
</script>
