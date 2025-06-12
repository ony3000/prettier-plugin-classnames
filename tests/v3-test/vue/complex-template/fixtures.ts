import type { Fixture } from '../../../test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) nested expression - string literal basic',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) nested expression - template literal basic',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(3) double nested expression - string literal basic',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(4) double nested expression - template literal basic',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(5) nested expression - string literal ternary',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(6) nested expression - template literal ternary',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(7) double nested expression - string literal ternary',
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(8) double nested expression - template literal ternary',
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
    options: {
      printWidth: 60,
    },
  },
];
