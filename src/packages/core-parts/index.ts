import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import { z } from 'zod';

const EOL = '\n';

enum ClassNameType {
  /**
   * Attributes on the same line as the opening tag and enclosed in quotes
   */
  ASL,
  /**
   * Attributes on their own line and enclosed in quotes
   */
  AOL,
  /**
   * String literal or template literal passed as function argument
   */
  FA,
  /**
   * Common string literal
   */
  CSL,
  /**
   * String literal starting on the same line as the attribute
   */
  SLSL,
  /**
   * String literal as object property
   */
  SLOP,
  /**
   * String literal in ternary operator
   */
  SLTO,
  /**
   * Common template literal
   */
  CTL,
  /**
   * Template literal as object property
   */
  TLOP,
  /**
   * Template literal in ternary operator
   */
  TLTO,
  /**
   * Unknown string literal
   */
  USL,
  /**
   * Unknown template literal
   */
  UTL,
}

type Dict<T = unknown> = Record<string, T | undefined>;

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
  parser: string;
  customAttributes: string[];
  customFunctions: string[];
};

function isTypeof<T extends ZodTypeAny>(arg: unknown, expectedSchema: T): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}

function filterAndSortClassNameNodes(
  nonCommentRanges: NodeRange[],
  ignoreCommentRanges: NodeRange[],
  keywordEnclosingRanges: NodeRange[],
  classNameNodes: ClassNameNode[],
): ClassNameNode[] {
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

function findTargetClassNameNodes(ast: any, options: NarrowedParserOptions): ClassNameNode[] {
  const supportedAttributes: string[] = ['className', ...options.customAttributes];
  const supportedFunctions: string[] = ['classNames', ...options.customFunctions];
  const nonCommentRanges: NodeRange[] = [];
  const ignoreCommentRanges: NodeRange[] = [];
  const keywordEnclosingRanges: NodeRange[] = [];
  const classNameNodes: ClassNameNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
    if (!isTypeof(node, z.object({ type: z.unknown() }))) {
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

    if (
      !isTypeof(
        node,
        z.object({
          range: z.custom<NodeRange>((value) => isTypeof(value, z.tuple([z.number(), z.number()]))),
        }),
      )
    ) {
      return;
    }

    const [rangeStart, rangeEnd] = node.range;

    switch (node.type) {
      case 'JSXAttribute': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
          isTypeof(
            parentNode,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.unknown(),
                }),
              }),
            }),
          ) &&
          parentNode.type === 'JSXOpeningElement' &&
          isTypeof(
            node,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.unknown(),
                }),
              }),
              name: z.object({
                type: z.unknown(),
                name: z.string(),
              }),
            }),
          ) &&
          node.name.type === 'JSXIdentifier' &&
          supportedAttributes.includes(node.name.name)
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
                    ? ClassNameType.ASL
                    : ClassNameType.AOL;
              }
            }
          });
        }
        break;
      }
      case 'CallExpression': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
          isTypeof(
            node,
            z.object({
              callee: z.object({
                type: z.unknown(),
                name: z.string(),
              }),
            }),
          ) &&
          node.callee.type === 'Identifier' &&
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
              classNameNode.type = ClassNameType.CSL;
            } else if (classNameNode.type === ClassNameType.UTL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.CTL;
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
              classNameNode.type = ClassNameType.SLOP;
            } else if (classNameNode.type === ClassNameType.UTL) {
              // eslint-disable-next-line no-param-reassign
              classNameNode.type = ClassNameType.TLOP;
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
          isTypeof(
            node,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
            }),
          )
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
          isTypeof(
            node,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
            }),
          )
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
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          ignoreCommentRanges.push([rangeStart, rangeEnd]);
        }
        break;
      }
      case 'File': {
        if (
          isTypeof(
            node,
            z.object({
              comments: z.array(
                z.object({
                  start: z.number(),
                  end: z.number(),
                  value: z.string(),
                }),
              ),
            }),
          )
        ) {
          node.comments.forEach((comment) => {
            if (comment.value.trim() === 'prettier-ignore') {
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

  return filterAndSortClassNameNodes(
    nonCommentRanges,
    ignoreCommentRanges,
    keywordEnclosingRanges,
    classNameNodes,
  );
}

function findTargetClassNameNodesForVue(
  ast: any,
  options: NarrowedParserOptions,
  addon: Dict<(text: string, options: any) => any>,
): ClassNameNode[] {
  const supportedAttributes: string[] = ['className', 'class', ...options.customAttributes];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supportedFunctions: string[] = ['classNames', ...options.customFunctions];
  const nonCommentRanges: NodeRange[] = [];
  const ignoreCommentRanges: NodeRange[] = [];
  const keywordEnclosingRanges: NodeRange[] = [];
  const classNameNodes: ClassNameNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
    if (!isTypeof(node, z.object({ type: z.unknown() }))) {
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

    if (
      !isTypeof(
        node,
        z.object({
          sourceSpan: z.object({
            start: z.object({
              offset: z.number(),
            }),
            end: z.object({
              offset: z.number(),
            }),
          }),
        }),
      )
    ) {
      return;
    }

    const [rangeStart, rangeEnd] = [node.sourceSpan.start.offset, node.sourceSpan.end.offset];

    switch (node.type) {
      case 'attribute': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        const boundAttributeRegExp = /^(?:v-bind)?:/;

        if (
          isTypeof(
            parentNode,
            z.object({
              sourceSpan: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
            }),
          ) &&
          parentNode.type === 'element' &&
          isTypeof(
            node,
            z.object({
              sourceSpan: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              name: z.string(),
              value: z.string(),
              valueSpan: z.object({
                start: z.object({
                  offset: z.number(),
                }),
                end: z.object({
                  offset: z.number(),
                }),
              }),
            }),
          ) &&
          supportedAttributes.includes(node.name.replace(boundAttributeRegExp, ''))
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);

          const isBoundAttribute = node.name.match(boundAttributeRegExp) !== null;

          if (isBoundAttribute) {
            if (addon.parseBabel) {
              const jsxStart = '<div className={';
              const jsxEnd = '}></div>';

              const babelAst = addon.parseBabel(`${jsxStart}${node.value}${jsxEnd}`, {
                ...options,
                parser: 'babel',
              });
              const targetClassNameNodesInAttribute = findTargetClassNameNodes(
                babelAst,
                options,
              ).map<ClassNameNode>(
                ({
                  type,
                  range: [classNameNodeRangeStart, classNameNodeRangeEnd],
                  startLineIndex,
                }) => {
                  if (type === ClassNameType.CSL && startLineIndex === 0) {
                    // eslint-disable-next-line no-param-reassign
                    type = ClassNameType.SLSL;
                  }

                  const attributeOffset = -jsxStart.length + node.valueSpan.start.offset + 1;

                  return {
                    type,
                    range: [
                      classNameNodeRangeStart + attributeOffset,
                      classNameNodeRangeEnd + attributeOffset,
                    ],
                    startLineIndex: startLineIndex + node.sourceSpan.start.line,
                  };
                },
              );

              classNameNodes.push(...targetClassNameNodesInAttribute);
            }
          } else {
            const classNameRangeStart = node.valueSpan.start.offset;
            const classNameRangeEnd = node.valueSpan.end.offset;

            nonCommentRanges.push([classNameRangeStart, classNameRangeEnd]);

            const parentNodeStartLineIndex = parentNode.sourceSpan.start.line;
            const nodeStartLineIndex = node.sourceSpan.start.line;

            classNameNodes.push({
              type:
                parentNodeStartLineIndex === nodeStartLineIndex
                  ? ClassNameType.ASL
                  : ClassNameType.AOL,
              range: [classNameRangeStart, classNameRangeEnd],
              startLineIndex: nodeStartLineIndex,
            });
          }
        }
        break;
      }
      case 'element': {
        nonCommentRanges.push([rangeStart, rangeEnd]);

        if (
          isTypeof(
            node,
            z.object({
              sourceSpan: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              startSourceSpan: z.object({
                end: z.object({
                  offset: z.number(),
                }),
              }),
              name: z.string(),
              children: z.array(
                z.object({
                  value: z.string(),
                }),
              ),
            }),
          ) &&
          node.name === 'script'
        ) {
          keywordEnclosingRanges.push([rangeStart, rangeEnd]);

          if (addon.parseTypescript) {
            const typescriptAst = addon.parseTypescript(node.children.at(0)?.value ?? '', {
              ...options,
              parser: 'typescript',
            });
            const targetClassNameNodesInScript = findTargetClassNameNodes(
              typescriptAst,
              options,
            ).map<ClassNameNode>(
              ({
                type,
                range: [classNameNodeRangeStart, classNameNodeRangeEnd],
                startLineIndex,
              }) => {
                const scriptOffset = node.startSourceSpan.end.offset;

                return {
                  type,
                  range: [
                    classNameNodeRangeStart + scriptOffset,
                    classNameNodeRangeEnd + scriptOffset,
                  ],
                  startLineIndex: startLineIndex + node.sourceSpan.start.line,
                };
              },
            );

            classNameNodes.push(...targetClassNameNodesInScript);
          }
        }
        break;
      }
      case 'comment': {
        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          ) &&
          node.value.trim() === 'prettier-ignore'
        ) {
          ignoreCommentRanges.push([rangeStart, rangeEnd]);
        }
        break;
      }
      default: {
        nonCommentRanges.push([rangeStart, rangeEnd]);
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortClassNameNodes(
    nonCommentRanges,
    ignoreCommentRanges,
    keywordEnclosingRanges,
    classNameNodes,
  );
}

function parseLineByLine(formattedText: string, indentUnit: string): LineNode[] {
  const formattedLines = formattedText.split(EOL);

  return formattedLines.map((line) => {
    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    return {
      indentLevel,
    };
  });
}

function replaceClassName(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
  lineNodes: LineNode[],
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => string,
): string {
  let mutableFormattedText = formattedText;

  targetClassNameNodes.forEach(({ type, range: [rangeStart, rangeEnd], startLineIndex }) => {
    const { indentLevel } = lineNodes[startLineIndex];
    const enclosedClassName = mutableFormattedText.slice(rangeStart + 1, rangeEnd - 1);
    const formattedClassName = format(enclosedClassName, {
      ...options,
      parser: 'html',
      plugins: [],
      rangeStart: 0,
      rangeEnd: Infinity,
      endOfLine: 'lf',
    }).trimEnd();

    if (formattedClassName === enclosedClassName) {
      return;
    }

    let extraIndentLevel = 0;

    if (type === ClassNameType.ASL) {
      extraIndentLevel = 2;
    } else if (
      [
        ClassNameType.AOL,
        ClassNameType.SLSL,
        ClassNameType.SLTO,
        ClassNameType.CTL,
        ClassNameType.TLTO,
      ].includes(type)
    ) {
      extraIndentLevel = 1;
    }

    const quoteStart = `${type === ClassNameType.SLOP ? '[' : ''}${
      type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'
    }`;
    const quoteEnd = `${type === ClassNameType.ASL || type === ClassNameType.AOL ? '"' : '`'}${
      type === ClassNameType.SLOP ? ']' : ''
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

export function parseLineByLineAndReplace(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  format: (source: string, options?: any) => string,
  addon: Dict<(text: string, options: any) => any>,
): string {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? '\t' : ' '.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  if (options.parser === 'vue') {
    targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
  } else {
    targetClassNameNodes = findTargetClassNameNodes(ast, options);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  return replaceClassName(
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
  );
}
