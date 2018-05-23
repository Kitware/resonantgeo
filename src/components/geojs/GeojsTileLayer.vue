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
    wrapX: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.createLayer('osm', {
      url: this.url,
      attribution: this.attribution,
      wrapX: this.wrapX,
    });
    bindWatchers(this, this.$geojsLayer, ['url', 'attribution']);
  },
};
</script>
