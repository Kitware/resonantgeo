<template lang="pug">
full-screen-viewport
  ol-map-viewport

  side-panel(
    :top='64',
    :toolbar='panel.toolbar',
    :expanded='panel.expanded',
    :footer='true',
    :actions='panel.actions',
    @click-toolbar='infoToolbar.open = !infoToolbar.open',
    @click-action='clickAction'
  )
    v-expansion-panel
      v-expansion-panel-content(
        v-for='itemNumber in panel.items',
        :key='`item-${itemNumber}`'
      )
        div(slot='header') Item {{ itemNumber }}
        v-card
          v-card-text.text-xs-center
            | Expansion panel content for item {{ itemNumber }}
    template(slot='footer')
      span Side panel footer
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
</template>

<style lang="stylus" scoped>
.footer
  i
    cursor pointer
</style>

<script>
import FullScreenViewport from 'resonantgeo/FullScreenViewport';
import OlMapViewport from 'resonantgeo/OlMapViewport';
import SidePanel from 'resonantgeo/SidePanel';

export default {
  name: 'MapView',
  components: {
    FullScreenViewport,
    SidePanel,
    OlMapViewport,
  },
  data() {
    return {
      panel: {
        items: 2,
        toolbar: {
          title: 'Side panel',
          icon: 'info',
        },
        actions: [{
          name: 'add',
          icon: 'add_circle',
        }, {
          name: 'delete',
          icon: 'remove_circle',
        }],
        expanded: true,
      },
      infoToolbar: {
        open: false,
        title: 'Info',
        icon: 'close',
      },
    };
  },
  methods: {
    clickAction(name) {
      if (name === 'add') {
        this.panel.items += 1;
      } else if (name === 'delete') {
        this.panel.items = Math.max(0, this.panel.items - 1);
      }
    },
    clearItems() {
      this.panel.items = 0;
    },
  },
};
</script>
