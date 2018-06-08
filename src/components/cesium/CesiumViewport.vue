<template lang="pug">
.cesium-viewport(:id='uniqueId')
  slot(v-if='ready')
</template>

<style lang='stylus'>
.cesium-viewport
  width 100%
  height 100%
</style>

<script>
import uniqueId from 'lodash-es/uniqueId';

export default {
  props: {
    // viewer options https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html
    options: {
      type: Object,
      default() {
        return {
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: true,
          geocoder: false,
          homeButton: true,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          projectionPicker: false,
        };
      },
    },
  },
  data() {
    return {
      uniqueId: uniqueId('cesium-container-'),
      ready: false,
    };
  },
  beforeDestroy() {
    this.$cesiumViewer.destroy();
  },
  mounted() {
    this.$cesium = this.getCesiumObject();
    this.$cesiumViewer = new this.$cesium.Viewer(
      this.uniqueId,
      Object.assign({
        fullscreenElement: this.uniqueId,
      }, this.options),
    );
    this.ready = true;
  },
  methods: {
    getCesiumObject() {
      if (!window.Cesium) {
        // eslint-disable-next-line no-console
        console.error(`Resonant GEO does not include the Cesium sources.  To use this component,
add a prebuilt bundle to your static assets and include the required javascript
and css before initializing your application.  For example:

<link href="/static/Cesium/Widgets/widgets.css" rel="stylesheet">
<script src="/static/Cesium/Cesium.js" />`);
        throw new Error('Global Cesium not found');
      }
      return window.Cesium;
    },
  },
};
</script>
