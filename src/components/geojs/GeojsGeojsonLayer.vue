<template lang="pug">
// geojs geojson layer
</template>

<script>
import bindWatchers from './bindWatchers';
import { layerMixin } from './mixins';

export default {
  mixins: [layerMixin],
  props: {
    geojson: {
      type: [Object, Array],
      required: true,
    },
    opacity: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    geojson: {
      handler() {
        this.draw();
      },
      deep: true,
    },
  },
  mounted() {
    this.$geojsLayer = this.$geojsMap.createLayer('feature', {
      opacity: this.opacity,
    });
    this.$geojsReader = this.$geojs.jsonReader({
      layer: this.$geojsLayer,
    });
    this.$features = [];
    bindWatchers(this, this.$geojsLayer, ['opacity']);
    this.draw();
  },
  methods: {
    draw() {
      this.$geojsLayer.clear();
      this.$geojsReader.read(this.geojson, (features) => {
        this.$features = features;
        this.$geojsLayer.draw();
      });
    },
  },
};
</script>
