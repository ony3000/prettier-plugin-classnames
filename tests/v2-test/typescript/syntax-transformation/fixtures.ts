import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) Short enough class names do not cause syntactic transformations.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet">
      {children}
    </div>
  );
}
`,
    options: {
      syntaxTransformation: true,
    },
  },
  {
    name: '(2) Long enough class names cause syntactic transformations.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    options: {
      syntaxTransformation: true,
    },
  },
  {
    name: '(3) This transformation does not support reversible formatting.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={\`lorem ipsum dolor sit amet\`}>
      {children}
    </div>
  );
}
`,
    options: {
      syntaxTransformation: true,
    },
  },
];
