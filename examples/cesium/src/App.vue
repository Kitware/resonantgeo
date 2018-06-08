<template lang="pug">
v-app
  app-toolbar(
    :title='title',
  )

  full-screen-viewport
    cesium-viewport
      cesium-point-cloud(
        :url='url',
        :featureStyle='featureStyle'
      )
</template>

<style lang="stylus">
html,body,.application,.application--wrap
  height 100vh
  overflow hidden

#cesium-container
  height calc(100vh - 65px)
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
      title: 'ResonantGEO cesium component',
      url: '/static/data',
      featureStyle: {
        color: '${COLOR} * 100', // eslint-disable-line no-template-curly-in-string
      },
    };
  },
};
</script>
