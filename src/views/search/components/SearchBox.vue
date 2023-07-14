<template>
    <div class="search-container mb-10">
        <n-input @blur="() => onHandleToggleShow(false)" @focus="() => onHandleToggleShow(true)"
            :size="isMoblie ? 'medium' : 'large'" v-model:value="keywords" :placeholder="tips.searchPlaceholder">
        </n-input>
        <n-button @click="onHandleClick" :size="isMoblie ? 'medium' : 'large'" type="primary">
            <n-icon size="20">
                <Search />
            </n-icon>
        </n-button>
        <!--搜索历史-->
        <div v-if="isShow" :style="{ marginRight: isMoblie ? '49px' : '56px' }" class="search-history-container">
            <ul>
                <li v-for=" item  in historySearch" :key="item.time">{{ item.title }}</li>
            </ul>
        </div>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { ref } from 'vue'
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
// configs
import tips from '@/config/tips';
// components
import { Search } from '@vicons/ionicons5';

// props
const props = defineProps<{
    isMoblie: boolean
}>()
// 搜索关键词
const keywords = ref('')
// 用户仓库
const userStore = useUserStore()
// 搜索历史记录
const { historySearch } = storeToRefs(userStore)
// 是否显示搜索历史
const isShow = ref(false)

// 点击搜索的回调
const onHandleClick = () => {
    userStore.addSearchHistroy(keywords.value)   
}

// 输入框聚焦失焦的回调
const onHandleToggleShow = (flag: boolean) => {
    if (flag) {
        // 若需要显示搜索历史时搜索历史有记录 就显示
        if (historySearch.value.length) {
            isShow.value = flag
        }
    } else {
        isShow.value = flag
    }
}

</script>

<style scoped lang='scss'>
.search-container {
    display: flex;
    position: relative;

    .search-history-container {
        transition: all ease var(--time-normal);
        position: absolute;
        height: 100px;
        left: 0;
        right: 0;
        background-color: var(--bg-color-5);
        z-index: 999;
        bottom: 0px;
        transform: translateY(100%);
    }
}
</style>