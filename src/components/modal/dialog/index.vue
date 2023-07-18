<template>
  <Transition name="dialog" appear>
    <div class="dialog-content" v-if="isShow" @click.stop="">
      <div class="title">
        <span>{{ title }}</span>
        <NIcon class="text" size="20" @click="() => toClose(false)">
          <Close />
        </NIcon>
      </div>
      <div class="content">
        {{ content }}
      </div>
      <div class="footer">
        <button @click="() => toClose(false)">取消</button>
        <button @click="() => toClose(true)">确认</button>
      </div>
    </div>
  </Transition>
</template>

<script lang='ts' setup>
import { NIcon } from 'naive-ui'
import { Close } from '@vicons/ionicons5'
import { ref } from 'vue'

const isShow = ref(true)

defineExpose({
  isShow
})
defineProps<{
  title: string;
  content: string;
  toClose: (flag: boolean) => void
}>()
defineOptions({
  name: 'Dialog'
})
</script>

<style scoped lang='scss'>
.dialog-content {
  padding: 10px 15px;
  height: 200px;
  border-radius: 5px;
  background-color: var(--bg-color-1);
  width: 80%;
  max-width: 500px;
  display: flex;
  flex-direction: column;

  .title {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 20px;
    }

    i {
      transition: var(--time-normal) ease;

      &:hover {
        transform: rotate(90deg);
      }
    }

  }

  .content {
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  .footer {
    display: flex;
    justify-content: end;
    height: 50px;
    align-items: center;

    button {
      height: auto;
      padding: 8px 10px;
      border-radius: 3px;
      transition: var(--time-normal);
      color: var(--text-color-1);

      &:first-child {
        &:hover {
          background-color: var(--bg-color-3);
        }
      }

      &:last-child {
        color:#fff;
        background-color: var(--primary-color);
        margin-left: 10px;
      }
    }
  }
}

.dialog-leave-active {
  animation: move 1 ease var(--time-normal) reverse;
}

.dialog-enter-active {
  animation: move 1 ease var(--time-normal);
}

@keyframes move {
  from {
    transform: scale(.9);
    opacity: .3;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }

  to {
    transform: none;
  }
}</style>