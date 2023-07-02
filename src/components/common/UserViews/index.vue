<template>
  <div class="user-views-container" :class="{ 'vertical': isVertical }">
    <n-tabs default-value="post-article" type="line" :size="isVertical ? 'medium' : 'small'"
      :placement="isVertical ? 'left' : 'top'">
      <n-tab-pane name="post-article">
        <template #tab>
          <span class="tab-title">
            发送的帖子
          </span>
        </template>
        <template #default>
          <article-list-load :get-data-cb="toGetUserArticle" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="like-article">
        <template #tab>
          <span class="tab-title">
            点赞的帖子
          </span>
        </template>
        <template #default>
          <article-list-load :get-data-cb="toGetLikeArticle" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="star-article">
        <template #tab>
          <span class="tab-title">
            收藏的帖子
          </span>
        </template>
        <template #default>
          <article-list-load :get-data-cb="toGetStarArticle" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="follow-bar">
        <template #tab>
          <span class="tab-title">
            关注的吧
          </span>
        </template>
        <template #default>
          <bar-list-load :get-data-cb="toGetFollowBar" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="create-bar">
        <template #tab>
          <span class="tab-title">
            创建的吧
          </span>
        </template>
        <template #default>
          <bar-list-load :get-data-cb="toGetUserBar" />
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted, onUnmounted } from 'vue'
// types
import type { UserViewsProps } from '@/types/components/common'
// apis
import { getUserPostArticleListAPI, getUserLikeArticleListAPI, getUserStarArticleListAPI, getUserCreateBarListAPI, getUserFollowBarListAPI } from '@/apis/public/user';

// 自定义属性
const props = defineProps<UserViewsProps>()
// tab栏是否垂直排列
const isVertical = ref(false)
// 根据视口宽度调整tab栏排列方式
const tabOrder = () => {
  if (window.innerWidth > 650) {
    isVertical.value = true
  } else {
    isVertical.value = false
  }
}

/**
 * 获取用户发送的帖子
 * @param page 
 * @param pageSize 
 * @param desc 
 */
async function toGetUserArticle(page: number, pageSize: number, desc: boolean) {
  try {
    const res = await getUserPostArticleListAPI(props.uid, page, pageSize, desc)
    return Promise.resolve(res.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 获取用户点赞的帖子
 * @param page 
 * @param pageSize 
 * @param desc 
 */
async function toGetLikeArticle(page: number, pageSize: number, desc: boolean) {
  try {
    const res = await getUserLikeArticleListAPI(props.uid, page, pageSize, desc)
    return Promise.resolve(res.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 获取用户收藏的帖子
 * @param page 
 * @param pageSize 
 * @param desc 
 */
async function toGetStarArticle(page: number, pageSize: number, desc: boolean) {
  try {
    const res = await getUserStarArticleListAPI(props.uid, page, pageSize, desc)
    return Promise.resolve(res.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 获取用户创建的吧
 * @param page 
 * @param pageSize 
 * @param desc 
 */
async function toGetUserBar(page: number, pageSize: number, desc: boolean) {
  try {
    const res = await getUserCreateBarListAPI(props.uid, page, pageSize, desc)
    return Promise.resolve(res.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 获取用户关注的吧
 * @param page 
 * @param pageSize 
 * @param desc 
 */
async function toGetFollowBar(page: number, pageSize: number, desc: boolean) {
  try {
    const res = await getUserFollowBarListAPI(props.uid, page, pageSize, desc)
    return Promise.resolve(res.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

onMounted(() => {
  // 开启事件监听 若视口宽度小于650就让tab栏水平排列
  tabOrder()
  window.addEventListener('resize', tabOrder)
})

// 组件被卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', tabOrder)
})

defineOptions({
  name: 'UserViews'
})
</script>

<style scoped lang='scss'>
.user-views-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  .tab-title {
    font-size: 13px;
  }

  &.vertical {
    .tab-title {
      font-size: 15px;
    }
  }
}
</style>