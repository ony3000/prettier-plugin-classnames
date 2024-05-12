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
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do'or sit amet\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\\'or sit amet'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (3) - delimiter is double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains double quote (1) - delimiter is backtick',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do"or sit amet\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (3) - delimiter is double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\\"or sit amet"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains backtick (1) - delimiter is backtick',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (3) - delimiter is double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
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
