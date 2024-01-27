import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'enclosed-in-quotes #1',
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
    name: 'attribute-bindings #1',
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
    name: 'attribute-bindings #2',
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
  },
  {
    name: 'conditional #1',
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
    name: 'prettier-ignore #1',
    input: `
<template>
  <div :class="[
    // prettier-ignore
    'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
    'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
  ]">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="[
      // prettier-ignore
      'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
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

describe('vue/ending-position', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
