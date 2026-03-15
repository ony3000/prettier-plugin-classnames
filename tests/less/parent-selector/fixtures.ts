import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
a {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  &:hover {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

.button {
  &-ok {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
  &-cancel {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  &-custom {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: 'multiple &',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.link {
  & + & {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  & & {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  && {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  &, &ish {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: 'changing selector order',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
.header {
  .menu {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
    .no-borderradius & {
      @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
    }
  }
}
`,
  },
  {
    name: 'combinatorial explosion',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p, a, ul, li {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  & + & {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
];
