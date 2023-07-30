<template>
  <div class="bar-info mb-10">
    <template v-if="barInfo">
      <div class="bar-info-container mb-10">
        <div class="bar-img">
          <img v-imgPre="barInfo.photo" :src="barInfo.photo">
        </div>
        <div class="bar-info ml-10" :class="{ 'has-check': barInfo.is_followed }">
          <div class="header mb-10">
            <div class="bar-title">
              <img class="mr-10" v-imgPre="barInfo.photo" :src="barInfo.photo">
              <div class="title">{{ barInfo.bname }}吧</div>
            </div>
            <div class="btns">
              <follow-bar-btn :bid="barInfo.bid" v-model:isFollowed="barInfo.is_followed" size="small"
                v-model:follow-count="barInfo.user_follow_count" @update:isFollowed="onHandleFollowBar"></follow-bar-btn>
              <n-button v-if="isShowEditBtn" size="small" type='primary' class="ml-10"
                @click="onHandleShowModel">编辑</n-button>
            </div>
          </div>
          <div title="查看吧简介" class="desc mb-10" @click="onHandleShowDesc">
            <span>简介:</span>
            {{ barInfo.bdesc }}
          </div>
          <div class="data mb-10">
            <div class="item sub-text">
              <span>帖子:</span>
              <span>{{ formatCount(barInfo.article_count) }}</span>
            </div>
            <div class="item sub-text ml-10">
              <span>关注:</span>
              <span>{{ formatCount(barInfo.user_follow_count) }}</span>
            </div>
          </div>
          <div class="user">
            <div class="username">
              <span class="mr-5">吧主</span>
              <RouterLink :to="`/user/${barInfo.uid}`">
                <img :src="barInfo.user.avatar" class="mr-5">
              </RouterLink>
              <RouterLink :to="`/user/${barInfo.uid}`">
                <span class="text">{{ barInfo.user.username }}</span>
              </RouterLink>
            </div>
            <follow-btn :uid="barInfo.uid" size="small" v-model:isFollowed="barInfo.user.is_followed"
              :is-fans="barInfo.user.is_fans"></follow-btn>
          </div>
          <div class="user-check-bar-info" id="check-pc" v-if="barInfo.my_bar_rank && barInfo.my_bar_rank.level > 0">
            <div class="mb-5">
              <span style="font-size: 13px;">LV{{ barInfo.my_bar_rank.level }} {{ barInfo.my_bar_rank.label }}</span>
              <ProgressBar :value="barInfo.my_bar_rank.progress" size="small" />
            </div>
            <div class="current-exp mb-5">
              <div>
                <span class="text">经验:</span>
                <span>{{ currentExp }}</span>
              </div>
              <n-button @click="onHandleSignInBar" :disabled="barInfo.is_checked" size="small"
                :type="barInfo.is_checked ? 'primary' : 'default'">
                <span style="font-size: 12px;"> {{ barInfo.is_checked ? '已签到' : '签到' }}</span>
              </n-button>
            </div>
          </div>
        </div>
      </div>
      <div class="user-check-bar-info" id="check-pe" v-if="barInfo.my_bar_rank && barInfo.my_bar_rank.level > 0">
        <div class="mb-5">
          <span>LV{{ barInfo.my_bar_rank.level }} {{ barInfo.my_bar_rank.label }}</span>
          <ProgressBar :value="barInfo.my_bar_rank.progress" />
        </div>
        <div class="current-exp mb-5">
          <div>
            <span class="text">经验:</span>
            <span>{{ currentExp }}</span>
          </div>
          <n-button @click="onHandleSignInBar" :disabled="barInfo.is_checked" size="small"
            :type="barInfo.is_checked ? 'primary' : 'default'">
            <span style="font-size: 12px;"> {{ barInfo.is_checked ? '已签到' : '签到' }}</span>
          </n-button>
        </div>
      </div>
    </template>
    <BarSkeleton v-else></BarSkeleton>
  </div>
  <!--修改吧信息的模态框-->
  <Teleport to="body">
    <Transition :name="isMoblie ? 'moblie' : 'pc'">
      <div class="edit-bar-modal" v-if="isShowModal">
        <div class="edit-bar-modal-container">
          <div class="title mb-10">
            <span>编辑吧信息</span>
            <div class="btns">
              <n-button :size="isMoblie ? 'large' : 'small'" class="mr-5" @click="onHandleCancelEdit">取消</n-button>
              <n-button type="primary" :size="isMoblie ? 'large' : 'small'" :loading="isLoading"
                @click="onHandleSubmitEdit">确认</n-button>
            </div>
          </div>
          <div class="edit-form">
            <n-form :rules="rules" ref="formIns" :model="model" :size="isMoblie ? 'large' : 'small'">
              <n-form-item path="bname" label="吧名">
                <n-input maxlength="15" show-count :placeholder="tips.formPlaceholder('吧名')"
                  v-model:value="model.bname"></n-input>
              </n-form-item>
              <n-form-item path="bdesc" label="吧简介">
                <n-input :resizable="false" type="textarea" show-count maxlength="120"
                  :placeholder="tips.formPlaceholder('吧简介')" v-model:value="model.bdesc"></n-input>
              </n-form-item>
              <n-form-item path="photo" label="头像">
                <div class="photo-item">
                  <div class="selector mb-10">
                    <n-button type="primary" @click="() => isShowCutter = true"
                      :size="isMoblie ? 'large' : 'small'">选择</n-button>
                  </div>
                  <div class="img-pre">
                    <img class="mr-10" :src="model.photo">
                    <img class="mr-10" :src="model.photo">
                    <img :src="model.photo">
                  </div>
                </div>
              </n-form-item>
            </n-form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <!--裁剪吧头像的模态框-->
  <n-modal v-model:show="isShowCutter">
    <div class="img-cutter">
      <ImgCutter :isModal="false" @onChooseImg="onHandleChoose" @cutDown="onHandleCutDown"
        :boxWidth="isMoblie ? 300 : 500">
        <template #open>
          <n-button type="primary" size='medium'>选择</n-button>
        </template>
        <template #choose>
          <n-button type="primary" size='medium'>选择</n-button>
        </template>
        <template #cancel>
          <n-button class="mr-5" size='medium' @click="() => isShowCutter = false">取消</n-button>
        </template>
        <template #confirm>
          <n-button type="primary" size='medium'>确认</n-button>
        </template>
      </ImgCutter>
    </div>
  </n-modal>
