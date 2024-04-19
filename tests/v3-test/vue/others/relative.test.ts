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
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'endOfLine: crlf',
    input: `
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>\r\n  <div>\r\n    <div\r\n      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin\r\n        ex massa hendrerit eu posuere"\r\n    >\r\n      <slot></slot>\r\n    </div>\r\n  </div>\r\n</template>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
  {
    name: 'tabWidth: 4',
    input: `
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
    <div>
        <div
            class="lorem ipsum dolor sit amet consectetur adipiscing elit proin
                ex massa hendrerit eu posuere"
        >
            <slot></slot>
        </div>
    </div>
</template>
`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (1) - tabWidth: 2',
    input: `
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t<slot></slot>
\t\t</div>
\t</div>
</template>
`,
    options: {
      useTabs: true,
      tabWidth: 2,
    },
  },
  {
    name: 'useTabs: true (2) - tabWidth: 4',
    input: `
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t<slot></slot>
\t\t</div>
\t</div>
</template>
`,
    options: {
      useTabs: true,
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (3) - tabWidth: 8',
    input: `
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t<slot></slot>
\t\t</div>
\t</div>
</template>
`,
    options: {
      useTabs: true,
      tabWidth: 8,
    },
  },
  {
    name: 'comment - multi line comment',
    input: `
<!--
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
-->
`,
    output: `<!--
<template>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
-->
`,
  },
  {
    name: 'plugin options (1) - custom attributes',
    input: `
<template>
  <div>
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
    options: {
      customAttributes: ['fixme'],
    },
  },
  {
    name: 'plugin options (2) - custom functions',
    input: `
<template>
  <div>
    <div :class="clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      :class="
        clsx(
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
    options: {
      customFunctions: ['clsx'],
    },
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
