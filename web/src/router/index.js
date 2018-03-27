import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Map from '@/components/Map';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Map',
      component: Map,
    },
    {
      path: '/hello',
      name: 'Hello',
      component: HelloWorld,
    },
  ],
});
