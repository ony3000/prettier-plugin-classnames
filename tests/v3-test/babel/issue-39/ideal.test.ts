import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'absolute-with-indent',
};

const fixtures: Fixture[] = [
  {
    name: 'nested expression in template literal',
    input: `
import { Combobox } from "@headlessui/react"

export default function ClassNameCb() {
    return (
        <Combobox.Option
            className={({ active }) =>
                \`relative cursor-default select-none py-2 pl-10 pr-4 \${
                    active
                        ? "bg-teal-600 text-white"
                        : "text-gray-900"
                }\`
            }
            value={"test"}
        ></Combobox.Option>
    )
}
`,
    output: `import { Combobox } from "@headlessui/react";

export default function ClassNameCb() {
  return (
    <Combobox.Option
      className={({ active }) =>
        \`relative cursor-default select-none py-2 pl-10 pr-4 \${
          active ? "bg-teal-600 text-white" : "text-gray-900"
        }\`
      }
      value={"test"}
    ></Combobox.Option>
  );
}
`,
  },
  {
    name: 'double nested expression in template literal',
    input: `
export default function ClassNameCb() {
    return (
        <Combobox.Option
            className={({ active }) =>
                \`relative cursor-default select-none py-2 pl-10 pr-4 \${
                    active
                        ? \`bg-teal-600 \${active ? "bg-teal-600 text-white" : "text-gray-900"} text-white\`
                        : "text-gray-900"
                }\`
            }
            value={"test"}
        ></Combobox.Option>
    )
}
`,
    output: `export default function ClassNameCb() {
  return (
    <Combobox.Option
      className={({ active }) =>
        \`relative cursor-default select-none py-2 pl-10 pr-4 \${
          active
            ? \`bg-teal-600 \${
                active ? "bg-teal-600 text-white" : "text-gray-900"
              } text-white\`
            : "text-gray-900"
        }\`
      }
      value={"test"}
    ></Combobox.Option>
  );
}
`,
  },
];

describe.each(fixtures)('$name', async ({ input, output, options: fixtureOptions }) => {
  const fixedOptions = {
    ...options,
    ...(fixtureOptions ?? {}),
  };
  const formattedText = await format(input, fixedOptions);

  test('expectation', () => {
    expect(formattedText).toBe(output);
  });

  test.runIf(formattedText === output)('consistency', async () => {
    const doubleFormattedText = await format(formattedText, fixedOptions);

    expect(doubleFormattedText).toBe(formattedText);
  });
});
