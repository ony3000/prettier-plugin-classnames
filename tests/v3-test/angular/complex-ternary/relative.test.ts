import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'angular',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'nested ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? 'lorem ipsum dolor sit amet'
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? 'lorem ipsum dolor sit amet'
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
