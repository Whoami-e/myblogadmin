<template>
  <div class="loop-box">
    <div class="loop-action-bar">
      <el-button type="primary" size="medium" @click="showAddLoop" icon="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="loop-list-box">
      <el-table
          v-loading="loading"
          :data="listLoops"
          border
          style="width: 100%" class="table">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题">
          <template slot-scope="scope">
            <a class="loop-title" :href="scope.row.targetUrl" target="_blank">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column
            prop="imageUrl"
            label="轮播图"
            width="220">
          <template slot-scope="scope">
            <el-image class="image" :src="blog_constants.baseUrl + scope.row.imageUrl" width="190px" height="50px">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" style="text-align: center">图片加载失败...</i>
              </div>
            </el-image>
          </template>
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
            label="创建日期"
            width="190">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="190">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)"
                       icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="loop-dialog-box">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :title="loopEditTitle"
          :visible.sync="loopDialogShow"
          width="500px">
        <div >
          <el-form :model="loop" status-icon :rules="rules" ref="loopForm" label-width="100px" class="demo-ruleForm">
            <el-form-item class="input" label="轮播图标题" prop="title">
              <el-input type="text" v-model="loop.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="input" label="跳转链接" prop="targetUrl">
              <el-input type="text" v-model="loop.targetUrl" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="loop.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                  style="display: block"
                  v-model="loop.state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-icon-class="el-icon-circle-check"
                  inactive-icon-class="el-icon-circle-close"
                  active-value="1"
                  inactive-value="0"
                  class="switch">
              </el-switch>
            </el-form-item>
            <el-form-item label="上传图片">
              <el-upload
                  drag
                  class="avatar-uploader"
                  action="/admin/image/loop"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :before-upload="beforeUpload">
                <el-image fit="cover" v-if="loop.imageUrl!==''" :src="blog_constants.baseUrl +loop.imageUrl"
                          class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editClose" type="danger">取 消</el-button>
          <el-button type="primary" @click="handleLoopEditCommit">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>确定要删除: <font style="color: red">{{ deleteMessage }}</font>  这个轮播图么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteLoop()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";
  export default {
    data() {
      let validateTitle = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入轮播图标题！'));
        }
      };
      let validateTargetUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入轮播图跳转链接！'));
        }
      };
      return {
        targetID: '',
        deleteMessage: '',
        loopDialogShow: false,
        deleteDialogShow: false,
        loopEditTitle: '添加轮播图',
        listLoops:[],
        loading: false,
        loop: {
          id: '',
          order: 1,
          state: '1',
          title: '',
          targetUrl: '',
          imageUrl: ''
        },
        rules: {
          title: [
            { required: true, validator: validateTitle, trigger: 'blur' }
          ],
          targetUrl: [
            { required: true, validator: validateTargetUrl, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      editClose() {
        this.loopDialogShow = false;
        this.resetDialog();
      },
      deleteItem(item) {
        this.deleteDialogShow = true;
        this.deleteMessage = item.title;
        this.targetID = item.id;
      },
      deleteLoop() {
        api.deleteLoop(this.targetID).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
            this.targetID = '';
          } else {
            this.targetID = '';
            this.$message.error(result.message);
          }
          this.deleteDialogShow = false;
          this.listLoop();
        })
      },
      resetDialog() {
        this.loop.id = '';
        this.loop.order = 1;
        this.loop.state = '1';
        this.loop.title = '';
        this.loop.targetUrl = '';
        this.loop.imageUrl = '';
      },
      handleLoopEditCommit() {
        if (this.loop.title === '') {
          this.$message.error('请输入轮播图标题！');
          return;
        }
        if (this.loop.targetUrl === '') {
          this.$message.error('请输入轮播图跳转链接！');
          return;
        }
        if (this.loop.imageUrl === '') {
          this.$message.error('请上传图片！');
          return;
        }
        if (!this.loop.targetUrl.startsWith('http://') && !this.loop.targetUrl.startsWith('https://')) {
          this.$message.error('请输入正确轮播图跳转链接（以http://或https://开头）！');
          return;
        }
        if (this.loop.id === '') {
          api.postLoop(this.loop).then(result => {
            this.loopDialogShow = false;
            if (result.code === api.SUCCESS_CODE) {
              this.listLoop();
              this.$message.success(result.message);
              this.resetDialog();
            } else {
              this.$message.error(result.message);
            }
          })
        } else {
          api.updateLoop(this.loop.id,this.loop).then(result => {
            this.loopDialogShow = false;
            if (result.code === api.SUCCESS_CODE) {
              this.listLoop();
              this.$message.success(result.message);
              this.resetDialog();
            } else {
              this.$message.error(result.message);
            }
          })
        }

      },
      uploadSuccess(response) {
        console.log(response)
        if (response.code === api.SUCCESS_CODE) {
          this.loop.imageUrl = '/portal/image/' + response.data.path;
          this.$message.success(response.message);
        } else {
          this.$message.error(response.message);
        }
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
      },
      edit(item) {
        this.loopEditTitle = '编辑轮播图';
        this.loopDialogShow = true;
        this.loop.id = item.id;
        this.loop.order = item.order;
        this.loop.state = item.state;
        this.loop.title = item.title;
        this.loop.targetUrl = item.targetUrl;
        this.loop.imageUrl = item.imageUrl;
      },
      showAddLoop() {
        this.loopDialogShow = true;
      },
      formatDate(dateStr) {
        let date = new Date(dateStr);
        return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      listLoop() {
        this.loading = true;
        api.listLoop().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.listLoops = result.data;
            this.loading = false;
          }
        })
      }
    },
    mounted() {
      this.listLoop();
    }
  }
</script>
<style>
.input .el-input__inner {
  width: 65%;
}
.loop-dialog-box .el-input__suffix {
  width: 75%;
}
 .loop-list-box .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}
 .loop-title {
   text-decoration: none;
   font-weight: 600;
 }
 .image {
   border-radius: 5px;
 }
 .switch {
   padding-top: 10px;
 }
 .loop-dialog-box .el-upload-dragger {
   width: 178px;
   height: 178px;
   border: #8c939d dashed 1px;
 }
.loop-dialog-box .avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  border-radius: 4px;
  line-height: 178px;
  text-align: center;
}
.loop-dialog-box .el-upload img {
  width: 178px;
  border-radius: 4px;
  height: 178px;
}
</style>