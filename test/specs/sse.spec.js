import wrap from 'wrapple';

import SSEBus, * as symbols from '@/sse';

import { createMockSession } from '../session';

function waitsFor(func, msg) {
  const start = new Date();
  return new Promise((resolve, reject) => {
    const interval = window.setInterval(() => {
      const response = func();
      if (response) {
        clearInterval(interval);
        resolve(response);
      } else if ((new Date() - start) > 500) {
        clearInterval(interval);
        reject(new Error(msg));
      }
    }, 20);
  });
}

describe('sse.js', () => {
  let session;
  let mock;
  beforeEach(() => {
    ({ mock, session } = createMockSession());
  });
  afterEach(() => {
    wrap.reset();
    mock.restore();
    mock = null;
    session = null;
  });

  it('connect via eventsource', () => {
    mock.onGet(/\/notification.*/).reply(200, []);
    const started = sinon.stub();
    const stopped = sinon.stub();
    const sse = new SSEBus(session, {
      useEventSource: true,
    });
    sse.$on('start', started);
    sse.$on('stop', stopped);
    expect(sse.connected).to.equal(false);

    sse.connect();
    expect(sse.connected).to.equal(true);
    started.should.have.been.calledOnce;
    expect(sse[symbols.eventSource]).to.be.ok;

    sse.connect();
    started.should.have.been.calledOnce;

    sse.disconnect();
    expect(sse.connected).to.equal(false);
    stopped.should.have.been.calledOnce;
    expect(sse[symbols.eventSource]).not.to.be.ok;
  });

  it('connect via polling', () => {
    mock.onGet(/\/notification.*/).reply(200, []);
    const sse = new SSEBus(session, {
      useEventSource: false,
    });
    expect(sse.connected).to.equal(false);

    sse.connect();
    expect(sse.connected).to.equal(true);
    expect(sse[symbols.poller]).not.to.be.undefined;

    sse.disconnect();
    expect(sse.connected).to.equal(false);
    expect(sse[symbols.poller]).to.be.undefined;
  });

  it('poller messages', async () => {
    const genericMessage = sinon.stub();
    const typedMessage = sinon.stub();
    const notification = {
      type: 'test',
      updated: new Date(),
    };
    mock.onGet(/\/notification.*/).reply(200, [notification]);
    const sse = new SSEBus(session, {
      useEventSource: false,
      pollingInterval: 10,
    });
    sse.$on('message', genericMessage);
    sse.$on('message:test', typedMessage);

    sse.connect();
    try {
      await waitsFor(() => {
        if (genericMessage.called && typedMessage.called) {
          expect(+sse.since).to.be.closeTo(+notification.updated, 10);
          return true;
        }
        return false;
      }, 'Message not emitted');
    } finally {
      sse.disconnect();
    }
  });

  it('event stream messages', () => { /* eslint-disable no-console */
    wrap('EventSource');
    const message = sinon.stub();
    const notification = {
      type: 'test',
      updated: new Date(),
    };
    const event = { close: sinon.stub() };
    const eventSource = sinon.stub().returns(event);
    sinon.stub(wrap, 'EventSource').returns(eventSource);
    const sse = new SSEBus(session, {
      useEventSource: true,
    });
    sse.$on('message', message);

    sse.connect();
    eventSource.should.have.been.calledOnce;

    // message with a date
    event.onmessage({ data: JSON.stringify(notification) });
    message.should.have.been.calledOnce;
    expect(+sse.since).to.be.closeTo(+notification.updated, 10);

    // message without a date
    event.onmessage({ data: JSON.stringify({ type: 'test' }) });
    message.should.have.been.calledTwice;
    expect(+sse.since).to.be.closeTo(+notification.updated, 10);

    // an invalid message
    sinon.stub(console, 'error');
    event.onmessage({ data: 'invalid' });
    message.should.have.been.calledTwice;
    console.error.should.have.been.calledOnce;
    console.error.restore();

    sse.disconnect();
  });

  it('event stream errors', () => {
    wrap('EventSource');
    const event = { close: sinon.stub() };
    const eventSource = sinon.stub().returns(event);
    sinon.stub(wrap, 'EventSource').returns(eventSource);
    const sse = new SSEBus(session, {
      useEventSource: true,
    });
    sse.connect();

    sinon.spy(sse, 'disconnect');
    event.onerror('error message');
    sse.disconnect.should.have.been.calledOnce;
    expect(sse.options.useEventSource).to.equal(false);

    sse.disconnect();
  });
});
