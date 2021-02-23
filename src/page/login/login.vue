<template>
  <div class="admin-login-box">
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">
          <h1>HALO BLOG | LOGIN</h1>
        </div>
      </div>
    </div>

    <div class="admin-login-center-box">
      <div class="center login-center-box">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form :model="User" :rules="rules" ref="User" label-width="100px" class="demo-ruleForm">
              <el-form-item label="账号" prop="userName">
                <el-input type="text" v-model="User.userName" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="User.password" show-password placeholder="请输入密码"></el-input>
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
  </div>
</template>
<script>
import {doLogin} from "@/api/api";

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
    return {
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
        password: [
          { required: true, validator: validatePassWord, trigger: 'blur' }
          // , { pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,10}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8-10位' }
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
    doLogin() {
      if(this.User.userName === ''){
        this.toastE('请输入用户名');
        return;
      }
      if(this.User.userName === ''){
        this.toastE('请输入密码');
        return;
      }
      if(this.loginInfo.verifyCode === ''){
        this.toastE('请输入验证码');
        return;
      }
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
      this.captchaPath = 'http://192.168.0.15:8081/user/captcha?captcha_key=' + this.loginInfo.captcha_key + '&random=' + Date.parse(new Date());
    }
  },
  mounted() {
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode()
  }
}
</script>
<style>
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