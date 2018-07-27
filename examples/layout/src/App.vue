<template lang="pug">
v-app
  app-toolbar(
    :tabs='tabs',
    :title='title',
    :userIcon='userIcon',
    :panelButton='true',
    @click-user='loginDialog = true',
    @click-panel='sidePanel = !sidePanel'
  )

  keep-alive
    router-view(:side-panel='sidePanel')

  dialog-container(
    v-model='loginDialog',
    title='Login',
    :error.sync='loginError'
  )
    v-form(
      v-model='login.valid',
      ref='login',
      lazy-validation
    )
      v-text-field(
        v-model='login.email'
        label='E-mail',
        :rules='login.rules',
        required
      )
      v-text-field(
        v-model='login.password',
        label='Password',
        :rules='login.rules',
        type='password',
        required
      )
      v-btn(
        @click.stop='loginDialog = false'
      ) Cancel
      v-btn(
        color='primary',
        @click.stop='submitLogin'
      )
        | Submit
</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden
</style>

<script>
import Vue from 'vue';
import ResonantGeo from 'resonantgeo';

Vue.use(ResonantGeo);

export default {
  name: 'App',
  data() {
    return {
      title: 'ResonantGEO Application Layout',
      tabs: [{
        title: 'Map',
        route: '/map',
        icon: 'zoom_out_map',
      }, {
        title: 'Heatmap',
        route: '/heatmap',
        icon: 'grain',
      }, {
        title: 'Image',
        route: '/image',
        icon: 'camera_alt',
      }],
      userIcon: 'account_circle',
      loginDialog: false,
      login: {
        email: '',
        password: '',
        rules: [
          v => !!v || 'Field is required',
        ],
      },
      loginError: '',
      sidePanel: true,
    };
  },
  methods: {
    submitLogin() {
      if (this.$refs.login.validate()) {
        this.loginError = 'Sorry, this login form is not connected to a server';
      }
    },
  },
};
</script>
