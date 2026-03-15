import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '::after',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.exciting-text::after {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.boring-text::after {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '::before',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
q::before {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

q::after {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '::first-letter',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

h2 + p::first-letter {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '::marker',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
ul li::marker {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '::placeholder',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
input::placeholder {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '::selection',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* Make selected text gold on a red background */
::selection {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Make selected text in a paragraph white on a blue background */
p::selection {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
