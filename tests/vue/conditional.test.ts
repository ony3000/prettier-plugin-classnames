import { describe, expect, test } from 'vitest';
import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'single object, single property',
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
    name: 'single object, multiple property',
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
    name: 'single object, dynamic class name',
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
    name: 'ternary operator',
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
    name: 'ternary operator in array',
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
    name: 'typescript in template (single object, single property)',
    input: `
<template>
  <div :class="{ 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true as boolean }">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="{
      [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
      dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true as boolean,
    }"
  >
    <slot></slot>
  </div>
</template>
`,
  },
];

describe('vue/conditional', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
