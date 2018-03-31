import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    center: [0, 0],
    zoom: 5,
  },
  mutations: {
    setCenter(state, center) {
      state.center = center;
    },
    setZoom(state, zoom) {
      state.zoom = zoom;
    },
  },
  actions: {
  },
});
