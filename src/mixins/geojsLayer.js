import bindWatchers from '../bindWatchers';

const layerMixin = {
  inject: ['$geojs', '$geojsMap'],
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
    if (!this.$geojs) {
      throw new Error('A layer must be a child of a GeojsMapViewport');
    }
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
