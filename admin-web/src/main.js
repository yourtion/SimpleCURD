// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';

import App from './App.vue';
import * as Filter from './filters';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.filter('formatDate', Filter.formatDate);

Vue.use(VueRouter);
Vue.use(ElementUI);

router.beforeEach(({
  meta,
  path,
}, from, next) => {
  const {
    auth = true,
  } = meta;
  // true用户已登录， false用户未登录
  const isLogin = Boolean(store.state.admin.username);
  if (auth && !isLogin && path !== '/login') {
    return next({ path: '/login' });
  }
  next();
});

/* eslint-disable no-new */
// 实例化我们的Vue
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>',
}).$mount('#app');
