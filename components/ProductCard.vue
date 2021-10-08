<template>
    <c-box border-width="1px" w="20em" rounded="md" p="2em" m="1em">
        <div>
            <c-image size="100%" objectFit="cover" src="https://www.effettoparty.com/media/catalog/product/cache/2/image/1000x1000/9df78eab33525d08d6e5fb8d27136e95/8/6/8621c_c.jpg" alt="Betty la Clava"></c-image>
            <c-heading as="h4" size="md">Betty la Clava</c-heading>
            <c-text as="i">Una bellissima clava fatta in avorio affumicato</c-text>
            <c-divider></c-divider>
            <c-text>Altre info boh</c-text>
        </div>
    </c-box>
</template>

<script>
export default {
    props:{
        id: {
            type: Number,
            required: true
        }
    }
}
</script>