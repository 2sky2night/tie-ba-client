<template>
    <div class="bar-item-container" @click="goNavToBar">

        <div class="info">
            <router-link :to="`/bar/${bar.bid}`" @click.stop="">
                <img class="mr-10" v-lazyImg="bar.photo">
            </router-link>
            <div class="bar-info">
                <div class="bar-name">
                    <div class="bar-data">
                        <n-ellipsis :line-clamp="1">
                            <router-link :to="`/bar/${bar.bid}`" class="text" @click.stop="">
                                {{ bar.bname }}
                            </router-link>
                        </n-ellipsis>
                        <template v-if="bar.bar_rank!==null">
                            <div class="rank ml-5" :title="bar.bar_rank.label" v-if="bar.bar_rank.level!==0">
                                <RankBadge :level="bar.bar_rank.level"/>
                            </div>
                        </template>
                    </div>
                    <follow-bar-btn :bid="bar.bid" v-model:is-followed="bar.is_followed" size="small"
                        v-model:follow-count="bar.user_follow_count" />
                </div>
                <div class="desc mt-10">
                    <n-ellipsis :line-clamp="1">
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
// components
import RankBadge from '@/components/common/RankBadge/index.vue'

const props = defineProps<BarItemProps>()
const { goBar } = useNavigation()

const goNavToBar = () => [
    goBar(props.bar.bid)
]
</script>

<style scoped lang='scss'>
.bar-item-container {
    padding: 10px;
    cursor: pointer;

    .info {
        display: flex;
        align-items: center;

        img {
            position: relative;
            top: -5px;
            min-width: 50px;
            height: 50px;
        }

        .bar-info {
            flex-grow: 1;
            .bar-data{
                display: flex;
                .rank{
                    display: flex;
                    align-items: center;
                }
            }
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
}

@media screen and (max-width:650px){
    .bar-item-container{
        .info{
             .bar-info {
                .bar-data{
                    .rank{
                        >div{
                            transform: scale(.8);
                        }
                    }
                }
             }
        }
    }
}

</style>