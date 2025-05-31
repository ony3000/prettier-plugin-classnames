import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: '(1) nested expression in template literal',
    input: `
<template>
    <Combobox.Option
        :class="({ active }) =>
            \`relative cursor-default select-none py-2 pl-10 pr-4 \${
                active
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-900'
            }\`
        "
        :value="'test'"
    ></Combobox.Option>
</template>
`,
    output: `<template>
  <Combobox.Option
    :class="
      ({ active }) =>
        \`relative cursor-default select-none py-2 pl-10 pr-4 \${
          active ? 'bg-teal-600 text-white' : 'text-gray-900'
        }\`
    "
    :value="'test'"
  ></Combobox.Option>
</template>
`,
  },
  {
    name: '(2) double nested expression in template literal',
    input: `
<template>
    <Combobox.Option
        :class="({ active }) =>
            \`relative cursor-default select-none py-2 pl-10 pr-4 \${
                active
                    ? \`bg-teal-600 \${active ? 'bg-teal-600 text-white' : 'text-gray-900'} text-white\`
                    : 'text-gray-900'
            }\`
        "
        :value="'test'"
    ></Combobox.Option>
</template>
`,
    output: `<template>
  <Combobox.Option
    :class="
      ({ active }) =>
        \`relative cursor-default select-none py-2 pl-10 pr-4 \${
          active
            ? \`bg-teal-600 \${
                active ? 'bg-teal-600 text-white' : 'text-gray-900'
              } text-white\`
            : 'text-gray-900'
        }\`
    "
    :value="'test'"
  ></Combobox.Option>
</template>
`,
  },
];

testEach(fixtures, options);
