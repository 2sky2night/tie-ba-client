<template>
    <div class="search-container mb-10" @click.stop="">
        <n-input @keyup.enter="onHandleClick" @blur="() => onHandleToggleShow(false)"
            @focus="() => onHandleToggleShow(true)" :size="isMoblie ? 'medium' : 'large'" @update:value="onHanldeInput"
            :value="keywords" :placeholder="tips.searchPlaceholder">
        </n-input>
        <n-button @click="onHandleClick" :size="isMoblie ? 'medium' : 'large'" type="primary">
            <n-icon size="20">
                <Search />
            </n-icon>
        </n-button>
        <!--搜索历史-->
        <div @mouseenter="() => isEnterHistory = true" @mouseleave="() => isEnterHistory = false" v-if="isShow"
            :style="{ marginRight: isMoblie ? '49px' : '56px' }" class="search-history-container">
            <span class="title mb-10">搜索历史</span>
            <ul class="history-list mt-10" v-if="historySearch.length">
                <li @click="() => onSearchByHistory(item.title)" class="item mb-10" v-for="item in historySearch"
                    :key="item.time">
                    <span>
                        {{ item.title }}
                    </span>
                    <n-icon @click.stop="() => onHandleDeleteHistory(item.time)">
                        <Close />
                    </n-icon>
                </li>
            </ul>
            <div v-else class="empty">
                无搜索历史
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted } from 'vue'
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { useMessage } from 'naive-ui';
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
// configs
import tips from '@/config/tips';
import PubSub from 'pubsub-js';
// components
import { Search, Close } from '@vicons/ionicons5';

// 路由对象
const router = useRouter()
// 路由元数据
const route = useRoute()
// props
const props = defineProps<{
    isMoblie: boolean
}>()
// 搜索关键词
const keywords = ref(route.query.keywords ? route.query.keywords as string : '')
// 用户仓库
const userStore = useUserStore()
// 搜索历史记录
const { historySearch } = storeToRefs(userStore)
// 是否显示搜索历史
const isShow = ref(false)
// 是否移入了搜索历史容器中
let isEnterHistory = false
// messageAPI
const message = useMessage()

// 点击搜索按钮的回调
const onHandleClick = () => {
    // 路由更新 更新时保存历史记录
    if (keywords.value.length) {
        router.push({
            path: route.path,
            query: {
                ...route.query,
                keywords: keywords.value
            }
        })
    } else {
        message.warning(tips.formNotEmpty('搜索关键词'))
    }
}

// 点击历史搜索项进行快捷搜索的回调
const onSearchByHistory = (title: string) => {
    // 获取搜索的内容
    keywords.value = title
    // 路由更新 更新时保存历史记录
    router.push({
        path: route.path,
        query: {
            ...route.query,
            keywords: keywords.value
        }
    })
    // 隐藏历史记录容器
    isShow.value = false
    isEnterHistory = false
}

// 输入框聚焦失焦的回调
const onHandleToggleShow = (flag: boolean) => {
    if (flag) {
        // 聚焦
        // 若需要显示搜索历史时搜索历史有记录 就显示
        if (historySearch.value.length) {
            isShow.value = flag
        }
    } else {
        // 失焦
        // 若当前鼠标移入了搜索历史则不能销毁搜索历史容器
        if (!isEnterHistory) {
            isShow.value = flag
        }
    }
}

// 删除历史记录的回调
const onHandleDeleteHistory = (time: number) => {
    userStore.deleteSearchHistory(time)
}

// 监听隐藏历史记录的回调
PubSub.subscribe('closeHistory', () => {
    isEnterHistory = false
    isShow.value = false
})

// input事件的回调
const onHanldeInput = (value: string) => {
    keywords.value = value.trim()
}

// 路由更新的回调
onBeforeRouteUpdate((to, from) => {
    // 若新旧路由的keywords都是一样的 就无需执行更新回调
    const temp = to.query.keywords
    const oldTemp = from.query.keywords
    if (temp) {
        if (oldTemp === temp) return
        // 路由更新keywords
        keywords.value = temp as string
        // 添加历史记录
        userStore.addSearchHistroy(keywords.value)
        // 通知关注者 字符串代表有搜索关键词
        PubSub.publish('search', keywords.value)
    } else {
        // 若未带上keywords查询参数
        keywords.value = ''
        // 通知关注者 null代表无搜索关键词
        PubSub.publish('search', null)
    }
})

// 若用户通过路由参数keywords进入页面 需要保存该历史记录
if (keywords.value) {
    userStore.addSearchHistroy(keywords.value)
    // 通知关注者 字符串代表有搜索关键词
    onMounted(() => {
        // 为什么这里需要用到onMouted？
        // 因为在发送该消息时 子路由都没被实例化 无法做到监听该消息
        PubSub.publish('search', keywords.value)
    })
}

</script>

<style scoped lang='scss'>
.search-container {
    display: flex;
    position: relative;

    :deep(.n-input--focus) {
        border: none;
    }

    .search-history-container {
        box-sizing: border-box;
        padding: 10px;
        transition: all ease var(--time-normal);
        position: absolute;
        left: 0;
        right: 0;
        background-color: var(--bg-color-1);
        z-index: 999;
        bottom: 0px;
        transform: translateY(100%);
        border-bottom: 1px solid var(--primary-color);
        border-right: 1px solid var(--primary-color);
        border-left: 1px solid var(--primary-color);
        border-radius: 0 0 5px 5px;
        max-height: 300px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--scrollbar-color);
            border-radius: 10px;
        }
        .empty{
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .title {
            color: var(--primary-color);
            font-size: 15px;
        }

        .history-list {
            display: flex;
            flex-wrap: wrap;
            position: relative;

            .item {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border-radius: 10px;
                cursor: pointer;
                padding: 5px 10px;
                background-color: var(--bg-color-5);
                margin-right: 5px;
                position: relative;
                padding-right: 25px;

                i {
                    position: absolute;
                    top: 50%;
                    right: 5px;
                    transform: translateY(-50%);
                    color: var(--text-color-2);

                    &:hover {
                        color: var(--primary-color)
                    }
                }
            }

        }
    }
}

/* 650px以上的样式*/
@media screen and (min-width:651px) {
    .search-container {
        .search-history-container {


            .title {
                margin: 0 10px;
                position: relative;
                top: 5px;
            }

            padding: 0;

            .history-list {
                flex-direction: column;

                .item {
                    max-width: none;
                    width: 100%;
                    background-color: inherit;
                    border-radius: 0px;
                    margin: 0;
                    transition: var(--time-normal);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    &:hover {
                        background-color: var(--bg-color-4);
                        color: var(--primary-color);
                    }

                    &:hover i {
                        display: block;
                    }

                    i {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>