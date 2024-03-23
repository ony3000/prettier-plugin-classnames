import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'custom attributes',
    input: `
export function Foo({ children }) {
  return (
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      fixme="lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque"
    >
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 60,
      customAttributes: ['fixme'],
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
