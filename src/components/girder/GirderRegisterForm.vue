<template lang="pug">
v-form(@submit.prevent='register')
  v-text-field(
    v-validate='"required|min:3"',
    v-model='login',
    label='Login name',
    autofocus,
    required,
    :error-messages='errors.collect("login")',
    data-vv-name='login'
  )
  v-text-field(
    v-validate='"required|email"',
    v-model='email',
    label='E-mail address',
    required,
    :error-messages='errors.collect("email")',
    data-vv-name='email'
  )
  v-text-field(
    v-validate='"required"',
    v-model='firstName',
    label='First name',
    required,
    :error-messages='errors.collect("first name")',
    data-vv-name='first name'
  )
  v-text-field(
    v-validate='"required"',
    v-model='lastName',
    label='Last name',
    required,
    :error-messages='errors.collect("last name")',
    data-vv-name='last name'
  )
  v-text-field(
    v-validate='"required|min:6|confirmed:confirmation"',
    v-model='password',
    type='password',
    label='Choose a password',
    required,
    :error-messages='errors.collect("password")',
    data-vv-name='password'
  )
  v-text-field(
    v-model='confirmPassword',
    type='password',
    label='Confirm password'
    required,
    data-vv-name='confirmPassword',
    ref='confirmation'
  )
  template(name='footer')
    small
      div(v-if='loginLink')
        span
          = 'Already have an account? '
          a(@click='$emit("login")') Log in here.
  v-btn(type='submit', color='primary', :disabled='registerInProgress',
      :loading='registerInProgress') Register
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
    loginLink: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      login: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      registerInProgress: false,
    };
  },
  methods: {
    async register() {
      this.$emit('update:error', '');
      if (!await this.validate()) {
        return null;
      }
      this.registerInProgress = true;
      let resp;
      try {
        resp = await this.session.$register(
          this.login,
          this.email,
          this.firstName,
          this.lastName,
          this.password,
        );
      } catch (err) {
        if (err.response && err.response.data) {
          this.$emit('update:error', err.response.data.message);
        } else {
          throw err;
        }
        return null;
      } finally {
        this.registerInProgress = false;
      }
      this.$emit('submit', resp.data);
      return resp.data;
    },
  },
};
</script>
