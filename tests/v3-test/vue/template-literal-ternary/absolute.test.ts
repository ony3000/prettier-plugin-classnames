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
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`lorem ipsum dolor sit amet\` : \`lorem ipsum dolor sit amet\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? 'lorem ipsum dolor sit amet'
          : 'lorem ipsum dolor sit amet'
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`  lorem ipsum dolor sit amet  \` : \`  lorem ipsum dolor sit amet  \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? ' lorem ipsum dolor sit amet '
          : ' lorem ipsum dolor sit amet '
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition ? \`lorem ipsum
      dolor sit amet\` : \`lorem ipsum
      dolor sit amet\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? 'lorem ipsum dolor sit amet'
          : 'lorem ipsum dolor sit amet'
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \` : \`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \` lorem ipsum dolor sit amet consectetur
adipiscing elit proin \`
          : \` lorem ipsum dolor sit amet consectetur
adipiscing elit proin \`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition ? \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\` : \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="condition ? \`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \` : \`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \` lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque \`
          : \` lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque \`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition ? \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\` : \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants - shorthand',
    input: `
<template>
  <div>
    <div :class="condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      :class="
        condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

describe.each(fixtures)('$name', async ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = await format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', async () => {
    const doubleFormattedText = await format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});