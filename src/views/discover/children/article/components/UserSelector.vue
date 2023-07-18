<template>
  <div class="user-selector-container">
    <div class="container" @mousedown="onHandleDown" ref="containerIns">
      <div class="list" v-if="list.length">
        <div class="item" :class="{ 'active': selectUser === item.uid }" @click="() => onHandleSelectUser(item.uid)"
          v-for="item in list" :key="item.uid">
          <img draggable="false" :src="item.avatar">
        </div>
      </div>
      <div class="empty" v-else>
        你还没有关注一个用户呢，快快关注吧~
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
// apis
import { discoverUserAPI } from '@/apis/discover/article';
import { getUserFollowListAPI } from '@/apis/follow';
// hooks
import { reactive, onBeforeMount, ref, onMounted } from 'vue';
import useUserStore from '@/store/user';
import { storeToRefs } from 'pinia';
// types
import type { UserBaseItem } from '@/apis/public/types/user';

// 容器实例
const containerIns = ref<HTMLDivElement | null>()
// 列表数据
const list = reactive<UserBaseItem[]>([])
// 用户数据
const { userData } = storeToRefs(useUserStore())
// props
const props = defineProps<{
  /**选择的用户*/
  selectUser: number | null
}>()
// emits
const emit = defineEmits<{
  'update:select-user': [ value: number | null ]
}>()

// 选择用户的回调
const onHandleSelectUser = (uid: number) => {
  if (props.selectUser === uid) {
    // 若当前已经选择了该用户 再次点击取消选择
    emit('update:select-user', null)
  } else {
    emit('update:select-user', uid)
  }
}

// 获取数据的api
const getListData = async () => {
  const res = await discoverUserAPI(5)
  res.data.list.forEach(ele => { list.push(ele) })
}

// 获取用户关注列表
const getFollowListData = async () => {
  const res = await getUserFollowListAPI(userData.value.uid, 1, 30, true)
  // 过滤出已经存在的用户列表
  res.data.list.filter(({uid}) => {
    return !list.some(ele => ele.uid === uid)
  }).forEach(ele=>list.push(ele))
}

// 鼠标按下容器的回调
const onHandleDown = (event: MouseEvent) => {
  const target = containerIns.value as HTMLDivElement
  // 以用户按下时记录当前的x坐标
  const downX = event.pageX
  // 移动时以该坐标来判断容器左右移动
  // 若小于阈值就往右移
  // 若大于阈值就往左移

  // 鼠标移动的回调 （滑动容器）
  const onHandleMouseMove = (e: MouseEvent) => {
    // 获取鼠标移动时的坐标
    const moveX = e.pageX
    if (moveX < downX) {
      target.scroll({ left: target.scrollLeft + 5 })
    } else {
      target.scroll({ left: target.scrollLeft - 5 })
    }
  }

  // 鼠标移出的回调 取消事件绑定
  const onHandleMouseLeave = () => {
    target.removeEventListener('mousemove', onHandleMouseMove)
    target.removeEventListener('mouseleave', onHandleMouseLeave)
  }

  // 鼠标抬起的回调 取消事件绑定
  const onHandleMouseUp = () => {
    target.removeEventListener('mousemove', onHandleMouseMove)
    target.removeEventListener('mouseup', onHandleMouseUp)
  }

  target.addEventListener('mousemove', onHandleMouseMove)
  target.addEventListener('mouseup', onHandleMouseUp)
  target.addEventListener('mouseleave', onHandleMouseLeave)
}

onBeforeMount(async () => {
  // 获取最近发帖的关注者
  await getListData()
  await getFollowListData()
})

</script>

<style scoped lang='scss'>
.user-selector-container {
  .container {
    background-color: var(--bg-color-3);
    overflow-x: auto;
    padding: 5px 10px;
    border-radius: 5px;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .list {
      display: flex;

      .item {
        transition: all ease var(--time-normal);
        border-radius: 10px;
        cursor: pointer;
        padding: 5px;
        &.active {
          background-color: var(--bg-color-3);
        }

        &:not(:last-child) {
          margin-right: 10px;
        }

        img {
          border-radius: 50%;
          max-width: 50px;
          max-height: 50px;
        }
      }
    }
  }
}
</style>