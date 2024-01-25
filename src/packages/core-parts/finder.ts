import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import { z } from 'zod';

import type { Dict, NodeRange, ClassNameNode, NarrowedParserOptions } from './shared';
import { ClassNameType } from './shared';

type ASTNode = {
  type: string;
  range: NodeRange;
};

function isTypeof<T extends ZodTypeAny>(arg: unknown, expectedSchema: T): arg is ZodInfer<T> {
  return expectedSchema.safeParse(arg).success;
}

function filterAndSortClassNameNodes(
  nonCommentNodes: ASTNode[],
  prettierIgnoreNodes: ASTNode[],
  classNameNodes: ClassNameNode[],
): ClassNameNode[] {
  const ignoreRanges = prettierIgnoreNodes.map<NodeRange>(({ range }) => {
    const [, prettierIgnoreRangeEnd] = range;

    const ignoringNodeOrNot = nonCommentNodes
      .filter(({ range: [nonCommentRangeStart] }) => prettierIgnoreRangeEnd < nonCommentRangeStart)
      .sort(
        (
          { range: [formerNodeRangeStart, formerNodeRangeEnd] },
          { range: [latterNodeRangeStart, latterNodeRangeEnd] },
        ) => formerNodeRangeStart - latterNodeRangeStart || latterNodeRangeEnd - formerNodeRangeEnd,
      )
      .at(0);

    return ignoringNodeOrNot?.range ?? range;
  });

  return classNameNodes
    .filter(
      ({ type: classNameType, range: [classNameRangeStart, classNameRangeEnd] }) =>
        [
          ClassNameType.ASL,
          ClassNameType.AOL,
          ClassNameType.FA,
          ClassNameType.CSL,
          ClassNameType.SLSL,
          ClassNameType.SLOP,
          ClassNameType.SLTO,
          ClassNameType.CTL,
          ClassNameType.TLOP,
          ClassNameType.TLTO,
        ].includes(classNameType) &&
        ignoreRanges.every(
          ([ignoreRangeStart, ignoreRangeEnd]) =>
            !(ignoreRangeStart <= classNameRangeStart && classNameRangeEnd <= ignoreRangeEnd),
        ),
    )
    .sort((former, latter) => latter.startLineIndex - former.startLineIndex);
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
   * Class names enclosed in some kind of quotes
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
          classNameNodes.forEach((classNameNode) => {
            const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameRangeStart &&
              classNameRangeEnd <= currentNodeRangeEnd
            ) {
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
          const parentNodeStartLineNumber = parentNode.loc.start.line;
          const currentNodeStartLineNumber = node.loc.start.line;

          classNameNodes.forEach((classNameNode) => {
            const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

            if (
              currentNodeRangeStart <= classNameRangeStart &&
              classNameRangeEnd <= currentNodeRangeEnd
            ) {
              if (classNameNode.type === ClassNameType.USL) {
                // eslint-disable-next-line no-param-reassign
                classNameNode.type =
                  parentNodeStartLineNumber === currentNodeStartLineNumber
                    ? ClassNameType.ASL
                    : ClassNameType.AOL;
              }
            }
          });
        }
        break;
      }
      case 'JSXExpressionContainer': {
        nonCommentNodes.push(currentASTNode);

        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (
            currentNodeRangeStart <= classNameRangeStart &&
            classNameRangeEnd <= currentNodeRangeEnd
          ) {
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
        nonCommentNodes.push(currentASTNode);

        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (
            currentNodeRangeStart <= classNameRangeStart &&
            classNameRangeEnd <= currentNodeRangeEnd
          ) {
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
        nonCommentNodes.push(currentASTNode);

        classNameNodes.forEach((classNameNode) => {
          const [classNameRangeStart, classNameRangeEnd] = classNameNode.range;

          if (
            currentNodeRangeStart <= classNameRangeStart &&
            classNameRangeEnd <= currentNodeRangeEnd
          ) {
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
          classNameNodes.push({
            type: ClassNameType.USL,
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
            }),
          )
        ) {
          classNameNodes.push({
            type: ClassNameType.UTL,
            range: [currentNodeRangeStart, currentNodeRangeEnd],
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

  return filterAndSortClassNameNodes(nonCommentNodes, prettierIgnoreNodes, classNameNodes);
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
   * Class names enclosed in some kind of quotes
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
              } catch (error) {
                // no action
              }
            }
          } else {
            const classNameRangeStart = node.valueSpan.start.offset;
            const classNameRangeEnd = node.valueSpan.end.offset;

            nonCommentNodes.push({
              type: 'StringLiteral',
              range: [classNameRangeStart, classNameRangeEnd],
            });

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

  return filterAndSortClassNameNodes(nonCommentNodes, prettierIgnoreNodes, classNameNodes);
}
