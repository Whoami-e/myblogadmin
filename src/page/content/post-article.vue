<template>
  <div class="article-post-box" >
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
      <mavon-editor ref="mdEditor" v-model="article.content" @onImageClick="onEditorImageClick"></mavon-editor>
    </div>
    <!--文章设置：分类，封面，标签-->
    <div class="article-post-settings-part shadow">
      <el-form class="settings-form" ref="article" :rules="rules" :model="article" label-width="80px"
               style="background-color: #ffffff">
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
        <el-form-item label="文章摘要" prop="summary">
          <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入文章摘要"
              v-model="article.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="文章封面" required prop="cover">
          <div class="article-cover-selector" @click="showImageSelector">
            <i class="el-icon-plus" v-if="!article.cover"></i>
            <el-image v-else :src="blog_constants.baseUrl + '/portal/image/' +article.cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="文章标签" required>
          <el-tag
              :key="tag"
              v-for="tag in labels"
              closable
              :disable-transitions="false"
              @close="deleteLabel(tag)">
            {{ tag }}
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
        <el-button plain @click="preView">全屏预览</el-button>
        <el-button plain @click="saveArticle">保存草稿</el-button>
        <el-button v-if="loading === false" @click="commitArticle" type="primary">{{commitText}}</el-button>
        <el-button v-else @click="commitArticle" type="primary" disabled>{{commitText}}</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box">
      <el-dialog
          class="image-picker-container"
          title="图片选择"
          :visible.sync="isImageSelectorShow"
          width="800px">
        <div class="image-selector-box">
          <div class="image-action-bar">
            <el-upload
                drag
                class="image-selector-uploader"
                action="/admin/image/article"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload"
                accept="image/*">
              <el-button type="primary" size="medium">上传图片</el-button>
            </el-upload>
          </div>
          <div class="image-selector-list clearfix" style="margin-top: 20px; margin-left: 10px">
            <el-radio-group class="" v-model="selectedImageIndex">
              <el-radio-button :label="index" v-for="(item,index) in images" :key="index">
                <el-image :src="blog_constants.baseUrl + '/portal/image/' + item.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="image-picker-navigation">
            <el-pagination
                style="text-align: right"
                background
                @current-change="onPageChange"
                :current-page="pageNavigation.currentPage"
                :page-size="pageNavigation.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pageNavigation.totalCount">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isImageSelectorShow = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="onImageSelected" size="medium">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog
          title="确定要离开吗？"
          :visible.sync="saveConfirmDialogShow"
          width="400px"
          center>
        <div style="text-align: center">
          <span>系统可能不会保存填写的稿件信息噢...(´；ω；`)</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="saveConfirmDialogShow = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="toNextPath">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import editor from '../../../lib/mavon-editor/mavon-editor';
import '../../../lib/mavon-editor/css/index.css';
import Vue from 'vue';
Vue.use(editor);
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
      nextPath: '',
      isContentSave: false,
      saveConfirmDialogShow: false,
      disableDraftBtn: false,
      commitText: '发表文章',
      loading: false,
      imageSelectFor: 'article',
      pageNavigation: {
        currentPage: 1,     //当前页码
        totalCount: 0,       //总条数
        pageSize: 16,    //每页的数量
      },
      selectedImageIndex: 0,
      images: [],
      isImageSelectorShow: false,
      labelNewValue: '',
      labelInputVisible: false,
      labels: [],
      categories: [],
      article: {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        labels: '',
        state: '0', //状态（0表示已发布，1表示草稿，2表示删除，3表示置顶）
        type: '1', //类型（0表示富文本，1表示markdown）
        createTime: null
      },
      rules: {
        summary: [
          {required: true, validator: validateSummary, trigger: 'blur'}
        ],
        cover: [
          {required: true, validator: validateCover, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    toNextPath() {
      this.saveConfirmDialogShow = false;
      this.isContentSave = true;
      this.$router.push({
        path: this.nextPath
      })
    },
    resetArticle() {
      this.article.labels = '';
      this.article.state = '0';
      this.article.type = '1';
      this.article.cover = '';
      this.article.summary = '';
      this.article.categoryId = '';
      this.article.content= '';
      this.article.title = '';
      this.article.id = '';
    },
    preView() {
      this.$refs.mdEditor.toolbar_right_click('read');
    },
    saveArticle() {

      if (this.article.title === '') {
        this.$message.error('请输入文章标题！');
        return;
      }
      this.article.state = '1';
      api.saveArticle(this.article).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          window.onbeforeunload = null;
          this.isContentSave = true;
          this.$message.success(result.message);
          this.$router.push({
            path: '/content/manage-article'
          });
        } else {
          this.$message.error('保存草稿失败！');
        }
      })
    },
    commitArticle() {
      if (this.article.title === '') {
        this.$message.error('请输入文章标题！');
        return;
      }
      if (this.article.content === '') {
        this.$message.error('请输入文章内容！');
        return;
      }

      if (this.article.categoryId === '') {
        this.$message.error('请选择文章分类！');
        return;
      }
      if (this.article.summary === '') {
        this.$message.error('请输入文章摘要！');
        return;
      }
      if (this.article.cover === '') {
        this.$message.error('请上传文章封面！');
        return;
      }
      if (this.labels.length === 0) {
        this.$message.error('请输入文章标签！');
        return;
      }
      //处理标签
      let tempLabels ='';
      console.log(this.labels)
      this.labels.forEach((item,index) => {
        tempLabels += item;
        if (index !== this.labels.length - 1) {
          tempLabels += '-';
        }
      });
      this.article.labels = tempLabels;
      if (this.article.id === '') {
        this.loading = true;
        api.postArticle(this.article).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/content/manage-article'
            });
          } else {
            this.$message.error('发表文章失败！');
          }
          this.loading =false;
        })
        this.resetArticle();
      } else {
        this.loading = true;
        if (this.article.state === '2' || this.article.state === '1') {
          this.article.state = '0';
        }
        api.updateArticle(this.article).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/content/manage-article'
            });
          } else {
            this.$message.error('文章更新失败！');
          }
        })
        this.loading =false;
      }
      this.resetArticle();
    },
    onEditorImageClick() {
      this.imageSelectFor = 'article';
      this.isImageSelectorShow = true;
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    uploadError() {
      this.$message.error('图片上传失败！');
    },
    uploadSuccess(response) {
      console.log(response)
      if (response.code === api.SUCCESS_CODE) {
        this.$message.success(response.message);
        this.listImages();
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
    listImages() {
      api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize,'article').then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.images = result.data.list;
          this.pageNavigation.totalCount = result.data.total;
          this.pageNavigation.currentPage = result.data.pageNum;
          this.pageNavigation.pageSize = result.data.pageSize;
        } else {
          this.$message.error(result.message);
        }
      })
    },
    onImageSelected() {
      //从数组里拿到当前选中的对象
      let item = this.images[this.selectedImageIndex];
      if (this.imageSelectFor === 'article') {
        this.$refs.mdEditor.toolbar_left_addlink('no-link',
            item.name,
            this.blog_constants.baseUrl + '/portal/image/' + item.url)
      } else if(this.imageSelectFor === 'cover') {
        this.article.cover = item.url;
      }
      this.isImageSelectorShow = false;
    },
    showImageSelector() {
      this.imageSelectFor = 'cover';
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
        if (this.labelNewValue && this.labelNewValue !=='') {
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
    },
    getArticleDetail(articleId) {
      api.getArticleDetail(articleId).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.article.title = result.data.title;
          this.article.content = result.data.content;
          this.article.summary = result.data.summary;
          this.article.cover = result.data.cover;
          this.article.state = result.data.state;
          this.article.type = result.data.type;
          this.article.id = result.data.id;
          this.article.categoryId = result.data.categoryId;
          this.article.labels = result.data.labels;
          this.article.createTime = result.data.createTime;
          this.labels = result.data.labelList;

          if (this.article.state === '1') {
            this.commitText = '发表文章';
            this.disableDraftBtn = false;
          } else {
            this.commitText = '更新文章';
            this.disableDraftBtn = true;
          }


          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },
  mounted() {
    window.onbeforeunload = function () {
      return '系统可能不会保存填写的稿件信息噢！';
    }
    let articleId = this.$route.query.articleId;
    if (articleId) {
      console.log(articleId)
      this.getArticleDetail(articleId);
    }
    this.listCategories();
    this.listImages();
  },
  beforeRouteLeave(to, from, next) {
    if (this.isContentSave) {
      next();
    } else {
      this.nextPath = to.path;
      this.saveConfirmDialogShow = true;
    }
  }
}
</script>
<style>
.article-cover-selector .el-image__error {
  padding-top: 50px;
}
.image-action-bar .el-upload-dragger {
  border: none;
  width: 98px;
  height: 36px;
}

.image-selector-list .el-radio-button {
  margin: 6px;
}

.image-selector-list .el-radio-button__inner, .el-radio-button:first-child .el-radio-button__inner {
  padding: 0px;
  border: none;
  border-radius: 4px;
}

.image-selector-list img {
  width: 165px;
  height: 110px;
  float: left;
  margin: 3px;
  border: solid 1px #919191;
  border-radius: 4px;
}

.image-picker-container .el-dialog__header {
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
.article-cover-selector img {
  width: 200px;
  height: 140px;
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
.article-post-part h1 {
  color: #000000;
}
.article-post-part {
  height: 800px;
}
.article-post-box{
  min-height: 500px;
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