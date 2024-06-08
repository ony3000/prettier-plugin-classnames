import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum do'or sit amet\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={"lorem ipsum do'or sit amet"}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (2) - delimiter is single quote',
    input: `
<div>
  <div>
    <div class={'lorem ipsum do\\'or sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={"lorem ipsum do'or sit amet"}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (3) - delimiter is double quote',
    input: `
<div>
  <div>
    <div class={"lorem ipsum do'or sit amet"}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={"lorem ipsum do'or sit amet"}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains double quote (1) - delimiter is backtick',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum do"or sit amet\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={'lorem ipsum do"or sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (2) - delimiter is single quote',
    input: `
<div>
  <div>
    <div class={'lorem ipsum do"or sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={'lorem ipsum do"or sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (3) - delimiter is double quote',
    input: `
<div>
  <div>
    <div class={"lorem ipsum do\\"or sit amet"}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={'lorem ipsum do"or sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains backtick (1) - delimiter is backtick',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
<div>
  <div>
    <div class={'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'contains backtick (3) - delimiter is double quote',
    input: `
<div>
  <div>
    <div class={"lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
];

testEach(fixtures, options);
