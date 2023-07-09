<template>
    <div class="star-container">
        <div class="list">
            <user-list-inf ref="listIns" :get-data="getLikeList"></user-list-inf>
        </div>
    </div>
</template>

<script lang='ts' setup>
// apis
import { getArticleStarListAPI } from '@/apis/article'
// hooks
import { watch, ref } from 'vue'
// utils
import PubSub from 'pubsub-js'

const isDesc = ref(true)
const props = defineProps<{ aid: number }>()
const listIns = ref()

// 获取点赞数据
async function getLikeList(page: number, pageSize: number) {
    const res = await getArticleStarListAPI(props.aid, page, pageSize, isDesc.value)
    return res.data
}
// 监听当前用户是否点赞帖子 点赞了就重新加载数据
PubSub.subscribe('starArticle', () => {
    listIns.value.onHandleReset()
})
// 路由更新 重置页码和列表项 重新获取最新数据
watch(() => props.aid, () => {
    listIns.value.onHandleReset()
})


defineOptions({
    name: 'Star'
})
</script>

<style scoped lang='scss'>
.star-container {
    .list {}
}
</style>