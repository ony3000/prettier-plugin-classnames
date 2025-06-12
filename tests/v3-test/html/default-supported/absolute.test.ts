import type { Fixture } from '../../../test-settings';
import { baseOptions } from '../../../test-settings';
import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'html',
  printWidth: 60,
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'supported attributes',
    input: `
<template>
  <div>
    <div>
      <div class="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
        <span>lorem ipsum</span>
      </div>
      <div className="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div>
      <div
        class="lorem ipsum dolor sit amet consectetur
          adipiscing elit proin ex massa hendrerit eu
          posuere"
      >
        <span>lorem ipsum</span>
      </div>
      <div
        className="lorem ipsum dolor sit amet consectetur
          adipiscing elit proin ex massa hendrerit eu
          posuere"
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'unsupported attributes',
    input: `
<template>
  <div>
    <div>
      <div title="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere">
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
    output: `<template>
  <div>
    <div>
      <div
        title="lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere"
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
  },
];

testEach(fixtures, options);
