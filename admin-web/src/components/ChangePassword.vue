<template>
<el-form :model="passwords" :rules="rules" ref="passForm" label-width="100px">
  <el-form-item label="原密码" prop="old_password">
    <el-input type="password" v-model="passwords.old_password" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="passwords.password" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="passwords.checkPass" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
    <el-button @click="resetForm('passForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>

<script>
import { client } from '../store/client';
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwords.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      passwords: {
        old_password: '',
        password: '',
        checkPass: '',
      },
      rules: {
        old_password: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          client.post(undefined, '/admin/change_password', this.passwords)
            .then(() => {
              this.$message.success('密码修改成功');
            })
            .catch(err => {
              this.$message.error(err.msg || '密码修改失败');
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>