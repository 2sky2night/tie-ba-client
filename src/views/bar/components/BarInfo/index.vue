<template>
  <div class="bar-info-container">
    <template v-if="barInfo">
      <div class="bar-img">
        <img v-imgPre="barInfo.photo" :src="barInfo.photo">
      </div>
      <div class="bar-info ml-10">
        <div class="header mb-10">
          <div class="bar-title">
            <img class="mr-10" v-imgPre="barInfo.photo" :src="barInfo.photo">
            <div class="title">{{ barInfo.bname }}</div>
          </div>
          <follow-bar-btn :bid="barInfo.bid" v-model:isFollowed="barInfo.is_followed" size="small"
            v-model:follow-count="barInfo.user_follow_count"></follow-bar-btn>
        </div>
        <div title="查看吧简介" class="desc mb-10" @click="onHandleShowDesc">
          <span>简介:</span>
          {{ barInfo.bdesc }}
        </div>
        <div class="data mb-10">
          <div class="item sub-text">
            <span>帖子:</span>
            <span>{{ formatCount(barInfo.article_count) }}</span>
          </div>
          <div class="item sub-text ml-10">
            <span>关注:</span>
            <span>{{ formatCount(barInfo.user_follow_count) }}</span>
          </div>
        </div>
        <div class="user">
          <div class="username">
            <span class="mr-5">吧主</span>
            <RouterLink :to="`/user/${ barInfo.uid }`">
              <img :src="barInfo.user.avatar" class="mr-5">
            </RouterLink>
            <RouterLink :to="`/user/${ barInfo.uid }`">
              <span class="text">{{ barInfo.user.username }}</span>
            </RouterLink>
          </div>
          <follow-btn :uid="barInfo.uid" size="small" v-model:isFollowed="barInfo.user.is_followed" :is-fans="barInfo.user.is_fans" ></follow-btn>
        </div>
      </div>
    </template>
    <BarSkeleton v-else></BarSkeleton>
  </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, onBeforeMount, watch, h } from 'vue'
// apis
import { getBarInfoAPI } from '@/apis/bar'
// types
import type { BarInfoResponse } from '@/apis/bar/types';
// utils
import { formatCount } from '@/utils/tools';
import modal from '@/render/modal/message';
// components
import BarSkeleton from '@/components/skeleton/views/BarSkeleton.vue'

// 吧的信息
const barInfo = ref<BarInfoResponse | null>(null)
// props
const props = defineProps<{ bid: number }>()

// 获取吧的信息
async function getBarData () {
  const res = await getBarInfoAPI(props.bid)
  barInfo.value = res.data
}
// 点击查看简介
const onHandleShowDesc = () => {
  modal('吧简介', () => [
    h('div', barInfo.value?.bdesc)
  ])
}

// 路由更新 获取最新的吧数据
watch(() => props.bid, () => {
  getBarData()
})

onBeforeMount(getBarData)

defineOptions({
  name: 'BarInfo'
})
</script>

<style scoped lang='scss'>
.bar-info-container {
  display: flex;
  align-items: center;

  .bar-img {
    img {
      width: 180px;
      height: 180px;
      min-width: 180px;
      min-height: 180px;
      object-fit: contain;
      cursor: pointer;
    }
  }

  .bar-info {
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    box-sizing: border-box;
    padding: 10px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .bar-title {
        display: flex;
        align-items: center;
      }

      img {
        width: 50px;
        cursor: pointer;
        height: 50px;
        display: none;
      }

      .title {
        font-size: 18px;
        font-weight: 600;
      }
    }

    .desc {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      cursor: pointer;
    }


    .data {
      display: flex;
      align-items: center;
    }

    .user {
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
}

@media screen and (max-width:651px) {
  .bar-info-container {
    .bar-img {
      img {
        display: none;
      }
    }

    .bar-info {
      padding: 0;
      .header {
        img {
          display: inline;
        }
      }

    }
  }
}
</style>