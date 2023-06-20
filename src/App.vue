<template>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import User from './apis/user';
onMounted(() => {
  User.LoginAPI({
    username: '123',
    password:'123132'
  })
})
</script>

<style scoped lang="scss">

</style>
