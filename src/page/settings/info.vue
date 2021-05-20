<template>
  <div class="setting-user-info-box">
    <div class="user-info-list-part">
      <el-form status-icon label-width="100px" v-if="userInfo !== null" class="demo-ruleForm">
        <el-form-item label="ID" style="margin-top: 10px">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户头像" class="user-info-avatar">
          <div class="user-avatar-container" @click="showAvatarDialog">
            <el-avatar :src="blog_constants.baseUrl +userInfo.avatar"></el-avatar>
          </div>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text" v-model="userInfo.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input type="email" v-model="userInfo.email" disabled></el-input>
          <el-button type="primary" size="medium" @click="toUpdateEmailAdrPage">修改邮箱地址</el-button>
        </el-form-item>
        <el-form-item label="签名">
          <el-input type="textarea" resize="none" v-model="userInfo.sign"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="warning">
            *注意：修改用户信息后一定要按下面的按钮！
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="updateAdminInfo">更新账户信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-dialog">
      <avatar-upload
          field="file"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="showAvatar"
          :width="300"
          :height="300"
          url="/admin/image/avatar"
          img-format="png"></avatar-upload>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import avatarUpload from 'vue-image-crop-upload/upload-2.vue';

export default {
  components: {
    'avatar-upload': avatarUpload
  },
  data() {
    return {
      edit: true,
      lastUserName: '',
      showAvatar: false,
      userInfo: null
    }
  },
  methods: {
    showAvatarDialog() {
      this.showAvatar = true;
    },
    cropUploadSuccess(response) {
      if (response.code === api.SUCCESS_CODE) {
        this.$message.success(response.message);
        this.userInfo.avatar = '/portal/image/' + response.data.path;
      } else {
        this.$message.error(response.message);
      }
    },
    cropUploadFail() {
      this.$message.error('图片上传失败！');
    },
    toUpdateEmailAdrPage() {
      this.$router.push({
        path: '/settings/email'
      })
    },
    updateAdminInfo() {
      if (this.userInfo.userName === '') {
        this.$message.error('请输入用户名！');
        return;
      }
      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateInfo();
      } else {
        api.checkUserName(this.userInfo.userName).then(result => {
          if (result.code === api.FAILED_CODE) {
            this.doUpdateInfo();
          } else {
            this.$message.error(result.message);
          }
        });
      }

    },
    doUpdateInfo() {
      if (this.userInfo.avatar === '') {
        this.$message.error('请上传头像！');
      }
      api.updateAdminInfo(this.userInfo,this.userInfo.id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.getAdminInfo();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getAdminInfo() {
      api.checkToken().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.userInfo = result.data;
          this.lastUserName = this.userInfo.userName;
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
    this.getAdminInfo();
  }
}
</script>
<style>
.warning {
  color: red;
  font-weight: 400;
}
.user-avatar-container {
  width: 40px;
  cursor: pointer;
}
.setting-user-info-box .el-input {
  width: 20%;
  margin-right: 10px;
}

.setting-user-info-box .el-textarea__inner {
  width: 20%;
}

.user-info-avatar {
  display: inline-block;
}
</style>