<template>
  <div>
    <el-container class="main-container">
      <el-aside id="left-menu-list-box" width="200px">
        <topHeader id="top"></topHeader>
        <leftMenu></leftMenu>
      </el-aside>

      <el-container>
        <el-header id="admin-header-box">
          <div class="header-user-avatar float-right">
            <el-dropdown>
              <el-avatar style="margin-top: 5px" size="medium" :src="avatar"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <i @click="userInfo" class="el-icon-user"> 个人资料</i>
                </el-dropdown-item>
                <el-dropdown-item>
                  <i @click="logout" class="el-icon-close"> 退出登录</i>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script>
import * as api from '@/api/api';
export default {
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    userInfo() {
      this.$router.push({
        path: '/settings/info'
      })
    },
    logout() {
      api.doLogOut().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.$router.push({
            path: '/login'
          })
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
    this.avatar = this.blog_constants.baseUrl+ window.localStorage.getItem('avatar');
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