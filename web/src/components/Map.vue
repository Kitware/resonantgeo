<template lang="pug">
vl-map.map-component(
  ref='viewer',
  :controls='false',
  :load-tiles-while-animating='true',
  :load-tiles-while-interacting='true',
  v-resize.quiet='onResize',
  @pointermove='$emit("pointer", $event.coordinate)'
  @singleclick='$emit("singleclick", $event.coordinate)'
)
  vl-view(
    :projection='projection',
    :center.sync='center',
    @update:center='emitViewportEvent',
    :zoom.sync= 'zoom',
    @update:zoom='emitViewportEvent',
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
    projection: {
      type: String,
      default: 'EPSG:4326',
    },
    viewport: {
      type: Object,
      default() {
        return { center: [0, 0], zoom: 5 };
      },
    },
  },
  data() {
    return {
      center: this.viewport.center,
      zoom: this.viewport.zoom,
    };
  },
  methods: {
    // This is a hack to ensure that the map size is refreshed after the DOM
    // reflow has occurred.  It usually isn't necessary on resize events, but
    // vuetify has it's own resizing logic that gets applied asynchronously.
    onResize: debounce(function onResize() {
      this.$refs.viewer.refresh();
    }, 100),
    emitViewportEvent: debounce(function emitViewportEvent() {
      this.$emit('update:viewport', {
        center: this.center,
        zoom: this.zoom,
      });
    }, 100),
  },
};
</script>
