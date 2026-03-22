import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) If no value is provided, the `printWidth` value is used as default.',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 80,
    },
  },
  {
    name: '(2) `classnamesPrintWidth` is shorter than `printWidth`.',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
//----------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 80,
      classnamesPrintWidth: 60,
    },
  },
  {
    name: '(3) `classnamesPrintWidth` is longer than `printWidth`.',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
//----------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 60,
      classnamesPrintWidth: 80,
    },
  },
];
