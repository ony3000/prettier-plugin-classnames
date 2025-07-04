import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  endingPosition: 'absolute',
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
    output: `export function Foo({ children }) {\r\n  return (\r\n    <div\r\n      className="lorem ipsum dolor sit amet consectetur\r\n        adipiscing elit proin ex massa hendrerit eu posuere"\r\n    >\r\n      {children}\r\n    </div>\r\n  );\r\n}\r\n`,
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
            className="lorem ipsum dolor sit amet
                consectetur adipiscing elit proin ex massa
                hendrerit eu posuere"
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
\t\t\tclassName="lorem ipsum dolor sit amet consectetur
\t\t\t\tadipiscing elit proin ex massa hendrerit eu posuere"
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
\t\t\tclassName="lorem ipsum dolor sit amet
\t\t\t\tconsectetur adipiscing elit proin ex massa
\t\t\t\thendrerit eu posuere"
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
\t\t\tclassName="lorem ipsum dolor sit
\t\t\t\tamet consectetur adipiscing
\t\t\t\telit proin ex massa
\t\t\t\thendrerit eu posuere"
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
      fixme="lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere"
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
        \`lorem ipsum dolor sit amet consectetur adipiscing
        elit proin ex massa hendrerit eu posuere\`,
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
        near: \`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin\`,
        long: \`lorem ipsum dolor sit amet consectetur
        adipiscing elit proin ex massa hendrerit eu posuere
        eu volutpat id neque pellentesque\`,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'class name passed as a function argument',
    input: `
const Foo = forwardRef(function Foo() {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      content
    </div>
  );
});
`,
    output: `const Foo = forwardRef(function Foo() {
  return (
    <div
      className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex
        massa hendrerit eu posuere eu volutpat id neque pellentesque"
    >
      content
    </div>
  );
});
`,
    options: {
      printWidth: 80,
    },
  },
  {
    name: "class name inside the 'if' block",
    input: `
function Foo() {
  let elem;
  if (true) {
    elem = (
      <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
        content
      </div>
    );
  }
  return elem;
}
`,
    output: `function Foo() {
  let elem;
  if (true) {
    elem = (
      <div
        className="lorem ipsum dolor sit amet consectetur adipiscing elit proin
          ex massa hendrerit eu posuere eu volutpat id neque pellentesque"
      >
        content
      </div>
    );
  }
  return elem;
}
`,
    options: {
      printWidth: 80,
    },
  },
  {
    name: 'JSX mapped from object references including optional chaining',
    input: `
function Foo() {
  return (
    <div>
      {foo?.data.map((_, index) => (
        <div key={index} className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
          content
        </div>
      ))}
    </div>
  );
}
`,
    output: `function Foo() {
  return (
    <div>
      {foo?.data.map((_, index) => (
        <div
          key={index}
          className="lorem ipsum dolor sit amet consectetur adipiscing elit
            proin ex massa hendrerit eu posuere eu volutpat id neque
            pellentesque"
        >
          content
        </div>
      ))}
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
