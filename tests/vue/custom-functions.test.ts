import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  customFunctions: ['clsx'],
};

const fixtures: Fixture[] = [
  {
    name: 'custom function #1',
    input: `
<script setup lang="ts">
import clsx from 'clsx'
</script>

<template>
  <div :class="clsx('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
import clsx from "clsx";
</script>

<template>
  <div
    :class="
      clsx(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )
    "
  >
    <slot></slot>
  </div>
</template>
`,
  },
];

describe('vue/custom-functions', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
