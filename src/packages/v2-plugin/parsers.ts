import { parseLineByLineAndReplace } from 'core-parts';
import type { Parser, ParserOptions, Plugin } from 'prettier';
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
  parserName: SupportedParserNames,
  defaultParser: Parser,
  languageName?: string,
): Parser {
  return {
    ...defaultParser,
    // @ts-ignore
    parse: (
      text: string,
      parsers: { [parserName: string]: Parser },
      options: ParserOptions & ThisPluginOptions,
    ): FormattedTextAST => {
      if (options.debugFlag) {
        console.time('v2 plugin');
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
      if (options.debugFlag) {
        console.timeLog('v2 plugin');
      }

      const ast = defaultParser.parse(firstFormattedText, { [parserName]: defaultParser }, options);
      if (options.debugFlag) {
        console.timeLog('v2 plugin');
      }
      const classNameWrappedText = parseLineByLineAndReplace({
        formattedText: firstFormattedText,
        ast,
        options,
        format,
        addon,
      });

      if (classNameWrappedText === firstFormattedText) {
        if (options.debugFlag) {
          console.log('breakpoint #1');
          console.timeEnd('v2 plugin');
        }
        return {
          type: 'FormattedText',
          body: classNameWrappedText,
        };
      }

      if (options.debugFlag) {
        console.log("============ From now on, it's second formatting. ============");
      }

      let secondFormattedText: string;
      try {
        secondFormattedText = format(classNameWrappedText, {
          ...options,
          plugins: customLanguageSupportedPlugins,
          endOfLine: 'lf',
          rangeEnd: Infinity,
        });
        if (options.debugFlag) {
          console.timeLog('v2 plugin');
        }
      } catch (error) {
        throw new Error(
          'The second format failed. This is likely a bug in this plugin. Please file an issue.',
        );
      }

      if (secondFormattedText === firstFormattedText) {
        if (options.debugFlag) {
          console.log('breakpoint #2');
          console.timeEnd('v2 plugin');
        }
        return {
          type: 'FormattedText',
          body: classNameWrappedText,
        };
      }

      const secondAst = defaultParser.parse(
        secondFormattedText,
        { [parserName]: defaultParser },
        options,
      );
      if (options.debugFlag) {
        console.timeLog('v2 plugin');
      }
      const classNameSecondWrappedText = parseLineByLineAndReplace({
        formattedText: secondFormattedText,
        ast: secondAst,
        options,
        format,
        addon,
      });

      if (options.debugFlag) {
        console.log('breakpoint #3');
        console.timeEnd('v2 plugin');
      }
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
