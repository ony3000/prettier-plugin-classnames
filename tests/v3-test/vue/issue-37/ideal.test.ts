import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough object key (no error in v0.4.0, error in v0.5.0 ~ v0.6.0)',
    input: `
<template>
  <div
    :class="{
        'bg-black': true
    }">Some text</div>
</template>
`,
    output: `<template>
  <div
    :class="{
      'bg-black': true,
    }"
  >
    Some text
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
