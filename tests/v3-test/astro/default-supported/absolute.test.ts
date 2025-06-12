import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'supported attributes and supported functions',
    input: `
<div>
  <div>
    <div>
      <div class={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div className={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div class:list={[classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')]}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
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
      <div
        class:list={[
          classNames(
            \`lorem ipsum dolor sit amet consectetur
            adipiscing elit proin ex massa hendrerit eu
            posuere\`,
          ),
        ]}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
  {
    name: 'supported attributes and unsupported functions',
    input: `
<div>
  <div>
    <div>
      <div class={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div className={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
      <div class:list={[foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')]}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
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
      <div
        class:list={[
          foo(
            \`lorem ipsum dolor sit amet consectetur
            adipiscing elit proin ex massa hendrerit eu
            posuere\`,
          ),
        ]}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
  {
    name: 'unsupported attributes and supported functions',
    input: `
<div>
  <div>
    <div>
      <div title={classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
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
  </div>
</div>
`,
  },
  {
    name: 'unsupported attributes and unsupported functions',
    input: `
<div>
  <div>
    <div>
      <div title={foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')}>
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
    output: `<div>
  <div>
    <div>
      <div
        title={foo(
          "lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere",
        )}
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</div>
`,
  },
];

testEach(fixtures, options);
