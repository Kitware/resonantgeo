import bindWatchers from '@/bindWatchers';
import layerMixin from '@/mixins/geojsLayer';

function mount(parent) {
  const context = {
    $parent: parent,
    $options: {},
  };
  return layerMixin.mounted.call(context);
}

describe('Geojs layer mixin', () => {
  it('mount without a parent', () => {
    expect(() => mount()).to.throw(/A layer must be a child of a GeojsMapViewport/);
  });

  it('mount without a geojs viewport parent', () => {
    expect(() => mount({})).to.throw(/A layer must be a child of a GeojsMapViewport/);
  });

  it('unbinds old watchers', () => {
    const prop1Stub = sinon.stub();
    const component = {
      $watch: sinon.stub().returns(() => sinon.stub()),
      $unwatch: new Map([['prop1', prop1Stub]]),
    };
    const layer = {
      prop1: sinon.stub(),
      prop2: sinon.stub(),
    };
    bindWatchers(component, layer, ['prop1', 'prop2']);
    expect([...component.$unwatch.keys()]).to.have.members(['prop1', 'prop2']);
    prop1Stub.should.have.been.calledOnce;
  });

  it('cleans up on removeLayer', () => {
    let called;
    const layer = {};
    const deleteLayer = function deleteLayer(arg) {
      called = true;
      expect(arg).to.equal(layer);
    };
    const unwatch1 = sinon.stub();
    const unwatch2 = sinon.stub();

    const context = {
      $geojsMap: {
        deleteLayer,
      },
      $geojsLayer: layer,
      $unwatch: new Map([
        ['prop1', unwatch1],
        ['prop2', unwatch2],
      ]),
    };
    layerMixin.methods.removeLayer.call(context);

    expect(called).to.equal(true);
    unwatch1.should.have.been.calledOnce;
    unwatch2.should.have.been.calledOnce;
  });

  it('destroys on exit', () => {
    let called;
    const layer = {};
    const deleteLayer = function deleteLayer(arg) {
      called = true;
      expect(arg).to.equal(layer);
    };
    const unwatch1 = sinon.stub();
    const unwatch2 = sinon.stub();

    const context = {
      $geojsMap: {
        deleteLayer,
      },
      $geojsLayer: layer,
      $unwatch: new Map([
        ['prop1', unwatch1],
        ['prop2', unwatch2],
      ]),
    };
    layerMixin.beforeDestroy.call(context);

    expect(context).to.be.empty;
    expect(called).to.equal(true);
    unwatch1.should.have.been.calledOnce;
    unwatch2.should.have.been.calledOnce;
  });
});
