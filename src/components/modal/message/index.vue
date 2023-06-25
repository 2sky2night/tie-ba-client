<template>
    <Transition name="modal" appear>
        <div v-if="isShow" class="model-content">
            <div class="model-title">
                <span>{{ title }}</span>
                <div class="text" @click="closeHandler">
                    <NIcon>
                        <Close />
                    </NIcon>
                </div>
            </div>
            <div class="model-main">
                <slot></slot>
            </div>
        </div>
    </Transition>
</template>

<script lang='ts' setup>
import { ref, type Ref } from 'vue'
import { NIcon } from 'naive-ui';
import { Close } from '@vicons/ionicons5';

const isShow = ref(true)

defineProps<{
    title: string;
    closeHandler: () => void
}>()
defineExpose<{ isShow: Ref<boolean> }>({isShow})

</script>

<style scoped lang='scss'>
.model-content {
    padding: 10px 20px;
    width: 80%;
    max-width: 500px;
    border-radius: 5px;
    background: var(--bg-color-1);

    .model-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.modal-enter-active {
    animation: modalMove 1 var(--time-normal) ease-in-out;
}

.modal-leave-active {
    animation: modalMove 1 var(--time-normal) ease-in-out reverse;
}


@keyframes modalMove {
    from {
        transform: translateY(-20px);
        opacity: .3;
    }


    to {
        transform: none;
    }
}
</style>