import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough object key (no error in v0.4.0, error in v0.5.0 ~ v0.6.0)',
    input: `
<template>
  <div
    :class="{
        'bg-black': true
    }">Some text</div>
</template>
`,
  },
];
