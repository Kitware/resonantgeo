import { mount } from '@vue/test-utils';
import constant from 'lodash-es/constant';
import times from 'lodash-es/times';

import GirderJobTable from '@/components/girder/GirderJobTable';

const job = {
  title: 'job',
  type: 'type',
  updated: '2000-01-01T05:00:00.000',
  status: 3,
};

describe('GirderJobTable.vue', () => {
  let app;

  // Fixes warning with certain vuetify components
  // https://forum.vuejs.org/t/vuetify-data-app-true-and-problems-rendering-v-dialog-in-unit-tests/27495/2
  beforeEach(() => {
    app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.appendChild(app);
  });
  afterEach(() => {
    document.body.removeChild(app);
  });

  it('mount with no data', () => {
    const wrapper = mount(GirderJobTable, {
      propsData: {
        jobs: [],
        pagination: {},
      },
    });
    expect(wrapper.find('tbody').text()).to.equal('No data available');
  });

  it('mount with one job', () => {
    const wrapper = mount(GirderJobTable, {
      propsData: {
        jobs: [job],
        pagination: {
          page: 1,
          rowsPerPage: 10,
        },
        morePages: false,
      },
    });
    expect(wrapper.vm.pageRange).to.eql({
      first: 1,
      last: 1,
    });
    expect(wrapper.vm.totalItems).to.equal(1);
  });

  it('mount with pagination', () => {
    const wrapper = mount(GirderJobTable, {
      propsData: {
        jobs: times(10, constant(job)),
        pagination: {
          page: 2,
          rowsPerPage: 10,
        },
        morePages: true,
      },
    });
    expect(wrapper.vm.pageRange).to.eql({
      first: 11,
      last: 20,
    });
    expect(wrapper.vm.totalItems).to.equal(21);
  });
});
