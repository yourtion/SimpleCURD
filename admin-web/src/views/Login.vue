<template lang="html">
  <div class="content" v-loading="loginLoading" element-loading-text="登录中">
  <el-row :gutter="20">
    <el-col :span="6" :offset="9">
      <div class="grid-content bg-purple login">
        <h2 class="title">欢迎使用数据管理平台</h2>
        <el-form :model="credentials" :rules="rules" ref="credentials" label-width="100px" labelPosition="left">
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="credentials.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="credentials.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('credentials')" :loading="loginLoading">提交</el-button>
            <el-button @click="handleReset('credentials')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        credentials: {
          username: '',
          password: '',
        },
        loginLoading: false,
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'change',
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'change',
          }],
        },
      };
    },
    methods: {
      handleReset() {
        this.$refs.credentials.resetFields();
      },

      handleSubmit() {
        this.$refs.credentials.validate((valid) => {
          if (valid) {
            this.loginLoading = true;
            return this.$store.dispatch('login', this.credentials)
              .then(() => {
                this.loginLoading = false;
                let url = '/home';
                const nav = this.$store.getters.navItem;
                if(nav && nav[0] && nav[0].submenu && nav[0].submenu[0]) {
                  url = `/${ nav[0].submenu[0].table }/list`;
                }
                this.$router.replace({
                  path: url,
                });
              }).catch(err => {
                this.$message.error(err.message || '登录失败');
                this.loginLoading = false;
              });
          }
          return false;
        });
      },
    },
};

</script>
<style scoped>
.content {
  margin:0;
  width:100%;
  height:100%;
  background: url(../assets/login_bg.jpg) no-repeat center;
  background-size: cover;
}
.title {
  color: #666;
}
.login {
  width: 360px;
  height: 260px;
  overflow: hidden;
  margin: 180px auto 30px;
  background: #fffaf6;
  padding: 25px;
  position: relative;
  border-radius: 4px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.2), 0 1px 5px rgba(0,0,0,0.2), 0 0 0 12px rgba(255,255,255,0.4)
}
</style>
