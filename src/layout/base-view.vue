<template>
  <div>

    <el-container class="main-container">
      <el-aside id="left-menu-list-box" width="200px">
        <topHeader id="top"></topHeader>
        <leftMenu></leftMenu>
      </el-aside>

      <el-container>
        <el-header id="admin-header-box">
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  mounted() {

  }
}
</script>
<style>
/*#left-menu-list-box {*/
/*  z-index: 2000;*/
/*}*/
.main-container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
  .el-header {
    background-color: #545c64;
    color: #ffff;
    line-height: 46px;
    height: 46px !important;
  }

  .el-aside {
    background-color: #545c64;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    /*background-color: #ffffff;*/
  }

  #top {
    line-height: 50px;
    margin-left: 17px;
  }
</style>