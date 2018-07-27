import axios_ from 'axios';
import cookies from 'js-cookie';
import { stringify } from 'qs';

import SSEBus from './sse';

function setCookieFromAuth(auth) {
  const expires = new Date(auth.expires);
  cookies.set('girderToken', auth.token, { expires });
}

function startSSEBus(session) {
  if (session.enableSSE && session.user) {
    session.sse.connect();
  }
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
    if (this.global) {
      setCookieFromAuth(resp.data.authToken);
    }
    startSSEBus(this);
    return resp;
  },
  async $logout() {
    if (!this.token) {
      return;
    }
    this.sse.disconnect();
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
    startSSEBus(this);
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
    if (this.global) {
      setCookieFromAuth(resp.data.authToken);
    }
    startSSEBus(this);
    return resp;
  },
  user: null,
  token: '',
  apiRoot: '/api/v1',
  ready: false,
};

function Session({
  apiRoot = '/api/v1',
  token = cookies.get('girderToken'),
  axios = axios_.create(),
  enableSSE = false,
  sseOptions = {},
  global = false,
} = {}) {
  Object.assign(
    this,
    axios,
    mixin,
    {
      token,
      apiRoot,
      enableSSE,
      global,
    },
  );

  this.sse = new SSEBus(this, {
    useEventSource: global,
    ...sseOptions,
  });
  axios.interceptors.request.use((config) => {
    const headers = {
      'Girder-Token': this.token,
      ...config.headers,
    };
    return {
      ...config,
      baseURL: this.apiRoot,
      headers,
    };
  });
}

export {
  mixin,
  Session,
};
