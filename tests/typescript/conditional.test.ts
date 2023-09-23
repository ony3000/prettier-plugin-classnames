import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'single object, single property',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true },
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
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'multiple object, single property for each object',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true },
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': false },
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
        {
          [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
          dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
        },
        {
          [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
          dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: false,
        },
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'single object, multiple property',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        {
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl': true,
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50': false,
        },
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
      className={classNames({
        [\`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`]: true,
        [\`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`]: false,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true },
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
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
];

describe('typescript/conditional', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      // @ts-ignore
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
