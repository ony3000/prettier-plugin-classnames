import type { Parser } from 'prettier3';
import { parsers as babelParsers } from 'prettier3/plugins/babel';
import { parsers as typescriptParsers } from 'prettier3/plugins/typescript';

export const parsers: { [parserName: string]: Parser } = {
  babel: {
    ...babelParsers.babel,
    astFormat: 'babel-ast',
  },
  typescript: {
    ...typescriptParsers.typescript,
    astFormat: 'typescript-ast',
  },
};
