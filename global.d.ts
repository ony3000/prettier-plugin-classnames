declare global {
  type PrettierBaseOptions = {
    printWidth: number;
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
    jsxSingleQuote: boolean;
    trailingComma: 'none' | 'es5' | 'all';
    bracketSpacing: boolean;
    bracketSameLine: boolean;
    jsxBracketSameLine: boolean;
    rangeStart: number;
    rangeEnd: number;
    requirePragma: boolean;
    insertPragma: boolean;
    proseWrap: 'always' | 'never' | 'preserve';
    arrowParens: 'avoid' | 'always';
    htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
    endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
    quoteProps: 'as-needed' | 'consistent' | 'preserve';
    vueIndentScriptAndStyle: boolean;
    embeddedLanguageFormatting: 'auto' | 'off';
    singleAttributePerLine: boolean;
  };

  type ThisPluginOptions = {
    customAttributes: string[];
    customFunctions: string[];
    endingPosition: 'relative' | 'absolute';
    syntaxTransformation: boolean;
  };

  type ResolvedOptions = PrettierBaseOptions & { parser: unknown } & ThisPluginOptions;

  type SupportedParserNames =
    | 'babel'
    | 'typescript'
    | 'angular'
    | 'html'
    | 'vue'
    | 'astro'
    | 'svelte';

  type FormattedTextAST = {
    type: 'FormattedText';
    body: string;
  };
}

export {};
