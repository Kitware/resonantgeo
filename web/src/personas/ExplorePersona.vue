<template lang="pug">
full-screen-viewport(
  :rightPanel='false'
)
  map-view(slot='main')

  template(slot='left')
    v-toolbar(flat)
      v-toolbar-title
        | Working Sets
      v-spacer
      v-btn(icon)
        v-icon more_vert
</template>

<style lang="stylus" scoped>
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
    return {};
  },
};
</script>
