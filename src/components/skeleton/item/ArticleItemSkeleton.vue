<template>
  <div class="article-skeleton-container">
    <div class="header">
      <div class="username">
        <n-skeleton circle width="50px" height="50px" />
        <n-skeleton class="ml-10" height="20px" width="33%" />
      </div>
      <n-skeleton width="60px" height="50%" />
    </div>
    <div class="content mt-10">
      <n-skeleton text :repeat="1" width="30%" />
      <n-skeleton text :repeat="2" />
    </div>
    <div class="imgs mt-10">
      <n-skeleton class="mr-10" height="100%" width="30%" />
      <n-skeleton class="mr-10" height="100%" width="30%" />
      <n-skeleton height="100%" width="30%" />
    </div>
    <n-skeleton class="mt-10" height="20px" width="10%" />
  </div>
</template>

<style scoped lang='scss'>
.article-skeleton-container {
  box-sizing: border-box;
  padding: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;

    >div {
      height: 100%;
    }

    .username {
      height: 100%;
      width: 200px;
      display: flex;
      align-items: center;

      >div {
        height: 100%;
      }
    }
  }
  .imgs{
    box-sizing: border-box;
    height: 24vw;
    display: flex;
    justify-content: space-between;
  }
}
</style>