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
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum do'or sit amet\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div v-bind:class="'lorem ipsum do\\'or sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (2) - delimiter is single quote',
    input: `
<template>
  <div>
    <div v-bind:class="'lorem ipsum do\\'or sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div v-bind:class="'lorem ipsum do\\'or sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains backtick (1) - delimiter is backtick',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
<template>
  <div>
    <div v-bind:class="'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
