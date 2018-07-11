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

  v-container.main
    girder-job-list

  // p.user-info.text-xs-center
  //   span(v-if='$girder.user') You are logged in as #[b {{ $girder.user.login }}].
  //   span(v-else) You are not logged in.

  girder-user-dialog(
    :form.sync='userForm',
    v-model='userDialog'
  )
</template>

<style lang="stylus" scoped>
.user-info
  position absolute
  top 50%
  width 100%

.main
  margin-top 65px
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
