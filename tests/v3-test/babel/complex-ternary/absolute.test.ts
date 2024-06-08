import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'nested ternary (1) - string literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested ternary (2) - template literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`)
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested ternary (3) - nested expression in falsy part',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
          : \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'nested ternary (4) - nested expression in truthy part',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
        : 'lorem ipsum dolor sit amet'
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? condition
            ? \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
            : \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
          : "lorem ipsum dolor sit amet"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested ternary (1) - string literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'))
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested ternary (2) - template literal ternary',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? \`lorem ipsum dolor sit amet\`
        : (condition
            ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\`
            : (condition ? \`lorem ipsum dolor sit amet consectetur adipiscing elit proin\` : \`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`))
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested ternary (3) - nested expression in falsy part',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? 'lorem ipsum dolor sit amet'
        : (condition
            ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'
            : (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`))
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? "lorem ipsum dolor sit amet"
          : condition
          ? \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : condition
          ? \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
          : \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'double nested ternary (4) - nested expression in truthy part',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      condition
        ? (condition
            ? (condition ? \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\` : \`lorem ipsum dolor sit amet \${'consectetur adipiscing elit proin'} ex massa hendrerit eu posuere\`)
            : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin')
        : 'lorem ipsum dolor sit amet'
    }>
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={
        condition
          ? condition
            ? condition
              ? \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
              : \`lorem ipsum dolor sit amet \${\`consectetur
adipiscing elit proin\`} ex massa hendrerit eu posuere\`
            : \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin\`
          : "lorem ipsum dolor sit amet"
      }
    >
      {children}
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
