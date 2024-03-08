import { format } from 'prettier';
import type { Fixture } from 'test-settings';
import { baseOptions } from 'test-settings';
import { describe, expect, test } from 'vitest';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as thisPlugin from '@/packages/v2-plugin';

const options = {
  ...baseOptions,
  plugins: [thisPlugin],
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'string literal (1)',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal (2) - short enough class name',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal (3) - wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal (4) - short enough class name wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4')}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal (5) - multiple class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl',
        'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50',
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`,
        \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'string literal (6) - multiple class name',
    input: `
export function Callout({ children }) {
  return (
    <div className={'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' + 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\` +
        \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal (1)',
    input: `
export function Callout({ children }) {
  return (
    <div className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal (2) - wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames(\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`)}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (1) - single object, single property',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true },
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (2) - multiple object, single property for each object',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true },
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': false },
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        {
          [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
          dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
        },
        {
          [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
          dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: false,
        },
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (3) - single object, multiple property',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        {
          'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl': true,
          'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50': false,
        },
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
        dark:border-neutral-500/30 px-4 py-4 rounded-xl\`]: true,
        [\`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
        border-zinc-400/30 border bg-gray-100/50\`]: false,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (4) - dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true },
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
        dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (5) - ternary operator',
    input: `
export function Callout({ children }) {
  return (
    <div className={true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        true
          ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
            dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
          : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
            border-zinc-400/30 border bg-gray-100/50\`
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'conditional (6) - ternary operator in array',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames([true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50', true ? 'bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50 dark:border-neutral-500/30 px-4 py-4 rounded-xl' : 'rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50 border-zinc-400/30 border bg-gray-100/50'])}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames([
        true
          ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
            dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
          : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
            border-zinc-400/30 border bg-gray-100/50\`,
        true
          ? \`bg-gray-100/50 border border-zinc-400/30 dark:bg-neutral-900/50
            dark:border-neutral-500/30 px-4 py-4 rounded-xl\`
          : \`rounded-xl py-4 px-4 dark:border-neutral-500/30 dark:bg-neutral-900/50
            border-zinc-400/30 border bg-gray-100/50\`,
      ])}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (1) - short enough template literal class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`
      }
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (2) - short enough multi-line template literal class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (3) - short enough multi-line template literal class name wrapped in `classNames`',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4",
      )}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (4) - short enough dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'reversibility (5) - short enough multi-line dynamic class name',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4": true,
      })}
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'ending position (1)',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (2)',
    input: `
export function Callout({ children }) {
  return (
    <div className={classNames('rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50')}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames(
        \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`,
      )}
    >
      {children}
    </div>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (3)',
    input: `
export function Callout({ children }) {
  return (
    <div
      className={classNames(
        { 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50': true },
      )}
    >
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={classNames({
        [\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4
dark:border-neutral-500/30 dark:bg-neutral-900/50\`]: true,
      })}
    >
      {children}
    </div>
  );
}
`,
    options: {
      endingPosition: 'absolute',
    },
  },
  {
    name: 'ending position (4)',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={\`rounded-xl border border-zinc-400/30
        bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30
        dark:bg-neutral-900/50\`}
    >
      {children}
    </div>
  );
}
`,
    options: {
      printWidth: 60,
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'ending position (5) - useTabs: true',
    input: `
export function Callout({ children }) {
  return (
    <div className={'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50'}>
      {children}
    </div>
  );
}
`,
    output: `export function Callout({ children }) {
\treturn (
\t\t<div
\t\t\tclassName={\`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4
\t\t\t\tpy-4 dark:border-neutral-500/30 dark:bg-neutral-900/50\`}
\t\t>
\t\t\t{children}
\t\t</div>
\t);
}
`,
    options: {
      useTabs: true,
      endingPosition: 'absolute-with-indent',
    },
  },
  {
    name: 'issue #27 (1) - template literal ending with a space',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \`relative \` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? "relative " : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
  {
    name: 'issue #27 (2) - template literal starting with a space',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \` relative\` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? " relative" : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
  {
    name: 'issue #27 (3) - trimmed template literal (no error in v0.4.0, error in v0.5.0)',
    input: `
export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div
            key={key}
            className={\`\${key ? \`relative\` : \`\`}
            tablet:static\`}>{key}</div>
        );
      })}
    </div>
  );
}
`,
    output: `export default function Test() {
  return (
    <div>
      {[0, 1, 2, 3].map((key) => {
        return (
          <div key={key} className={\`\${key ? "relative" : ""} tablet:static\`}>
            {key}
          </div>
        );
      })}
    </div>
  );
}
`,
  },
  {
    name: 'template literal preservation (1)',
    input: `
export function Callout({ children }) {
  return <div className={\`\${''}\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`\${""}\` +
        "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal preservation (2)',
    input: `
export function Callout({ children }) {
  return <div className={\`""\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`""\` + "rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4"
      }
    >
      {children}
    </div>
  );
}
`,
  },
  {
    name: 'template literal preservation (3)',
    input: `
export function Callout({ children }) {
  return <div className={\`''\` + \`rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\`}>{children}</div>;
}
`,
    output: `export function Callout({ children }) {
  return (
    <div
      className={
        \`''\` + 'rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4'
      }
    >
      {children}
    </div>
  );
}
`,
    options: {
      singleQuote: true,
    },
  },
  {
    name: 'issue #39 (1) - nested expression in template literal',
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
    name: 'issue #39 (2) - double nested expression in template literal',
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
  {
    name: 'issue #39 (3) - double nested expression in template literal',
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
    options: {
      endingPosition: 'absolute-with-indent',
    },
  },
];

describe('typescript/expression', () => {
  for (const fixture of fixtures) {
    test(fixture.name, () => {
      expect(
        format(fixture.input, {
          ...options,
          ...(fixture.options ?? {}),
        }),
      ).toBe(fixture.output);
    });
  }
});
