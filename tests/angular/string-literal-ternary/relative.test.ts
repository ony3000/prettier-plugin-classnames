import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'angular',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div [class]="condition ? 'lorem ipsum dolor sit amet' : 'lorem ipsum dolor sit amet'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet'
          : 'lorem ipsum dolor sit amet'
      "
    >
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
    <div [class]="condition ? '  lorem ipsum dolor sit amet  ' : '  lorem ipsum dolor sit amet  '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? ' lorem ipsum dolor sit amet '
          : ' lorem ipsum dolor sit amet '
      "
    >
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
    <div [class]="
      condition ? 'lorem ipsum
      dolor sit amet' : 'lorem ipsum
      dolor sit amet'
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet'
          : 'lorem ipsum dolor sit amet'
      "
    >
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
    <div [class]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
      "
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
    <div [class]="condition ? '   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ' : '   lorem ipsum dolor sit amet consectetur adipiscing elit proin   '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? ' lorem ipsum dolor sit amet consectetur adipiscing elit
            proin '
          : ' lorem ipsum dolor sit amet consectetur adipiscing elit
            proin '
      "
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
    <div [class]="
      condition ? 'lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin' : 'lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
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
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
      "
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
    <div [class]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque'
      "
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
    <div [class]="condition ? '    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ' : '    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    '">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [class]="
        condition
          ? ' lorem ipsum dolor sit amet consectetur adipiscing elit
            proin ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque '
          : ' lorem ipsum dolor sit amet consectetur adipiscing elit
            proin ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque '
      "
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
    <div [class]="
      condition ? 'lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque' : 'lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
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
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque'
      "
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
    <Box [class]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </Box>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Box
      [class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
      "
    >
      <slot></slot>
    </Box>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (2) - property binding',
    input: `
<template>
  <div>
    <div [className]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [className]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (3) - attribute binding',
    input: `
<template>
  <div>
    <div [attr.class]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [attr.class]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (4) - built-in directive',
    input: `
<template>
  <div>
    <div [ngClass]="condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      [ngClass]="
        condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
          : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere'
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
