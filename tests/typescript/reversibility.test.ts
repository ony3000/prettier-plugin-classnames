import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'enclosed-in-quotes #1',
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
    name: 'enclosed-in-quotes #2 (multi-line)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className="rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4"
    >
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
    name: 'embedded-expression #1',
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
    name: 'embedded-expression #2 (multi-line)',
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
    name: 'embedded-expression #3 (multi-line)',
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
    name: 'conditional #1',
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
    name: 'conditional #2 (multi-line)',
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
    name: 'prettier-ignore #1',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
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
        // prettier-ignore
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`,
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
    name: 'prettier-ignore #2 (multi-line)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        \`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`,
        \`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`,
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
        // prettier-ignore
        \`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`,
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
        \`${""}\` +
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

describe('typescript/reversibility', () => {
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
