import geo from 'geojs';
import { mount } from '@vue/test-utils';

import GeojsMapViewport from '@/components/geojs/GeojsMapViewport';

describe('GeojsMapViewport.vue', () => {
  const delta = 1e-6;
  beforeEach(() => {
    sinon.stub(console, 'warn');
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
  });

  it('initialize viewport as props', () => {
    const wrapper = mount(GeojsMapViewport, {
      propsData: {
        viewport: {
          center: [15, 10],
          zoom: 4,
          rotation: 0.5,
        },
      },
    });
    const map = wrapper.vm.$geojsMap;
    expect(map.center().x).closeTo(15, delta);
    expect(map.center().y).closeTo(10, delta);
    expect(map.zoom()).closeTo(4, delta);
    expect(map.rotation()).closeTo(0.5, delta);
  });

  it('provides properties to child elements', () => {
    const wrapper = mount(GeojsMapViewport);
    const provides = wrapper.vm.$options.provide();
    expect(provides).to.have.property('$geojs');
    expect(provides).to.have.property('$geojsMap');
  });

  it('respond to pan events (sync)', () => {
    const wrapper = mount(GeojsMapViewport, {
      propsData: {
        debounce: 0,
      },
    });
    wrapper.vm.$geojsMap.center({ x: -10, y: -15 });
    expect(wrapper.emitted()).property('update:viewport');
    const vp = wrapper.emitted()['update:viewport'];
    expect(vp).lengthOf(1);
    expect(vp[0]).lengthOf(1);
    expect(vp[0][0].center[0]).closeTo(-10, delta);
    expect(vp[0][0].center[1]).closeTo(-15, delta);
  });

  it('respond to pan events (async)', () => {
    const wrapper = mount(GeojsMapViewport, {
      propsData: {
        debounce: 10,
      },
    });
    wrapper.vm.$geojsMap.center({ x: -10, y: -15 });

    return new Promise((resolve) => {
      expect(wrapper.emitted()).not.property('update:viewport');

      window.setTimeout(() => {
        expect(wrapper.emitted()).property('update:viewport');
        const vp = wrapper.emitted()['update:viewport'];
        expect(vp).lengthOf(1);
        expect(vp[0]).lengthOf(1);
        expect(vp[0][0].center[0]).closeTo(-10, delta);
        expect(vp[0][0].center[1]).closeTo(-15, delta);
        resolve();
      }, 20);
    });
  });

  it('respond to click events', () => {
    const wrapper = mount(GeojsMapViewport);
    wrapper.vm.$geojsMap.geoTrigger(geo.event.mouseclick, {
      geo: { x: -15, y: 10 },
    });
    expect(wrapper.emitted()).property('click');
    expect(wrapper.emitted().click).eql([[[-15, 10]]]);
  });

  it('map exits on component destroy', () => {
    const wrapper = mount(GeojsMapViewport);
    const spy = sinon.spy(wrapper.vm.$geojsMap, 'exit');

    wrapper.destroy();
    spy.should.have.been.calledOnce;
    spy.restore();
  });
});
