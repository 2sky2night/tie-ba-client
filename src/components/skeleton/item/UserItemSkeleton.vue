<template>
  <div class="user-item-skeleton">
    <div class="user-info">
      <n-skeleton class="mr-10" circle />
      <div class="info">
        <div class="username mb-10">
          <n-skeleton text width="30%" />
          <n-skeleton height="25px" width="50px" />
        </div>
        <n-skeleton text width="60%" />
      </div>
    </div>
    <n-skeleton text width="60%" class="mt-10" />
  </div>
</template>

<style scoped lang='scss'>
.user-item-skeleton {
  box-sizing: border-box;
  padding: 10px;

  .user-info {
    display: flex;
    align-items: center;
    >div:first-child{
      width: 50px;
      height: 50px;
    }
    .info {
      flex-grow: 1;

      .username {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>