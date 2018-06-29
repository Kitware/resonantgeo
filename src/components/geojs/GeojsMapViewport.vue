<template lang="pug">
.geojs-map(v-resize='onResize')
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
import { normalizePoint } from './utils';

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
    zoomRange: {
      type: Object,
      default() {
        return { min: 0, max: 16 };
      },
    },
  },
  data() {
    return {
      ready: false,
      skipNextViewportEvent: false,
    };
  },
  provide() {
    const provided = {
      $geojs: geo,
    };
    Object.defineProperty(provided, '$geojsMap', {
      get: () => this.$geojsMap,
    });
    return provided;
  },
  watch: {
    zoomRange: {
      deep: true,
      handler() {
        this.$geojsMap.zoomRange(this.zoomRange);
      },
    },
    viewport: {
      deep: true,
      handler() {
        this.skipNextViewportEvent = true;
        this.$geojsMap.center(normalizePoint(this.viewport.center));
        this.$geojsMap.zoom(this.viewport.zoom);
        this.$geojsMap.rotation(this.viewport.rotation);
      },
    },
  },
  mounted() {
    this.$geojsViewport = true;
    this.$geojs = geo;
    this.$geojsMap = geo.map({
      node: this.$el,
      zoom: this.zoom,
      center: this.viewport.center,
      rotation: this.viewport.rotation,
      autoResize: false,
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

    // Setting the zoom range could modify the requested viewport.  Calling after
    // the map is ready ensures that the `update:viewport` event is triggered to
    // notify the parent.
    this.$nextTick(() => {
      this.$geojsMap.zoomRange(this.zoomRange);
    });
  },
  beforeDestroy() {
    this.$geojsMap.exit();
  },
  methods: {
    emitViewportEventsSync() {
      if (this.skipNextViewportEvent) {
        this.skipNextViewportEvent = false;
        return;
      }
      const center = this.$geojsMap.center();
      this.$emit('update:viewport', {
        center: [center.x, center.y],
        zoom: this.$geojsMap.zoom(),
        rotation: this.$geojsMap.rotation(),
      });
    },
    onResize() {
      if (!this.$geojsMap) {
        return;
      }

      const size = this.$el.getBoundingClientRect();
      const mapSize = this.$geojsMap.size();
      if (size.width !== mapSize.width || size.height !== mapSize.height) {
        this.$geojsMap.size(size);
      }
    },
  },
};
</script>
