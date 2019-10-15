<template>
<div>
  <el-menu router background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" :default-active="active" >
    <el-menu-item index="/home">数据平台</el-menu-item>
    <el-submenu v-if="super_admin" index="/admin/users">
      <template slot="title">平台管理</template>
      <el-menu-item index="/admin/users">用户管理</el-menu-item>
      <el-menu-item index="/admin/projects">项目管理</el-menu-item>
      <el-menu-item index="/admin/tables">表格管理</el-menu-item>
    </el-submenu>
    <el-submenu v-for="item in list" :index="`/${item.submenu[0].table}/list`" :key="item.id">
      <template slot="title">{{ item.name }}</template>
      <el-menu-item v-for="sub in item.submenu" :index="`/${sub.table}/list`" :key="sub.id">{{ sub.name }}</el-menu-item>
    </el-submenu>

    <div class="right-bar">
      <el-button type="primary" class="reload" @click="reload">
        <i class="el-icon-information"></i> 刷新导航
      </el-button>

      <el-dropdown split-button class="logout" type="danger" @click="logout" @command="handleDropMenu">
        <i class="el-icon-circle-close"></i> {{ $store.state.admin.username }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="change_password">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
  <el-dialog title="修改密码" :visible.sync="dialogPassword">
    <change-password />
  </el-dialog>
</div>
</template>

<script>
import ChangePassword from 'components/ChangePassword.vue';
export default {
  data() {
    return {
      active: this.$route.path,
      dialogPassword: false,
    };
  },
  components: {
    ChangePassword,
  },
  computed: {
    super_admin() {
      return this.$store.state.admin.role === 'super';
    },
    list() {
      return this.$store.getters.navItem;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$message.success('已经退出登录');
          this.$router.replace('/login');
        });
    },
    reload() {
      this.$store.dispatch('reload')
        .then(() => {
          this.$message.success('导航已经刷新');
        });
    },
    handleDropMenu(name) {
      if(name === 'change_password') {
        this.dialogPassword = true;
      }
    },
  },
};
</script>

<style scoped>
.right-bar {
  position: absolute;
  top: 12px;
  right: 30px;
}
.logout {

}
.reload {
  margin-right: 5px;
}
</style>
