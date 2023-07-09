<template>
    <div class="bar-list-container">
        <template v-if="isFirstLoading">
            <bar-list-skeleton :length="20" />
        </template>
        <template v-else>
            <empty v-if="!list.length" />
            <div class="bar-list" v-else>
                <bar-item v-for="item in list" :key="item.bid" :bar="item" />
            </div>
            <div class="load-more mt-10">
                <n-button :loading="isLoading" strong secondary type="primary" v-if="paganition.has_more"
                    @click="onHandleClick">加载更多</n-button>
                <n-divider v-if="!paganition.has_more && list.length"><span class="no-more">没有更多了</span></n-divider>
            </div>
        </template>
    </div>
</template>

<script lang='ts' setup>
// types
import type { BarItem } from '@/apis/public/types/bar';
import type { BarListLoadProps } from '@/types/components/list'
// hooks
import { ref, reactive, onBeforeMount } from 'vue';

const props = defineProps<BarListLoadProps>()
// 吧列表项
const list = reactive<BarItem[]>([])
// 正在加载
const isLoading = ref(false)
// 首次加载
const isFirstLoading = ref(false)
// 分页数据
const paganition = reactive({
    page: 1,
    pageSize: 20,
    total: 0,
    has_more: false,
    desc: true
})

async function getListData () {
    try {
        isLoading.value = true
        const res = await props.getDataCb(paganition.page, paganition.pageSize, paganition.desc)
        paganition.total = res.total
        paganition.has_more = res.has_more
        paganition.desc = res.desc
        res.list.forEach(ele => list.push(ele))
        isLoading.value = false
    } catch (error) {
        console.log(error)
    }
}

/**
 * 点击加载更多
 */
function onHandleClick () {
    paganition.page++
    getListData()
}

onBeforeMount(async () => {
    isFirstLoading.value = true
    await getListData()
    isFirstLoading.value = false
})

</script>

<style scoped lang='scss'>
.bar-list-container {
    padding: 10px 0;

    .bar-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px
    }
}

.load-more {
    display: flex;
    justify-content: center;
}

@media screen and (max-width:651px) {
    .bar-list-container {
        .bar-list {

            display: flex;
            flex-direction: column;
        }
    }
}
</style>