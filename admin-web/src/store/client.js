import axios from 'axios';
import { SAVE_ADMIN } from './mutation-types';

const http = axios.create({
  // withCredentials: true,
});

class Client {

  _request(commit, url, method, params, data) {
    const headers = {};
    return http.request({
      baseURL: 'api',
      method, url, params, data, headers,
    }).then((res) => {
      const json = res.data;
      if (json.error_code === -1006 && commit) commit(SAVE_ADMIN, { logout: true });
      if (json.success !== true) {
        return Promise.reject({ msg: json.msg || json.message });
      }
      return json.result || json;
    });
  }

  get(commit, url, params = {}) {
    return this._request(commit, url, 'get', params, {});
  }

  post(commit, url, data = {}) {
    return this._request(commit, url, 'post', {}, data);
  }

  delete(commit, url, params = {}) {
    return this._request(commit, url, 'delete', params, {});
  }

  put(commit, url, params = {}) {
    return this._request(commit, url, 'put', {}, params);
  }
}

export const client = new Client();
