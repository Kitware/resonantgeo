
import GeojsWidgetLayer from '@/components/geojs/GeojsWidgetLayer';

import ProvideGeojs from '../ProvideGeojs';

const TestComponent = {
  functional: true,
  render(createElement) {
    return createElement('div', 'Test component');
  },
};

describe('GeojsWidgetLayer.vue', () => {
  const provider = new ProvideGeojs();
  let displayPosition = { x: 10, y: 20 };
  let gcsToDisplay;

  function mountLayer(options = {}) {
    return provider.mountLayer(GeojsWidgetLayer, {
      slots: { default: TestComponent },
      ...options,
    });
  }

  beforeEach(() => {
    sinon.stub(console, 'warn');
    provider.start();
    gcsToDisplay = sinon.stub(provider.geojsMap, 'gcsToDisplay').callsFake(() => displayPosition);
  });
  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    gcsToDisplay.restore();
    provider.stop();
  });

  it('mounted with default slot', () => {
    const wrapper = mountLayer();
    const layer = wrapper.vm.$geojsLayer;
    expect(layer.canvas().text()).to.equal('Test component');
  });

  it('mounted with correct size', () => {
    const wrapper = mountLayer({
      propsData: {
        size: { width: 300, height: 30 },
      },
    });
    expect(wrapper.find('.widget-content').element.style.width).to.equal('300px');
    expect(wrapper.find('.widget-content').element.style.height).to.equal('30px');
  });
  it('mounted with correct position', () => {
    const position = { x: 0, y: 0 };
    const wrapper = mountLayer({
      propsData: {
        size: { width: 100, height: 50 },
        position,
        offset: { x: 0, y: 0 },
      },
    });

    expect(gcsToDisplay).to.have.been.calledOnce;
    expect(gcsToDisplay).to.have.been.calledWith(position);
    expect(wrapper.vm.cssPosition.left).to.equal(`${displayPosition.x - (100 / 2)}px`);
    expect(wrapper.vm.cssPosition.top).to.equal(`${displayPosition.y - (50 / 2)}px`);
  });
  it('mounted with correct position and offset', () => {
    const position = { x: 0, y: 0 };
    const wrapper = mountLayer({
      propsData: {
        size: { width: 100, height: 50 },
        position,
        offset: { x: 50, y: -10 },
      },
    });

    expect(gcsToDisplay).to.have.been.calledOnce;
    expect(gcsToDisplay).to.have.been.calledWith(position);
    expect(wrapper.vm.cssPosition.left).to.equal(`${(displayPosition.x + 50) - (100 / 2)}px`);
    expect(wrapper.vm.cssPosition.top).to.equal(`${(displayPosition.y - 10) - (50 / 2)}px`);
  });
  it('responds to position changes', () => {
    const position = { x: 0, y: 0 };
    const wrapper = mountLayer({
      propsData: {
        size: { width: 100, height: 50 },
        position,
        offset: { x: 50, y: -10 },
      },
    });

    expect(gcsToDisplay).to.have.been.calledOnce;
    expect(gcsToDisplay).to.have.been.calledWith(position);

    displayPosition = { x: 5, y: -10 };
    position.x = 5;

    expect(gcsToDisplay).to.have.been.calledTwice;
    expect(gcsToDisplay).to.have.been.calledWith(position);
    expect(wrapper.vm.cssPosition.left).to.equal(`${(displayPosition.x + 50) - (100 / 2)}px`);
    expect(wrapper.vm.cssPosition.top).to.equal(`${(displayPosition.y - 10) - (50 / 2)}px`);
  });
});
