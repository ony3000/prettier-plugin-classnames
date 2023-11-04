enum ClassNameType {
  AT = 'Attribute',
  OLAT = 'OwnLineAttribute',
  FA = 'FunctionArgument',
  SLE = 'StringLiteralExpression',
  SLBP = 'StringLiteralBasedProperty',
  SLTO = 'StringLiteralInTernaryOperator',
  TLE = 'TemplateLiteralExpression',
  TLBP = 'TemplateLiteralBasedProperty',
  TLTO = 'TemplateLiteralInTernaryOperator',
  USL = 'UnknownStringLiteral',
  UTL = 'UnknownTemplateLiteral',
}

type NodeRange = [number, number];

type LineNode = {
  indentLevel: number;
};

type ClassNameNode = {
  type: ClassNameType;
  range: NodeRange;
  startLineIndex: number;
};

type NarrowedParserOptions = {
  tabWidth: number;
  useTabs: boolean;
  customAttributes: string[];
  customFunctions: string[];
};

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

function isNodeRange(arg: unknown): arg is NodeRange {
  return Array.isArray(arg) && arg.length === 2 && arg.every((item) => typeof item === 'number');
}

function findTargetClassNameNodes(
  ast: any,
  customAttributes: string[],
  customFunctions: string[],
): ClassNameNode[] {
  const supportedAttributes: string[] = ['className', ...customAttributes];
  const supportedFunctions: string[] = ['classNames', ...customFunctions];
  const nonCommentRanges: NodeRange[] = [];
  const ignoreCommentRanges: NodeRange[] = [];
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

    switch (node.type) {
      case 'JSXAttribute': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

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
          typeof node.name.name === 'string' &&
          supportedAttributes.includes(node.name.name) &&
          'value' in node &&
          'range' in node &&
          isNodeRange(node.range) &&
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
          'line' in node.loc.start
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);

          const parentNodeStartLineNumber = parentNode.loc.start.line;
          const nodeStartLineNumber = node.loc.start.line;

          classNameNodes.forEach((classNameNode) => {
            const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

            if (rangeStart <= classNameRangeStart && classNameRangeEnd <= rangeEnd) {
              if (classNameNode.type === ClassNameType.USL) {
                // eslint-disable-next-line no-param-reassign
                classNameNode.type =
                  parentNodeStartLineNumber === nodeStartLineNumber
                    ? ClassNameType.AT
                    : ClassNameType.OLAT;
              }
            }
          });
        }
        break;
      }
      case 'CallExpression': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
          'callee' in node &&
          isObject(node.callee) &&
          'type' in node.callee &&
          node.callee.type === 'Identifier' &&
          'name' in node.callee &&
          typeof node.callee.name === 'string' &&
          supportedFunctions.includes(node.callee.name)
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);

          classNameNodes.forEach((classNameNode) => {
            const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

            if (rangeStart <= classNameRangeStart && classNameRangeEnd <= rangeEnd) {
              if (
                classNameNode.type === ClassNameType.USL ||
                classNameNode.type === ClassNameType.UTL
              ) {
                // eslint-disable-next-line no-param-reassign
                classNameNode.type = ClassNameType.FA;
              }
            }
          });
        }
        break;
      }
      case 'JSXExpressionContainer': {
        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (rangeStart <= classNameRangeStart && classNameRangeEnd <= rangeEnd) {
            if (classNameNode.type === ClassNameType.USL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.SLE;
            } else if (classNameNode.type === ClassNameType.UTL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.TLE;
            }
          }
        });
        break;
      }
      case 'ObjectProperty':
      case 'Property': {
        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (rangeStart <= classNameRangeStart && classNameRangeEnd <= rangeEnd) {
            if (classNameNode.type === ClassNameType.USL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.SLBP;
            } else if (classNameNode.type === ClassNameType.UTL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.TLBP;
            }
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (rangeStart <= classNameRangeStart && classNameRangeEnd <= rangeEnd) {
            if (classNameNode.type === ClassNameType.USL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.SLTO;
            } else if (classNameNode.type === ClassNameType.UTL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.TLTO;
            }
          }
        });
        break;
      }
      case 'Literal':
      case 'StringLiteral': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
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
            type: ClassNameType.USL,
            range: [rangeStart, rangeEnd],
            startLineIndex: node.loc.start.line - 1,
          });
        }
        break;
      }
      case 'TemplateLiteral': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
          'loc' in node &&
          isObject(node.loc) &&
          'start' in node.loc &&
          isObject(node.loc.start) &&
          'line' in node.loc.start &&
          typeof node.loc.start.line === 'number'
        ) {
          classNameNodes.push({
            type: ClassNameType.UTL,
            range: [rangeStart, rangeEnd],
            startLineIndex: node.loc.start.line - 1,
          });
        }
        break;
      }
      case 'Block':
      case 'Line': {
        if (
          'value' in node &&
          typeof node.value === 'string' &&
          node.value.trim() === 'prettier-ignore'
        ) {
          ignoreCommentRanges.push([rangeStart, rangeEnd]);
        }
        break;
      }
      case 'File': {
        if ('comments' in node && Array.isArray(node.comments)) {
          node.comments.forEach((comment: unknown) => {
            if (
              isObject(comment) &&
              'start' in comment &&
              typeof comment.start === 'number' &&
              'end' in comment &&
              typeof comment.end === 'number' &&
              'value' in comment &&
              typeof comment.value === 'string' &&
              comment.value.trim() === 'prettier-ignore'
            ) {
              ignoreCommentRanges.push([comment.start, comment.end]);
            }
          });
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentRanges.push([rangeStart, rangeEnd]);
        }
        break;
      }
    }
  }

  recursion(ast);

  const ignoringRanges = ignoreCommentRanges.map<NodeRange>((commentRange) => {
    const [, commentRangeEnd] = commentRange;

    const ignoringRange = nonCommentRanges
      .filter(([nonCommentRangeStart]) => commentRangeEnd < nonCommentRangeStart)
      .sort(
        ([formerRangeStart, formerRangeEnd], [latterRangeStart, latterRangeEnd]) =>
          formerRangeStart - latterRangeStart || latterRangeEnd - formerRangeEnd,
      )
      .at(0);

    return ignoringRange ?? commentRange;
  });

  return classNameNodes
    .filter(({ range }) =>
      ignoringRanges.every(([ignoringRangeStart, ignoringRangeEnd]) => {
        const [classNameRangeStart, classNameRangeEnd] = range;

        return !(
          ignoringRangeStart <= classNameRangeStart && classNameRangeEnd <= ignoringRangeEnd
        );
      }),
    )
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

