<template>
<div>
  <el-button @click="handleAdd()" type="primary" icon="plus" class="headBtn">添加管理数据表</el-button>
  <br />
  <el-table border @sort-change="sort" v-loading="loading" :data="listData" stripe style="width: 100%">
    <el-table-column prop="id" label="ID" sortable="custom" max-width="50"></el-table-column>
    <el-table-column prop="name" label="表名"></el-table-column>
    <el-table-column prop="project_id" label="项目ID" min-width="50"></el-table-column>
    <el-table-column prop="is_offline" label="上线状态" min-width="60">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.is_offline" type="danger">下线</el-tag>
        <el-tag v-if="!scope.row.is_offline" type="success">上线</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="is_update" label="可更新" min-width="40">
      <template slot-scope="scope">
        <el-tag v-if="!scope.row.is_update" type="danger">否</el-tag>
        <el-tag v-if="scope.row.is_update" type="success">是</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="note" label="备注"></el-table-column>
    <el-table-column sortable="custom" prop="created_at" label="创建时间" min-width="120">
      <template slot-scope="scope">{{ scope.row.created_at | formatDate }}</template>
    </el-table-column>
    <el-table-column label="操作" key="option">
      <template slot-scope="scope">
        <el-button size="small" @click="handleEdit(scope.row, scope.$index)" type="primary" icon="el-icon-edit"></el-button>
        <el-button size="small" @click="handleDelete(scope.row, scope.$index)" type="danger" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <AdminEditForm
      type="table"
      :exclude="exclude"
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
import AdminEditForm from 'components/admin/AdminEditForm.vue';
export default {
  props: [ 'loading', 'listData' ],
  components: {
    AdminEditForm,
  },
  data() {
    return {
      isCreate: false,
      dialogFormVisible: false,
      editingIndex: -1,
      editingData: {},
      exclude: [],
      schema: {
        id: { name: 'id', type: 'Integer', comment: '数据表ID', nullable: false, default: null },
        project_id: {
          name: 'project_id', type: 'ENUM', comment: '项目ID', nullable: false, default: null,
          params: this.$store.getters.projects,
        },
        is_update: { name: 'is_update', type: 'Boolean', comment: '允许更新', nullable: false, default: null },
        is_offline: { name: 'is_offline', type: 'Boolean', comment: '下线', nullable: false, default: null },
        name: { name: 'name', type: 'String', comment: '表名', nullable: false, default: null },
        note: { name: 'note', type: 'String', comment: '备注', nullable: true, default: null },
      },
      primary: 'id',
    };
  },
  computed: {
    editTitle() {
      return this.isCreate ? '创建表格' : '修改表格数据';
    },
  },
  methods: {
    sort(data) {
      this.$emit('orderChange', data);
    },
    closeDialog() {
      this.dialogFormVisible = false;
      this.editingData = {};
      this.editingIndex = -1;
    },
    handleAdd() {
      this.exclude = [];
      this.isCreate = true;
      this.dialogFormVisible = true;
    },
    handleEdit(row, index) {
      this.exclude = [ 'password' ];
      this.editingData = Object.assign({}, row);
      this.editingIndex = index;
      this.isCreate = false;
      this.dialogFormVisible = true;
    },
    handleDelete(row, index) {
      this.$confirm(`此操作将让管理平台不再显示该数据表, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const param = { index, table_id: row.id };
        this.$store.dispatch('delete_table', param)
          .then(() => {
            this.$store.dispatch('reload', 3000);
            this.$message({ type: 'success', message: '删除成功!' });
          }).catch((err) => {
            this.$message.error(err.msg || '删除失败');
          });
      }).catch((_err) => {});
    },
    editDone(msg) {
      if(msg === true) {
        this.$store.dispatch('reload', 3000);
        this.$emit('reload');
        this.closeDialog();
        this.$message.success(this.editTitle + '成功');
      } else if(msg === false) {
        this.closeDialog();
      } else {
        this.$message.error(msg || '请求失败');
      }
    },
  },
};
</script>
<style scoped>
.headBtn {
  margin-bottom: 15px;
}
</style>
