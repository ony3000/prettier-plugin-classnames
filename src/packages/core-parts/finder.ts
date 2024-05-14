import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import { z } from 'zod';

import type {
  Dict,
  NodeRange,
  ExpressionNode,
  ClassNameNode,
  NarrowedParserOptions,
} from './shared';
import { EOL, SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK } from './shared';

type ASTNode = {
  type: string;
  range: NodeRange;
};

type JSXOpeningElementNameAsString = {
  type: 'JSXIdentifier';
  name: string;
};

type JSXOpeningElementNameAsObject = {
  type: 'JSXMemberExpression';
  object: JSXOpeningElementNameAsString | JSXOpeningElementNameAsObject;
  property: JSXOpeningElementNameAsString;
};

function isTypeof<T extends ZodTypeAny>(arg: unknown, expectedSchema: T): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}

function getElementName(
  param: JSXOpeningElementNameAsString | JSXOpeningElementNameAsObject,
): string {
  if (param.type === 'JSXIdentifier') {
    return param.name;
  }

  return `${getElementName(param.object)}.${param.property.name}`;
}

function createExpressionNode(
  arg: Pick<ExpressionNode, 'delimiterType' | 'range' | 'startLineIndex'> &
    Partial<Omit<ExpressionNode, 'type' | 'delimiterType' | 'range' | 'startLineIndex'>>,
): ExpressionNode {
  return {
    type: 'expression',
    isTheFirstLineOnTheSameLineAsTheAttributeName: false,
    isItAnObjectProperty: false,
    isItAnOperandOfTernaryOperator: false,
    isItFunctionArgument: false,
    hasSingleQuote: false,
    hasDoubleQuote: false,
    hasBacktick: false,
    shouldKeepDelimiter: false,
    ...arg,
  };
}

function filterAndSortClassNameNodes(
  nonCommentNodes: ASTNode[],
  prettierIgnoreNodes: ASTNode[],
  keywordStartingNodes: ASTNode[],
  classNameNodes: ClassNameNode[],
): ClassNameNode[] {
  const ignoreRanges = prettierIgnoreNodes.map(({ range }) => {
    const [, prettierIgnoreNodeRangeEnd] = range;

    const ignoringNodeOrNot = nonCommentNodes
      .filter(
        ({ range: [nonCommentNodeRangeStart] }) =>
          prettierIgnoreNodeRangeEnd < nonCommentNodeRangeStart,
      )
      .sort(
        (
          { range: [formerNodeRangeStart, formerNodeRangeEnd] },
          { range: [latterNodeRangeStart, latterNodeRangeEnd] },
        ) => formerNodeRangeStart - latterNodeRangeStart || latterNodeRangeEnd - formerNodeRangeEnd,
      )
      .at(0);

    return ignoringNodeOrNot?.range ?? range;
  });
  const keywordStartingRanges = keywordStartingNodes.map(({ range }) => range);

  return classNameNodes
    .filter(
      ({ range: [classNameNodeRangeStart, classNameNodeRangeEnd] }) =>
        ignoreRanges.every(
          ([ignoreRangeStart, ignoreRangeEnd]) =>
            !(
              ignoreRangeStart <= classNameNodeRangeStart && classNameNodeRangeEnd <= ignoreRangeEnd
            ),
        ) &&
        keywordStartingRanges.some(
          ([keywordStartingRangeStart, keywordStartingRangeEnd]) =>
            keywordStartingRangeStart < classNameNodeRangeStart &&
            classNameNodeRangeEnd <= keywordStartingRangeEnd,
        ),
    )
    .sort(
      (
        { startLineIndex: formerStartLineIndex, range: [formerNodeRangeStart] },
        { startLineIndex: latterStartLineIndex, range: [latterNodeRangeStart] },
      ) =>
        latterStartLineIndex - formerStartLineIndex || latterNodeRangeStart - formerNodeRangeStart,
    );
}

