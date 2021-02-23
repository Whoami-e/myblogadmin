<template>
  <div class="setting-user-info-box">
    <div class="user-info-list-part">
      <el-form status-icon label-width="100px" v-if="userInfo !== null" class="demo-ruleForm">
        <el-form-item label="ID">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户头像" class="user-info-avatar">
          <div class="user-avatar-container" @click="showAvatarDialog">
            <el-avatar :src="userInfo.avatar"></el-avatar>
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
          <el-button type="primary" @click="updateAdminInfo">修改账户信息</el-button>
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
          url="/admin/image"
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
      showAvatar: false,
      userInfo: null
    }
  },
  methods: {
    showAvatarDialog() {
      this.showAvatar = !this.showAvatar;
    },
    cropUploadSuccess(jsonData, field) {
      console.log('jsonData ==> ' + jsonData);
      console.log('field ==> ' + field);
    },
    cropUploadFail(status, field) {
      console.log('status ==> ' + status);
      console.log('field ==> ' + field);
    },
    toUpdateEmailAdrPage() {
      this.$router.push({
        path: '/settings/email'
      })
    },

    updateAdminInfo() {

    },
    getAdminInfo() {
      api.checkToken().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.userInfo = result.data;
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