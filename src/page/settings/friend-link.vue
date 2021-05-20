<template>
  <div class="settings-friend-link-box">
    <div class="friend-link-action-bar">
      <el-button type="primary" size="medium" @click="showAddFriendLink" icon="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="friend-link-list-box">
      <el-table
          v-loading="loading"
          :data="links"
          border
          style="width: 100%"
          class="table">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="网站名称">
          <template slot-scope="scope">
            <a class="link-title" :href="scope.row.url" target="_blank">{{scope.row.name}}</a>
          </template>
        </el-table-column>
        <el-table-column
            prop="logo"
            label="LOGO"
            width="220">
          <template slot-scope="scope">
            <el-image class="image" :src="blog_constants.baseUrl +scope.row.logo" width="190px" height="50px">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="text-align: center">图片加载失败...</i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="90">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state==='0'" size="mini" type="danger" icon="el-icon-circle-close"></el-button>
            <el-button v-if="scope.row.state==='1'" size="mini" type="success" icon="el-icon-circle-check"></el-button>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)"
                       icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="friend-link-dialog-box">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :title="linkEditTitle"
          :visible.sync="linkDialogShow"
          width="500px">
        <div >
          <el-form :model="link" status-icon :rules="rules" ref="loopForm" label-width="100px" class="demo-ruleForm">
            <el-form-item class="input" label="网站名称" prop="name">
              <el-input type="text" v-model="link.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="input" label="跳转链接" prop="url">
              <el-input type="text" v-model="link.url" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="link.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                  style="display: block"
                  v-model="link.state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-icon-class="el-icon-circle-check"
                  inactive-icon-class="el-icon-circle-close"
                  active-value="1"
                  inactive-value="0"
                  class="switch">
              </el-switch>
            </el-form-item>
            <el-form-item label="LOGO">
              <div class="friend-link-image-upload" @click="showLinkLogoDialog">

<!--                <el-upload-->
<!--                    drag-->
<!--                    class="avatar-uploader"-->
<!--                    action="/admin/image/friendlink"-->
<!--                    :show-file-list="false"-->
<!--                    :on-success="uploadSuccess"-->
<!--                    :before-upload="beforeUpload">-->
                  <el-image fit="cover" v-if="link.logo!==''" :src="blog_constants.baseUrl + link.logo"
                            class="avatar"></el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
<!--                </el-upload>-->
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editClose" type="danger">取 消</el-button>
          <el-button type="primary" @click="handleLoopEditCommit">确 定</el-button>
        </span>
      </el-dialog>
      <avatar-upload
          field="file"
          @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail"
          v-model="showLinkLogoCutter"
          :width="200"
          :height="74"
          url="/admin/image/friendlink"
          img-format="png"></avatar-upload>
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>确定要删除: <font style="color: red">{{ deleteMessage }}</font>  这个友情链接么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteFriendLink">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";
import avatarUpload from 'vue-image-crop-upload/upload-2.vue';
  export default {
    components: {
      'avatar-upload': avatarUpload
    },
    data() {
      let validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入网站名称！'));
        }
      };
      let validateUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入友情链接跳转链接！'));
        }
      };
      return {
        showLinkLogoCutter: false,
        links: [],
        loading: false,
        linkEditTitle: '添加友情链接',
        linkDialogShow: false,
        deleteDialogShow: false,
        deleteMessage: '',
        targetId: '',
        link: {
          id: '',
          name: '',
          logo: '',
          order: 1,
          state: '1',
          url: ''
        },
        rules: {
          name: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          url: [
            { required: true, validator: validateUrl, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //显示logo裁剪窗口
      showLinkLogoDialog(){
        this.showLinkLogoCutter = true;
      },
      handleLoopEditCommit() {
        if (this.link.name === '') {
          this.$message.error('请输入网站名称！');
          return;
        }
        if (this.link.url === '') {
          this.$message.error('请输入网站跳转链接！');
          return;
        }
        if (this.link.logo === '') {
          this.$message.error('请上传网站LOGO！');
          return;
        }
        if (!this.link.url.startsWith('http://') && !this.link.url.startsWith('https://')) {
          this.$message.error('请输入正确跳转链接（以http://或https://开头）！');
          return;
        }
        if (this.link.id === '') {
          api.postFriendLink(this.link).then(result => {
            if (result.code === api.SUCCESS_CODE) {
              this.$message({
                message: result.message,
                center: true,
                type: 'success'
              });
              this.listLinks();
              this.editClose();
            } else {
              this.$message.error(result.message);
            }
          })
        } else {
          api.updateFriendLink(this.link.id,this.link).then(result => {
            if (result.code === api.SUCCESS_CODE) {
              this.$message.success(result.message);
              this.listLinks();
              this.editClose();
            } else {
              this.$message.error(result.message);
            }
          })
        }

      },
      resetDialog() {
        this.link.id = '';
        this.link.order = 1;
        this.link.state = '1';
        this.link.name = '';
        this.link.logo = '';
        this.link.url = '';
      },
      editClose() {
        this.linkDialogShow = false;
        this.resetDialog();
      },
      deleteItem(item) {
        this.deleteDialogShow = true;
        this.targetId = item.id;
        this.deleteMessage = item.name;
      },
      deleteFriendLink() {
        api.deleteFriendLink(this.targetId).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
            this.targetID = '';
          } else {
            this.targetID = '';
            this.$message.error(result.message);
          }
          this.deleteDialogShow = false;
          this.listLinks();
        })
      },
      edit(item) {
        this.link.id = item.id;
        this.link.order = item.order;
        this.link.state = item.state;
        this.link.name = item.name;
        this.link.logo = item.logo;
        this.link.url = item.url;
        this.linkEditTitle = '编辑友情链接'
        this.linkDialogShow = true;
      },
      showAddFriendLink() {
        this.linkDialogShow =true;
      },
      listLinks() {
        this.loading = true;
        api.listFriendLink().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.links = result.data;
            this.loading = false;
          } else {
            this.$message.error(result.message);
          }
        })
      },
      formatDate(dateStr) {
        let date = new Date(dateStr);
        return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      cropUploadSuccess(response) {
        console.log(response.data.path)
        if (response.code === api.SUCCESS_CODE) {
          this.link.logo = '/portal/image/' + response.data.path;
          this.$message.success(response.message);
        } else {
          this.$message.error(response.message);
        }
      },
      cropUploadFail(){
        this.$message.error('Logo上传失败！');
      },
      beforeUpload(file) {
        let isTrue = false;
        if (file.type === 'image/jpeg') {
          isTrue = true;
        }
        if (file.type === 'image/png') {
          isTrue = true;
        }
        if (file.type === 'image/gif') {
          isTrue = true;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isTrue) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isTrue && isLt2M;
      }
    },
    mounted() {
      this.listLinks();
    }
  }
</script>
<style>
.friend-link-image-upload{
  width: 100px;
  height: 37px;
  border: #dfdfdf dashed 1px;
  text-align: center;
  cursor: pointer;
}
.input .el-input__inner {
  width: 65%;
}
.friend-link-dialog-box .el-input__suffix {
  width: 75%;
}
.image {
  border-radius: 5px;
}
.friend-link-list-box .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}
.link-title {
  text-decoration: none;
  font-weight: 600;
}
.friend-link-dialog-box .el-upload-dragger {
  width: 178px;
  height: 178px;
  border: #8c939d dashed 1px;
}
.friend-link-dialog-box .avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  border-radius: 4px;
  line-height: 178px;
  text-align: center;
}
.friend-link-dialog-box .el-upload img {
  width: 178px;
  border-radius: 4px;
  height: 178px;
}
</style>