<template>
    <c-flex align="center" justify="center">
        <ProductCard :id="parseInt($route.params.id)"/>
        <ProductCard :id="parseInt($route.params.id)"/>
        <ProductCard :id="parseInt($route.params.id)"/>
    </c-flex>
</template>