export function parseLineByLineAndReplace(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => string,
): string {
  if (formattedText === '') {
    return formattedText;
  }

  const EOL = '\n';
  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  const targetClassNameNodes = findTargetClassNameNodes(
    ast,
    options.customAttributes,
    options.customFunctions,
  );
  const formattedLines = formattedText.split(EOL);
  const lineNodes: LineNode[] = formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    return {
      indentLevel,
    };
  });

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

    if (type === ClassNameType.AT) {
      extraIndentLevel = 2;
    } else if (
      [ClassNameType.OLAT, ClassNameType.SLTO, ClassNameType.TLE, ClassNameType.TLTO].includes(type)
    ) {
      extraIndentLevel = 1;
    }

    const quoteStart = `${type === ClassNameType.SLBP ? '[' : ''}${
      type === ClassNameType.AT || type === ClassNameType.OLAT ? '"' : '`'
    }`;
    const quoteEnd = `${type === ClassNameType.AT || type === ClassNameType.OLAT ? '"' : '`'}${
      type === ClassNameType.SLBP ? ']' : ''
    }`;
    const substitute = `${quoteStart}${formattedClassName}${quoteEnd}`
      .split(EOL)
      .join(`${EOL}${indentUnit.repeat(indentLevel + extraIndentLevel)}`);

    mutableFormattedText = `${mutableFormattedText.slice(
      0,
      rangeStart,
    )}${substitute}${mutableFormattedText.slice(rangeEnd)}`;
  });

  return mutableFormattedText;
}
