<template>
  <div class="page-container">
    <template v-if="!isLoading && userInfor">
      <div class="user-info-container">
        <div class="image">
          <img v-imgPre="userInfor.avatar" :src="userInfor.avatar" />
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
              <div class="mr-10 data-item">来到贴吧:<span>{{ getTempDays(userInfor.createTime) }}</span></div>
              <div class="text mr-10 data-item" @click="onHandleToFollow">关注: <span>{{ userInfor.follow_count }}</span></div>
              <div class="text mr-10 data-item" @click="onHandleToFans">粉丝: <span>{{ userInfor.fans_count }}</span></div>
            </div>
            <n-button size="small" text style="font-size: 13px;" @click="onHandleShowMore">更多信息</n-button>
          </div>
          <div class="edit">
            <FollowBtn :uid="userInfor.uid" size="small" :is-fans="userInfor.is_fans"
              v-model:isFollowed="userInfor.is_followed" />
          </div>
        </div>
      </div>
      <UserViews :uid="userInfor.uid" />
    </template>
    <UserSkeleton v-else />
  </div>
</template>

<script lang='ts' setup>
// apis
import { getUserProfileAPI } from '@/apis/user'
// types
import { UserProfileResponse } from '@/apis/user/types'
// hooks
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useMessage } from 'naive-ui'
import useUserStore from '@/store/user'
import userDataModal from '@/render/modal/message/userData'
import useNavigation from '@/hooks/useNavigation'
// components
import UserViews from '@/components/common/UserViews/index.vue'
import UserSkeleton from '@/components/skeleton/views/UserSkeleton.vue'
// config
import tips from '@/config/tips'
// utils
import { getTempDays } from '@/utils/tools'

const { goFans, goFollow } = useNavigation()
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
// 用户仓库
const userStore = useUserStore()


/**
 * 获取用户信息
 * @param uid 
 */
const toGetUserData = async (uidString: string) => {
    const uid = +uidString
    if (isNaN(uid)) {
      message.error(tips.errorParams)
      return
    } else if (userStore.userData.uid === uid) {
      // 若当前用户访问我的页面,重定向到我的页面
      router.replace('/my')
      return
    }
    isLoading.value = true
    const res = await getUserProfileAPI(uid)
    userInfor.value = res.data
    isLoading.value = false
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
 * 去关注页
 */
const onHandleToFollow = () => {
  if (userInfor.value) {
    goFollow(userInfor.value.uid)
  }
}

/**
 * 去粉丝页
 */
const onHandleToFans = () => {
  if (userInfor.value) {
    goFans(userInfor.value.uid)
  }
}

// 初始化加载
onBeforeMount(() => toGetUserData(route.params.uid as string))

// 路由更新时
onBeforeRouteUpdate((to) => {
  if (to.params.uid) {
    toGetUserData(to.params.uid as string)
  } else {
    message.warning(tips.emptyParams)
    router.push({ path: '/', replace: true })
  }
})

defineOptions({
  name: 'User'
})
</script>

<style scoped lang='scss'>
.page-container {

  .user-info-container {
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color-1);

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
      cursor: pointer;
      height: 150px;
      margin-right: 30px;
      img{
        height: 100%;
        height: 100%;
      }
    }
  }
}

@media screen and (max-width:650px) {
  .page-container {
    .user-info-container {
      flex-direction: column;
      align-items: center;
      border: none;
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