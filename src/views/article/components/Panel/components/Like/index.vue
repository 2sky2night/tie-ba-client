<template>
    <div class="like-container">
        <div class="list">
            <user-list-inf ref="listIns" :get-data="getLikeList"></user-list-inf>
        </div>
    </div>
</template>

<script lang='ts' setup>
// apis
import { getArticleLikedListAPI } from '@/apis/article'
// hooks
import { watch, ref } from 'vue'
// utils
import PubSub from 'pubsub-js'
// types
import type { ListLoadInfIns } from '@/types/components/list';

const isDesc = ref(true)
const props = defineProps<{ aid: number }>()
const listIns = ref<ListLoadInfIns>()

// 获取点赞数据
async function getLikeList (page: number, pageSize: number) {
    const res = await getArticleLikedListAPI(props.aid, page, pageSize, isDesc.value)
    return res.data
}

// 通过列表实例重置页码 获取最新数据
const toResetPage = () => {
    if (listIns.value) {
        listIns.value.resetPage()
    }
}

// 监听当前用户是否点赞帖子 点赞了就重新加载数据
PubSub.subscribe('likeArticle', toResetPage)
// 路由更新 重置页码和列表项 重新获取最新数据
watch(() => props.aid, toResetPage)


defineOptions({
    name: 'Like'
})
</script>