import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) JSX Assignment',
    input: `
//-----------------------------------------------------------------------------| printWidth=80 (in snapshot)
function Foo() {
  let elem = (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      content
    </div>
  );
  elem = (
    <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere eu volutpat id neque pellentesque">
      content
    </div>
  );
  return elem;
}
`,
  },
];
