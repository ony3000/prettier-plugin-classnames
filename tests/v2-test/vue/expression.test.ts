import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'ending position (5) - useTabs: true',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
\t<div
\t\t:class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50
\t\t\tpx-4 py-4 dark:border-neutral-500/30
\t\t\tdark:bg-neutral-900/50\`"
\t>
\t\t<slot></slot>
\t</div>
</template>
`,
    options: {
      printWidth: 70,
      useTabs: true,
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('vue/expression', () => {
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
