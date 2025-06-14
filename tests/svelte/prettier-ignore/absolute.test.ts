import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
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
    name: 'valid ignore comment (3) - class name combination',
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
    name: 'valid ignore comment (5) - script tag',
    input: `
<script>
const combination = classNames(
  /* prettier-ignore */
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script>
  const combination = classNames(
    /* prettier-ignore */
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit
    proin ex massa hendrerit eu posuere\`,
  );
</script>
`,
  },
  {
    name: 'valid ignore comment (6) - script tag',
    input: `
<script>
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script>
  const combination = classNames(
    // prettier-ignore
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit
    proin ex massa hendrerit eu posuere\`,
  );
</script>
`,
  },
  {
    name: 'valid ignore comment (7) - multi-line script opening tag',
    input: `
<script zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script
  zero-one-two-three-four-five-six-seven-eight-nine="0123456789"
>
  const combination = classNames(
    // prettier-ignore
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit
    proin ex massa hendrerit eu posuere\`,
  );
</script>
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
