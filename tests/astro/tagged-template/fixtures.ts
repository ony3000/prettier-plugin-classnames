import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const classes = tw\`lorem ipsum dolor sit amet\`;
---
`,
  },
  {
    name: 'short enough (2)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
---
`,
  },
  {
    name: 'short enough (3)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
---
`,
  },
  {
    name: 'near boundary (1)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
---
`,
  },
  {
    name: 'near boundary (2)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
---
`,
  },
  {
    name: 'near boundary (3)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
---
`,
  },
  {
    name: 'long enough (1)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
---
`,
  },
  {
    name: 'long enough (2)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
---
`,
  },
  {
    name: 'long enough (3)',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
---
`,
  },
  {
    name: 'syntax variants - written as an object value',
    input: `
//----------------------------------------------------------| printWidth=60 (in snapshot)
---
const classes = {
  short: tw\`lorem ipsum dolor sit amet\`,
  near: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
  long: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
};
---
`,
  },
];
