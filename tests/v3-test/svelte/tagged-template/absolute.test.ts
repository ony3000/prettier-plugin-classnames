import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-svelte', thisPlugin],
  parser: 'svelte',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1)',
    input: `
<script>
const classes = tw\`lorem ipsum dolor sit amet\`;
</script>
`,
    output: `<script>
  const classes = tw\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'short enough (2)',
    input: `
<script>
const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
</script>
`,
    output: `<script>
  const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'short enough (3)',
    input: `
<script>
const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
</script>
`,
    output: `<script>
  const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'near boundary (1)',
    input: `
<script>
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
    output: `<script>
  const classes = tw\`lorem ipsum dolor sit amet consectetur
  adipiscing elit proin\`;
</script>
`,
  },
  {
    name: 'near boundary (2)',
    input: `
<script>
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
    output: `<script>
  const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur
  adipiscing elit proin\`;
</script>
`,
  },
  {
    name: 'near boundary (3)',
    input: `
<script>
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
    output: `<script>
  const Bar = tw(
    Foo,
  )\`lorem ipsum dolor sit amet consectetur adipiscing elit
  proin\`;
</script>
`,
  },
  {
    name: 'long enough (1)',
    input: `
<script>
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
    output: `<script>
  const classes = tw\`lorem ipsum dolor sit amet consectetur
  adipiscing elit proin ex massa hendrerit eu posuere eu
  volutpat id neque pellentesque\`;
</script>
`,
  },
  {
    name: 'long enough (2)',
    input: `
<script>
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
    output: `<script>
  const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur
  adipiscing elit proin ex massa hendrerit eu posuere eu
  volutpat id neque pellentesque\`;
</script>
`,
  },
  {
    name: 'long enough (3)',
    input: `
<script>
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
    output: `<script>
  const Bar = tw(
    Foo,
  )\`lorem ipsum dolor sit amet consectetur adipiscing elit
  proin ex massa hendrerit eu posuere eu volutpat id neque
  pellentesque\`;
</script>
`,
  },
  {
    name: 'syntax variants - written as an object value',
    input: `
<script setup lang="ts">
const classes = {
  short: tw\`lorem ipsum dolor sit amet\`,
  near: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
  long: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
};
</script>
`,
    output: `<script setup lang="ts">
  const classes = {
    short: tw\`lorem ipsum dolor sit amet\`,
    near: tw\`lorem ipsum dolor sit amet consectetur
    adipiscing elit proin\`,
    long: tw\`lorem ipsum dolor sit amet consectetur
    adipiscing elit proin ex massa hendrerit eu posuere eu
    volutpat id neque pellentesque\`,
  };
</script>
`,
  },
];

testEach(fixtures, options);
