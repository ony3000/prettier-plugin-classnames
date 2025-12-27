import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
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
    options: {
      singleQuote: false,
    },
  },
];
