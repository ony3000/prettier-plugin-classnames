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
    name: 'ignore comment (1)',
    input: `
<!-- prettier-ignore -->
<template>
  <div :class="[
    'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
    'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
  ]">
    <slot></slot>
  </div>
</template>
`,
    output: `<!-- prettier-ignore -->
<template>
  <div :class="[
    'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
    'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
  ]">
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'ignore comment (2)',
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
  {
    name: 'ignore comment (3)',
    input: `
<template>
  <div>
    <!-- prettier-ignore -->
    <div :class="[
      'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
      'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
    ]">
      <slot></slot>
    </div>
    <div :class="[
      'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
      'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
    ]">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <!-- prettier-ignore -->
    <div :class="[
      'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
      'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
    ]">
      <slot></slot>
    </div>
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
  </div>
</template>
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
<!--
 ! prettier-ignore
-->
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<!--
 ! prettier-ignore
-->
<template>
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
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
<!-- /* prettier-ignore */ -->
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<!-- /* prettier-ignore */ -->
<template>
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
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (3) - non-html style comment for template tag',
    input: `
/* prettier-ignore */
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `/* prettier-ignore */
<template>
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
    name: 'reversibility (1)',
    input: `
<template>
  <div
    :class="[
      // prettier-ignore
      \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
      \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="[
      // prettier-ignore
      \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'reversibility (2)',
    input: `
<template>
  <div
    :class="[
      // prettier-ignore
      \`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4\`,
      \`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4\`,
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="[
      // prettier-ignore
      \`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4\`,
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'ending position',
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
    options: {
      endingPosition: 'absolute',
    },
  },
];

describe('vue/prettier-ignore', () => {
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
