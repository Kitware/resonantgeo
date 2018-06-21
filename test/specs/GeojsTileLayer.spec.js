import GeojsTileLayer from '@/components/geojs/GeojsTileLayer';

import ProvideGeojs from '../ProvideGeojs';

describe('GeojsTileLayer.vue', () => {
  const provider = new ProvideGeojs();
  function mountTileLayer(options) {
    return provider.mountLayer(GeojsTileLayer, options);
  }
  beforeEach(() => {
    sinon.stub(console, 'warn');
    provider.start();
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    provider.stop();
  });

  it('url (string)', () => {
    const wrapper = mountTileLayer({
      propsData: { url: '/data/white.jpg' },
    });
    expect(wrapper.vm.$geojsLayer.url()).equal('/data/white.jpg');

    wrapper.vm.url = '/data/osm.png';
    expect(wrapper.vm.$geojsLayer.url()).equal('/data/osm.png');
  });

  it('attribution', () => {
    const attribution = '<a href="www.example.com"></a>';
    const wrapper = mountTileLayer({
      propsData: {
        url: '/data/osm.png',
        attribution,
      },
    });
    expect(wrapper.vm.$geojsLayer.attribution()).equal(attribution);

    wrapper.vm.attribution = '';
    expect(wrapper.vm.$geojsLayer.attribution()).equal('');
  });

  it('opacity', () => {
    const wrapper = mountTileLayer({
      propsData: {
        url: '/data/osm.png',
        opacity: 0.5,
      },
    });
    expect(wrapper.vm.$geojsLayer.opacity()).equal(0.5);

    wrapper.vm.opacity = 0.75;
    expect(wrapper.vm.$geojsLayer.opacity()).equal(0.75);
  });

  it('wrapX', () => {
    const wrapper = mountTileLayer({
      propsData: {
        url: '/data/osm.png',
        wrapX: false,
      },
    });
    expect(wrapper.vm.$geojsLayer.options.wrapX).equal(false);
  });

  it('removes on destroy', () => {
    const wrapper = mountTileLayer({
      propsData: {
        url: '/data/osm.png',
      },
    });
    const spy = sinon.spy(wrapper.vm.$geojsMap, 'deleteLayer');
    const layer = wrapper.vm.$geojsLayer;
    wrapper.destroy();
    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWith(layer);
    spy.restore();
  });
});
