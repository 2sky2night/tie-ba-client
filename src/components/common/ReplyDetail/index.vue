<template>
  <div class="reply-detail-container" ref="replyContianer">
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
        <div class="comment-infor mb-10" @click="() => onHandleSetRid(null)">
          <!--用户信息-->
          <div class="user">
            <div class="user-info">
              <img class="mr-10" :src="comment.user.avatar">
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
            <span class="times" v-once>{{ formatDBDateTime(comment.createTime) }}</span>
            <p>{{ comment.content }}</p>
            <div v-if="comment.photo !== null" class="img-list mt-10">
              <img v-imgPre="item" v-for="item in comment.photo" :src="item">
            </div>
          </div>
        </div>
        <!--回复列表-->
        <div class="reply-list-container">
          <div class="title">
            <span>{{ pagination.total }}条回复</span>
          </div>
          <div class="reply-list">
            <ReplyItem @click="() => onHandleSetRid(item.rid)" v-for="item in list" :key="item.rid" :reply="item"
              v-model:is-liked="item.is_liked" v-model:like-count="item.like_count" :active="currentRid === item.rid" />
            <n-divider :theme="isDark?theme?.Divider:undefined" title-placement="center" v-if="pagination.has_more === false&&pagination.total">
              <span class="sub-text">没有更多了</span>
            </n-divider>
            <div class="loading-item" v-if="pagination.isLoading">
              <span class="mr-10 sub-text">正在加载</span>
              <n-spin size="small" :theme-overrides="{ color: '#2080f0' }"></n-spin>
            </div>
          </div>
        </div>
      </div>
      <div class="input-container">
        <div class="input">
          <span v-if="placeholderTips" class="reply-tips">{{ placeholderTips }}</span>
          <textarea ref="textDOM" :placeholder="tips.replyPlaceholder" :value="replyValue" @input="onHandleInput"/>
        </div>
        <n-button type="info" @click="onHandleSendReply" :loading="isLoading">发送</n-button>
      </div>
    </template>
  </div>
</template>

<script lang='ts' setup>
// api
import { getCommentReplyAPI, sendReplyAPI } from '@/apis/public/article';
// types
import { ReplyItem as Item, CommentItemWithout } from '@/apis/public/types/article';
// hooks
import { reactive, ref, computed, inject, onMounted } from 'vue'
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import router from '@/router';
import useThemeStore from '@/store/theme';
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
import { SendReplyBody } from '@/apis/public/article/types';

// 输入框的DOM
const textDOM=ref<HTMLTextAreaElement|null>(null)
// 当前输入的回复
const replyValue = ref('')
// 回复详情容器
const replyContianer = ref<HTMLDivElement | null>(null)
// 当前回复的对象 数值对回复进行恢复|null 对评论进行回复
const currentRid = ref<number | null>(null)
// 注入关闭抽屉的api
const onHandleToClose = inject<() => void>('onHandleToClose')
// 用户是否登录
const { isLogin } = storeToRefs(useUserStore())
// 主题仓库数据
const {theme,isDark} = storeToRefs(useThemeStore())
// props
const props = defineProps<{ cid: number }>()
// 回复数据
const list = reactive<Item[]>([])
// 评论数据
const comment = ref<CommentItemWithout | null>(null)
// 回复输入框的placeholder
const placeholderTips = computed(() => {
  if (currentRid.value == null) {
    return null
  } else {
    // 根据当前rid找到需要回复的用户
    const item = list.find(ele => ele.rid === currentRid.value)
    const text = item ? tips.hasReplyPlaceholder(item?.user.username) : null
    return text
  }
})
// 发送回复是否正在加载
const isLoading=ref(false)
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
  total: 0,
  isLoading: false
})

// 滚动滚轮的回调
const onHandleScroll = () => {
  const dom = replyContianer.value as HTMLDivElement;
  if (dom.clientHeight + dom.scrollTop > dom.scrollHeight - 10) {
    // 到底部需要加载更多数据 
    if (pagination.isLoading) {
      // 若当前正在加载数据 则不做任何操作
      return
    }
    // 页码加1
    pagination.page++
    // 获取数据
    getReplyList()
  }
}

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

// 点击评论或回复 设置当前回复的对象
const onHandleSetRid = (value: null | number) => {
  if (value === currentRid.value) {
    // 重置回复对象 为 评论
    currentRid.value = null
  } else {
    currentRid.value = value
  }
  textDOM.value?.focus()
}

// 输入框input事件的回调
const onHandleInput = (e:Event) => {
  const target = e.target as HTMLInputElement
  if (target.value.length > 999) {
    window.$message.warning(tips.textNameAllSize('回复', 999, 1))
    target.value=replyValue.value
    return
  }
  replyValue.value=target.value
}

// 获取回复数据
const getReplyList = async () => {
  pagination.isLoading = true
  const res = await getCommentReplyAPI(props.cid, pagination.page, pagination.pageSize)
  pagination.total = res.data.total
  pagination.has_more = res.data.has_more
  res.data.list.forEach(ele => list.push(ele))
  if (pagination.has_more === false) {
    // 没有更多了 取消滚动条监听
    (replyContianer.value as HTMLDivElement).removeEventListener('scroll', onHandleScroll)
  }
  pagination.isLoading = false
}

// 重置页码 获取数据
const resetReplyList = async () => {
  // 绑定滚动事件
  (replyContianer.value as HTMLDivElement).addEventListener('scroll', onHandleScroll);
  pagination.has_more=true
  pagination.page = 1
  list.length = 0
  getReplyList()
}

// 发送回复
const onHandleSendReply = async() => {
  if (!replyValue.value.trim()) {
    window.$message.warning(tips.textNameNotEmpty('回复'))
    return 
  }
  const data:SendReplyBody = {
    cid: props.cid,
    type: currentRid.value === null ? 1 : 2,
    content: replyValue.value,
    id:currentRid.value===null?props.cid:currentRid.value
  }
  await sendReplyAPI(data)
  window.$message.success(tips.successSendReply);
  // 清空回复对象以及回复的内容
  replyValue.value = ''
  currentRid.value=null
  resetReplyList()
}

// 获取数据 并 给容器绑定滚动事件,滚动到底部就加载更多数据
onMounted(async () => {
  const res = await getCommentReplyAPI(props.cid, pagination.page, pagination.pageSize)
  comment.value = res.data.comment
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  pagination.has_more = res.data.has_more
  pagination.isFirstLoading = false;
  if (pagination.has_more) {
    // 初始化获取数据后 若还有更多就绑定滚动事件按需加载
    (replyContianer.value as HTMLDivElement).addEventListener('scroll', onHandleScroll)
  }
})

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
    position: fixed;
    bottom: 0px;
    right: 0;
    left: 0;
    display: flex;
    padding: 5px;
    .input{
      flex-grow: 1;
      display: flex;
      border: 1px solid var(--border-color-1);
      align-items: center;
      
      .reply-tips{
        display: flex;
        align-items: center;
        height: 100%;
        color:var(--text-color-2);
        padding:0 5px;
        border-right: 1px solid var(--border-color-1);
      }
      textarea{
        padding:0 5px;
        color:var(--text-color-1);
        background-color:unset;
        border: none;
        flex-grow: 1;
        box-sizing: border-box;
        resize: none;
      }
    }
    :deep(.n-button) {
      height: 100%;
    }

    box-shadow: 0 -2px 10px var(--shadow-color-1);
    background-color: var(--bg-color-1);
  }

  .reply-detail-content {
    min-height: calc(100% - 50px);
    margin-bottom: 20px;

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
        padding-left: 50px;
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
      .loading-item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
      }

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