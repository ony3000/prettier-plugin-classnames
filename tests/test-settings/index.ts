export const baseOptions = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'all' as 'none' | 'es5' | 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxBracketSameLine: false,
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve' as 'always' | 'never' | 'preserve',
  arrowParens: 'always' as 'avoid' | 'always',
  htmlWhitespaceSensitivity: 'css' as 'css' | 'strict' | 'ignore',
  endOfLine: 'lf' as 'auto' | 'lf' | 'crlf' | 'cr',
  quoteProps: 'as-needed' as 'as-needed' | 'consistent' | 'preserve',
  vueIndentScriptAndStyle: false,
  embeddedLanguageFormatting: 'auto' as 'auto' | 'off',
  singleAttributePerLine: false,
};

export type Fixture = {
  name: string;
  input: string;
  output: string;
  options?: NodeJS.Dict<unknown> & Partial<typeof baseOptions>;
};
