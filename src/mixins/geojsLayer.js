const layerMixin = {
  beforeDestroy() {
    this.$geojsMap.deleteLayer(this.$geojsLayer);
    delete this.$geojsLayer;
    delete this.$geojsMap;
  },
  mounted() {
    // This is in place purely for testing because there is no way
    // in @vue/test-utils to put mocks in place *before* mount is called.
    //   https://github.com/vuejs/vue-test-utils/issues/560
    this.$parent = this.$parent || this.$options.testParent;

    if (!this.$parent || this.$parent.$geojsViewport !== true) {
      throw new Error('A layer must be a child of a GeojsMapViewport');
    }
    this.$geojsMap = this.$parent.$geojsMap;
    this.$geojs = this.$parent.$geojs;
  },
};

export default layerMixin;
