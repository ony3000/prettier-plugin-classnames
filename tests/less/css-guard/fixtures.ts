import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
button when (@my-option = true) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

& when (@my-option = true) {
  button {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
  a {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
];
