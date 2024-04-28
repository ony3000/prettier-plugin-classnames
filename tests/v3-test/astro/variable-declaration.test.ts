import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v3-plugin';

const options = {
  ...baseOptions,
  plugins: ['prettier-plugin-astro', thisPlugin],
  parser: 'astro',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal (1)',
    input: `
---
const combination = 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'
---
`,
    output: `---
const combination =
  "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50";
---
`,
  },
  {
    name: 'string literal (2) - wrapped in `classNames`',
    input: `
---
import classNames from 'classnames'

const combination = classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')
---
`,
    output: `---
import classNames from "classnames";

const combination = classNames(
  \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
  dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
);
---
`,
  },
  {
    name: 'issue #39 (1) - nested expression in template literal',
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
    name: 'issue #39 (2) - double nested expression in template literal',
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
      ? \`bg-teal-600 \${
          active ? "bg-teal-600 text-white" : "text-gray-900"
        } text-white\`
      : "text-gray-900"
  }\`,
);
---
`,
  },
  {
    name: 'issue #39 (3) - double nested expression in template literal',
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
    options: {
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'tagged template (1)',
    input: `
---
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
---
`,
    output: `---
const classes = tw\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit
eu posuere\`;
---
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'relative',
    },
  },
  {
    name: 'tagged template (2)',
    input: `
---
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
---
`,
    output: `---
const Bar = tw.foo\`lorem ipsum dolor sit amet consectetur adipiscing elit proin
ex massa hendrerit eu posuere\`;
---
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'absolute',
    },
  },
  {
    name: 'tagged template (3)',
    input: `
---
const Bar = tw(Foo)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa hendrerit eu posuere\`;
---
`,
    output: `---
const Bar = tw(
  Foo,
)\`lorem ipsum dolor sit amet consectetur adipiscing elit proin ex massa
hendrerit eu posuere\`;
---
`,
    options: {
      customFunctions: ['tw'],
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'tagged template (4) - short enough class name',
    input: `
---
const classes = tw\`lorem ipsum dolor sit amet\`;
---
`,
    output: `---
const classes = tw\`lorem ipsum dolor sit amet\`;
---
`,
    options: {
      customFunctions: ['tw'],
    },
  },
];

describe('astro/variable-declaration', () => {
  for (const fixture of fixtures) {
    test(fixture.name, async () => {
      expect(
        await format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