</template>

<script lang='ts' setup>
// hooks
import { ref, onBeforeMount, watch, h, reactive, computed } from 'vue'
import useIsMobile from '@/hooks/useIsMobile';
import { useMessage } from 'naive-ui'
import useUserStore from '@/store/user';
// apis
import { getBarInfoAPI, editBarInfoAPI, signInBarAPI, getBarRankRuleAPI } from '@/apis/bar'
import { uploadImgAPI } from '@/apis/public/file';
// types
import { type FormInst, type FormRules } from 'naive-ui';
import type { BarInfoResponse, BarRankItem } from '@/apis/bar/types';
// utils
import { formatCount } from '@/utils/tools';
import modal from '@/render/modal/message';
import Pubsub from 'pubsub-js'
import tips from '@/config/tips';
// components
import BarSkeleton from '@/components/skeleton/views/BarSkeleton.vue'
import ImgCutter from 'vue-img-cutter'
import ProgressBar from '@/components/progress-bar/index.vue'

// 用户仓库
const userStore = useUserStore()
// 是否显示编辑吧按钮
const isShowEditBtn = computed(() => {
  if (barInfo.value && userStore.isLogin) {
    if (barInfo.value.uid === userStore.userData.uid) {
      return true
    }
  }
  return false
})
// 表单实例
const formIns = ref<FormInst | null>(null)
// 编辑的表单规则
const rules: FormRules = {
  bname: {
    validator(_, value: string) {
      if (value.trim()) {
        return true
      } else {
        return new Error(tips.formNotEmpty('吧名'))
      }
    },
    trigger: ['input', 'blur']
  },
  bdesc: {
    validator(_, value: string) {
      if (value.trim()) {
        return true
      } else {
        return new Error(tips.formNotEmpty('吧简介'))
      }
    },
    trigger: ['input', 'blur']
  },
  photo: {
    validator(_, value: string) {
      if (value.trim()) {
        return true
      } else {
        return new Error(tips.formNotEmpty('配图'))
      }
    },
  }
}
// 编辑是否正在加载
const isLoading = ref(false)
// message
const message = useMessage()
// 是否显示裁剪图片的模态框
const isShowCutter = ref(false)
// 是否需要移动端布局
const isMoblie = useIsMobile()
// 是否显示修改吧的模态框
const isShowModal = ref(false)
// 吧的信息
const barInfo = ref<BarInfoResponse | null>(null)
// props
const props = defineProps<{ bid: number }>()
// 编辑吧信息的数据
const model = reactive({
  bname: '',
  bdesc: '',
  photo: ''
})
// 当前用户的经验比
const currentExp = computed(() => {
  if (barInfo.value && barInfo.value.my_bar_rank) {
    if (barInfo.value.my_bar_rank.score === 0) {
      // 若用户经验为0
      return `${barInfo.value.my_bar_rank.score} / 15 `
    } else if (barInfo.value.my_bar_rank.score >= 20000) {
      return `${barInfo.value.my_bar_rank.score} / 0`
    } else {
      return `${barInfo.value.my_bar_rank.score} / ${Math.round(barInfo.value.my_bar_rank.score / barInfo.value.my_bar_rank.progress)}`
    }
  } else {
    return null
  }
})

