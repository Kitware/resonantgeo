import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { boolean, number, withKnobs } from '@storybook/addon-knobs/vue';

import Welcome from './Welcome';
import SidePanel from '../components/SidePanel';

storiesOf('Welcome', module).add('to Storybook', () => ({
  components: { Welcome },
  template: '<welcome :showApp="action" />',
  methods: { action: linkTo('Button') },
}));

storiesOf('Components', module)
  .addDecorator(withKnobs)
  .add('SidePanel', () => {
    const right = boolean('right', false);
    const expanded = boolean('expanded', true);
    const expansionButton = boolean('expansionButton', true);
    const margin = number('margin', 30, { range: true, min: 0, max: 100 });
    const opacity = number('opacity', 0.8, { range: true, min: 0, max: 1, step: 0.01 });
    return {
      components: { SidePanel },
      template: `<side-panel
        :right="${right}"
        :expansionButton="${expansionButton}"
        :margin="${margin}"
        :opacity="${opacity}"
        :expanded="${expanded}"
        @expand="expand"
        style="background-color: black">
      </side-panel>`,
      methods: {
        expand: action('expand event triggered'),
      },
    };
  });
