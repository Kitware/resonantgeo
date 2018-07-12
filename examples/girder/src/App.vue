<template lang="pug">
v-app
  app-toolbar(
    :title='title'
  )
    template(slot='right')
      v-btn(
        icon,
        @click='apiDialog = true'
      )
        v-icon settings
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
  dialog-container(
    v-model='apiDialog',
    title='Configure Girder API Root',
    :error='apiDialogError'
  )
    v-form(@submit.prevent='changeAPI')
      v-text-field(
        v-model='apiRootInput',
        label='Enter a new url'
      )
      v-btn(type='submit', color='primary') Submit
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
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      title: 'ResonantGEO Girder components',
      userDialog: false,
      userForm: '',
      user: null,
      apiDialog: false,
      apiRootInput: this.$girder.apiRoot,
      apiDialogError: '',
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
    async changeAPI() {
      this.apiDialogError = '';
      try {
        await axios.get('user/me', {
          baseURL: this.apiRootInput,
        });
      } catch (err) {
        this.apiDialogError = 'Could not connect to Girder at the provided URL';
        return;
      }

      this.$girder.apiRoot = this.apiRootInput;
      localStorage.setItem('apiRoot', this.apiRootInput);
      await this.$girder.$refresh();
      this.apiDialog = false;
    },
  },
};
</script>