// 获取吧的信息
async function getBarData() {
  const res = await getBarInfoAPI(props.bid)
  barInfo.value = res.data
  model.bdesc = res.data.bdesc
  model.bname = res.data.bname
  model.photo = res.data.photo
}
// 点击查看简介
const onHandleShowDesc = () => {
  modal('吧简介', () => [
    h('div', barInfo.value?.bdesc)
  ])
}
// 关注吧状态更新的回调 (自定义事件可以绑定多个处理函数?)
const onHandleFollowBar = async (v: boolean) => {
  // 通知panel下的用户关注列表组件重新加载
  Pubsub.publish('toFollowBar')
  // 通过当前用户关注吧的状态来显示签到模块
  if (v) {
    // 关注了 更新用户签到信息为1级
    // 需要先发送请求获取吧等级制度获取1级的头衔昵称
    const res = await getBarRankRuleAPI(props.bid);

    (barInfo.value as BarInfoResponse).my_bar_rank = {
      // 获取一级的吧等级头衔
      label: res.data.rank_rules[0].label,
      level: 1,
      score: 0,
      progress: 0
    }
  } else {
    // 取消关注了 清除用户签到信息
    (barInfo.value as BarInfoResponse).my_bar_rank = {
      label: '绿牌页友',
      level: 0,
      score: 0,
      progress: 0
    };
    // 清空签到状态
    (barInfo.value as BarInfoResponse).is_checked = false
  }
}
// 点击编辑吧的回调
const onHandleShowModel = () => isShowModal.value = true
// 裁剪图片成功的回调
const onHandleCutDown = async (value: { file: File }) => {
  const data = new FormData()
  data.append('image', value.file)
  const res = await uploadImgAPI(data)
  model.photo = res.data
  message.success(tips.successUpload)
  isShowCutter.value = false
}
// 选择图片的回调
const onHandleChoose = (file: File) => {
  if (file.size > 10 * 1024 * 1024) {
    // 文件大于10mb
    message.warning(tips.imageSizeOverflow)
    isShowCutter.value = false
  }
}
// 取消编辑的回调
const onHandleCancelEdit = () => {
  isShowModal.value = false
  model.bdesc = (barInfo.value as BarInfoResponse).bdesc
  model.photo = (barInfo.value as BarInfoResponse).photo
  model.bname = (barInfo.value as BarInfoResponse).bname
}
// 确认编辑的回调
const onHandleSubmitEdit = async () => {
  await formIns.value?.validate()
  isLoading.value = true
  // 发送请求更新吧信息
  await editBarInfoAPI({
    bid: props.bid,
    bdesc: model.bdesc,
    bname: model.bname,
    photo: model.photo
  });
  // 成功修改吧数据
  (barInfo.value as BarInfoResponse).bdesc = model.bdesc;
  (barInfo.value as BarInfoResponse).photo = model.photo;
  (barInfo.value as BarInfoResponse).bname = model.bname;
  message.success(tips.successEditBar)
  isShowModal.value = false
  isLoading.value = false
}
// 用户签到吧的回调
const onHandleSignInBar = async () => {
  const res = await signInBarAPI(props.bid);
  if (barInfo.value && barInfo.value.my_bar_rank) {
    barInfo.value.is_checked = true;
    barInfo.value.my_bar_rank.progress = res.data.progress
    barInfo.value.my_bar_rank.level = res.data.level
    barInfo.value.my_bar_rank.score = res.data.score
    barInfo.value.my_bar_rank.label = res.data.label
  }
  message.success(tips.successSignIn)
}
// 若吧主修改了吧头衔信息 需要同步更新当前等级信息
PubSub.subscribe('updateRank', (_, list: BarRankItem[]) => {
  if (barInfo.value && barInfo.value.my_bar_rank) {
    barInfo.value.my_bar_rank.label = list[barInfo.value.my_bar_rank.level - 1].label
  }
})

