import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'example',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
// declare detached ruleset
@detached-ruleset: { @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere; }; // semi-colon is optional in 3.5.0+

// use detached ruleset
.top {
    @detached-ruleset();
}
`,
  },
  {
    name: 'scoping',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@detached-ruleset: {
  caller-variable: @caller-variable; // variable is undefined here
  .caller-mixin(); // mixin is undefined here
};

selector {
  // use detached ruleset
  @detached-ruleset();

  // define variable and mixin needed inside the detached ruleset
  @caller-variable: value;
  .caller-mixin() {
    @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
  }
}
`,
  },
  {
    name: 'property / variable accessors',
    input: `
/* --------------------------------------------------------| printWidth=60 (in snapshot) */
@config: {
  option1: true;
  option2: false;
}

.mixin() when (@config[option1] = true) {
  @apply lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere;
}

.box {
  .mixin();
}
`,
  },
];
