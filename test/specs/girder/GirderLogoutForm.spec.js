import { mount } from '@vue/test-utils';
import GirderLogoutForm from '@/components/girder/GirderLogoutForm';

import { createGirderVue } from '../../session';

describe('GirderLogoutForm.vue', () => {
  it('Form content as user', async () => {
    const localVue = createGirderVue();
    await localVue.prototype.$girder.$refresh();
    const wrapper = mount(GirderLogoutForm, { localVue });
    expect(wrapper.find('p').text()).to.equal('You are logged in as first last.');
  });

  it('Form content as anonymous', async () => {
    const localVue = createGirderVue(null);
    const wrapper = mount(GirderLogoutForm, { localVue });
    expect(wrapper.find('p').text()).to.equal('You are not logged in.');
  });

  it('Form submission', async () => {
    const localVue = createGirderVue();
    const session = localVue.prototype.$girder;
    await session.$refresh();
    sinon.stub(session, '$logout');
    const wrapper = mount(GirderLogoutForm, { localVue });
    wrapper.find('form').trigger('submit');
    session.$logout.should.have.been.called;
  });
});
