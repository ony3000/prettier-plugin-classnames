import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  endingPosition: 'absolute',
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
