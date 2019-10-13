<template>
  <div>
    <h2>{{ title }}（{{ total }}）</h2>
    <router-view :loading="loading" :listData="listData" @orderChange="handleOrder" @reload="handleReload"></router-view>
    <br>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageOptions.page"
      :page-size="pageOptions.page_count"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    </div>
</template>
<script>
  export default {
    created() {
      this.fetchData();
    },
    watch: {
      '$route'(to) {
        this.loading = false;
        this.$store.dispatch('clean_list');
        this.type = to.name;
        this.pageOptions = { page: 1, page_count: 12 };
        this.fetchData();
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        isCreate: false,
        type: this.$route.name,
        pageOptions: {
          page: 1,
          page_count: 12,
        },
        loading: false,
      };
    },
    computed: {
      title() {
        return this.$store.state.title || '管理系统';
      },
      total() {
        return this.$store.state.listInfo.page_data.count || 0;
      },
      listData() {
        return this.$store.state.listInfo.list;
      },
    },
    methods: {
      fetchData() {
        if(this.loading === true) return;
        this.loading = true;
        this.$store.dispatch(this.type, this.pageOptions)
          .then(() => { this.loading = false; })
          .catch((err) => {
            this.loading = false;
            this.$message.error(err.msg || '请求失败');
          });
      },
      goBack() {
        this.$router.go(-1);
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
    },
  };
</script>
<style scoped>
.menu-right {
  float: right;
}
</style>
