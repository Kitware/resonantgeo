<template lang="pug">
vl-map.map-component(
  ref='viewer',
  :controls='false',
  v-resize.quiet='onResize'
)
  vl-view(
    :center.sync='mapCenter',
    :zoom.sync= 'mapZoom'
  )
  vl-layer-tile
    vl-source-osm
</template>

<script>
import debounce from 'lodash-es/debounce';
import Vue from 'vue';
import VueLayers from 'vuelayers';

import 'vuelayers/lib/style.css';

Vue.use(VueLayers);
export default {
  props: {
    center: {
      type: Array,
      default: () => [0, 0],
    },
    zoom: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      mapCenter: this.center,
      mapZoom: this.zoom,
    };
  },
  watch: {
    mapCenter() {
      this.$emit('update:center', this.mapCenter);
    },
    mapZoom() {
      this.$emit('update:zoom', this.mapZoom);
    },
  },
  methods: {
    // This is a hack to ensure that the map size is refreshed after the DOM
    // reflow has occurred.  It usually isn't necessary on resize events, but
    // vuetify has it's own resizing logic that gets applied asynchronously.
    onResize: debounce(function onResize() {
      this.$refs.viewer.refresh();
    }, 100),
    emitViewportEvent: debounce(function emitViewportEvent() {
      this.$emit('viewport', {
        center: this.center,
        zoom: this.zoom,
      });
    }, 100),
    setViewport(viewport) {
      this.center = viewport.center;
      this.zoom = viewport.zoom;
    },
  },
};
</script>
