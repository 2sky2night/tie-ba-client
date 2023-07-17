<template>
  <div class="search-bar-container" @click.stop="">
    <div @click.stop="() => onHandleToggleFouncs(true)" class="input-container" :class="{ 'active': isFoucs }">
      <div class="search-icon">
        <n-icon>
          <Search />
        </n-icon>
      </div>
      <input :value="keywords" @input="onHandleInput" @keyup.enter="onHandleSearch" v-if="isFoucs" ref="inputDOM"
        placeholder="搜索帖子/吧">
    </div>
    <div class="search-box-container" @click.stop="" v-if="isFoucs">
      <!--搜索历史-->
      <div class="search-history" v-if="keywords">
        <div class="title">搜索历史</div>
        <div class="item" @click="() => onHandleClick(item.title)" v-for="  item   in historySearch" :key="item.time">
          <span>{{ item.title }}</span>
          <n-icon @click.stop="() => onHandleDelete(item.time)">
            <Close></Close>
          </n-icon>
        </div>
      </div>
      <!--搜索推荐-->
      <div class="search-discover" v-else>
        <div class="title">搜索推荐</div>
        <template v-if="articleList.length&&barList.length">
          <div class="module article">
            <div class="title">帖子</div>
            <div class="list">
              <div @click="() => onHandleGoArticle(item)" class="item" v-for="item in articleList" :key="item.aid">
                <div class="content">
                  <div>{{ item.title }}</div>
                  <div class="content-pre">{{ item.content }}</div>
                </div>
                <n-icon color="red" v-if="item.like_count % 2 === 0">
                  <FireTwotone />
                </n-icon>
              </div>
            </div>
          </div>
          <n-divider></n-divider>
          <div class="module bar">
            <div class="title">吧</div>
            <div class="list">
              <div class="item" @click="() => onHandleGoBar(item)" v-for="item in barList" :key="item.bid">
                <div class="content">
                  <img class="mr-5" :src="item.photo">
                  <span>{{ item.bname }}吧</span>
                </div>
                <n-icon color="red" v-if="item.user_follow_count % 2 === 0">
                  <FireTwotone />
                </n-icon>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="empty">
            暂无推荐
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// components
import { Search, Close } from '@vicons/ionicons5'
// hooks
import { reactive, ref, nextTick, onMounted, onBeforeUnmount, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
import { FireTwotone } from '@vicons/antd'
import useNavigation from '@/hooks/useNavigation';
// configs
import tips from '@/config/tips';
// apis
import { discoverHotArticleAPI } from '@/apis/discover/hot-article';
import { discoverBarAPI } from '@/apis/discover/bar';
// types
import type { ArticleItem } from '@/apis/public/types/article';
import type { BarItem } from '@/apis/public/types/bar';

// 导航
const { goArticle, goBar } = useNavigation()
// 用户仓库
const userStore = useUserStore()
// 搜索的历史记录
const { historySearch } = storeToRefs(userStore)
// message api
const message = useMessage()
// 是否聚焦
const isFoucs = ref(false)
// 输入框DOM
const inputDOM = ref<HTMLInputElement | null>(null)
// 路由对象
const router = useRouter()
// 搜索关键字
const keywords = ref('')
// 热门的帖子列表
const articleList = reactive<ArticleItem[]>([])
// 热门的吧列表
const barList = reactive<BarItem[]>([])

// 切换激活状态
const onHandleToggleFouncs = (flag: boolean) => {
  if (flag) {
    isFoucs.value = true;
    nextTick(() => {
      (inputDOM.value as HTMLInputElement).focus();
    })
  } else {
    isFoucs.value = false
  }
}

// input事件的回调
const onHandleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  keywords.value = target.value.trim()
  target.value = keywords.value
}

// 进入搜索页
const onHandleSearch = () => {
  if (keywords.value) {
    (inputDOM.value as HTMLInputElement).blur();
    isFoucs.value = false
    router.push({
      path: '/search/article',
      query: {
        keywords: keywords.value,
        page: 1
      }
    })
    keywords.value = '';
  } else {
    message.warning(tips.searchPleaseholder)
  }
}

// 点击历史搜索项的回调
const onHandleClick = (title: string) => {
  userStore.addSearchHistroy(title)
  keywords.value = title
  onHandleSearch()
}

