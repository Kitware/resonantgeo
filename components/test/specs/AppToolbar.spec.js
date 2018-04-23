import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import { createLocalVue, mount } from '@vue/test-utils';

import AppToolbar from '@/AppToolbar';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuetify);

describe('AppToolbar.vue', () => {
  it('toolbar title', () => {
    const wrapper = mount(AppToolbar, {
      propsData: {
        title: 'Toolbar title',
      },
    });

    expect(wrapper.text()).equal('Toolbar title');
    expect(wrapper.find({ name: 'v-tabs' }).exists()).equal(false);
    expect(wrapper.find({ name: 'v-btn' }).exists()).equal(false);
  });

  it('toolbar user icon', () => {
    const wrapper = mount(AppToolbar, {
      propsData: {
        title: 'Toolbar title',
        userIcon: 'user_picture',
      },
    });

    expect(wrapper.find('button').text()).equal('user_picture');
  });

  it('toolbar tabs', () => {
    const router = new VueRouter({ routes: [] });
    const wrapper = mount(AppToolbar, {
      localVue,
      router,
      propsData: {
        title: 'Toolbar title',
        tabs: [{
          title: 'tab1',
          route: 'route1',
          icon: 'icon1',
        }, {
          title: 'tab2',
          route: 'route2',
          icon: 'icon2',
        }],
      },
    });

    expect(wrapper.find({ name: 'v-tabs' }).exists()).equal(true);
    const tabs = wrapper.findAll({ name: 'v-tab' });
    expect(tabs.length).equal(2);

    let tab = tabs.at(0);
    expect(tab.props().to).equal('route1');
    tab.find('a').trigger('click');
    expect(wrapper.emitted()).eql({ 'click-tab': [['tab1']] });

    tab = tabs.at(1);
    expect(tab.props().to).equal('route2');
    tab.find('a').trigger('click');
    expect(wrapper.emitted()).eql({ 'click-tab': [['tab1'], ['tab2']] });
  });
});
