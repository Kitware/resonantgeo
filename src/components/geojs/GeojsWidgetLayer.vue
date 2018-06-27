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

export default {
  mixins: [layerMixin],
  props: {
    // element size in pixels
    size: {
      type: Object,
      default() {
        return { width: 0, height: 0 };
      },
    },
    // offset in pixels
    offset: {
      type: Object,
      default() {
        return { x: 0, y: 0 };
      },
    },
    // position of center in lat/lon
    position: {
      type: Object,
      default() {
        return { x: 0, y: 0 };
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
      return {
        width: `${this.size.width}px`,
        height: `${this.size.height}px`,
        left: `${(this.center.x + this.offset.x) - (this.size.width / 2)}px`,
        top: `${(this.center.y + this.offset.y) - (this.size.height / 2)}px`,
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
      this.center = this.$geojsMap.gcsToDisplay(this.position);
      this.center.x += this.offset.x;
      this.center.y += this.offset.y;
    },
  },
};
</script>
