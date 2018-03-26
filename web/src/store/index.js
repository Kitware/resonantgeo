import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedIndex: 0,
  },
  mutations: {
    setSelectedIndex(state, index) {
      state.selectedIndex = index;
    },
  },
});

