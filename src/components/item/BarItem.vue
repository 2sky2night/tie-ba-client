<template>
    <div class="bar-item-container" @click="()=> goBar(bar.bid)">

        <div class="info">
            <img class="mr-10" v-lazyImg="bar.photo">
            <div class="bar-info">
                <div class="bar-name">
                    <n-ellipsis :line-clamp="1">
                        {{ bar.bname }}
                    </n-ellipsis>
                    <follow-bar-btn :bid="bar.bid" v-model:is-followed="bar.is_followed" size="small"
                        v-model:follow-count="bar.user_follow_count" />
                </div>
                <div class="desc mt-10">
                    <n-ellipsis :line-clamp="2">
                        {{ bar.bdesc }}
                    </n-ellipsis>
                </div>
            </div>
        </div>

        <div class="data mt-5">
            <div class="item">
                <span>关注:</span>
                <span> {{ formatCount(bar.user_follow_count) }}</span>
            </div>
            <div class="item">
                <span>帖子:</span>
                <span>{{ formatCount(bar.article_count) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// types
import type { BarItemProps } from '@/types/components/item'
// hooks
import useNavigation from '@/hooks/useNavigation';
// utlis
import { formatCount } from '@/utils/tools'

defineProps<BarItemProps>()
const {goBar} = useNavigation()
</script>

<style scoped lang='scss'>
.bar-item-container {
    padding: 10px;
    cursor: pointer;
    .info {
        display: flex;
        align-items: center;
        img {
            width: 50px;
            height: 50px;
        }

        .bar-info {
            flex-grow: 1;

            .desc {
                color: var(--text-color-2);
                font-size: 12px;
            }

            .bar-name {
                height: 35px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }

    .data {
        display: flex;
        justify-content: space-between;
    }
}</style>