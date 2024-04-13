import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
};

const fixtures: Fixture[] = [
  {
    name: 'ending position (5) - useTabs: true',
    input: `
<div class={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
  <slot />
</div>
`,
    output: `<div
\tclass={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4
\t\tpy-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
>
\t<slot />
</div>
`,
    options: {
      printWidth: 70,
      useTabs: true,
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('astro/expression', () => {
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
