import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

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
    name: 'supported attributes and supported functions',
    input: `
<template>
  <div>
    <div>
      <div v-bind:class="classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
        <span>lorem ipsum</span>
      </div>
      <div :className="classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
        v-bind:class="
          classNames(
            \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`,
          )
        "
      >
        <span>lorem ipsum</span>
      </div>
      <div
        :className="
          classNames(
            \`lorem ipsum dolor sit amet consectetur
adipiscing elit proin ex massa hendrerit eu posuere\`,
          )
        "
      >
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'unsupported attributes and unsupported functions',
    input: `
<template>
  <div>
    <div>
      <div v-bind:title="foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
        v-bind:title="
          foo(
            'lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere',
          )
        "
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
