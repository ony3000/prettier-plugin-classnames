import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* This CSS will print because %message-shared is extended. */
%message-shared {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

// This CSS won't print because %equal-heights is never extended.
%equal-heights {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.message {
  @extend %message-shared;
}

.success {
  @extend %message-shared;
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.error {
  @extend %message-shared;
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.warning {
  @extend %message-shared;
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
