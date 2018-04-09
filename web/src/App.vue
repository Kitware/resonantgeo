<template lang="pug">
v-app
  v-toolbar(app, tabs)
    v-tabs.mx-0(icons-and-text, :height='64', color='transparent')
      v-tabs-slider
      v-tab(to='/explore')
        | Explore
        v-icon zoom_out_map
      v-tab(to='/focus')
        | Focus
        v-icon filter_center_focus
    v-spacer
    v-toolbar-title
      | {{ title }}
    v-spacer
    v-btn.mx-3(icon, color='grey lighten-1')
      v-icon(small) image
  keep-alive
    router-view
</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden
</style>

<style lang="stylus" scoped>
.tabs
  width unset
</style>

<script>
import router from './router';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      clipped: true,
      items: [{
        icon: 'home',
        title: 'Home',
        route: '/',
      }, {
        icon: 'map',
        title: 'Map',
        route: '/map',
      }],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'ResonantGEO',
    };
  },
  router,
};
</script>
