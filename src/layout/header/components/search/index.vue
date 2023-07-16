<template>
  <div class="search-bar-container">
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
      <div class="search-history">
        <div class="title">搜索历史</div>
        <div class="item" @click="() => onHandleClick(item.title)" v-for="item in historySearch" :key="item.time">
          <span>{{ item.title }}</span>
          <n-icon @click.stop="() => onHandleDelete(item.time)">
            <Close></Close>
          </n-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// components
import { Search, Close } from '@vicons/ionicons5'
// hooks
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
// configs
import tips from '@/config/tips';

// 用户仓库
const userStore = useUserStore()
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

onMounted(() => {
  function handleClickSearchBox() {
    if (isFoucs.value) {
      isFoucs.value=false
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
    border-radius: 10px;

    .search-history {

      .title {
        margin: 10px;
        color: var(--primary-color);
      }

      .item {
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


@media screen and (max-width: 651px) {
  .search-bar-container {
    display: none;
  }
}
</style>