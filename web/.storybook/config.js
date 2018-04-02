import 'vuetify/dist/vuetify.min.css';

import { configure } from '@storybook/vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

// automatically import all files ending in *.stories.js
const req = require.context('../src/stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
