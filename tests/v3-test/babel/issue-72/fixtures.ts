import type { Fixture } from 'test-settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) If the end position is absolute, the delimiter following the class name is also included in the line wrapping.',
    input: `
//------------------------------------------------------------------| printWidth=69 (in snapshot)
export function Foo({ children }) {
  return (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing">
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 69,
    },
  },
  {
    name: '(2) If the end position is absolute, the delimiter following the class name is also included in the line wrapping.',
    input: `
//-------------------------------------------------------| printWidth=58 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum dolor sit amet consectetur adipiscing'}>
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 58,
    },
  },
  {
    name: '(3) If the end position is absolute, the delimiter following the class name is also included in the line wrapping.',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={' lorem ipsum dolor sit amet consectetur adipiscing '}>
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 60,
    },
  },
];
