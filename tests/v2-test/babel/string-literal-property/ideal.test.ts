import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'lorem ipsum dolor sit amet': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        "lorem ipsum dolor sit amet": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'  lorem ipsum dolor sit amet  ': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        " lorem ipsum dolor sit amet ": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({
      'lorem ipsum\\
      dolor sit amet': true
    })}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        "lorem ipsum dolor sit amet": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'lorem ipsum dolor sit amet consectetur adipiscing elit proin': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing
        elit proin \`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin': true
    })}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere eu volutpat
        id neque pellentesque\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({'    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ': true})}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\` lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere eu volutpat
        id neque pellentesque \`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({
      'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque': true
    })}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere eu volutpat
        id neque pellentesque\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'syntax variants - component',
    input: `
export function Foo({ children }) {
  return (
    <Box className={classNames({'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere': true})}>
      {children}
    </Box>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <Box
      className={classNames({
        [\`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere\`]: true,
      })}
    >
      {children}
    </Box>
  );
}
`,
  },
];

testEach(fixtures, options);
