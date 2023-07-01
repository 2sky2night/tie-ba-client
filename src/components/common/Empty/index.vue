<template>
    <div class="empty-container">
        <n-empty description="没有内容哟">
            <template #extra>
                <n-button size="small" @click="goHome">
                    看看别的
                </n-button>
            </template>
        </n-empty>
    </div>
</template>

<script lang='ts' setup>
import useNavigation from '@/hooks/useNavigation';

const {goHome} = useNavigation()

defineOptions({
    name:'Empty'
})
</script>

<style scoped lang='scss'>
.empty-container{
    padding: 20px 0;
}
</style>