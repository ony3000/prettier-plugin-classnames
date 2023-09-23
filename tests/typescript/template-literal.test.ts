import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal',
    input: `
export function Callout({ children }) {
  return \`
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
      {children}
    </div>
  \`;
}
`,
    output: `export function Callout({ children }) {
  return \`
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
      {children}
    </div>
  \`;
}
`,
  },
];

describe('typescript/template-literal', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      // @ts-ignore
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
