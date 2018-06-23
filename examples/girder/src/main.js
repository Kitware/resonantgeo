import Vue from 'vue';
import ResonantGeo from 'resonantgeo';
import { Session } from 'resonantgeo/rest';

import App from './App';

const apiRoot = 'https://data.kitware.com/api/v1';

const girder = new Session({ apiRoot });
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
