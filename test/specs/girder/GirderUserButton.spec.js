import { mount } from '@vue/test-utils';
import GirderUserButton from '@/components/girder/GirderUserButton';

import { createGirderVue } from '../../session';

describe('GirderUserButton.vue', () => {
  it('Button content as user', async () => {
    const localVue = createGirderVue();
    const wrapper = mount(GirderUserButton, { localVue });
    await localVue.prototype.$girder.$refresh();

    expect(wrapper.find('span').text()).to.equal('FL');
  });

  it('Button content as anonymous', () => {
    const localVue = createGirderVue(null);
    const wrapper = mount(GirderUserButton, { localVue });
    expect(wrapper.find('span').text()).to.equal('Login');
  });

  it('Click login', () => {
    const localVue = createGirderVue(null);
    const wrapper = mount(GirderUserButton, { localVue });
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted('login')).to.eql([[]]);
  });

  it('Click user', async () => {
    const localVue = createGirderVue();
    await localVue.prototype.$girder.$refresh();
    const wrapper = mount(GirderUserButton, { localVue });
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted('user')).to.eql([[wrapper.vm.$girder.user]]);
  });
});
