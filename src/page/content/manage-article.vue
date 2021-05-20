<template>
  <div class="article-list-box">
    <div class="article-action-bar">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="文章标题">
          <el-input v-model="search.keyword" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="文章状态">
          <el-select v-model="search.state" placeholder="请选择文章状态">
            <el-option label="已发布" value="0"></el-option>
            <el-option label="草稿" value="1"></el-option>
            <el-option label="已删除" value="2"></el-option>
            <el-option label="置顶" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select v-model="search.categoryId" placeholder="请选择文章分类">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doArticleSearch">查询</el-button>
          <el-button @click="cleanSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list-part">
      <el-table
          v-loading="loading"
          :data="articles"
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
            label="文章标题"
            width="280">
        </el-table-column>
        <el-table-column
            prop="viewCount"
            label="浏览量"
            width="70">
        </el-table-column>
        <el-table-column
            label="状态"
            width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==='1'">草稿</el-tag>
            <el-tag v-if="scope.row.state==='0'" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.state==='3'" type="info">置顶</el-tag>
            <el-tag v-if="scope.row.state==='2'" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="summary"
            label="文章摘要">
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
            fixed="right"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)" icon="el-icon-delete"></el-button>
            <el-button type="info" v-if="scope.row.state==='0'" size="mini" @click="top(scope.row)" icon="el-icon-top"></el-button>
            <el-button type="info" v-if="scope.row.state==='3'" size="mini" @click="top(scope.row)" icon="el-icon-bottom"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="article-page-navigation">
      <el-pagination
          style="text-align: right"
          background
          @size-change="handleSizeChange"
          @current-change="onPageChange"
          :current-page="pageNavigation.currentPage"
          :page-size="pageNavigation.pageSize"
          :page-sizes="[10, 30, 50, 70]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="article-dialog-part">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <div style="margin-bottom: 8px">
          <h1 style="color: red">确定要删除这篇文章么?</h1>
        </div>
        <div>
          <span>*注：删除分为两种情况，请谨慎选择：</span>
          <div>
            <span> 1、只是把状态改为删除状态；</span>
            <br>
            <span> 2、彻底删除；</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteArticleByState()">状态改变</el-button>
          <el-button size="mini" type="primary" @click="deleteArticle()">彻底删除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import * as dateUtils from "@/utils/date";
  import * as api from "@/api/api";
  export default {
    data() {
      return {
        targetId: '',
        deleteDialogShow: false,
        categories: [],
        loading: false,
        articles: [],
        search: {
          keyword: '',
          state: '',
          categoryId: ''
        },
        pageNavigation: {
          currentPage: 1,     //当前页码
          totalCount: 0,       //总条数
          pageSize: 10,    //每页的数量
        }
      }
    },
    methods: {
      deleteArticle() {
        api.deleteArticle(this.targetId).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
          this.targetId = '';
          this.listArticles();
          this.deleteDialogShow = false;
        })
      },
      deleteArticleByState() {
        api.deleteArticleByState(this.targetId).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
          this.deleteDialogShow = false;
          this.targetId = '';
          this.listArticles();
        })
      },
      edit(item) {
        let articleId = item.id;
        this.$router.push({
          path: '/content/post-article',
          query: {
            articleId: articleId
          }
        });
      },
      deleteItem(item) {
        this.targetId = item.id;
        this.deleteDialogShow = true;
      },
      top(item) {
        api.topArticle(item.id).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
          this.listArticles();
        })
      },
      handleSizeChange(size) {
        console.log(size)
        this.pageNavigation.pageSize = size;
        this.listArticles();
      },
      onPageChange(page) {
        this.pageNavigation.currentPage = page;
        this.listArticles();
      },
      cleanSearch() {
        this.search.categoryId = '';
        this.search.state = '';
        this.search.keyword = '';
        this.listArticles()
      },
      listCategories() {
        api.listCategories().then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.categories = result.data;
          }
        })
      },
      doArticleSearch() {
        this.listArticles()
      },
      formatDate(dateStr) {
        let date = new Date(dateStr);
        return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      },
      listArticles() {
        this.loading = true;
        api.listArticles(this.pageNavigation.currentPage,this.pageNavigation.pageSize,this.search.state,this.search.keyword,this.search.categoryId).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.articles = result.data.list;
            console.log(result.code)
            this.pageNavigation.totalCount = result.data.total;
            this.pageNavigation.currentPage = result.data.pageNum;
            this.pageNavigation.pageSize = result.data.pageSize;
          }
        })
        this.loading = false;
      }
    },
    mounted() {
      this.listArticles();
      this.listCategories();
    }
  }
</script>
<style>
.article-list-box .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  text-align: center;
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}
.article-action-bar .el-form-item {
  margin-bottom: 0px;
}
</style>