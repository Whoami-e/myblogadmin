<template>
  <div>
    <div class="content-header-box" >
      <el-tag type="info" effect="dark" v-text="$route.name">
      </el-tag>
    </div>
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    mounted() {
    }
  }
</script>
<style>
 .content-container-box {
   padding: 10px;
 }
 .content-header-box {
   margin-top: -15px;
   line-height: 46px;
   border-bottom: solid 1px #E4DFDF;
 }
</style>