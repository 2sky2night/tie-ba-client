<template>
  <div class="bar-select-container">
    <n-input :value="`${ select?currentBarLabel+'吧':'未选择' }`"></n-input>
    <n-button class="ml-10" type="primary" @click="onHandleOpen">选择</n-button>
  </div>
  <Teleport to="body">
    <Transition name="fade">
      <div class="select-modal" v-show="showModal">
        <div class="select-modal-container">
          <div class="page-title mb-10">
            <div>
              <span>选择需要发送到的吧</span>
              <span class="sub-text ml-5">共{{ pagination.total }}个吧</span>
            </div>
            <div class="btns">
              <n-button size="small" @click="onHandleCancel">取消</n-button>
              <n-button size="small" class="ml-10" type="primary" @click="onHandleSubmit">确定</n-button>
            </div>
          </div>
          <div ref="listDOM" class="select-container">
            <div class="list">
              <div @click="() => onHandleSelect(item.bid)" :class="{ 'active': item.bid === currentBid }" class="item"
                v-for="item in list" :key="item.bid">
                <span>
                  {{ item.bname }}
                </span>
              </div>
              <div class="spin" v-if="isLoading">
                <span class="sub-text mr-10">正在加载</span>
                <n-spin size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang='ts' setup>
// apis
import { getUserFollowBarListAPI, getAllBarListAPI } from '@/apis/post-article';
// types 
import type { BarBase } from '@/apis/public/types/bar';
// hooks
import { reactive, computed, ref, onMounted, onBeforeUnmount } from 'vue'

// 吧列表容器的DOM
const listDOM = ref<HTMLDivElement | null>(null)
// 吧列表
const list = reactive<BarBase[]>([])
// 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})
// props
const props = defineProps<{
  select: number | null
}>()
// emit
const emit = defineEmits<{
  'update:select': [ value: number|null ]
}>()
// 格式化当前选择的吧
const currentBarLabel = computed(() => {
  if (props.select === null) {
    return '未选择'
  } else {
    const item = list.find(ele => ele.bid === props.select)
    if (item) {
      return item.bname
    } else {
      return '前端出错了!'
    }
  }
})
// 是否显示选择模态框
const showModal = ref(false)
// 当前选择的吧
const currentBid = ref(props.select)
// 是否正在加载
const isLoading = ref(false)

// 获取数据的api
const getListData = async () => {
  isLoading.value = true
  const res = await getAllBarListAPI(pagination.page, pagination.pageSize, true)
  res.data.list.forEach(ele => list.push(ele))
  pagination.total = res.data.total
  isLoading.value = false
  return res.data.has_more
}

// 取消模态框的回调
const onHandleCancel = () => {
  showModal.value = false
  currentBid.value = props.select
}
// 开启模态框的回调
const onHandleOpen = () => {
  showModal.value = true
}
// 确认的回调
const onHandleSubmit = () => {
  emit('update:select', currentBid.value)
  showModal.value = false
}
// 选择的回调
const onHandleSelect = (bid: number) => {
  currentBid.value = bid
}
// 滚动事件处理函数
const onHandleScroll = async () => {
  if (isLoading.value) {
    // 网络请求正在加载 则什么都不做
    return
  }
  const dom = listDOM.value as HTMLDivElement
  if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
    // 到底了
    pagination.page++
    const hasMore = await getListData()
    // 根据结果来移除滚动事件监听
    if (hasMore === false) {
      removeScrollListener()
    }
  }
}
// 移除滚动事件回调
const removeScrollListener = () => {
  console.log('移除事件监听');
  const dom = listDOM.value as HTMLDivElement
  dom.removeEventListener('scroll', onHandleScroll)
}
// 重置当前选择的吧
const onHandleReset = () => {
  emit('update:select', null)
  currentBid.value=null
}

// 初始化获取数据 并添加滚动事件监听
onMounted(async () => {
  const dom = listDOM.value as HTMLDivElement
  // 添加事件监听
  dom.addEventListener('scroll', onHandleScroll)
  const hasMore = await getListData()
  // 根据结果来移除滚动事件监听
  if (hasMore === false) {
    removeScrollListener()
  }
})
// 移除事件监听
onBeforeUnmount(removeScrollListener)

defineExpose({
  onHandleReset
})
</script>

<style scoped lang='scss'>
.bar-select-container {
  display: flex;
}

.select-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 9999;
  background-color: var(--bg-mask);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease var(--time-normal);

  .select-modal-container {
    height: 310px;
    border-radius: 5px;
    padding: 10px 20px;
    background-color: var(--bg-color-1);
    width: 500px;
    display: flex;
    flex-direction: column;

    .spin {
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-title {
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .select-container {
      overflow-y: auto;
      flex-grow: 1;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--scrollbar-color);
        border-radius: 10px;
      }

      .list {
        padding-right: 5px;

        .item {
          box-sizing: border-box;
          transition: var(--time-normal);
          font-size: 15px;
          padding: 15px 10px;
          border-radius: 5px;
          cursor: pointer;
          position: relative;
          &:not(:last-child) {
            margin-bottom: 5px;
          }

          &.active,
          &:hover {
            background-color: var(--bg-color-4);
          }
          &.active::after{
            content: '√';
            position: absolute;
            right: 10px;
          }
        }
      }
    }
  }
}

// 移动端下的选择框
@media screen and (max-width:650px) {
  .select-modal {
    padding: 10px;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 9999;
    background-color: var(--bg-color-2);

    .select-modal-container {
      height: 100%;
      width: 100%;
      background-color: var(--bg-color-2);
      padding: 0;
      .page-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
      }
    }
  }

}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all var(--time-normal) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: .3;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>