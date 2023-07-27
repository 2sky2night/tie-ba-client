<template>
  <div class="page-container" ref="pageDOM" @click.capture="onHandleClickCapture">
    <template v-if="loadMoreHight !== null">
      <div class="load-more-tips" :style="{ height: loadMoreHight + 'px' }">
        <div v-if="loadMoreHight < 50">继续下拉😘</div>
        <div v-else>松手刷新😍</div>
      </div>
    </template>
    <transition name="new">
      <div v-if="hasNewArticle" class="new-article-tips">
        <span class="mr-10">有新帖子了✨!</span>
        <span class="refresh" @click="onHandleRefresh">刷新</span>
      </div>
    </transition>
    <div class="article-list-container">
      <template v-if="pagination.isFirstLoading">
        <article-list-skeleton :length="pagination.pageSize"></article-list-skeleton>
      </template>
      <template v-else>
        <template v-if="list.length">
          <div class="list">
            <article-item v-for="item in list" :article="item" v-model:isLiked="item.is_liked"
              v-model:isStar="item.is_star" v-model:starCount="item.star_count"
              v-model:likeCount="item.like_count"></article-item>
          </div>
          <div class="spin" v-if="pagination.isLoading">
            <span class="sub-text mr-10">正在加载</span>
            <n-spin size="small" />
          </div>
          <div class="divier" v-if="!pagination.hasMore"><span class="sub-text">没有更多了</span></div>
        </template>
        <div class="empty" v-else>
          <empty></empty>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang='ts' setup>
//apis
import { getArticleListAPI } from '@/apis/home';
// hooks
import { onBeforeRouteLeave } from 'vue-router';
import { reactive, inject, type Ref, onMounted, onBeforeUnmount, watch, onDeactivated, onActivated, ref } from 'vue'
// types
import { ArticleItem as ItemType } from '@/apis/public/types/article';
// utils
import { publish } from 'pubsub-js';

// 页面DOM
const pageDOM = ref<HTMLDivElement | null>(null)
// 帖子列表
const list = reactive<ItemType[]>([])
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  isLoading: false,
  hasMore: false,
  isFirstLoading: false
})
// 是否离开了该页面
let isLeaveThisPage = false
// 是否为下拉动作
let isPullDown = false
// 是否滚动到了底部
const isBottom = inject<Ref<boolean>>('isBottom')
// 是否滚动到了顶部
const isTop = inject<Ref<boolean>>('isTop')
// 显示下拉加载更多的高度
const loadMoreHight = ref<number | null>(null)
// 首次进入页面
let isFirstEnter = true
// 是否有新帖子发送了?
const hasNewArticle = ref(false)

// 监听是否滚动到底部
if (isBottom) {
  watch(isBottom, (v) => {

    if (pagination.isLoading || isLeaveThisPage) {
      // 若当前已经离开了该帖子或正在加载 则禁止加载数据
      return
    }

    if (v) {
      // 若滚动到底部
      pagination.page++
      getArticleList()
    }

  })
}

/**
 * 1.开启滚动条监听（是否滚动到底部） 滚动到底部就加载更多数据 若无更多数据就取消监听
 * 2.开启滚动条监听（是否滚动到顶部） 可以实时获取到主视图是否滚动到了顶部没
 * 3.在顶部进行下拉操作可以进行下拉刷新更多数据，若鼠标按下时的y坐标与滑动时的y坐标要小则为下拉操作，若大于50px就为刷新页面获取最新数据
 * 4.第n次（n>1）进入进入页面时 都会向服务器获取最新的帖子 来判断是否有新帖子发送了，提示用户可以点击刷新页面获取最新帖子
 */

