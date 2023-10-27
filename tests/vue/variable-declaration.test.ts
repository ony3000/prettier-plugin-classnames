import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal #1',
    input: `
<script setup lang="ts">
const combination = 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'
</script>

<template>
  <div :class="combination">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const combination =
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50";
</script>

<template>
  <div :class="combination">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'string literal #2 (wrapped in `classNames`)',
    input: `
<script setup lang="ts">
import classNames from 'classnames'

const combination = classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')
</script>

<template>
  <div :class="combination">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
import classNames from "classnames";

const combination = classNames(
  \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
  dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
);
</script>

<template>
  <div :class="combination">
    <slot></slot>
  </div>
</template>
`,
  },
];

describe('vue/variable-declaration', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
