import { mount } from '@vue/test-utils';

import GirderJobFilterForm from '@/components/girder/GirderJobFilterForm';
import * as status from '@/components/girder/jobs/status';

describe('GirderJobFilterForm.vue', () => {
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

  it('mount with job type list', () => {
    const wrapper = mount(GirderJobFilterForm, {
      propsData: {
        jobTypeList: ['type 1', 'type 2'],
      },
    });
    expect(wrapper.find({ name: 'v-select' }).vm.items)
      .to.eql(['type 1', 'type 2']);
  });

  it('mount with status list', () => {
    const wrapper = mount(GirderJobFilterForm, {
      propsData: {
        statusList: [0, 1, 2, 3],
      },
    });
    const statusSelect = wrapper.findAll({ name: 'v-select' }).at(1);
    expect(statusSelect.vm.items.map(s => s.value)).to.eql([0, 1, 2, 3]);
  });

  it('mount with custom status item', () => {
    status.register({
      CUSTOM_TEST_STATUS: {
        value: 999,
        text: '0Custom', // make it sort first
      },
    });

    const wrapper = mount(GirderJobFilterForm, {
      propsData: {
        statusList: [0, 1, 2, 999],
      },
    });
    const statusSelect = wrapper.findAll({ name: 'v-select' }).at(1);
    expect(statusSelect.vm.items.map(s => s.value)).to.eql([999, 0, 1, 2]);
  });

  it('mount with unknown status item', () => {
    const wrapper = mount(GirderJobFilterForm, {
      propsData: {
        statusList: [0, 1, 2, 998],
      },
    });
    const statusSelect = wrapper.findAll({ name: 'v-select' }).at(1);
    expect(statusSelect.vm.items.map(s => s.value)).to.eql([0, 1, 2]);
  });
});
