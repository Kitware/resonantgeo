<template lang="pug">
v-form(@submit.prevent="logout")
  slot
    p.text-xs-center.ma-4
      span(v-if='user') You are logged in as #[b {{ fullName }}].
      span(v-else) You are not logged in.
  v-btn(type="submit", color="primary", :disabled="logoutInProgress",
    :loading="logoutInProgress") {{ button }}
</template>

<script>
import girderApi from '../../mixins/girderApi';

export default {
  mixins: [girderApi],
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      logoutInProgress: false,
    };
  },
  computed: {
    button() {
      if (this.user) {
        return 'Logout';
      }
      return 'Okay';
    },
    fullName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    },
  },
  methods: {
    async logout() {
      this.$emit('update:error', '');
      this.logoutInProgress = true;
      try {
        await this.session.$logout();
      } finally {
        this.logoutInProgress = false;
        this.$emit('submit');
      }
    },
  },
};
</script>
