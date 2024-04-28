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
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'delimiter conversion (1) - `jsxSingleQuote: true`',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className='lorem ipsum dolor sit amet'>{children}</div>;
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (2) - `jsxSingleQuote: true` but the class name includes a single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum do'or sit amet">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className="lorem ipsum do'or sit amet">{children}</div>;
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (3) - `jsxSingleQuote: false`',
    input: `
export function Foo({ children }) {
  return (
    <div className='lorem ipsum dolor sit amet'>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className="lorem ipsum dolor sit amet">{children}</div>;
}
`,
    options: {
      jsxSingleQuote: false,
    },
  },
  {
    name: 'delimiter conversion (4) - `jsxSingleQuote: false` but the class name includes a double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className='lorem ipsum do"or sit amet'>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className='lorem ipsum do"or sit amet'>{children}</div>;
}
`,
    options: {
      jsxSingleQuote: false,
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
