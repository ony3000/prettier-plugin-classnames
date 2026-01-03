import type { Fixture } from '../../settings';

export const fixtures: Omit<Fixture, 'output'>[] = [
  {
    name: '(1) nested expression in template literal',
    input: `
---
//------------------------------------------------------------------------------| printWidth=80 (in snapshot)
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
  },
  {
    name: '(2) double nested expression in template literal',
    input: `
---
//------------------------------------------------------------------------------| printWidth=80 (in snapshot)
const combination = classNames(
    \`relative cursor-default select-none py-2 pl-10 pr-4 \${
        active
            ? \`bg-teal-600 \${active ? "bg-teal-600 text-white" : "text-gray-900"} text-white\`
            : "text-gray-900"
    }\`
)
---
`,
  },
];
