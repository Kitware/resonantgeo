<template lang="pug">
// geojs tile layer
</template>

<script>
import bindWatchers from '../../bindWatchers';
import layerMixin from '../../mixins/geojsLayer';

export default {
  mixins: [layerMixin],
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
    this.$geojsLayer = this.$geojsMap.createLayer('osm', {
      url: this.url,
      attribution: this.attribution,
      opacity: this.opacity,
      wrapX: this.wrapX,
    });
    bindWatchers(this, this.$geojsLayer, [
      'url', 'attribution', 'opacity',
    ]);
  },
};
</script>
