<template>
  <div>
    <div class="content-header-box" v-text="$route.name"></div>
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