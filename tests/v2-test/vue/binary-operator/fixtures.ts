import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) When expressions are joined by the logical AND operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="truthyExpression && 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(1) When expressions are joined by the logical AND operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="truthyExpression && 'lorem ipsum dolor sit amet' !== 'consectetur adipiscing elit proin ex massa hendrerit eu posuere' && 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(1) When expressions are joined by the logical AND operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="truthyExpression && (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
    name: '(2) When expressions are joined by the logical OR operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="falsyExpression || 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(2) When expressions are joined by the logical OR operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="falsyExpression || 'lorem ipsum dolor sit amet' === 'consectetur adipiscing elit proin ex massa hendrerit eu posuere' || 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(2) When expressions are joined by the logical OR operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="falsyExpression || (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
    name: '(3) When expressions are joined by the nullish coalescing operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="null ?? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(3) When expressions are joined by the nullish coalescing operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="null ?? void 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' ?? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'">
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
    name: '(3) When expressions are joined by the nullish coalescing operator, line wrapping is supported only in the last operand.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
<template>
  <div>
    <div :class="null ?? (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
