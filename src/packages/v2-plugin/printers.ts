import type { AstPath, ParserOptions, Doc, Printer } from 'prettier';

function createPrinter(): Printer {
  function main(
    path: AstPath,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const node = path.getValue();

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
