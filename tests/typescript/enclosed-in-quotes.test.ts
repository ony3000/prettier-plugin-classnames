import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'className attribute only #1',
    input: `
export function Callout({ children }) {
  return (
    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'className attribute only #2 (short enough class name)',
    input: `
export function Callout({ children }) {
  return (
    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4">
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'along with other attributes #1 (className is the first)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
      onFocus={() => {}}
      onMouseOver={() => {}}
      tabIndex={-1}
      title="Callout"
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50"
      onFocus={() => {}}
      onMouseOver={() => {}}
      tabIndex={-1}
      title="Callout"
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'along with other attributes #2 (className is the last)',
    input: `
export function Callout({ children }) {
  return (
    <div
      onFocus={() => {}}
      onMouseOver={() => {}}
      tabIndex={-1}
      title="Callout"
      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      onFocus={() => {}}
      onMouseOver={() => {}}
      tabIndex={-1}
      title="Callout"
      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50"
    >
      {children}
    </div>
  );
}
`,
  },
];

describe('typescript/enclosed-in-quotes', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(await format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
