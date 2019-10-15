<template>
<div>
<el-form size="small" :model="editingData" ref="editForm" label-position="top" label-width="40%" :rules="rules">
  <el-form-item
    v-for="item in schema" 
    v-if="item.name !== primary || (item.name === primary && !create)"
    :label="item.comment || item.name"
    :prop="item.name"
    :key="item.name">
    <el-input 
      v-model="editingData[item.name]"
      v-if="item.name !== primary || (item.name === primary && !create)"
      auto-complete="off"
      :disabled="item.name === primary"
    ></el-input>
  </el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
  <el-button @click="handleClose">取 消</el-button>
  <el-button type="primary" @click="handleEditSubmit('editForm')">确 定</el-button>
</div>
</div>
</template>

<script>
  export default {
    props: [ 'table', 'schema', 'editingData', 'editingIndex', 'primary', 'create' ],
    computed: {
      rules() {
        const rule = {};
        for(const key in this.schema) {
          if(!this.schema[key].nullable && this.schema[key].default === null) {
            rule[key] = {};
            rule[key].required = true;
            rule[key].message = '请输入' + (this.schema[key].comment || this.schema[key].name);
            rule.trigger = 'blur';
          }
        }
        return rule;
      },
    },
    methods: {
      handleClose() {
        this.$emit('done', false);
      },
      handleEditSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false;
          const param = {
            data: this.editingData,
            index: this.editingIndex,
            primary: this.primary,
            table: this.table,
          };
          const method = this.create ? 'add_row_info' : 'edit_row_info';
          this.$store.dispatch(method, param)
            .then(() => {
              this.$emit('done', true);
            })
            .catch((err) => {
              this.$emit('done', err.msg);
            });
        });
      },
    },
  };
</script>