import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1)',
    input: `
const classes = tw\`lorem ipsum dolor sit amet\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet\`;
`,
  },
  {
    name: 'short enough (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet\`;
`,
  },
  {
    name: 'short enough (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
`,
    output: `const Bar = tw(Foo)\`lorem ipsum dolor sit amet\`;
`,
  },
  {
    name: 'near boundary (1)',
    input: `
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
  },
  {
    name: 'near boundary (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
  },
  {
    name: 'near boundary (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
    output: `const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
  },
  {
    name: 'long enough (1)',
    input: `
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
ex massa hendrerit eu posuere eu volutpat id neque
pellentesque\`;
`,
  },
  {
    name: 'long enough (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
ex massa hendrerit eu posuere eu volutpat id neque
pellentesque\`;
`,
  },
  {
    name: 'long enough (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
ex massa hendrerit eu posuere eu volutpat id neque
pellentesque\`;
`,
  },
];

testEach(fixtures, options);
