import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
};

const fixtures: Fixture[] = [
  {
    name: 'class attribute only (1)',
    input: `
<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
  <slot />
</div>
`,
    output: `<div
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50"
>
  <slot />
</div>
`,
  },
  {
    name: 'class attribute only (2) - short enough class name',
    input: `
<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
  <slot />
</div>
`,
    output: `<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
  <slot />
</div>
`,
  },
  {
    name: 'along with other attributes (1) - class is the first',
    input: `
<div
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
  tabindex="-1"
  title="Callout"
>
  <slot />
</div>
`,
    output: `<div
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50"
  tabindex="-1"
  title="Callout"
>
  <slot />
</div>
`,
  },
  {
    name: 'along with other attributes (2) - class is the last',
    input: `
<div
  tabindex="-1"
  title="Callout"
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
>
  <slot />
</div>
`,
    output: `<div
  tabindex="-1"
  title="Callout"
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50"
>
  <slot />
</div>
`,
  },
  {
    name: 'custom attributes',
    input: `
<div>
  <Callout classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
    Lorem ipsum
  </Callout>
</div>
`,
    output: `<div>
  <Callout
    classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50"
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
    name: 'reversibility - short enough multi-line class name',
    input: `
<div
  class="rounded-xl border border-zinc-400/30
    bg-gray-100/50 px-4 py-4"
>
  <slot />
</div>
`,
    output: `<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
  <slot />
</div>
`,
  },
  {
    name: 'ending position (1)',
    input: `
<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
  <slot />
</div>
`,
    output: `<div
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50"
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
<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
  <slot />
</div>
`,
    output: `<div
  class="rounded-xl border border-zinc-400/30 bg-gray-100/50
    px-4 py-4 dark:border-neutral-500/30
    dark:bg-neutral-900/50"
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

describe('astro/attribute-without-expression', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
