<template>
  <div class="comment-list-box">
    <div class="comment-list-part">
      <el-table
          v-loading="loading"
          :data="comments"
          border
          style="width: 100%" class="table">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            fixed
            prop="userName"
            label="用户名"
            width="150">
        </el-table-column>
        <el-table-column
            label="内容">
          <template slot-scope="scope">
            <a class="link" style="color: red" href="#">{{ scope.row.content }}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==='2'" type="info">置顶</el-tag>
            <el-tag v-if="scope.row.state==='1'" type="success">已发布</el-tag>
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
            fixed="right"
            label="操作"
            width="180">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteItem(scope.row)" icon="el-icon-delete"></el-button>
            <el-button type="info" v-if="scope.row.state==='1'" size="mini" @click="top(scope.row)"
                       icon="el-icon-top"></el-button>
            <el-button type="info" v-if="scope.row.state==='2'" size="mini" @click="top(scope.row)"
                       icon="el-icon-bottom"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="comment-page-navigation">
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
    <div class="comment-dialog-part">
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <div style="margin-bottom: 8px">
          <h1 style="color: red">确定要删除这条评论么?</h1>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteComment()">确定</el-button>
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
      deleteDialogShow: false,
      targetId: '',
      comments: [],
      loading: false,
      pageNavigation: {
        currentPage: 1,     //当前页码
        totalCount: 0,       //总条数
        pageSize: 10,    //每页的数量
      }
    }
  },
  methods: {
    deleteComment() {
      api.deleteComment(this.targetId).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
        this.listComments();
        this.deleteDialogShow = false;
      })
    },
    handleSizeChange(size) {
      console.log(size)
      this.pageNavigation.pageSize = size;
      this.listComments();
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listComments();
    },
    deleteItem(item) {
      this.targetId = item.id;
      this.deleteDialogShow = true;
    },
    top(item) {
      api.topComment(item.id).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
        this.listComments();
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    listComments() {
      api.listComments(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.comments = result.data.list;
          this.pageNavigation.totalCount = result.data.total;
          this.pageNavigation.currentPage = result.data.pageNum;
          this.pageNavigation.pageSize = result.data.pageSize;
        } else {
          this.$message.error('评论列表获取出错！');
        }
      })
    }
  },
  mounted() {
    this.listComments();
  }
}
</script>
<style>
.link {
  text-decoration: none;
}

.comment-list-part .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  text-align: center;
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}
</style>