import { parseLineByLineAndReplace } from 'core-parts';
import type { Parser, ParserOptions } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as htmlParsers } from 'prettier/parser-html';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) =>
    babelParsers.babel.parse(text, { babel: babelParsers.babel }, options),
};

function transformParser(parser: Parser): Parser {
  return {
    ...parser,
    preprocess: (originalText: string, options: ParserOptions) => {
      const firstFormattedText = format(originalText, {
        ...options,
        plugins: [],
        endOfLine: 'lf',
      });
      const ast = parser.parse(firstFormattedText, { [options.parser as string]: parser }, options);
      const classNameWrappedText = parseLineByLineAndReplace(
        firstFormattedText,
        ast,
        // @ts-ignore
        options,
        format,
        addon,
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
