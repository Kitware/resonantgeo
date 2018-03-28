<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      persistent
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          value="true"
          @click="$router.push(item.route)"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      app
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"/>
      </v-btn>
      <v-toolbar-title v-text="title"/>
    </v-toolbar>
    <v-content>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </v-content>
    <v-navigation-drawer
      :right="right"
      v-model="rightDrawer"
      temporary
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import router from './router';

export default {
  name: 'App',
  data() {
    return {
      clipped: false,
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
