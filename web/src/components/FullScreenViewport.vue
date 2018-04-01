<template lang="pug">
v-content.full-screen
  keep-alive
    slot
</template>

<style lang="stylus" scoped>
.full-screen
  height 100%
  width 100%
</style>

<script>
import debounce from 'lodash-es/debounce';
import Vue from 'vue';
import VueLayers from 'vuelayers';

import 'vuelayers/lib/style.css';

Vue.use(VueLayers);
export default {
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
