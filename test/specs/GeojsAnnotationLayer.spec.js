import geojs from 'geojs';
import { mount } from '@vue/test-utils';
import last from 'lodash-es/last';

import GeojsMapViewport from '@/components/geojs/GeojsMapViewport';
import GeojsAnnotationLayer from '@/components/geojs/GeojsAnnotationLayer';

describe('GeojsAnnotationLayer.vue', () => {
  let mapWrapper;
  let interactor;
  function mountAnnotationLayer(options = {}) {
    const wrapper = mount(GeojsAnnotationLayer, {
      testParent: mapWrapper.vm,
      ...options,
    });
    return wrapper;
  }

  function interact(event, pt, button) {
    interactor.simulateEvent(
      event, {
        map: mapWrapper.vm.$geojsMap.gcsToDisplay(pt),
        button,
      },
    );
  }

  function click(pt) {
    interact('mousedown', pt, 'left');
    interact('mouseup', pt, 'left');
  }

  function drag(pt1, pt2) {
    click(pt1);
    interact('mousemove', pt2, 'left');
    click(pt2);
  }

  function doubleclick(pt) {
    click(pt);
    click(pt);
  }

  beforeEach(() => {
    geojs.util.mockVGLRenderer();
    sinon.stub(console, 'warn');
    mapWrapper = mount(GeojsMapViewport);
    interactor = mapWrapper.vm.$geojsMap.interactor();
  });

  afterEach(() => {
    console.warn.restore(); // eslint-disable-line no-console
    mapWrapper.destroy();
    geojs.util.restoreVGLRenderer();
  });

  it('annotation type validation', () => {
    const drawing = mountAnnotationLayer().vm.$options.props.drawing;
    expect(drawing.validator('not valid')).to.equal(false);
  });

  it('annotation editing validation', () => {
    const editing = mountAnnotationLayer().vm.$options.props.editing;
    expect(editing.validator(-1)).to.equal(false);
  });

  it('construct with no annotations', () => {
    const wrapper = mountAnnotationLayer();
    expect(wrapper.vm.annotations).to.eql([]);
    expect(wrapper.vm.geojson).to.eql(null);
  });

  it('construct with geojson', () => {
    const wrapper = mountAnnotationLayer({
      propsData: {
        initialGeojson: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [10, 15],
            },
          }],
        },
      },
    });
    expect(wrapper.vm.state.length).to.equal(1);
  });

  it('draw a point', () => {
    const wrapper = mount(GeojsAnnotationLayer, {
      testParent: mapWrapper.vm,
    });
    wrapper.setProps({ drawing: 'point' });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('point');

    click({ x: 0, y: 0 });

    expect(wrapper.vm.$geojsLayer.mode()).to.equal(null);
    expect(wrapper.emitted('update:drawing')).to.eql([[false]]);
    expect(last(wrapper.emitted('update:annotations'))[0].length).to.equal(1);
    expect(last(wrapper.emitted('update:annotations'))[0][0].type()).to.equal('point');
  });

  it('draw a rectangle', () => {
    const wrapper = mountAnnotationLayer();
    wrapper.setProps({ drawing: 'rectangle' });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('rectangle');

    drag({ x: 0, y: 0 }, { x: 10, y: 15 });

    expect(wrapper.vm.$geojsLayer.mode()).to.equal(null);
    expect(wrapper.emitted('update:drawing')).to.eql([[false]]);
    expect(last(wrapper.emitted('update:annotations'))[0].length).to.equal(1);
    expect(last(wrapper.emitted('update:annotations'))[0][0].type()).to.equal('rectangle');
  });

  it('draw a line', () => {
    const wrapper = mountAnnotationLayer();
    wrapper.setProps({ drawing: 'line' });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('line');

    drag({ x: 0, y: 0 }, { x: 10, y: 15 });
    doubleclick({ x: 10, y: 15 });

    expect(wrapper.vm.$geojsLayer.mode()).to.equal(null);
    expect(wrapper.emitted('update:drawing')).to.eql([[false]]);
    expect(last(wrapper.emitted('update:annotations'))[0].length).to.equal(1);
    expect(last(wrapper.emitted('update:annotations'))[0][0].type()).to.equal('line');
  });

  it('edit a rectangle', () => {
    const wrapper = mountAnnotationLayer({
      propsData: { editable: true },
    });
    wrapper.setProps({ drawing: 'rectangle' });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('rectangle');

    drag({ x: 0, y: 0 }, { x: 10, y: 15 });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal(null);

    interact('mousemove', { x: 100, y: 100 });
    interact('mousemove', { x: 5, y: 5 });
    click({ x: 5, y: 5 });

    const id = wrapper.vm.state[0].id();
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('edit');
    expect(wrapper.emitted('update:editing')).to.eql([[id]]);

    wrapper.setProps({ editing: id });
    expect(wrapper.vm.activeAnnotation).to.equal(wrapper.vm.state[0]);
  });

  it('cancel drawing via props', () => {
    const wrapper = mountAnnotationLayer();
    wrapper.setProps({ drawing: 'point' });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal('point');

    wrapper.setProps({ drawing: false });
    expect(wrapper.vm.$geojsLayer.mode()).to.equal(null);
  });

  it('add an annotation via props', () => {
    const wrapper = mountAnnotationLayer();
    const point = geojs.annotation.annotation('point');

    wrapper.vm.annotations = [point];
    expect(wrapper.vm.state).to.eql([point]);
  });

  it('remove an annotation via props', () => {
    const wrapper = mountAnnotationLayer({
      propsData: {
        initialGeojson: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [10, 15],
            },
          }],
        },
      },
    });

    wrapper.vm.annotations = [];
    expect(wrapper.vm.state).to.eql([]);
  });

  it('add and remove annotations via props', () => {
    const wrapper = mountAnnotationLayer({
      propsData: {
        initialGeojson: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [10, 15],
            },
          }],
        },
      },
    });
    const point = geojs.annotation.annotation('point');

    wrapper.vm.annotations = [point];
    expect(wrapper.vm.state).to.eql([point]);
  });
});
