import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'delimiter conversion (1) - `jsxSingleQuote: true`',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (2) - `jsxSingleQuote: true` but the class name includes a single quote',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum do'or sit amet">
      {children}
    </div>
  );
}
`,
    options: {
      jsxSingleQuote: true,
    },
  },
  {
    name: 'delimiter conversion (3) - `jsxSingleQuote: false`',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo({ children }) {
  return (
    <div className='lorem ipsum dolor sit amet'>
      {children}
    </div>
  );
}
`,
    options: {
      jsxSingleQuote: false,
    },
  },
  {
    name: 'delimiter conversion (4) - `jsxSingleQuote: false` but the class name includes a double quote',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo({ children }) {
  return (
    <div className='lorem ipsum do"or sit amet'>
      {children}
    </div>
  );
}
`,
    options: {
      jsxSingleQuote: false,
    },
  },
];
