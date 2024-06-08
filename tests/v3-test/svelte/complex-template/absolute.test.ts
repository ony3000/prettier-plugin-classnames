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
    name: 'nested expression (1) - string literal basic',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      'consectetur adipiscing elit proin'
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested expression (2) - template literal basic',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      \`consectetur adipiscing elit proin\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested expression (1) - string literal basic',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${"consectetur adipiscing elit proin"} ex
massa hendrerit eu posuere\`} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested expression (2) - template literal basic',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${\`consectetur adipiscing elit proin\`} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${"consectetur adipiscing elit proin"} ex
massa hendrerit eu posuere\`} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested expression (3) - string literal ternary',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'nested expression (4) - template literal ternary',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested expression (3) - string literal ternary',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`} ex massa hendrerit eu
posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'double nested expression (4) - template literal ternary',
    input: `
<div>
  <div>
    <div class={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div
      class={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`} ex massa hendrerit eu
posuere\`}
    >
      <slot />
    </div>
  </div>
</div>
`,
  },
];

testEach(fixtures, options);
