<template lang="pug">
v-app
  app-toolbar(
    :tabs='tabs',
    :title='title',
    :userIcon='userIcon'
  )
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

  .tab
    min-width 100px
</style>

<script>
import router from './router';
import AppToolbar from './components/AppToolbar';

export default {
  name: 'App',
  components: {
    AppToolbar,
  },
  data() {
    return {
      title: 'ResonantGEO',
      tabs: [{
        title: 'Explore',
        route: '/explore',
        icon: 'zoom_out_map',
      }, {
        title: 'Focus',
        route: '/focus',
        icon: 'filter_center_focus',
      }],
      userIcon: 'image',
    };
  },
  router,
};
</script>
