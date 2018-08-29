import GeojsColorLegendWidget from '@/components/geojs/GeojsColorLegendWidget';

import ProvideGeojs from '../ProvideGeojs';

describe('GeojsColorLegendWidget.vue', () => {
  const provider = new ProvideGeojs();
  function mountLayer(options = {}) {
    return provider.mountLayer(GeojsColorLegendWidget, options);
  }

  beforeEach(() => {
    sinon.stub(console, 'warn');
    provider.start();
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    provider.stop();
  });

  it('mount with empty data', () => {
    const propsData = {
      categories: [],
    };
    const wrapper = mountLayer({
      propsData,
    });

    const layer = wrapper.vm.$geojsLayer;
    expect(layer.children().length).to.equal(1);
    const widget = layer.children()[0];
    expect(widget.canvas().style.display).to.equal('none');
  });

  it('mount with data', () => {
    const propsData = {
      categories: [{
        name: 'Discrete ordinal',
        type: 'discrete',
        scale: 'ordinal',
        domain: ['beijing', 'new york', 'london', 'paris'],
        colors: ['red', 'green', 'blue', 'orange'],
      }],
    };
    const wrapper = mountLayer({
      propsData,
    });

    const layer = wrapper.vm.$geojsLayer;
    const widget = layer.children()[0];
    expect(widget.categories().length).to.equal(1);
    expect(widget.categories()).to.eql(propsData.categories);
  });

  it('responds to data changes', () => {
    const propsData = {
      categories: [{
        name: 'Discrete ordinal',
        type: 'discrete',
        scale: 'ordinal',
        domain: ['beijing', 'new york', 'london', 'paris'],
        colors: ['red', 'green', 'blue', 'orange'],
      }],
    };
    const wrapper = mountLayer({
      propsData,
    });
    propsData.categories.push({
      name: 'Continuous pow',
      type: 'continuous',
      scale: 'pow',
      exponent: 1.1,
      domain: [100, 10000],
      colors: ['red', 'blue'],
    });

    const layer = wrapper.vm.$geojsLayer;
    const widget = layer.children()[0];
    expect(widget.categories().length).to.equal(2);
    expect(widget.canvas().getElementsByClassName('legend').length).to.equal(2);
  });
});
