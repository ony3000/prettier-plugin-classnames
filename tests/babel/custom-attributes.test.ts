import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
  customAttributes: ['classes'],
};

const fixtures: Fixture[] = [
  {
    name: 'custom attribute #1',
    input: `
export function Callout({ children }) {
  return (
    <div classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      classes="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50"
    >
      {children}
    </div>
  );
}
`,
  },
];

describe('babel/custom-attributes', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
