import { format as formatSync } from '@prettier/sync';
import { parseLineByLineAndReplace } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Options } from 'prettier';

import { parsers } from './parsers';

function createPrinter(parserName: 'babel' | 'typescript'): Printer {
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

    const necessaryOptions: Options = {
      parser: parserName,
      // @ts-ignore
      customAttributes: options.customAttributes,
      // @ts-ignore
      customFunctions: options.customFunctions,
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
    };

    const { originalText } = options;
    const formattedText = formatSync(originalText, {
      ...necessaryOptions,
      endOfLine: 'lf',
    });
    const parser = parsers[parserName];
    const ast = parser.parse(formattedText, options);

    const secondFormattedText = formatSync(
      parseLineByLineAndReplace(
        formattedText,
        ast,
        // @ts-ignore
        necessaryOptions,
        formatSync,
      ),
      {
        ...necessaryOptions,
        endOfLine: 'lf',
        rangeEnd: Infinity,
      },
    );

    return secondFormattedText;
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
