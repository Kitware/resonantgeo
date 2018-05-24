<template lang="pug">
// geojs heatmap layer
</template>

<script>
import constant from 'lodash-es/constant';
import identity from 'lodash-es/identity';
import isFinite from 'lodash-es/isFinite';
import isString from 'lodash-es/isString';

import bindWatchers from '../../bindWatchers';
import layerMixin from '../../mixins/geojsLayer';

function intensityValidator(value) {
  return value === null || isFinite(value);
}

export default {
  mixins: [layerMixin],
  props: {
    data: {
      type: Array,
      required: true,
    },
    intensity: {
      type: Function,
      default: constant(1),
    },
    position: {
      type: Function,
      default: identity,
    },
    maxIntensity: {
      type: [Object, Number],
      default: null,
      validator: intensityValidator,
    },
    minIntensity: {
      type: [Object, Number],
      default: null,
      validator: intensityValidator,
    },
    updateDelay: {
      type: Number,
      default: 1000,
    },
    binned: {
      type: [Boolean, Number, String],
      default: 'auto',
      validator(value) {
        if (isString(value)) {
          return value === 'auto';
        }
        return true;
      },
    },
    layerStyle: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    layerStyle: {
      handler() {
        this.$geojsFeature.style(this.layerStyle).draw();
      },
      deep: true,
    },
  },
  mounted() {
    this.createLayer('feature', {
      features: ['heatmap'],
    });

    this.$geojsFeature = this.$geojsLayer.createFeature('heatmap', {
      intensity: this.intensity,
      position: this.position,
      maxIntensity: this.maxIntensity,
      minIntensity: this.minIntensity,
      updateDelay: this.updateDelay,
      binned: this.binned,
      style: this.layerStyle,
    });

    if (this.data) {
      this.$geojsFeature.data(this.data).draw();
    }
    bindWatchers(this, this.$geojsFeature, [
      'intensity', 'position', 'maxIntensity', 'minIntensity', 'updateDelay', 'binned', 'data',
    ]);
  },
};
</script>
