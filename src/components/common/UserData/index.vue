<template>
    <div class="user-data-container">
        用户信息

        <div class="item">
            <div class="title">
                <n-icon size="20">
                    <ReaderOutline />
                </n-icon>
                <span>帖子</span>
            </div>
            <div class="info">
                <div>
                    <span>{{ article.article_count }}</span>
                    <span>发送</span>
                </div>
                <div>
                    <span>{{ article.article_liked_count }}</span>
                    <span>被赞</span>
                </div>
                <div>
                    <span>{{ article.article_like_count }}</span>
                    <span>点赞</span>
                </div>
                <div>
                    <span>{{ article.article_star_count }}</span>
                    <span>收藏</span>
                </div>
                <div>
                    <span>{{ article.article_stared_count }}</span>
                    <span>被收藏</span>
                </div>
            </div>
        </div>

        <div class="item">
            <div class="title">
                <n-icon size="20">
                    <BeerOutline />
                </n-icon>
                <span>吧</span>
            </div>
            <div class="info">
                <div>
                    <span>{{ bar.create_bar_count }}</span>
                    <span>创建</span>
                </div>
                <div>
                    <span>{{ bar.follow_bar_count }}</span>
                    <span>关注</span>
                </div>
            </div>
        </div>

        <div class="item">
            <div class="title">
                <n-icon size="20">
                    <CommentOutlined />
                </n-icon>
                <span>评论</span>
            </div>
            <div class="info">
                <div>
                    <span> {{ comment.comment_count }}</span>
                    <span>发送</span>
                </div>
                <div>
                    <span>{{ comment.comment_liked_count }}</span>
                    <span>被赞</span>
                </div>
                <div>
                    <span>{{ comment.comment_like_count }}</span>
                    <span>点赞</span>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang='ts' setup>
// types
import type { UserDataProps } from '@/types/components/common'
// component
import { NIcon } from 'naive-ui';
import { CommentOutlined } from '@vicons/antd'
import { BeerOutline, ReaderOutline } from '@vicons/ionicons5'
defineProps<UserDataProps>()
</script>

<style scoped lang='scss'>
.user-data-container {
    .item {
        padding: 10px 0;

        .title {
            display: flex;
            align-items: center;
        }

        .info {
            display: flex;
            flex-wrap: wrap;

            div {
                height: 70px;
                width: 70px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px 10px;

                span:last-child {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>