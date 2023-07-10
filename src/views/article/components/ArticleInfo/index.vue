<template>
  <div class="article-info-container">
    <template v-if="articleInfo">
      <div class="article-info">
        <div class="header mb-10">
          <div class="title mb-5">{{ articleInfo.title }}</div>
          <div class="data mb-5">
            <div class="item mr-10 sub-text">{{ getDBDateString(articleInfo.createTime) }}</div>
            <div class="item mr-5 sub-text">
              评论:
              <span>{{ formatCount(articleInfo.comment_count) }}</span>
            </div>
            <div class="item mr-5 sub-text">
              点赞:
              <span>{{ formatCount(articleInfo.like_count) }}</span>
            </div>
            <div class="item sub-text">
              收藏:
              <span>{{ formatCount(articleInfo.star_count) }}</span>
            </div>
          </div>
          <div class="user-info">
            <div class="username">
              <RouterLink class="mr-10" :to="`/user/${ articleInfo.uid }`">
                <img :src="articleInfo.user.avatar">
              </RouterLink>
              <RouterLink class="text" :to="`/user/${ articleInfo.uid }`">
                {{ articleInfo.user.username }}
              </RouterLink>
            </div>
            <follow-btn :uid="articleInfo.user.uid" v-model:is-followed="articleInfo.user.is_followed"
              :is-fans="articleInfo.user.is_fans" size="small" />
          </div>
        </div>
        <div class="article-content mb-10">
          <p class="mb-10">{{ articleInfo.content }}</p>
          <div class="img-container" v-if="articleInfo.photo !== null">
            <img v-imgPre="item" v-lazyImg="item" v-for=" item  in articleInfo.photo">
          </div>
        </div>
        <!-- <div class="tips sub-text">到底了</div> -->
        <div class="actions">
          <auth-btn>
            <n-button text round :disabled="likeIsLoading">
              <div class="item" @click="toLikeArticle" :class="{ 'active': articleInfo.is_liked }">
                <n-icon size="25">
                  <MdThumbsUp />
                </n-icon>
              </div>
            </n-button>
          </auth-btn>
          <auth-btn>
            <n-button text round :disabled="starIsLoading">
              <div class="item" @click="toStarArticle" :class="{ 'active': articleInfo.is_star }">
                <n-icon size="25">
                  <Star />
                </n-icon>
              </div>
            </n-button>
          </auth-btn>
        </div>
        <div class="bar-info">
          <RouterLink :to="`/bar/${ articleInfo.bid }`">
            <img :src="articleInfo.bar.photo" class="mr-5">
            <span>
              {{ articleInfo.bar.bname }}吧
            </span>
          </RouterLink>
        </div>
      </div>
      <!--移动端会显示的操作面板-->
      <Actions v-if="showAction" :to-star-handle="toStarArticle" :is-like="articleInfo.is_liked"
        :to-like-handle="toLikeArticle" :is-star="articleInfo.is_star" :like-is-loading="likeIsLoading"
        :star-is-loading="starIsLoading" :aid="articleInfo.aid" v-model:comment-count="articleInfo.comment_count" />
    </template>
    <ArticelSkeleton v-else></ArticelSkeleton>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getArticleInfoAPI } from '@/apis/article';
import { likeArticleAPI, cancelLikeArticleAPI, cancelStarArticleAPI, starArticleAPI } from '@/apis/public/article';
// hooks
import { ref, onBeforeMount, watch, onMounted, onBeforeUnmount } from 'vue'
import { useMessage } from 'naive-ui';
// types 
import type { ArticleInfoResponse } from '@/apis/article/types';
// utils
import { getDBDateString, formatCount } from '@/utils/tools'
import PubSub from 'pubsub-js'
// components
import { Star } from '@vicons/ionicons5'
import { MdThumbsUp } from '@vicons/ionicons4'
import Actions from './components/Actions.vue';
import ArticelSkeleton from '@/components/skeleton/views/ArticelSkeleton.vue'

const props = defineProps<{ aid: number }>()
const articleInfo = ref<ArticleInfoResponse | null>(null)
const message = useMessage()
const likeIsLoading = ref(false)
const starIsLoading = ref(false)
const showAction = ref(false)


// 获取帖子详情数据
async function getData () {
  const res = await getArticleInfoAPI(props.aid)
  articleInfo.value = res.data
}

