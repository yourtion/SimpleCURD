import * as types from './mutation-types';

export default {
  [types.INIT](state, playload) {
    state.admin = playload.admin;
    state.projects = playload.projects;
  },
  [types.SAVE_ADMIN](state, playload) {
    if(playload.logout) {
      state.admin = {};
    } else {
      state.admin = playload;
    }
  },
  [types.SAVE_SCHEMAS](state, playload) {
    state.projects = playload;
  },
  [types.SAVE_USRES](state, playload) {
    state.users = playload;
  },
  [types.SAVE_LIST](state, playload) {
    state.listInfo.list = playload.list;
    state.listInfo.page_data = playload.page_data;
    if(playload._title) {
      state.title = playload._title;
    }
  },
  [types.CLEAN_LIST](state) {
    state.listInfo.list = [];
    state.listInfo.page_data = {};
    state.title = '';
  },
  [types.UPDATE_LIST](state, parmas) {
    const index = parmas.index;
    if (index !== undefined) {
      delete parmas.index;
      delete parmas.created_at;
      delete parmas.updated_at;
      Object.assign(state.listInfo.list[index], parmas);
    }
  },
  [types.DELETE_LIST](state, parmas) {
    const index = parmas.index;
    state.listInfo.list.splice(index, 1);
    state.listInfo.page_data.count -= 1;
  },
};
