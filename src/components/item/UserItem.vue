<template>
    <div class="user-item-container" @click="()=>goUser(props.user.uid)">
        <div class="user-info">
            <img class="mr-10" style="border-radius: 50%;" v-lazyImg="user.avatar">
            <div class="user">
                <div class="username">
                    <span class="text">{{ user.username }}</span>
                    <follow-btn @change-count="onHandleChangeCount" :is-fans="user.is_fans"
                        v-model:is-followed="user.is_followed" :uid="user.uid" size="small" />
                </div>
                <div class="desc sub-text">这个人很懒,简介都不写~</div>
            </div>
        </div>
        <div class="user-data mt-10">
            <div class="sub-text text" @click.stop="()=> goFollow(props.user.uid)">关注:<span>{{ user.follow_user_count }}</span></div>
            <div class="sub-text text" @click.stop="()=>goFans(props.user.uid)">粉丝:<span>{{ user.fans_count }}</span></div>
            <div class="sub-text text">帖子:<span>{{ user.article_count }}</span></div>
            <div class="sub-text text">关注吧:<span>{{ user.follow_bar_count }}</span></div>
        </div>
    </div>
</template>

<script lang='ts' setup>
// types
import type { UserItemProps } from '@/types/components/item'
import useNavigation from '@/hooks/useNavigation';

const props = defineProps<UserItemProps>()
const { goFans, goFollow, goUser } = useNavigation()
const emits = defineEmits<{
    'update:fansCount': [value: number]
}>()

const onHandleChangeCount = (flag: boolean) => {
    flag ? emits('update:fansCount', props.fansCount + 1) : emits('update:fansCount', props.fansCount - 1)
}

</script>

<style scoped lang='scss'>
.user-item-container {
    padding: 10px;
    cursor: pointer;
    .user-info {
        display: flex;

        img {
            width: 50px;
            height: 50px;
        }

        .user {
            flex-grow: 1;
            .desc{
                padding-right: 50px;
            }
            .username {
                display: flex;
                justify-content: space-between;
            }
        }
    }

    .user-data {
        display: flex;
        justify-content: space-between;
    }
}
</style>