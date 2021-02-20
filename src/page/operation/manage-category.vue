<template>
  <div class="category-box">
    <div class="category-action-bar">
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="category-list-box">
      <el-table
          :data="categories"
          border
          style="width: 100%" class="table">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="pinyin"
            label="拼音"
            width="200">
        </el-table-column>
        <el-table-column
            label="状态"
            width="70">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==='0'" size="mini" type="danger" icon="el-icon-circle-close"></el-button>
            <el-button v-if="scope.row.status==='1'" size="mini" type="success" icon="el-icon-circle-check"></el-button>
          </template>
        </el-table-column>
        <el-table-column
            prop="description"
            label="描述">
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            label="更新日期"
            width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" size="mini" @click="deleteCategory(scope.row)" icon="el-icon-delete"></el-button>
            <el-button type="danger" v-if="scope.row.status==='0'" size="mini" @click="deleteCategory(scope.row)" icon="el-icon-delete" disabled></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="category-dialog-box">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>确定要删除: <font style="color: red">{{deleteMessage}}</font>  这个分类么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteItem()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
  data() {
    return {
      categories: [],
      deleteDialogShow: false,
      deleteMessage: '',
      deleteTargetID: ''
    }
  },
  methods: {
    edit(item) {
      console.log(item)
    },
    deleteCategory(item) {
      this.deleteDialogShow = true;
      this.deleteMessage = item.name;
      this.deleteTargetID = item.id;
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    deleteItem() {
      api.deleteCategoryById(this.deleteTargetID).then(result => {
        if (result.code === 20000) {
          this.$message({
            message: result.message,
            center: true,
            type: 'success'
          });
          this.listCategories();
        }
      })
      this.deleteDialogShow = false;
    },
    listCategories() {
      api.listCategories().then(result => {
        if (result.code === 20000) {
          this.categories = result.data
        }
      })
    }
  },
  mounted() {
    //获取分类列表
    this.listCategories()
  }
}
</script>
<style>
  .table {
    margin-top: 10px;
    border: solid 1px #E4DFDF;
    background-color: #E9EEF3;
  }

  .el-table th, .el-table tr, .el-table td {
    background-color: #E9EEF3;
    border: solid 1px #E4DFDF;
  }

  .category-list-box .cell {
    text-align: center;
  }
  .el-dialog__title {
    color: red;
  }
</style>