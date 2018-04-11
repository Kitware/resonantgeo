<template lang="pug">
full-screen-viewport
  map-view

  side-panel(
    :top='64',
    :expanded='expanded'
  )
    v-toolbar(flat)
      v-toolbar-title
        | Working Sets
      v-spacer
      v-btn(icon)
        v-icon more_vert

    v-container.action-buttons.pa-0
      v-card(height='50px')
        v-btn.action-button.ma-0(
          dark,
          depressed
          color='primary',
        )
          v-icon aspect_ratio
      v-card(height='50px')
        v-btn.action-button.ma-0(
          dark,
          depressed
          color='primary',
        )
          v-icon adjust
      v-card(height='50px')
        v-btn.action-button.ma-0(
          dark,
          depressed
          color='primary',
        )
          v-icon timeline
      v-card(height='50px')
        v-btn.action-button.ma-0(
          dark,
          depressed
          color='primary',
        )
          v-icon open_in_browser
</template>

<style lang="stylus" scoped>
.action-buttons
  position fixed
  top 64px
  right -50px
  width 50px

  .action-button
    min-width unset
    width 100%
    height 100%
</style>

<script>
import MapView from '@/components/MapView';
import SidePanel from '@/components/SidePanel';
import FullScreenViewport from '@/components/FullScreenViewport';

export default {
  name: 'ExplorePersona',
  components: {
    SidePanel,
    FullScreenViewport,
    MapView,
  },
  data() {
    return {
      expanded: true,
      leftPanel: {
        actionButtons: [
          { icon: 'search' },
          { icon: 'search' },
        ],
      },
    };
  },
};
</script>
