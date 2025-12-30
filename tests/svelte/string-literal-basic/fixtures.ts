import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'lorem ipsum dolor sit amet'}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'  lorem ipsum dolor sit amet  '}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={
      'lorem ipsum\\
      dolor sit amet'
    }>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'lorem ipsum dolor sit amet consectetur adipiscing elit proin'}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'   lorem ipsum dolor sit amet consectetur adipiscing elit proin   '}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin'
    }>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    '}>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'
    }>
      <slot />
    </div>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants - component',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <Box class={'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      <slot />
    </Box>
  </div>
</div>
`,
  },
  {
    name: 'syntax variants - addition operation between strings',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={'  lorem ipsum  ' + '  dolor sit amet  '}>
      <slot />
    </div>
  </div>
</div>
`,
  },
];
