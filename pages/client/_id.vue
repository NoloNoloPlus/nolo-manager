<template>
    <c-box>
        <ClientCard v-bind:client="{
                id: $route.params.id,
                avatar: 'https://randomuser.me/api/portraits/men/'+Math.floor(Math.random()*100)+'.jpg',
                username: 'Brit Ugo',
                address: 'Via Santarcangiolese 12B',
                preferences: 'mi piace verde'
            }"/>
    </c-box>
</template>