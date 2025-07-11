import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="  lorem ipsum dolor sit amet  ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet consectetur adipiscing elit proin">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<template>
  <div>
    <div dir="ltr" id="lorem-ipsum" title="lorem ipsum" class="
      lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque"
    >
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants - component',
    input: `
<template>
  <div>
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"
    >
      <slot></slot>
    </Box>
  </div>
</template>
`,
    output: `<template>
  <div>
    <Box
      dir="ltr"
      id="lorem-ipsum"
      title="lorem ipsum"
      class="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere"
    >
      <slot></slot>
    </Box>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
