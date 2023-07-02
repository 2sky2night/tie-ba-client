<template>
    <div class="pagniation-container">
        <n-pagination v-model:page="pagination.page" v-model:page-size="pagination.pageSize" :item-count="pagination.total"
            show-size-picker :page-sizes="[10, 20, 30, 40]" />
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue'
const pagination = reactive({
    page: 1,
    total: 0,
    pageSize: 20
})
defineOptions({
    name: 'Pagination'
})
</script>

<style scoped lang='scss'></style>