// 点击删除历史记录的回调
const onHandleDelete = (time: number) => {
  userStore.deleteSearchHistory(time)
}

// 获取发现的吧
const toGetBarList = async () => {
  const res = await discoverBarAPI(4, 1, 10)
  res.data.list.forEach(ele => barList.push(ele))
}
// 获取发现的热贴
const toGetArticleList = async () => {
  const res = await discoverHotArticleAPI(4, 1, 10)
  res.data.list.forEach(ele => articleList.push(ele))
}
// 点击搜索推荐进入某个帖子
const onHandleGoArticle = (item: ArticleItem) => {
  isFoucs.value = false
  keywords.value = item.title
  // 保存搜索的历史记录
  userStore.addSearchHistroy(item.title)
  goArticle(item.aid)
}
// 点击搜索推荐进入某个吧
const onHandleGoBar = (item: BarItem) => {
  isFoucs.value = false
  keywords.value = item.bname
  // 保存搜索的历史记录
  userStore.addSearchHistroy(item.bname)
  goBar(item.bid)
}


// 获取搜索推荐的数据
onBeforeMount(() => {
  toGetArticleList()
  toGetBarList()
})

// 点击除该组件的地方隐藏搜索推荐和搜索历史盒子
onMounted(() => {
  function handleClickSearchBox () {
    if (isFoucs.value) {
      isFoucs.value = false
    }
  }
  document.documentElement.addEventListener('click', handleClickSearchBox)
  onBeforeUnmount(() => {
    document.documentElement.removeEventListener('click', handleClickSearchBox)
  })
})

defineOptions({
  name: 'SearchBar'
})
</script>

<style scoped lang='scss'>
.search-bar-container {
  height: 35px;
  display: flex;
  align-items: center;
  position: relative;

  .search-box-container {
    position: absolute;
    top: 100%;
    background-color: var(--bg-color-1);
    width: 200px;
    padding: 5px;
    box-sizing: border-box;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 0 10px var(--shadow-color-1);
    border-radius: 5px;

    .search-discover {
      .empty{
        height: 100px;
        display: flex;
        justify-content: center;
        padding-top: 25px;
      }
      :deep(.n-divider) {
        margin: 10px 0;
      }

      >.title {
        margin: 10px;
        color: var(--primary-color);
      }

      .module {
        .title {
          font-size: 15px;
          font-weight: 600;
          margin-left: 10px;
        }

        .item {
          transition: all ease var(--time-normal);
          cursor: pointer;

          &:hover {
            background-color: var(--bg-color-3);
            color: var(--primary-color);

          }
        }

        &.article {
          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 10px;

            .content {
              display: flex;
              flex-direction: column;

              .content-pre {
                font-size: 12px;
                color: var(--text-color-2);
                width: 100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }

        &.bar {
          .item {
            padding: 5px 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .content {
              display: flex;
              align-items: center;

              span {
                font-size: 13px;
                display: inline-block;
                width: 100px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              img {
                width: 30px;
                height: 30px;
              }
            }
          }
        }
      }
    }

    .search-history {

      .title {
        margin: 10px;
        color: var(--primary-color);
      }

      .item {
        border-radius: 5px;
        padding: 5px 10px;
        display: flex;
        align-items: center;
        position: relative;
        padding-right: 20px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all ease var(--time-normal);

        span {
          flex-grow: 1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        &:hover {
          background-color: var(--bg-color-3);
          color: var(--primary-color);
        }

        &:hover i {
          display: block;
        }

        i {
          position: absolute;
          right: 5px;
          transition: all ease var(--time-normal);
          color: var(--primary-color);
          display: none;

          &:hover {
            display: block;
          }
        }
      }
    }

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar-color);
      border-radius: 10px;
    }
  }

  .input-container {
    overflow: hidden;
    transition: all ease var(--time-normal);
    display: flex;
    width: 40px;
    padding: 5px 10px;
    background-color: var(--bg-color-3);
    align-items: center;
    border: 1px solid var(--border-color-1);
    border-radius: 20px;

    i {
      font-size: 20px;
      display: flex;
      align-content: center;
    }

    input {
      margin-left: 5px;
      color: var(--text-color-1);
      width: 80px;
      flex-grow: 1;
      outline: none;
      border: none;
      background-color: initial;
    }

    &.active {
      border-color: var(--primary-color);
      width: 200px;
    }
  }
}
</style>