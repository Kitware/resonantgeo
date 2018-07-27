import 'babel-polyfill';

import Vue from 'vue';
import ResonantGeo from 'resonantgeo';
import { Session } from 'resonantgeo/src/rest';

import App from './App';

const apiRoot = localStorage.getItem('apiRoot') || 'https://data.kitware.com/api/v1';
const girder = new Session({ apiRoot, enableSSE: true, global: true });
girder.$refresh().then(() => {
  Vue.use(ResonantGeo, {
    girder,
  });

  Vue.config.productionTip = false;

  window.app = new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
  });
});
