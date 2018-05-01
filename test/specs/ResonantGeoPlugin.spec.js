import { createLocalVue } from '@vue/test-utils';

import ResonantGeo, { components } from '@';

describe('ResonantGeoPlugin', () => {
  it('registers vuetify', () => {
    const localVue = createLocalVue();
    localVue.use(ResonantGeo);
    expect(localVue.options.components).to.have.property('v-app');
  });

  it('exposes components', () => {
    expect(components).to.have.property('AppToolbar');
  });

  it('registers subcomponents', () => {
    const localVue = createLocalVue();
    localVue.use(ResonantGeo);
    expect(localVue.options.components).to.have.property('AppToolbar');
  });
});
