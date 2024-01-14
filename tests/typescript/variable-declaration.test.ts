import { describe, expect, test } from 'vitest';
import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal #1',
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
    name: 'string literal #2 (wrapped in `classNames`)',
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
];

describe('typescript/variable-declaration', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
