<template>
    <div class="user-list-page-container">
        <div class="user-list" v-if="list.length && !isLoading">
            <user-item v-for="item in list" :key="item.uid" :user="item" v-model:fans-count="item.fans_count" />
        </div>
        <div style="display: flex;align-items: center;justify-content: center;flex-grow: 1;">
            <empty v-if="!list.length&& !isLoading" />
        </div>
        <div class="pagination" v-if="list.length">
            <n-pagination v-model:page="pagination.page" v-model:page-size="pagination.pageSize"
                :item-count="pagination.total" show-size-picker :page-sizes="[10, 20, 30, 40]" />
        </div>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { reactive, onBeforeMount,ref } from 'vue'
import usePagination from '@/hooks/usePagination'
// types
import type { UserItem } from '@/apis/public/types/user'
import type { UserListPageProps } from '@/types/components/list';

const props = defineProps<UserListPageProps>()
const list = reactive<UserItem[]>([])
const pagination = usePagination(getListData)
const isLoading = ref(false)

async function getListData() {
    try {
        isLoading.value=true
        list.length = 0
        const res = await props.getData(pagination.page, pagination.pageSize)
        res.list.forEach(ele => list.push(ele))
        pagination.total = res.total
        pagination.has_more = res.has_more
        isLoading.value = false
    } catch (error) {
        console.log(error)
    }
}

onBeforeMount(getListData)

defineExpose<{
    pagination: typeof pagination;
    getListData: typeof getListData;
}>({ pagination, getListData })
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
    }

    .pagination {
        padding: 10px 0;
        display: flex;
        justify-content: center;
    }
}

@media screen and (max-width:650px) {
    .user-list-page-container {

        .user-list {
            display: flex;
            flex-direction: column;
        }
    }


}
</style>