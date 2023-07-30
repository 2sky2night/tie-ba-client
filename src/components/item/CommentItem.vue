<template>
    <div class="comment-item-container" ref="itemIns">
        <div class="header">
            <div class="username">
                <RouterLink :to="`/user/${comment.uid}`" @click.stop="">
                    <img v-lazyImg="comment.user.avatar" @mouseenter="showCard = true" @mouseleave="onHandleMouseLeave">
                </RouterLink>
                <RouterLink :to="`/user/${comment.uid}`" @click.stop="">
                    <span class="text">{{ comment.user.username }}</span>
                </RouterLink>
                <BarRank v-if="!props.goArticle" :level="comment.user.bar_rank.level"
                    :label="comment.user.bar_rank.label" />
                <Transition name="card">
                    <UserCard ref="userCardIns" :uid="comment.uid" v-if="showCard" v-model:show="showCard" :top="60"
                        :left="0" />
                </Transition>
            </div>
        </div>
        <div class="content" @click="onHandleLookReply">
            <p>{{ comment.content }}</p>
            <div class="img-list mb-10" v-if="comment.photo !== null">
                <img v-lazyImg="item" v-imgPre="item" v-for="item in comment.photo" :key="item">
            </div>
            <div class="reply-container mb-10" v-if="comment.reply.total">
                <div class="reply-pre">
                    <div class="reply-pre-item" v-for="item in comment.reply.list.slice(0, 3)" :key="item.rid">
                        <div class="user">
                            <img class="mr-5" v-lazyImg="item.user.avatar">
                            <RouterLink :to="`/user/${item.uid}`" @click.stop="">
                                <span class="text">{{ item.user.username }}</span>
                            </RouterLink>
                        </div>
                        <div class="reply-content">
                            <div class="reply-comment ml-5" v-if="item.type === 1">
                                <span>:</span>
                                <span class="content-text">{{ item.content }}</span>
                            </div>
                            <div class="reply ml-5" v-if="item.reply">
                                <span>回复</span>
                                <RouterLink :to="`/user/${item.reply.uid}`" @click.stop="">
                                    <span class="text ml-5">@{{ item.reply.user.username }}</span>
                                </RouterLink>
                                <span>:</span>
                                <span class="content-text">{{ item.content }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <template v-if="props.goArticle">
                    <div class="sub-text">共{{ comment.reply.total }}个回复</div>
                </template>
                <template v-else>
                    <div class="show-more mt-5" v-if="comment.reply.total > 3">
                        <span class="text" @click.stop="onHandleLookReply">查看全部{{ comment.reply.total }}项</span>
                    </div>
                </template>
            </div>
            <div class="time">
                <span class="time sub-text">{{ formatDBDateTime(comment.createTime) }}</span>
                <auth-btn>
                    <div @click.stop="onHandleLikeArticle" class="like-btn" :class="{ 'active': isLike }">
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
import { ref, onMounted } from 'vue'
import useNavigation from '@/hooks/useNavigation';
// apis
import { likeCommentAPI, cancelLikeCommentAPI } from '@/apis/public/article'
// components
import { LikeOutlined, LikeFilled } from '@vicons/antd'
import UserCard from '@/components/common/UserCard/index.vue'
import BarRank from '@/components/common/BarRank/index.vue'
// types
import type { CommentItemProps } from '@/types/components/item';
// utils
import { formatDBDateTime } from '@/utils/tools'
import PubSub from 'pubsub-js';
// config
import tips from '@/config/tips';
// render
import asyncDialog from '@/render/modal/dialog';
import replyDrawer from '@/render/drawer/replyDrawer'

// 导航
const { goArticle } = useNavigation()
// 组件DOM
const itemIns = ref<HTMLDivElement | null>(null)
// 点赞评论正在加载
let isLoading = false
const message = useMessage()
const props = withDefaults(defineProps<CommentItemProps>(), {
    goArticle: false
})
const emit = defineEmits<{
    'update:likeCount': [value: number];
    'update:isLike': [value: boolean]
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
        if (showCard.value) {
            // 在.5s后 还打开着卡片 并移出了卡片就关闭卡片           
            if (!userCardIns.value.isMouseOn) {
                // 若移出头像.5秒后鼠标未进入了卡片 则隐藏卡片
                showCard.value = false
            }
        }

    }, 500)
}
// 点击查看当前评论的全部回复的回调
const onHandleLookReply = () => {
    // 若点击评论要跳转到对应帖子中去 则点击评论不显示回复详情
    !props.goArticle && replyDrawer(props.comment.cid)
}
// 监听抽屉的点赞评论 从而给对应评论点赞
PubSub.subscribe('to-like-comment', async (_, cid: number) => {
    // 若收到的是当前评论需要点赞 则发送请求点赞评论
    if (props.comment.cid === cid) {
        // 是当前评论需要点赞 发送请求获取数据
        await onHandleLikeArticle()
    }
})

// 通过读取props 给组件实例绑定点击事件 是否点击评论项进入帖子详情页
onMounted(() => {
    if (props.goArticle) {
        itemIns.value?.addEventListener('click', async () => {
            try {
                await asyncDialog('提示', '是否浏览该帖子?')
                goArticle(props.comment.aid)
            } catch (error) {

            }
        })
    }
})

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
            display: flex;
            align-items: center;
            a{
                margin-right:10px ;
            }
            img {
                border-radius: 50%;
                width: 50px;
                height: 50px;
            }
        }
    }

    .content {
        margin-left: 60px;
        cursor: pointer;

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

        .reply-container {
            padding: 10px;
            background-color: var(--bg-color-3);

            .reply-pre {
                .reply-pre-item {
                    padding: 5px 0;

                    .user {
                        img {
                            width: 30px;
                            border-radius: 50%;
                            height: 30px;
                        }

                        span {
                            font-size: 13px;
                        }
                    }

                    .reply-content {
                        padding-left: 35px;

                        .content-text {
                            font-size: 14px;
                            // word-break: break-all;
                            // overflow: hidden;
                            // display: -webkit-box;
                            // -webkit-line-clamp: 2;
                            // -webkit-box-orient: vertical;
                        }

                        .reply {
                            font-size: 14px;
                        }

                        .reply-comment {
                            display: flex;

                            span:first-child {
                                display: none;
                            }
                        }
                    }
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

@media screen and (max-width:650px) {
    .comment-item-container {
        .header {
            .username {
                a{
                    span{
                        font-size: 13px;
                    }
                    margin-right: 3px;
                }
                img {
                    width: 35px;
                    height: 35px;
                }
            }
        }

        .content {
            margin-left: 40px;
            .img-list {
                display: flex;
                flex-direction: column;

                img {
                    width: unset;
                    height: unset;

                    &:not(:last-child) {
                        margin-bottom: 10px;
                    }
                }
            }

            .reply-container {
                .show-more {
                    font-size: 13px;
                }

                .reply-pre {

                    .reply-pre-item {
                        display: flex;

                        .user {
                            span {
                                white-space: nowrap;
                            }

                            img {
                                display: none;
                            }
                        }

                        .reply-content {
                            padding: 0;
                            font-size: 14px;

                            .reply {
                                position: relative;
                                top: 2px;
                                font-size: 12px;

                                .content-text {
                                    margin-left: 5px;
                                    font-size: 12px;
                                }
                            }

                            .reply-comment {
                                .content-text {
                                    position: relative;
                                    top: 2px;
                                    font-size: 12px;
                                }

                                span:first-child {
                                    display: inline;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}</style>