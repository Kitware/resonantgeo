import axios_ from 'axios';
import cookies from 'js-cookie';
import { stringify } from 'qs';

function setCookieFromAuth(auth) {
  const expires = new Date(auth.expires);
  cookies.set('girderToken', auth.token, { expires });
}

const mixin = {
  async $login(username, password) {
    try {
      await this.$logout();
    } catch (err) {
      // noop
    }

    const resp = await this.get('user/authentication', {
      headers: {
        'Girder-Authorization': `Basic ${window.btoa(`${username}:${password}`)}`,
        'Girder-Token': null,
      },
    });
    this.token = resp.data.authToken.token;
    this.user = resp.data.user;

    // for CORS, maybe this should be off by default?
    setCookieFromAuth(resp.data.authToken);
    return resp;
  },
  async $logout() {
    if (!this.token) {
      return;
    }
    try {
      await this.delete('user/authentication');
    } catch (err) {
      if (err.response.status !== 401) {
        throw err;
      }
    } finally {
      this.token = '';
      this.user = null;
      cookies.remove('girderToken');
    }
  },
  async $refresh() {
    const resp = await this.get('user/me');
    this.user = resp.data;
    if (this.user === null) {
      this.token = '';
    }
    this.ready = true;
    return this.user;
  },
  async $register(login, email, firstName, lastName, password, admin = false) {
    const params = {
      login, email, firstName, lastName, password, admin,
    };
    const resp = await this.post('user', stringify(params));
    this.token = resp.data.authToken.token;
    this.user = resp.data;
    setCookieFromAuth(resp.data.authToken);
    return resp;
  },
  user: null,
  token: '',
  apiRoot: '/api/v1',
  ready: false,
};

function Session({ apiRoot = '/api/v1', token = cookies.get('girderToken'), axios = axios_.create() } = {}) {
  const instance = Object.assign(
    this,
    axios,
    mixin,
    { token, apiRoot },
  );

  instance.interceptors.request.use((config) => {
    const headers = Object.assign({
      'Girder-Token': instance.token,
    }, config.headers);
    return Object.assign({}, config, {
      baseURL: instance.apiRoot,
      headers,
    });
  });
  return instance;
}

export {
  mixin,
  Session,
};
