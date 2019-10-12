import * as types from './mutation-types';
import { client } from './client';

export default {
  clean_list({ commit }) {
    commit(types.CLEAN_LIST);
  },

  login({ commit }, params) {
    return client.post(commit, '/admin/login', params)
      .then((data) => {
        if (data.user) {
          commit(types.SAVE_SCHEMAS, data.projects);
          return commit(types.SAVE_ADMIN, {
            username: data.user,
            name: data.nickname,
            role: data.role,
            isLogin: true,
          });
        }
      });
  },

  logout({ commit }) {
    return client.get(commit, '/admin/logout')
      .then(() => {
        return commit(types.SAVE_ADMIN, { logout: true });
      });
  },

  reload({ commit }, delay = 0) {
    setTimeout(() => {
      client.get(commit, '/scheams')
        .then((data) => {
          return commit(types.SAVE_SCHEMAS, data);
        });
    }, delay);
  },

  fetch_users({ commit }) {
    return client.get(commit, '/admins/simple')
      .then((res) => {
        commit(types.SAVE_USRES, res);
      });
  },

  schema_list({ commit }, options = {}) {
    return client.get(commit, '/schema/list', options)
      .then((res) => {
        commit(types.SAVE_LIST, res);
      });
  },

  add_row_info({ commit }, params) {
    const url = `/scheam/` + params.table;
    const query = {
      data: params.data,
    };
    return client.post(commit, url, query);
  },

  edit_row_info({ commit }, params) {
    const url = `/scheam/` + params.table;
    const query = {
      index: params.index,
      data: params.data,
      primary: params.primary,
    };
    return client.put(commit, url, query)
      .then(() => {
        query.data.index = query.index;
        return commit(types.UPDATE_LIST, query.data);
      });
  },

  delete_row_info({ commit }, params) {
    const url = `/scheam/` + params.table;
    const query = {
      index: params.index,
      id: params.id,
      primary: params.primary,
    };
    return client.delete(commit, url, query)
      .then(() => {
        return commit(types.DELETE_LIST, query);
      });
  },

  admin_users({ commit }) {
    return client.get(commit, '/admins')
      .then((data) => {
        data._title = '用户管理';
        return commit(types.SAVE_LIST, data);
      });
  },

  add_admin_users({ commit }, params) {
    return client.post(commit, '/admin/add', params.data);
  },

  edit_admin_users({ commit }, params) {
    return client.put(commit, '/admin/edit', params.data);
  },

  delete_admin_users({ commit }, params) {
    return client.delete(commit, '/admin/delete', params)
      .then(() => {
        return commit(types.DELETE_LIST, params);
      });
  },

  admin_tables({ commit }, params) {
    return client.get(commit, '/tables', params)
      .then((data) => {
        data._title = '数据表管理';
        return commit(types.SAVE_LIST, data);
      });
  },

  add_table({ commit }, params) {
    return client.post(commit, '/table', params.data);
  },

  edit_table({ commit }, params) {
    return client.put(commit, '/table', params.data);
  },

  delete_table({ commit }, params) {
    return client.delete(commit, '/table', params)
      .then(() => {
        return commit(types.DELETE_LIST, params);
      });
  },

  admin_projects({ commit }, params) {
    return client.get(commit, '/projects', params)
      .then((data) => {
        data._title = '项目管理';
        return commit(types.SAVE_LIST, data);
      });
  },

  add_project({ commit }, params) {
    return client.post(commit, '/project', params.data);
  },

  edit_project({ commit }, params) {
    return client.put(commit, '/project', params.data);
  },

  delete_project({ commit }, params) {
    return client.delete(commit, '/project', params)
      .then(() => {
        return commit(types.DELETE_LIST, params);
      });
  },

  update_project_role({ commit }, params) {
    return client.post(commit, '/project/role', params);
  },
};
