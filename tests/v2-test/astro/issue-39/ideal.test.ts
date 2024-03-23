import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
  endingPosition: 'absolute-with-indent',
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
    active ? "bg-teal-600 text-white" : "text-gray-900"
  }\`,
);
---
`,
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
      ? \`bg-teal-600 \${active ? "bg-teal-600 text-white" : "text-gray-900"}
        text-white\`
      : "text-gray-900"
  }\`,
);
---
`,
  },
];

describe.each(fixtures)('$name', ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', () => {
    const doubleFormattedText = format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
