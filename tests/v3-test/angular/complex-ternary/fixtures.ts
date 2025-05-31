import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) nested ternary',
    input: `
<template>
  <div>
    <div [class]="
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
    name: '(2) double nested ternary',
    input: `
<template>
  <div>
    <div [class]="
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
];
