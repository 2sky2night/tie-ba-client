<template>
    <div class="logo-container">
        <div class="title mb-10">贴&nbsp;&nbsp;吧</div>
        <div class="sub-title">一个文化交流社区</div>
    </div>
</template>

<script lang='ts' setup>
defineOptions({
    name: 'Logo'
})
</script>

<style scoped lang='scss'>

.logo-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 20px 0;
    .title{
        font-size: 30px;
        font-weight: 600;
        color:var(--primary-color);
    }
    .sub-title{
        font-size: 13px;
        font-weight: 100;
    }
}

</style>