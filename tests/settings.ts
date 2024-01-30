import type { Options } from 'prettier';
// @ts-ignore
import * as classnamesPlugin from 'prettier-plugin-classnames';

export type Fixture = {
  name: string;
  input: string;
  output: string;
  options?: Options;
};

export { format } from 'prettier';

export const baseOptions: Options = {
  plugins: [classnamesPlugin],
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: false,
};
