<template>
  <div class="article-item-container">

    <div class="title mb-10">
      <div class="user-info">
        <img :src="article.user.avatar">
        <span class="ml-10">{{ article.user.username }}</span>
      </div>
      <div class="action">
        <FollowBtn :is-followed="article.user.is_followed" :is-fans="article.user.is_fans" :uid="article.user.uid"
          size="small" />
      </div>
    </div>

    <div class="article-content mb-10">
      <div class="title mb-10">{{ article.title }}</div>
      <div class="content mb-10">{{ article.content }}</div>
      <template v-if="article.photo">
        <div class="photo-container mb-10" :class="{ 'three': article.photo.length === 3 }">
          <img v-for=" img   in article.photo" :src="img">
        </div>
      </template>
      <div class="bar">
        <n-button size="tiny" strong secondary>{{ article.bar.bname }}吧</n-button>
      </div>
    </div>

    <div class="btn-container">

      <div class="btns">
        <div class="item mr-10">
          <n-icon size="20" :color="isStar?'#ffcb6b':''">
            <component :is="isStar?'StarFilled':'StarOutlined'"></component>
          </n-icon>
          <span>{{ article.star_count }}</span>
        </div>
        <div class="item">
          <n-icon size="18">
            <CommentRegular />
          </n-icon>
          <span>{{ article.comment_count }}</span>
        </div>
      </div>

      <div class="btns">
        <div class="item">
          <n-icon size="18" :color="isLiked?'red':''">
            <component :is="isLiked?'LikeFilled':'LikeOutlined'"></component>
          </n-icon>
          <span>{{ article.like_count }}</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang='ts' setup>
// hooks
import { computed, ref } from 'vue'
import useUserStore from '@/store/user'
// types
import type { ArticleItemProps } from '@/types/components/item';
// components
import { LikeOutlined, StarOutlined,StarFilled,LikeFilled } from '@vicons/antd'
import { CommentRegular } from '@vicons/fa'
// apis
import { likeArticleAPI,cancelLikeArticleAPI,starArticleAPI,cancelStarArticleAPI } from '@/apis/public/article';

const props = defineProps<ArticleItemProps>()
// 是否收藏
const isStar = ref(props.article.is_star)
// 是否点赞
const isLiked = ref(props.article.is_liked)


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

      .item {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>