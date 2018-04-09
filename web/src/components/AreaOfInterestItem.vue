<template lang="pug">
v-list-tile.pointer(
  :class='{ primary: selected, "white--text": selected }',
  @click.stop='$emit("select")',
  avatar
)
  v-list-tile-content
    v-list-tile-title
      v-icon.pr-2(v-if='selected') remove_red_eye
      | {{ name }}
    v-list-tile-sub-title(v-if='path')
      | {{ path }}
  v-list-tile-action(v-if='selected')
    span
      v-icon.pl-1(small, color='grey') save
      v-icon.pl-1(small, color='grey') content_copy
      v-icon.pl-1(small, color='grey') delete
  v-list-tile-action(v-else-if='checked')
    v-icon(color='grey', @click.stop='$emit("check")') check_box
  v-list-tile-action(v-else)
    v-icon(color='grey', @click.stop='$emit("check")') check_box_outline_blank
</template>

<style lang="stylus" scoped>
.pointer
  cursor pointer
</style>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: '',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
