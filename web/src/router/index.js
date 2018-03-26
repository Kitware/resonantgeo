import Vue from 'vue';
import Router from 'vue-router';
import Geo from '@/components/Geo';
import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Geo',
      component: Geo,
    },
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ],
});
