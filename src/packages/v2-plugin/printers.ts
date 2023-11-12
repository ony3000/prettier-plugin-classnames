import { parseLineByLineAndReplace } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Parser } from 'prettier';
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

function createPrinter(parserName: 'babel' | 'typescript' | 'vue', defaultParser: Parser): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const comments = path.getValue()?.comments;

    if (comments && Array.isArray(comments)) {
      comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const { originalText } = options;
    const firstFormattedText = format(originalText, {
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
      return classNameWrappedText;
    }

    const secondFormattedText = format(classNameWrappedText, {
      ...options,
      plugins: [],
      endOfLine: 'lf',
      rangeEnd: Infinity,
    });

    return secondFormattedText;
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel', babelParsers.babel),
  'typescript-ast': createPrinter('typescript', typescriptParsers.typescript),
  'vue-ast': createPrinter('vue', htmlParsers.vue),
};
