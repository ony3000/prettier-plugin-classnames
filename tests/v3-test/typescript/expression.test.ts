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
};

const fixtures: Fixture[] = [
  {
    name: 'template literal preservation (1)',
    input: `
export function Callout({ children }) {
  return <div className={\`\${''}\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`\${""}\` +
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal preservation (2)',
    input: `
export function Callout({ children }) {
  return <div className={\`""\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        '""' + "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal preservation (3)',
    input: `
export function Callout({ children }) {
  return <div className={\`''\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        "''" + 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'
      }
    >
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
];

describe('typescript/expression', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
