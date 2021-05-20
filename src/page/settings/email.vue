<template>
  <div class="setting-email-box">
    <el-form :model="email" status-icon :rules="rules" label-width="100px" ref="email" class="demo-dynamic">
      <el-form-item label="原邮箱地址" prop="oldEmail">
        <el-input type="email" v-model="email.oldEmail" placeholder="请输入原邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="新邮箱地址" prop="newEmail">
        <el-input type="email" v-model="email.newEmail" placeholder="请输入新邮箱地址"></el-input>
        <el-button v-if="!isCountDowning" type="primary" @click="getVerifyCode">获取验证码</el-button>
        <el-button v-else type="primary" @click="getVerifyCode" disabled>{{countDownText}}</el-button>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <el-input v-model="email.verifyCode" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEmailAddress">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from '@/api/api';
  export default {
    data() {
      let validateOldEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧邮箱地址'));
        }
      };
      let validateNewEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新邮箱地址'));
        }
      };
      let validateVerifyCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        }
      };
      return {
        isCountDowning: false,
        countDownText: '重新发送（60s）',
        email: {
          oldEmail: '',
          newEmail: '',
          verifyCode: ''
        },
        rules: {
          oldEmail: [
            { required: true, validator: validateOldEmail, trigger: 'blur' },
            { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱格式'}
          ],
          newEmail: [
            { required: true, validator: validateNewEmail, trigger: 'blur' },
            { pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱格式'}
          ],
          verifyCode: [
          { required: true, validator: validateVerifyCode, trigger: 'blur' }
        ]
        },
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
      updateEmailAddress() {
        if (this.email.oldEmail === '') {
          this.$message.error('请输入原邮箱地址！')
          return;
        }
        if (this.email.newEmail === '') {
          this.$message.error('请输入新邮箱地址！')
          return;
        }if (this.email.verifyCode === '') {
          this.$message.error('请输入邮箱验证码！')
          return;
        }
        api.updateEmailAddress(this.email.oldEmail,this.email.newEmail,this.email.verifyCode).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            });
            this.email.oldEmail ='';
            this.email.newEmail ='';
            this.email.verifyCode ='';
          } else {
            this.toastE(result.message);
            this.email.verifyCode ='';
          }
        })
      },
      getVerifyCode() {
        let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        if (!reg.test(this.email.newEmail)) {
          this.$message.error('邮箱地址格式不正确');
          return;
        }
        api.getVerifyCode(this.email.newEmail,'update').then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.startCountDown();
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            });
          } else {
            this.toastE(result.message);
          }
        });
      },
      startCountDown() {
        let time =60;
        this.isCountDowning = true;
        let that = this;
        let interval = setInterval(function () {
          time--;
          if (time <= 0) {
            that.isCountDowning = false;
            clearInterval(interval);
          }
          that.countDownText = '重新发送（' +time+ 's）';
        },1000);
      }
    }
  }
</script>
<style>
  .setting-email-box .el-input {
    width: 20%;
    margin-right: 10px;
  }
  .setting-email-box .el-form-item {
    margin-bottom: 10px;
  }
  .setting-email-box {
    margin-top: 20px;
    padding-left: 100px;
  }
</style>