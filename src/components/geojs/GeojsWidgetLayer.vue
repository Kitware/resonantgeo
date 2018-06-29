<template lang="pug">
.widget-content(:style='cssPosition')
  slot
</template>

<style lang="stylus" scoped>
.widget-content
  position absolute
  pointer-events none
</style>

<script>
import layerMixin from '../../mixins/geojsLayer';
import { normalizePoint } from './utils';

export default {
  mixins: [layerMixin],
  props: {
    // offset in pixels
    offset: {
      type: [Object, Array],
      default() {
        return [0, 0];
      },
    },
    // position of center in lat/lon
    position: {
      type: [Object, Array],
      default() {
        return [0, 0];
      },
    },
  },
  data() {
    return {
      center: { x: 0, y: 0 },
    };
  },
  computed: {
    cssPosition() {
      const center = normalizePoint(this.center);
      const offset = normalizePoint(this.offset);
      return {
        transform: 'translateX(-50%) translateY(-50%)',
        left: `${center.x + offset.x}px`,
        top: `${center.y + offset.y}px`,
      };
    },
  },
  watch: {
    position: {
      handler() {
        this.reposition();
      },
      deep: true,
    },
  },
  mounted() {
    this.createLayer('feature', {
      renderer: null,
    });
    this.$geojsLayer.canvas().css({ overflow: 'hidden' });
    this.$geojsLayer.canvas().append(this.$el);
    this.$geojsLayer.geoOn(this.$geojs.event.pan, () => this.reposition());
    this.reposition();
  },
  methods: {
    reposition() {
      const offset = normalizePoint(this.offset);
      this.center = this.$geojsMap.gcsToDisplay(normalizePoint(this.position));
      this.center.x += offset.x;
      this.center.y += offset.y;
    },
  },
};
</script>
