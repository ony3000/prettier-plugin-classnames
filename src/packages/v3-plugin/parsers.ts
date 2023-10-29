import { format as formatSync } from '@prettier/sync';
import { parseLineByLineAndReplace } from 'core-parts';
import type { Parser, ParserOptions, Options } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

function transformParser(parser: Parser): Parser {
  return {
    ...parser,
    preprocess: (originalText: string, options: ParserOptions) => {
      const cloneableOptions: Options = {
        ...Object.fromEntries(
          (
            [
              'printWidth',
              'tabWidth',
              'useTabs',
              'semi',
              'singleQuote',
              'jsxSingleQuote',
              'trailingComma',
              'bracketSpacing',
              'bracketSameLine',
              'jsxBracketSameLine',
              'rangeStart',
              'rangeEnd',
              'parser',
              'requirePragma',
              'insertPragma',
              'proseWrap',
              'arrowParens',
              'htmlWhitespaceSensitivity',
              'endOfLine',
              'quoteProps',
              'vueIndentScriptAndStyle',
              'embeddedLanguageFormatting',
              'singleAttributePerLine',
            ] as const
          ).map((key) => [key, options[key]]),
        ),
        // @ts-ignore
        customAttributes: options.customAttributes,
        // @ts-ignore
        customFunctions: options.customFunctions,
      };

      const firstFormattedText = formatSync(originalText, {
        ...cloneableOptions,
        plugins: [],
        endOfLine: 'lf',
      });
      const ast = parser.parse(firstFormattedText, options);
      const classNameWrappedText = parseLineByLineAndReplace(
        firstFormattedText,
        ast,
        // @ts-ignore
        cloneableOptions,
        formatSync,
      );

      return classNameWrappedText;
    },
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser(babelParsers.babel),
  typescript: transformParser(typescriptParsers.typescript),
  vue: transformParser(htmlParsers.vue),
};
