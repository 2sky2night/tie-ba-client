<template>
    <div class="page-container">
        <UserBriefly :uid="uid" v-slot="{data}">
            <span class="mr-10">的粉丝</span>
             <span class="sub-text">共{{ data.user.fans_count }}项</span> 
        </UserBriefly>
        <div class="user-list">
            <UserList ref="listIns" :get-data="getUserFans" />
        </div>
    </div>
</template>

<script lang='ts' setup>
// apis
import { getUserFansListAPI } from '@/apis/public/user'
// hooks
import { useMessage } from 'naive-ui';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { ref } from 'vue'
// types
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import tips from '@/config/tips';
// components
import UserBriefly from '@/components/common/UserBriefly/index.vue'

let uid = ref(0)
const route = useRoute()
const message = useMessage()
const router = useRouter()
const listIns = ref()

async function getUserFans(page: number, pageSize: number) {
    try {
        const res = await getUserFansListAPI(uid.value, page, pageSize, true)
        return Promise.resolve(res.data)
    } catch (error) {
        return Promise.reject(error)
    }
}

function checkRoutes(currentRoutes: RouteLocationNormalizedLoaded = route) {
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

// 若params参数更新则需要重置页数加载数据
onBeforeRouteUpdate((to, from) => {
    console.log(to,from)
    // 需要判断当前是否为params参数更新
    if (to.params.uid !== from.params.uid) {
        checkRoutes(to)
        if (listIns.value) {
            if (listIns.value.pagination.page === 1) {
                // 强制更新
                listIns.value.getListData()
            } else {
                listIns.value.pagination.page=1
            }
        }
    }
})

defineOptions({
    name: 'Fans'
})
</script>

<style scoped lang='scss'>
.page-container {
    display: flex;
    flex-direction: column;

    .user-list {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>