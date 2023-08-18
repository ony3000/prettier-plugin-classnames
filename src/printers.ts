import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';

type NodeRange = [number, number];

type LineNode = {
  indentLevel: number;
};

type ClassNameNode = {
  range: NodeRange;
  startLineIndex: number;
};

const IS_DEBUGGING_MODE = false;

function findTargetClassNameNodes(ast: any): ClassNameNode[] {
  const keywords: string[] = ['classNames'];
  const keywordEnclosingRanges: NodeRange[] = [];
  const classNameNodes: ClassNameNode[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function recursion(node: unknown, parentNode?: unknown): void {
    if (typeof node !== 'object' || node === null || !('type' in node)) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode, node);
        });
        return;
      }

      recursion(value, node);
    });

    if (!('range' in node) || !Array.isArray(node.range)) {
      return;
    }

    const [rangeStart, rangeEnd] = node.range as NodeRange;

    if (IS_DEBUGGING_MODE) {
      if (node.type !== 'Punctuator') {
        console.dir(node);
      }
    }

    switch (node.type) {
      case 'CallExpression': {
        if (
          'callee' in node &&
          typeof node.callee === 'object' &&
          node.callee !== null &&
          'type' in node.callee &&
          node.callee.type === 'Identifier' &&
          'name' in node.callee &&
          typeof node.callee.name === 'string' &&
          keywords.includes(node.callee.name)
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);
        }
        break;
      }
      case 'Literal': {
        if (
          'loc' in node &&
          typeof node.loc === 'object' &&
          node.loc !== null &&
          'start' in node.loc &&
          typeof node.loc.start === 'object' &&
          node.loc.start !== null &&
          'line' in node.loc.start &&
          typeof node.loc.start.line === 'number'
        ) {
          classNameNodes.push({
            range: [rangeStart, rangeEnd],
            startLineIndex: node.loc.start.line - 1,
          });
        }
        break;
      }
      default: {
        // nothing to do
        break;
      }
    }
  }

  recursion(ast);

  if (IS_DEBUGGING_MODE) {
    console.log(keywordEnclosingRanges);
    console.log(classNameNodes);
  }

  return classNameNodes
    .filter(({ range }) =>
      keywordEnclosingRanges.some(([keywordEnclosingRangeStart, keywordEnclosingRangeEnd]) => {
        const [classNameRangeStart, classNameRangeEnd] = range;

        return (
          keywordEnclosingRangeStart < classNameRangeStart &&
          classNameRangeEnd < keywordEnclosingRangeEnd
        );
      }),
    )
    .sort((former, latter) => latter.startLineIndex - former.startLineIndex);
}

function parseLineByLineAndReplace(
  formattedText: string,
  ast: any,
  options: ParserOptions,
): string {
  if (formattedText === '') {
    return formattedText;
  }

  const EOL = '\n';
  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  const targetClassNameNodes = findTargetClassNameNodes(ast);
  if (IS_DEBUGGING_MODE) {
    console.dir(JSON.stringify(formattedText));
    console.dir(targetClassNameNodes);
  }
  const formattedLines = formattedText.split(EOL);
  const lineNodes: LineNode[] = formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    return {
      indentLevel,
    };
  });

  if (IS_DEBUGGING_MODE) {
    console.dir(lineNodes, { depth: null });
  }

  let mutableFormattedText = formattedText;

  targetClassNameNodes.forEach(({ range: [rangeStart, rangeEnd], startLineIndex }) => {
    const { indentLevel } = lineNodes[startLineIndex];
    const enclosedClassName = mutableFormattedText.slice(rangeStart + 1, rangeEnd - 1);
    const formattedClassName = format(enclosedClassName, {
      ...options,
      parser: 'html',
      rangeStart: 0,
      rangeEnd: Infinity,
      endOfLine: 'lf',
    }).trimEnd();

    if (formattedClassName === enclosedClassName) {
      return;
    }

    const substitute = `\`${formattedClassName}\``
      .split(EOL)
      .join(`${EOL}${indentUnit.repeat(indentLevel)}`);

    mutableFormattedText = `${mutableFormattedText.slice(
      0,
      rangeStart,
    )}${substitute}${mutableFormattedText.slice(rangeEnd)}`;
  });

  return mutableFormattedText;
}

function createPrinter(parserName: 'babel' | 'typescript'): Printer {
  function main(
    path: AstPath,
    options: ParserOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print: (path: AstPath) => Doc,
  ): Doc {
    const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
    const pluginCandidate = plugins.find((plugin) => plugin.parsers?.[parserName]);

    if (!pluginCandidate) {
      throw new Error('A plugin with the given parser does not exist.');
    }

    const node = path.getValue();

    if (node?.comments) {
      node.comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const { originalText } = options;
    const formattedText = format(originalText, {
      ...options,
      plugins: [pluginCandidate],
      endOfLine: 'lf',
    });
    const parser = pluginCandidate.parsers![parserName];
    const ast = parser.parse(formattedText, pluginCandidate.parsers!, options);

    return parseLineByLineAndReplace(formattedText, ast, options);
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
