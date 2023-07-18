<template>
    <div class="sub-page">
        <UserSelector class="mb-10" v-model:select-user="selectUser" />
        <ArticleList :select-user="selectUser" />
    </div>
</template>

<script lang='ts' setup>
// components
import ArticleList from './components/ArticleList.vue';
import UserSelector from './components/UserSelector.vue';
// hooks
import { ref } from 'vue'

// 当前是否选择了关注者 （来浏览关注者的帖子）
const selectUser=ref<number|null>(null)

defineOptions({
    name: 'DiscoverArticle'
})
</script>
