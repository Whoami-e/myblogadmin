<template>
  <div class="admin-login-box">
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">
          <h1>HALO BLOG | LOGIN</h1>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="登录账号" name="first">
        <div class="admin-login-center-box">
          <div class="center login-center-box">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form :model="User" :rules="rules" ref="User" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="账号" prop="userName">
                    <el-input type="text" v-model="User.userName" placeholder="用户名"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="originalPassword">
                    <el-input type="password" v-model="originalPassword" show-password placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <el-form-item label="验证码" prop="verifyCode">
                    <el-input type="text" v-model="loginInfo.verifyCode" @keyup.enter.native="doLogin" placeholder="请输入右侧验证码"></el-input>
                    <img :src="captchaPath" @click="updateVerifyCode" class="captcha_code">
                  </el-form-item>
                  <el-form-item class="login-button">
                    <el-button type="primary" @click="doLogin"> 登录 </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="初始化账号" name="second" :disabled="disabled">
        <div class="admin-login-center-box">
          <div class="center login-center-box">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form :model="admin" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="账号" prop="userName">
                    <el-input type="text" v-model="admin.userName" placeholder="用户名"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="originalPassword">
                    <el-input type="password" v-model="originalPassword" show-password placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱地址" prop="oldEmail">
                    <el-input type="email" v-model="admin.email" placeholder="请输入邮箱地址"></el-input>
                  </el-form-item>
                  <el-form-item class="login-button">
                    <el-button type="primary" @click="initAdmin"> 初始化 </el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {initAdmin} from "@/api/api";
import {doLogin} from "@/api/api";
import {checkAdmin} from "@/api/api";
import {hex_md5} from "@/utils/md5";
export default {
  data() {
    let validateUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'));
      }
    };
    let validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      }
    };
    let validatePassWord = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
    };
    let validateOldEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱地址'));
      }
    };
    return {
      disabled: true,
      activeName: 'first',
      originalPassword: '',
      admin: {
        userName: '',
        password: '',
        email: ''
      },
      User: {
        userName: '',
        password: ''
      },
      loginInfo: {
        verifyCode: '',
        captcha_key: ''
      },
      captchaPath: '',
      rules: {
        userName: [
          { required: true, validator: validateUserName, trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, validator: validateVerifyCode, trigger: 'blur' }
        ],
        originalPassword: [
          { required: true, validator: validatePassWord, trigger: 'blur' }
          // , { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,10}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8-10位' }
        ],
        oldEmail: [
          { required: true, validator: validateOldEmail, trigger: 'blur' },
          { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱格式'}
        ]
      }
    };
  },
  methods: {
    toastE(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      });
    },
    initAdmin(){
      if(this.admin.userName === ''){
        this.toastE('请输入用户名');
        return;
      }
      if(this.originalPassword === ''){
        this.toastE('请输入密码');
        return;
      }
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
      if (!reg.test(this.admin.email)) {
        this.$message.error('邮箱地址格式不正确');
        return;
      }
      if(this.admin.email === ''){
        this.toastE('请输入邮箱地址');
        return;
      }
      this.admin.password = hex_md5(this.originalPassword);
      // console.log(this.admin)
      initAdmin(this.admin).then(result =>{
        if (result.code === 20000) {
          this.activeName = 'first';
          this.disabled = true;
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }

        this.admin.userName = '';
        this.admin.password = '';
        this.admin.email = '';
        this.originalPassword = '';
      })
    },
    doLogin() {
      if(this.User.userName === ''){
        this.toastE('请输入用户名');
        return;
      }
      if(this.originalPassword === ''){
        this.toastE('请输入密码');
        return;
      }
      if(this.loginInfo.verifyCode === ''){
        this.toastE('请输入验证码');
        return;
      }
      this.User.password = hex_md5(this.originalPassword);
      doLogin(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.User).then(response => {
        if (response.code === 20001) {
          this.$message({
            message: response.message,
            center: true,
            type: 'success'
          });
          this.$router.push('/index');
        } else {
          this.updateVerifyCode();
          this.toastE(response.message);
        }
      });
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha?captcha_key=' + this.loginInfo.captcha_key + '&random=' + Date.parse(new Date());
    },
    checkAdmin(){
      checkAdmin().then(result =>{

        console.log(result)
        if(result.code === 40000){
          this.disabled = false;
          this.$message.error("请先初始化管理员账号！！")
          this.activeName = 'second';
        }
      })
    }
  },
  mounted() {
    this.checkAdmin();
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode()
  }
}
</script>
<style>
  #tab-first{
    padding-left: 50px;
  }
  .el-tabs__header{
    margin-left: 180px;
    margin-right: 180px;
  }
  .captcha_code {
    cursor: pointer;
    width: 120px;
    height: 40px;
    padding-left: 10px;
    padding-right: 10px;
    vertical-align: middle;
    margin-left: 10px;
    border: solid 1px #E6E6E6;
    border-radius: 4px;
  }
  .login-button {
    margin-bottom: 0px;
  }
  h1 {
    color: #ffffff;
    font-size: 20px;
  }
  .admin-login-header-box {
    width: 100%;
    height: 46px;
    background-color: #545c64;
    margin-bottom: 20px;
  }
  .center {
    margin: 0 auto;
    width: 1140px;
  }
  .admin-login-header-center {
    line-height: 46px;
  }
  .login-center-box .el-input {
    width: 200px;
  }
  /*.login-center-box .el-form-item {*/
  /*  margin-bottom: 20px;*/
  /*}*/
  .login-center-box {
    padding: 40px;
    border-radius: 4px;
    width: 1100px;
    box-shadow: 0 1px 10px #afafaf;
  }
  .login-center-box .el-form-item__label {
    background: #FBFBFB;
    border: solid 1px #E6E6E6;
    text-align: center;
    border-radius: 4px;
  }
  .login-center-box .el-input__inner {
    height: 42px;
  }
</style>