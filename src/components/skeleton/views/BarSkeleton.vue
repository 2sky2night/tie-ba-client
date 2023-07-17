<template>
  <div class="bar-page-skeleton">
    <div class="big-img">
      <n-skeleton height="180px" width="180px" />
    </div>
    <div class="bar-info ml-10">
      <div class="header mb-10">
        <div class="bar-name">
          <n-skeleton class="mr-10" height="50px" width="50px" />
          <n-skeleton height="30px" width="120px" />
        </div>
        <n-skeleton height="30px" width="70px" />
      </div>
      <div class="desc">
        <n-skeleton text :repeat="3" />
        <n-skeleton text width="50%" />
      </div>
      <div class="data">
        <n-skeleton text width="20%" />
      </div>
      <div class="user">
        <div class="user-info">
          <n-skeleton height="30px" width="30px" circle />
          <n-skeleton text class="ml-10" width="70px" />
        </div>
        <n-skeleton height="30px" width="70px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.bar-page-skeleton {
  display: flex;
  align-items: center;
  width: 100%;

  .bar-info {
    flex-grow: 1;
    box-sizing: border-box;
    height: 180px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .bar-name {
        align-items: center;
        display: flex;

        >div:first-child {
          display: none;
        }
      }
    }

    .user {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-info {
        display: flex;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width:650px) {
  .bar-page-skeleton {
    .bar-info {
      .header {
        .bar-name {
          >div:first-child {
            display: block;
          }
        }
      }
    }

    .big-img {
      display: none;
    }

  }
}
</style>