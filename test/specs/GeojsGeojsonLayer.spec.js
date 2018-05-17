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

  it('mount with default feature style', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10, 15],
      },
    };
    const featureStyle = {};
    const wrapper = mountLayer({
      propsData: { geojson, featureStyle },
    });

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features().length).to.equal(1);
  });

  it('mount with feature style', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10, 15],
      },
    };
    const featureStyle = {
      point: {
        fillColor: 'red',
        lineWidth: 5,
      },
      line: null,
    };
    const wrapper = mountLayer({
      propsData: { geojson, featureStyle },
    });

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features().length).to.equal(1);
    expect(layer.features()[0].style('fillColor')).to.equal('red');
    expect(layer.features()[0].style('lineWidth')).to.equal(5);
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

  it('responds to feature style changes', () => {
    const geojson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [10, 15],
      },
    };
    const featureStyle = {
      point: {
        fillColor: 'red',
        lineWidth: 5,
      },
    };
    const wrapper = mountLayer({
      propsData: { geojson, featureStyle },
    });

    featureStyle.point.fillColor = 'rgba(0,128,255,0.1)';
    const layer = wrapper.vm.$geojsLayer;
    expect(layer.features().length).to.equal(1);
    expect(layer.features()[0].style('fillColor')).to.equal('rgba(0,128,255,0.1)');
  });
});
