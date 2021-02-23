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
            <img class="image" :src="scope.row.imageUrl" width="190px" height="100px">
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
          <el-form :model="loop" status-icon :rules="rules" ref="loop" label-width="100px" class="demo-ruleForm">
            <el-form-item label="轮播图标题" prop="pass">
              <el-input type="text" v-model="loop.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" prop="checkPass">
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
                  class="upload-demo"
                  :on-success="uploadSuccess"
                  :before-upload="beforeUpload"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="loopDialogShow = false" type="danger">取 消</el-button>
          <el-button type="primary" @click="loopDialogShow = false">确 定</el-button>
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
      return {
        loopDialogShow: false,
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

        }
      }
    },
    methods: {
      uploadSuccess() {

      },
      beforeUpload() {

      },
      edit(item) {
        console.log(item)
      },
      deleteItem(item) {
        console.log(item)
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
.loop-dialog-box .el-input__inner {
  width: 65%;
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
</style>