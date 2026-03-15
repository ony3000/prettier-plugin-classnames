import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.a, #b {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.mixin-class {
  .a();
}
.mixin-id {
  #b();
}
`,
  },
  {
    name: 'mixins with parentheses',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.my-mixin {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.my-other-mixin() {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.class {
  .my-mixin();
  .my-other-mixin();
}
`,
  },
  {
    name: 'selectors in mixins',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.my-hover-mixin() {
  &:hover {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
button {
  .my-hover-mixin();
}
`,
  },
  {
    name: 'namespaces',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
#my-library {
  .my-mixin() {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
// which can be used like this
.class {
  #my-library.my-mixin();
}
`,
  },
  {
    name: 'guarded namespaces',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
#namespace when (@mode = huge) {
  .mixin() { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
}

#namespace {
  .mixin() when (@mode = huge) { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
}

#sp_1 when (default()) {
  #sp_2 when (default()) {
    .mixin() when not(default()) { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }
  }
}
`,
  },
  {
    name: 'pattern-matching',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.mixin(dark, @color) {
  color: darken(@color, 10%);
}
.mixin(light, @color) {
  color: lighten(@color, 10%);
}
.mixin(@_, @color) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: 'mixin guards',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.mixin(@a) when (lightness(@a) >= 50%) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.mixin(@a) when (lightness(@a) < 50%) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.mixin(@a) {
  color: @a;
}
`,
  },
];
