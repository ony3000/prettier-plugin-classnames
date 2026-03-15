import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
nav ul {
  &:extend(.inline);
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.inline {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'extend attached to selector',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.big-division,
.big-bag:extend(.bag),
.big-bucket:extend(.bucket) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'extending nested selectors',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.bucket {
  tr { // nested ruleset with target selector
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
.some-class:extend(.bucket tr) {} // nested ruleset is recognized
`,
  },
  {
    name: 'exact matching with extend',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.a.class,
.class.a,
.class > .a {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.test:extend(.class) {} // this will NOT match the any selectors above
`,
  },
  {
    name: 'nth expression',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
:nth-child(1n+3) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.child:extend(:nth-child(n+3)) {}

[title=identifier] {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
[title='identifier'] {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
[title="identifier"] {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.noQuote:extend([title=identifier]) {}
.singleQuote:extend([title='identifier']) {}
.doubleQuote:extend([title="identifier"]) {}
`,
  },
  {
    name: 'extend "all"',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.a.b.test,
.test.c {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.test {
  &:hover {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

.replacement:extend(.test all) {}
`,
  },
  {
    name: 'selector interpolation with extend',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.bucket {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
@{variable}:extend(.bucket) {}
@variable: .selector;
`,
  },
  {
    name: 'scoping / extend inside @media',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@media print {
  .screenClass:extend(.selector) {} // extend inside media
  .selector { // this will be matched - it is in the same media
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
.selector { // ruleset on top of style sheet - extend ignores it
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
@media screen {
  .selector {  // ruleset inside another media - extend ignores it
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: 'duplication detection',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.alert-info,
.widget {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.alert:extend(.alert-info, .widget) {}
`,
  },
];
