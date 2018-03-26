import Vue from 'vue';
import HelloWorld from '@/components/HelloWorld';

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.hello').textContent)
    .to.contain('First, solve the problem. Then, write the code.');
  });
});
