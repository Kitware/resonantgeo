<template lang="pug">
full-screen-viewport
  ol-map-viewport

  side-panel(
    :top='64',
    :toolbar='toolbar',
    :actions='actions',
    :expanded='expanded',
    :right='false',
    :footer='true'
  )
    v-expansion-panel
      v-expansion-panel-content
        div(slot='header') my_working_set_1
        v-card
          v-card-text.text-xs-center
            | No filtered data sets
    v-btn.ma-0(
      dark,
      depressed,
      block,
      large,
      color='primary darken-1'
    )
      v-icon(left, dark) add_circle
      | New Working Set

    template(slot='footer')
      v-spacer
      v-icon(
        @click='$emit("clear")'
      ) delete_sweep
</template>

<style lang="stylus" scoped>
.footer
  i
    cursor pointer
</style>

<script>
import OlMapViewport from '@/components/OlMapViewport';
import SidePanel from '@/components/SidePanel';
import FullScreenViewport from '@/components/FullScreenViewport';

export default {
  name: 'ExplorePersona',
  components: {
    SidePanel,
    FullScreenViewport,
    OlMapViewport,
  },
  data() {
    return {
      toolbar: {
        title: 'Working Sets',
        icon: 'more_vert',
      },
      actions: [{
        name: 'draw-rectangle',
        icon: 'aspect_ratio',
      }, {
        name: 'draw-point',
        icon: 'adjust',
      }, {
        name: 'draw-line',
        icon: 'timeline',
      }, {
        name: 'upload',
        icon: 'open_in_browser',
      }],
      expanded: true,
    };
  },
};
</script>
