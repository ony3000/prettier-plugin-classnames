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
    name: 'string literal #2 (short enough class name)',
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
    name: 'template literal #1',
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
    name: 'string literal array',
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
];

describe('vue/attribute-bindings', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});