import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal in ternary operator',
    input: `
const { data } = useSWR<CartResponse>(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
    output: `const { data } = useSWR<CartResponse>(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
  },
  {
    name: 'just template literal',
    input: `
const { data } = useSWR<CartResponse>(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
`,
    output: `const { data } = useSWR<CartResponse>(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
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
