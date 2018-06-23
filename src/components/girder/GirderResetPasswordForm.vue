<template lang="pug">
v-form(@submit.prevent='submit')
  v-text-field(
    v-validate="'required|email'",
    v-model='email',
    label='E-mail',
    autofocus,
    :error-messages='errors.collect("email")',
    data-vv-name='email',
    required
  )
  v-btn(type='submit', color='primary', :disabled='inProgress',
    :loading='inProgress') Submit
</template>

<script>
import { stringify } from 'qs';

import { girderApi, validation } from '../../mixins';

export default {
  mixins: [girderApi, validation],
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      email: '',
      inProgress: false,
    };
  },
  methods: {
    async submit() {
      if (!await this.validate()) {
        return;
      }
      this.inProgress = true;
      try {
        await this.session.put('user/password/temporary', stringify({ email: this.email }));
        this.$emit('submit');
      } catch (err) {
        this.$emit('update:error', err.response.data.message);
      } finally {
        this.inProgress = false;
      }
    },
  },
};
</script>
