import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={"lorem ipsum dolor sit amet"}>
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
    <div class={\`  lorem ipsum dolor sit amet  \`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={" lorem ipsum dolor sit amet "}>
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
    <div class={
      \`lorem ipsum
      dolor sit amet\`
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class={"lorem ipsum dolor sit amet"}>
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
    <div class={\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin\`}
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
    <div class={\`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\` lorem ipsum dolor sit amet consectetur
        adipiscing elit proin \`}
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
    <div class={
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\`
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin\`}
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
    <div class={\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque\`}
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
    <div class={\`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\` lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque \`}
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
    <div class={
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`
    }>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants (1) - component',
    input: `
<div>
  <div>
    <Box class={\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`}>
      <slot />
    </Box>
  </div>
</div>
`,
    output: `<div>
  <div>
    <Box
      class={\`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere\`}
    >
      <slot />
    </Box>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants (2) - `class:list` directive',
    input: `
<div>
  <div>
    <div class:list={[\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`, \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`]}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class:list={[
        \`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere\`,
        \`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere\`,
      ]}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
];

testEach(fixtures, options);
