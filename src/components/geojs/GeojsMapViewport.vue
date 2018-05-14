<template lang="pug">
.geojs-map
  slot(v-if='ready')
</template>

<style lang="stylus" scoped>
.geojs-map
  width 100%
  height 100%
</style>

<script>
import debounce from 'lodash-es/debounce';
import geo from 'geojs';

export default {
  props: {
    viewport: {
      type: Object,
      default() {
        return {
          center: [0, 0],
          zoom: 3,
          rotation: 0,
        };
      },
    },
    debounce: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      ready: false,
    };
  },
  mounted() {
    this.$geojsViewport = true;
    this.$geojs = geo;
    this.$geojsMap = geo.map({
      node: this.$el,
      zoom: this.zoom,
      center: this.viewport.center,
      rotation: this.viewport.rotation,
    });
    this.$geojsMap.geoOn(geo.event.pan, () => {
      this.emitViewportEvents();
    });
    this.$geojsMap.geoOn(geo.event.mouseclick, (evt) => {
      this.$emit('click', [evt.geo.x, evt.geo.y]);
    });

    this.emitViewportEvents = this.emitViewportEventsSync;
    if (this.debounce > 0) {
      this.emitViewportEvents = debounce(this.emitViewportEventsSync, this.debounce);
    }
    this.ready = true;
  },
  beforeDestroy() {
    this.$geojsMap.exit();
  },
  methods: {
    emitViewportEventsSync() {
      const center = this.$geojsMap.center();
      this.$emit('update:viewport', {
        center: [center.x, center.y],
        zoom: this.$geojsMap.zoom(),
        rotation: this.$geojsMap.rotation(),
      });
    },
  },
};
</script>
