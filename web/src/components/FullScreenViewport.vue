<template lang="pug">
v-content(:style='style')
  keep-alive
    slot
</template>

<script>
import debounce from 'lodash-es/debounce';
import Vue from 'vue';
import VueLayers from 'vuelayers';

import 'vuelayers/lib/style.css';

Vue.use(VueLayers);
export default {
  computed: {
    style() {
      return {
        height: `calc(100vh = ${this.$vuetify.application.bar + this.$vuetify.application.top}px)`,
      };
    },
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
