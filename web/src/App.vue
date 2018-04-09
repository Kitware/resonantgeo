<template lang="pug">
v-app
  area-of-interest-panel(
    :top='$vuetify.application.bar + $vuetify.application.top',
    :expanded='leftPanel.expanded',
    :expansionButton='leftPanel.expansionButton',
    :items='leftPanel.items',
    :selected='leftPanel.selected',
    @expand='leftPanel.expanded = !leftPanel.expanded',
    @select='selectAOI',
  )

  v-toolbar(app)
    v-toolbar-title.px-2(v-text='title')

  full-screen-viewport
    router-view(
      ref='map',
      :viewport.sync='viewport',
      @pointer='pointer = $event',
      @singleclick='click = $event'
    )
  side-panel(
    :right='true',
    :top='$vuetify.application.bar + $vuetify.application.top',
    :expanded='rightPanel.expanded',
    :expansionButton='leftPanel.expansionButton',
    @expand='rightPanel.expanded = !rightPanel.expanded'
  )
    v-list
      v-list-tile
        v-list-tile-action
          v-icon filter_center_focus
        v-list-tile-title Viewport
      v-list-tile(avatar)
        v-list-tile-content
          v-list-tile-title Center
          v-list-tile-sub-title(v-html='formatPosition(viewport.center)')
      v-list-tile(avatar)
        v-list-tile-content
          v-list-tile-title Zoom
          v-list-tile-sub-title(v-html='viewport.zoom')
    span(slot='footer')
      v-icon location_on
      span(v-html='formatPosition(click)')

</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden
</style>

<script>
import SidePanel from './components/SidePanel';
import AreaOfInterestPanel from './components/AreaOfInterestPanel';
import FullScreenViewport from './components/FullScreenViewport';
import router from './router';

export default {
  name: 'App',
  components: {
    AreaOfInterestPanel,
    SidePanel,
    FullScreenViewport,
  },
  data() {
    return {
      leftPanel: {
        items: [{
          id: 0,
          name: 'area_of_interest_1',
          path: 'path/to/area1',
          checked: true,
        }, {
          id: 1,
          name: 'area_of_interest_2',
          path: 'path/to/area2',
        }, {
          id: 2,
          name: 'area_of_interest_3',
        }],
        expanded: true,
        expansionButton: true,
        selected: 0,
      },
      rightPanel: {
        expanded: false,
        expansionButton: true,
      },
      title: 'ResonantGEO',
      viewport: {
        center: [0, 0],
        zoom: 5,
      },
      pointer: [0, 0],
      click: [0, 0],
    };
  },
  router,
  methods: {
    selectAOI(item) {
      this.leftPanel.selected = item.id;
    },
    formatPosition(latlng) {
      function toDMS(D) {
        return [0|D, '° ', 0|(D<0?D=-D:D)%1*60, "' ", 0|D*60%1*60, '"'].join(''); // eslint-disable-line
      }
      const lon = toDMS(latlng[0]);
      const lat = toDMS(latlng[1]);
      return `${lat}, ${lon}`;
    },
  },
};
</script>
