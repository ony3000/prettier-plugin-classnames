import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'nested expression (1) - string literal basic',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      'consectetur adipiscing elit proin'
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested expression (2) - template literal basic',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      \`consectetur adipiscing elit proin\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested expression (1) - string literal basic',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${"consectetur adipiscing elit proin"} ex
massa hendrerit eu posuere\`} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested expression (2) - template literal basic',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${\`consectetur adipiscing elit proin\`} ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${"consectetur adipiscing elit proin"} ex
massa hendrerit eu posuere\`} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested expression (3) - string literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested expression (4) - template literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested expression (3) - string literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? 'consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`} ex massa hendrerit eu
posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested expression (4) - template literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet \${
      \`lorem ipsum dolor sit amet \${
        condition ? \`consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`
      } ex massa hendrerit eu posuere\`
    } ex massa hendrerit eu posuere\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={\`lorem ipsum dolor sit amet \${\`lorem ipsum
dolor sit amet \${
condition
          ? "consectetur adipiscing elit proin"
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
} ex massa hendrerit eu posuere\`} ex massa hendrerit eu
posuere\`}
    >
      {children}
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
