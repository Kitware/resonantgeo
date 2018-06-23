<template lang="pug">
span
  v-btn(
    v-if='user',
    icon,
    color='grey lighten-1',
    @click='$emit("user", user)'
  )
    v-avatar
      span {{ initials }}
  span(v-else)
    v-btn(
      flat,
      @click='$emit("login")'
    ) Login
</template>

<script>
import girderApi from '../../mixins/girderApi';

export default {
  mixins: [girderApi],
  computed: {
    initials() {
      const first = this.user.firstName;
      const last = this.user.lastName;
      return this.createInitial(first) + this.createInitial(last);
    },
  },
  methods: {
    createInitial(name) {
      return name.charAt(0).toLocaleUpperCase();
    },
  },
};
</script>
