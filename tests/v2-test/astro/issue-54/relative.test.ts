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
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'delimiter conversion (1) - `jsxSingleQuote: true`',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class='lorem ipsum dolor sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (2) - `jsxSingleQuote: true` but the class name includes a single quote',
    input: `
<div>
  <div>
    <div class="lorem ipsum do'or sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class="lorem ipsum do'or sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (3) - `jsxSingleQuote: false`',
    input: `
<div>
  <div>
    <div class='lorem ipsum dolor sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class="lorem ipsum dolor sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: false,
    },
  },
  {
    name: 'delimiter conversion (4) - `jsxSingleQuote: false` but the class name includes a double quote',
    input: `
<div>
  <div>
    <div class='lorem ipsum do"or sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class='lorem ipsum do"or sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: false,
    },
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
