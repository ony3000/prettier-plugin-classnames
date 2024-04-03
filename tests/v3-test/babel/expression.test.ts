import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'template literal (1)',
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
    name: 'template literal (2) - wrapped in `classNames`',
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
    name: 'conditional (4) - dynamic class name',
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
  {
    name: 'reversibility (1) - short enough template literal class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`
      }
    >
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
    name: 'reversibility (2) - short enough multi-line template literal class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`}
    >
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
    name: 'reversibility (3) - short enough multi-line template literal class name wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`
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
    name: 'reversibility (4) - short enough dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true,
      })}
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
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (5) - short enough multi-line dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`]: true,
      })}
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
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'ending position (5) - useTabs: true',
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
\treturn (
\t\t<div
\t\t\tclassName={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4
\t\t\t\tpy-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
\t\t>
\t\t\t{children}
\t\t</div>
\t);
}
`,
    options: {
      useTabs: true,
      endingPosition: 'absolute-with-indent',
    },
  },
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
        \`""\` + "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
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
        \`''\` + 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'
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

describe('babel/expression', () => {
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
