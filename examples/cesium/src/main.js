import Vue from 'vue';

import App from './App';

Vue.config.productionTip = false;

window.app = new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
