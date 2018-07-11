import { mount } from '@vue/test-utils';
import constant from 'lodash-es/constant';
import times from 'lodash-es/times';

import GirderJobList from '@/components/girder/GirderJobList';
import { createGirderVue } from '../../session';

const job = {
  title: 'job',
  type: 'type',
  updated: '2000-01-01T05:00:00.000',
  status: 3,
};

describe('GirderJobList.vue', () => {
  let app;
  let localVue;
  let mock;

  async function waitForResponses(wrapper) {
    await Promise.all([ /* eslint-disable no-underscore-dangle */
      wrapper.vm._async_computed$jobs,
      wrapper.vm._async_computed$typeAndStatusList,
      wrapper.vm.$nextTick(),
    ]);
  }

  async function mountAndWait(options = {}) {
    const wrapper = mount(GirderJobList, Object.assign({
      localVue,
    }, options));
    await waitForResponses(wrapper);
    return wrapper;
  }

  beforeEach(() => {
    app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.appendChild(app);
    localVue = createGirderVue();
    mock = localVue.prototype.$mock;
  });
  afterEach(() => {
    document.body.removeChild(app);
    mock = null;
    localVue = null;
  });

  it('mount with no jobs', async () => {
    mock.onGet(/job[^/]/).reply(200, []);
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [],
      types: [],
    });

    const wrapper = await mountAndWait(GirderJobList);
    expect(wrapper.vm.jobs).to.eql([]);
    expect(wrapper.vm.morePages).to.equal(false);
    expect(wrapper.vm.typeAndStatusList).to.eql({
      statuses: [],
      types: [],
    });
  });

  it('mount with one job', async () => {
    mock.onGet(/job[^/]/).reply(200, [job]);
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });

    const wrapper = await mountAndWait(GirderJobList);
    expect(wrapper.vm.jobs).to.eql([job]);
    expect(wrapper.vm.morePages).to.equal(false);
    expect(wrapper.vm.typeAndStatusList).to.eql({
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });
  });

  it('mount with pagination', async () => {
    mock.onGet(/job[^/]/).reply(200, times(11, constant(job)));
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });

    const wrapper = await mountAndWait(GirderJobList);
    wrapper.vm.pagination.rowsPerPage = 10;
    expect(wrapper.vm.jobs.length).to.equal(10);
    expect(wrapper.vm.morePages).to.equal(true);
  });

  it('responds to filter changes', async () => {
    mock.onGet(/job[^/]/).reply(200, times(11, constant(job)));
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });

    const wrapper = await mountAndWait(GirderJobList);

    wrapper.vm.pagination.page = 2;
    await waitForResponses(wrapper);

    mock.resetHistory();
    wrapper.vm.jobFilter = {
      status: 0,
      jobType: 'type 1',
    };
    await waitForResponses(wrapper);

    expect(mock.history.get.length).to.equal(1);
    expect(mock.history.get[0].url).to.match(/statuses=%5B0%5D/);
    expect(mock.history.get[0].url).to.match(/types=%5B%22type%201%22%5D/);
    expect(wrapper.vm.pagination.page).to.equal(1);
  });

  it('responds to pagination changes', async () => {
    mock.onGet(/job[^/]/).reply(200, times(11, constant(job)));
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });

    const wrapper = await mountAndWait(GirderJobList);

    mock.resetHistory();
    wrapper.vm.pagination = {
      rowsPerPage: 10,
      page: 3,
      sortBy: 'title',
      descending: false,
    };
    await waitForResponses(wrapper);

    expect(mock.history.get.length).to.equal(1);
    expect(mock.history.get[0].url).to.match(/limit=11/);
    expect(mock.history.get[0].url).to.match(/offset=20/);
    expect(mock.history.get[0].url).to.match(/sort.*title/);
    expect(mock.history.get[0].url).to.match(/sortdir=1/);
  });

  it('default sort order', async () => {
    mock.onGet(/job[^/]/).reply(200, times(11, constant(job)));
    mock.onGet(/typeandstatus$/).reply(200, {
      statuses: [0, 1],
      types: ['type 1', 'type 2'],
    });

    const wrapper = await mountAndWait(GirderJobList);

    mock.resetHistory();
    wrapper.vm.pagination = {
      rowsPerPage: 10,
      page: 3,
    };
    await waitForResponses(wrapper);

    expect(mock.history.get.length).to.equal(1);
    expect(mock.history.get[0].url).to.not.match(/sort/);
  });
});
