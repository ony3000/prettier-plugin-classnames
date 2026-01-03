import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) Empty JSX tags should also behave the same as named tags.',
    input: `
<!-- --------------------------------------------------------------------------| printWidth=80 (in snapshot) -->
<div>
  <div>
    <>
      <div class="flex min-h-screen flex-col gap-8 px-5 py-8 sm:gap-16 sm:px-12 sm:py-16 lg:gap-24 lg:px-20 lg:py-24">
        content
      </div>
    </>
  </div>
</div>
`,
  },
];
