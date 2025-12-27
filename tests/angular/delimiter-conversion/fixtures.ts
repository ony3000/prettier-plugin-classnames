import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'contains single quote - delimiter is single quote',
    input: `
<template>
  <div>
    <div [class]="'lorem ipsum do\\'or sit amet'">
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
    name: 'contains backtick - delimiter is single quote',
    input: `
<template>
  <div>
    <div [class]="'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];
