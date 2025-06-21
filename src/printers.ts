import type { AstPath, Doc, Printer } from 'prettier';

function createPrinter(): Printer {
  function main(path: AstPath): Doc {
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
