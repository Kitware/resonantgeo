import bindWatchers from '../bindWatchers';

const layerMixin = {
  props: {
    zIndex: {
      type: Number,
      default: 0,
    },
    opacity: {
      type: Number,
      default: 1,
    },
  },
  beforeDestroy() {
    this.$unwatch.forEach((unwatch) => {
      unwatch();
    });
    this.$geojsMap.deleteLayer(this.$geojsLayer);
    delete this.$unwatch;
    delete this.$geojsLayer;
    delete this.$geojsMap;
  },
  created() {
    this.$unwatch = new Map();
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
  methods: {
    createLayer(type, options) {
      this.$geojsLayer = this.$geojsMap.createLayer(type, {
        opacity: this.opacity,
        zIndex: this.zIndex,
        ...options,
      });
      bindWatchers(this, this.$geojsLayer, ['zIndex', 'opacity']);
    },
    removeLayer() {
      this.$unwatch.forEach((unwatch) => {
        unwatch();
      });
      this.$unwatch.clear();
      this.$geojsMap.deleteLayer(this.$geojsLayer);
      delete this.$geojsLayer;
    },
  },
};

export default layerMixin;
