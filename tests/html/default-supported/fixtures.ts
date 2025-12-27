import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
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
  },
];
