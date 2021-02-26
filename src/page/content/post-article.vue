<template>
  <div class="article-post-box">
    <!--标题-->
    <div class="article-title-part">
      <el-input maxlength="64" minlength="8" style="height: 50px;font-size: 20px"
                v-model="article.title"
                show-word-limit
                placeholder="请输入文章标题（8-64个字符）">

      </el-input>
    </div>
    <!--内容编辑部分-->
    <div class="article-post-part">
      <mavon-editor v-model="article.content"/>
    </div>
    <!--文章设置：分类，封面，标签-->
    <div class="article-post-settings-part shadow">
      <el-form class="settings-form" ref="article" :rules="rules" :model="article" label-width="80px" style="background-color: #ffffff">
        <el-form-item label="文章分类" required>
          <el-select v-model="article.categoryId" placeholder="请选择文章分类">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary" required>
          <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入文章摘要"
              v-model="article.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="文章封面" required prop="cover">
          <div class="article-cover-selector" @click="showImageSelector">
            <i class="el-icon-plus" v-if="article.cover===''"></i>
            <el-image v-else :src="blog_constants.baseURL + article.cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="文章标签" required>
          <el-tag
              :key="tag"
              v-for="tag in labels"
              closable
              :disable-transitions="false"
              @close="deleteLabel(tag)">
            {{tag}}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="labelInputVisible"
              v-model="labelNewValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleLabelInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showLabelInput">+ 添加标签</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--发布、草稿、预览的按钮-->
    <div class="article-post-action-bar">
      <div class="action-btn-container">
        <el-button plain>全屏预览</el-button>
        <el-button plain>保存草稿</el-button>
        <el-button type="primary">发表文章</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box">
      <el-dialog
          title="图片选择"
          :visible.sync="isImageSelectorShow"
          width="790px">
        <div class="image-selector-box">
          <div class="image-action-bar">
            <el-button type="primary" size="medium">上传图片</el-button>
          </div>
          <div class="image-selector-list clearfix">
            <el-image v-for="(item,index) in images" :key="index" :src="blog_constants.baseUrl + '/portal/image/' + item.url"></el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isImageSelectorShow = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="onImageSelected" size="medium">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
  export default {
    data() {
      let validateSummary = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入文章摘要！'));
        }
      };
      let validateCover = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请上传文章封面！'));
        }
      };
      return {
        images: [],
        isImageSelectorShow: false,
        labelNewValue: '',
        labelInputVisible: false,
        labels: [],
        categories: [],
        article: {
          title: '',
          content: '',
          categoryId: '',
          summary: '',
          cover: ''
        },
        rules: {
          summary: [
            { required: true, validator: validateSummary, trigger: 'blur' }
          ],
          cover: [
            { required: true, validator: validateCover, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      listImages() {
        api.listImages(1,16).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.images = result.data.list;
          }
        })
      },
      onImageSelected() {
        this.isImageSelectorShow = false;
      },
      showImageSelector() {
        this.isImageSelectorShow = true;
      },
      showLabelInput() {
        if (this.labels.length < 5) {
          this.labelInputVisible = true;
          this.$nextTick(() => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        } else {
          this.labelInputVisible = false;
        }
      },
      handleLabelInputConfirm() {
        if (this.labels.length < 5) {
          if (this.labelNewValue) {
            this.labels.push(this.labelNewValue);
            if (this.labels.length === 5) {
              this.$message.error('最多可以添加5个标签');
            }
          }
          this.labelInputVisible = false;
          this.labelNewValue = '';
        }
      },
      deleteLabel(tag) {
        //从数组里删除
        this.labels.splice(this.labels.indexOf(tag), 1);
      },
      listCategories() {
        api.listCategories().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.categories = result.data;
          }
        })
      }
    },
    mounted() {
      this.listCategories();
      this.listImages();
    }
  }
</script>
<style>
.image-selector-list img {
  width: 165px;
  height: 110px;
  float: left;
  margin: 10px;
  border: solid 1px #919191;
  border-radius: 4px;
}
.article-post-dialog-box .el-dialog__header {
  display: none;
}
.article-post-part .v-note-op {
  position: sticky;
  top: 0;
}
.article-cover-selector i {
  line-height: 140px;
  font-size: 20px;
}
.article-cover-selector {
  cursor: pointer;
  width: 200px;
  height: 140px;
  border: dashed 1px #919191;
  text-align: center;
  border-radius: 5px;
}
.article-post-settings-part {
  margin-bottom: 25px;
}
.article-post-settings-part .el-textarea__inner {
  width: 19%;
}
.settings-form {
  padding-left: 30px;
  padding-top: 25px;
  padding-bottom: 25px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.action-btn-container {
  float: right;
  padding-bottom: 20px;
  padding-top: 20px;
  margin-right: 20px;
}
.article-post-action-bar {
  margin-top: 20px;
  position: fixed;
  bottom: 0;
  width: 1280px;
  background: #ffffff;
  border-top: solid 1px #E4DFDF;
}
.article-post-part .markdown-body {
  height: 800px;
}
.article-post-part {
  height: 800px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>