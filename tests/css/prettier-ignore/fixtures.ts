import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'ignore comment (1)',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* prettier-ignore */
#blue { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
`,
  },
  {
    name: 'ignore comment (2)',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@keyframes slide-and-fade {
  /* prettier-ignore */
  from { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
  50% { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
  to { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
}
`,
  },
  {
    name: 'comments that contain the phrase `prettier-ignore` but do not prevent formatting',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/**
 * prettier-ignore
 */
h1, h2, h3, h4, h5, h6 {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
