<template>
  <div class="article-item-container" @click="() => goArticle(article.aid)">

    <div class="title mb-10">
      <div class="user-info">
        <RouterLink :to="`/user/${article.uid}`" @click.stop="">
          <img v-lazyImg="article.user.avatar" @click.stop="">
        </RouterLink>
        <RouterLink :to="`/user/${article.uid}`" @click.stop="">
          <span class="ml-10 text">{{ article.user.username }}</span>
        </RouterLink>
      </div>
      <div class="action">
        <FollowBtn v-model:is-followed="article.user.is_followed" :is-fans="article.user.is_fans" :uid="article.user.uid"
          size="small" />
      </div>
    </div>

    <div class="article-content mb-10">
      <div class="title mb-10">{{ article.title }}</div>
      <div class="content mb-10">{{ article.content }}</div>
      <template v-if="article.photo">
        <div class="photo-container mb-10" :class="{ 'three': article.photo.length === 3 }">
          <img v-lazyImg="img" v-for=" img  in article.photo" v-imgPre="img">
        </div>
      </template>
      <div class="bar">
        <RouterLink :to="`/bar/${article.bid}`" @click.stop="">
          <n-button size="tiny" strong secondary >{{ article.bar.bname }}吧</n-button>
        </RouterLink>
      </div>
    </div>

    <div class="btn-container">

      <div class="btns">

        <auth-btn>
          <button class="item mr-10" @click.stop="onHandleStarArticle">
            <n-icon size="20" :color="isStar ? '#ffcb6b' : ''">
              <component :is="isStar ? 'StarFilled' : 'StarOutlined'"></component>
            </n-icon>
            <span class="count">{{ formatCount(article.star_count) }}</span>
          </button>
        </auth-btn>

        <div class="item">
          <n-icon size="18">
            <CommentRegular />
          </n-icon>
          <span class="count">{{ formatCount(article.comment_count) }}</span>
        </div>
      </div>

      <div class="btns">
        <auth-btn>
          <button class="item" @click.stop="onHandleLikeArticle">
            <n-icon size="18" :color="isLiked ? 'red' : ''">
              <component :is="isLiked ? 'LikeFilled' : 'LikeOutlined'"></component>
            </n-icon>
            <span class="count">{{ formatCount(article.like_count) }}</span>
          </button>
        </auth-btn>
      </div>

    </div>

  </div>
</template>

<script lang='ts' setup>
// hooks
import { useMessage } from 'naive-ui';
import useNavigation from '@/hooks/useNavigation';
import { ref } from 'vue'
// types
import type { ArticleItemProps } from '@/types/components/item';
// components
import { LikeOutlined, StarOutlined, StarFilled, LikeFilled } from '@vicons/antd'
import { CommentRegular } from '@vicons/fa'
// apis
import { likeArticleAPI, cancelLikeArticleAPI, starArticleAPI, cancelStarArticleAPI } from '@/apis/public/article';
// config
import tips from '@/config/tips'
// utlis
import { formatCount } from '@/utils/tools'

const likeIsLoading = ref(false)
const starIsLoading = ref(false)
const props = defineProps<ArticleItemProps>()
const emit = defineEmits<{
  'update:isLiked': [value: boolean];
  'update:isStar': [value: boolean];
  'update:starCount': [value: number];
  'update:likeCount': [value: number];
}>()
const message = useMessage()
const { goArticle } = useNavigation()

/**
 * 点击收藏帖子的回调
 */
const onHandleStarArticle = async () => {
  if (starIsLoading.value) {
    // 若当前正在加载 需要等待上次结果后才能继续操作
    return
  }
  try {
    starIsLoading.value = true
    if (props.isStar) {
      // 已经收藏了 点击取消收藏
      await cancelStarArticleAPI(props.article.aid)
      message.success(tips.successCancelStarArticle)
      emit('update:starCount', props.starCount - 1)
    } else {
      // 当前未收藏 点击收藏帖子
      await starArticleAPI(props.article.aid)
      message.success(tips.successStarArticle)
      emit('update:starCount', props.starCount + 1)
    }
    // 操作成功 更新本地收藏值
    emit('update:isStar', !props.isStar)
    starIsLoading.value = false
  } catch (error) {
    console.log(error)
  }
}
/**
 * 点击点赞帖子的帖子
 */
const onHandleLikeArticle = async () => {
  if (likeIsLoading.value) {
    // 若当前正在加载 需要等待上次结果后才能继续操作
    return
  }
  try {
    likeIsLoading.value = true
    if (props.isLiked) {
      // 已经点赞了 取消点赞帖子
      await cancelLikeArticleAPI(props.article.aid)
      message.success(tips.successCancelLikeArticle)
      emit('update:likeCount', props.likeCount - 1)
    } else {
      // 未点赞 点赞帖子
      await likeArticleAPI(props.article.aid)
      message.success(tips.successLikeArticle)
      emit('update:likeCount', props.likeCount + 1)
    }
    // 更新状态
    emit('update:isLiked', !props.isLiked)
    likeIsLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

defineOptions({
  components: {
    StarOutlined,
    StarFilled,
    LikeOutlined,
    LikeFilled
  }
})
</script>

<style scoped lang='scss'>
.article-item-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  cursor: pointer;
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color-1);
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user-info {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }

  .article-content {
    .title {
      font-size: 15px;
      font-weight: 600;
    }

    .content {
      font-size: 14px;
      word-break: break-all;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .photo-container {
      display: flex;

      img {
        margin-right: 10px;
        max-width: 30%;
        max-height: 30%;
        flex-grow: 1;
        cursor: pointer;
      }

      &.three {
        justify-content: space-between;
      }
    }
  }

  .btn-container {
    display: flex;
    justify-content: space-between;

    .btns {
      display: flex;
      align-items: center;

      .item {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text-color-2);

        .count {
          font-size: 12px;
          position: relative;
          top: 2px;
        }

        span {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>