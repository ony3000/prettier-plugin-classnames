import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="  lorem ipsum dolor sit amet  ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="
      lorem ipsum
      dolor sit amet
    ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="lorem ipsum dolor sit amet consectetur adipiscing elit proin">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin
    ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" className="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque
    ">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'syntax variants - component',
    input: `
export function Foo({ children }) {
  return (
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"
    >
      {children}
    </Box>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      className="lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere"
    >
      {children}
    </Box>
  );
}
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
