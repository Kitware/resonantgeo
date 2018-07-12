import cloneDeep from 'lodash-es/cloneDeep';
import find from 'lodash-es/find';

const statusMap = {
  INACTIVE: {
    value: 0,
    text: 'Inactive',
    icon: 'pause',
    color: 'grey lighten-2',
    textColor: 'grey darken-3',
    finished: false,
  },
  QUEUED: {
    value: 1,
    text: 'Queued',
    icon: 'more_horiz',
    color: 'amber darken-1',
    finished: false,
  },
  RUNNING: {
    value: 2,
    text: 'Running',
    icon: 'sync',
    color: 'deep-purple',
    finished: false,
  },
  SUCCESS: {
    value: 3,
    text: 'Success',
    icon: 'check',
    color: 'green',
    finished: true,
  },
  ERROR: {
    value: 4,
    text: 'Error',
    icon: 'error',
    color: 'red',
    finished: true,
  },
  CANCELED: {
    value: 5,
    text: 'Canceled',
    icon: 'close',
    color: 'grey darken-1',
    finished: true,
  },
  WORKER_FETCHING_INPUT: {
    value: 820,
    text: 'Fetching input',
    icon: 'cloud_download',
    color: 'cyan',
  },
  WORKER_CONVERTING_INPUT: {
    value: 821,
    text: 'Converting input',
    icon: 'shuffle',
    color: 'lime',
  },
  WORKER_CONVERTING_OUTPUT: {
    value: 822,
    text: 'Converting output',
    icon: 'shuffle',
    color: 'lime',
  },
  WORKER_PUSHING_OUTPUT: {
    value: 823,
    text: 'Pushing output',
    icon: 'cloud_upload',
    color: 'cyan',
  },
  WORKER_CANCELING: {
    value: 824,
    text: 'Canceling',
    icon: 'sync_disabled',
    color: 'orange',
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
