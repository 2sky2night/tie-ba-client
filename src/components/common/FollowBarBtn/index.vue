<template>
    <auth-btn>
        <n-button :loading="isLoading" :size="size" :type="isFollowed ? 'primary' : 'default'"
            @click.stop="onHandleClick">{{ isFollowed ? '已关注' : '关注' }}</n-button>
    </auth-btn>
</template>

<script lang='ts' setup>
// types
import type { FollowBarBtnProps } from '@/types/components/common'
// apis 
import { followBarAPI, cancelFollowBarAPI } from '@/apis/public/bar'
// hooks
import { useMessage } from 'naive-ui';
import { ref } from 'vue'
// configs
import tips from '@/config/tips';

const isLoading = ref(false)
const message = useMessage()
const props = defineProps<FollowBarBtnProps>()

const emit = defineEmits<{
    'update:isFollowed': [ value: boolean ];
    'update:followCount': [ value: number ];
}>()

const onHandleClick = async () => {
    isLoading.value = true
    try {
        if (props.isFollowed) {
            // 当前为关注
            await cancelFollowBarAPI(props.bid)
            emit('update:followCount', props.followCount - 1)
            message.success(tips.successCancelFollow)
        } else {
            // 当前为未关注
            await followBarAPI(props.bid)
            emit('update:followCount', props.followCount + 1)
            message.success(tips.succeessFollow)
        }
        // 更新状态
        emit('update:isFollowed', !props.isFollowed)
        isLoading.value = false
    } catch (error) {
        console.log(error)
    }
}

defineOptions({
    name: 'FollowBarBtn'
})
</script>