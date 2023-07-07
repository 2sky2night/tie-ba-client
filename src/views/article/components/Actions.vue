<template>
  <div class="actions" @click.stop="">
    <div class="tools" v-if="!isEdit">
      <auth-btn>
        <div class="textarea sub-text" @click="toggleComment">等你来评论</div>
      </auth-btn>
      <div class="to-actions">
        <div class="item mr-10" @click="toLike" :class="{ 'active': isLike }">
          <n-icon size="25">
            <MdThumbsUp />
          </n-icon>
        </div>
        <div class="item ml-10 mr-10" @click="toStar" :class="{ 'active': isStar }">
          <n-icon size="25">
            <Star />
          </n-icon>
        </div>
        <div class="item ml-10" @click="">
          <n-icon size="25">
            <CommentDotsRegular />
          </n-icon>
        </div>
      </div>
    </div>
    <div class="edit" v-else>
      <div class="input">
        <n-input ref="inputIns" v-model:value="comment" type="textarea"></n-input>
      </div>
      <n-button  size="small" @click="sendComment" type="primary" :disabled="!comment.trim().length">发送</n-button>
      <n-button type="success"  size="small" @click="showModal = true">配图</n-button>
      <n-button  size="small" @click="toggleTools">取消</n-button>
    </div>
  </div>
  <UploadImg :photo="photo" v-model="showModal" />
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
import type { InputInst } from 'naive-ui';
// apis
import { commentArticleAPI } from '@/apis/article'

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
  'update:commentCount': [ value: number ]
}>()
// 评论的内容
const comment = ref('')
// 评论的配图
const photo = reactive<string[]>([])
// 消息api
const message = useMessage()
// 是否显示配图模态框
const showModal = ref(false)

// 收藏
function toStar () {
  if (props.starIsLoading) {
    return
  }
  props.toStarHandle()
}
// 点赞
function toLike () {
  if (props.likeIsLoading) {
    return
  }
  props.toLikeHandle()
}
// 切换成编辑评论模式
function toggleComment () {
  isEdit.value = true
  nextTick(() => {
    (inputIns.value as InputInst).focus()
  })
}
// 切换成操作模式
function toggleTools () {
  isEdit.value = false
  // 重置评论内容
  resetComment()
}
// 发送评论
async function sendComment () {
  const res = await commentArticleAPI({
    aid: props.aid,
    content: comment.value,
    photo: photo.length ? photo : null
  })
  emits('update:commentCount', props.commentCount + 1)
  message.success(res.message)
  // 重置评论内容
  resetComment()
  // 切换面板
  isEdit.value = false
}
// 重置评论表单
function resetComment () {
  comment.value = ''
  photo.length = 0
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
      width: 57%;

      .textarea {
        height: 40px;
        padding-left: 5px;
        line-height: 40px;
        background-color: var(--bg-color-3);
      }
    }

    .to-actions {
      .item {
        display: flex;
        align-items: center;

      }

      align-items: center;
      display: flex;

      .active {
        &:first-child {
          color: red
        }

        &:last-child {
          color: yellow
        }
      }
    }
  }

  .edit {
    height: 100%;
    padding: 5px 10px;
    display: flex;

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