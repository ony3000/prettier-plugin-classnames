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
    name: 'string literal (1)',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'string literal (2) - short enough class name',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'string literal (3) - multiple class name in array',
    input: `
<template>
  <div :class="['bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl', 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50']">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="[
      \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
      dark:border-neutral-500/30 px-4 py-4 rounded-xl\`,
      \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
      border-zinc-400/30 border bg-gray-100/50\`,
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'template literal',
    input: `
<template>
  <div :class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'conditional (1) - single object, single property',
    input: `
<template>
  <div :class="{ 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true }">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'conditional (2) - single object, multiple property',
    input: `
<template>
  <div :class="{
    'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl': true,
    'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50': false,
  }">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      [\`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
      dark:border-neutral-500/30 px-4 py-4 rounded-xl\`]: true,
      [\`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
      border-zinc-400/30 border bg-gray-100/50\`]: false,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'conditional (3) - single object, dynamic class name',
    input: `
<template>
  <div :class="{ [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true }">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'conditional (4) - ternary operator',
    input: `
<template>
  <div :class="true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="
      true
        ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
          dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
        : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
          border-zinc-400/30 border bg-gray-100/50\`
    "
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'conditional (5) - ternary operator in array',
    input: `
<template>
  <div :class="[
    true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
    true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
  ]">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="[
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
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'custom attributes (1)',
    input: `
<template>
  <div>
    <Callout :classes="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Callout
      :classes="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`"
    >
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
    options: {
      customAttributes: ['classes'],
    },
  },
  {
    name: 'custom attributes (2)',
    input: `
<template>
  <div>
    <Callout v-bind:classes="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Callout
      v-bind:classes="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`"
    >
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
    options: {
      customAttributes: ['classes'],
    },
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
  {
    name: 'reversibility (1) - short enough template literal class name',
    input: `
<template>
  <div :class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'reversibility (2) - short enough multi-line template literal class name',
    input: `
<template>
  <div
    :class="\`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4\`"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'reversibility (3) - short enough dynamic class name',
    input: `
<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4': true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'reversibility (4) - short enough multi-line dynamic class name',
    input: `
<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4\`]: true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4': true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'ending position (1)',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`"
  >
    <slot></slot>
  </div>
</template>
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (2)',
    input: `
<template>
  <div :class="classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="
      classNames(
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
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (3)',
    input: `
<template>
  <div :class="{ 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true }">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
    options: {
      endingPosition: 'absolute',
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
