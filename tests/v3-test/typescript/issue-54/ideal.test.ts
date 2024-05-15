import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'delimiter conversion (1) - `jsxSingleQuote: true`',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className='lorem ipsum dolor sit amet'>{children}</div>;
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (2) - `jsxSingleQuote: true` but the class name includes a single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum do'or sit amet">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className="lorem ipsum do'or sit amet">{children}</div>;
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (3) - `jsxSingleQuote: false`',
    input: `
export function Foo({ children }) {
  return (
    <div className='lorem ipsum dolor sit amet'>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className="lorem ipsum dolor sit amet">{children}</div>;
}
`,
    options: {
      jsxSingleQuote: false,
    },
  },
  {
    name: 'delimiter conversion (4) - `jsxSingleQuote: false` but the class name includes a double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className='lorem ipsum do"or sit amet'>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return <div className='lorem ipsum do"or sit amet'>{children}</div>;
}
`,
    options: {
      jsxSingleQuote: false,
    },
  },
];

testEach(fixtures, options);
