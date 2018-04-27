<template lang="pug">
.geojs-map
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
  mounted() {
    this.map = geo.map({
      node: this.$el,
      zoom: this.zoom,
      center: this.viewport.center,
      rotation: this.viewport.rotation,
    });
    this.map.createLayer('osm');
    this.map.geoOn(geo.event.pan, () => {
      this.emitViewportEvents();
    });
    this.map.geoOn(geo.event.mouseclick, (evt) => {
      this.$emit('click', [evt.geo.x, evt.geo.y]);
    });

    this.emitViewportEvents = this.emitViewportEventsSync;
    if (this.debounce > 0) {
      this.emitViewportEvents = debounce(this.emitViewportEventsSync, this.debounce);
    }
  },
  beforeDestroy() {
    if (this.map) {
      this.map.exit();
    }
  },
  methods: {
    emitViewportEventsSync() {
      const center = this.map.center();
      this.$emit('update:viewport', {
        center: [center.x, center.y],
        zoom: this.map.zoom(),
        rotation: this.map.rotation(),
      });
    },
  },
};
</script>
