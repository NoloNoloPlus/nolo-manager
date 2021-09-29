<template>
    <c-form-control w="100%">
        <c-form-label for="email">{{label}}</c-form-label>
        <c-input :type="type" :multiple="multiple"/>
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
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        console.log(props);
    },
})
</script>
