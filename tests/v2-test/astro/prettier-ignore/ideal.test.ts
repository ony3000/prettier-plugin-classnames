import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
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
    name: '🟠 valid ignore comment (3) - class name combination (the astro plugin does not work properly)',
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
        "lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere",
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

testEach(fixtures, options);
