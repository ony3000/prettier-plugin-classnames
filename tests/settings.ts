import type { Options as V2Options } from 'prettier';
import { format as v2Format } from 'prettier';
import type { Options as V3Options } from 'prettier3';
import { format as v3Format } from 'prettier3';

import { parsers as v2Parsers, printers as v2Printers, options as v2Options } from '@/v2-plugin';
import { parsers as v3Parsers, printers as v3Printers, options as v3Options } from '@/v3-plugin';

const v2Plugin = {
  parsers: v2Parsers,
  printers: v2Printers,
  options: v2Options,
};
const v3Plugin = {
  parsers: v3Parsers,
  printers: v3Printers,
  options: v3Options,
};

export type Fixture = {
  name: string;
  input: string;
  output: string;
};

export const format = process.env.PRETTIER_VERSION === '2' ? v2Format : v3Format;

const baseOptionsWithoutPlugins = {
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
} as const;

export const baseOptions =
  process.env.PRETTIER_VERSION === '2'
    ? ({
        plugins: [v2Plugin],
        ...baseOptionsWithoutPlugins,
      } as V2Options)
    : ({
        plugins: [v3Plugin],
        ...baseOptionsWithoutPlugins,
      } as V3Options);
