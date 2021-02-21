<template>
  <div class="user-box">

    <div class="user-search-bar">
      <el-button type="primary" size="medium" icon="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="user-list-box">
      <el-table
          v-loading="loading"
          :data="userList"
          border
          style="width: 100%" class="table">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="用户邮箱"
            width="170">
        </el-table-column>
        <el-table-column
            label="状态"
            width="70">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state==='0'" size="mini" type="danger" icon="el-icon-circle-close"></el-button>
            <el-button v-if="scope.row.state==='1'" size="mini" type="success" icon="el-icon-circle-check"></el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="角色"
            width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.roles==='admin'" type="success">管理员</el-tag>
            <el-tag v-if="scope.row.roles==='normal'" type="warning">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="sign"
            label="签名">
          <template slot-scope="scope">
            <div v-if="scope.row.sign">
              <span v-text="scope.row.sign"></span>
            </div>
            <div v-else>
              <span>这个人很懒，什么都没写...</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="170">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" size="mini" @click="deleteUser(scope.row)"
                       icon="el-icon-delete"></el-button>
            <el-button type="danger" v-if="scope.row.status==='0'" size="mini" @click="deleteUser(scope.row)"
                       icon="el-icon-delete" disabled></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
  import * as api from '@/api/api';
  import * as dateUtils from "@/utils/date";

  export default {
    data() {
      return {
        loading: false,
        userList: [],
        pageNavigation: {
          pageNum: 1,     //当前页
          totalPage: 1,   //总页数
          totalSize: 0,   //
          pageSize: 5,    //每页的数量
        }
      }
    },
    methods: {
      toastE(msg) {
        this.$message({
          message: msg,
          center: true,
          type: 'error'
        });
      },
      formatDate(dateStr) {
        let date = new Date(dateStr);
        return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      listUsers() {
        this.loading = true;
        api.listUsers(this.pageNavigation.pageNum,this.pageNavigation.pageSize).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.userList = result.data.list;
          } else {
            this.toastE(result.message)
          }
          this.loading = false;
        });
      },
      resetPassword() {

      },
      deleteUser() {

      }
    },
    mounted() {
      this.listUsers();
    }
  }
</script>
<style>
.user-list-box .table {
  margin-top: 10px;
  border: solid 1px #E4DFDF;
  background-color: #E9EEF3;
}

.el-table th, .el-table tr, .el-table td {
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}

.user-list-box .cell {
  text-align: center;
}
</style>