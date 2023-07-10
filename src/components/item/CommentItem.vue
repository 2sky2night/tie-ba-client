<template>
    <div class="comment-item-container">
        <div class="header ">
            <div class="username">
                <RouterLink :to="`/user/${ comment.uid }`">
                    <img v-lazyImg="comment.user.avatar" @mouseenter="showCard = true" @mouseleave="onHandleMouseLeave">
                </RouterLink>
                <RouterLink class="ml-10" :to="`/user/${ comment.uid }`">
                    <span class="text">{{ comment.user.username }}</span>
                </RouterLink>
                <Transition name="card">
                    <UserCard ref="userCardIns" :uid="comment.uid" v-if="showCard" v-model:show="showCard" />
                </Transition>
            </div>
        </div>
        <div class="content">
            <p>{{ comment.content }}</p>
            <div class="img-list mb-10" v-if="comment.photo !== null">
                <img v-lazyImg="item" v-imgPre="item" v-for="    item     in comment.photo" :key="item">
            </div>
            <div class="time">
                <span class="time sub-text">{{ formatDBDateTime(comment.createTime) }}</span>
                <auth-btn>
                    <div @click="onHandleLikeArticle" class="like-btn" :class="{ 'active': isLike }">
                        <n-icon size="18">
                            <component :is="isLike ? 'LikeFilled' : 'LikeOutlined'"></component>
                        </n-icon>
                        <span class="count ml-5">{{ likeCount }}</span>
                    </div>
                </auth-btn>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// hooks
import { useMessage } from 'naive-ui';
import { ref } from 'vue'
// apis
import { likeCommentAPI, cancelLikeCommentAPI } from '@/apis/public/article'
// components
import { LikeOutlined, LikeFilled } from '@vicons/antd'
import UserCard from '@/components/common/UserCard/index.vue'
// types
import type { CommentItemProps } from '@/types/components/item';
// utils
import { formatDBDateTime } from '@/utils/tools'
// config
import tips from '@/config/tips';

// 点赞评论正在加载
let isLoading = false
const message = useMessage()
const props = defineProps<CommentItemProps>()
const emit = defineEmits<{
    'update:likeCount': [ value: number ];
    'update:isLike': [ value: boolean ]
}>()
// 是否显示用户卡片
const showCard = ref(false)
// 用户卡片的实例 
const userCardIns = ref()

// 点赞评论
const onHandleLikeArticle = async () => {
    if (isLoading) {
        // 防止上次请求未完成就重复点击按钮执行回调
        return
    }
    isLoading = true
    if (props.isLike) {
        // 取消点赞评论
        await cancelLikeCommentAPI(props.comment.cid)
        message.success(tips.successCancelLikeComment)
        emit('update:likeCount', props.likeCount - 1)
    } else {
        // 点赞评论
        await likeCommentAPI(props.comment.cid)
        message.success(tips.successLikeComment)
        emit('update:likeCount', props.likeCount + 1)
    }
    emit('update:isLike', !props.isLike)
    isLoading = false
}
// 移出用户头像的回调
const onHandleMouseLeave = () => {
    // 当鼠标移出头像后 超过阈值未进入用户卡片 就销毁卡片
    setTimeout(() => {
        if (!userCardIns.value.isMouseOn) {
            // 若移出头像.5秒后鼠标未进入了卡片 则隐藏卡片
            showCard.value = false
        }

    }, 500)
}

defineOptions({
    components: {
        LikeOutlined,
        LikeFilled
    }
})
</script>

<style scoped lang='scss'>
.comment-item-container {

    box-sizing: border-box;
    padding: 10px;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .username {
            position: relative;

            img {
                border-radius: 50%;
                width: 50px;
                height: 50px;
            }
        }
    }

    .content {
        padding-left: 60px;

        p {
            word-break: break-all;
            margin-bottom: 15px;
        }

        .img-list {
            display: flex;
            flex-wrap: wrap;

            img {
                width: 30vh;
                height: 30vh;
                object-fit: cover;
                margin-bottom: 10px;

                &:not(:last-child) {
                    margin-right: 10px;
                }
            }
        }

        .time {
            display: flex;
            justify-content: space-between;

            .like-btn {
                display: flex;
                align-items: center;
                cursor: pointer;
                color: var(--text-color-2);

                i {
                    position: relative;
                    top: -2px;
                }

                &.active {
                    color: red;
                }
            }
        }
    }
}

.card-enter-active {
    animation: cardMove 1 var(--time-normal) ease;
}

.card-leave-active {
    animation: cardMove 1 var(--time-normal) ease reverse;
}

@keyframes cardMove {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media screen and (max-width:651px) {
    .comment-item-container {
        .content {
            .img-list {
                display: flex;
                flex-direction: column;

                img {
                    width: unset;
                    height: unset;
                    object-fit: contain;

                    &:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
}
</style>