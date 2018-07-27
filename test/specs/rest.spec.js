import axios from 'axios';
import cookies from 'js-cookie';
import MockAdapter from 'axios-mock-adapter';

import { Session } from '@/rest';

const token = 'deadbeef';
const userResponse = {
  _id: '0',
  login: 'login',
  firstName: 'first',
  lastName: 'last',
  email: 'email@email.com',
  admin: false,
};

describe('rest.js', () => {
  let mock;
  beforeEach(() => {
    mock = new MockAdapter(axios);
    cookies.remove('girderToken');
  });
  afterEach(() => {
    mock.restore();
  });

  it('no initial cookie', async () => {
    mock.onGet(/user\/me/).reply(200, null);
    const session = new Session();
    expect(session.ready).to.equal(false);

    await session.$refresh();
    expect(session.ready).to.equal(true);
    expect(session.token).to.equal('');
  });

  it('user cookie', async () => {
    cookies.set('girderToken', token);
    mock.onGet(/user\/me/).reply(200, userResponse);

    const session = new Session();
    expect(session.ready).to.equal(false);
    expect(session.token).to.equal(token);

    await session.$refresh();
    expect(session.ready).to.equal(true);
    expect(session.user).to.eql(userResponse);
  });

  it('expired token', async () => {
    cookies.set('girderToken', token);
    mock.onGet(/user\/me/).reply(200, null);

    const session = new Session();
    await session.$refresh();
    expect(session.ready).to.equal(true);
    expect(session.user).to.equal(null);
    expect(session.token).to.equal('');
  });

  it('register', async () => {
    const expires = new Date(Date.now() + 1e9);
    const user = {
      login: 'login',
      firstName: 'first',
      lastName: 'last',
      email: 'email@email.com',
      authToken: {
        expires: expires.toISOString(),
        token,
      },
    };
    mock.onPost(/user$/).reply(201, user);

    const session = new Session();
    await session.$register(user.login, user.email, user.firstName, user.lastName, 'password');
    expect(session.user).to.eql(user);
    expect(session.token).to.equal(token);
    expect(cookies.get('girderToken')).to.equal(undefined);
  });

  it('register with a global session', async () => {
    const expires = new Date(Date.now() + 1e9);
    const user = {
      login: 'login',
      firstName: 'first',
      lastName: 'last',
      email: 'email@email.com',
      authToken: {
        expires: expires.toISOString(),
        token,
      },
    };
    mock.onPost(/user$/).reply(201, user);

    const session = new Session({ global: true });
    await session.$register(user.login, user.email, user.firstName, user.lastName, 'password');
    expect(cookies.get('girderToken')).to.equal(token);
  });

  it('login', async () => {
    const expires = new Date(Date.now() + 1e9);
    const user = {
      login: 'login',
      firstName: 'first',
      lastName: 'last',
      email: 'email@email.com',
    };
    const authToken = {
      expires: expires.toISOString(),
      token,
    };
    mock.onGet(/user\/authentication$/).reply(200, { user, authToken });

    const session = new Session();
    await session.$login(user.login, 'password');
    expect(session.user).to.eql(user);
    expect(session.token).to.equal(token);
    expect(cookies.get('girderToken')).to.equal(undefined);
  });

  it('login with a global session', async () => {
    const expires = new Date(Date.now() + 1e9);
    const user = {
      login: 'login',
      firstName: 'first',
      lastName: 'last',
      email: 'email@email.com',
    };
    const authToken = {
      expires: expires.toISOString(),
      token,
    };
    mock.onGet(/user\/authentication$/).reply(200, { user, authToken });

    const session = new Session({ global: true });
    await session.$login(user.login, 'password');
    expect(cookies.get('girderToken')).to.equal(token);
  });

  it('logout while not logged in', async () => {
    mock.onGet(/user\/me/).reply(200, null);
    const session = new Session();
    await session.$refresh();
    await session.$logout();
    expect(session.token).to.equal('');
  });

  it('logout current user', async () => {
    cookies.set('girderToken', token);
    mock.onGet(/user\/me/).reply(200, userResponse);
    mock.onDelete(/user\/authentication/).reply(200);
    const session = new Session();
    await session.$refresh();
    expect(session.token).to.equal(token);

    await session.$logout();
    expect(session.token).to.equal('');
  });

  it('logout with auth error', async () => {
    cookies.set('girderToken', token);
    mock.onGet(/user\/me/).reply(200, userResponse);
    mock.onDelete(/user\/authentication/).reply(401);
    const session = new Session();
    await session.$refresh();
    expect(session.token).to.equal(token);

    await session.$logout();
    expect(session.token).to.equal('');
  });

  it('logout with unknown error', async () => {
    cookies.set('girderToken', token);
    mock.onGet(/user\/me/).reply(200, userResponse);
    mock.onDelete(/user\/authentication/).reply(503);
    const session = new Session();
    await session.$refresh();
    expect(session.token).to.equal(token);
    let errored;

    try {
      await session.$logout();
    } catch (err) {
      errored = true;
    }
    expect(errored).to.equal(true);
    expect(session.token).to.equal('');
  });

  it('restart SSE bus on user events', async () => {
    const session = new Session({ global: true, enableSSE: true });
    sinon.stub(session.sse, 'connect');
    sinon.stub(session.sse, 'disconnect');

    const expires = new Date(Date.now() + 1e9);
    const authToken = {
      expires: expires.toISOString(),
      token,
    };
    const user = {
      login: 'login',
      firstName: 'first',
      lastName: 'last',
      email: 'email@email.com',
      authToken,
    };
    mock.onPost(/user$/).reply(201, user);
    mock.onGet(/user\/authentication$/).reply(200, { user, authToken });
    mock.onGet(/user\/me/).reply(200, userResponse);
    mock.onDelete(/user\/authentication/).reply(200);

    await session.$login(user.login, 'password');
    expect(session.sse.connect.callCount).to.equal(1);

    await session.$logout();
    expect(session.sse.disconnect.callCount).to.equal(1);

    await session.$refresh();
    expect(session.sse.connect.callCount).to.equal(2);

    await session.$register(user.login, user.email, user.firstName, user.lastName, 'password');
    expect(session.sse.connect.callCount).to.equal(3);
  });
});
