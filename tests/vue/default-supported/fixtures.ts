import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
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
  },
  {
    name: 'supported attributes and unsupported functions',
    input: `
<template>
  <div>
    <div>
      <div v-bind:class="foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
        <span>lorem ipsum</span>
      </div>
      <div :className="foo('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
        <span>lorem ipsum</span>
      </div>
    </div>
  </div>
</template>
`,
  },
  {
    name: 'unsupported attributes and supported functions',
    input: `
<template>
  <div>
    <div>
      <div v-bind:title="classNames('lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere')">
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
  },
];
