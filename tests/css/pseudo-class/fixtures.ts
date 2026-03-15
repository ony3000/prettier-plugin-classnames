import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: ':active',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* Unvisited links */
a:link {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
/* Visited links */
a:visited {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
/* Hovered links */
a:hover {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
/* Active links */
a:active {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Active paragraphs */
p:active {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':checked',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
div,
select {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Labels for checked inputs */
input:checked + label {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Radio element, when checked */
input[type="radio"]:checked {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Checkbox element, when checked */
input[type="checkbox"]:checked {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Option elements, when selected */
option:checked {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':disabled',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
input[type="text"]:disabled {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':first-of-type',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p:first-of-type {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':focus',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.red-input:focus {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.blue-input:focus {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':has()',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
section:has(.featured) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':hover',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
a {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

a:hover {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':last-of-type',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p:last-of-type {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':not()',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.fancy {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* <p> elements that don't have a class \`.fancy\` */
p:not(.fancy) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Elements that are not <p> elements */
body :not(p) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Elements that are not <div>s or \`.fancy\` */
body :not(div):not(.fancy) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Elements that are not <div>s or \`.fancy\` */
body :not(div, .fancy) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Elements inside an <h2> that aren't a <span> with a class of \`.foo\` */
h2 :not(span.foo) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: ':root',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
:root {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
