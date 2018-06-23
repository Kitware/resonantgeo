export default {
  $_veeValidate: {
    validator: 'new',
  },
  methods: {
    async validate() {
      return this.$validator.validateAll();
    },
  },
};
