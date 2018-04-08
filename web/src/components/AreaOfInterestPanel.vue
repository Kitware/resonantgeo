<template lang="pug">
side-panel(
  :top='top',
  :expanded='expanded',
  :expansionButton='true',
  @expand='$emit("expand")'
)
  v-toolbar(dense, flat, class='transparent')
    v-list
      v-list-tile
        v-list-tile-title.title
          | Areas of Interest

  v-container
    v-layout(row)
      v-flex.xs9
        v-btn(color='primary darken-2', block, small)
          | Draw Area
          v-spacer
          v-icon(small) mode_edit
      v-flex.xs2.offset-xs1
        v-btn.smaller-button(color='primary', block, small)
          v-icon(small) file_upload

  v-card.darken(flat)
    v-card-text.py-0
      v-text-field(
        label='Search',
      )

  v-list.pa-0
    v-list-tile.pointer(avatar)
      v-list-tile-content
        v-list-tile-title
          | area_of_interest_1
        v-list-tile-sub-title
          | path/to/area
      v-list-tile-action
        v-icon(color='grey lighten-1') check_box_outline_blank
  template(slot='footer')
    v-spacer
    v-icon content_copy
    v-icon delete
</template>

<style lang="stylus" scoped>
.pointer
  cursor pointer

.darken
  background-color #e0e0e0 !important

button.smaller-button
  min-width 30px !important
</style>

<script>
import SidePanel from '@/components/SidePanel';

export default {
  components: {
    SidePanel,
  },
  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
    top: {
      type: Number,
      default: 0,
    },
  },
};
</script>
