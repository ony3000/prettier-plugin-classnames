import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal (1)',
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
    name: 'string literal (2) - wrapped in `classNames`',
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
  {
    name: 'custom functions',
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
    options: {
      customFunctions: ['clsx'],
    },
  },
];

describe('vue/variable-declaration', () => {
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
