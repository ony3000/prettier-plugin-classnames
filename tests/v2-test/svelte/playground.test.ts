import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { testEach } from '../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte'],
  parser: 'svelte',
  printWidth: 60,
};

const fixtures: Fixture[] = [
  {
    name: 'Check the output without this plugin',
    input: ``,
    output: ``,
  },
];

testEach(fixtures, options);
