import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const classes = tw\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'short enough (2)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'short enough (3)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
</script>
`,
  },
  {
    name: 'near boundary (1)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
  },
  {
    name: 'near boundary (2)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
  },
  {
    name: 'near boundary (3)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
</script>
`,
  },
  {
    name: 'long enough (1)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
  },
  {
    name: 'long enough (2)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
  },
  {
    name: 'long enough (3)',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
</script>
`,
  },
  {
    name: 'syntax variants - written as an object value',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script setup lang="ts">
const classes = {
  short: tw\`lorem ipsum dolor sit amet\`,
  near: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
  long: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
};
</script>
`,
  },
];