// 获取帖子列表的函数
async function getArticleList () {
  pagination.isLoading = true
  const res = await getArticleListAPI(pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.hasMore = res.data.has_more
  pagination.isLoading = false
  if (pagination.hasMore === false) {
    publish('watchScroll', false)
  }
}

// 点击页面的回调
const onHandleClickCapture = (e: Event) => {
  if (isPullDown) {
    // 是下拉动作 禁止执行后代的点击事件
    e.stopPropagation()
  }
}

// 鼠标按下时的回调
const onHandleMouseDown = (e1: MouseEvent) => {
  // 按下时重置下拉动作 必须满足下拉动作时才能阻止后代的点击事件执行
  isPullDown = false

  if (!isTop?.value) {
    // 未在顶部触发按下操作 则不需要执行下拉加载更多数据
    console.log('未在顶部进行了按下操作');
    return
  }
  // 在顶部触发了按下操作
  // 记录鼠标按下时的y坐标 来判断在移动鼠标时是否为下拉动作的阈值
  // 给页面绑定鼠标移动的事件回调 若用户鼠标往下移动则为下拉操作
  const downY = e1.pageY
  // 是否下拉到50px以上
  let toLoad = false

  // 鼠标移动时的回调
  const onHandleMouseMove = (e2: MouseEvent) => {
    // 按下且鼠标开始移动则为滑动的动作
    isPullDown = true
    // 记录移动时的鼠标Y坐标
    const moveY = e2.pageY
    const temp = downY - moveY
    if (temp >= 0) {
      console.log('上拉操作');
      toLoad = false
      loadMoreHight.value = null
      return
    }
    // console.log('下拉操作');

    // 调整加载容器的高度
    loadMoreHight.value = -temp <= 50 ? -temp : 50

    // 拉下到一定程度 松手即可重新加载页面
    if (-temp >= 50) {
      toLoad = true
    } else {
      toLoad = false
    }

  }

  // 鼠标松手时的回调
  const onHandleMouseUp = async () => {
    (pageDOM.value as HTMLDivElement).removeEventListener('mousemove', onHandleMouseMove);
    (pageDOM.value as HTMLDivElement).removeEventListener('mouseleave', onHandleMouseLeave);
    (pageDOM.value as HTMLDivElement).removeEventListener('mouseup', onHandleMouseUp);

    loadMoreHight.value = null

    if (toLoad) {
      console.log('满足下拉50px且松手了,重新加载页面');
      // 隐藏新帖子提示
      hasNewArticle.value = false
      // 加载更多数据
      onHandleResetPage()
    } else {
      console.log('不满足下拉50px且松手了');
    }

  }

  // 鼠标离开时的回调
  const onHandleMouseLeave = () => {
    loadMoreHight.value = null;
    (pageDOM.value as HTMLDivElement).removeEventListener('mousemove', onHandleMouseMove);
    (pageDOM.value as HTMLDivElement).removeEventListener('mouseup', onHandleMouseUp);
    (pageDOM.value as HTMLDivElement).removeEventListener('mouseleave', onHandleMouseLeave);
  }

  // 给页面DOM绑定鼠标事件
  (pageDOM.value as HTMLDivElement).addEventListener('mousemove', onHandleMouseMove);
  // 解除副作用的事件监听
  (pageDOM.value as HTMLDivElement).addEventListener('mouseup', onHandleMouseUp);
  (pageDOM.value as HTMLDivElement).addEventListener('mouseleave', onHandleMouseLeave);
}

// 手指按下时的回调
const onHandleTouchStar = (e1: TouchEvent) => {
  // 重置下拉操作
  isPullDown = false

  if (!isTop?.value) {
    // 未在顶部触发按下操作 则不需要执行下拉加载更多数据
    console.log('未在顶部进行了按下操作');
    return
  }


  const downY = e1.touches[ 0 ].pageY

  // 是否下拉到50px以上
  let toLoad = false

  // 手指移动的回调
  const onHandleTouchMove = (e2: TouchEvent) => {
    // 在滑动了
    isPullDown = true

    // 记录滑动时的位置
    const moveY = e2.touches[ 0 ].pageY
    // 记录滑动的相距差
    const temp = downY - moveY

    if (temp >= 0) {
      console.log('上拉操作');
      toLoad = false
      loadMoreHight.value = null
      return
    }

    // 调整加载容器的高度
    loadMoreHight.value = -temp <= 50 ? -temp : 50
    if (-temp >= 50) {
      // 下拉到50px以上了 则可以加载更多数据
      toLoad = true
    } else {
      toLoad = false
    }
  }

  // 手指抬起时的回调
  const onHandleTouchEnd = async () => {
    (pageDOM.value as HTMLDivElement).removeEventListener('touchmove', onHandleTouchMove);
    (pageDOM.value as HTMLDivElement).removeEventListener('touchend', onHandleTouchEnd);
    (pageDOM.value as HTMLDivElement).removeEventListener('touchcancel', onHandleTouchCancel);
    loadMoreHight.value = null
    if (toLoad) {
      console.log('满足下拉50px且松手了,重新加载页面');
      // 隐藏新帖子提示
      hasNewArticle.value = false
      // 加载更多数据
      onHandleResetPage()
    } else {
      console.log('不满足下拉50px且松手了');
    }
  }

  // 手指取消移动的回调
  const onHandleTouchCancel = () => {
    (pageDOM.value as HTMLDivElement).removeEventListener('touchmove', onHandleTouchMove);
    (pageDOM.value as HTMLDivElement).removeEventListener('touchend', onHandleTouchEnd);
    (pageDOM.value as HTMLDivElement).removeEventListener('touchcancel', onHandleTouchCancel);
  }

  // 绑定事件回调
  (pageDOM.value as HTMLDivElement).addEventListener('touchmove', onHandleTouchMove);
  (pageDOM.value as HTMLDivElement).addEventListener('touchend', onHandleTouchEnd);
  (pageDOM.value as HTMLDivElement).addEventListener('touchcancel', onHandleTouchCancel);

}

// 重置页码 获取最新数据
const onHandleResetPage = async () => {
  pagination.isFirstLoading = true
  list.length = 0
  pagination.page = 1
  publish('watchScroll', true)
  await getArticleList()
  pagination.isFirstLoading = false
}

// 当前列表的第一条帖子与服务器中最新的帖子的发帖时间进行比较
const toGetNewestArticle = async () => {
  const { data: { list: serverList } } = await getArticleListAPI(1, 1, true)
  // 服务器最新的帖子时间
  if (serverList.length && list.length) {
    // 新帖时间
    const newestTime = +new Date(serverList[ 0 ].createTime)
    // 当前列表中首个帖子的时间
    const firstTime = +new Date(list[ 0 ].createTime)
    if (newestTime > firstTime) {
      // 有新帖子了!
      return true
    }
  }
  return false
}

// 点击刷新获取新帖子的回调
const onHandleRefresh = () => {
  hasNewArticle.value = false
  onHandleResetPage()
}

onMounted(async () => {
  // 开启下滑事件监听
  pageDOM.value?.addEventListener('mousedown', onHandleMouseDown)
  pageDOM.value?.addEventListener('touchstart', onHandleTouchStar)
  // 加载数据
  pagination.isFirstLoading = true
  // 由active钩子开启滚动条的监听
  // 下滑底部滚动条的监听
  // publish('watchScroll', true)
  // 上滑顶部滚动条的监听
  // publish('watchScrollForHome', true)
  await getArticleList()
  pagination.isFirstLoading = false
})

// 缓存该页面
onDeactivated(() => {
  publish('watchScrollForHome', false)
  publish('watchScroll', false)
  isLeaveThisPage = true
  // 重置有无新帖子
  hasNewArticle.value = false
  // 后续进入页面就不再是第一次进入了
  if (isFirstEnter) {
    isFirstEnter = false
  }
})

// 激活该页面
onActivated(async () => {
  if (isFirstEnter || pagination.hasMore) {
    // 若在激活页面时还有更多就可以加载更多数据或在首次访问该页面时
    publish('watchScroll', true)
  }
  publish('watchScrollForHome', true)
  isLeaveThisPage = false
  if (isFirstEnter === false) {
    // 不是第一次进入该页面 则判断当前第一条帖子与服务器最新的帖子创建时间进行比较 提醒用户刷新页面
    hasNewArticle.value = await toGetNewestArticle()
  }
})

// 离开之前
onBeforeRouteLeave(() => {
  publish('leaveHome')
})

// 组件卸载时 取消主视图滚动条监听
onBeforeUnmount(() => {
  if (pagination.hasMore === false) {
    publish('watchScroll', false)
  }
  pageDOM.value?.removeEventListener('mousedown', onHandleMouseDown)
  pageDOM.value?.removeEventListener('touchstart', onHandleTouchStar)
})

defineOptions({
  name: 'Home'
})
</script>

<style scoped lang='scss'>
.page-container {
  position: relative;

  .new-article-tips {
    background-color: var(--primary-color);
    margin: 0 -10px;
    margin-top: -10px;
    padding: 5px 0;
    color: #fff;
    font-size: 12px;

    .refresh {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .load-more-tips,
  .new-article-tips {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .divier {
    text-align: center;
    padding: 10px;
    position: relative;
    overflow: hidden;

    &::after,
    &::before {
      position: absolute;
      content: '';
      display: inline-block;
      height: 1px;
      background-color: var(--border-color-1);
      width: 100%;
      top: 50%;
    }

    &::after {
      margin-left: 10px;
    }

    &::before {
      transform: translateX(-100%);
      margin-left: -20px;
    }
  }

  .empty {
    padding-top: 100px;
  }

  .spin {
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.new-enter-active {
  animation: newMove var(--time-normal) ease 1;
}

.new-leave-active {
  animation: newMove var(--time-normal) ease 1 reverse;
  position: absolute;
  left: 0;
  right: 0;
}

@keyframes newMove {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: none;
  }
}

@media screen and (min-width:651px) {
  .page-container {
    .new-article-tips {
      margin-top: -20px;
    }
  }
}
</style>