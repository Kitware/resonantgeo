import GeojsHeatmapLayer from '@/components/geojs/GeojsHeatmapLayer';

import ProvideGeojs from '../ProvideGeojs';

describe('GeojsTileLayer.vue', () => {
  const provider = new ProvideGeojs();
  function mountLayer(options = {}) {
    return provider.mountLayer(GeojsHeatmapLayer, options);
  }

  beforeEach(() => {
    sinon.stub(console, 'warn');
    provider.start();
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    provider.stop();
  });

  it('validate intensity (null)', () => {
    const { validator } = mountLayer().vm.$options.props.maxIntensity;
    expect(validator(null)).to.equal(true);
  });

  it('validate intensity (number)', () => {
    const { validator } = mountLayer().vm.$options.props.maxIntensity;
    expect(validator(1)).to.equal(true);
  });

  it('validate intensity (NaN)', () => {
    const { validator } = mountLayer().vm.$options.props.maxIntensity;
    expect(validator(Number.NaN)).to.equal(false);
  });

  it('validate binned (auto)', () => {
    const { validator } = mountLayer().vm.$options.props.binned;
    expect(validator('auto')).to.equal(true);
  });

  it('validate binned (string)', () => {
    const { validator } = mountLayer().vm.$options.props.binned;
    expect(validator('not valid')).to.equal(false);
  });

  it('validate binned (number)', () => {
    const { validator } = mountLayer().vm.$options.props.binned;
    expect(validator(5)).to.equal(true);
  });

  it('validate binned (boolean)', () => {
    const { validator } = mountLayer().vm.$options.props.binned;
    expect(validator(false)).to.equal(true);
  });

  it('mount with data', () => {
    const data = [{ x: 1, y: 2 }];
    const wrapper = mountLayer({ propsData: { data } });
    expect(wrapper.vm.$geojsFeature.data()).to.eql(data);
  });

  it('data reactivity', () => {
    const data = [{ x: 1, y: 2 }];
    const wrapper = mountLayer();
    expect(wrapper.vm.$geojsFeature.data()).to.eql([]);
    wrapper.setProps({ data });
    expect(wrapper.vm.$geojsFeature.data()).to.eql(data);
  });

  it('style reactivity', () => {
    const wrapper = mountLayer();
    wrapper.setProps({ layerStyle: { radius: 2 } });
    expect(wrapper.vm.$geojsFeature.style().radius).to.equal(2);
  });

  it('removes on destroy', () => {
    const wrapper = mountLayer();
    const spy = sinon.spy(provider.geojsMap, 'deleteLayer');
    const layer = wrapper.vm.$geojsLayer;
    wrapper.destroy();
    spy.should.have.been.calledOnce;
    spy.should.have.been.calledWith(layer);
    spy.restore();
  });
});
