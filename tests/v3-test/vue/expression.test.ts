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
    name: 'issue #37 - short enough conditional class name (no error in v0.4.0, error in v0.5.0 ~ v0.6.0)',
    input: `
<template>
  <div
    :class="{
        'bg-black': true
    }">Some text</div>
</template>
`,
    output: `<template>
  <div
    :class="{
      'bg-black': true,
    }"
  >
    Some text
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
  {
    name: 'ending position (4)',
    input: `
<template>
  <div :class="'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'">
    <slot></slot>
  </div>
</template>
`,
    output: `<template>
  <div
    :class="\`rounded-xl border border-zinc-400/30
      bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30
      dark:bg-neutral-900/50\`"
  >
    <slot></slot>
  </div>
</template>
`,
    options: {
      printWidth: 60,
      endingPosition: 'absolute-with-indent',
    },
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
