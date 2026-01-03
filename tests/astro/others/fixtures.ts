import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'endOfLine: crlf',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      endOfLine: 'crlf',
    },
  },
  {
    name: 'tabWidth: 4',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (1) - tabWidth: 2',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      useTabs: true,
      tabWidth: 2,
    },
  },
  {
    name: 'useTabs: true (2) - tabWidth: 4',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      useTabs: true,
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (3) - tabWidth: 8',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      useTabs: true,
      tabWidth: 8,
    },
  },
  {
    name: 'comment - multi line comment',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<!--
<div>
  <div>
    <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
-->
`,
  },
  {
    name: 'plugin options (1) - custom attributes',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
<div>
  <div>
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      customAttributes: ['fixme'],
    },
  },
  {
    name: 'plugin options (2) - custom functions',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      <slot />
    </div>
  </div>
</div>
`,
    options: {
      customFunctions: ['clsx'],
    },
  },
  {
    name: 'template literal - written as an object value',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div>
  <div>
    <div class={classNames({
      short: \`lorem ipsum dolor sit amet\`,
      near: \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
      long: \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
    })}>
      <slot />
    </div>
  </div>
</div>
`,
  },
];
