import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';

import { thisPlugin, testEach } from '../../adaptor';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'relative',
};

const fixtures: Fixture[] = [
  {
    name: 'nested expression in template literal',
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
  active ? "bg-teal-600 text-white" : "text-gray-900" }\`,
);
---
`,
    options: {
      experimentalOptimization: false,
    },
  },
  {
    name: 'double nested expression in template literal',
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
      ? \`bg-teal-600 \${ active ? "bg-teal-600 text-white" : "text-gray-900" } text-white\`
      : "text-gray-900"
  }\`,
);
---
`,
    options: {
      experimentalOptimization: false,
    },
  },
  {
    name: '(exp-1) nested expression in template literal',
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
    options: {
      experimentalOptimization: true,
    },
  },
  {
    name: '(exp-2) double nested expression in template literal',
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
      ? \`bg-teal-600 \${ active ? "bg-teal-600 text-white" : "text-gray-900" } text-white\`
      : "text-gray-900"
  }\`,
);
---
`,
    options: {
      experimentalOptimization: true,
    },
  },
];

testEach(fixtures, options);
