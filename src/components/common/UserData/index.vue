<template>
    <div class="user-data-container">
        <div class="item">
            <div class="title">
                <n-icon size="20">
                    <ReaderOutline />
                </n-icon>
                <span>帖子</span>
            </div>
            <div class="info">
                <div>
                    <n-number-animation :from="0" :to="article.article_count" />
                    <span>发送</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="article.article_liked_count" />
                    <span>被赞</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="article.article_like_count" />
                    <span>点赞</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="article.article_star_count" />
                    <span>收藏</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="article.article_stared_count" />
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
                    <n-number-animation :from="0" :to="bar.create_bar_count" />
                    <span>创建</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="bar.follow_bar_count" />
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
                    <n-number-animation :from="0" :to="comment.comment_count" />
                    <span>发送</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="comment.comment_liked_count" />
                    <span>被赞</span>
                </div>
                <div>
                    <n-number-animation :from="0" :to="comment.comment_like_count" />
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