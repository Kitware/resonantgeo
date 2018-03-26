<template lang="pug">
v-app
  v-navigation-drawer(
    persistent='' :mini-variant='miniVariant' :clipped='clipped' v-model='drawer'
    enable-resize-watcher='' fixed='' app=''
  )
    v-list
      v-list-tile(
        value='true' v-for='(item, i) in items' :key='i'
        @click="$store.commit('setSelectedIndex', i)"
      )
        v-list-tile-action
          v-icon(v-html="i === $store.state.selectedIndex ? item.icon : ''")
        v-list-tile-content
          v-list-tile-title(v-text='item.title')
  v-toolbar(app='' flat='' dark='' color='primary' :clipped-left='clipped')
    v-toolbar-side-icon(@click.stop='drawer = !drawer')
    v-btn(icon='' @click.stop='miniVariant = !miniVariant')
      v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
    //- v-btn(icon='' @click.stop='clipped = !clipped')
    //-   v-icon web
    //- v-btn(icon='' @click.stop='fixed = !fixed')
    //-   v-icon remove
    v-toolbar-title(v-text='title')
    v-spacer
    v-btn(icon='' @click.stop='rightDrawer = !rightDrawer')
      v-icon menu
  v-content
    router-view
  v-navigation-drawer(temporary='' :right='right' v-model='rightDrawer' fixed='' app='')
    v-list
      v-list-tile(@click='right = !right')
        v-list-tile-action
          v-icon compare_arrows
        v-list-tile-title Switch drawer (click me)
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'place',
          title: 'California',
        },
        {
          icon: 'place',
          title: 'Arizona',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Resonant Geo',
    };
  },
};
</script>
