<template>
  <div>

    <el-container>
      <el-aside id="left-menu-list-box" width="200px">
        <topHeader id="top"></topHeader>
        <leftMenu></leftMenu>
      </el-aside>

      <el-container>
        <el-header id="admin-header-box">
        </el-header>
        <el-main>
          <div class="content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
export default {
  mounted() {

    //动态设置侧边菜单的高度
    let leftMenuBoxHeight = document.getElementById('left-menu-list-box');

    if (leftMenuBoxHeight) {
      leftMenuBoxHeight.style.height = window.innerHeight + 'px';
      console.log(window.innerHeight)
    }
  }
}
</script>
<style>
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