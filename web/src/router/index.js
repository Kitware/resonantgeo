import Vue from 'vue';
import Router from 'vue-router';
import ExplorePersona from '@/personas/ExplorePersona';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/explore',
    },
    {
      path: '/explore',
      name: 'Explore',
      component: ExplorePersona,
    },
  ],
});
