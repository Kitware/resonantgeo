import Vue from 'vue';
import Router from 'vue-router';

import ImageView from './ImageView';
import MapView from './MapView';
import HeatmapView from './HeatmapView';

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
    path: '/heatmap',
    name: 'Heatmap',
    component: HeatmapView,
  }, {
    path: '/image',
    name: 'Image',
    component: ImageView,
  }],
});
