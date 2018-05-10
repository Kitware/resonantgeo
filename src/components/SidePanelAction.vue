<template lang="pug">
v-card.action-card(height='50px')
  v-btn.action-button.ma-0(
    dark,
    depressed,
    :color='color',
    :disabled='disabled',
    @click.stop='$emit("click", $event)'
  )
    slot
</template>

<style lang="stylus" scoped>
.action-button
  min-width unset
  width 100%
  height 100%
  border-radius 0
</style>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },

  },
};
</script>
