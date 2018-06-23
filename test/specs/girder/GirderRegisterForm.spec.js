import { mount } from '@vue/test-utils';
import GirderRegisterForm from '@/components/girder/GirderRegisterForm';

import { createGirderVue } from '../../session';
import { setInput } from '../../form';
import waitFor from '../../waitFor';

describe('GirderRegisterForm.vue', () => {
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
    const wrapper = mount(GirderRegisterForm, { localVue, sync: false });
    await wrapper.vm.$nextTick();

    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.vm.errors.count(), 'validation');

    expect(wrapper.vm.errors.collect()).to.eql({
      login: ['The login field is required.'],
      email: ['The email field is required.'],
      'first name': ['The first name field is required.'],
      'last name': ['The last name field is required.'],
      password: ['The password field is required.'],
    });
  });

  it('Successful submission', async () => {
    sinon.stub(session, '$register').returns({ data: {} });
    const wrapper = mount(GirderRegisterForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="login"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="email"]', 'example@email.com'),
      setInput(wrapper, 'input[data-vv-name="first name"]', 'first'),
      setInput(wrapper, 'input[data-vv-name="last name"]', 'last'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
      setInput(wrapper, 'input[data-vv-name="confirmPassword"]', 'password'),
    ]);

    wrapper.find('form').trigger('submit');
    await waitFor(() => wrapper.emitted().submit, 'registration');
    session.$register.should.have.been.calledWith('user', 'example@email.com', 'first', 'last', 'password');
  });

  it('Server error', async () => {
    const response = {
      data: { message: 'message' },
    };
    sinon.stub(session, '$register').throws({ response });
    const wrapper = mount(GirderRegisterForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="login"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="email"]', 'example@email.com'),
      setInput(wrapper, 'input[data-vv-name="first name"]', 'first'),
      setInput(wrapper, 'input[data-vv-name="last name"]', 'last'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
      setInput(wrapper, 'input[data-vv-name="confirmPassword"]', 'password'),
    ]);

    wrapper.find('form').trigger('submit');
    expect(wrapper.emitted()['update:error']).to.eql([['']]);
    await waitFor(() => wrapper.emitted()['update:error'].length > 1, 'error message');

    expect(wrapper.emitted('update:error')[1]).to.eql(['message']);
  });

  it('Unknown error', async () => {
    sinon.stub(session, '$register').throws({});
    const wrapper = mount(GirderRegisterForm, { localVue, sync: false });
    await Promise.all([
      setInput(wrapper, 'input[data-vv-name="login"]', 'user'),
      setInput(wrapper, 'input[data-vv-name="email"]', 'example@email.com'),
      setInput(wrapper, 'input[data-vv-name="first name"]', 'first'),
      setInput(wrapper, 'input[data-vv-name="last name"]', 'last'),
      setInput(wrapper, 'input[data-vv-name="password"]', 'password'),
      setInput(wrapper, 'input[data-vv-name="confirmPassword"]', 'password'),
    ]);

    return wrapper.vm.register().then(() => {
      throw new Error('should throw');
    }, () => {});
  });
});
