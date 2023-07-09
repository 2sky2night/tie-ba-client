<template>
    <div class="comment-container">
        <div class="your-comment mb-10">
            <n-input class="mb-10" maxlength="1000" show-count :placeholder="tips.commentPlaceholder"
                v-model:value="commentBody.content" type="textarea" :resizable="false"></n-input>
            <div class="photo-list mb-10" v-if="fileList.length">
                <div class="photo-title">选择的图片:</div>
                <n-upload :show-remove-button="false" :default-file-list="fileList" list-type="image" />
            </div>
            <div class="btns">
                <auth-btn>
                    <n-button :disabled="!commentBody.content" size="large" type="primary" class="mr-10"
                        @click="onHandleSendComment" :loading="isLoadingSend">发送</n-button>
                </auth-btn>
                <auth-btn>
                    <n-button size="large" @click="isShow = true">配图</n-button>
                </auth-btn>
            </div>
        </div>
        <div class="comments" ref="commentsIns">
            <div class="switch mb-10">
                <n-switch :loading="isLoadingOrder" :value="isDesc" @update:value="onHandleOrder">
                    <template #checked>
                        降序
                    </template>
                    <template #unchecked>
                        升序
                    </template>
                </n-switch>
            </div>
            <CommentListInf ref="listInf" :get-data="getCommentList"></CommentListInf>
        </div>
        <UploadImg ref="loadIns" :photo="commentBody.photo" :img-list="fileList" v-model="isShow" />
    </div>
</template>

<script lang='ts' setup>
// hooks
import { ref, reactive, watch } from 'vue'
import { useMessage } from 'naive-ui';
// apis
import { getArticleCommentAPI, commentArticleAPI } from '@/apis/article';
// config
import tips from '@/config/tips';
// types
import type { UploadFileInfo } from 'naive-ui';
// components
import UploadImg from '@/components/common/UploadImg/index.vue'
// utlis
import PubSub from 'pubsub-js';

// 按照升序或降序排序评论
const isDesc = ref(false)
// 正在加载排序
const isLoadingOrder = ref(false)
// 正在加载发送评论
const isLoadingSend = ref(false)
// 评论区实例
const commentsIns = ref<HTMLDivElement | null>(null)
// 上传配图模态框实例
const loadIns = ref()
// 是否显示上传配图的模态框
const isShow = ref(false)
// 选择的图片文件列表
const fileList = reactive<UploadFileInfo[]>([])
// 评论数据
const commentBody = reactive<{ content: string, photo: string[] }>({
    content: '',
    photo: []
})
// 消息提示api
const message = useMessage()
// props
const props = defineProps<{ aid: number }>()
// 评论列表实例
const listInf = ref()

// 获取评论数据
const getCommentList = async (page: number, pageSize: number) => {
    const res = await getArticleCommentAPI(props.aid, page, pageSize, isDesc.value)
    return res.data
}
// 重置评论数据
const onHandleReset = () => {
    commentBody.content = ''
    // 该组件暴露的api会清除photo、图片文件列表
    loadIns.value.onHandleReset()
}
// 发送评论的回调
const onHandleSendComment = async () => {
    if (!commentBody.content.trim()) {
        commentBody.content = ''
        return message.warning(tips.emptyStringWaring)
    }
    isLoadingSend.value = true
    await commentArticleAPI({ aid: props.aid, photo: commentBody.photo.length ? commentBody.photo : null, content: commentBody.content })
    message.success(tips.successComment)
    // 清空评论的内容以及配图
    onHandleReset()
    // 重新加载评论数据
    listInf.value.resetPage()
    // 加载完成
    isLoadingSend.value = false
}
// 评论排序更新的回调
const onHandleOrder = async (value: boolean) => {
    isLoadingOrder.value = true
    isDesc.value = value
    // 重置页数 获取数据
    await listInf.value.resetPage()
    isLoadingOrder.value = false
}
// 监听actions组件通知是否重新加载评论列表
PubSub.subscribe('reloadComment', () => {
    listInf.value.resetPage()
})
// 监听actions组件通知让评论区进入视图
PubSub.subscribe('toCommentArea', () => {
    (commentsIns.value as HTMLDivElement).scrollIntoView({ behavior: 'smooth' })
})
// 监听路由变化 重置页数加载评论数据
watch(() => props.aid, () => {
    listInf.value.resetPage()
    onHandleReset()
})


defineOptions({
    name: 'Comment'
})
</script>

<style scoped lang='scss'>
.comment-container {
    .your-comment {

        .btns {
            display: flex;
            justify-content: start;
        }

        :deep(.n-upload-file-list) {
            position: relative;
            top: -20px;
        }
    }

    .comments {
        .switch {
            display: flex;
            justify-content: end;
        }
    }
}

@media screen and (max-width:651px) {
    .comment-container {
        .your-comment {
            display: none;
        }
    }
}
</style>