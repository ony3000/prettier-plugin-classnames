import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div class={classNames({[\`lorem ipsum dolor sit amet\`]: true})}>
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
    <div class={classNames({[\`  lorem ipsum dolor sit amet  \`]: true})}>
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
      [\`lorem ipsum
      dolor sit amet\`]: true
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
    <div class={classNames({[\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`]: true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
elit proin\`]: true,
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
    <div class={classNames({[\`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \`]: true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing
elit proin \`]: true,
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
      [\`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\`]: true
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
        [\`lorem ipsum dolor sit amet consectetur adipiscing
elit proin\`]: true,
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
    <div class={classNames({[\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`]: true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere eu volutpat id
neque pellentesque\`]: true,
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
    <div class={classNames({[\`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \`]: true})}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere eu volutpat id
neque pellentesque \`]: true,
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
      [\`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`]: true
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
        [\`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere eu volutpat id
neque pellentesque\`]: true,
      })}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants - component',
    input: `
<div>
  <div>
    <Box class={classNames({[\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`]: true})}>
      <slot />
    </Box>
  </div>
</div>
`,
    output: `<div>
  <div>
    <Box
      class={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
elit proin ex massa hendrerit eu posuere\`]: true,
      })}
    >
      <slot />
    </Box>
  </div>
</div>
`,
  },
];

testEach(fixtures, options);
