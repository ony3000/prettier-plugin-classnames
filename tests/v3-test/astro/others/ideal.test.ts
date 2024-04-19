import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'endOfLine: crlf',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>\r\n  <div>\r\n    <div\r\n      class="lorem ipsum dolor sit amet consectetur\r\n        adipiscing elit proin ex massa hendrerit eu posuere"\r\n    >\r\n      <slot />\r\n    </div>\r\n  </div>\r\n</div>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
  {
    name: 'tabWidth: 4',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
    <div>
        <div
            class="lorem ipsum dolor sit amet consectetur
                adipiscing elit proin ex massa hendrerit eu
                posuere"
        >
            <slot />
        </div>
    </div>
</div>
`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (1) - tabWidth: 2',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet consectetur
\t\t\t\tadipiscing elit proin ex massa hendrerit eu posuere"
\t\t>
\t\t\t<slot />
\t\t</div>
\t</div>
</div>
`,
    options: {
      useTabs: true,
      tabWidth: 2,
    },
  },
  {
    name: 'useTabs: true (2) - tabWidth: 4',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet consectetur
\t\t\t\tadipiscing elit proin ex massa hendrerit eu
\t\t\t\tposuere"
\t\t>
\t\t\t<slot />
\t\t</div>
\t</div>
</div>
`,
    options: {
      useTabs: true,
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (3) - tabWidth: 8',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
\t<div>
\t\t<div
\t\t\tclass="lorem ipsum dolor sit amet
\t\t\t\tconsectetur adipiscing elit
\t\t\t\tproin ex massa hendrerit eu
\t\t\t\tposuere"
\t\t>
\t\t\t<slot />
\t\t</div>
\t</div>
</div>
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
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
-->
`,
    output: `<!--
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
-->
`,
  },
  {
    name: 'plugin options (1) - custom attributes',
    input: `
<div>
  <div>
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      fixme="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere"
    >
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      customAttributes: ['fixme'],
    },
  },
  {
    name: 'plugin options (2) - custom functions',
    input: `
<div>
  <div>
    <div class={clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={clsx(
        \`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      <slot />
    </div>
  </div>
</div>
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
