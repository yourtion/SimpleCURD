<template>
<el-container>
  <el-header>
    <nav-bar />
  </el-header>
  <el-container>
    <el-main>
      <router-view class="contener"></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
import NavBar from 'components/NavBar.vue';
export default {
  components: {
    NavBar,
  },
};
</script>
<style scoped>
.contener{
  margin: 0 20px;
}
</style>
