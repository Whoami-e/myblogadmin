<template>
  <div class="dashboard-box">
    <div class="welcome-tps">
      欢迎使用Halo博客系统！
    </div>
    <div class="web-size-info-box">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="meta">
              <span>用户</span>
              <span class="action">
                <i @click="userList" class="el-icon-user-solid"></i>
              </span>
            </div>
            <div class="number">
              <span>{{ userNum }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="meta">
              <span>文章</span>
              <span class="action">
                <i @click="addArticle" class="el-icon-plus"></i>
              </span>
            </div>
            <div class="number">
              <span>{{ articleNum }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="meta">
              <span>评论</span>
              <span class="action">
                <i @click="commentList" class="el-icon-s-comment"></i>
              </span>
            </div>
            <div class="number">
              <span>{{ commentNum }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="meta">
              <span>网站访问量</span>
              <span class="action" style="padding-left: 180px; !important;">
<!--                <i @click="webSizeViewCount" class="el-icon-s-comment"></i>-->
              </span>
            </div>
            <div class="number">
              <span>{{ ViewCount }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dashboard-bottom-part">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>最近文章</span>
                <el-button @click="articleList" style="float: right; padding: 3px 0" type="text">更多文章>>></el-button>
              </div>
              <el-table
                  :show-header="false"
                  :data="articles"
                  style="width: 100%"
                  class="table">
                <el-table-column
                    prop="title"
                    label="文章标题">
                </el-table-column>
                <el-table-column
                    label="创建日期">
                  <template slot-scope="scope">
                    <span style="float: right" v-text="formatDate(scope.row.createTime)"></span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>速记</span>
              </div>
              <div class="text item">
                <el-input
                    type="textarea"
                    :rows="6"
                    placeholder="写点儿什么吧.."
                    v-model="note.content">
                </el-input>
              </div>
              <div>
                <el-button type="primary" @click="addNote">保存</el-button>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>最近速记</span>
                <el-tooltip class="item" effect="dark" content="已经解决速记的内容的话请点击已解决按钮删除速记！" placement="left">
                  <i class="el-icon-question" style="cursor:pointer;float: right; padding: 3px 0; color: red;"></i>
                </el-tooltip>
              </div>
              <el-table
                  :show-header="false"
                  :data="notes"
                  style="width: 100%"
                  class="table">
                <el-table-column
                    prop="content"
                    label="速记内容">
                </el-table-column>
                <el-table-column
                    label="创建日期">
                  <template slot-scope="scope">
                    <span v-text="formatDate(scope.row.createTime)"></span>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                  <template slot-scope="scope">
                    <el-button @click="deleteNote(scope.row)" style="float: right;" type="primary" size="small">已解决</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
  data() {
    return {
      articleNum: 0,
      userNum: 0,
      commentNum: 0,
      ViewCount: 0,
      articles: [],
      notes: [],
      note: {
        content: ''
      }

    }
  },
  methods: {
    deleteNote(item) {
      api.deleteNote(item.id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
        this.listNote();
      })
    },
    addNote() {
      if (this.note.content === '') {
        this.$message.error('请输入速记内容！');
        return;
      }
      api.addNote(this.note).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
        this.note.content = '';
        this.listNote();
      })
    },
    articleList() {
      this.$router.push({
        path: '/content/manage-article'
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd');
    },
    commentList() {
      this.$router.push({
        path: '/content/manage-comment'
      })
    },
    userList() {
      this.$router.push({
        path: '/user/list'
      })
    },
    addArticle() {
      this.$router.push({
        path: '/content/post-article'
      })
    },
    listNote() {
      api.listNote().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.notes = result.data.list;
        }
      })
    },
    listArticle() {
      api.listArticles(1, 5, '', '', '').then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.articles = result.data.list;
          this.articleNum = result.data.total;
        }
      })
    },
    listUsers() {
      api.listUsers(1, 5).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.userNum = result.data.total;
        }
      });
    },
    listComments() {
      api.listComments(1, 1).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.commentNum = result.data.total;
        }
      })
    },
    webSizeViewCount() {
      api.getViewCount().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.ViewCount = result.data['web_size_view_count'];
        }
      })
    }
  },
  mounted() {
    this.webSizeViewCount();
    this.listComments();
    this.listUsers();
    this.listArticle();
    this.listNote();
  }
}
</script>
<style>
.dashboard-bottom-part h4 {
  width: 235px;
  color: rgba(0, 0, 0, .65);
  font-size: 14px;
  line-height: 22px;
}

.dashboard-bottom-part .ant-divider {
  color: rgba(0, 0, 0, 0.65);
  background: #e8e8e8;
}

.dashboard-bottom-part .ant-divider-horizontal {
  /*display: block;*/
  clear: both;
  height: 1px;
  margin: 24px 0;
}

.dashboard-bottom-part .grid-content .el-card {
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}

.dashboard-bottom-part {
  margin-top: 20px;
}

.welcome-tps {
  padding: 20px;
  font-size: 20px;
  font-weight: 600;
}

.number {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #000;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 32px;
  line-height: 38px;
  height: 38px;
  margin-left: 20px;
}

.web-size-info-box .grid-content {
  height: 112px;
}

.web-size-info-box .action {
  color: red;
  cursor: pointer;
  /*padding-left: 225px;*/
  float: right;
  margin-right: 50px;
}

.web-size-info-box .meta {
  padding-top: 30px;
  padding-left: 20px;
  color: rgba(0, 0, 0, .45);
  font-size: 14px;
  line-height: 22px;
  width: 100%;
}

.dashboard-box {
  min-width: 1140px;
}

/*.el-row {*/
/*  margin-bottom: 20px;*/
/*  &:last-child {*/
/*   margin-bottom: 0;*/
/* }*/
/*}*/
.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  /*background: #d3dce6;*/
  background: #FFFFFF;
}


.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>