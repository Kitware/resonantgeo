<template lang="pug">
dialog-container(
  :value='value',
  :title='title',
  :error.sync='error',
  @input='$emit("input", $event)'
)
  girder-login-form(
    v-if='form === "login"',
    :error.sync='error',
    @submit='$emit("input", false)',
    @reset='showForm("reset")'
    @register='showForm("register")'
  )
  girder-register-form(
    v-if='form === "register"',
    :error.sync='error',
    @submit='$emit("input", false)',
    @login='showForm("login")',
  )
  girder-reset-password-form(
    v-if='form === "reset"',
    :error.sync='error',
    @submit='$emit("input", false)'
  )
  girder-logout-form(
    v-if='form === "logout"',
    :error.sync='error',
    @submit='$emit("input", false)',
  )
</template>

<script>
import girderApi from '../../mixins/girderApi';

export default {
  mixins: [girderApi],
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    form: {
      type: String,
      default: 'login',
    },
    appName: {
      type: String,
      default: 'Girder',
    },
  },
  data() {
    return {
      error: '',
    };
  },
  computed: {
    title() {
      if (this.form === 'login') {
        return `Log in to ${this.appName}`;
      } else if (this.form === 'register') {
        return 'Register a new account';
      } else if (this.form === 'reset') {
        return 'Reset password';
      }
      return '';
    },
  },
  watch: {
    form() {
      // reset error state when switching forms
      this.error = '';
    },
  },
  methods: {
    showForm(form) {
      this.$emit('update:form', form);
    },
  },
};
</script>
