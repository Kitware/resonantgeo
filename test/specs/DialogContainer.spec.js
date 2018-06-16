import { mount } from '@vue/test-utils';

import DialogContainer from '@/components/DialogContainer';

let app;
describe('DialogContainer.vue', () => {
  // Inject a fake app to get around vuetify warning
  // https://github.com/vuetifyjs/vuetify/issues/1210#issuecomment-319624495
  beforeEach(() => {
    app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.appendChild(app);
  });
  afterEach(() => {
    document.body.removeChild(app);
  });

  it('dialog title', () => {
    const wrapper = mount(DialogContainer, {
      propsData: {
        title: 'Dialog title',
      },
    });
    const toolbar = wrapper.find({ name: 'v-toolbar' });
    expect(toolbar.text()).to.match(/^Dialog title/);
  });

  it('close button closes dialog', () => {
    const wrapper = mount(DialogContainer);
    const toolbar = wrapper.find({ name: 'v-toolbar' });
    toolbar.find('button').trigger('click');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('escape closes dialog', () => {
    const wrapper = mount(DialogContainer, { attachToDocument: true });
    wrapper.trigger('keydown.esc');
    expect(wrapper.emitted('input')).to.eql([[false]]);
  });

  it('error message is displayed', () => {
    const wrapper = mount(DialogContainer, {
      propsData: { error: 'This is an error' },
    });
    const alert = wrapper.find({ name: 'v-alert' });
    expect(alert.props().value).equal(true);
    expect(alert.text()).to.match(/This is an error/);
  });

  it('error message is dismissible', () => {
    const wrapper = mount(DialogContainer, {
      propsData: { error: 'This is an error' },
    });
    const alert = wrapper.find({ name: 'v-alert' });
    alert.find('a').trigger('click');
    expect(wrapper.emitted('update:error')).to.eql([['']]);
  });
});
