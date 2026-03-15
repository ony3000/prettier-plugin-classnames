import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '@color-profile',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@color-profile --swop5c {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.header {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@container',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* A container context based on inline size */
.post {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

/* Apply styles if the container is narrower than 650px */
@container (width < 650px) {
  .card {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@counter-style',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@counter-style circled-alpha {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.items {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@font-face',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@font-face {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

body {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@font-feature-values',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
/* At-rule for "nice-style" in Font One */
@font-feature-values Font One {
  @styleset {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

/* At-rule for "nice-style" in Font Two */
@font-feature-values Font Two {
  @styleset {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

/* Apply the at-rules with a single declaration */
.nice-look {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@font-palette-values',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@import "https://fonts.googleapis.com/css2?family=Bungee+Spice";
p {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
@font-palette-values --Alternate {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
.alternate {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@keyframes',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@keyframes slide-in {
  from {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  to {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@layer',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
p {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@layer type {
  .box p {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@media',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@media print {
  body {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

@media screen {
  body {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

@media screen, print {
  body {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@page',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@page {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

section {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@media print {
  button {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@position-try',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@position-try --custom-left {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@position-try --custom-bottom {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@position-try --custom-right {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@position-try --custom-bottom-right {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@property',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@property --myColor {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@property --myWidth {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

p {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
  {
    name: '@scope',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@scope (.light-scheme) {
  :scope {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  a {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}

@scope (.dark-scheme) {
  :scope {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }

  a {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@starting-style',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
#target {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

@starting-style {
  #target {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: '@view-transition',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@view-transition {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}
`,
  },
];
