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
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'nested ternary (1) - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested ternary (2) - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested ternary (3) - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? \`lorem ipsum dolor sit amet
          \${"consectetur adipiscing elit proin"} ex massa
          hendrerit eu posuere\`
        : \`lorem ipsum dolor sit amet
          \${"consectetur adipiscing elit proin"} ex massa
          hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested ternary (4) - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? condition
          ? \`lorem ipsum dolor sit amet
            \${"consectetur adipiscing elit proin"} ex massa
            hendrerit eu posuere\`
          : \`lorem ipsum dolor sit amet
            \${"consectetur adipiscing elit proin"} ex massa
            hendrerit eu posuere\`
        : "lorem ipsum dolor sit amet"}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested ternary (1) - string literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested ternary (2) - template literal ternary',
    input: `
<div>
  <div>
    <div class={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested ternary (3) - nested expression in falsy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? "lorem ipsum dolor sit amet"
        : condition
        ? "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : condition
        ? \`lorem ipsum dolor sit amet
          \${"consectetur adipiscing elit proin"} ex massa
          hendrerit eu posuere\`
        : \`lorem ipsum dolor sit amet
          \${"consectetur adipiscing elit proin"} ex massa
          hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested ternary (4) - nested expression in truthy part',
    input: `
<div>
  <div>
    <div class={
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={condition
        ? condition
          ? condition
            ? \`lorem ipsum dolor sit amet
              \${"consectetur adipiscing elit proin"} ex
              massa hendrerit eu posuere\`
            : \`lorem ipsum dolor sit amet
              \${"consectetur adipiscing elit proin"} ex
              massa hendrerit eu posuere\`
          : "lorem ipsum dolor sit amet consectetur adipiscing elit proin"
        : "lorem ipsum dolor sit amet"}
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
