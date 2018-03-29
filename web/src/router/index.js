import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Viewport from '@/components/Viewport';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/map',
      name: 'Map',
      component: Viewport,
    },
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld,
    },
  ],
});
