import forOwn from 'lodash-es/forOwn';
import isFunction from 'lodash-es/isFunction';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import * as components from './components';

function recursiveInstall(Vue, module) {
  forOwn(module, (component, name) => {
    if (component && isFunction(component.render)) {
      Vue.component(name, component);
    } else if (component && component.__esModule) {  // eslint-disable-line no-underscore-dangle
      recursiveInstall(Vue, component);
    }
  });
}

function install(Vue) {
  Vue.use(Vuetify);
  recursiveInstall(Vue, components);
}

export default {
  install,
};

export { components };
