<template>
  <div class="actions" @click.stop="">

    <div class="tools" v-if="!isEdit">
      <auth-btn>
        <div class="textarea sub-text" @click="toggleComment">等你来评论</div>
      </auth-btn>
      <div class="to-actions ml-10">
        <auth-btn>
          <div class="item mr-10" @click="toLike" :class="{ 'active': isLike }">
            <n-icon size="25">
              <MdThumbsUp />
            </n-icon>
          </div>
        </auth-btn>
        <auth-btn>
          <div class="item ml-10 mr-10" @click="toStar" :class="{ 'active': isStar }">
            <n-icon size="25">
              <Star />
            </n-icon>
          </div>
        </auth-btn>
        <div class="item ml-10" @click="toCommentArea">
          <n-icon size="25">
            <CommentDotsRegular />
          </n-icon>
        </div>
      </div>
    </div>

    <div class="edit" v-else>

      <div class="input">
        <n-input :resizable="false" ref="inputIns" @update:value="onHandleInput" :value="comment" type="textarea">
        </n-input>
      </div>

      <n-button :loading="isLoading" size="small" @click="sendComment" type="primary"
        :disabled="!comment.trim().length">发送</n-button>
      <n-button type="success" @mouseenter="() => onHandleShowPre(true)" @mouseleave="() => onHandleShowPre(false)"
        size="small" @click="showModal = true">
        <span>配图</span>
        <span>{{ photo.length }}</span>
      </n-button>
      <n-button size="small" @click="toggleTools">取消</n-button>

      <div v-if="photo.length" :class="`imgs-pre ${showPre ? 'active' : ''}`" @mouseenter="() => onHandleShowPre(true)"
        @mouseleave="() => onHandleShowPre(false)">
        <img class="mb-5" v-for="item in photo" :src="item">
      </div>

    </div>
  </div>
  <UploadImg ref="loadIns" :imgList="fileList" :photo="photo" v-model="showModal" />
</template>

<script lang='ts' setup>
// hooks
import { ref, nextTick, reactive } from 'vue'
import { useMessage } from 'naive-ui'
// components
import { Star } from '@vicons/ionicons5'
import { MdThumbsUp } from '@vicons/ionicons4'
import { CommentDotsRegular } from '@vicons/fa'
import UploadImg from '@/components/common/UploadImg/index.vue'
// types
import type { InputInst, UploadFileInfo } from 'naive-ui';
// apis
import { commentArticleAPI } from '@/apis/article'
// config
import tips from '@/config/tips'
import Pubsub from 'pubsub-js'

// 上传文件组件的实例
const loadIns = ref()
// 在编辑评论模式?
const isEdit = ref(false)
// 输入框的实例
const inputIns = ref<InputInst | null>(null)
// 自定义属性
const props = defineProps<{
  toStarHandle: () => Promise<void>;
  toLikeHandle: () => Promise<void>;
  isLike: boolean;
  isStar: boolean;
  likeIsLoading: boolean;
  starIsLoading: boolean;
  aid: number;
  commentCount: number;
}>()
// 自定义事件
const emits = defineEmits<{
  'update:commentCount': [value: number]
}>()
// 评论的内容
const comment = ref('')
// 评论的配图
const photo = reactive<string[]>([])
// 评论的配图文件
const fileList = reactive<UploadFileInfo[]>([])
// 消息api
const message = useMessage()
// 是否显示配图模态框
const showModal = ref(false)
// 是否显示配图预览
const showPre = ref(false)
// 是否正在发送评论
const isLoading = ref(false)

// 收藏
function toStar() {
  if (props.starIsLoading) {
    return
  }
  props.toStarHandle()
}
// 点赞
function toLike() {
  if (props.likeIsLoading) {
    return
  }
  props.toLikeHandle()
}
// 切换成编辑评论模式
function toggleComment() {
  isEdit.value = true
  nextTick(() => {
    (inputIns.value as InputInst).focus()
  })
}
// 切换成操作模式
function toggleTools() {
  isEdit.value = false
  // 重置评论内容
  resetComment()
}
// 发送评论
async function sendComment() {
  try {
    isLoading.value = true
    await commentArticleAPI({
      aid: props.aid,
      content: comment.value,
      photo: photo.length ? photo : null
    })
    emits('update:commentCount', props.commentCount + 1)
    message.success(tips.successComment)
    // 切换面板
    isEdit.value = false
    // 通知comment组件重新加载评论
    Pubsub.publish('reloadComment')
  } finally {
    // 重置评论内容
    resetComment()
    isLoading.value = false
  }

}
// 重置评论表单
function resetComment() {
  comment.value = ''
  // 重置收集的图片 和 内部组件上传的图片列表
  if (loadIns.value) {
    loadIns.value.onHandleReset()
  }
}
// 是否展示图片预览框
const onHandleShowPre = (value: boolean) => {
  if (photo.length) {
    showPre.value = value
  }
}
// 输入框的文字变化的回调 限制文本长度
const onHandleInput = (value: string) => {
  if (value.length <= 1000) {
    comment.value = value
  } else {
    message.warning(tips.textAllowSize(1000))
  }
}
// 点击评论进入评论视图
function toCommentArea() {
  Pubsub.publish('toCommentArea')
}

</script>

<style scoped lang='scss'>
.actions {
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: var(--bg-color-2);
  height: var(--footer-hight);

  box-sizing: border-box;

  >div {
    height: 100%;
    width: 100%;
  }

  .tools {
    display: flex;
    height: 100%;
    padding: 0 10px;
    align-items: center;
    justify-content: space-between;

    >div:first-child {
      flex-grow: 1;

      .textarea {
        height: 40px;
        padding-left: 15px;
        line-height: 40px;
        background-color: var(--bg-color-3);
      }
    }

    .to-actions {
      >div:not(:last-child) {
        &:nth-child(1) {
          .item {
            &.active {
              color: red
            }
          }
        }

        &:nth-child(2) {
          .item {
            &.active {
              color: yellow;
            }
          }
        }
      }
      >div:last-child{
        color:var(--primary-color)
      }
      .item {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--text-color-2)
      }

      align-items: center;
      display: flex;
    }
  }

  .edit {
    height: 100%;
    padding: 5px 10px;
    display: flex;
    position: relative;
    align-items: center;

    .imgs-pre {
      box-shadow: 0 0 10px var(--shadow-color-1);
      position: absolute;
      background-color: var(--bg-color-1);
      right: 40px;
      height: 100px;
      width: 100px;
      top: -160%;
      overflow-y: auto;
      display: none;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 10px 0;

      &.active {
        display: flex;
      }

      &::-webkit-scrollbar {
        width: 0;
      }

      img {
        width: 50px;
        height: 50px;
        object-fit: cover;
      }
    }

    .input {
      width: 80%;
      height: 50px;

      :deep(.n-input__textarea) {
        height: 50px;
      }
    }

    button {
      height: 100%;
    }
  }
}
</style>