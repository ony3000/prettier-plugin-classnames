import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'supported attributes and supported functions',
    input: `
export function Foo() {
  return (
    <div>
      <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
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
        class={classNames(
          \`lorem ipsum dolor sit amet consectetur adipiscing
          elit proin ex massa hendrerit eu posuere\`,
        )}
      >
        <span>lorem ipsum</span>
      </div>
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
      <div class={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
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
        class={foo(
          \`lorem ipsum dolor sit amet consectetur adipiscing
          elit proin ex massa hendrerit eu posuere\`,
        )}
      >
        <span>lorem ipsum</span>
      </div>
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
