import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { format } from 'prettier';

type NodeRange = [number, number];

type LineNode = {
  indentLevel: number;
};

type ClassNameNode = {
  type: string;
  range: NodeRange;
  startLineIndex: number;
};

const IS_DEBUGGING_MODE = false;

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

function isNodeRange(arg: unknown): arg is NodeRange {
  return Array.isArray(arg) && arg.length === 2 && arg.every((item) => typeof item === 'number');
}

function findTargetClassNameNodes(ast: any): ClassNameNode[] {
  const keywords: string[] = ['classNames'];
  const keywordEnclosingRanges: NodeRange[] = [];
  const classNameNodes: ClassNameNode[] = [];

  function recursion(node: unknown, parentNode?: object & Record<'type', unknown>): void {
    if (!isObject(node) || !('type' in node)) {
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

    if (!('range' in node) || !isNodeRange(node.range)) {
      return;
    }

    const [rangeStart, rangeEnd] = node.range;

    if (IS_DEBUGGING_MODE) {
      if (node.type !== 'Punctuator') {
        console.dir(node);
      }
    }

    switch (node.type) {
      case 'JSXAttribute': {
        if (
          parentNode?.type === 'JSXOpeningElement' &&
          'loc' in parentNode &&
          isObject(parentNode.loc) &&
          'start' in parentNode.loc &&
          isObject(parentNode.loc.start) &&
          'line' in parentNode.loc.start &&
          'name' in node &&
          isObject(node.name) &&
          'type' in node.name &&
          node.name.type === 'JSXIdentifier' &&
          'name' in node.name &&
          node.name.name === 'className' &&
          'value' in node &&
          isObject(node.value) &&
          'type' in node.value &&
          (node.value.type === 'Literal' || node.value.type === 'StringLiteral') &&
          'value' in node.value &&
          typeof node.value.value === 'string' &&
          'range' in node.value &&
          isNodeRange(node.value.range) &&
          'loc' in node.value &&
          isObject(node.value.loc) &&
          'start' in node.value.loc &&
          isObject(node.value.loc.start) &&
          'line' in node.value.loc.start &&
          typeof node.value.loc.start.line === 'number' &&
          'range' in node &&
          isNodeRange(node.range) &&
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
          'line' in node.loc.start
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);
          classNameNodes.push({
            type:
              parentNode.loc.start.line === node.loc.start.line ? 'Attribute' : 'OwnLineAttribute',
            range: [...node.value.range],
            startLineIndex: node.value.loc.start.line - 1,
          });
        }
        break;
      }
      case 'CallExpression': {
        if (
          'callee' in node &&
          isObject(node.callee) &&
          'type' in node.callee &&
          node.callee.type === 'Identifier' &&
          'name' in node.callee &&
          typeof node.callee.name === 'string' &&
          keywords.includes(node.callee.name)
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);

          if ('arguments' in node && Array.isArray(node.arguments)) {
            node.arguments.forEach((arg: unknown) => {
              if (
                isObject(arg) &&
                'type' in arg &&
                (arg.type === 'Literal' || arg.type === 'StringLiteral') &&
                'value' in arg &&
                typeof arg.value === 'string' &&
                'range' in arg &&
                isNodeRange(arg.range) &&
                'loc' in arg &&
                isObject(arg.loc) &&
                'start' in arg.loc &&
                isObject(arg.loc.start) &&
                'line' in arg.loc.start &&
                typeof arg.loc.start.line === 'number'
              ) {
                classNameNodes.push({
                  type: 'FunctionArgument',
                  range: [...arg.range],
                  startLineIndex: arg.loc.start.line - 1,
                });
              }
            });
          }
        }
        break;
      }
      /*
      case 'Literal': {
        if (
          parentNode?.type !== 'Property' &&
          'value' in node &&
          typeof node.value === 'string' &&
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
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
      case 'StringLiteral': {
        if (
          parentNode?.type !== 'ObjectProperty' &&
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
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
      case 'TemplateLiteral': {
        if (
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
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
       */
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
          classNameRangeEnd <= keywordEnclosingRangeEnd
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

  targetClassNameNodes.forEach(({ type, range: [rangeStart, rangeEnd], startLineIndex }) => {
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

    let extraIndentLevel = 0;

    if (type === 'Attribute') {
      extraIndentLevel = 2;
    } else if (type === 'OwnLineAttribute') {
      extraIndentLevel = 1;
    }

    const quote = type === 'Attribute' || type === 'OwnLineAttribute' ? '"' : '`';
    const substitute = `${quote}${formattedClassName}${quote}`
      .split(EOL)
      .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);

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

    const secondFormattedText = format(parseLineByLineAndReplace(formattedText, ast, options), {
      ...options,
      plugins: [pluginCandidate],
      endOfLine: 'lf',
    });

    return secondFormattedText;
  }

  return {
    print: main,
  };
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': createPrinter('babel'),
  'typescript-ast': createPrinter('typescript'),
};
