import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'class attribute only #1',
    input: `
<template>
  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class attribute only #2 (short enough class name)',
    input: `
<template>
  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'along with other attributes #1 (class is the first)',
    input: `
<template>
  <div
    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
    @focus="() => {}"
    @mouseover="() => {}"
    tabindex="-1"
    title="Callout"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50"
    @focus="() => {}"
    @mouseover="() => {}"
    tabindex="-1"
    title="Callout"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'along with other attributes #2 (class is the last)',
    input: `
<template>
  <div
    @focus="() => {}"
    @mouseover="() => {}"
    tabindex="-1"
    title="Callout"
    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    @focus="() => {}"
    @mouseover="() => {}"
    tabindex="-1"
    title="Callout"
    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50"
  >
    <slot></slot>
  </div>
</template>
`,
  },
];

describe('vue/enclosed-in-quotes', () => {
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
