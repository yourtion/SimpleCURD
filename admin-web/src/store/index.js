import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import plugins from './plugins';
import * as getters from './getters';

Vue.use(Vuex);

const state = {
  admin: {},
  title: '',
  projects: [],
  users: [],
  listInfo: {
    info: {},
    page_data: {},
    list: [],
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  plugins,
  getters,
  strict: process.env.NODE_ENV !== 'production',
});
