<template>
  <div class="navigation-item">

    <template v-if="children">
      <div class="content" @click="isActive = !isActive">
        <span>{{ title }}</span>
        <n-icon :class="{ 'active': isActive }">
          <RightOutlined />
        </n-icon>
      </div>
      <Transition name="list">
        <div v-if="isActive" class="sub-list ml-5 mt-5">
          <div class="sub-item" @click="()=>onHandleNav(item.path)" v-for="item in children" :key="item.path">{{ item.title }}</div>
        </div>
      </Transition>
    </template>

    <template v-else>
      <div class="content text" @click="()=>onHandleNav(path)">
        <span>{{ title }}</span>
      </div>
    </template>
    
  </div>
</template>

<script lang='ts' setup>
// type
import type { NavigationItemProps } from '@/types/components/layout/index'
// components
import { RightOutlined } from '@vicons/antd'
// hooks
import { ref } from 'vue'
import { useRouter } from 'vue-router';

// 路由导航对象
const router = useRouter()
// 二级路由是否激活
const isActive = ref(false)
// props
defineProps<NavigationItemProps&{isShow:boolean}>()
// emits
const emits = defineEmits<{
  'update:is-show':[value:boolean]
}>()
// 路由导航
const onHandleNav = (path:string) => {
  // 隐藏菜单栏
  emits('update:is-show',false)
  router.push(path)
}

</script>

<style scoped lang='scss'>
.navigation-item {
  border-radius: 3px;
  transition: var(--time-normal);
  padding: 5px 8px;
  cursor: pointer;
  .sub-list {
    .sub-item {
      padding: 5px;

      &:hover {
        color: var(--primary-color)
      }
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    i {
      transition: var(--time-normal);

      &.active {
        transform: rotate(90deg);
      }
    }
  }

  &:hover {
    background-color: var(--bg-color-4);
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: var(--time-normal) all ease;
  overflow: hidden;
}

.list-enter-from,
.list-leave-to {
  height: 0;
}

.list-enter-to,
.list-leave-from {
  height: auto;
}

.list-leave-active {
  position: absolute;
}</style>