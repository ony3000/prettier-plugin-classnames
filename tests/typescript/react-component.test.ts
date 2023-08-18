import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'enclosed in quotes #1',
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
    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'enclosed in quotes #2 (short enough class name)',
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
    name: 'embedded expression #1',
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
      className={
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'embedded expression #2 (short enough class name)',
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
    name: 'embedded expression #3',
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
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'embedded expression #4',
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
    name: 'embedded expression #5 (short enough class name)',
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
    name: 'embedded expression #6',
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
    name: 'variable declaration #1',
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
    name: 'variable declaration #2',
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
    name: 'embedded expression #7 (multiple string literal class name)',
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
    name: 'conditional class name #1',
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
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50":
          true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional class name #2 (multiple object)',
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
          "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50":
            true,
        },
        {
          "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50":
            false,
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
    name: 'conditional class name #3 (multiple property)',
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
        "bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl":
          true,
        "rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50":
          false,
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

describe('typescript/react-component', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(format(fixture.input, options)).toBe(fixture.output);
    });
  }
});
