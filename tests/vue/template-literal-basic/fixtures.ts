import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`  lorem ipsum dolor sit amet  \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      \`lorem ipsum
      dolor sit amet\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`   lorem ipsum dolor sit amet consectetur adipiscing elit proin   \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="\`    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    \`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div v-bind:class="
      \`lorem ipsum
      dolor sit amet
      consectetur adipiscing elit
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`
    ">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (1) - component',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <Box v-bind:class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`">
      <slot></slot>
    </Box>
  </div>
</template>
`,
  },
  {
    name: 'syntax variants (2) - shorthand',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<template>
  <div>
    <div :class="\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`">
      <slot></slot>
    </div>
  </div>
</template>
`,
  },
];
