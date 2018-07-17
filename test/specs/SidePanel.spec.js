import { mount } from '@vue/test-utils';

import SidePanel from '@/components/SidePanel';

describe('SidePanel.vue', () => {
  it('no toolbar', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        toolbar: false,
      },
    });
    const nav = wrapper.find({ name: 'v-navigation-drawer' });
    expect(nav.props()).property('right', false);
    expect(wrapper.contains('.toolbar')).to.equal(false);
  });

  it('toolbar with no icon', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        toolbar: {
          title: 'Toolbar title',
          icon: false,
        },
      },
    });
    expect(wrapper.contains('.v-toolbar')).to.equal(true);
    expect(wrapper.find('.v-toolbar').text()).to.equal('Toolbar title');
  });

  it('toolbar with icon', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        toolbar: {
          title: 'Toolbar title',
          icon: 'more_vert',
        },
      },
    });
    expect(wrapper.contains('.v-toolbar')).to.equal(true);
    expect(wrapper.find('.v-toolbar button').text()).to.equal('more_vert');
  });

  it('right side panel', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        actions: [{
          name: 'a',
          color: 'primary',
          icon: 'aspect_ratio',
        }],
        right: true,
      },
    });

    const nav = wrapper.find({ name: 'v-navigation-drawer' });
    expect(nav.props()).property('right', true);
    expect(parseInt(wrapper.find('.action-buttons').element.style.left, 10)).lessThan(0);
  });

  it('fixed position side panel', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        floating: false,
      },
    });
    expect(wrapper.vm.style).to.eql({});
    expect(wrapper.element.style.height).to.equal('100%');
    expect(wrapper.find({ name: 'v-navigation-drawer' }).vm.app).to.equal(true);
    expect(wrapper.find({ name: 'v-navigation-drawer' }).vm.clipped).to.equal(false);
  });
});
