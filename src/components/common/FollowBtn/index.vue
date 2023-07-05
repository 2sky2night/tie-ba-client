<template>
  <auth-btn>
    <n-button :title="isFollowed ? '取消关注' : '关注'" :type="isFollowed ? 'primary' : 'default'" :loading="isLoading"
      :size="size" @click.stop="onHandleClick">{{ followFormat }}</n-button>
  </auth-btn>
</template>

<script lang='ts' setup>
// hooks
import { computed, ref } from 'vue'
import useUserStore from '@/store/user';
import { useMessage } from 'naive-ui';
// types
import type { FollowBtnProps } from '@/types/components/common';
// apis
import { followUserAPI, cancelFollowUserAPI } from '@/apis/public/user';
// configs
import tips from '@/config/tips'

// props
const props = defineProps<FollowBtnProps>()
// emit
const emit = defineEmits<{
  /**
   * 更新关注状态
   */
  'update:isFollowed': [value: boolean];
  /**
   * 粉丝数量增加 flag为真 增加数量 反之减少数量
   */
  'changeCount': [flag: boolean];
}>()
// 用户仓库
const userStore = useUserStore()
// 关注按钮的文本
const followFormat = computed(() => {
  if (props.isFans && props.isFollowed) {
    return '已互粉'
  } else if (props.isFollowed) {
    return '已关注'
  } else {
    return '关注'
  }
})
// 消息api
const message = useMessage()
const isLoading = ref(false)


/**
 * 点击关注按钮的回调
 */
const onHandleClick = async () => {
  try {
    if (userStore.userData && userStore.userData.uid === props.uid) {
      return message.warning(tips.canNotFollowUserSelf)
    }
    isLoading.value = true
    if (props.isFollowed) {
      // 关注了用户 点击则取消关注
      await toCancelFollowUser()
      message.success(tips.successCancelFollow)
      emit('changeCount', false)
    } else {
      // 未关注 点击则关注用户
      await toFollowUser()
      message.success(tips.succeessFollow)
      emit('changeCount', true)
    }
    // 关注或取消关注成功 更新关注状态
    emit('update:isFollowed', !props.isFollowed)
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}


/**
 * 关注用户
 */
const toFollowUser = async () => {
  try {
    const res = await followUserAPI(props.uid)
    if (res.code === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  } catch (error) {
    return Promise.reject()
  }
}

/**
 * 取消关注用户
 */
const toCancelFollowUser = async () => {
  try {
    const res = await cancelFollowUserAPI(props.uid)
    if (res.code === 200) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  } catch (error) {
    return Promise.reject()
  }
}

defineOptions({
  name: 'FollowBtn'
})
</script>

<style scoped lang="scss">
:deep(.n-button){
  font-size: 12px !important;
}
</style>