export function findTargetClassNameNodes(
  ast: any,
  options: NarrowedParserOptions,
): ClassNameNode[] {
  const supportedAttributes: string[] = ['className', ...options.customAttributes];
  const supportedFunctions: string[] = ['classNames', ...options.customFunctions];
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Nodes starting with supported attribute names or supported function names
   */
  const keywordStartingNodes: ASTNode[] = [];
  /**
   * Class names enclosed in delimiters
   */
  const classNameNodes: ClassNameNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
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

    const [currentNodeRangeStart, currentNodeRangeEnd] = node.range;
    const currentASTNode: ASTNode = {
      type: node.type,
      range: node.range,
    };

    switch (node.type) {
      case 'CallExpression': {
        nonCommentNodes.push(currentASTNode);

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
          keywordStartingNodes.push(currentASTNode);

          classNameNodes.forEach((classNameNode, index, array) => {
            const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameNodeRangeStart &&
              classNameNodeRangeEnd <= currentNodeRangeEnd
            ) {
              if (classNameNode.type === 'unknown') {
                // eslint-disable-next-line no-param-reassign
                array[index] = createExpressionNode({
                  delimiterType: classNameNode.delimiterType,
                  isItFunctionArgument: true,
                  range: classNameNode.range,
                  startLineIndex: classNameNode.startLineIndex,
                });
              }
            }
          });
        }
        break;
      }
      case 'JSXAttribute': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            parentNode,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.unknown(),
                }),
              }),
              name: z.union([
                z.object({
                  type: z.literal('JSXIdentifier'),
                  name: z.string(),
                }),
                z.object({
                  type: z.literal('JSXMemberExpression'),
                  // recursive structure
                  object: z.union([
                    z.object({
                      type: z.literal('JSXIdentifier'),
                    }),
                    z.object({
                      type: z.literal('JSXMemberExpression'),
                    }),
                  ]),
                  property: z.object({
                    type: z.literal('JSXIdentifier'),
                    name: z.string(),
                  }),
                }),
              ]),
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
          keywordStartingNodes.push(currentASTNode);

          const parentNodeStartLineNumber = parentNode.loc.start.line;
          const currentNodeStartLineNumber = node.loc.start.line;

          classNameNodes.forEach((classNameNode, index, array) => {
            const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameNodeRangeStart &&
              classNameNodeRangeEnd <= currentNodeRangeEnd
            ) {
              if (classNameNode.type === 'unknown' && classNameNode.delimiterType !== 'backtick') {
                // eslint-disable-next-line no-param-reassign
                array[index] = {
                  type: 'attribute',
                  isTheFirstLineOnTheSameLineAsTheOpeningTag:
                    parentNodeStartLineNumber === currentNodeStartLineNumber,
                  elementName: getElementName(
                    // @ts-ignore
                    parentNode.name,
                  ),
                  range: classNameNode.range,
                  startLineIndex: classNameNode.startLineIndex,
                };
              }
            }
          });
        }
        break;
      }
      case 'JSXExpressionContainer': {
        nonCommentNodes.push(currentASTNode);

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
          const currentNodeStartLineIndex = node.loc.start.line - 1;

          classNameNodes.forEach((classNameNode, index, array) => {
            const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameNodeRangeStart &&
              classNameNodeRangeEnd <= currentNodeRangeEnd
            ) {
              if (classNameNode.type === 'unknown') {
                if (classNameNode.delimiterType !== 'backtick') {
                  // eslint-disable-next-line no-param-reassign
                  array[index] = createExpressionNode({
                    delimiterType: classNameNode.delimiterType,
                    hasSingleQuote: classNameNode.hasSingleQuote,
                    hasDoubleQuote: classNameNode.hasDoubleQuote,
                    hasBacktick: classNameNode.hasBacktick,
                    shouldKeepDelimiter:
                      classNameNode.hasSingleQuote && classNameNode.hasDoubleQuote,
                    range: classNameNode.range,
                    startLineIndex: classNameNode.startLineIndex,
                  });
                } else {
                  // eslint-disable-next-line no-param-reassign
                  array[index] = createExpressionNode({
                    delimiterType: classNameNode.delimiterType,
                    isTheFirstLineOnTheSameLineAsTheAttributeName:
                      classNameNode.startLineIndex === currentNodeStartLineIndex,
                    range: classNameNode.range,
                    startLineIndex: classNameNode.startLineIndex,
                  });
                }
              }
            }
          });
        }
        break;
      }
      case 'ObjectProperty':
      case 'Property': {
        nonCommentNodes.push(currentASTNode);

        classNameNodes.forEach((classNameNode, index, array) => {
          const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

          if (
            currentNodeRangeStart <= classNameNodeRangeStart &&
            classNameNodeRangeEnd <= currentNodeRangeEnd
          ) {
            if (classNameNode.type === 'unknown') {
              // eslint-disable-next-line no-param-reassign
              array[index] = createExpressionNode({
                delimiterType: classNameNode.delimiterType,
                isItAnObjectProperty: true,
                range: classNameNode.range,
                startLineIndex: classNameNode.startLineIndex,
              });
            }
          }
        });
        break;
      }
      case 'ConditionalExpression': {
        nonCommentNodes.push(currentASTNode);

        classNameNodes.forEach((classNameNode, index, array) => {
          const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

          if (
            currentNodeRangeStart <= classNameNodeRangeStart &&
            classNameNodeRangeEnd <= currentNodeRangeEnd
          ) {
            if (classNameNode.type === 'unknown') {
              // eslint-disable-next-line no-param-reassign
              array[index] = createExpressionNode({
                delimiterType: classNameNode.delimiterType,
                isItAnOperandOfTernaryOperator: true,
                range: classNameNode.range,
                startLineIndex: classNameNode.startLineIndex,
              });
            } else if (classNameNode.type === 'expression') {
              if (classNameNode.delimiterType === 'backtick' && classNameNode.shouldKeepDelimiter) {
                // eslint-disable-next-line no-param-reassign
                classNameNode.isItAnOperandOfTernaryOperator = true;
              }
            }
          }
        });
        break;
      }
      case 'Literal': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
              loc: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              raw: z.string(),
            }),
          )
        ) {
          classNameNodes.push({
            type: 'unknown',
            delimiterType:
              // eslint-disable-next-line no-nested-ternary
              node.raw[0] === SINGLE_QUOTE
                ? 'single-quote'
                : node.raw[0] === DOUBLE_QUOTE
                ? 'double-quote'
                : 'backtick',
            hasSingleQuote: node.value.indexOf(SINGLE_QUOTE) !== -1,
            hasDoubleQuote: node.value.indexOf(DOUBLE_QUOTE) !== -1,
            hasBacktick: node.value.indexOf(BACKTICK) !== -1,
            range: [currentNodeRangeStart, currentNodeRangeEnd],
            startLineIndex: node.loc.start.line - 1,
          });
        }
        break;
      }
      case 'StringLiteral': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              extra: z.object({
                raw: z.string(),
              }),
              value: z.string(),
            }),
          )
        ) {
          classNameNodes.push({
            type: 'unknown',
            delimiterType:
              // eslint-disable-next-line no-nested-ternary
              node.extra.raw[0] === SINGLE_QUOTE
                ? 'single-quote'
                : node.extra.raw[0] === DOUBLE_QUOTE
                ? 'double-quote'
                : 'backtick',
            hasSingleQuote: node.value.indexOf(SINGLE_QUOTE) !== -1,
            hasDoubleQuote: node.value.indexOf(DOUBLE_QUOTE) !== -1,
            hasBacktick: node.value.indexOf(BACKTICK) !== -1,
            range: [currentNodeRangeStart, currentNodeRangeEnd],
            startLineIndex: node.loc.start.line - 1,
          });
        }
        break;
      }
      case 'TemplateLiteral': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              loc: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              quasis: z.array(
                z.object({
                  type: z.literal('TemplateElement'),
                  value: z.object({
                    cooked: z.string(),
                  }),
                  tail: z.boolean(),
                }),
              ),
            }),
          )
        ) {
          const { cooked } = node.quasis[0].value;
          const conditionForPreservation =
            !node.quasis[0].tail ||
            (options.singleQuote && cooked.indexOf(SINGLE_QUOTE) !== -1) ||
            (!options.singleQuote && cooked.indexOf(DOUBLE_QUOTE) !== -1);

          if (conditionForPreservation) {
            classNameNodes.push(
              createExpressionNode({
                delimiterType: 'backtick',
                shouldKeepDelimiter: true,
                range: [currentNodeRangeStart, currentNodeRangeEnd],
                startLineIndex: node.loc.start.line - 1,
              }),
            );
          } else {
            classNameNodes.push({
              type: 'unknown',
              delimiterType: 'backtick',
              range: [currentNodeRangeStart, currentNodeRangeEnd],
              startLineIndex: node.loc.start.line - 1,
            });
          }
        }
        break;
      }
      case 'TaggedTemplateExpression': {
        nonCommentNodes.push(currentASTNode);

        if (
          (isTypeof(
            node,
            z.object({
              tag: z.object({
                type: z.literal('Identifier'),
                name: z.string(),
              }),
            }),
          ) &&
            supportedFunctions.includes(node.tag.name)) ||
          (isTypeof(
            node,
            z.object({
              tag: z.object({
                type: z.literal('MemberExpression'),
                object: z.object({
                  type: z.literal('Identifier'),
                  name: z.string(),
                }),
              }),
            }),
          ) &&
            supportedFunctions.includes(node.tag.object.name)) ||
          (isTypeof(
            node,
            z.object({
              tag: z.object({
                type: z.literal('CallExpression'),
                callee: z.object({
                  type: z.literal('Identifier'),
                  name: z.string(),
                }),
              }),
            }),
          ) &&
            supportedFunctions.includes(node.tag.callee.name))
        ) {
          keywordStartingNodes.push(currentASTNode);

          classNameNodes.forEach((classNameNode, index, array) => {
            const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameNodeRangeStart &&
              classNameNodeRangeEnd <= currentNodeRangeEnd
            ) {
              if (classNameNode.type === 'unknown' && classNameNode.delimiterType === 'backtick') {
                // eslint-disable-next-line no-param-reassign
                array[index] = createExpressionNode({
                  delimiterType: classNameNode.delimiterType,
                  shouldKeepDelimiter: true,
                  range: classNameNode.range,
                  startLineIndex: classNameNode.startLineIndex,
                });
              }
            }
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
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      case 'File': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              comments: z.array(
                z.object({
                  type: z.string(),
                  value: z.string(),
                  start: z.number(),
                  end: z.number(),
                }),
              ),
            }),
          )
        ) {
          node.comments.forEach((comment) => {
            if (comment.value.trim() === 'prettier-ignore') {
              prettierIgnoreNodes.push({
                type: comment.type,
                range: [comment.start, comment.end],
              });
            }
          });
        }
        break;
      }
      default: {
        if (node.type !== 'JSXText') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortClassNameNodes(
    nonCommentNodes,
    prettierIgnoreNodes,
    keywordStartingNodes,
    classNameNodes,
  );
}

