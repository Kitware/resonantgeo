import { mount } from '@vue/test-utils';

import GeojsMapViewport from '@/components/geojs/GeojsMapViewport';
import GeojsTileLayer from '@/components/geojs/GeojsTileLayer';

describe('GeojsTileLayer.vue', () => {
  let mapWrapper;
  beforeEach(() => {
    sinon.stub(console, 'warn');
    mapWrapper = mount(GeojsMapViewport);
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    mapWrapper.destroy();
  });

  it('url (string)', () => {
    const wrapper = mount(GeojsTileLayer, {
      propsData: {
        url: '/data/white.jpg',
      },
      testParent: mapWrapper.vm,
    });
    expect(wrapper.vm.$geojsLayer.url()).equal('/data/white.jpg');

    wrapper.vm.url = '/data/osm.png';
    expect(wrapper.vm.$geojsLayer.url()).equal('/data/osm.png');
  });

  it('attribution', () => {
    const attribution = '<a href="www.example.com"></a>';
    const wrapper = mount(GeojsTileLayer, {
      propsData: {
        url: '/data/osm.png',
        attribution,
      },
      testParent: mapWrapper.vm,
    });
    expect(wrapper.vm.$geojsLayer.attribution()).equal(attribution);

    wrapper.vm.attribution = '';
    expect(wrapper.vm.$geojsLayer.attribution()).equal('');
  });

  it('opacity', () => {
    const wrapper = mount(GeojsTileLayer, {
      propsData: {
        url: '/data/osm.png',
        opacity: 0.5,
      },
      testParent: mapWrapper.vm,
    });
    expect(wrapper.vm.$geojsLayer.opacity()).equal(0.5);

    wrapper.vm.opacity = 0.75;
    expect(wrapper.vm.$geojsLayer.opacity()).equal(0.75);
  });

  it('wrapX', () => {
    const wrapper = mount(GeojsTileLayer, {
      propsData: {
        url: '/data/osm.png',
        wrapX: false,
      },
      testParent: mapWrapper.vm,
    });
    expect(wrapper.vm.$geojsLayer.options.wrapX).equal(false);
  });

  it('removes on destroy', () => {
    const wrapper = mount(GeojsTileLayer, {
      propsData: {
        url: '/data/osm.png',
      },
      testParent: mapWrapper.vm,
    });
    const spy = sinon.spy(mapWrapper.vm.$geojsMap, 'deleteLayer');
    const layer = wrapper.vm.$geojsLayer;
    wrapper.destroy();
    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWith(layer);
    spy.restore();
  });
});
