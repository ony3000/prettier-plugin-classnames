import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
  printWidth: 60,
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'valid ignore comment (1) - component',
    input: `
/* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `/* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (2) - element',
    input: `
export function Foo({ children }) {
  return (
    /* prettier-ignore */
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    /* prettier-ignore */
    <div
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (3) - attribute',
    input: `
export function Foo({ children }) {
  return (
    <div
      // prettier-ignore
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      // prettier-ignore
      className={classNames(
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'valid ignore comment (4) - class name combination',
    input: `
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Foo({ children }) {
  return (
    <div
      className={classNames(
        // prettier-ignore
        'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
        \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'invalid ignore comment (1) - formatting works as usual',
    input: `
/**
 * prettier-ignore
 */
export function Foo({ children }) {
  return (
    <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      {children}
    </div>
  );
}
`,
    output: `/**
 * prettier-ignore
 */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'invalid ignore comment (2) - formatting works as usual',
    input: `
// /* prettier-ignore */
export function Foo({ children }) {
  return (
    <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
      {children}
    </div>
  );
}
`,
    output: `// /* prettier-ignore */
export function Foo({ children }) {
  return (
    <div
      className={classNames(
        \`lorem ipsum dolor sit amet consectetur adipiscing elit proin
        ex massa hendrerit eu posuere\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
];

testEach(fixtures, options);
