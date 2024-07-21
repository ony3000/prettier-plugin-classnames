import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'endOfLine: crlf',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {\r\n  return (\r\n    <div\r\n      className="lorem ipsum dolor sit amet consectetur adipiscing elit proin\r\n        ex massa hendrerit eu posuere"\r\n    >\r\n      {children}\r\n    </div>\r\n  );\r\n}\r\n`,
    options: {
      endOfLine: 'crlf',
    },
  },
  {
    name: 'tabWidth: 4',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
    return (
        <div
            className="lorem ipsum dolor sit amet consectetur adipiscing elit proin
                ex massa hendrerit eu posuere"
        >
            {children}
        </div>
    );
}
`,
    options: {
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (1) - tabWidth: 2',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
\treturn (
\t\t<div
\t\t\tclassName="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t{children}
\t\t</div>
\t);
}
`,
    options: {
      useTabs: true,
      tabWidth: 2,
    },
  },
  {
    name: 'useTabs: true (2) - tabWidth: 4',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
\treturn (
\t\t<div
\t\t\tclassName="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t{children}
\t\t</div>
\t);
}
`,
    options: {
      useTabs: true,
      tabWidth: 4,
    },
  },
  {
    name: 'useTabs: true (3) - tabWidth: 8',
    input: `
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
\treturn (
\t\t<div
\t\t\tclassName="lorem ipsum dolor sit amet consectetur adipiscing elit proin
\t\t\t\tex massa hendrerit eu posuere"
\t\t>
\t\t\t{children}
\t\t</div>
\t);
}
`,
    options: {
      useTabs: true,
      tabWidth: 8,
    },
  },
  {
    name: 'comment (1) - multi line comment',
    input: `
/*
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
*/
`,
    output: `/*
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
*/
`,
  },
  {
    name: 'comment (2) - single line comment applied to multi line',
    input: `
// export function Foo({ children }) {
//   return (
//     <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
//       {children}
//     </div>
//   );
// }
`,
    output: `// export function Foo({ children }) {
//   return (
//     <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
//       {children}
//     </div>
//   );
// }
`,
  },
  {
    name: 'plugin options (1) - custom attributes',
    input: `
export function Foo({ children }) {
  return (
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere"
    >
      {children}
    </div>
  );
}
`,
    options: {
      customAttributes: ['fixme'],
    },
  },
  {
    name: 'plugin options (2) - custom functions',
    input: `
export function Foo({ children }) {
  return (
    <div className={clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={clsx(
        \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
    options: {
      customFunctions: ['clsx'],
    },
  },
  {
    name: 'template literal - written as an object value',
    input: `
export function Foo({ children }) {
  return (
    <div className={classNames({
      short: \`lorem ipsum dolor sit amet\`,
      near: \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`,
      long: \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque\`,
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
        short: "lorem ipsum dolor sit amet",
        near: "lorem ipsum dolor sit amet consectetur adipiscing elit proin",
        long: \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere eu volutpat id neque
        pellentesque\`,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