export function findTargetClassNameNodesForVue(
  ast: any,
  options: NarrowedParserOptions,
  addon: Dict<(text: string, options: any) => any>,
): ClassNameNode[] {
  const supportedAttributes: string[] = ['className', 'class', ...options.customAttributes];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const supportedFunctions: string[] = ['classNames', ...options.customFunctions];
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Nodes starting with supported attribute names or supported function names
   */
  const keywordStartingNodes: ASTNode[] = [];
  /**
   * Class names enclosed in delimiters
   */
  const classNameNodes: ClassNameNode[] = [];

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
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

    const [currentNodeRangeStart, currentNodeRangeEnd] = [
      node.sourceSpan.start.offset,
      node.sourceSpan.end.offset,
    ];
    const currentASTNode: ASTNode = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'attribute': {
        nonCommentNodes.push(currentASTNode);

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
              name: z.string(),
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
          keywordStartingNodes.push(currentASTNode);

          const isBoundAttribute = node.name.match(boundAttributeRegExp) !== null;

          if (isBoundAttribute) {
            if (addon.parseBabel) {
              try {
                const jsxStart = '<div className={';
                const jsxEnd = '}></div>';

                const babelAst = addon.parseBabel(`${jsxStart}${node.value}${jsxEnd}`, {
                  ...options,
                  parser: 'babel',
                });
                const targetClassNameNodesInAttribute = findTargetClassNameNodes(
                  babelAst,
                  options,
                ).map<ClassNameNode>((classNameNode) => {
                  const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

                  if (
                    classNameNode.type === 'expression' &&
                    classNameNode.delimiterType !== 'backtick' &&
                    classNameNode.startLineIndex === 0
                  ) {
                    // eslint-disable-next-line no-param-reassign
                    classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName = true;
                  }

                  const attributeOffset = -jsxStart.length + node.valueSpan.start.offset + 1;

                  return {
                    ...classNameNode,
                    range: [
                      classNameNodeRangeStart + attributeOffset,
                      classNameNodeRangeEnd + attributeOffset,
                    ],
                    startLineIndex: classNameNode.startLineIndex + node.sourceSpan.start.line,
                  };
                });

                classNameNodes.push(...targetClassNameNodesInAttribute);
              } catch (error) {
                // no action
              }
            }
          } else {
            const classNameNodeRangeStart = node.valueSpan.start.offset;
            const classNameNodeRangeEnd = node.valueSpan.end.offset;

            nonCommentNodes.push({
              type: 'StringLiteral',
              range: [classNameNodeRangeStart, classNameNodeRangeEnd],
            });

            const parentNodeStartLineIndex = parentNode.sourceSpan.start.line;
            const nodeStartLineIndex = node.sourceSpan.start.line;

            classNameNodes.push({
              type: 'attribute',
              isTheFirstLineOnTheSameLineAsTheOpeningTag:
                parentNodeStartLineIndex === nodeStartLineIndex,
              elementName: parentNode.name,
              range: [classNameNodeRangeStart, classNameNodeRangeEnd],
              startLineIndex: nodeStartLineIndex,
            });
          }
        }
        break;
      }
      case 'element': {
        nonCommentNodes.push(currentASTNode);

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
          // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
          keywordStartingNodes.push(currentASTNode);

          if (addon.parseTypescript) {
            const typescriptAst = addon.parseTypescript(node.children.at(0)?.value ?? '', {
              ...options,
              parser: 'typescript',
            });
            const targetClassNameNodesInScript = findTargetClassNameNodes(
              typescriptAst,
              options,
            ).map<ClassNameNode>((classNameNode) => {
              const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

              const scriptOffset = node.startSourceSpan.end.offset;

              return {
                ...classNameNode,
                range: [
                  classNameNodeRangeStart + scriptOffset,
                  classNameNodeRangeEnd + scriptOffset,
                ],
                startLineIndex: classNameNode.startLineIndex + node.sourceSpan.start.line,
              };
            });

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
          prettierIgnoreNodes.push(currentASTNode);
        }
        break;
      }
      default: {
        nonCommentNodes.push(currentASTNode);
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortClassNameNodes(
    nonCommentNodes,
    prettierIgnoreNodes,
    keywordStartingNodes,
    classNameNodes,
  );
}

