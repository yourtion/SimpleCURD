import { KEY_ADMIN, KEY_SCHEMAS, SAVE_ADMIN, SAVE_SCHEMAS, INIT } from './mutation-types';

const localStoragePlugin = store => {
  
  const admin = JSON.parse(window.localStorage.getItem(KEY_ADMIN)) || {};
  const projects = JSON.parse(window.localStorage.getItem(KEY_SCHEMAS)) || {};
  store.commit(INIT, { admin, projects });

  store.subscribe((mutation, state) => {
    if(mutation.type === SAVE_ADMIN) {
      if(state.logout) {
        window.localStorage.removeItem(KEY_ADMIN);
      } else {
        window.localStorage.setItem(KEY_ADMIN, JSON.stringify(mutation.payload));
      }
    }
    if(mutation.type === SAVE_SCHEMAS) {
      if(!mutation.payload) return window.localStorage.removeItem(KEY_SCHEMAS);
      window.localStorage.setItem(KEY_SCHEMAS, JSON.stringify(mutation.payload));
    }
  });
};

export default [ localStoragePlugin ];
