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
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'valid ignore comment (1) - component',
    input: `
/* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `/* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (2) - element',
    input: `
export function Foo({ children }) {
  return (
    /* prettier-ignore */
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    /* prettier-ignore */
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (3) - attribute',
    input: `
export function Foo({ children }) {
  return (
    <div
      // prettier-ignore
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      // prettier-ignore
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (4) - class name combination',
    input: `
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'invalid ignore comment (1) - formatting works as usual',
    input: `
/**
 * prettier-ignore
 */
export function Foo({ children }) {
  return (
    <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      {children}
    </div>
  );
}
`,
    output: `/**
 * prettier-ignore
 */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'invalid ignore comment (2) - formatting works as usual',
    input: `
// /* prettier-ignore */
export function Foo({ children }) {
  return (
    <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      {children}
    </div>
  );
}
`,
    output: `// /* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
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
