<template>
  <div class="right-content-container">
    <div class="content-header-box" >
      <el-tag type="info" effect="dark" v-text="$route.name" style="font-size: 15px;">
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
.right-content-container{
  min-width: 1140px;
}
 .content-container-box {
   /*padding: 10px;*/
 }
 .content-header-box {
   padding-top: 5px;
   margin-top: -15px;
   padding-bottom: 15px;
   border-bottom: solid 1px #E4DFDF;
 }
</style>