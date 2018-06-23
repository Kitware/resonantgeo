<template lang="pug">
v-app
  app-toolbar(
    :title='title'
  )
    template(slot='right')
      girder-user-button(
        @login='login',
        @user='logout'
      )

  p.user-info.text-xs-center
    span(v-if='$girder.user') You are logged in as #[b {{ $girder.user.login }}].
    span(v-else) You are not logged in.

  girder-user-dialog(
    :form.sync='userForm',
    v-model='userDialog'
  )
</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden

  .user-info
    position absolute
    top 50%
    width 100%
</style>

<script>
export default {
  name: 'App',
  data() {
    return {
      title: 'ResonantGEO Girder components',
      userDialog: false,
      userForm: '',
      user: null,
    };
  },
  methods: {
    login() {
      this.userForm = 'login';
      this.userDialog = true;
    },
    logout() {
      this.userForm = 'logout';
      this.userDialog = true;
    },
  },
};
</script>
