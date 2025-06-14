import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: '(1) nested expression in template literal',
    input: `
---
import classNames from 'classnames'

const combination = classNames(
    \`relative cursor-default select-none py-2 pl-10 pr-4 \${
        active
            ? "bg-teal-600 text-white"
            : "text-gray-900"
    }\`
)
---
`,
    output: `---
import classNames from "classnames";

const combination = classNames(
  \`relative cursor-default select-none py-2 pl-10 pr-4 \${
    active ? "bg-teal-600 text-white" : "text-gray-900"
  }\`,
);
---
`,
  },
  {
    name: '(2) double nested expression in template literal',
    input: `
---
const combination = classNames(
    \`relative cursor-default select-none py-2 pl-10 pr-4 \${
        active
            ? \`bg-teal-600 \${active ? "bg-teal-600 text-white" : "text-gray-900"} text-white\`
            : "text-gray-900"
    }\`
)
---
`,
    output: `---
const combination = classNames(
  \`relative cursor-default select-none py-2 pl-10 pr-4 \${
    active
      ? \`bg-teal-600 \${active ? "bg-teal-600 text-white" : "text-gray-900"}
        text-white\`
      : "text-gray-900"
  }\`,
);
---
`,
  },
];

testEach(fixtures, options);
