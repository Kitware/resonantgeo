import axios from 'axios';
import cookies from 'js-cookie';
import { createLocalVue } from '@vue/test-utils';
import MockAdapter from 'axios-mock-adapter';
import VeeValidate from 'vee-validate';

import { Session } from '@/rest';

const defaultUser = {
  _id: '0',
  login: 'login',
  firstName: 'first',
  lastName: 'last',
  email: 'email@email.com',
  admin: false,
};
const token = 'deadbeef';

function createMockSession(user = defaultUser) {
  if (user) {
    cookies.set('girderToken', token);
  } else {
    cookies.remove('girderToken');
  }
  const instance = axios.create();
  const mock = new MockAdapter(instance);
  mock.onGet(/user\/me/).reply(200, user || null);
  mock.onDelete(/user\/authentication/).reply(200);

  const session = new Session({ axios: instance });
  return { mock, session };
}

function createGirderVue(user = defaultUser) {
  const { mock, session } = createMockSession(user);
  const localVue = createLocalVue();
  localVue.prototype.$girder = session;
  localVue.prototype.$mock = mock;
  localVue.use(VeeValidate);
  return localVue;
}

export {
  createGirderVue,
  createMockSession,
};
