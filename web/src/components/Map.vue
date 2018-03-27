<template lang="pug">
vl-map.map-component(ref="viewer")
  vl-view
  vl-layer-tile
    vl-source-osm
</template>

<script>
import Vue from 'vue';
import VueLayers from 'vuelayers';

import 'vuelayers/lib/style.css';

Vue.use(VueLayers);

export default {
  data() {
    return {};
  },
};
</script>

<style lang="stylus" scoped>
</style>
