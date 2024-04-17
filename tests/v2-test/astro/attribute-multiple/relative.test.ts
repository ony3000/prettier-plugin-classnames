import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="  lorem ipsum dolor sit amet  ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
    ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet consectetur adipiscing elit proin">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin
    ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<div>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque
    ">
      {children}
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque"
    >
      {children}
    </div>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants - component',
    input: `
<div>
  <div>
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"
    >
      <slot />
    </Box>
  </div>
</div>
`,
    output: `<div>
  <div>
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere"
    >
      <slot />
    </Box>
  </div>
</div>
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
