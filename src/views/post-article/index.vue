<template>
  <div class="page-container">
    <div class="page-title mb-10">发帖</div>
    <div class="post-aritcle-form">
      <n-form :model="model">
        <n-form-item label="标题">
          <n-input v-model:value="model.title" show-count maxlength="30" :placeholder="tips.formPlaceholder('帖子标题')"></n-input>
        </n-form-item>
        <n-form-item label="内容">
          <n-input v-model:value="model.content" type="textarea" :placeholder="tips.formPlaceholder('帖子内容')"></n-input>
        </n-form-item>
        <n-form-item label="配图">
          <UploadImg v-model:photo="model.photo" />
        </n-form-item>
        <n-form-item label="发送到">
          <BarSelect v-model:select="model.bid" />
        </n-form-item>
        <n-form-item>
          <div class="btns">
            <n-button class="mr-10">重置</n-button>
            <n-button type="primary">确认</n-button>
          </div>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script lang='ts' setup>
// types
import { PostArticleBody } from '@/apis/post-article/types';
// hooks
import { reactive } from 'vue'
// apis
import { postArticleAPI } from '@/apis/post-article';
// configs
import tips from '@/config/tips';
// components
import BarSelect from './components/BarSelect.vue'
import UploadImg from './components/UploadImg.vue';

const model = reactive<PostArticleBody>({
  bid: null,
  content: '',
  title: '',
  photo: null
})



defineOptions({
  name: 'PostArticle'
})
</script>

<style scoped lang='scss'>
.page-container {
  .post-aritcle-form {
    .btns {
      width: 100%;
      display: flex;
      justify-content: center;

      >button {
        width: 50%;
      }
    }
  }
}

@media screen and (min-width: 651px) {
  .page-container {
    .post-aritcle-form {
      .btns {
        width: 100%;
        display: flex;
        justify-content: end;

        >button {
          width: 100px;
        }
      }
    }
  }
}
</style>