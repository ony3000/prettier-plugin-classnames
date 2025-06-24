import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) Line wrapping must be performed even when including TypeScript syntax inside script tag.',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script lang="ts">
  let inputElement: HTMLInputElement;
</script>

<div class="relative">
  <input
    class="text-primary-700 w-full rounded-md border border-gray-300 px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
`,
    options: {
      printWidth: 60,
    },
  },
];
