<template lang="pug">
v-toolbar.resonantgeo-toolbar(app, tabs, fixed, clipped-left)
  slot(name='left')
    v-tabs.mx-0(
      v-if='tabs.length',
      icons-and-text,
      :height='64',
      color='transparent'
    )
      v-tabs-slider
      v-tab.tab(
        v-for='tab in tabs',
        :key='tab.title',
        :to='tab.route',
        @click='$emit("click-tab", tab.title)'
      ) {{ tab.title }}
        v-icon {{ tab.icon }}
  v-spacer
  slot(name='title')
    v-toolbar-title {{ title }}
  v-spacer
  slot(name='right')
    v-btn.mx-3(
      v-if='userIcon'
      icon,
      color='grey lighten-1'
      @click='$emit("click-user")'
    )
      v-icon(small) {{ userIcon }}
</template>

<style lang="stylus" scoped>
.resonantgeo-toolbar
  z-index 4 // above the navigation drawer

.v-tabs
  width unset

  .tab
    min-width 100px
</style>

<style lang="stylus">
.resonantgeo-toolbar
  .v-toolbar__content
    padding 0
</style>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      required: true,
    },
    userIcon: {
      type: String,
      default: '',
    },
  },
};
</script>
