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
    area-of-interest-item(
      v-for='item in items',
      :key='item.id',
      :name='item.name',
      :path='item.path',
      :checked='checked[item.id]',
      :selected='selected === item.id',
      @check='toggleChecked(item)',
      @select='$emit("select", item)'
    )
  template(slot='footer')
    v-spacer
    v-icon content_copy
    v-icon delete
</template>

<style lang="stylus" scoped>
.pointer
  cursor pointer

.darken
  background-color #eee !important

button.smaller-button
  min-width 30px !important
</style>

<script>
import AreaOfInterestItem from '@/components/AreaOfInterestItem';
import SidePanel from '@/components/SidePanel';

export default {
  components: {
    AreaOfInterestItem,
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
    items: {
      type: Array,
      default: () => [],
    },
    selected: { // eslint-disable-line vue/require-prop-types
      default: null,
    },
  },
  data() {
    return {
      checked: {},
    };
  },
  methods: {
    toggleChecked(item) {
      this.$set(this.checked, item.id, !this.checked[item.id]);
    },
  },
};
</script>
