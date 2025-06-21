import type { AST, Parser, Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as htmlParsers } from 'prettier/plugins/html';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

import { parseLineByLineAndReplaceAsync, refineSvelteAst } from './core-parts';

const EOL = '\n';

const SPACE = ' ';

function addIndent(text: string, width = 2) {
  return text
    .split(EOL)
    .map((line) => `${SPACE.repeat(width)}${line}`)
    .join(EOL);
}

async function advancedParse(
  text: string,
  parserName: SupportedParserNames,
  defaultParser: Parser,
  options: ResolvedOptions,
): Promise<AST> {
  const preprocessedText = defaultParser.preprocess
    ? defaultParser.preprocess(text, options)
    : text;
  let ast = await defaultParser.parse(preprocessedText, options);

  if (parserName === 'svelte') {
    ast = refineSvelteAst(preprocessedText, ast);
  }

  return ast;
}

function transformParser(
  parserName: SupportedParserNames,
  defaultParser: Parser,
  languageName?: string,
): Parser {
  return {
    ...defaultParser,
    // @ts-ignore
    parse: async (text: string, options: ResolvedOptions): Promise<FormattedTextAST> => {
      if (options.parentParser === 'markdown' || options.parentParser === 'mdx') {
        let codeblockStart = '```';
        const codeblockEnd = '```';

        if (options.parser === 'babel') {
          codeblockStart = '```jsx';
        } else if (options.parser === 'typescript') {
          codeblockStart = '```tsx';
        }

        const formattedCodeblock = await format(
          `${codeblockStart}${EOL}${text}${EOL}${codeblockEnd}`,
          {
            ...options,
            plugins: [],
            rangeEnd: Infinity,
            endOfLine: 'lf',
            parser: options.parentParser,
            parentParser: undefined,
          },
        );
        const formattedText = formattedCodeblock
          .trim()
          .slice(`${codeblockStart}${EOL}`.length, -`${EOL}${codeblockEnd}`.length);

        return {
          type: 'FormattedText',
          body: formattedText,
        };
      }

      const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];

      let languageImplementedPlugin: Plugin | undefined;
      let languageImplementedParser: Parser | undefined;
      if (languageName) {
        languageImplementedPlugin = plugins
          .filter((plugin) => plugin.languages?.some((language) => language.name === languageName))
          .at(0);
        languageImplementedParser = languageImplementedPlugin?.parsers?.[parserName];

        if (!languageImplementedPlugin || !languageImplementedParser) {
          throw new Error(
            `There doesn't seem to be any plugin that supports ${languageName} formatting.`,
          );
        }

        defaultParser = languageImplementedParser;
      }

      const customLanguageSupportedPlugins = languageImplementedPlugin
        ? [languageImplementedPlugin]
        : [];

      const firstFormattedText = await format(text, {
        ...options,
        plugins: customLanguageSupportedPlugins,
        endOfLine: 'lf',
      });

      const ast = await advancedParse(firstFormattedText, parserName, defaultParser, options);
      const classNameWrappedText = await parseLineByLineAndReplaceAsync({
        formattedText: firstFormattedText,
        ast,
        options: {
          ...options,
          useTabs: options.useTabs ?? false,
        },
      });

      if (classNameWrappedText === firstFormattedText) {
        return {
          type: 'FormattedText',
          body: classNameWrappedText,
        };
      }

      let secondFormattedText: string;
      try {
        secondFormattedText = await format(classNameWrappedText, {
          ...options,
          plugins: customLanguageSupportedPlugins,
          endOfLine: 'lf',
          rangeEnd: Infinity,
        });
      } catch (error) {
        throw new Error(
          `The second format failed. This is likely a bug in this plugin. Please file an issue.${
            error instanceof Error ? `${EOL}${addIndent(`Error: ${error.message}`, 4)}` : ''
          }`,
        );
      }

      if (secondFormattedText === firstFormattedText) {
        return {
          type: 'FormattedText',
          body: classNameWrappedText,
        };
      }

      const secondAst = await advancedParse(
        secondFormattedText,
        parserName,
        defaultParser,
        options,
      );
      const classNameSecondWrappedText = await parseLineByLineAndReplaceAsync({
        formattedText: secondFormattedText,
        ast: secondAst,
        options: {
          ...options,
          useTabs: options.useTabs ?? false,
        },
      });

      return {
        type: 'FormattedText',
        body: classNameSecondWrappedText,
      };
    },
    astFormat: 'classnames-ast',
  };
}

export const parsers: { [parserName: string]: Parser } = {
  babel: transformParser('babel', babelParsers.babel),
  typescript: transformParser('typescript', typescriptParsers.typescript),
  angular: transformParser('angular', htmlParsers.angular),
  html: transformParser('html', htmlParsers.html),
  vue: transformParser('vue', htmlParsers.vue),
  astro: transformParser('astro', {} as Parser, 'astro'),
  svelte: transformParser('svelte', {} as Parser, 'svelte'),
};
