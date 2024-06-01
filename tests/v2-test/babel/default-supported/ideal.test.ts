import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'supported attributes and supported functions',
    input: `
export function Foo() {
  return (
    <div>
      <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
    output: `export function Foo() {
  return (
    <div>
      <div
        className={classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing
          elit proin ex massa hendrerit eu posuere\`,
        )}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
  },
  {
    name: 'supported attributes and unsupported functions',
    input: `
export function Foo() {
  return (
    <div>
      <div className={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
    output: `export function Foo() {
  return (
    <div>
      <div
        className={foo(
          \`lorem ipsum dolor sit amet consectetur adipiscing
          elit proin ex massa hendrerit eu posuere\`,
        )}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
  },
  {
    name: 'unsupported attributes and supported functions',
    input: `
export function Foo() {
  return (
    <div>
      <div title={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
    output: `export function Foo() {
  return (
    <div>
      <div
        title={classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing
          elit proin ex massa hendrerit eu posuere\`,
        )}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
  },
  {
    name: 'unsupported attributes and unsupported functions',
    input: `
export function Foo() {
  return (
    <div>
      <div title={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
    output: `export function Foo() {
  return (
    <div>
      <div
        title={foo(
          "lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere",
        )}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
