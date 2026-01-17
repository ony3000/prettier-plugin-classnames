import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do'or sit amet\`}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (2) - delimiter is single quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\\'or sit amet'}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains single quote (3) - delimiter is double quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'contains double quote (1) - delimiter is backtick',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do"or sit amet\`}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (2) - delimiter is single quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains double quote (3) - delimiter is double quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\\"or sit amet"}>
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: false,
    },
  },
  {
    name: 'contains backtick (1) - delimiter is backtick',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (3) - delimiter is double quote',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"}>
      {children}
    </div>
  );
}
`,
  },
];
