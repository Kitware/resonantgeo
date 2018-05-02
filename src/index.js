import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import * as components from './components';

function install(Vue) {
  Vue.use(Vuetify);

  Object.keys(components).forEach((name) => {
    Vue.component(name, components[name]);
  });
}

export default {
  install,
};

export { components };
