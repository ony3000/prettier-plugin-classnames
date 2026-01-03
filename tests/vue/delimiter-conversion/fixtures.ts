import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`lorem ipsum do'or sit amet\`">
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
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
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
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];
