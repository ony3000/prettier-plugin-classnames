import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'variable interpolation',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
// Variables
@my-selector: banner;

// Usage
.@{my-selector} {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
