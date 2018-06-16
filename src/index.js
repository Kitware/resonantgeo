import forOwn from 'lodash-es/forOwn';
import isFunction from 'lodash-es/isFunction';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import bindWatchers from './bindWatchers';
import * as mixins from './mixins';
import * as components from './components';

function recursiveInstall(Vue, module) {
  forOwn(module, (component, name) => {
    if (component && isFunction(component.render)) {
      Vue.component(name, component);
    } else {
      recursiveInstall(Vue, component);
    }
  });
}

function install(Vue, options = {}) {
  const installComponents = Object.assign({}, components);
  Vue.use(Vuetify);
  if (options.girder) {
    Object.defineProperty(Vue.prototype, '$girder', {
      value: options.girder,
    });
  } else {
    delete installComponents.girder;
  }
  recursiveInstall(Vue, installComponents);
}

export default {
  install,
};

export {
  bindWatchers,
  components,
  mixins,
};
