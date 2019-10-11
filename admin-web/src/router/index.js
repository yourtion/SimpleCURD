import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from 'views/Home.vue';
import ListView from 'views/ListView.vue';

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home',
  }, {
    path: '/login',
    meta: {
      auth: false,
    },
    component: (resolve) => require([ 'views/Login.vue' ], resolve),
  }, {
    path: '/home',
    component: Home,
    children: [{
      path: '',
      component: (resolve) => require([ 'components/Index.vue' ], resolve),
    }, {
      path: '/:list_type/list',
      component: ListView,
      // children: genRouter(listRouters),
    }, {
      path: '/admin/:type',
      component: (resolve) => require([ 'views/AdminView.vue' ], resolve),
      children: [{
        path: '/admin/users',
        name: 'admin_users',
        component: (resolve) => require([ 'components/admin/UserList.vue' ], resolve),
      }, {
        path: '/admin/projects',
        name: 'admin_projects',
        component: (resolve) => require([ 'components/admin/ProjectList.vue' ], resolve),
      }, {
        path: '/admin/tables',
        name: 'admin_tables',
        component: (resolve) => require([ 'components/admin/TableList.vue' ], resolve),
      }],
    }],
  }],
});
