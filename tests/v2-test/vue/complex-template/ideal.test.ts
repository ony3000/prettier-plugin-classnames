import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'nested expression (1) - string literal basic',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      'consectetur adipiscing elit proin'
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet
        \${'consectetur adipiscing elit proin'} ex massa
        hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested expression (2) - template literal basic',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      \`consectetur adipiscing elit proin\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet
        \${'consectetur adipiscing elit proin'} ex massa
        hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested expression (1) - string literal basic',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${\`lorem
        ipsum dolor sit amet \${\`consectetur adipiscing elit
        proin\`} ex massa hendrerit eu posuere\`} ex massa
        hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested expression (2) - template literal basic',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${\`consectetur adipiscing elit proin\`} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${\`lorem
        ipsum dolor sit amet \${\`consectetur adipiscing elit
        proin\`} ex massa hendrerit eu posuere\`} ex massa
        hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested expression (3) - string literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${
        condition
          ? 'consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur
            adipiscing elit proin ex massa hendrerit eu
            posuere\`
        } ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested expression (4) - template literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${
        condition
          ? 'consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur
            adipiscing elit proin ex massa hendrerit eu
            posuere\`
        } ex massa hendrerit eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested expression (3) - string literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${\`lorem
        ipsum dolor sit amet \${
        condition
            ? 'consectetur adipiscing elit proin'
            : \`lorem ipsum dolor sit amet consectetur
              adipiscing elit proin ex massa hendrerit eu
              posuere\`
        } ex massa hendrerit eu posuere\`} ex massa hendrerit
        eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested expression (4) - template literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="\`lorem ipsum dolor sit amet \${\`lorem
        ipsum dolor sit amet \${
        condition
            ? 'consectetur adipiscing elit proin'
            : \`lorem ipsum dolor sit amet consectetur
              adipiscing elit proin ex massa hendrerit eu
              posuere\`
        } ex massa hendrerit eu posuere\`} ex massa hendrerit
        eu posuere\`"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
