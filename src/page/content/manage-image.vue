<template>
  <div class="image-list-box">
<!--    <div class="image-action-bar">-->
<!--      <el-button style="margin-top: 10px" size="medium" type="primary">-->
<!--        <i class="el-icon-upload"></i>-->
<!--        上传图片-->
<!--      </el-button>-->
<!--    </div>-->
    <div class="image-list-part">
      <el-card shadow="hover" :label="item.id" v-for="(item,index) in images" :key="index"
               :body-style="{ padding: '0px' }" style="margin-top: 10px">
        <img @click="imageShow(item)" :src="blog_constants.imageBaseUrl + item.url" class="image">
        <div class="imageName" v-if="item.state === '1'" :style="{backgroundColor: success}">
          <span :title="item.name">{{ item.name }}</span>
        </div>
        <div class="imageName" v-if="item.state === '0'" :style="{backgroundColor: danger}">
          <span :title="item.name">{{ item.name }}</span>
        </div>
      </el-card>
    </div>
    <div class="image-list-page-navigation" style="margin-top: 20px;padding-right: 25px">
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
    <div class="image-list-dialog">
      <el-drawer
          ref="drawerClose"
          class="dialog-drawer"
          title="图片详细"
          :visible.sync="drawer"
          :with-header="true">
        <img :src="image.url" style="width: 384px;height: 216px;margin-left: 40px">
        <div class="ant-divider ant-divider-horizontal"></div>
        <div style="margin-left: 40px">
          <h4 class="ant-list-item-meta-title">图片名：</h4>
          <div>
            <font style="color: rgba(0, 0, 0, 0.45);font-size: 14px;">{{ this.image.name }}</font>
          </div>
        </div>
        <div class="ant-divider ant-divider-horizontal"></div>
        <div style="margin-left: 40px">
          <h4 class="ant-list-item-meta-title">图片类型：</h4>
          <div>
            <font style="color: rgba(0, 0, 0, 0.45);font-size: 14px;">{{ this.image.contentType }}</font>
          </div>
        </div>
        <div class="ant-divider ant-divider-horizontal"></div>
        <div style="margin-left: 40px">
          <h4 class="ant-list-item-meta-title">上传日期：</h4>
          <div>
            <font style="color: rgba(0, 0, 0, 0.45);font-size: 14px;">{{ formatDate(this.image.createTime) }}</font>
          </div>
        </div>
        <div class="ant-divider ant-divider-horizontal"></div>
        <div style="margin-left: 40px">
          <h4 class="ant-list-item-meta-title">
            访问链接：
            <i v-on:click="copyUrl()" class="el-icon-document-copy" style="cursor: pointer;"></i>
          </h4>
          <div style="padding-right: 20px;color: rgba(0, 0, 0, 0.45);font-size: 14px;word-wrap: break-word;">
            <span id="imageUrl">{{ this.image.url }}</span>
          </div>
        </div>
        <div class="ant-divider ant-divider-horizontal"></div>
        <div style="margin-left: 40px;">
          <h4 class="ant-list-item-meta-title">
            Markdown 格式：
            <i v-on:click="copyMarkdown()" class="el-icon-document-copy" style="cursor: pointer;"></i>
          </h4>
          <div style="padding-right: 20px;margin-bottom: 75px;color: rgba(0, 0, 0, 0.45);font-size: 14px;word-wrap: break-word;">
            <span id="markdown">{{ this.image.markdown }}</span>
          </div>
        </div>
        <div class="btn">
          <el-button v-if="image.state === '1'" @click="deleteImage()" type="danger" size="medium">禁用图片</el-button>
          <el-button v-else @click="deleteImage()" type="primary" size="medium">恢复正常</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
  data() {
    return {
      success: '#67c23a',
      danger: '#f56c6c',
      drawer: false,
      images: [],
      pageNavigation: {
        currentPage: 1,     //当前页码
        totalCount: 0,       //总条数
        pageSize: 18,    //每页的数量
      },
      image: {
        id: '',
        name: '',
        url: '',
        contentType: '',
        markdown: '',
        createTime: '',
        state: ''
      }
    }
  },
  methods: {
    deleteImage() {
      if (this.image.state === '1') {
        api.deleteImage(this.image.id).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
          this.$refs.drawerClose.hide();
          this.listImages();
        })
      } else {
        api.getRightImage(this.image.id).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
          this.$refs.drawerClose.hide();
          this.listImages();
        })
      }

    },
    copyUrl() {
        const spanText = document.getElementById('imageUrl').innerText;
        const oInput = document.createElement('input');
        oInput.value = spanText;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        document.body.removeChild(oInput);
        this.$message.success('复制成功');
    },
    copyMarkdown() {
        const spanText = document.getElementById('markdown').innerText;
        const oInput = document.createElement('input');
        oInput.value = spanText;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.style.display = 'none';
        document.body.removeChild(oInput);
        this.$message.success('复制成功');
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    imageShow(item) {
      console.log(item)
      this.image.id = item.id;
      this.image.name = item.name;
      this.image.url = this.blog_constants.imageBaseUrl + item.url;
      this.image.contentType = item.contentType;
      this.image.markdown = '![' + item.name + '](' + this.image.url + ')';
      this.image.createTime = item.createTime;
      this.image.state = item.state;
      this.drawer = true;
    },
    listImages() {
      api.listImagesManagement(this.pageNavigation.currentPage, this.pageNavigation.pageSize, '').then(result => {
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
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    }
  },
  mounted() {
    this.listImages();
  }
}
</script>
<style>
.imageName {
  margin-top: 0px;
  padding-right: 5px;
  padding-leftt: 5px;
  padding-bottom: 5px;
}
.image-list-part .el-tag{
  margin-left: 0px;
  margin-right: -10px;
  width: 50px;
}
.image-list-dialog .btn{
  background: #ffffff;
  width: 460px;
  float: right;
  position: fixed;
  bottom: 0;
  margin-top: 20px;
  text-align: right;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 25px;
  border-top: solid 1px #E4DFDF;
}
.image-list-dialog  .el-drawer__body {
  overflow: auto;
}
.image-list-dialog .el-drawer__container ::-webkit-scrollbar{
  display: none;
}

.image-list-dialog .el-drawer__header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: solid 1px #E4DFDF;
}
.image-list-dialog .ant-list-item-meta-title {
  margin-bottom: 4px;
  color: rgba(0,0,0,.65);
  font-size: 14px;
  line-height: 22px;
}
.image-list-dialog .ant-divider {
  color: rgba(0, 0, 0, 0.65);
  background: #e8e8e8;
}

.image-list-dialog .ant-divider-horizontal {
  display: block;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  margin: 24px 0;
}

.image-list-part span {
  margin-left: 20px;
  display: block;
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.image-list-part .el-card {
  width: 192px;
  margin-right: 20px;
  display: inline-block;
}

.image-list-part img {
  width: 192px;
  height: 108px;
  cursor: pointer;
}
</style>