<template>
  <div class="ranking-list-container">
    <div class="title">本吧名人堂</div>
    <template v-if="pagination.isFirstLoading">
      <div class="loading">
        <span class="sub-text">正在加载</span>
        <n-spin class="ml-5"></n-spin>
      </div>
    </template>
    <template v-else>
      <template v-if="pagination.isLoading">
        <template v-if="list.length">
          <div class="ranking-table">
            <div class="ranking-header">
              <div class="item">排名</div>
              <div class="item">用户</div>
              <div class="item">等级</div>
              <div class="item">经验</div>
            </div>
            <div class="ranking-list">
              <div class="list-item" v-for="item in list" :key="item.uid">
                <div class="item">{{ item.ranking }}</div>
                <div class="item">
                  <img class="mr-5" :src="item.user.avatar">
                  <span>{{ item.user.username }}</span>
                </div>
                <div class="item">
                  <BarRank :level="item.bar_rank.level" :label="item.bar_rank.label" />
                </div>
                <div class="item">{{ item.score }}</div>
              </div>
              <div class="list-item" v-if="myRankInfo !== null">
                <div class="item">我的排名:{{ myRankInfo.ranking }}</div>
                <div class="item">
                  <img :src="userData.avatar">
                  <span>{{ userData.username }}</span>
                </div>
                <div class="item">
                  <BarRank :level="myRankInfo.level" :label="myRankInfo.label" />
                </div>
                <div class="item">{{ myRankInfo.score }}</div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <n-pagination :page="pagination.page" :page-size="pagination.pageSize" :item-count="pagination.total"
              show-size-picker :page-sizes="[ 10, 20, 30, 40 ]" />
          </div>
        </template>
        <template v-else>
          <empty></empty>
        </template>
      </template>
      <template v-else>
        <template v-if="list.length">
          <div class="ranking-table">
            <div class="ranking-header">
              <div class="item">排名</div>
              <div class="item">用户</div>
              <div class="item">等级</div>
              <div class="item">经验</div>
            </div>
            <div class="ranking-list">
              <div class="list-item" v-for="item in list" :key="item.uid">
                <div class="item">{{ item.ranking }}</div>
                <div class="item">
                  <img class="mr-5" :src="item.user.avatar">
                  <span>{{ item.user.username }}</span>
                </div>
                <div class="item">
                  <BarRank :level="item.bar_rank.level" :label="item.bar_rank.label" />
                </div>
                <div class="item">{{ item.score }}</div>
              </div>
              <div class="list-item" v-if="myRankInfo !== null">
                <div class="item">我的排名:{{ myRankInfo.ranking }}</div>
                <div class="item">
                  <img :src="userData.avatar">
                  <span>{{ userData.username }}</span>
                </div>
                <div class="item">
                  <BarRank :level="myRankInfo.level" :label="myRankInfo.label" />
                </div>
                <div class="item">{{ myRankInfo.score }}</div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <n-pagination v-model:page="pagination.page" v-model:page-size="pagination.pageSize"
              :item-count="pagination.total" @update:page="onHandleGetList" @update:page-size="onHandleUpdatePageSize"
              show-size-picker :page-sizes="[ 10, 20, 30, 40 ]" />
          </div>
        </template>
        <template v-else>
          <empty></empty>
        </template>
      </template>
    </template>
  </div>
</template>

<script lang='ts' setup>
// apis
import { getBarRankingAPI } from '@/apis/bar'
// type
import type { BarRankingItem } from '@/apis/bar/types'
// hooks
import { reactive, ref, onBeforeMount, watch } from 'vue'
import useUserStore from '@/store/user'
import { storeToRefs } from 'pinia'
// components
import BarRank from '@/components/common/BarRank/index.vue'

// 用户数据
const { userData } = storeToRefs(useUserStore())
// props
const props = defineProps<{ bid: number }>()
// 排行榜
const list = reactive<BarRankingItem[]>([])
// 当前用户的排行
const myRankInfo = ref<null | {
  level: number;
  label: string;
  progress: number;
  score: number;
  ranking: number;
}>(null)
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  isLoading: false,
  isFirstLoading: false
})

// 初始化获取该吧的等级排行榜数据
const onHandleGetData = async () => {
  pagination.isFirstLoading = true
  list.length = 0;
  const res = await getBarRankingAPI(props.bid, pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  // 获取当前用户在此吧的排行
  myRankInfo.value = res.data.my_bar_rank_info
  pagination.total = res.data.total
  pagination.isFirstLoading = false
}

// 获取分页数据
const onHandleGetList = async () => {
  pagination.isLoading = true
  const res = await getBarRankingAPI(props.bid, pagination.page, pagination.pageSize, true)
  list.length = 0;
  res.data.list.forEach(ele => list.push(ele))
  pagination.isLoading = false
}

// 长度更新的回调
const onHandleUpdatePageSize = () => {
  pagination.page = 1
  onHandleGetList()
}

// 初次加载
onBeforeMount(onHandleGetData)

// 路由更新
watch(() => props.bid, onHandleGetData)

</script>

<style scoped lang='scss'>
.ranking-list-container {
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10vh 0;
  }

  .title {
    font-weight: 600;
    font-size: 20px;
    color: var(--primary-color);
    transition: var(--time-normal);
  }

  .ranking-table {
    .ranking-header {
      display: flex;
      background-color: var(--bg-color-7);
      padding: 10px;

      .item {
        width: 25%;
      }
    }

    .ranking-list {
      .list-item {
        display: flex;
        transition: background-color ease var(--time-normal);
        border-top: 1px solid var(--border-color-1);
        align-items: center;

        &:last-child {
          border-bottom: 1px solid var(--border-color-1);
        }

        &:hover {
          background-color: var(--bg-color-7);
        }

        .item {
          padding: 10px 0;
          width: 25%;
          display: flex;
          align-items: center;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .pagination {
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
}

@media screen and (max-width:650px) {
  .ranking-list-container {
    .title{
      font-size: 16px;
    }
    .ranking-table {

      .ranking-list {
        .list-item {
          .item {
            font-size: 12.5px;

            img {
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }

  }
}
</style>