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
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div v-bind:class="classNames(\`lorem ipsum dolor sit amet\`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames('lorem ipsum dolor sit amet')
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
    <div v-bind:class="classNames(\`  lorem ipsum dolor sit amet  \`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(' lorem ipsum dolor sit amet ')
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
    <div v-bind:class="classNames(
      \`lorem ipsum
      dolor sit amet\`
    )">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames('lorem ipsum dolor sit amet')
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
    <div v-bind:class="classNames(\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          'lorem ipsum dolor sit amet consectetur adipiscing elit proin',
        )
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
    <div v-bind:class="classNames(\`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          \` lorem ipsum dolor sit amet consectetur adipiscing elit
          proin \`,
        )
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
    <div v-bind:class="classNames(
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\`
    )">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          'lorem ipsum dolor sit amet consectetur adipiscing elit proin',
        )
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
    <div v-bind:class="classNames(\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere eu volutpat id neque
          pellentesque\`,
        )
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
    <div v-bind:class="classNames(\`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          \` lorem ipsum dolor sit amet consectetur adipiscing elit
          proin ex massa hendrerit eu posuere eu volutpat id neque
          pellentesque \`,
        )
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
    <div v-bind:class="classNames(
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`
    )">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      v-bind:class="
        classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere eu volutpat id neque
          pellentesque\`,
        )
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
    <div :class="classNames(\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      :class="
        classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`,
        )
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
