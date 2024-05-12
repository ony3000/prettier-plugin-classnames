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
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'nested ternary (1) - string literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
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
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested ternary (2) - template literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
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
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested ternary (3) - nested expression in falsy part',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
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
          : condition
          ? \`lorem ipsum dolor sit amet
            \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
            posuere\`
          : \`lorem ipsum dolor sit amet
            \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
            posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'nested ternary (4) - nested expression in truthy part',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
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
          ? condition
            ? \`lorem ipsum dolor sit amet
              \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
              posuere\`
            : \`lorem ipsum dolor sit amet
              \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
              posuere\`
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
    name: 'double nested ternary (1) - string literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
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
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested ternary (2) - template literal ternary',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
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
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
            ex massa hendrerit eu posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested ternary (3) - nested expression in falsy part',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
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
          : condition
          ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : condition
          ? \`lorem ipsum dolor sit amet
            \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
            posuere\`
          : \`lorem ipsum dolor sit amet
            \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
            posuere\`
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'double nested ternary (4) - nested expression in truthy part',
    input: `
<template>
  <div>
    <div v-bind:class="
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
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
          ? condition
            ? condition
              ? \`lorem ipsum dolor sit amet
                \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
                posuere\`
              : \`lorem ipsum dolor sit amet
                \${'consectetur adipiscing elit proin'} ex massa hendrerit eu
                posuere\`
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
          : 'lorem ipsum dolor sit amet'
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

describe.each(fixtures)('$name', ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', () => {
    const doubleFormattedText = format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
