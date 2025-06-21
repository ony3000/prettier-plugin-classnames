import type { AstPath, ParserOptions, Doc, Printer } from 'prettier';

function createPrinter(): Printer {
  function main(path: AstPath, options: ParserOptions, print: (path: AstPath) => Doc): Doc {
    const { node } = path;

    if (node.type === 'FormattedText') {
      return node.body;
    }

    throw new Error(`Unknown node type: ${node?.type}`);
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'classnames-ast': createPrinter(),
};
