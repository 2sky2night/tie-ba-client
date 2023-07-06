<template>
    <div class="user-briefly-container">
        <div class="title">
            <span class="username">
                {{ user.username }}
            </span>
            <slot :data="{ user }"></slot>
        </div>
    </div>
</template>

<script lang='ts' setup>
// types
import type { UserBrieflyProps } from '@/types/components/common'
import type { UserCardResponse } from '@/apis/public/user/types.ts'
// hooks
import { onBeforeMount, reactive, watch } from 'vue';
// apis
import { getUserBrieflyInfoAPI } from '@/apis/public/user';

const props = defineProps<UserBrieflyProps>()
const user = reactive<UserCardResponse>({
    uid: 0,
    username: '',
    avatar: '',
    fans_count: 0,
    follow_count: 0,
    createTime: '',
    like_count: 0,
    is_fans: false,
    is_follow: false
})

async function toGetData () {
    const res = await getUserBrieflyInfoAPI(props.uid)
    user.avatar = res.data.avatar
    user.createTime = res.data.createTime
    user.fans_count = res.data.fans_count
    user.follow_count = res.data.follow_count
    user.is_fans = res.data.is_fans
    user.is_follow = res.data.is_follow
    user.like_count = res.data.like_count
    user.uid = res.data.uid
    user.username = res.data.username
}

onBeforeMount(toGetData)

watch(() => props.uid, toGetData)

defineOptions({
    name: 'UserBriefly'
})
</script>

<style scoped lang='scss'>
.user-briefly-container {
    margin-bottom: 20px;

    .title {
        .username {
            font-size: 20px;
            font-weight: 600;
        }
    }
}
</style>