<template lang="pug">
full-screen-viewport
  geojs-map-viewport(
    :viewport.sync='viewport',
    @click='clicked = $event'
  )
    geojs-tile-layer(
      v-if='baseLayer',
      :url='url',
      :attribution='attribution',
      :opacity='opacity'
    )
    geojs-annotation-layer(
      :drawing.sync='drawing',
      :editing.sync='editing',
      :editable='true',
      :annotations.sync='annotations',
      :initialGeojson='geojson'
    )

  side-panel(
    :top='64',
    :toolbar='panel.toolbar',
    :expanded='panel.expanded',
    :footer='true',
    :actions='panel.actions',
    @click-toolbar='infoToolbar.open = !infoToolbar.open',
    @click-action='drawing = $event'
  )
    v-card(
      v-for='annotation in annotations',
      :key='annotation.id()',
    )
      v-card-title.py-0
        span {{ annotation.name() }}
        v-spacer
        v-btn(icon, @click='clickDelete(annotation)')
          v-icon delete
    template(slot='footer')
      span {{ this.annotations.length }} annotations
      v-spacer
      v-icon(
        @click='clearItems'
      )
        | delete_sweep

  side-panel(
    :expanded='infoToolbar.open',
    :top='64',
    :right='true',
    :margin='200',
    :toolbar='infoToolbar',
    @click-toolbar='infoToolbar.open = false'
  )
    v-list
      v-list-tile
        v-list-tile-action
          v-icon filter_center_focus
        v-list-tile-title Last point clicked
      v-list-tile(
        v-if='clicked',
        avatar
      )
        v-list-tile-content
          v-list-tile-title
            | {{ clicked[0].toFixed(4) }}°, {{ clicked[1].toFixed(4) }}°

</template>

<style lang="stylus" scoped>
.footer
  i
    cursor pointer
</style>

<script>
export default {
  name: 'MapView',
  data() {
    return {
      annotations: [],
      drawing: false,
      editing: false,
      baseLayer: true,
      opacity: 1,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Tile data &copy; <a href="http://osm.org/copyright"> OpenStreetMap</a> contributors',
      viewport: {
        center: [-100, 30],
        zoom: 4,
      },
      panel: {
        toolbar: {
          title: 'Side panel',
          icon: 'info',
        },
        actions: [{
          name: 'point',
          icon: 'adjust',
        }, {
          name: 'rectangle',
          icon: 'aspect_ratio',
        }, {
          name: 'line',
          icon: 'timeline',
        }, {
          name: 'polygon',
          icon: 'label_outline',
        }],
        expanded: true,
      },
      infoToolbar: {
        open: false,
        title: 'Info',
        icon: 'close',
      },
      clicked: null,
      geojson: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-73.7569, 42.8495],
          },
        }],
      },
    };
  },
  methods: {
    clickAction(name) {
      this.drawing = name;
    },
    clearItems() {
      this.annotations = [];
    },
    clickDelete(annotation) {
      this.annotations = this.annotations.filter(a => a.id() !== annotation.id());
    },
  },
};
</script>
