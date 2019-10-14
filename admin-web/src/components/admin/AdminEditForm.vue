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
      v-if="item.type !== 'ENUM' && (item.name !== primary || (item.name === primary && !create))"
      auto-complete="off"
      :disabled="item.name === primary" />
      <el-select v-if="item.type === 'ENUM'" v-model="editingData[item.name]" placeholder="">
        <el-option v-for="op in item.params" :value="op.value" :label="op.name" :key="op.value"></el-option>
      </el-select>
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
    props: [ 'type', 'schema', 'editingData', 'editingIndex', 'primary', 'create', 'exclude' ],
    computed: {
      rules() {
        const rule = {};
        for(const key in this.schema) {
          if(this.exclude.indexOf(key) === -1 && !this.schema[key].nullable && this.schema[key].default === null) {
            rule[key] = {};
            rule[key].required = true;
            rule[key].message = '请输入' + (this.schema[key].comment || this.schema[key].name);
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
          if(!valid) return false;
          const param = {
            data: this.editingData,
            index: this.editingIndex,
            primary: this.primary,
            table: this.table,
          };
          const method = this.create ? 'add_' + this.type : 'edit_' + this.type;
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