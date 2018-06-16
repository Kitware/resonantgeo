<template lang="pug">
v-dialog(
  :max-width='maxWidth',
  :transition='transition',
  :value='value',
  @input='$emit("input", $event)',
  @keydown.esc.prevent='$emit("input", false)'
)
  v-card
    slot(name='title')
      v-toolbar.primary(card, dark)
        v-toolbar-title {{ title }}
        v-spacer
        v-btn(icon, @click='$emit("input", false)')
          v-icon close
    slot(name='error')
      v-alert.dialog-alert.ma-0(
        dismissible
        transition='scale-transition',
        :value='!!error',
        @input='$emit("update:error", "")',
        type='error') {{ error }}
    v-card-text
      slot
</template>

<style lang='stylus'>
.dialog-alert
  border none
</style>

<script>
export default {
  props: {
    error: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '500px',
    },
    title: {
      type: String,
      default: '',
    },
    transition: {
      type: String,
      default: 'fade-transition',
    },
    value: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