// 点赞或取消点赞帖子
async function toLikeArticle () {
  if (articleInfo.value) {
    likeIsLoading.value = true
    const res = articleInfo.value.is_liked ?
      await cancelLikeArticleAPI(articleInfo.value.aid) :
      await likeArticleAPI(articleInfo.value.aid)
    message.success(res.message)
    articleInfo.value.is_liked = !articleInfo.value.is_liked
    articleInfo.value.like_count = articleInfo.value.is_liked ? articleInfo.value.like_count + 1 : articleInfo.value.like_count - 1
    // 向 Like 组件 通知当前用户点赞了帖子 重新加载点赞列表
    PubSub.publish('likeArticle')
    likeIsLoading.value = false
  }
}

// 收藏或取消收藏帖子
async function toStarArticle () {
  if (articleInfo.value) {
    starIsLoading.value = true
    const res = articleInfo.value.is_star ?
      await cancelStarArticleAPI(articleInfo.value.aid) :
      await starArticleAPI(articleInfo.value.aid)
    message.success(res.message)
    articleInfo.value.is_star = !articleInfo.value.is_star
    articleInfo.value.star_count = articleInfo.value.is_star ? articleInfo.value.star_count + 1 : articleInfo.value.star_count - 1
    // 向 Star 组件 通知当前用户收藏了帖子 重新加载收藏列表
    PubSub.publish('starArticle')
    starIsLoading.value = false
  }
}

onMounted(() => {

  function checkResize () {
    if (window.innerWidth > 650) {
      showAction.value = false
    } else {
      showAction.value = true
    }
  }
  checkResize()
  window.addEventListener('resize', checkResize)
  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkResize)
  })
})

onBeforeMount(getData)

// 监听发送评论的回调
PubSub.subscribe('sendComment', () => {
  if (articleInfo.value) {
    articleInfo.value.comment_count++
  }
})

watch(() => props.aid, getData)

defineOptions({
  name: 'ArticleInfo'
})

</script>

<style scoped lang='scss'>
.article-info-container {
  position: relative;

  .article-info {
    padding: 10px 0;

    .header {
      .title {
        font-size: 25px;
        font-weight: 600;
      }

      .data {
        display: flex;
      }

      .user-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .username {
          img {
            cursor: pointer;
            border-radius: 50%;
            width: 50px;
            height: 50px;
          }
        }
      }
    }

    .article-content {
      p {
        text-indent: .5cm;
        word-break: break-all;
      }

      .img-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
    }

    .tips {
      margin: 10px 0;
      text-align: center;
      position: relative;
      overflow: hidden;

      &::after,
      &::before {
        content: '';
        height: 1px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        background-color: var(--border-color-1);
      }

      &::before {
        transform: translateX(-100%);
        margin-left: -10px;
      }

      &::after {
        margin-left: 10px;
      }
    }

    .actions {
      display: flex;
      justify-content: center;

      :deep(.n-button) {
        height: 50px;
        width: 50px;
        // border: none;
        // padding: 0;

        .n-button__content {
          height: 100%;
          width: 100%;
        }
      }

      >div:first-child {
        margin-right: 30px;

        .item {

          &:hover,
          &.active {
            color: red;
          }
        }
      }

      >div:last-child {
        .item {

          &:hover,
          &.active {
            color: yellow;
          }
        }
      }

      .item {
        display: flex;
        align-items: center;
        height: 100%;
        width: 100%;
        justify-content: center;
        border-radius: 15px;
        cursor: pointer;
        color: var(--text-color-2);
        transition: var(--time-normal);

        svg {
          position: relative;
          top: -2px;
        }
      }
    }

    .bar-info {
      a {
        padding: 10px;
        cursor: pointer;
        width: 80px;
        height: 40px;
        background-color: var(--bg-color-3);
        font-size: 12px;
        border-radius: 5px;
        img {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
}

@media screen and (max-width:651px) {
  .article-info-container {
    .article-info {
      .header {
        .title {
          font-size: 20px;
          font-weight: 600;
        }
      }

      .tips {
        display: none;
      }

      .article-content {
        .img-container {
          display: flex;
          flex-direction: column;

          img {
            width: 95%;
            height: 95%;
            margin-bottom: 5px;
          }

          align-items: center;
        }
      }

      .actions {
        display: none;
      }
    }
  }
}
</style>