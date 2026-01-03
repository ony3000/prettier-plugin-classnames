import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'endOfLine: crlf',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
}
`,
    options: {
      endOfLine: 'crlf',
    },
  },
  {
    name: 'tabWidth: 4',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
      {children}
    </div>
  );
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
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
  },
  {
    name: 'comment (2) - single line comment applied to multi line',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
// export function Foo({ children }) {
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div fixme="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={clsx('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
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
//---------------------------------------------------------| printWidth=60 (in snapshot)
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
  },
  {
    name: 'class name passed as a function argument',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
const Foo = forwardRef(function Foo() {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
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
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
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
    options: {
      printWidth: 80,
    },
  },
  {
    name: 'JSX mapped from object references including optional chaining',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
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
    options: {
      printWidth: 80,
    },
  },
];
