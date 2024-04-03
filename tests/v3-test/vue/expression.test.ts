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
    name: 'class name type checking (1) - short enough FA',
    input: `
<script setup lang="ts">
const foo = classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4');
</script>

<template>
  <div :class="classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4')">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = classNames(
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
);
</script>

<template>
  <div
    :class="
      classNames(
        'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
      )
    "
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (2) - short enough CSL',
    input: `
<script setup lang="ts">
const foo = ['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4', 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'];
</script>

<template>
  <div :class="['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4', 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
];
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (3) - short enough SLSL',
    input: `
<script setup lang="ts">
const foo = ['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'];
</script>

<template>
  <div :class="['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = ["rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"];
</script>

<template>
  <div
    :class="['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (4) - short enough SLOP',
    input: `
<script setup lang="ts">
const foo = classNames({'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4': true});
</script>

<template>
  <div :class="{'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4': true}">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = classNames({
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
});
</script>

<template>
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
    name: 'class name type checking (5) - short enough SLTO',
    input: `
<script setup lang="ts">
const foo = classNames([true ? 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4' : 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']);
</script>

<template>
  <div :class="[true ? 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4' : 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = classNames([
  true
    ? "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
    : "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
]);
</script>

<template>
  <div
    :class="[
      true
        ? 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'
        : 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (6) - short enough CTL',
    input: `
<script setup lang="ts">
const foo = [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`, \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`];
</script>

<template>
  <div :class="[\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`, \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = [
  \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
  \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
];
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
      'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (7) - short enough TLSL',
    input: `
<script setup lang="ts">
const foo = [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`];
</script>

<template>
  <div :class="[\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`];
</script>

<template>
  <div
    :class="['rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4']"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'class name type checking (8) - short enough TLOP',
    input: `
<script setup lang="ts">
const foo = classNames({[\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true});
</script>

<template>
  <div :class="{[\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true}">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = classNames({
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
});
</script>

<template>
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
    name: 'class name type checking (9) - short enough TLTO',
    input: `
<script setup lang="ts">
const foo = classNames([true ? \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\` : \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]);
</script>

<template>
  <div :class="[true ? \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\` : \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]">
    <slot></slot>
  </div>
</template>
`,
    output: `<script setup lang="ts">
const foo = classNames([
  true
    ? "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
    : "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
]);
</script>

<template>
  <div
    :class="[
      true
        ? 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'
        : 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4',
    ]"
  >
    <slot></slot>
  </div>
</template>
`,
  },
  {
    name: 'ending position (5) - useTabs: true',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
\t<div
\t\t:class="\`rounded-xl border border-zinc-400/30 bg-gray-100/50
\t\t\tpx-4 py-4 dark:border-neutral-500/30
\t\t\tdark:bg-neutral-900/50\`"
\t>
\t\t<slot></slot>
\t</div>
</template>
`,
    options: {
      printWidth: 70,
      useTabs: true,
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('vue/expression', () => {
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
