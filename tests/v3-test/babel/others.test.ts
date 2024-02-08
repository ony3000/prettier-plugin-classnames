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
    name: 'tabWidth: 4',
    input: `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`,
    output: `export function Callout({ children }) {\n    return (\n        <div\n            className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n                dark:border-neutral-500/30 dark:bg-neutral-900/50"\n        >\n            {children}\n        </div>\n    );\n}\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`,
    output: `export function Callout({ children }) {\n\treturn (\n\t\t<div\n\t\t\tclassName="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n\t\t\t\tdark:border-neutral-500/30 dark:bg-neutral-900/50"\n\t\t>\n\t\t\t{children}\n\t\t</div>\n\t);\n}\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`,
    output: `export function Callout({ children }) {\r\n  return (\r\n    <div\r\n      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\r\n        dark:border-neutral-500/30 dark:bg-neutral-900/50"\r\n    >\r\n      {children}\r\n    </div>\r\n  );\r\n}\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('babel/others', () => {
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
