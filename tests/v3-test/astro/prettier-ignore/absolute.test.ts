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
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'valid ignore comment (1) - component',
    input: `
<!-- prettier-ignore -->
<div>
  <div>
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
    output: `<!-- prettier-ignore -->
<div>
  <div>
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (2) - element',
    input: `
<div>
  <div>
    <!-- prettier-ignore -->
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <!-- prettier-ignore -->
    <div
      class={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: '🟠 valid ignore comment (3) - class name combination',
    input: `
<div>
  <div>
    <div
      class={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'valid ignore comment (4) - class name combination',
    input: `
<div>
  <div>
    <div
      class={classNames([
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      ])}
    >
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames([
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      ])}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'invalid ignore comment (1) - formatting works as usual',
    input: `
<!--
 ! prettier-ignore
-->
<div>
  <div>
    <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<!--
 ! prettier-ignore
-->
<div>
  <div>
    <div
      class={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'invalid ignore comment (2) - formatting works as usual',
    input: `
<!-- /* prettier-ignore */ -->
<div>
  <div>
    <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<!-- /* prettier-ignore */ -->
<div>
  <div>
    <div
      class={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`,
      )}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
];

describe.each(fixtures)('$name', async ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = await format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', async () => {
    const doubleFormattedText = await format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
