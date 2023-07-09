<template>
    <div class="panel-container">
        <div class="panel-tabs" ref="panelTabs">
            <div class="tab" :key="1" :class="{ 'active': activeTabs === 1 }" @click="() => onHandleActiveTab(1)">评论</div>
            <div class="tab" :key="2" :class="{ 'active': activeTabs === 2 }" @click="() => onHandleActiveTab(2)">点赞</div>
            <div class="tab" :key="3" :class="{ 'active': activeTabs === 3 }" @click="() => onHandleActiveTab(3)">收藏</div>
            <div class="active-line" :style="{ left: lineLeft }"></div>
        </div>
        <div class="panel-container">
            <TransitionGroup :name="animateName">
                <Comment :aid="aid" :key="1" v-if="activeTabs === 1" />
                <Like :aid="aid" :key="2" v-if="activeTabs === 2" />
                <Star :aid="aid" :key="3" v-if="activeTabs === 3" />
            </TransitionGroup>
        </div>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue'
// components
import Comment from './components/Comment/index.vue'
import Like from './components/Like/index.vue'
import Star from './components/Star/index.vue'


defineProps<{ aid: number }>()
// 当前激活的面板
const activeTabs = ref(1)
// 面板切换的面板效果
const animateName = ref<'right' | 'left'>('right')
// tabs容器
const panelTabs = ref<HTMLDivElement | null>(null)
// 激活提示线的left偏移量
const lineLeft = ref('')

// 激活的面板切换时的回调
const onHandleActiveTab = (value: number) => {
    if (value > activeTabs.value) {
        animateName.value = 'right'
    } else {
        animateName.value = 'left'
    }
    activeTabs.value = value
    lineLeft.value = setLineLeft()
}
// 设置line的偏移量
function setLineLeft() {
    if (window.innerWidth < 650) {
        return (activeTabs.value - 1) * 48 + 'px'
    } else {
        if (activeTabs.value < 3) {
            return (activeTabs.value - 1) * 48 + 'px'
        } else {
            return ((panelTabs.value as HTMLDivElement).clientWidth - 48) + 'px'
        }
    }
}
// 开启窗口事件监听 重置line的偏移量
onMounted(() => {
    const handleResize = () => lineLeft.value = setLineLeft()
    handleResize()
    window.addEventListener('resize', handleResize)
    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize)
    })
})

defineOptions({
    name: 'Panel'
})
</script>

<style scoped lang='scss'>
.panel-container {
    .panel-tabs {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid var(--border-color-1);
        position: relative;
        padding-right: 60px;

        .tab {
            padding: 0 10px;
            cursor: pointer;
            transition: var(--time-normal);

            &:nth-child(3) {
                position: absolute;
                right: 0;
            }

            &.active {
                color: var(--primary-color);
            }
        }

        .active-line {
            position: absolute;
            background-color: var(--primary-color);
            height: 2px;
            width: 48px;
            transition: var(--time-normal);
            bottom: -1px;
        }
    }

    .panel-container {
        padding: 10px 0;
        overflow: hidden;
    }
}

.right-enter-active {
    animation: toRight var(--time-normal) 1 ease-in-out;
}

.left-enter-active {
    animation: toLeft var(--time-normal) 1 ease-in-out;
}

@keyframes toRight {
    from {
        transform: translateX(100%);
    }

    to {
        transform: none;
    }
}

@keyframes toLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: none;
    }
}

@media screen and (max-width:651px) {
    .panel-container {
        .panel-tabs {
            padding-right: 0;

            .tab:nth-child(3) {
                position: static;

            }
        }
    }
}
</style>