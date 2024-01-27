import { parseLineByLineAndReplaceAsync } from 'core-parts';
import { ClassNameType } from 'core-parts/shared';
import type { Parser, ParserOptions } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) => babelParsers.babel.parse(text, options),
  parseTypescript: (text: string, options: ParserOptions) =>
    typescriptParsers.typescript.parse(text, options),
};

function transformParser(
  parserName: 'babel' | 'typescript' | 'vue',
  defaultParser: Parser,
): Parser {
  return {
    ...defaultParser,
    parse: async (text: string, options: ParserOptions) => {
      const firstFormattedText = await format(text, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
      });

      const ast = defaultParser.parse(firstFormattedText, options);
      const classNameWrappedText = await parseLineByLineAndReplaceAsync({
        formattedText: firstFormattedText,
        ast,
        // @ts-ignore
        options,
        format,
        addon,
      });

      const secondFormattedText = await format(classNameWrappedText, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
        rangeEnd: Infinity,
      });

      if (parserName === 'vue') {
        const secondAst = defaultParser.parse(secondFormattedText, options);
        const classNameSecondWrappedText = await parseLineByLineAndReplaceAsync({
          formattedText: secondFormattedText,
          ast: secondAst,
          // @ts-ignore
          options,
          format,
          addon,
          targetClassNameTypes: [ClassNameType.ASL, ClassNameType.AOL],
        });

        return {
          type: 'FormattedText',
          body: classNameSecondWrappedText,
        };
      }

      return {
        type: 'FormattedText',
        body: secondFormattedText,
      };
    },
    astFormat: 'classnames-ast',
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser('babel', babelParsers.babel),
  typescript: transformParser('typescript', typescriptParsers.typescript),
  vue: transformParser('vue', htmlParsers.vue),
};
