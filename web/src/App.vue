<template lang="pug">
v-app
  side-panel
    v-list
      v-list-tile(
        v-for='(item, i) in items',
        :key='i',
        value='true',
        @click='$router.push(item.route)'
      )
        v-list-tile-action
          v-icon(v-html='item.icon')
        v-list-tile-content
          v-list-tile-title(v-text='item.title')

  v-toolbar(:clipped-left='clipped', app)
    v-toolbar-title.px-2(v-text='title')

  full-screen-viewport
    router-view
  side-panel(:right='true')
    v-list
      v-list-tile
        v-list-tile-action
          v-icon description
        v-list-tile-title Details
</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden
</style>

<script>
import SidePanel from './components/SidePanel';
import FullScreenViewport from './components/FullScreenViewport';
import router from './router';

export default {
  name: 'App',
  components: {
    SidePanel,
    FullScreenViewport,
  },
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
