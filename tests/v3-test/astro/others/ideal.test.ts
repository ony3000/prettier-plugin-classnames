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
  endingPosition: 'absolute-with-indent',
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
      fixme="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque"
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
  {
    name: 'custom functions',
    input: `
<div>
  <div>
    <div class={clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque')}>
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
        elit proin ex massa hendrerit eu posuere eu volutpat
        id neque pellentesque\`,
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      printWidth: 60,
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
