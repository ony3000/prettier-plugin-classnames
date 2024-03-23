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
    name: 'custom attributes',
    input: `
<div>
  <div>
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque"
    >
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
      customAttributes: ['fixme'],
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
