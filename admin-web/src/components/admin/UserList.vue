<template>
<div>
  <el-button @click="handleAdd()" type="primary" icon="plus" class="headBtn">添加管理员</el-button>
  <el-table border @sort-change="sort" v-loading="loading" :data="listData" stripe style="width: 100%">
    <el-table-column prop="id" label="ID" sortable="custom" max-width="50"></el-table-column>
    <el-table-column prop="name" label="用户名" min-width="100"></el-table-column>
    <el-table-column prop="nickname" label="昵称" min-width="150"></el-table-column>
    <el-table-column prop="role" label="权限" max-width="80"></el-table-column>
    <el-table-column prop="note" label="备注" min-width="150"></el-table-column>
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
      type="admin_users"
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
        id: { name: 'id', type: 'Integer', comment: '管理员ID', nullable: false, default: null },
        name: { name: 'name', type: 'String', comment: '管理员用户名', nullable: false, default: null },
        nickname: { name: 'nickname', type: 'String', comment: '管理员昵称', nullable: false, default: null },
        password: { name: 'password', type: 'String', comment: '密码', nullable: false, default: null },
        role: {
          name: 'role', type: 'ENUM',
          comment: '权限（super 超级管理员、editor 编辑、viewer 查看）', nullable: false, default: null,
          params: [{ value: 'super', name: '超级管理员' }, { value: 'editor', name: '编辑' }, { value: 'viewer', name: '查看' }],
        },
        note: { name: 'note', type: 'String', comment: '备注', nullable: true, default: null },
      },
      primary: 'id',
    };
  },
  computed: {
    editTitle() {
      return this.isCreate ? '创建管理员' : '修改管理员';
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
      this.$confirm(`此操作将删除该管理员, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const param = { index, admin_id: row.id };
        this.$store.dispatch('delete_admin_users', param)
          .then(() => {
            this.$message({ type: 'success', message: '删除成功!' });
          }).catch((err) => {
            this.$message.error(err.msg || '删除失败');
          });
      }).catch((_err) => {});
    },
    editDone(msg) {
      if(msg === true) {
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