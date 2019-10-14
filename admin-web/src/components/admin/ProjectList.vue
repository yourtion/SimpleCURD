<template>
<div>
  <el-button @click="handleAdd()" type="primary" icon="plus" class="headBtn">添加项目</el-button>
  <br />
  <el-table border @sort-change="sort" v-loading="loading" :data="listData" stripe style="width: 100%">
    <el-table-column prop="id" label="ID" sortable="custom" max-width="50"></el-table-column>
    <el-table-column prop="name" label="项目名" min-width="100"></el-table-column>
    <el-table-column prop="note" label="备注" min-width="150"></el-table-column>
    <el-table-column sortable="custom" prop="created_at" label="创建时间" min-width="120">
      <template slot-scope="scope">{{ scope.row.created_at | formatDate }}</template>
    </el-table-column>
    <el-table-column label="授权用户" min-width="120">
      <template slot-scope="scope">
        <el-tag v-for="u in (scope.row.admin && scope.row.admin.split(','))" class="user-tag" :key="u">{{ u }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" key="option" min-width="120">
      <template slot-scope="scope">
        <el-button size="small" @click="handleEdit(scope.row, scope.$index)" type="primary" icon="el-icon-edit"></el-button>
        <el-button size="small" @click="handleDelete(scope.row, scope.$index)" type="danger" icon="el-icon-delete"></el-button>
        <el-button size="small" @click="handleAuth(scope.row, scope.$index)" type="primary" icon="el-icon-information">授权</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="editTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <AdminEditForm
      type="project"
      :exclude="exclude"
      :schema="schema" 
      :editingData="editingData"
      :editingIndex="editingIndex" 
      :primary="primary"
      :create="isCreate"
      @done="editDone"
      />
  </el-dialog>
  <el-dialog title="授权管理" :visible.sync="dialogTransferVisible" @close="closeTransfer" size="tiny">
    <AdminTransferForm
    :projectId="authProjectId"
    :projectUser="projectUser"
    :users="users"
    @done="authDone"
    />
  </el-dialog>
</div>
</template>
<script>
import AdminEditForm from 'components/admin/AdminEditForm.vue';
import AdminTransferForm from 'components/admin/AdminTransferForm.vue';
export default {
  props: [ 'loading', 'listData' ],
  components: {
    AdminEditForm,
    AdminTransferForm,
  },
  mounted() {
    if(this.$store.state.users.length < 1) {
      this.$store.dispatch('fetch_users');
    }
  },
  data() {
    return {
      isCreate: false,
      dialogFormVisible: false,
      dialogTransferVisible: false,
      editingIndex: -1,
      authProjectId: -1,
      projectUser: [],
      editingData: {},
      exclude: [],
      schema: {
        id: { name: 'id', type: 'Integer', comment: '项目ID', nullable: false, default: null },
        name: { name: 'name', type: 'String', comment: '项目名称', nullable: false, default: null },
        note: { name: 'note', type: 'String', comment: '备注', nullable: true, default: null },
      },
      primary: 'id',
    };
  },
  computed: {
    editTitle() {
      return this.isCreate ? '创建项目' : '修改项目信息';
    },
    users() {
      return this.$store.getters.users;
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
    closeTransfer() {
      this.dialogTransferVisible = false;
      this.projectUser = [];
      this.projectUserOrg = [];
      this.authProjectId = -1;
    },
    handleAuth(row) {
      this.projectUser = (row.admin && row.admin.split(',')) || [];
      this.authProjectId = row.id;
      this.dialogTransferVisible = true;
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
      this.$confirm(`此操作将删除该项目, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const param = { index, project_id: row.id };
        this.$store.dispatch('delete_project', param)
          .then(() => {
            this.$message({ type: 'success', message: '删除成功!' });
          }).catch((err) => {
            this.$message.error(err.msg || '删除失败');
          });
      }).catch((_err) => {});
    },
    authDone(msg) {
      if(msg === true) {
        this.$emit('reload');
        this.closeTransfer();
        this.$message.success(this.editTitle + '成功');
      } else if(msg === false) {
        this.closeTransfer();
      } else {
        this.$message.error(msg || '请求失败');
      }
    },
    editDone(msg) {
      if(msg === true) {
        this.$emit('reload');
        this.closeDialog();
        this.$message.success(this.editTitle + '成功');
        this.$store.dispatch('reload');
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
.user-tag {
  margin-right: 3px;
}
</style>
