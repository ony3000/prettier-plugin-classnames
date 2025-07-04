import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  customFunctions: ['tw'],
  endingPosition: 'absolute',
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
    output: `const classes = tw\`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`;
`,
  },
  {
    name: 'near boundary (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`;
`,
  },
  {
    name: 'near boundary (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`;
`,
    output: `const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit
proin\`;
`,
  },
  {
    name: 'long enough (1)',
    input: `
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const classes = tw\`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`;
`,
  },
  {
    name: 'long enough (2)',
    input: `
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere eu
volutpat id neque pellentesque\`;
`,
  },
  {
    name: 'long enough (3)',
    input: `
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`;
`,
    output: `const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit
proin ex massa hendrerit eu posuere eu volutpat id neque
pellentesque\`;
`,
  },
  {
    name: 'syntax variants - written as an object value',
    input: `
const classes = {
  short: tw\`lorem ipsum dolor sit amet\`,
  near: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
  long: tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
};
`,
    output: `const classes = {
  short: tw\`lorem ipsum dolor sit amet\`,
  near: tw\`lorem ipsum dolor sit amet consectetur adipiscing
  elit proin\`,
  long: tw\`lorem ipsum dolor sit amet consectetur adipiscing
  elit proin ex massa hendrerit eu posuere eu volutpat id
  neque pellentesque\`,
};
`,
  },
  {
    name: 'The `String.raw` method should not be target to line wrapping, even if it is inside an attribute or function that is supported by default',
    input: `
export function Foo() {
  return (
    <div
      className={classNames([
        "lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque",
        String.raw\`[&_.react-datepicker\\_\\_input-container>div]:!border-red-50\`,
      ])}
    >
      content
    </div>
  );
}
`,
    output: `export function Foo() {
  return (
    <div
      className={classNames([
        \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa
        hendrerit eu posuere eu volutpat id neque pellentesque\`,
        String.raw\`[&_.react-datepicker\\_\\_input-container>div]:!border-red-50\`,
      ])}
    >
      content
    </div>
  );
}
`,
    options: {
      printWidth: 80,
    },
  },
];

testEach(fixtures, options);
