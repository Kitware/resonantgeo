<template lang="pug">
v-form(
  @submit.prevent='login'
)
  v-text-field(
    v-validate="'required'",
    v-model='username',
    label='Username or e-mail',
    autofocus,
    :error-messages='errors.collect("username")'
    data-vv-name='username'
  )
  v-text-field(
    v-validate="'required'",
    v-model='password',
    type='password',
    label='Password',
    :error-messages='errors.collect("password")'
    data-vv-name='password'
  )
  template(name='footer')
    small
      div(v-if='forgotPasswordLink')
        a(@click='$emit("reset")') Forgot your password?
      div(v-if='registerLink')
        span
          = 'Don\'t have an account yet? '
          a(@click='$emit("register")') Register here.
  v-btn(type='submit', color='primary', :disabled='loginInProgress',
      :loading='loginInProgress') Login
</template>

<script>
import { girderApi, validation } from '../../mixins';

export default {
  mixins: [girderApi, validation],
  props: {
    error: {
      type: String,
      default: '',
    },
    forgotPasswordLink: {
      type: Boolean,
      default: true,
    },
    registerLink: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      username: '',
      password: '',
      loginInProgress: false,
    };
  },
  methods: {
    async login() {
      this.$emit('update:error', '');
      if (!await this.validate()) {
        return null;
      }
      this.loginInProgress = true;
      let resp;
      try {
        resp = await this.session.$login(this.username, this.password);
      } catch (err) {
        this.$emit('update:error', 'Login failed');
        this.loginInProgress = false;
        if (!err.response || err.response.status !== 401) {
          throw err;
        }
        return null;
      }
      this.$emit('submit', resp.data);
      this.loginInProgress = false;
      return resp.data;
    },
  },
};
</script>
