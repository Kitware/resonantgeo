import Vue from 'vue';
import Vuetify from 'vuetify';
import VueLayers from 'vuelayers';
import 'vuetify/dist/vuetify.min.css';
import 'vuelayers/lib/style.css';

import App from './App';
import router from './router';

Vue.use(Vuetify);
Vue.use(VueLayers);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
