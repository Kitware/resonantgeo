import Vue from 'vue';
import Router from 'vue-router';

import ImageView from './ImageView';
import MapView from './MapView';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    redirect: '/map',
  }, {
    path: '/map',
    name: 'Map',
    component: MapView,
  }, {
    path: '/image',
    name: 'Image',
    component: ImageView,
  }],
});
