<template lang="pug">
v-navigation-drawer.drawer-with-action-buttons(
  persistent,
  :height='height',
  :app='!floating',
  :absolute='floating',
  :fixed='!floating',
  :mobile-break-point='0',
  :style='style',
  v-model='expanded',
  :right='right',
)
  slot(name='toolbar')
    v-toolbar(
      v-if='toolbar',
      flat
    )
      v-toolbar-title {{ toolbar.title }}
      v-spacer
      v-btn(
        v-if='toolbar.icon',
        @click='$emit("click-toolbar")',
        icon
      )
        v-icon {{ toolbar.icon }}
  v-container.action-buttons.pa-0(
    :style='actionButtonsStyle'
  )
    slot(name='actions')
  slot
  v-footer.footer(
    v-if='footer',
    inset,
    absolute,
    height='unset'
  )
    v-system-bar.status(status)
      slot(name='footer')
</template>

<style lang="stylus" scoped>
.drawer-with-action-buttons
  overflow visible
  padding-bottom 0

.action-buttons
  position fixed
  top 64px
  width 50px

.footer
  height unset
  min-height unset

  .status
    border-top 1px solid #eee
    font-size 8pt
    background-color white
    width 100%
</style>

<script>
export default {
  props: {
    opacity: {
      type: Number,
      default: 1.0,
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
      default: false,
    },
    toolbar: {
      type: [Object, Boolean],
      default: false,
    },
    floating: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    style() {
      const style = {
        opacity: this.opacity,
        marginTop: `${this.top}px`,
        marginBottom: `${this.bottom}px`,
      };
      if (this.floating) {
        Object.assign(style, {
          top: `${this.margin}px`,
          bottom: `${this.margin}px`,
        });
      }
      return style;
    },
    height() {
      if (this.floating) {
        return '';
      }
      return `calc(100% - ${this.top + this.bottom}px)`;
    },
    actionButtonsStyle() {
      const side = this.right ? 'left' : 'right';
      return {
        [side]: '-50px',
      };
    },
  },
};
</script>
