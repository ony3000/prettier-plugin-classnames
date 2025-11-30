import { thisPlugin, testEach } from '../../adaptor';
import type { Fixture } from '../../settings';
import { baseOptions } from '../../settings';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'babel',
  endingPosition: 'absolute',
};

const fixtures: Fixture[] = [
  {
    name: '(1) nested expression in template literal',
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
    name: '(2) double nested expression in template literal',
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
            ? \`bg-teal-600
              \${active ? "bg-teal-600 text-white" : "text-gray-900"} text-white\`
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

testEach(fixtures, options);
