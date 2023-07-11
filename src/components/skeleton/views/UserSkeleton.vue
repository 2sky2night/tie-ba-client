<template>
  <div class="user-page-container">
    <div class="header">
      <div class="img mr-10">
        <n-skeleton circle></n-skeleton>
      </div>
      <div class="info">
        <div class="username">
          <n-skeleton width="100px" height="20px"></n-skeleton>
          <n-skeleton width="100px" height="20px"></n-skeleton>
        </div>
        <div class="desc">
          <n-skeleton text :repeat="3"></n-skeleton>
          <n-skeleton text width="60%"></n-skeleton>
        </div>
        <div class="data">
          <n-skeleton text width="40%"></n-skeleton>
        </div>
      </div>
    </div>
    <div class="main mt-10">
      <n-tabs type="line">
        <n-tab name="01">
          发送的帖子
        </n-tab>
        <n-tab name="02">
          点赞的帖子
        </n-tab>
        <n-tab name="03">
          收藏的帖子
        </n-tab>
        <n-tab name="04">
          关注的吧
        </n-tab>
        <n-tab name="05">
          创建的吧
        </n-tab>
      </n-tabs>
      <ArticleListSkeleton :length="20"></ArticleListSkeleton>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.user-page-container {
  box-sizing: border-box;
  padding: 10px;

  .header {
    display: flex;

    .img {
      >div {
        width: 180px;
        height: 180px;
      }
    }

    .info {
      padding: 10px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .username {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

@media screen and (max-width:651px) {
  .user-page-container {
    .header {
      flex-direction: column;
      align-items: center;

      .info {
        margin-top: 10px;
        padding: 0;
        width: 100%;

        .username {
          margin-bottom: 10px;
        }
      }
    }
  }

}
</style>