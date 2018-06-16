import { createLocalVue } from '@vue/test-utils';

import ResonantGeo, { components } from '@';
import { Session } from '@/rest';

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

  it('installs girder session', () => {
    const localVue = createLocalVue();
    localVue.use(ResonantGeo, { girder: new Session() });
    expect(localVue.prototype).to.have.property('$girder');
  });
});
