<template>
  <div>
    <h2>{{ title }} （{{ total }}）</h2>
    <el-row :gutter="10">
      <el-col :span="18">
        <el-button type="primary" @click="fetchData(true)">刷新</el-button>
        <el-button v-if="editable" @click="handleAdd()" type="primary" icon="plus">添加数据</el-button>
        <el-select v-model="pageOptions.field" style="margin-left:1rem; width: 10rem" placeholder="查询字段">
          <el-option v-for="item in this.schema" :label="item.comment || item.name" :value="item.name" :key="item.name"></el-option>
        </el-select>
        <el-select style="width: 6rem" v-model="pageOptions.operate" placeholder="条件">
          <el-option v-for="item in OPT" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <el-input style="width: 14rem" v-model="pageOptions.value" placeholder="内容"></el-input>
        <el-button @click="fetchData()" icon="el-icon-search" circle></el-button>
      </el-col>
      <el-col :span="6">
        <el-dropdown split-button class="menu-right" type="primary" @click="handleDwonloadExcel" @command="handleDownloadMenu">
          <i class="el-icon-information"></i> 下载数据
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="total<50000" command="download_excel">下载Excle</el-dropdown-item>
            <el-dropdown-item command="download_csv">下载CSV</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <br/>
    <el-table :loading="loading" :data="listData" style="width: 100%">
      <el-table-column v-for="item in this.schema" :label="item.comment || item.name" :prop="item.name" :key="item.name"></el-table-column>
      <el-table-column v-if="editable" label="操作" key="option">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.row, scope.$index)" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" @click="handleDelete(scope.row, scope.$index)" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageOptions.page"
      :page-size="pageOptions.page_count"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
    <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <edit-form
      :table="table"
      :schema="schema"
      :editingData="editingData"
      :editingIndex="editingIndex"
      :primary="primary"
      :create="isCreate"
      @done="editDone"
      />
    </el-dialog>
    </div>
</template>
<script>
  import EditForm from 'components/EditForm.vue';
  export default {
    created() {
      this.fetchData();
    },
    components: {
      EditForm,
    },
    watch: {
      '$route'(to) {
        this.loading = false;
        this.$store.dispatch('clean_list');
        this.table = to.params.list_type;
        this.pageOptions = { page: 1, page_count: 12, table: to.params.list_type };
        this.fetchData();
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        isCreate: false,
        table: this.$route.params.list_type,
        OPT: [ '=', '>', '>=', '<>', '<', '<=', 'like' ],
        pageOptions: {
          page: 1,
          page_count: 12,
          table: this.$route.params.list_type,
          field: null,
          operate: null,
          value: null,
        },
        loading: false,
        editingData: {},
        editingIndex: -1,
      };
    },
    computed: {
      title() {
        return this.$store.getters.schemas[this.table].name || this.table;
      },
      editTitle() {
        return this.isCreate ? '创建数据' : '修改数据';
      },
      schema() {
        return this.$store.getters.schemas[this.table].schema;
      },
      primary() {
        return this.$store.getters.schemas[this.table].primary;
      },
      total() {
        return this.$store.state.listInfo.page_data.count || 0;
      },
      editable() {
        return this.$store.state.admin.role !== 'viewer';
      },
      listData() {
        return this.$store.state.listInfo.list;
      },
    },
    methods: {
      fetchData(reload) {
        if(this.loading === true) return;
        if(reload) {
          this.pageOptions.operate = null;
          this.pageOptions.value = null;
          this.pageOptions.field = null;
        }
        this.loading = true;
        this.$store.dispatch('schema_list', this.pageOptions)
          .then(() => { this.loading = false; })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.msg || '请求失败');
          });
      },
      goBack() {
        this.$router.go(-1);
      },
      closeDialog() {
        this.dialogFormVisible = false;
        this.editingData = {};
        this.editingIndex = -1;
      },
      handleAdd() {
        this.dialogFormVisible = true;
        this.isCreate = true;
      },
      handleEdit(row, index) {
        this.editingData = Object.assign({}, row);
        this.editingIndex = index;
        this.isCreate = false;
        this.dialogFormVisible = true;
      },
      editDone(msg) {
        if(msg === true) {
          if(this.isCreate) this.fetchData();
          this.closeDialog();
          this.$message.success(this.editTitle + '成功');
        } else if(msg === false) {
          this.closeDialog();
        } else {
          this.$message.error(msg || '请求失败');
        }
      },
      handleDelete(row, index) {
        this.$confirm(`此操作将删除该记录, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const param = { index, id: row[this.primary], primary: this.primary, table: this.table };
          this.$store.dispatch('delete_row_info', param)
            .then(() => {
              this.$message({ type: 'success', message: '删除成功!' });
            }).catch(() => {
              this.$message.error('删除失败');
            });
        }).catch((_err) => {});
      },
      handleCurrentChange(page) {
        this.pageOptions.page = page;
        this.fetchData();
      },
      handleSecarch() {
        this.pageOptions.page = 1;
        this.fetchData();
      },
      handleOrder(data) {
        this.pageOptions.order = data.prop;
        this.pageOptions.asc = data.order === 'ascending';
        this.fetchData();
      },
      handleReload() {
        this.pageOptions.phone = '';
        this.fetchData();
      },
      handleDwonloadExcel() {
        window.location.assign('api/schema/export/excel?table=' + this.table);
      },
      handleDwonloadCSV() {
        window.location.assign('api/schema/export/csv?table=' + this.table);
      },
      handleDownloadMenu(name) {
        if(name === 'download_excel') {
          return this.handleDwonloadExcel();
        }
        if(name === 'download_csv') {
          return this.handleDwonloadCSV();
        }
      },
    },
  };
</script>
<style scoped>
.menu-right {
  float: right;
}
</style>
