import { format as formatSync } from '@prettier/sync';
import { parseLineByLineAndReplace } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Options } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';

import { parsers } from './parsers';

const addon = {
  parseBabel: (text: string, options: ParserOptions) => babelParsers.babel.parse(text, options),
};

function createPrinter(parserName: 'babel' | 'typescript' | 'vue'): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    // @ts-ignore
    const comments = options[Symbol.for('comments')];

    if (comments) {
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
    const parser = parsers[parserName];
    const ast = parser.parse(firstFormattedText, options);

    const classNameWrappedText = parseLineByLineAndReplace(
      firstFormattedText,
      ast,
      // @ts-ignore
      cloneableOptions,
      formatSync,
      addon,
    );
    const secondFormattedText = formatSync(classNameWrappedText, {
      ...cloneableOptions,
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
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
  'vue-ast': createPrinter('vue'),
};
