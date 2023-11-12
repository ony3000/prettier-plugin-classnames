import { parseLineByLineAndReplace } from 'core-parts';
import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';

const addon = {
  parseBabel: (text: string, options: ParserOptions) =>
    babelParsers.babel.parse(text, { babel: babelParsers.babel }, options),
};

function createPrinter(parserName: 'babel' | 'typescript' | 'vue'): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
    const pluginCandidate = plugins.find((plugin) => plugin.parsers?.[parserName]);

    if (!pluginCandidate) {
      throw new Error('A plugin with the given parser does not exist.');
    }

    const node = path.getValue();

    if (node?.comments) {
      node.comments.forEach((comment: any) => {
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
    const parser = pluginCandidate.parsers![parserName];
    const ast = parser.parse(firstFormattedText, pluginCandidate.parsers!, options);

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
      plugins: [pluginCandidate],
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
