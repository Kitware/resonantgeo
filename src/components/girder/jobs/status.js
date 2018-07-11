import cloneDeep from 'lodash-es/cloneDeep';
import find from 'lodash-es/find';

const statusMap = {
  INACTIVE: {
    value: 0,
    text: 'Inactive',
    icon: 'icon-pause',
    color: '#ccc',
    textColor: '#555',
    finished: false,
  },
  QUEUED: {
    value: 1,
    text: 'Queued',
    icon: 'icon-ellipsis',
    color: '#dbc345',
    finished: false,
  },
  RUNNING: {
    value: 2,
    text: 'Running',
    icon: 'icon-spin3 animate-spin',
    color: '#6666d5',
    finished: false,
  },
  SUCCESS: {
    value: 3,
    text: 'Success',
    icon: 'icon-ok',
    color: '#53b653',
    finished: true,
  },
  ERROR: {
    value: 4,
    text: 'Error',
    icon: 'icon-cancel',
    color: '#d44',
    finished: true,
  },
  CANCELED: {
    value: 5,
    text: 'Canceled',
    icon: 'icon-cancel',
    color: '#545',
    finished: true,
  },
  WORKER_FETCHING_INPUT: {
    value: 820,
    text: 'Fetching input',
    icon: 'icon-download',
    color: '#89d2e2',
  },
  WORKER_CONVERTING_INPUT: {
    value: 821,
    text: 'Converting input',
    icon: 'icon-shuffle',
    color: '#92f5b5',
  },
  WORKER_CONVERTING_OUTPUT: {
    value: 822,
    text: 'Converting output',
    icon: 'icon-shuffle',
    color: '#92f5b5',
  },
  WORKER_PUSHING_OUTPUT: {
    value: 823,
    text: 'Pushing output',
    icon: 'icon-upload',
    color: '#89d2e2',
  },
  WORKER_CANCELING: {
    value: 824,
    text: 'Canceling',
    icon: 'icon-spin3 animate-spin',
    color: '#f89406',
  },
};

function all() {
  return cloneDeep(statusMap);
}

function get(statusName) {
  return Object.assign({}, statusMap[statusName]);
}

function getByValue(value) {
  return Object.assign({}, find(statusMap, { value }));
}

function register(status = {}) {
  Object.assign(statusMap, status);
}

export {
  all,
  get,
  getByValue,
  register,
};
