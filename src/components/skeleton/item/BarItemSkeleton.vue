<template>
  <div class="bar-skeleton-container">
    <div class="info">
      <n-skeleton class="mr-10" />
      <div class="bar-info">
        <div class="bar-name">
          <n-skeleton height="25px" width="30%" />
          <n-skeleton height="25px" width="20%" />
        </div>
        <n-skeleton text width="60%" />
      </div>
    </div>
    <n-skeleton class="mt-10" text width="80%" />
  </div>
</template>

<style scoped lang='scss'>
.bar-skeleton-container {
  box-sizing: border-box;
  padding: 10px;

  .info {
    height: 60px;
    display: flex;

    >div:first-child {
      width: 60px;
      height: 60px;
    }

    .bar-info {
      height: 60px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bar-name {
        height: 50%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>