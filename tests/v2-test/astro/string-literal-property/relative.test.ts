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
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'lorem ipsum dolor sit amet': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        "lorem ipsum dolor sit amet": true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'  lorem ipsum dolor sit amet  ': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        " lorem ipsum dolor sit amet ": true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<div>
  <div>
    <div class={classNames({
      'lorem ipsum\\
      dolor sit amet': true
    })}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        "lorem ipsum dolor sit amet": true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'lorem ipsum dolor sit amet consectetur adipiscing elit proin': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        "lorem ipsum dolor sit amet consectetur adipiscing elit proin": true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing elit
        proin \`]: true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<div>
  <div>
    <div class={classNames({
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin': true
    })}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        "lorem ipsum dolor sit amet consectetur adipiscing elit proin": true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque\`]: true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({'    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ': true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque \`]: true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<div>
  <div>
    <div class={classNames({
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque': true
    })}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque\`]: true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants - `class:list` directive',
    input: `
<div>
  <div>
    <div class:list={[{'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere': true}, {'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere': true}]}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class:list={[
        {
          [\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`]: true,
        },
        {
          [\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere\`]: true,
        },
      ]}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
];

describe.each(fixtures)('$name', ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', () => {
    const doubleFormattedText = format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
