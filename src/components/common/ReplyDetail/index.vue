<template>
  <div class="reply-detail-container">
    <!--首次加载时-->
    <template v-if="pagination.isFirstLoading">
      <div class="loading">
        <n-spin :theme-overrides="{ color: '#2080f0' }"></n-spin>
        <span class="mt-5">正在加载...</span>
      </div>
    </template>
    <!--首次加载完成-->
    <template v-if="!pagination.isFirstLoading && comment">
      <div class="reply-detail-content">
        <!--评论详情-->
        <div class="comment-infor mb-10" @click="()=>onHandleSetRid(null)">
          <!--用户信息-->
          <div class="user">
            <div class="user-info">
              <img class="mr-10" :src="'http://127.0.0.1:3000' + comment.user.avatar">
              <span class="text" @click.stop="onHandleGoUser">{{ comment.user.username }}</span>
            </div>
            <div class="like-data">
              <n-icon @click.stop="toLikeComment" size="20" :color="comment?.is_liked ? 'red' : ''">
                <component :is="likeIconString"></component>
              </n-icon>
              <span>{{ formatCount(comment.like_count) }}</span>
            </div>
          </div>
          <div class="content">
            <span class="times">{{ formatDBDateTime(comment.createTime) }}</span>
            <p>{{ comment.content }}</p>
            <div v-if="comment.photo !== null" class="img-list mt-10">
              <img v-imgPre="'http://127.0.0.1:3000' + item" v-for="  item   in comment.photo"
                :src="'http://127.0.0.1:3000' + item">
            </div>
          </div>
        </div>
        <!--回复列表-->
        <div class="reply-list-container">
          <div class="title">
            <span>{{ pagination.total }}条回复</span>
          </div>
          <div class="reply-list">
            <ReplyItem @click="()=>onHandleSetRid(item.rid)" v-for="item in list" :key="item.rid" :reply="item" v-model:is-liked="item.is_liked"
              v-model:like-count="item.like_count" />
          </div>
        </div>
      </div>
      <div class="input-container">
        <n-input :placeholder="placeholderTips"></n-input>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
// api
import { getCommentReplyAPI } from '@/apis/public/article';
// types
import { ReplyItem as Item, CommentItemWithout } from '@/apis/public/types/article';
// hooks
import { reactive, ref, onBeforeMount, computed, inject } from 'vue'
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import router from '@/router';
// components
import ReplyItem from '@/components/item/ReplyItem.vue';
import { NIcon } from 'naive-ui';
import { LikeFilled, LikeOutlined } from '@vicons/antd';
// directives
import imgPre from '@/directives/imgPre';
// utils
import PubSub from 'pubsub-js';
import tips from '@/config/tips';
import { formatCount, formatDBDateTime } from '@/utils/tools'

// 当前回复的对象 数值对回复进行恢复|null 对评论进行回复
const currentRid=ref<number|null>()
// 注入关闭抽屉的api
const onHandleToClose = inject<() => void>('onHandleToClose')
// 用户钩子
const { isLogin } = storeToRefs(useUserStore())
// props
const props = defineProps<{ cid: number }>()
// 回复数据
const list = reactive<Item[]>([])
// 评论数据
const comment = ref<CommentItemWithout | null>(null)
// 回复输入框的placeholder
const placeholderTips = computed(() => {
  if (currentRid.value == null) {
    return tips.replyPlaceholder
  } else {
    // 根据当前rid找到需要回复的用户
    const item = list.find(ele => ele.rid === currentRid.value)
    const text = item ? tips.hasReplyPlaceholder(item?.user.username) : tips.replyPlaceholder
    return text
  }
})

// 根据当前是否点赞输出图标
const likeIconString = computed(() => {
  if (comment.value?.is_liked) {
    return 'LikeFilled'
  } else {
    return 'LikeOutlined'
  }
})

// 分页数据
const pagination = reactive({
  isFirstLoading: true,
  page: 1,
  pageSize: 20,
  has_more: false,
  total: 0
})

// 获取数据
onBeforeMount(async () => {
  const res = await getCommentReplyAPI(props.cid, 1, 20)
  comment.value = res.data.comment
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  pagination.isFirstLoading = false
})

// 点赞评论的回调
const toLikeComment = () => {
  if (isLogin.value && comment.value) {
    // 给所有评论组件发送消息 去点赞评论 通过传入cid限制只给对应评论点赞
    PubSub.publish('to-like-comment', comment.value.cid)
    if (comment.value.is_liked) {
      // 取消点赞
      comment.value.like_count--
    } else {
      // 点赞
      comment.value.like_count++
    }
    // 更新点赞状态
    comment.value.is_liked = !comment.value.is_liked

  } else {
    window.$message.warning(tips.pleaseLogin)
  }
}

// 进入用户页面
const onHandleGoUser = () => {
  if (comment.value) {
    onHandleToClose && onHandleToClose()
    router.push(`/user/${ comment.value.uid }`)
  }
}

// 点击评论或回复更新当前回复的对象
const onHandleSetRid = (value: null | number) => {
  currentRid.value=value
}

defineOptions({
  name: 'ReplyDetail',
  directives: {
    imgPre
  },
  components: {
    LikeFilled,
    LikeOutlined
  }
})
</script>

<style scoped lang='scss'>
.loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.reply-detail-container {
  height: calc(90vh - 40px - 20px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  &::-webkit-scrollbar {
    width: 0px;
  }

  .input-container {
    height: 50px;
    background-color: skyblue;
    position: fixed;
    bottom: 0px;
    right: 0;
    left: 0;
  }

  .reply-detail-content {
    min-height: calc(100% - 50px);
    margin-bottom: 50px;

    .comment-infor {
      padding: 10px;
      cursor: pointer;
      .user {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .like-data {
          display: flex;
          color: var(--text-color-2);

          i {
            cursor: pointer;
          }

          span {
            position: relative;
            text-align: right;
            top: 2px;
            font-size: 13px;
            width: 30px;
          }
        }

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }

      .content {
        padding-left: 45px;
        position: relative;
        padding-top: 10px;

        .times {
          color: var(--text-color-2);
          font-size: 12px;
          position: absolute;
          top: -12px;
          left: 50px;
        }

        .img-list {
          display: flex;
          max-width: 50%;
          flex-direction: column;

          img {
            &:not(:last-child) {
              cursor: pointer;
              margin-bottom: 5px;
            }
          }
        }
      }
    }

    .reply-list-container {
      .title {
        padding: 10px;
        padding-bottom: 0;
        position: relative;

        &::after {
          content: '';
          background-color: var(--bg-color-3);
          position: absolute;
          left: 0;
          right: -10px;
          top: -5px;
          height: 10px;
        }
      }

      .reply-list {
        padding: 10px;
      }
    }
  }

}</style>