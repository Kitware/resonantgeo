import { mount } from '@vue/test-utils';
import GirderResetPasswordForm from '@/components/girder/GirderResetPasswordForm';

import { createGirderVue } from '../../session';
import { setInput } from '../../form';
import waitFor from '../../waitFor';

describe('GirderResetPasswordForm.vue', () => {
  let localVue;
  let mock;
  beforeEach(() => {
    localVue = createGirderVue();
    mock = localVue.prototype.$mock;
  });
  afterEach(() => {
    mock.restore();
    mock = null;
    localVue = null;
  });

  it('Form validation error', async () => {
    const wrapper = mount(GirderResetPasswordForm, { localVue, sync: false });
    await setInput(wrapper, 'input', 'not an email');
    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.vm.errors.count(), 'validation');
    expect(wrapper.vm.errors.count()).to.equal(1);
  });

  it('Successful submission', async () => {
    mock.onPut(/user\/password\/temporary/).reply(200);
    const wrapper = mount(GirderResetPasswordForm, { localVue, sync: false });
    await setInput(wrapper, 'input', 'example@email.com');
    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.emitted().submit, 'submission');
    expect(wrapper.vm.errors.count()).to.equal(0);
  });

  it('Unsuccessful submission', async () => {
    mock.onPut(/user\/password\/temporary/).reply(400, { message: 'That email is not registered.' });
    const wrapper = mount(GirderResetPasswordForm, { localVue, sync: false });
    await setInput(wrapper, 'input', 'example@email.com');
    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.emitted()['update:error']);
    expect(wrapper.emitted('update:error')[0]).to.eql(['That email is not registered.']);
  });
});
