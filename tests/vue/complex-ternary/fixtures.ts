import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) nested ternary - string literal ternary',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) nested ternary - template literal ternary',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
    ">
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
    name: '(3) nested ternary - nested expression in falsy part',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
    ">
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
    name: '(4) nested ternary - nested expression in truthy part',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
    ">
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
    name: '(5) double nested ternary - string literal ternary',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
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
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(6) double nested ternary - template literal ternary',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
    ">
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
    name: '(7) double nested ternary - nested expression in falsy part',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
    ">
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
    name: '(8) double nested ternary - nested expression in truthy part',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
    ">
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
