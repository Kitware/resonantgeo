<template lang="pug">
// geojs tile layer
</template>

<script>
import bindWatchers from './bindWatchers';

export default {
  props: {
    url: {
      type: [String, Function],
      required: true,
    },
    attribution: {
      type: String,
      default: '',
    },
    opacity: {
      type: Number,
      default: 1,
      validator(value) {
        return value <= 1 && value >= 0;
      },
    },
    wrapX: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    // This is in place purely for testing because there is no way
    // in @vue/test-utils to put mocks in place *before* mount is called.
    //   https://github.com/vuejs/vue-test-utils/issues/560
    this.$parent = this.$parent || this.$options.testParent;

    if (!this.$parent || !this.$parent.$geojsMap) {
      throw new Error('Tile layer must be a child of a GeojsMapViewport');
    }
    this.$geojsLayer = this.$parent.$geojsMap.createLayer(
      'osm', {
        url: this.url,
        attribution: this.attribution,
        opacity: this.opacity,
        wrapX: this.wrapX,
      });
    bindWatchers(this, this.$geojsLayer, [
      'url', 'attribution', 'opacity',
    ]);
  },
  beforeDestroy() {
    this.$parent.$geojsMap.deleteLayer(this.$geojsLayer);
    delete this.$geojsLayer;
  },
};
</script>
