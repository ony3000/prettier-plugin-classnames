import { parseLineByLineAndReplace } from 'core-parts';
import { ClassNameType } from 'core-parts/shared';
import type { Parser, ParserOptions, Plugin } from 'prettier';
import { format } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as htmlParsers } from 'prettier/parser-html';
import { parsers as markdownParsers } from 'prettier/parser-markdown';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

const addon = {
  parseBabel: (text: string, options: ParserOptions) =>
    babelParsers.babel.parse(text, { babel: babelParsers.babel }, options),
  parseTypescript: (text: string, options: ParserOptions) =>
    typescriptParsers.typescript.parse(text, { typescript: typescriptParsers.typescript }, options),
};

function transformParser(
  parserName: 'babel' | 'typescript' | 'vue' | 'astro',
  defaultParser: Parser,
  languageName?: string,
): Parser {
  return {
    ...defaultParser,
    parse: (text: string, parsers: { [parserName: string]: Parser }, options: ParserOptions) => {
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

        // eslint-disable-next-line no-param-reassign
        defaultParser = languageImplementedParser;
      }

      const customLanguageSupportedPlugins = languageImplementedPlugin
        ? [languageImplementedPlugin]
        : [];

      const firstFormattedText = format(text, {
        ...options,
        plugins: customLanguageSupportedPlugins,
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
          plugins: customLanguageSupportedPlugins,
          endOfLine: 'lf',
          rangeEnd: Infinity,
        });
      } catch (error) {
        throw new Error(
          'The second format failed. This is likely a bug in this plugin. Please file an issue.',
        );
      }

      if (parserName === 'vue' || parserName === 'astro') {
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
  astro: transformParser('astro', {} as Parser, 'astro'),
};