// 路由更新 获取最新的吧数据
watch(() => props.bid, () => {
  barInfo.value = null
  getBarData()
})

onBeforeMount(getBarData)

defineOptions({
  name: 'BarInfo'
})
</script>

<style scoped lang='scss'>
.img-cutter {
  background-color: var(--bg-color-1);
  padding: 20px;
}

.edit-bar-modal {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1999;
  transition: all ease var(--time-normal);
  background-color: var(--bg-mask);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .edit-bar-modal-container {
    box-sizing: border-box;
    padding: 10px;
    width: 80%;
    max-width: 500px;
    height: 460px;
    border-radius: 10px;
    transition: all ease var(--time-normal);
    background-color: var(--bg-color-1);

    .img-pre {
      display: flex;

      img {
        align-self: end;

        &:nth-child(1) {
          width: 40%;
          height: 40%;
        }

        &:nth-child(2) {
          width: 25%;
          height: 25%;
        }

        &:nth-child(3) {
          width: 15%;
          height: 15%;
        }
      }
    }

    .title {
      color: var(--primary-color);
      font-weight: 600;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      height: 35px;

      .btns {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
}

.bar-info {
  #check-pc {
    display: block;
  }

  #check-pe {
    display: none;
  }

  .user-check-bar-info {
    .current-exp {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .bar-info-container {
    display: flex;
    align-items: center;

    .bar-img {
      img {
        width: 200px;
        height: 200px;
        min-width: 180px;
        min-height: 180px;
        object-fit: contain;
        cursor: pointer;
      }
    }

    .bar-info {
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      box-sizing: border-box;
      padding: 10px;
      transition: var(--time-normal) ease;

      &.has-check {
        height: 230px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding-right: 120px;

        .btns {
          align-items: center;
          position: absolute;
          right: 0;
          display: flex;
        }

        .bar-title {
          display: flex;
          align-items: center;
        }

        img {
          width: 50px;
          cursor: pointer;
          height: 50px;
          display: none;
        }

        .title {
          font-size: 18px;
          font-weight: 600;
        }
      }

      .desc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        cursor: pointer;
      }


      .data {
        display: flex;
        align-items: center;
      }

      .user {
        display: flex;
        align-items: center;
        justify-content: space-between;

        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }
}

@media screen and (max-width:650px) {
  .edit-bar-modal {
    background-color: var(--bg-color-1);

    .edit-bar-modal-container {
      width: 100%;
      height: 100%;
      max-width: none;
      border-radius: 10px;
      background-color: var(--bg-color-1);

      .title {
        font-size: 25px;
      }
    }
  }

  .bar-info {
    &.has-check {
      height: 200px !important;
    }

    #check-pc {
      display: none;
    }

    #check-pe {
      display: block;
    }

    .bar-info-container {
      .bar-img {
        img {
          display: none;
        }
      }

      .bar-info {
        padding: 0;

        .header {
          img {
            display: inline;
          }
        }

      }
    }
  }
}

.moblie-enter-active {
  animation: moblie var(--time-normal) ease 1
}

.moblie-leave-active {
  animation: moblie var(--time-normal) ease 1 reverse
}

.pc-enter-active {
  animation: pc var(--time-normal) ease 1
}

.pc-leave-active {
  animation: pc var(--time-normal) ease 1 reverse
}

@keyframes pc {
  from {
    opacity: 0;
    transform: scale(.8)
  }

  50% {
    transform: scale(1.1)
  }

  to {
    opacity: 1;
  }
}

@keyframes moblie {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// 图片裁剪组件的样式
:deep(.dialogMainModal) {
  background-color: var(--bg-color-1);
}

:deep(.vue-img-cutter) {
  overflow: hidden;
}

:deep(.i-dialog-footer) {
  background-color: var(--bg-color-1);
  margin: 0;
  height: 50px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input[type=file] {
    display: none;
  }
}

:deep(.dialogBox) {
  background-color: var(--bg-color-1);
}

// 图片裁剪
:deep(.toolBox) {
  background-color: var(--bg-color-1);
  border: none !important;

  .btn-warning {
    display: none;
  }

  .copyright {
    display: none !important;
  }
}
</style>