import { format as formatSync } from '@prettier/sync';
import { parseLineByLineAndReplace } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Options, Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) => babelParsers.babel.parse(text, options),
  parseTypescript: (text: string, options: ParserOptions) =>
    typescriptParsers.typescript.parse(text, options),
};

function createPrinter(parserName: 'babel' | 'typescript' | 'vue', defaultParser: Parser): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    // @ts-ignore
    const comments = options[Symbol.for('comments')];

    if (comments && Array.isArray(comments)) {
      comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

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

    const { originalText } = options;
    const firstFormattedText = formatSync(originalText, {
      ...cloneableOptions,
      plugins: [],
      endOfLine: 'lf',
    });

    const ast = defaultParser.parse(firstFormattedText, options);
    const classNameWrappedText = parseLineByLineAndReplace(
      firstFormattedText,
      ast,
      // @ts-ignore
      cloneableOptions,
      formatSync,
      addon,
    );

    if (parserName === 'vue') {
      return classNameWrappedText;
    }

    const secondFormattedText = formatSync(classNameWrappedText, {
      ...cloneableOptions,
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
