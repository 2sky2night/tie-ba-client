<template>
  <div class="user-views-container" :class="{ 'vertical': isVertical }">
    <n-tabs animated type="line" :size="isVertical ? 'medium' : 'small'" :placement="isVertical ? 'left' : 'top'">
      <n-tab-pane name="post-article">
        <template #tab>
          <span class="tab-title">
            发送的帖子
          </span>
        </template>
        <template #default>
          <ArticleItemVue v-for=" item  in articleList" :article="item" :key="item.aid" v-model:isLiked="item.is_liked" v-model:likeCount="item.like_count" v-model:starCount="item.star_count" v-model:isStar="item.is_star" />
        </template>
      </n-tab-pane>
      <n-tab-pane name="like-article">
        <template #tab>
          <span class="tab-title">
            点赞的帖子
          </span>
        </template>
        <template #default>
          我这辈子最疯狂的事，发生在我在 Amazon
          当软件工程师的时候，故事是这样的：<br><br>
          那时我和女朋友住在一起，正在家里远程工作。忽然同事给我发来了紧急消息：”我们的服务出现了
          SEV 2 级别的故障！需要所有的人马上协助！“我们组的应用全挂掉了。<br><br>
          当我还在费力的寻找修复方法的时候，忽然闻到隔壁房间的的焦味，防火报警器开始鸣叫。
        </template>
      </n-tab-pane>
      <n-tab-pane name="star-article">
        <template #tab>
          <span class="tab-title">
            收藏的帖子
          </span>
        </template>
        <template #default>
          我这辈子最疯狂的事，发生在我在 Amazon
          当软件工程师的时候，故事是这样的：<br><br>
          那时我和女朋友住在一起，正在家里远程工作。忽然同事给我发来了紧急消息：”我们的服务出现了
          SEV 2 级别的故障！需要所有的人马上协助！“我们组的应用全挂掉了。<br><br>
          当我还在费力的寻找修复方法的时候，忽然闻到隔壁房间的的焦味，防火报警器开始鸣叫。
        </template>
      </n-tab-pane>
      <n-tab-pane name="follow-bar">
        <template #tab>
          <span class="tab-title">
            关注的吧
          </span>
        </template>
        <template #default>
          我这辈子最疯狂的事，发生在我在 Amazon
          当软件工程师的时候，故事是这样的：<br><br>
          那时我和女朋友住在一起，正在家里远程工作。忽然同事给我发来了紧急消息：”我们的服务出现了
          SEV 2 级别的故障！需要所有的人马上协助！“我们组的应用全挂掉了。<br><br>
          当我还在费力的寻找修复方法的时候，忽然闻到隔壁房间的的焦味，防火报警器开始鸣叫。
        </template>
      </n-tab-pane>
      <n-tab-pane name="create-bar">
        <template #tab>
          <span class="tab-title">
            创建的吧
          </span>
        </template>
        <template #default>
          我这辈子最疯狂的事，发生在我在 Amazon
          当软件工程师的时候，故事是这样的：<br><br>
          那时我和女朋友住在一起，正在家里远程工作。忽然同事给我发来了紧急消息：”我们的服务出现了
          SEV 2 级别的故障！需要所有的人马上协助！“我们组的应用全挂掉了。<br><br>
          当我还在费力的寻找修复方法的时候，忽然闻到隔壁房间的的焦味，防火报警器开始鸣叫。
        </template>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onMounted, onUnmounted, onBeforeMount, reactive } from 'vue'
// types
import type { UserViewsProps } from '@/types/components/common'
import { getUserPostArticleListAPI } from '@/apis/public/user';
import type { ArticleItem } from '@/apis/public/types/article';
import ArticleItemVue from '@/components/item/ArticleItem.vue';

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
const articleList = reactive<ArticleItem[]>([])

onBeforeMount(async () => {
  const res = await getUserPostArticleListAPI(props.uid, 1, 20, true)
  res.data.list.forEach(ele => articleList.push(ele))
})

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