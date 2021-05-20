<template>
  <div class="user-box">
    <div class="user-search-bar">
      <el-form :inline="true" :model="search" size="medium">
        <el-form-item label="用户名">
          <el-input v-model="search.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="search.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="doSearch">查询</el-button>
          <el-button type="danger" size="medium" @click="cleanSearch">清空</el-button>
        </el-form-item>
      </el-form>
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
            <el-button type="primary" size="mini" @click="resetPasswordShow(scope.row)">重置密码</el-button>
            <el-button type="danger" v-if="scope.row.state!=='0'" size="mini" @click="deleteItem(scope.row)"
                       icon="el-icon-close"></el-button>
            <el-button type="success" v-if="scope.row.state==='0'" size="mini" @click="restoreItem(scope.row)"
                       icon="el-icon-check"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-navigation">
      <el-pagination
          style="text-align: right"
          background
          @size-change="handleSizeChange"
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          :page-sizes="[20, 40, 60, 80]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="user-dialog-box">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>{{deleteMessage2}} <font style="color: red">{{ deleteMessage }}</font>  么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteUser()">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="重置密码"
          :visible.sync="resetPasswordDialogShow"
          width="500px">
        <div class="reset-password-box">
          <div class="targetName">重置 “<font color="red">{{resetPasswordTargetName}}</font>” 的密码</div>
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" show-password v-model="ruleForm.pass" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" show-password v-model="ruleForm.checkPass" placeholder="请确认密码"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="resetPasswordDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="resetPassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import * as api from '@/api/api';
  import * as dateUtils from "@/utils/date";
  import {hex_md5} from "@/utils/md5";

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        deleteDialogShow: false,
        resetPasswordTargetName: '',
        resetPasswordDialogShow: false,
        deleteMessage: '',
        deleteMessage2: '',
        state: '',
        TargetID: '',
        search: {
          userName:'',
          email: ''
        },
        loading: false,
        userList: [],
        pageNavigation: {
          currentPage: 1,     //当前页码
          totalCount: 0,       //总条数
          pageSize: 10,    //每页的数量
        }
      }
    },
    methods: {
      restoreItem(item){
        this.deleteDialogShow = true;
        this.deleteMessage = item.userName;
        this.deleteMessage2 = '确定要恢复用户:';
        this.TargetID = item.id;
        this.state = item.state;
      },
      deleteItem(item) {
        this.deleteDialogShow = true;
        this.deleteMessage = item.userName;
        this.deleteMessage2 = '确定要删除用户:';
        this.TargetID = item.id;
        this.state = item.state;
      },
      resetPasswordShow(item) {
        this.resetPasswordDialogShow = true;
        this.TargetID = item.id;
        this.resetPasswordTargetName = item.userName;
      },
      resetPassword() {
        if (this.ruleForm.pass === '') {
          this.toastE('请输入新密码');
          return;
        }
        api.resetPassword(this.TargetID,hex_md5(this.ruleForm.pass)).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            });
            this.listUsers();
          } else {
            this.toastE(result.message);
          }
          this.resetPasswordDialogShow = false;
        })
      },
      handleSizeChange(size) {
        this.pageNavigation.pageSize = size;
        this.listUsers();
      },
      onPageChange(page) {
        this.pageNavigation.currentPage = page;
        this.listUsers();
      },
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
        api.listUsers(this.pageNavigation.currentPage,this.pageNavigation.pageSize,
            this.search.userName,this.search.email).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.userList = result.data.list;
            this.pageNavigation.totalCount = result.data.total;
            this.pageNavigation.currentPage = result.data.pageNum;
            this.pageNavigation.pageSize = result.data.pageSize;
          } else {
            this.toastE(result.message)
          }
          this.loading = false;
        });
      },
      deleteUser() {
        if (this.state === '1') {
          api.deleteUserById(this.TargetID).then(result => {
            if (result.code === api.SUCCESS_CODE) {
              this.$message({
                message: result.message,
                center: true,
                type: 'success'
              });
              this.listUsers();
            } else {
              this.$message.error(result.message);
            }
          })
        } else if(this.state === '0'){
          api.restoreUser(this.TargetID).then(result => {
            if (result.code === api.SUCCESS_CODE) {
              this.$message({
                message: result.message,
                center: true,
                type: 'success'
              });
              this.listUsers();
            } else {
              this.$message.error(result.message);
            }
          })
        }

        this.deleteDialogShow = false;
      },
      doSearch() {
        this.loading = true;
        api.doUserSearch(this.search.userName,this.search.email).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.userList = result.data.list;
          } else {
            this.toastE(result.message)
          }
          this.loading = false;
        })
      },
      cleanSearch() {
        this.search.userName = '';
        this.search.email = '';
        this.listUsers();
      }
    },
    mounted() {
      this.listUsers();
    }
  }
</script>
<style>
.reset-password-box .el-input__inner {
  margin-bottom: 10px;
  width: 70%;
}
.reset-password-box .el-input__suffix {
  width: 70%;
}
.targetName {
  font-weight: 600;
  margin-bottom: 10px;
  margin-left: 25px;
}
.el-dialog__title {
  color: red;
}
.page-navigation .el-input__inner {
  background-color: #E9EEF3;
}
.page-navigation {
  margin-top: 10px;
}
.el-form-item {
  margin-bottom: 0px;
}
.user-list-box .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}

.user-list-box .cell {
  text-align: center;
}
</style>