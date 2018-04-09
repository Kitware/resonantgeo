<template lang="pug">
v-navigation-drawer(
  clipped,
  persistent,
  :disable-resize-watcher='true',
  floating,
  absolute,
  :permanent='true',
  height='',
  :style='style',
  v-model='expanded',
  :right='right'
)
  slot
</template>

<style lang="stylus" scoped>
</style>

<script>
export default {
  props: {
    opacity: {
      type: Number,
      default: 0.9,
    },
    margin: {
      type: Number,
      default: 50,
    },
    right: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
    expanded: {
      type: Boolean,
      default: true,
    },
    expansionButton: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    style() {
      return {
        marginTop: `${this.top}px`,
        marginBottom: `${this.bottom}px`,
        opacity: this.opacity,
        top: `${this.margin}px`,
        bottom: `${this.margin}px`,
      };
    },
    buttonStyle() {
      if (this.right) {
        return {
          left: '-20px',
          borderLeft: '1px solid #ddd',
        };
      }
      return {
        right: '-20px',
        borderRight: '1px solid #ddd',
      };
    },
    collapseIcon() {
      if (this.right) {
        return this.expanded ? 'keyboard_arrow_right' : 'keyboard_arrow_left';
      }
      return this.expanded ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
    },
  },
};
</script>
