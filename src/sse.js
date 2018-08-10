import Vue from 'vue';
import wrap from 'wrapple';

const eventSource = Symbol('eventSource');
const onMessage = Symbol('onMessage');
const onError = Symbol('onError');
const emitMessage = Symbol('emitMessage');
const poller = Symbol('poller');

wrap('EventSource');

// Fall back to polling on error.  This could be made more sophisticated by
// distinguishing temporary failures, using exponential back-off, etc.
function errorHandler() {
  this.disconnect();
  this.options.useEventSource = false;
  this.connect();
}

function messageHandler(evt) {
  let data;
  try {
    data = JSON.parse(evt.data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Invalid JSON from SSE stream: ${evt.data}, ${err}`);
    return;
  }
  this[emitMessage](data);
}

function messageEmitter(notification) {
  if (notification.updated) {
    const updated = new Date(notification.updated);
    this.since = new Date(Math.max(+this.since, +updated));
  }
  this.$emit('message', notification, this);
  this.$emit(`message:${notification.type}`, notification, this);
}

class SSEBus extends Vue {
  constructor(session, options = {}) {
    super();
    this[onError] = errorHandler.bind(this);
    this[onMessage] = messageHandler.bind(this);
    this[emitMessage] = messageEmitter.bind(this);
    this.session = session;
    this.options = Object.assign({
      pollingInterval: 5000,
      withCredentials: true,
      useEventSource: false,
    }, options);
    this.since = options.startTime || new Date();
  }

  get connected() {
    return !!this[eventSource] || !!this[poller];
  }

  connect() {
    if (this.connected) {
      return;
    }

    const EventSource = wrap('EventSource');
    if (!(this.options.useEventSource && EventSource)) {
      this.startPolling();
      return;
    }

    const since = Math.ceil(+this.since / 1000);
    const url = `${this.session.apiRoot}/notification/stream?since=${since}`;
    this[eventSource] = new EventSource(url, {
      withCredentials: this.options.withCredentials,
    });
    this[eventSource].onmessage = this[onMessage];
    this[eventSource].onerror = this[onError];
    this.$emit('start', this);
  }

  disconnect() {
    this.stopPolling();
    if (!this[eventSource]) {
      return;
    }
    this.url = null;
    this[eventSource].close();
    this[eventSource] = null;
    this.$emit('stop', this);
  }

  startPolling() {
    async function pollNotifications() {
      this[poller] = setTimeout(async () => {
        try {
          const resp = await this.session.get(`/notification?since=${this.since.toISOString()}`);
          resp.data.forEach(this[emitMessage]);
        } finally {
          pollNotifications.call(this);
        }
      }, this.options.pollingInterval);
    }

    this.stopPolling();
    pollNotifications.call(this);
  }

  stopPolling() {
    if (this[poller] !== undefined) {
      clearTimeout(this[poller]);
    }
    delete this[poller];
  }
}

export default SSEBus;

// expose private symbols for testing
export {
  eventSource,
  onMessage,
  onError,
  emitMessage,
  poller,
};
