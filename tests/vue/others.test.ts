import { describe, expect, test } from 'vitest';
import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'vue',
};

describe('vue/others', () => {
  test('tabWidth: 4', async () => {
    const input = `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`;
    const output = `<template>\n    <div\n        class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n            dark:border-neutral-500/30 dark:bg-neutral-900/50"\n    >\n        <slot></slot>\n    </div>\n</template>\n`;

    expect(await format(input, { ...options, tabWidth: 4 })).toBe(output);
  });

  test('useTabs: true', async () => {
    const input = `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`;
    const output = `<template>\n\t<div\n\t\tclass="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n\t\t\tdark:border-neutral-500/30 dark:bg-neutral-900/50"\n\t>\n\t\t<slot></slot>\n\t</div>\n</template>\n`;

    expect(await format(input, { ...options, useTabs: true })).toBe(output);
  });

  test('endOfLine: crlf', async () => {
    const input = `\n<template>\n  <div class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n    <slot></slot>\n  </div>\n</template>\n`;
    const output = `<template>\r\n  <div\r\n    class="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\r\n      dark:border-neutral-500/30 dark:bg-neutral-900/50"\r\n  >\r\n    <slot></slot>\r\n  </div>\r\n</template>\r\n`;

    expect(await format(input, { ...options, endOfLine: 'crlf' })).toBe(output);
  });
});
