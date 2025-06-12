import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'angular',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'valid ignore comment (1) - element',
    input: `
<template>
  <div>
    <!-- prettier-ignore -->
    <div
      [class]="classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <!-- prettier-ignore -->
    <div
      [class]="classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'valid ignore comment (2) - script tag',
    input: `
<script setup lang="ts">
const combination = classNames(
  /* prettier-ignore */
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script setup lang="ts">
  const combination = classNames(
    /* prettier-ignore */
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
    ex massa hendrerit eu posuere\`,
  );
</script>
`,
  },
  {
    name: 'valid ignore comment (3) - script tag',
    input: `
<script setup lang="ts">
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script setup lang="ts">
  const combination = classNames(
    // prettier-ignore
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
    ex massa hendrerit eu posuere\`,
  );
</script>
`,
  },
  {
    name: 'valid ignore comment (4) - multi-line script opening tag',
    input: `
<script setup lang="ts" zero-one-two-three-four-five-six-seven-eight-nine="0123456789">
const combination = classNames(
  // prettier-ignore
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
  'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
)
</script>
`,
    output: `<script
  setup
  lang="ts"
  zero-one-two-three-four-five-six-seven-eight-nine="0123456789"
>
  const combination = classNames(
    // prettier-ignore
    'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
    \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
    ex massa hendrerit eu posuere\`,
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
<template>
  <div>
    <div [class]="classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<!--
 ! prettier-ignore
-->
<template>
  <div>
    <div
      [class]="
        classNames(
          'lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere'
        )
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'invalid ignore comment (2) - formatting works as usual',
    input: `
<!-- /* prettier-ignore */ -->
<template>
  <div>
    <div [class]="classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<!-- /* prettier-ignore */ -->
<template>
  <div>
    <div
      [class]="
        classNames(
          'lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere'
        )
      "
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
