const girderApi = {
  props: {
    session: {
      type: Object,
      default() {
        return this.$girder;
      },
    },
  },
  computed: {
    user() {
      return this.session.user;
    },
  },
};

export default girderApi;
