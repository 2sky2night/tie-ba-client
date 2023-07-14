<template>
  <div :style="{ top: top + 'px', left: left + 'px' }" class="user-card-container" @mouseleave="onHandleLeave"
    @mouseenter="onHandleMouseEnter">
    <template v-if="userData">
      <div class="header mb-10">
        <div class="username">
          <img :src="userData.avatar">
          <div class="ml-10">{{ userData.username }}</div>
        </div>
        <div class="sub-text">收到赞:<span>{{ formatCount(userData.like_count) }}</span></div>
      </div>
      <div class="desc sub-text mb-10">这个人很懒,简介都不写~</div>
      <div class="data mb-10">
        <div class="item mr-10">
          <span>粉丝:</span>
          <span>{{ formatCount(userData.fans_count) }}</span>
        </div>
        <div class="item">
          <span>关注:</span>
          <span>{{ formatCount(userData.follow_count) }}</span>
        </div>
      </div>
      <div class="btns">
        <follow-btn class="mr-5" :uid="userData.uid" v-model:is-followed="userData.is_follow" :is-fans="userData.is_fans"
          size="medium">
        </follow-btn>
        <n-button size='medium' type="primary" :onClick="onHandleGoUser">主页</n-button>
      </div>
    </template>
    <template v-else>
      <div class="load">
        <span class="mr-10">正在加载</span>
        <n-spin></n-spin>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getUserBrieflyInfoAPI } from '@/apis/public/user';
// hooks
import { ref, onBeforeMount } from 'vue'
import useNavigation from '@/hooks/useNavigation';
// types
import { UserCardResponse } from '@/apis/public/user/types';
// utils
import { formatCount } from '@/utils/tools'

const { goUser } = useNavigation()
// props
const props = defineProps<{
  /**
   * 用户id
   */
  uid: number;
  /**
   * 是否显示卡片
   */
  show: boolean;
  top: number;
  left: number;
}>()
// 用户信息
const userData = ref<UserCardResponse | null>(null)
// emit
const emit = defineEmits<{
  'update:show': [ value: boolean ]
}>()
// 当前是否移入卡片?
const isMouseOn = ref(false)

// 鼠标移入的回调
const onHandleMouseEnter = () => {
  isMouseOn.value = true
}
// 获取用户信息
async function getUserData () {
  const res = await getUserBrieflyInfoAPI(props.uid)
  userData.value = res.data
}
// 鼠标移出的回调
const onHandleLeave = () => {
  isMouseOn.value = false
  emit('update:show', false)
}
// 进入用户页
const onHandleGoUser = () => {
  if (userData.value) {
    goUser(userData.value.uid)
  }
}

onBeforeMount(getUserData)

defineExpose({
  isMouseOn
})
defineOptions({
  name: 'UserCard'
})
</script>

<style scoped lang='scss'>
.user-card-container {
  position: absolute;
  padding: 10px;
  background-color: var(--bg-color-1);
  box-shadow: 0 0 10px var(--shadow-color-1);
  height: 180px;
  width: 280px;
  z-index: 100;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .load {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .username {
      display: flex;
      align-items: center;

      img {
        cursor: pointer;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }

  .data {
    display: flex;
  }

  .btns {
    display: flex;
    justify-content: space-around;

    :deep(.auth-btn-container) {
      flex-grow: 1;

      .n-button {
        width: 100%;
      }
    }

    :deep(.n-button) {
      flex-grow: 1;
      font-size: 12px;
    }
  }
}
</style>