import { parseLineByLineAndReplace } from 'core-parts';
import type { Parser, ParserOptions } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as htmlParsers } from 'prettier/parser-html';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) =>
    babelParsers.babel.parse(text, { babel: babelParsers.babel }, options),
  parseTypescript: (text: string, options: ParserOptions) =>
    typescriptParsers.typescript.parse(text, { typescript: typescriptParsers.typescript }, options),
};

function transformParser(
  parserName: 'babel' | 'typescript' | 'vue',
  defaultParser: Parser,
): Parser {
  return {
    ...defaultParser,
    parse: (text: string, parsers: { [parserName: string]: Parser }, options: ParserOptions) => {
      const firstFormattedText = format(text, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
      });
      const ast = defaultParser.parse(firstFormattedText, { [parserName]: defaultParser }, options);

      const classNameWrappedText = parseLineByLineAndReplace(
        firstFormattedText,
        ast,
        // @ts-ignore
        options,
        format,
        addon,
      );

      if (parserName === 'vue') {
        return {
          type: 'FormattedText',
          body: classNameWrappedText,
        };
      }

      const secondFormattedText = format(classNameWrappedText, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
        rangeEnd: Infinity,
      });

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
