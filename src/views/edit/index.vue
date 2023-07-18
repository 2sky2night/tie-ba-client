<template>
    <div class="page-container">
        <div class="page-title mb-10">编辑</div>
        <n-tabs :type="tabTypes" animated>
            <n-tab-pane name="info" tab="用户信息">
                <Info :is-mobile="isMobile" />
            </n-tab-pane>
            <n-tab-pane name="password" tab="用户密码">
                <Password :is-mobile="isMobile" />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted, onBeforeUnmount } from 'vue'
import useIsMobile from '@/hooks/useIsMobile'
// components
import Password from './components/Password.vue'
import Info from './components/Info.vue'

const isMobile=useIsMobile()
// 当前tabs标签的样式
const tabTypes = ref<'segment' | 'card'>('segment')

onMounted(() => {
    function setTabType () {
        if (window.innerWidth > 650) {
            tabTypes.value = 'card'
        } else {
            tabTypes.value = 'segment'
        }
    }
    setTabType()
    window.addEventListener('resize', setTabType)
    onBeforeUnmount(() => {
        window.removeEventListener('resize', setTabType)
    })
})

defineOptions({
    name: 'Edit'
})
</script>