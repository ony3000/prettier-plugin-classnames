import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'enclosed-in-quotes #1',
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
    name: 'enclosed-in-quotes #2 (multi-line)',
    input: `
<template>
  <div
    class="rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4"
  >
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
    name: 'attribute-bindings #1',
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
    name: 'attribute-bindings #2 (multi-line)',
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
    name: 'conditional #1',
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
    name: 'conditional #2 (multi-line)',
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
    name: 'prettier-ignore #1',
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
    name: 'prettier-ignore #2 (multi-line)',
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
];

describe('vue/reversibility', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
