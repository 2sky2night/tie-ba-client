<template>
  <div class="actions-container" @click="goPostArticle" title="发帖">
    <n-icon>
      <IosAdd />
    </n-icon>
  </div>
</template>

<script lang='ts' setup>
// components
import { IosAdd } from '@vicons/ionicons4';
// hooks
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps<{ bid: number }>()
const goPostArticle = () => {
  router.push({ path: '/post-article', query: { bid: props.bid } })
}

defineOptions({
  name: 'Actions'
})
</script>

<style scoped lang='scss'>
.actions-container {
  position: fixed;
  right: 50px;
  bottom: 80px;
  height: 50px;
  width: 50px;
  background-color: var(--primary-color);
  transform: rotate(45deg);
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 0 10px var(--shadow-color-1);

  &:hover {
    animation: move ease var(--time-normal) 1;
  }

  i {
    color: #fff;
    transform: rotate(-45deg);
    font-size: 50px;
  }
}

@keyframes move {
  from {
    transform: scale(.8) rotate(45deg);
  }

  50% {
    transform: scale(1.1) rotate(45deg);
  }

  100% {
    transform: rotate(45deg);
  }
}
</style>