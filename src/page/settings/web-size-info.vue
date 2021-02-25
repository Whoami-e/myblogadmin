<template>
  <div class="settings-web-info-box">
    <el-form label-width="100px" :model="webSizeInfo" class="demo-ruleForm">
      <el-form-item label="网站名称">
        <el-input v-model="webSizeInfo.websizeTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字">
        <el-input v-model="webSizeInfo.keywords" placeholder="请用逗号隔开每个关键字"></el-input>
        <div class="warningKeyword">
          *注意：每个关键字请用逗号（英文）隔开！
        </div>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input type="textarea" :rows="3" v-model="webSizeInfo.description"></el-input>
      </el-form-item>
      <el-form-item>
        <span class="warning">
          *注意：修改网站信息后一定要按下面的按钮！
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="updateWebSizeInfo">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from '@/api/api';
  export default {
    data() {
      return {
        webSizeInfo: {
          websizeTitle: '',
          keywords: '',
          description: ''
        },
        oldWebSizeInfo: {
          websizeTitle: '',
          keywords: '',
          description: ''
        }
      }
    },
    methods: {
      updateWebSizeInfo() {
        if (this.webSizeInfo.websizeTitle === '') {
          this.$message.error('请输入网站标题！');
          return;
        }
        if (this.webSizeInfo.keywords === '') {
          this.$message.error('请输入网站关键字！');
          return;
        }
        if (this.webSizeInfo.description === '') {
          this.$message.error('请输入网站描述！');
          return;
        }
        api.updateWebSizeTitle(this.webSizeInfo.websizeTitle).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        });
        api.updateSeoInfo(this.webSizeInfo.keywords,this.webSizeInfo.description).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        });
      },
      getWebSizeInfo(){
        api.getSeoInfo().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.webSizeInfo.keywords = result.data['web_size_keywords'];
            this.webSizeInfo.description = result.data['web_size_description'];
            this.oldWebSizeInfo.keywords = this.webSizeInfo.keywords;
            this.oldWebSizeInfo.description = this.webSizeInfo.description;
          }
        })
      },
      getWebSizeTitle(){
        api.getWebSizeTitle().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.webSizeInfo.websizeTitle = result.data.value;
            this.oldWebSizeInfo.websizeTitle = this.webSizeInfo.websizeTitle;
          }
        })
      }
    },
    mounted() {
      this.getWebSizeInfo();
      this.getWebSizeTitle();
    }
  }
</script>
<style>
 .settings-web-info-box .el-input__inner {
   width: 25%;
 }
 .settings-web-info-box .el-textarea__inner {
   width: 25%;
 }
 .warning {
   color: red;
   font-weight: 400;
 }
 .warningKeyword {
   color: red;
 }
</style>