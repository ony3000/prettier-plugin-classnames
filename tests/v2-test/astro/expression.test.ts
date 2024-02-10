import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal (1)',
    input: `
<div class={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
  <slot />
</div>
`,
    output: `<div
  class={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
>
  <slot />
</div>
`,
  },
  {
    name: 'string literal (2) - short enough class name',
    input: `
<div class={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'}>
  <slot />
</div>
`,
    output: `<div class={"rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"}>
  <slot />
</div>
`,
  },
  {
    name: 'string literal (3) - multiple class name in array',
    input: `
<div class:list={['bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl', 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50']}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
    dark:border-neutral-500/30 px-4 py-4 rounded-xl\`,
    \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
    border-zinc-400/30 border bg-gray-100/50\`,
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'template literal',
    input: `
<div class={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}>
  <slot />
</div>
`,
    output: `<div
  class={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
>
  <slot />
</div>
`,
  },
  {
    name: 'conditional (1) - single object, single property',
    input: `
<div class:list={[{ 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true }]}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    },
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'conditional (2) - single object, multiple property',
    input: `
<div class:list={[
  {
    'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl': true,
    'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50': false,
  }
]}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      [\`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
      dark:border-neutral-500/30 px-4 py-4 rounded-xl\`]: true,
      [\`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
      border-zinc-400/30 border bg-gray-100/50\`]: false,
    },
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'conditional (3) - single object, dynamic class name',
    input: `
<div class:list={[{ [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true }]}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    },
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'conditional (4) - ternary operator',
    input: `
<div class:list={[true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50']}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    true
      ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
      : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`,
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'conditional (5) - ternary operator in array',
    input: `
<div class:list={[
  true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
  true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
]}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    true
      ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
      : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`,
    true
      ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
      : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`,
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'custom attributes',
    input: `
<div>
  <Callout classes={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
    Lorem ipsum
  </Callout>
</div>
`,
    output: `<div>
  <Callout
    classes={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
  >
    Lorem ipsum
  </Callout>
</div>
`,
    options: {
      customAttributes: ['classes'],
    },
  },
  {
    name: 'custom functions',
    input: `
---
import clsx from 'clsx'
---

<div class={clsx('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
  <slot />
</div>
`,
    output: `---
import clsx from "clsx";
---

<div
  class={clsx(
    \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
  )}
>
  <slot />
</div>
`,
    options: {
      customFunctions: ['clsx'],
    },
  },
  {
    name: 'reversibility (1) - short enough template literal class name',
    input: `
<div class={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>
  <slot />
</div>
`,
    output: `<div class={"rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"}>
  <slot />
</div>
`,
  },
  {
    name: 'reversibility (2) - short enough multi-line template literal class name',
    input: `
<div
  class={\`rounded-xl border border-zinc-400/30
    bg-gray-100/50 px-4 py-4\`}
>
  <slot />
</div>
`,
    output: `<div class={"rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"}>
  <slot />
</div>
`,
  },
  {
    name: 'reversibility (3) - short enough dynamic class name',
    input: `
<div
  class:list={[{
    [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true,
  }]}
>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
    },
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'reversibility (4) - short enough multi-line dynamic class name',
    input: `
<div
  class:list={[{
    [\`rounded-xl border border-zinc-400/30
    bg-gray-100/50 px-4 py-4\`]: true,
  }]}
>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
    },
  ]}
>
  <slot />
</div>
`,
  },
  {
    name: 'ending position (1)',
    input: `
<div class={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
  <slot />
</div>
`,
    output: `<div
  class={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
>
  <slot />
</div>
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (2)',
    input: `
<div class={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
  <slot />
</div>
`,
    output: `<div
  class={classNames(
    \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
  )}
>
  <slot />
</div>
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (3)',
    input: `
<div class:list={[{ 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true }]}>
  <slot />
</div>
`,
    output: `<div
  class:list={[
    {
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    },
  ]}
>
  <slot />
</div>
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (4)',
    input: `
<div class={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
  <slot />
</div>
`,
    output: `<div
  class={\`rounded-xl border border-zinc-400/30
    bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30
    dark:bg-neutral-900/50\`}
>
  <slot />
</div>
`,
    options: {
      printWidth: 60,
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('astro/expression', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
