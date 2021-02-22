<template>
  <div class="category-box">
    <div class="category-action-bar">
      <el-button type="primary" size="medium" @click="showAddCategory" icon="el-icon-circle-plus-outline"></el-button>
    </div>
    <div class="category-list-box">
      <el-table
          v-loading="loading"
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
            width="150">
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
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px" v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)" icon="el-icon-edit"></el-button>
            <el-button type="danger" v-if="scope.row.status!=='0'" size="mini" @click="deleteCategory(scope.row)"
                       icon="el-icon-delete"></el-button>
            <el-button type="danger" v-if="scope.row.status==='0'" size="mini" @click="deleteCategory(scope.row)"
                       icon="el-icon-delete" disabled></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="category-dialog-box">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>确定要删除: <font style="color: red">{{ deleteMessage }}</font>  这个分类么?</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="deleteDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="deleteItem()">确 定</el-button>
        </span>
      </el-dialog>

      <!--添加/编辑dialog-->
      <el-dialog
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          :title="editTitle"
          :visible.sync="editDialogShow"
          width="500px">
        <div class="category-edit-box">
          <el-form label-width="80px"  :rules="rules" :model="category">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="category.name"></el-input>
            </el-form-item>
            <el-form-item label="分类描述" prop="description">
              <el-input type="textarea" :row="2" resize="none" maxlength="80" placeholder="最多80个字符" v-model="category.description"></el-input>
            </el-form-item>
            <el-form-item label="分类拼音" prop="pinyin">
              <el-input v-model="category.pinyin"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="category.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                  style="display: block"
                  v-model="category.status"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-icon-class="el-icon-circle-check"
                  inactive-icon-class="el-icon-circle-close"
                  active-value="1"
                  inactive-value="0"
                  class="switch">
              </el-switch>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="danger" @click="editDialogShow = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="postCategory">确 定</el-button>
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
    let validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分类名称'));
      }
    };
    let validateDescription = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分类描述'));
      }
    };
    let validatePinyin = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入分类拼音'));
      }
    };
    return {
      loading: false,
      categories: [],
      deleteDialogShow: false,
      editDialogShow: false,
      deleteMessage: '',
      deleteTargetID: '',
      editTitle: '编辑分类',
      category: {
        id: '',
        name: '',
        description: '',
        order: 1,
        pinyin: '',
        status: '1'
      },
      rules: {
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        description: [
          { required: true, validator: validateDescription, trigger: 'blur' }
        ],
        pinyin: [
          { required: true, validator: validatePinyin, trigger: 'blur' }
         ]
      }
    }
  },
  methods: {
    toastE(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      });
    },
    edit(item) {
      this.category.name = item.name;
      this.category.description = item.description;
      this.category.order = item.order;
      this.category.id = item.id;
      this.category.status = item.status;
      this.category.pinyin = item.pinyin;
      this.editDialogShow = true;
      this.editTitle = '编辑分类';
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
        if (result.code === api.SUCCESS_CODE) {
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
      this.loading = true;
      api.listCategories().then(result => {
        if (result.code === api.SUCCESS_CODE) {
          this.categories = result.data
        }
        this.loading = false;
      })
    },
    showAddCategory() {
      this.editTitle = '添加分类';
      this.editDialogShow = true;
    },
    postCategory() {
      if (this.category.name === '') {
        this.toastE('请输入分类名称');
        return;
      }
      if (this.category.description === '') {
        this.toastE('请输入分类描述');
        return;
      }
      if (this.category.pinyin === '') {
        this.toastE('请输入分类拼音');
        return;
      }
      if (this.category.id === '') {
        api.addCategory(this.category).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            });
            this.listCategories();
            this.resetForm();
          } else {
            this.toastE(result.message);
          }
        })
      } else {
        api.updateCategory(this.category.id,this.category).then(result => {
          if (result.code === api.SUCCESS_CODE) {
            this.$message({
              message: result.message,
              center: true,
              type: 'success'
            });
            this.listCategories();
            this.resetForm();
          } else {
            this.toastE(result.message);
          }
        })
      }
      this.editDialogShow = false;
    },
    resetForm() {
      this.category.name = '';
      this.category.description = '';
      this.category.pinyin = '';
      this.category.id = '';
      this.category.status = '1';
      this.category.order = 1;
    }
  },
  mounted() {
    //获取分类列表
    this.listCategories()
  }
}
</script>
<style>
.switch {
  padding-top: 10px;
}

.category-list-box .table {
  margin-top: 10px;
  background-color: #E9EEF3;
}

.el-table tr {
  background-color: #E9EEF3;
  border: solid 1px #E4DFDF;
}

.category-list-box .cell {
  text-align: center;
}

/*.category-list-box .el-table{*/
/*  min-height: 400px;*/
/*}*/

.el-dialog__title {
  color: red;
}
.category-edit-box .el-form-item {
  margin-bottom: 10px;
}
</style>