<template lang="pug">
v-app
  app-toolbar(
    :tabs='tabs',
    :title='title',
    :userIcon='userIcon'
    @click-user='loginDialog = true'
  )

  keep-alive
    router-view

  // To be replaced by a login-dialog component
  v-dialog(
    max-width='500px',
    v-model='loginDialog',
    transition='fade-transition'
  )
    v-card
      v-card-title Login
      v-card-text
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
import AppToolbar from 'resonantgeo/components/AppToolbar';
import SidePanel from 'resonantgeo/components/SidePanel';

export default {
  name: 'App',
  components: {
    AppToolbar,
    SidePanel,
  },
  data() {
    return {
      title: 'ResonantGEO Application Layout',
      tabs: [{
        title: 'Map',
        route: '/map',
        icon: 'zoom_out_map',
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
    };
  },
  methods: {
    submitLogin() {
      if (this.$refs.login.validate()) {
        console.log(`logged in as ${this.login.email}`); // eslint-disable-line no-console
        this.loginDialog = false;
      }
    },
  },
};
</script>
