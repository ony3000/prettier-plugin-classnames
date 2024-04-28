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
};

const fixtures: Fixture[] = [
  {
    name: 'string literal (1)',
    input: `
export function Callout({ children }) {
  const combination = 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'

  return (
    <div className={combination}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  const combination =
    "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50";

  return <div className={combination}>{children}</div>;
}
`,
  },
  {
    name: 'string literal (2) - wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  const combination = classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')

  return (
    <div className={combination}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  const combination = classNames(
    \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
  );

  return <div className={combination}>{children}</div>;
}
`,
  },
  {
    name: 'custom functions',
    input: `
export function Callout({ children }) {
  const combination = clsx('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')

  return (
    <div className={combination}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  const combination = clsx(
    \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
    dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
  );

  return <div className={combination}>{children}</div>;
}
`,
    options: {
      customFunctions: ['clsx'],
    },
  },
  {
    name: 'issue #28 (1) - template literal in ternary operator',
    input: `
const { data } = useSWR(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
    output: `const { data } = useSWR(
  cartId ? \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\` : null,
);
`,
  },
  {
    name: 'issue #28 (2) - just template literal',
    input: `
const { data } = useSWR(
  \`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`,
);
`,
    output: `const { data } = useSWR(\`\${process.env.NEXT_PUBLIC_API_URL}/cart/\${cartId}\`);
`,
  },
  {
    name: 'tagged template (1)',
    input: `
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit
eu posuere\`;
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'relative',
    },
  },
  {
    name: 'tagged template (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
ex massa hendrerit eu posuere\`;
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'absolute',
    },
  },
  {
    name: 'tagged template (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
`,
    output: `const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa
hendrerit eu posuere\`;
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'tagged template (4) - short enough class name',
    input: `
const classes = tw\`lorem ipsum dolor sit amet\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet\`;
`,
    options: {
      customFunctions: ['tw'],
    },
  },
];

describe('babel/variable-declaration', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
