<template>
  <div class="page-container">
    <template v-if="userInfor">
      <div class="user-info-container">
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
              <div class="mr-10 data-item">来到贴吧:<span>{{ getTempDays(userInfor.createTime) }}</span></div>
              <div class="text mr-10 data-item" @click="onHandleToFollow">关注: <span>{{ userInfor.follow_count }}</span></div>
              <div class="text mr-10 data-item" @click="onHandleToFans">粉丝: <span>{{ userInfor.fans_count }}</span></div>
            </div>
            <n-button size="small" text style="font-size: 13px;" @click="onHandleShowMore">更多信息</n-button>
          </div>
          <div class="edit">
            <n-button @click="goEdit" size="small" type="primary">
              <span style="font-size: 12px; ">
                修改信息
              </span>
              <n-icon style="position: relative;top:0px;left: 5px;">
                <AngleRight />
              </n-icon>
            </n-button>
          </div>
        </div>
      </div>
      <UserViews :uid="userInfor.uid" />
    </template>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getUserInfoAPI } from '@/apis/my'
// types
import { UserInfoResponse } from '@/apis/my/types'
// hooks
import { ref, onBeforeMount, computed } from 'vue'
import useNavigation from '@/hooks/useNavigation'
// components
import { AngleRight } from '@vicons/fa'
import userDataModal from '@/render/modal/message/userData'
import UserViews from '@/components/common/UserViews/index.vue'
// utils
import { getTempDays } from '@/utils/tools'

// 用户信息
const userInfor = ref<UserInfoResponse | null>(null)
// 导航
const { goEdit,goFans,goFollow } = useNavigation()
// 收到的赞
const total = computed(() => {
  if (userInfor.value) {
    return userInfor.value.comment.comment_liked_count + userInfor.value.article.article_liked_count
  }
  return 0
})

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

onBeforeMount(async () => {
  try {
    const res = await getUserInfoAPI()
    userInfor.value = res.data
  } catch (error) {
    console.log(error)
  }
})

defineOptions({
  name: 'My'
})
</script>

<style scoped lang='scss'>
.page-container {
  .user-info-container {
    display: flex;
    border-bottom: 1px solid var(--border-color-1);
    padding-bottom: 20px;

    .user-data {
      position: relative;
      padding: 10px 0;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .desc {
        box-sizing: border-box;
        padding-right: 90px;
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
      border-bottom: none;
      padding-bottom: 0;

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