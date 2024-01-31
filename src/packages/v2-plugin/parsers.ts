import { parseLineByLineAndReplace } from 'core-parts';
import { ClassNameType } from 'core-parts/shared';
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
      const classNameWrappedText = parseLineByLineAndReplace({
        formattedText: firstFormattedText,
        ast,
        // @ts-ignore
        options,
        format,
        addon,
      });

      let secondFormattedText: string;
      try {
        secondFormattedText = format(classNameWrappedText, {
          ...options,
          plugins: [],
          endOfLine: 'lf',
          rangeEnd: Infinity,
        });
      } catch (error) {
        throw new Error(
          'The second format failed. This is likely a bug in this plugin. Please file an issue.',
        );
      }

      if (parserName === 'vue') {
        const secondAst = defaultParser.parse(
          secondFormattedText,
          { [parserName]: defaultParser },
          options,
        );
        const classNameSecondWrappedText = parseLineByLineAndReplace({
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
