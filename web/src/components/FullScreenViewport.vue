<template lang="pug">
v-content.full-screen
  slot(name='main')
  side-panel(
    v-if='leftPanel',
    :top='top',
    :expanded='leftExpanded',
    @expand='leftExpanded = !leftExpanded'
  )
    slot(name='left')
  side-panel(
    v-if='rightPanel',
    :top='top',
    :expanded='rightExpanded',
    @expand='rightExpanded = !rightExpanded'
    :right='true'
  )
    slot(name='right')
</template>

<style lang="stylus">
.full-screen
  height 100%
  width 100%
</style>

<script>
import debounce from 'lodash-es/debounce';

import SidePanel from '@/components/SidePanel';


export default {
  components: {
    SidePanel,
  },
  props: {
    leftPanel: {
      type: Boolean,
      default: true,
    },
    rightPanel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      leftExpanded: true,
      rightExpanded: true,
      top: this.$vuetify.application.top + this.$vuetify.application.bar,
    };
  },
  methods: {
    // This is a hack to ensure that the map size is refreshed after the DOM
    // reflow has occurred.  It usually isn't necessary on resize events, but
    // vuetify has it's own resizing logic that gets applied asynchronously.
    onResize: debounce(function onResize() {
      this.$refs.viewer.refresh();
    }, 100),
  },
};
</script>

<style lang="stylus" scoped>
</style>
