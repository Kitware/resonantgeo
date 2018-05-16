import geojs from 'geojs';
import { mount } from '@vue/test-utils';

import GeojsMapViewport from '@/components/geojs/GeojsMapViewport';
import GeojsGeojsonLayer from '@/components/geojs/GeojsGeojsonLayer';

describe('GeojsTileLayer.vue', () => {
  let mapWrapper;
  function mountLayer(options = {}) {
    return mount(GeojsGeojsonLayer, {
      testParent: mapWrapper.vm,
      ...options,
    });
  }

  beforeEach(() => {
    geojs.util.mockVGLRenderer();
    sinon.stub(console, 'warn');
    mapWrapper = mount(GeojsMapViewport);
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    mapWrapper.destroy();
    geojs.util.restoreVGLRenderer();
  });

  it('mount with data', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10, 15],
      },
    };
    const wrapper = mountLayer({
      propsData: { geojson },
    });

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features().length).to.equal(1);
    expect(layer.features()[0].data()).to.eql([geojson]);
  });

  it('mount with null', () => {
    const geojson = null;
    const wrapper = mountLayer({
      propsData: { geojson },
    });

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features()).to.eql([]);
    expect(wrapper.vm.$features).to.eql([]);
  });

  it('responds to data changes', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10, 15],
      },
    };
    const wrapper = mountLayer({
      propsData: { geojson },
    });

    geojson.geometry.coordinates = [-10, 4];

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features().length).to.equal(1);
    expect(layer.features()[0].data()).to.eql([geojson]);
    expect(wrapper.vm.$features.length).to.eql(1);
  });
});
