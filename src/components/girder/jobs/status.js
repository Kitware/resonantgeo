import cloneDeep from 'lodash-es/cloneDeep';
import find from 'lodash-es/find';

const statusMap = {
  INACTIVE: {
    value: 0,
    text: 'Inactive',
    icon: 'pause',
    color: 'grey lighten-1',
  },
  QUEUED: {
    value: 1,
    text: 'Queued',
    icon: 'more_horiz',
    color: 'yellow darken-2',
    indeterminate: true,
  },
  RUNNING: {
    value: 2,
    text: 'Running',
    icon: 'autorenew',
    color: 'light-blue',
    spin: true,
  },
  SUCCESS: {
    value: 3,
    text: 'Success',
    icon: 'check_circle',
    color: 'green',
  },
  ERROR: {
    value: 4,
    text: 'Error',
    icon: 'error',
    color: 'red',
  },
  CANCELED: {
    value: 5,
    text: 'Canceled',
    icon: 'cancel',
    color: 'grey darken-1',
  },
  WORKER_FETCHING_INPUT: {
    value: 820,
    text: 'Fetching input',
    icon: 'cloud_download',
    color: 'light-blue lighten-2',
    indeterminate: true,
  },
  WORKER_CONVERTING_INPUT: {
    value: 821,
    text: 'Converting input',
    icon: 'shuffle',
    color: 'lime',
    indeterminate: true,
  },
  WORKER_CONVERTING_OUTPUT: {
    value: 822,
    text: 'Converting output',
    icon: 'shuffle',
    color: 'lime',
    indeterminate: true,
  },
  WORKER_PUSHING_OUTPUT: {
    value: 823,
    text: 'Pushing output',
    icon: 'cloud_upload',
    color: 'light-blue lighten-2',
    indeterminate: true,
  },
  WORKER_CANCELING: {
    value: 824,
    text: 'Canceling',
    icon: 'warning',
    color: 'grey darken-1',
    indeterminate: true,
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
