<template>
  <div class="reply-item" :class="{active}">
    <div class="header mb-5">
      <div class="user">
        <img class="mr-5" v-lazyImg="reply.user.avatar">
        <span class="username text" @click.stop="()=>onHandleGoUser(reply.uid)">{{ reply.user.username }}</span>
      </div>
      <div class="btn" @click.stop="">
        <n-icon @click="toLikeReply" size="18" :color="props.reply.is_liked ? 'red' : ''">
          <component :is="likeIcon"></component>
        </n-icon>
        <span>{{ formatCount(reply.like_count) }}</span>
      </div>
    </div>
    <div class="content">
      <div class="times" v-once>
        {{ formatDBDateTime(reply.createTime) }}
      </div>
      <span v-if="reply.type === 2 && reply.reply">
        <span>回复</span>
        <span class="username text" @click.stop="()=>onHandleGoUser(reply.reply?.uid as number)">
          @{{ reply.reply.user.username }}
        </span>
        :
      </span>
      <span>{{ reply.content }}</span>
      <div class="reply-reply" v-if="reply.type === 2 && reply.reply">
        <span class="user">{{ reply.reply.user.username }}</span>:
        <span>{{ reply.reply.content}}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { likeReplyAPI, cancelLikeReplyAPI } from '@/apis/public/article';
// types
import type { ReplyItem } from '@/apis/public/types/article';
// directives
import lazyImg from '@/directives/lazyImg';
// router
import router from '@/router'
// utils
import { formatDBDateTime, formatCount } from '@/utils/tools';
// components
import { NIcon } from 'naive-ui';
import { LikeFilled, LikeOutlined } from '@vicons/antd';
// hooks
import { computed, inject } from 'vue'
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
// utils
import tips from '@/config/tips';

// 注入关闭抽屉的api
const onHandleToClose = inject<() => void>('onHandleToClose')
// 点赞是否在加载
let isLoading = false
// 是否登录
const { isLogin } = storeToRefs(useUserStore())
// props
const props = defineProps<{
  reply: ReplyItem;
  isLiked: boolean;
  likeCount: number;
  /**
   * 当前是否在回复这个回复？
   */
  active: boolean;
}>()
// emits
const emit = defineEmits<{
  'update:isLiked': [ value: boolean ];
  'update:likeCount': [ value: number ];
}>()
// 根据是否点赞的状态输出对应图标的名称
const likeIcon = computed(() => {
  if (props.reply.is_liked) {
    return 'isLiked'
  } else {
    return 'isNotLiked'
  }
})


// 点赞回复
const toLikeReply = async () => {
  if (isLoading) {
    // 正在加载 禁止操作
    return
  }
  if (!isLogin) {
    // 未登录
    return window.$message.warning(tips.pleaseLogin)
  }
  isLoading = true
  if (props.isLiked) {
    // 取消点赞
    await cancelLikeReplyAPI(props.reply.rid)
    emit('update:likeCount', props.likeCount - 1)
    window.$message.success(tips.successCancleLikeReply)
  } else {
    // 点赞
    await likeReplyAPI(props.reply.rid)
    emit('update:likeCount', props.likeCount + 1)
    window.$message.success(tips.successLikeReply)
  }
  emit('update:isLiked', !props.isLiked)
  isLoading = false
}

// 点击进入回复人的用户页
const onHandleGoUser = (uid:number) => {
  onHandleToClose && onHandleToClose()
  router.push(`/user/${ uid }`)
}


defineOptions({
  components: {
    isLiked: LikeFilled,
    isNotLiked: LikeOutlined
  },
  directives: {
    lazyImg
  }
})

</script>

<style scoped lang='scss'>
.reply-item {
  padding: 10px 5px;
  border-radius: 5px;
  transition: var(--time-normal);
  cursor: pointer;
  &.active{
    background-color: var(--bg-color-5);
  }
  .header {
    display: flex;
    justify-content: space-between;

    .btn {
      display: flex;
      align-items: center;
      color: var(--text-color-2);

      i {
        cursor: pointer;
      }

      span {
        position: relative;
        text-align: right;
        top: 1.5px;
        font-size: 12px;
        width: 30px;
      }
    }

    .user {
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      span {
        font-size: 13px;
      }
    }

  }

  .content {
    padding-left: 35px;
    padding-top: 10px;
    font-size: 13px;
    position: relative;
    .reply-reply{
      background-color: var(--bg-color-3);
      padding: 10px;
      border-radius: 10px;
    }
    .times {
      color: var(--text-color-2);
      font-size: 12px;
      position: absolute;
      top: -12px;
      left: 35px;
    }
  }
}
</style>