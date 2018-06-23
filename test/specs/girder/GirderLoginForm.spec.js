import { mount } from '@vue/test-utils';
import GirderLoginForm from '@/components/girder/GirderLoginForm';

import { createGirderVue } from '../../session';
import { setInput } from '../../form';
import waitFor from '../../waitFor';

describe('GirderLoginForm.vue', () => {
  let localVue;
  let mock;
  let session;
  beforeEach(() => {
    localVue = createGirderVue();
    mock = localVue.prototype.$mock;
    session = localVue.prototype.$girder;
  });
  afterEach(() => {
    mock.restore();
    mock = null;
    session = null;
    localVue = null;
  });

  it('Form validation error', async () => {
    const wrapper = mount(GirderLoginForm, { localVue, sync: false });
    await wrapper.vm.$nextTick();

    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.vm.errors.count(), 'validation');

    expect(wrapper.vm.errors.collect()).to.eql({
      username: ['The username field is required.'],
      password: ['The password field is required.'],
    });
  });

  it('Successful submission', async () => {
    sinon.stub(session, '$login').returns({ data: {} });
    const wrapper = mount(GirderLoginForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="username"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
    ]);

    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.emitted().submit, 'login');
    session.$login.should.have.been.calledWith('user', 'password');
  });

  it('Bad user/password', async () => {
    sinon.stub(session, '$login').throws({ response: { status: 401 } });
    const wrapper = mount(GirderLoginForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="username"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
    ]);

    wrapper.find('form').trigger('submit');
    expect(wrapper.emitted()['update:error']).to.eql([['']]);
    await waitFor(() => wrapper.emitted()['update:error'].length > 1, 'error message');

    expect(wrapper.emitted('update:error')[1]).to.eql(['Login failed']);
  });

  it('Unknown error', async () => {
    sinon.stub(session, '$login').throws({ response: { status: 500 } });
    const wrapper = mount(GirderLoginForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="username"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
    ]);

    return wrapper.vm.login().then(() => {
      throw new Error('should throw');
    }, () => {
      expect(wrapper.emitted('update:error')[1]).to.eql(['Login failed']);
    });
  });
});
