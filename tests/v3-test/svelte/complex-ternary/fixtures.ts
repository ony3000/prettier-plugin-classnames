import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) nested ternary - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(2) nested ternary - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(3) nested ternary - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(4) nested ternary - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(5) double nested ternary - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(6) double nested ternary - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(7) double nested ternary - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(8) double nested ternary - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: false,
    },
  },
  {
    name: '(exp-1) nested ternary - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-2) nested ternary - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-3) nested ternary - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-4) nested ternary - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-5) double nested ternary - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-6) double nested ternary - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-7) double nested ternary - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-8) double nested ternary - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      experimentalOptimization: true,
    },
  },
];
