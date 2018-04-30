import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import components from './components';

function install(Vue) {
  Vue.use(Vuetify);

  components.forEach((component, name) => {
    Vue.component(name, component);
  });
}

export default {
  install,
};

export { components };
