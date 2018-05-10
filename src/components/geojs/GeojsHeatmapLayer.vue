<template lang="pug">
// geojs heatmap layer
</template>

<script>
import constant from 'lodash-es/constant';
import identity from 'lodash-es/identity';
import isFinite from 'lodash-es/isFinite';
import isString from 'lodash-es/isString';
import bindWatchers from './bindWatchers';

function intensityValidator(value) {
  return value === null || isFinite(value);
}

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    opacity: {
      type: Number,
      default: 1,
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
    data() {
      this.$geojsFeature.data(this.data).draw();
    },
    layerStyle() {
      this.$geojsFeature.style(this.layerStyle).draw();
    },
  },
  mounted() {
    // This is in place purely for testing because there is no way
    // in @vue/test-utils to put mocks in place *before* mount is called.
    //   https://github.com/vuejs/vue-test-utils/issues/560
    this.$parent = this.$parent || this.$options.testParent;

    if (!this.$parent || !this.$parent.$geojsMap) {
      throw new Error('Heatmap layer must be a child of a GeojsMapViewport');
    }
    this.$geojsLayer = this.$parent.$geojsMap.createLayer('feature', {
      opacity: this.opacity,
      features: ['heatmap'],
    });
    bindWatchers(this, this.$geojsLayer, ['opacity']);

    this.$geojsFeature = this.$geojsLayer.createFeature('heatmap', {
      intensity: this.intensity,
      position: this.position,
      maxIntensity: this.maxIntensity,
      minIntensity: this.minIntensity,
      updateDelay: this.updateDelay,
      binned: this.binned,
      style: this.style,
    });

    if (this.data) {
      this.$geojsFeature.data(this.data).draw();
    }
    bindWatchers(this, this.$geojsFeature, [
      'intensity', 'position', 'maxIntensity', 'minIntensity', 'updateDelay', 'binned',
    ]);
  },
  beforeDestroy() {
    this.$parent.$geojsMap.deleteLayer(this.$geojsLayer);
    delete this.$geojsLayer;
    delete this.$geojsFeature;
  },
};
</script>
