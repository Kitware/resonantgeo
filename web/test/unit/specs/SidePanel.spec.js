import { mount } from '@vue/test-utils';

import SidePanel from '@/components/SidePanel';

describe('SidePanel.vue', () => {
  it('no toolbar', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        toolbar: false,
      },
    });
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
    expect(wrapper.contains('.toolbar')).to.equal(true);
    expect(wrapper.find('.toolbar').text()).to.equal('Toolbar title');
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
    expect(wrapper.contains('.toolbar')).to.equal(true);
    expect(wrapper.find('.toolbar button').text()).to.equal('more_vert');
  });

  it('no action buttons', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        actions: false,
      },
    });
    expect(wrapper.contains('.action-buttons')).to.equal(false);
  });

  it('with action buttons', () => {
    const wrapper = mount(SidePanel, {
      propsData: {
        actions: [{
          name: 'a',
          color: 'primary',
          icon: 'aspect_ratio',
        }, {
          name: 'b',
          color: 'red',
          icon: 'timeline',
        }],
      },
    });
    expect(wrapper.contains('.action-buttons')).to.equal(true);
    expect(wrapper.find('.action-buttons .primary').text()).to.equal('aspect_ratio');
    expect(wrapper.find('.action-buttons .red').text()).to.equal('timeline');

    wrapper.find('.action-buttons button').trigger('click');
    expect(wrapper.emitted()).to.eql({ 'click-action': [['a']] });
  });
});
