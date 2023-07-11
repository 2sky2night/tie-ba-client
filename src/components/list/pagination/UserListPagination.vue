<template>
    <div class="user-list-page-container">
        <template v-if="pagination.isLoading">
            <user-list-skeleton :length="pagination.pageSize" />
            <div class="pagination" v-if="pagination.total > pagination.pageSize">
                <n-pagination :page="pagination.page" :page-size="pagination.pageSize" :item-count="pagination.total"
                    show-size-picker :page-sizes="pagination.pageSizes" />
            </div>
        </template>
        <template v-else>
            <template v-if="list.length">
                <div class="user-list">
                    <user-item v-for="item in list" :key="item.uid" :user="item" v-model:fans-count="item.fans_count" />
                </div>
                <!--若总数小于等于pageSize就不显示分页组件---->
                <div class="pagination" v-if="pagination.total > pagination.pageSize">
                    <n-pagination @update:page-size="onHandlePageSizeUpdate" @update:page="onHandlePageUpdate"
                        :page="pagination.page" :page-size="pagination.pageSize" :item-count="pagination.total"
                        show-size-picker :page-sizes="pagination.pageSizes" />
                </div>
            </template>
            <div class="empty" v-else>
                <empty />
            </div>
        </template>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive, onBeforeMount } from 'vue'
// types
import type { UserItem } from '@/apis/public/types/user'
import type { UserListPageProps, ListPageIns } from '@/types/components/list';
// props
const props = defineProps<UserListPageProps>()
// 用户列表
const list = reactive<UserItem[]>([])
// 分页数据
const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 0,
    pageSizes: [ 10, 20, 30, 40 ],
    isLoading: false
})

// 获取列表数据
async function getListData () {
    pagination.isLoading = true
    list.length = 0
    const res = await props.getData(pagination.page, pagination.pageSize)
    res.list.forEach(ele => list.push(ele))
    pagination.total = res.total
    pagination.isLoading = false
}
// 重置页码 获取数据
const toResetPage = async () => {
    pagination.page = 1
    await getListData()
}
// 操作分页组件 页码更新的回调
const onHandlePageUpdate = (value: number) => {
    pagination.page = value
    // 获取最新数据
    getListData()
}
// 操作分页组件 页长度更新的回调
const onHandlePageSizeUpdate = (value: number) => {
    pagination.pageSize = value
    toResetPage()
}

onBeforeMount(getListData)

defineExpose<ListPageIns>({ toResetPage })
</script>

<style scoped lang='scss'>
.user-list-page-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .user-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .empty {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
    }

    .pagination {
        padding: 10px 0;
        display: flex;
        justify-content: center;
    }
}

@media screen and (max-width:651px) {
    .user-list-page-container {

        .user-list {
            display: flex;
            flex-direction: column;
        }
    }


}
</style>