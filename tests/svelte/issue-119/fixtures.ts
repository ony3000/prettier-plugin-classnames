import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) These fixtures must have the same class name formatting results.',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<div class={['flex w-0 cursor-default overflow-clip transition-[width] duration-300 group-hover:w-5 focus-visible:w-5']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(2) These fixtures must have the same class name formatting results.',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
</script>

<div class={['flex w-0 cursor-default overflow-clip transition-[width] duration-300 group-hover:w-5 focus-visible:w-5']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
  {
    name: '(3) These fixtures must have the same class name formatting results.',
    input: `
<!-- ------------------------------------------------------| printWidth=60 (in snapshot) -->
<script>
  //
</script>

<div class={['flex w-0 cursor-default overflow-clip transition-[width] duration-300 group-hover:w-5 focus-visible:w-5']}></div>
`,
    options: {
      printWidth: 60,
    },
  },
];
