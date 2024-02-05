export const baseOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'all' as const,
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve' as const,
  arrowParens: 'always' as const,
  htmlWhitespaceSensitivity: 'css' as const,
  endOfLine: 'lf' as const,
  quoteProps: 'as-needed' as const,
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto' as const,
  singleAttributePerLine: false,
};

export type Fixture = {
  name: string;
  input: string;
  output: string;
  options?: NodeJS.Dict<unknown> & Partial<typeof baseOptions>;
};
