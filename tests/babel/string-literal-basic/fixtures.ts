import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: 'short enough (1) - single line with no spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum dolor sit amet'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={'  lorem ipsum dolor sit amet  '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'short enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      'lorem ipsum\\
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
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum dolor sit amet consectetur adipiscing elit proin'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={'   lorem ipsum dolor sit amet consectetur adipiscing elit proin   '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'near boundary (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      'lorem ipsum\\
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
export function Foo({ children }) {
  return (
    <div className={'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque'}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (2) - single line with spaces at both ends',
    input: `
export function Foo({ children }) {
  return (
    <div className={'    lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque    '}>
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'long enough (3) - multiple lines',
    input: `
export function Foo({ children }) {
  return (
    <div className={
      'lorem ipsum\\
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
export function Foo({ children }) {
  return (
    <Box className={'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere'}>
      {children}
    </Box>
  );
}
`,
  },
  {
    name: 'syntax variants - addition operation between strings',
    input: `
export function Foo({ children }) {
  return (
    <div className={'  lorem ipsum  ' + '  dolor sit amet  '}>
      {children}
    </div>
  );
}
`,
  },
];
