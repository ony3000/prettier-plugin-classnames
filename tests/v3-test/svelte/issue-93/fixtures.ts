import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) Attributes in Svelte can contain expressions.',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div class="lorem ipsum dolor sit amet {'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere">
  <slot />
</div>
`,
    options: {
      printWidth: 60,
    },
  },
];
