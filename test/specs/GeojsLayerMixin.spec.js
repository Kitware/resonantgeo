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

  it('destroys on exit', () => {
    let called;
    const layer = {};
    const deleteLayer = function deleteLayer(arg) {
      called = true;
      expect(arg).to.equal(layer);
    };
    const context = {
      $geojsMap: {
        deleteLayer,
      },
      $geojsLayer: layer,
    };
    layerMixin.beforeDestroy.call(context);

    expect(context).to.be.empty;
    expect(called).to.equal(true);
  });
});
