<template>
    <Transition name="img" appear>
        <div v-if="isShow" class="img-preview-container" @click.stop="">
            <img :src="src" :style="{ transform: `scale(${scale})` }">
        </div>
    </Transition>
    <Transition name="tool" appear>
        <div v-if="isShow" class="tool-container">
            <div class="item text" @click.stop="scale += .1">
                <n-icon size="25">
                    <ZoomInOutlined />
                </n-icon>
            </div>
            <div class="item text" @click.stop="scale -= .1">
                <n-icon size="25">
                    <ZoomOutOutlined />
                </n-icon>
            </div>
            <div class="item text" @click.stop="toClose">
                <n-icon size="25">
                    <Close />
                </n-icon>
            </div>
        </div>
    </Transition>
</template>

<script lang='ts' setup>
// hooks
import { watch, ref } from 'vue'
// types
import type { ImgPreviewProps } from '@/types/components/common'
// components 
import { Close } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { ZoomInOutlined, ZoomOutOutlined } from '@vicons/antd'

defineProps<ImgPreviewProps>()
const isShow = ref(true)
const scale = ref(1)

watch(scale, (v) => {
    if (v < 0) {
        scale.value = 1
    } else if (v >= 10) {
        scale.value = 1
    }
})

defineExpose({
    isShow
})
defineOptions({
    name: 'ImgPrevie'
})
</script>

<style scoped lang='scss'>
.img-preview-container {
    img {
        transition: var(--time-normal);
    }
}

.tool-container {
    position: absolute;
    display: flex;
    bottom: 10%;
    padding: 0 20px;
    background-color: rgb(0, 0, 0, .35);
    height: 40px;
    left: 50%;
    align-items: center;
    justify-content: space-between;
    transform: translateX(-50%);
    border-radius: 10px;

    .item {
        color: #d1d1d1;
        display: flex;
        align-items: center;

        &:not(:last-child) {
            margin-right: 10px;
        }
    }
}


.img-enter-active {
    animation: move var(--time-normal) 1 ease-out;
}

.img-leave-active {
    animation: move var(--time-normal) 1 ease-out reverse;
}

@keyframes move {
    from {
        opacity: 0;
        transform: scale(.8);
    }

    to {
        opacity: 1;
        transform: none
    }
}

.tool-enter-active {
    animation: tools var(--time-normal) 1 ease-out;
}

.tool-leave-active {
    animation: tools var(--time-normal) 1 ease-out reverse;
}

@keyframes tools {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>