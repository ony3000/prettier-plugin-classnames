import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'delimiter conversion (1) - `jsxSingleQuote: true`',
    input: `
<div>
  <div>
    <div class="lorem ipsum dolor sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class='lorem ipsum dolor sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (2) - `jsxSingleQuote: true` but the class name includes a single quote',
    input: `
<div>
  <div>
    <div class="lorem ipsum do'or sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class="lorem ipsum do'or sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (3) - `jsxSingleQuote: false`',
    input: `
<div>
  <div>
    <div class='lorem ipsum dolor sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class="lorem ipsum dolor sit amet">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: false,
    },
  },
  {
    name: 'delimiter conversion (4) - `jsxSingleQuote: false` but the class name includes a double quote',
    input: `
<div>
  <div>
    <div class='lorem ipsum do"or sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div class='lorem ipsum do"or sit amet'>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      jsxSingleQuote: false,
    },
  },
];

testEach(fixtures, options);
