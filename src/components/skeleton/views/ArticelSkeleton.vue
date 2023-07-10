<template>
  <div class="article-page-skeleton">
    <div class="title mb-10">
      <n-skeleton height="25px" width="200px" />
    </div>
    <div class="data mb-10">
      <n-skeleton height="15px" width="250px" />
    </div>
    <div class="user mb-10">
      <div class="username">
        <n-skeleton circle width="50px" height="50px" />
        <n-skeleton class="ml-10" height="20px" width="100px" />
      </div>
      <n-skeleton class="ml-10" height="20px" width="50px" />
    </div>
    <div class="passage mb-10">
      <n-skeleton text :repeat="5" />
      <n-skeleton height="15px" width="30%" />
    </div>
    <div class="bar">
      <n-skeleton height="20px" width="50px" />
    </div>
  </div>
</template>

<style scoped lang='scss'>
.article-page-skeleton {
  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .username{
      display: flex;
      align-items: center;
    }
  }
}
</style>