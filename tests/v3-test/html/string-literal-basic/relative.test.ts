import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'html',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'lorem ipsum dolor sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div v-bind:class="'lorem ipsum dolor sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'  lorem ipsum dolor sit amet  '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div v-bind:class="' lorem ipsum dolor sit amet '">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      'lorem ipsum\\
      dolor sit amet'
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div v-bind:class="'lorem ipsum dolor sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin'"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'   lorem ipsum dolor sit amet consectetur adipiscing elit proin   '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\` lorem ipsum dolor sit amet consectetur adipiscing elit
        proin \`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin'
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin'"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="'    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\` lorem ipsum dolor sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque \`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (1) - component',
    input: `
<template>
  <div>
    <Box v-bind:class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </Box>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Box
      v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </Box>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (2) - shorthand',
    input: `
<template>
  <div>
    <div :class="'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      :class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
