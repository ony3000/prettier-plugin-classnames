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
    name: 'ignore comment (1)',
    input: `
// prettier-ignore
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
    output: `// prettier-ignore
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
  },
  {
    name: 'ignore comment (2)',
    input: `
export function Callout({ children }) {
  return (
    <div
      // prettier-ignore
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
      // prettier-ignore
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
  },
  {
    name: 'ignore comment (3)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
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
        // prettier-ignore
        'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
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
    name: 'ignore comment (4)',
    input: `
/* prettier-ignore */
export function Callout({ children }) {
  return (
    <div>
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
    </div>
  );
}
`,
    output: `/* prettier-ignore */
export function Callout({ children }) {
  return (
    <div>
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
    </div>
  );
}
`,
  },
  {
    name: 'ignore comment (5)',
    input: `
export function Callout({ children }) {
  return (
    <div>
      {/* prettier-ignore */}
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div>
      {/* prettier-ignore */}
      <div
        className={classNames(
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
        )}
      >
        {children}
      </div>
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
    </div>
  );
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (1)',
    input: `
/**
 * prettier-ignore
 */
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `/**
 * prettier-ignore
 */
export function Callout({ children }) {
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
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting (2)',
    input: `
// /* prettier-ignore */
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `// /* prettier-ignore */
export function Callout({ children }) {
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
    name: 'reversibility (1)',
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
    name: 'reversibility (2)',
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
    name: 'ending position',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
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
        // prettier-ignore
        'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
        \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
border-zinc-400/30 border bg-gray-100/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
];

describe('babel/prettier-ignore', () => {
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
