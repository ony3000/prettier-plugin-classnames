import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'vue',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: 'nested expression in template literal',
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
active ? 'bg-teal-600 text-white' : 'text-gray-900' }\`
    "
    :value="'test'"
  ></Combobox.Option>
</template>
`,
    options: {
      experimentalOptimization: false,
    },
  },
  {
    name: 'double nested expression in template literal',
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
active ? 'bg-teal-600 text-white' : 'text-gray-900' } text-white\`
            : 'text-gray-900'
}\`
    "
    :value="'test'"
  ></Combobox.Option>
</template>
`,
    options: {
      experimentalOptimization: false,
    },
  },
  {
    name: '(exp-1) nested expression in template literal',
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
    options: {
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-2) double nested expression in template literal',
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
    options: {
      experimentalOptimization: true,
    },
  },
];

testEach(fixtures, options);
