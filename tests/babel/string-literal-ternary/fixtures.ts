import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? 'lorem ipsum dolor sit amet' : 'lorem ipsum dolor sit amet'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? '  lorem ipsum dolor sit amet  ' : '  lorem ipsum dolor sit amet  '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={
      condition ? 'lorem ipsum\\
      dolor sit amet' : 'lorem ipsum\\
      dolor sit amet'
    }>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (1) - single line with no spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? '   lorem ipsum dolor sit amet consectetur adipiscing elit proin   ' : '   lorem ipsum dolor sit amet consectetur adipiscing elit proin   '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={
      condition ? 'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin' : 'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin'
    }>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (1) - single line with no spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={condition ? '    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    ' : '    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <div className={
      condition ? 'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque' : 'lorem ipsum\\
      dolor sit amet\\
      consectetur adipiscing elit\\
      proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'
    }>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'syntax variants - component',
    input: `
//---------------------------------------------------------| printWidth=60 (in snapshot)
export function Foo({ children }) {
  return (
    <Box className={condition ? 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere' : 'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      {children}
    </Box>
  );
}
`,
  },
];
