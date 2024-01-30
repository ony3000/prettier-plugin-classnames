import { describe, expect, test } from 'vitest';

import type { Fixture } from '../settings';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

const fixtures: Fixture[] = [
  {
    name: 'tabWidth: 4',
    input: `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`,
    output: `<template>\n    <div\n        class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n            dark:border-neutral-500/30 dark:bg-neutral-900/50"\n    >\n        <slot></slot>\n    </div>\n</template>\n`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true',
    input: `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`,
    output: `<template>\n\t<div\n\t\tclass="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n\t\t\tdark:border-neutral-500/30 dark:bg-neutral-900/50"\n\t>\n\t\t<slot></slot>\n\t</div>\n</template>\n`,
    options: {
      useTabs: true,
    },
  },
  {
    name: 'endOfLine: crlf',
    input: `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`,
    output: `<template>\r\n  <div\r\n    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\r\n      dark:border-neutral-500/30 dark:bg-neutral-900/50"\r\n  >\r\n    <slot></slot>\r\n  </div>\r\n</template>\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
];

describe('vue/others', () => {
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
