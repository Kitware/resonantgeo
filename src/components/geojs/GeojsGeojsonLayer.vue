<template lang="pug">
// geojs geojson layer
</template>

<script>
import layerMixin from '../../mixins/geojsLayer';

export default {
  mixins: [layerMixin],
  props: {
    geojson: { // eslint-disable-line vue/require-prop-types
      required: true,
    },
    featureStyle: {
      type: Object,
      default() {
        return {
          point: {},
          line: {},
          polygon: {},
        };
      },
    },
  },
  watch: {
    geojson: {
      handler() {
        this.updateData();
      },
      deep: true,
    },
    featureStyle: {
      handler() {
        this.updateStyle();
      },
      deep: true,
    },
  },
  mounted() {
    this.createLayer('feature', {
      opacity: this.opacity,
    });
    this.$geojsReader = this.$geojs.geojsonReader({
      layer: this.$geojsLayer,
    });
    this.$features = [];
    this.updateData();
  },
  methods: {
    draw() {
      this.$geojsLayer.draw();
    },
    updateData() {
      this.$geojsLayer.clear().draw();
      if (this.geojson) {
        this.$geojsReader.read(this.geojson, (features) => {
          this.$features = features;
          this.updateStyle();
        });
      }
    },
    updateStyle() {
      this.$features.forEach((feature) => {
        const type = feature.featureType;
        if (this.featureStyle[type]) {
          feature.style(this.featureStyle[type]);
        }
      });
      this.draw();
    },
  },
};
</script>
