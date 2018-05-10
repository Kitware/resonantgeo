import { mount } from '@vue/test-utils';

import SidePanelAction from '@/components/SidePanelAction';

describe('SidePanelAction.vue', () => {
  it('has correct height', () => {
    const wrapper = mount(SidePanelAction);
    expect(wrapper.element.style.height).to.equal('50px');
  });
  it('responds to color change', () => {
    const wrapper = mount(SidePanelAction, {
      propsData: {
        color: 'red',
      },
    });
    expect(wrapper.find({ name: 'v-btn' }).vm.color).to.equal('red');

    wrapper.setProps({ color: 'primary' });
    expect(wrapper.find({ name: 'v-btn' }).vm.color).to.equal('primary');
  });
  it('emits click event', () => {
    const wrapper = mount(SidePanelAction);
    wrapper.find({ name: 'v-btn' }).trigger('click');
    expect(wrapper.emitted('click').length).to.eql(1);
  });
});
