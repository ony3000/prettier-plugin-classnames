import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'child combinator',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
span {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

div > span {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'descendant combinator',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
li {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

li li {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'next-sibling combinator',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
li:first-of-type + li {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'subsequent-sibling combinator',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p ~ span {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
