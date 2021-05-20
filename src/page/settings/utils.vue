<template>
  <div class="util-box">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card" style="width: 100%;height: 200px;">
            <div slot="header" class="clearfix">
              <i style="font-weight: bold" class="el-icon-document-add"> Markdown 文章导入</i>
            </div>
            <div class="text item" style="float: right;margin-top: 70px;">
              <el-upload
                  class="upload-demo"
                  :on-success="uploadSuccess"
                  accept=".md"
                  action="/admin/file/uploadMd">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
<!--              <el-button @click="uploadMdFile" style="float: right;" type="primary" size="medium">导入</el-button>-->
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card class="box-card" style="width: 100%;height: 200px;">
            <div slot="header" class="clearfix">
              <i style="font-weight: bold" class="el-icon-set-up"> 开发者选项 </i>
            </div>
            <div class="text item">
              点击进入开发者选项页面
              <div style="float: right;margin-top: 70px;">
                <el-button size="small" type="primary" @click="DpMode">进入</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as api from "@/api/api";

export default {
  data() {
    return {
      fileList:[]
    }
  },
  methods: {
    DpMode(){
      this.$router.push({
        path: '/settings/development'
      })
    },
    uploadSuccess(result) {
      console.log(result)
      if (result.code === api.SUCCESS_CODE) {
        this.$message.success(result.message);
        this.$router.push({
          path: '/content/manage-article'
        });
      } else {
        this.$message.error(result.message);
      }
    },
    uploadMdFile() {
    }
  }
}
</script>
<style>
.util-box {
  margin-top: 10px;
  margin-left: 20px;
}

.util-box .el-col, .util-box .bg-purple {
  border-radius: 4px;
}
</style>