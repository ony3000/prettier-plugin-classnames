import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'contains single quote (1) - delimiter is backtick',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do'or sit amet\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
    name: 'contains single quote (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\\'or sit amet'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
    name: 'contains single quote (3) - delimiter is double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do'or sit amet"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do"or sit amet\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
    name: 'contains double quote (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do"or sit amet'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\\"or sit amet"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
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
    name: 'contains backtick (1) - delimiter is backtick',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (2) - delimiter is single quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'contains backtick (3) - delimiter is double quote',
    input: `
export function Foo({ children }) {
  return (
    <div className={"lorem ipsum do\`or sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum do\\\`or sit amet consectetur adipiscing elit
        proin ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
