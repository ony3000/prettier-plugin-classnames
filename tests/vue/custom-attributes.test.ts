import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
  customAttributes: ['classes'],
};

const fixtures: Fixture[] = [
  {
    name: 'custom attribute #1',
    input: `
<template>
  <div>
    <Callout classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Callout
      classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50"
    >
      Lorem ipsum
    </Callout>
  </div>
</template>
`,
  },
  {
    name: 'custom attribute #2',
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
  },
  {
    name: 'custom attribute #3',
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
  },
//   {
//     name: 'typescript in template (custom attribute #3)',
//     input: `
// <template>
//   <div>
//     <Callout v-bind:classes="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50' as string">
//       Lorem ipsum
//     </Callout>
//   </div>
// </template>
// `,
//     output: `<template>
//   <div>
//     <Callout
//       v-bind:classes="\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
//         dark:border-neutral-500/30 dark:bg-neutral-900/50\` as string"
//     >
//       Lorem ipsum
//     </Callout>
//   </div>
// </template>
// `,
//   },
];

describe('vue/custom-attributes', () => {
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
