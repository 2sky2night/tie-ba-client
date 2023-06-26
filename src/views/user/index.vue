<template>
  <div class="page-container">
    <div class="user-info-container" v-if="!isLoading && userInfor">
      <div class="image">
        <n-image :src="userInfor.avatar" />
      </div>
      <div class="user-data">
        <div class="username">
          <div class="title">{{ userInfor.username }}</div>
          <div>收到的赞:{{ total }}</div>
        </div>
        <div class="desc">
          简介:这个人很懒,连简介都不写~
        </div>
        <div class="data">
          <div style="display: flex;">
            <div class="text mr-10 data-item">关注: <span>{{ userInfor.follow_count }}</span></div>
            <div class="text mr-10 data-item">粉丝: <span>{{ userInfor.fans_count }}</span></div>
            <div class="text mr-10 data-item">帖子: <span>{{ userInfor.article.article_count }}</span></div>
          </div>
          <n-button size="small" text style="font-size: 13px;" @click="onHandleShowMore">更多信息</n-button>
        </div>
        <div class="edit">
          <n-button :title="userInfor.is_followed ? '取消关注' : '关注'" :loading="followLoading" @click="toToggleFollowUser"
            size="small" :type="status ? 'primary' : 'default'">
            <span style="font-size: 12px; ">
              {{ status === 1 ? '互相关注' : status === 2 ? '已关注' : '关注' }}
            </span>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getUserProfileAPI } from '@/apis/user'
import { followUserAPI, cancelFollowUserAPI } from '@/apis/public/user'
// types
import { UserProfileResponse } from '@/apis/user/types'
// hooks
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useMessage } from 'naive-ui'
import useUserStore from '@/store/user'
import userDataModal from '@/render/modal/message/userData'

// 用户信息
const userInfor = ref<UserProfileResponse | null>(null)
// 路由元数据
const route = useRoute()
// 路由对象
const router = useRouter()
// 收到的赞
const total = computed(() => {
  if (userInfor.value) {
    return userInfor.value.comment.comment_liked_count + userInfor.value.article.article_liked_count
  }
  return 0
})
// 消息组件
const message = useMessage()
// 正在加载
const isLoading = ref(true)
const followLoading = ref(false)
// 用户仓库
const userStore = useUserStore()
// 关注状态
const status = computed(() => {
  if (userInfor.value) {
    if (userInfor.value.is_fans && userInfor.value.is_followed) {
      // 互相关注
      return 1
    } else if (userInfor.value.is_followed) {
      // 已关注
      return 2
    } else {
      return 0
    }

  } else {
    return 0
  }
})

/**
 * 获取用户信息
 * @param uid 
 */
const toGetUserData = async (uidString: string) => {
  try {
    const uid = +uidString
    if (isNaN(uid)) {
      message.error('参数非法!')
      await Promise.reject()
    } else if (userStore.userData.uid === uid) {
      // 若当前用户访问我的页面,重定向到我的页面
      router.replace('/my')
      return
    }
    isLoading.value = true
    const res = await getUserProfileAPI(uid)
    userInfor.value = res.data
    isLoading.value = false
  } catch (error) {
    router.push({ path: '/', replace: true })
  }
}

/**
 * 展示用户更多信息
 */
const onHandleShowMore = () => {
  if (userInfor.value) {
    userDataModal({
      article: userInfor.value.article,
      bar: userInfor.value.bar,
      comment: userInfor.value.comment
    })
  }
}

/**
 * 关注和取消关注用户
 */
const toToggleFollowUser = async () => {
  try {

    followLoading.value = true

    if (!userStore.isLogin) {
      message.warning('请先登录!')
      return
    }

    if (userInfor.value) {
      const uid = userInfor.value.uid
      if (userInfor.value.is_followed) {
        // 当前关注了用户 则取消关注
        const res = await cancelFollowUserAPI(uid)
        if (res.code === 200) {
          // 取关成功 设置关注状态
          userInfor.value.is_followed = false
          message.success('取消关注成功!')
        }
      } else {
        // 当前未关注用户 则关注用户
        const res = await followUserAPI(uid)
        if (res.code === 200) {
          // 关注成功 设置关注状态
          userInfor.value.is_followed = true
          message.success('关注成功!')
        }
      }
    }

  } finally {
    followLoading.value = false
  }
}

// 初始化加载
onBeforeMount(() => toGetUserData(route.query.uid as string))

// 路由更新时
onBeforeRouteUpdate((to) => {
  if (to.query.uid) {
    toGetUserData(to.query.uid as string)
  } else {
    message.warning('未携带参数!')
    router.push({ path: '/', replace: true })
  }
})

defineOptions({
  name: 'User'
})
</script>

<style scoped lang='scss'>
.page-container {
  padding: 20px;

  .user-info-container {
    display: flex;

    .user-data {
      position: relative;
      padding: 10px 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .desc {
        box-sizing: border-box;
        padding-right: 80px;
      }

      .username {
        .title {
          font-size: 20px;
          font-weight: 600;
        }

        display: flex;
        justify-content: space-between;
      }

      .data {
        align-items: center;
        display: flex;
        justify-content: space-between;

        .data-item {
          font-size: 14px;
        }
      }

      .edit {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .image {
      width: 150px;
      height: 150px;
      margin-right: 30px;
    }
  }
}

@media screen and (max-width:650px) {
  .page-container {
    .user-info-container {
      flex-direction: column;
      align-items: center;

      .image {
        border-radius: 50%;
        overflow: hidden;
      }

      .user-data {
        width: 100%;
        height: 150px;
        font-size: 13px;

        .data {
          .data-item {
            font-size: 13px;
          }
        }
      }
    }
  }
}
</style>