import { format, baseOptions } from '../settings';

const options = {
  ...baseOptions,
  parser: 'babel',
};

describe('babel/others', () => {
  test('tabWidth: 4', async () => {
    const input = `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`;
    const output = `export function Callout({ children }) {\n    return (\n        <div\n            className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n                dark:border-neutral-500/30 dark:bg-neutral-900/50"\n        >\n            {children}\n        </div>\n    );\n}\n`;

    // @ts-ignore
    expect(await format(input, { ...options, tabWidth: 4 })).toBe(output);
  });

  test('useTabs: true', async () => {
    const input = `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`;
    const output = `export function Callout({ children }) {\n\treturn (\n\t\t<div\n\t\t\tclassName="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\n\t\t\t\tdark:border-neutral-500/30 dark:bg-neutral-900/50"\n\t\t>\n\t\t\t{children}\n\t\t</div>\n\t);\n}\n`;

    // @ts-ignore
    expect(await format(input, { ...options, useTabs: true })).toBe(output);
  });

  test('endOfLine: crlf', async () => {
    const input = `\nexport function Callout({ children }) {\n  return (\n    <div className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4 dark:border-neutral-500/30 dark:bg-neutral-900/50">\n      {children}\n    </div>\n  );\n}\n`;
    const output = `export function Callout({ children }) {\r\n  return (\r\n    <div\r\n      className="rounded-xl border border-zinc-400/30 bg-gray-100/50 px-4 py-4\r\n        dark:border-neutral-500/30 dark:bg-neutral-900/50"\r\n    >\r\n      {children}\r\n    </div>\r\n  );\r\n}\r\n`;

    // @ts-ignore
    expect(await format(input, { ...options, endOfLine: 'crlf' })).toBe(output);
  });
});
