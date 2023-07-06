<template>
    <div class="page-container">
        <UserBriefly :uid="uid" v-slot="{ data }">
            <span class="mr-10">的关注</span>
            <span class="sub-text">共{{ data.user.follow_count }}项</span>
        </UserBriefly>
        <div class="search mb-10">
            <n-input v-model:value.trim="keywords" type="text" :placeholder="tips.searchPlaceholder" />
            <n-button type="primary" @click="onHandleSearch">搜索</n-button>
            <n-button :disabled="!isSearchType" @click="onHandleReset">重置</n-button>
        </div>
        <div class="user-list">
            <UserList ref="listIns" :get-data="getUserFollow" />
        </div>
    </div>
</template>

<script lang='ts' setup>
// apis
import { getUserFollowListAPI, searchUserFollowListAPI } from '@/apis/follow'
// hooks
import { useMessage } from 'naive-ui';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { ref } from 'vue'
// types
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import tips from '@/config/tips';
// components
import UserBriefly from '@/components/common/UserBriefly/index.vue'

const uid = ref(0)
const route = useRoute()
const message = useMessage()
const router = useRouter()
const listIns = ref()
const keywords = ref('')
const isSearchType = ref(false)

async function getUserFollow (page: number, pageSize: number) {
    try {
        // 根据是否开启搜索关注决定调用哪个api
        const res = isSearchType.value ? await searchUserFollowListAPI(uid.value, keywords.value, page, pageSize) : await getUserFollowListAPI(uid.value, page, pageSize, true)
        return Promise.resolve(res.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

function checkRoutes (currentRoutes: RouteLocationNormalizedLoaded = route) {
    const id = + currentRoutes.params.uid
    if (isNaN(id)) {
        message.error(tips.errorParams)
        router.replace('/')
    } else {
        uid.value = id
    }
}

// 获取当前路由的参数
checkRoutes()

/**
 * 开启搜索粉丝
 */
function onHandleSearch () {
    if (keywords.value) {
        isSearchType.value = true
        // 重置页数 加载数据
        if (listIns.value) {
            listIns.value.toResetPage()
        }
    } else {
        message.warning(tips.pleaseEnter)
    }
}

/**
 * 重置搜索
 */
function onHandleReset () {
    isSearchType.value = false
    keywords.value = ''
    // 重置页数 加载数据
    if (listIns.value) {
        listIns.value.toResetPage()
    }
}


// 若params参数更新则需要重置页数加载数据
onBeforeRouteUpdate((to, form) => {
    // 需要判断当前是否为params参数更新
    if (to.params.uid !== form.params.uid) {
        checkRoutes(to)
        listIns.value.toResetPage()
    }
})

defineOptions({
    name: 'Follow'
})
</script>

<style scoped lang='scss'>
.page-container {
    display: flex;
    flex-direction: column;

    .search {
        display: flex;
    }

    .user-list {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>