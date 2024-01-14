import { describe, expect, test } from 'vitest';
import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal #1',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal #2 (short enough class name)',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
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
    name: 'template literal #1',
    input: `
export function Callout({ children }) {
  return (
    <div className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal #3 (wrapped in `classNames`)',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal #4 (short enough class name wrapped in `classNames`)',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4')}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal #2 (wrapped in `classNames`)',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames(\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`)}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal #5 (multiple class name)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
        'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`,
        \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal #6 (multiple class name)',
    input: `
export function Callout({ children }) {
  return (
    <div className={'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' + 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\` +
        \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
];

describe('babel/embedded-expression', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
