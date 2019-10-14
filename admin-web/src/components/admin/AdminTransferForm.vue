<template>
<div>
<el-transfer v-model="pUser" :data="users" :button-texts="['取消授权', '添加授权']" :titles="['用户列表', '授权用户']"></el-transfer>
<br />
<div slot="footer" class="dialog-footer">
  <el-button @click="handleClose">取 消</el-button>
  <el-button type="primary" @click="handleEditSubmit()">确 定</el-button>
</div>
</div>
</template>

<script>
  export default {
    props: [ 'projectUser', 'users', 'projectId' ],
    data() {
      return {
        pUser: [],
        projectUserOrg: [],
      };
    },
    watch: {
      projectId() {
        this.pUser = [];
        this.projectUserOrg = [];
        for(const u of this.users) {
          if(this.projectUser.indexOf(u.label) !== -1) {
            this.pUser.push(u.key);
            this.projectUserOrg.push(u.key);
          }
        }
      },
    },
    methods: {
      handleClose() {
        this.$emit('done', false);
      },
      difference(a, b) {
        return a.filter(v => b.indexOf(v) === -1);
      },
      handleEditSubmit() {
        const deleted = this.difference(this.projectUserOrg, this.pUser);
        const added = this.difference(this.pUser, this.projectUserOrg);
        if(deleted.length < 1 && added.length < 1) {
          this.$emit('done', false);
        } else {
          const param = { project_id: this.projectId, deleted, added };
          this.$store.dispatch('update_project_role', param)
            .then(() => {
              this.$emit('done', true);
            })
            .catch((err) => {
              this.$emit('done', err.msg);
            });
        }
      },
    },
  };
</script>