export function findTargetClassNameNodesForAstro(
  formattedText: string,
  ast: any,
  options: NarrowedParserOptions,
  addon: Dict<(text: string, options: any) => any>,
): ClassNameNode[] {
  const supportedAttributes: string[] = [
    'className',
    'class',
    'class:list',
    ...options.customAttributes,
  ];
  const supportedFunctions: string[] = ['classNames', ...options.customFunctions];
  /**
   * Most nodes
   */
  const nonCommentNodes: ASTNode[] = [];
  /**
   * Nodes with a valid 'prettier-ignore' syntax
   */
  const prettierIgnoreNodes: ASTNode[] = [];
  /**
   * Nodes starting with supported attribute names or supported function names
   */
  const keywordStartingNodes: ASTNode[] = [];
  /**
   * Class names enclosed in delimiters
   */
  const classNameNodes: ClassNameNode[] = [];

  const totalTextLengthUptoSpecificIndexLine = formattedText
    .split(EOL)
    .slice(0, -1)
    .map((line) => `${line}${EOL}`.length)
    .map((_, index, array) =>
      array
        .slice(0, index + 1)
        .reduce((prevResult, currentLength) => prevResult + currentLength, 0),
    );
  totalTextLengthUptoSpecificIndexLine.unshift(0);

  function recursion(node: unknown, parentNode?: { type?: unknown }): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
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
          position: z.object({
            start: z.object({
              line: z.number(),
              column: z.number(),
            }),
            end: z
              .object({
                line: z.number(),
                column: z.number(),
              })
              .optional(),
          }),
          name: z.unknown(),
          value: z.unknown(),
        }),
      )
    ) {
      return;
    }

    const currentNodeRangeStart =
      totalTextLengthUptoSpecificIndexLine[node.position.start.line - 1] +
      (node.position.start.column - 1);
    const currentNodeRangeEnd = node.position.end
      ? totalTextLengthUptoSpecificIndexLine[node.position.end.line - 1] +
        (node.position.end.column - 1)
      : currentNodeRangeStart +
        (node.type === 'attribute'
          ? `${node.name}=?${node.value}?`.length
          : `${node.value}`.length);
    const currentASTNode: ASTNode = {
      type: node.type,
      range: [currentNodeRangeStart, currentNodeRangeEnd],
    };

    switch (node.type) {
      case 'frontmatter': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            node,
            z.object({
              value: z.string(),
            }),
          )
        ) {
          // Note: In fact, the frontmatter is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the frontmatter.
          keywordStartingNodes.push(currentASTNode);

          if (addon.parseTypescript) {
            const typescriptAst = addon.parseTypescript(node.value, {
              ...options,
              parser: 'typescript',
            });
            const targetClassNameNodesInFrontMatter = findTargetClassNameNodes(typescriptAst, {
              ...options,
              customAttributes: supportedAttributes,
              customFunctions: supportedFunctions,
            }).map<ClassNameNode>((classNameNode) => {
              const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

              const frontMatterOffset = '---'.length;

              return {
                ...classNameNode,
                range: [
                  classNameNodeRangeStart + frontMatterOffset,
                  classNameNodeRangeEnd + frontMatterOffset,
                ],
                startLineIndex: classNameNode.startLineIndex,
              };
            });

            classNameNodes.push(...targetClassNameNodesInFrontMatter);
          }
        }
        break;
      }
      case 'attribute': {
        nonCommentNodes.push(currentASTNode);

        if (
          isTypeof(
            parentNode,
            z.object({
              position: z.object({
                start: z.object({
                  line: z.number(),
                }),
              }),
              name: z.string(),
            }),
          ) &&
          (parentNode.type === 'element' || parentNode.type === 'component') &&
          isTypeof(
            node,
            z.object({
              kind: z.string(),
              name: z.string(),
              value: z.string(),
            }),
          ) &&
          supportedAttributes.includes(node.name)
        ) {
          keywordStartingNodes.push(currentASTNode);

          const attributeStart = `${node.name}=?`;

          if (node.kind === 'expression') {
            if (addon.parseTypescript) {
              const jsxStart = '<div className={';
              const jsxEnd = '}></div>';

              const typescriptAst = addon.parseTypescript(`${jsxStart}${node.value}${jsxEnd}`, {
                ...options,
                parser: 'typescript',
              });
              const targetClassNameNodesInAttribute = findTargetClassNameNodes(typescriptAst, {
                ...options,
                customAttributes: supportedAttributes,
                customFunctions: supportedFunctions,
              }).map<ClassNameNode>((classNameNode) => {
                const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

                if (
                  classNameNode.type === 'expression' &&
                  classNameNode.delimiterType !== 'backtick' &&
                  classNameNode.startLineIndex === 0
                ) {
                  // eslint-disable-next-line no-param-reassign
                  classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName = true;
                }

                const attributeOffset =
                  -jsxStart.length + currentNodeRangeStart + attributeStart.length;

                return {
                  ...classNameNode,
                  range: [
                    classNameNodeRangeStart + attributeOffset,
                    classNameNodeRangeEnd + attributeOffset,
                  ],
                  startLineIndex: classNameNode.startLineIndex + node.position.start.line - 1,
                };
              });

              classNameNodes.push(...targetClassNameNodesInAttribute);
            }
          } else if (node.kind === 'quoted') {
            const parentNodeStartLineIndex = parentNode.position.start.line - 1;
            const nodeStartLineIndex = node.position.start.line - 1;

            classNameNodes.push({
              type: 'attribute',
              isTheFirstLineOnTheSameLineAsTheOpeningTag:
                parentNodeStartLineIndex === nodeStartLineIndex,
              elementName: parentNode.name,
              range: [currentNodeRangeStart + attributeStart.length - 1, currentNodeRangeEnd],
              startLineIndex: node.position.start.line - 1,
            });
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
          const commentOffset = '<!--'.length;

          prettierIgnoreNodes.push({
            ...currentASTNode,
            range: [currentNodeRangeStart - commentOffset, currentNodeRangeEnd],
          });
        }
        break;
      }
      default: {
        if (node.type !== 'text') {
          nonCommentNodes.push(currentASTNode);
        }
        break;
      }
    }
  }

  recursion(ast);

  return filterAndSortClassNameNodes(
    nonCommentNodes,
    prettierIgnoreNodes,
    keywordStartingNodes,
    classNameNodes,
  );
}
