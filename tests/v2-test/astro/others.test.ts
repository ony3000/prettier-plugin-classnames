import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\n<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n  <slot />\n</div>\n`,
    output: `<div\n    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n        dark:border-neutral-500/30 dark:bg-neutral-900/50"\n>\n    <slot />\n</div>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n  <slot />\n</div>\n`,
    output: `<div\n\tclass="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n\t\tdark:border-neutral-500/30 dark:bg-neutral-900/50"\n>\n\t<slot />\n</div>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n<div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n  <slot />\n</div>\n`,
    output: `<div\r\n  class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\r\n    dark:border-neutral-500/30 dark:bg-neutral-900/50"\r\n>\r\n  <slot />\r\n</div>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('astro/others', () => {
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
