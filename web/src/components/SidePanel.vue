<template lang="pug">
v-navigation-drawer(
  clipped,
  persistent,
  :disable-resize-watcher='true',
  floating,
  absolute,
  height='',
  :style='style',
  v-model='expanded',
  :right='right'
)
  v-btn.expand-button(
    @click.stop='toggleExpand',
    :ripple='false',
    fixed,
    right,
    small,
    :style='buttonStyle'
  )
    v-icon(v-html='collapseIcon')
  slot
</template>

<style lang="stylus" scoped>
.navigation-drawer
  border 1px solid #ddd
  overflow visible

  .expand-button
    width 20px
    min-width 20px
    top 5px
    background-color white !important
    box-shadow none
    border-top 1px solid #ddd
    border-bottom 1px solid #ddd

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
  },
  data() {
    return {
      expanded: true,
    };
  },
  computed: {
    style() {
      return {
        marginTop: `${this.$vuetify.application.bar + this.$vuetify.application.top}px`,
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
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
      this.$emit('expanded', this.expanded);
    },
  },
};
</script>
