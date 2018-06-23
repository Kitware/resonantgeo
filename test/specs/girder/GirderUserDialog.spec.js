import { shallowMount } from '@vue/test-utils';
import GirderUserDialog from '@/components/girder/GirderUserDialog';

describe('GirderUserDialog.vue', () => {
  function mountDialog(options = {}) {
    return shallowMount(GirderUserDialog, Object.assign({
      stubs: {
        'girder-login-form': true,
        'girder-register-form': true,
        'girder-reset-password-form': true,
        'girder-logout-form': true,
      },
    }, options));
  }

  it('Login form', () => {
    const wrapper = mountDialog({ propsData: { form: 'login' } });
    expect(wrapper.vm.title).to.equal('Log in to Girder');
    const form = wrapper.find({ name: 'girder-login-form' });
    form.vm.$emit('submit');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('Register form', () => {
    const wrapper = mountDialog({ propsData: { form: 'register' } });
    expect(wrapper.vm.title).to.equal('Register a new account');
    const form = wrapper.find({ name: 'girder-register-form' });
    form.vm.$emit('submit');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('Reset password form', () => {
    const wrapper = mountDialog({ propsData: { form: 'reset' } });
    expect(wrapper.vm.title).to.equal('Reset password');
    const form = wrapper.find({ name: 'girder-reset-password-form' });
    form.vm.$emit('submit');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('Logout form', () => {
    const wrapper = mountDialog({ propsData: { form: 'logout' } });
    expect(wrapper.vm.title).to.equal('');
    const form = wrapper.find({ name: 'girder-logout-form' });
    form.vm.$emit('submit');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('Login form -> register transition', () => {
    const wrapper = mountDialog({ propsData: { form: 'login' } });
    const form = wrapper.find({ name: 'girder-login-form' });
    form.vm.$emit('register');
    expect(wrapper.emitted('update:form')).to.eql([['register']]);
  });

  it('Login form -> reset transition', () => {
    const wrapper = mountDialog({ propsData: { form: 'login' } });
    const form = wrapper.find({ name: 'girder-login-form' });
    form.vm.$emit('reset');
    expect(wrapper.emitted('update:form')).to.eql([['reset']]);
  });

  it('Register form -> login transition', () => {
    const wrapper = mountDialog({ propsData: { form: 'register' } });
    const form = wrapper.find({ name: 'girder-register-form' });
    form.vm.$emit('login');
    expect(wrapper.emitted('update:form')).to.eql([['login']]);
  });

  it('Reset error state when changing forms', () => {
    const wrapper = mountDialog({ propsData: { form: 'register' } });
    wrapper.setData({ error: 'Some error' });
    wrapper.setProps({ form: 'login' });
    expect(wrapper.vm.error).to.equal('');
  });
});
