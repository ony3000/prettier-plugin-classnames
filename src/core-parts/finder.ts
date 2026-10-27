import type { AST, ParserOptions } from 'prettier';
import { parsers as babelParsers } from 'prettier/plugins/babel';
import { parsers as typescriptParsers } from 'prettier/plugins/typescript';

import * as schemas from './schemas';
import {
  type NodeRange,
  type ExpressionNode,
  type ClassNameNode,
  EOL,
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  BACKTICK,
  UNKNOWN_DELIMITER,
  isTypeof,
} from './utils';

type ASTNode = {
  type: string;
  start: number;
  end: number;
};

type CaseHandlerContext = {
  formattedText: string;
  options: ResolvedOptions;
  supportedAttributes: string[];
  supportedFunctions: string[];
  nonCommentNodes: ASTNode[];
  prettierIgnoreNodes: ASTNode[];
  keywordStartingNodes: ASTNode[];
  classNameNodes: ClassNameNode[];
  node: unknown;
  parentNode?: { kind: string; type?: undefined } | { kind?: undefined; type: string };
  currentASTNode: ASTNode;
};

type CaseHandlers = Partial<{
  [nodeType: string]: (ctx: CaseHandlerContext) => void;
}>;

type ParserCaseHandlers = Partial<{
  [parserName: string]: CaseHandlers;
}>;

function getElementName(
  param: schemas.JSXOpeningElementNameAsString | schemas.JSXOpeningElementNameAsObject,
): string {
  if (param.type === 'JSXIdentifier') {
    return param.name;
  }

  return `${getElementName(param.object)}.${param.property.name}`;
}

function getStartLineNumber(formattedText: string, node: { start: number }): number {
  return formattedText.slice(0, node.start).split(EOL).length;
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
    isItInVueTemplate: false,
    isItAngularExpression: false,
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
  const ignoreRanges = prettierIgnoreNodes.map<NodeRange>(
    ({ start: prettierIgnoreNodeRangeStart, end: prettierIgnoreNodeRangeEnd }) => {
      const ignoringNodeOrNot = nonCommentNodes
        .filter(
          ({ start: nonCommentNodeRangeStart }) =>
            prettierIgnoreNodeRangeEnd < nonCommentNodeRangeStart,
        )
        .sort(
          (
            { start: formerNodeRangeStart, end: formerNodeRangeEnd },
            { start: latterNodeRangeStart, end: latterNodeRangeEnd },
          ) =>
            formerNodeRangeStart - latterNodeRangeStart || latterNodeRangeEnd - formerNodeRangeEnd,
        )
        .at(0);

      return ignoringNodeOrNot
        ? [ignoringNodeOrNot.start, ignoringNodeOrNot.end]
        : [prettierIgnoreNodeRangeStart, prettierIgnoreNodeRangeEnd];
    },
  );
  const keywordStartingRanges = keywordStartingNodes.map<NodeRange>(({ start, end }) => [
    start,
    end,
  ]);

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

function parseBabel(text: string, options: ParserOptions) {
  return babelParsers.babel.parse(text, options);
}

function parseTypescript(text: string, options: ParserOptions) {
  return typescriptParsers.typescript.parse(text, options);
}

function handleJavaScriptCallExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(ctx.node, schemas.javaScriptCallExpressionSchema) &&
    ctx.node.callee.type === 'Identifier' &&
    ctx.supportedFunctions.includes(ctx.node.callee.name)
  ) {
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    ctx.classNameNodes.forEach((classNameNode, index, array) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        ctx.currentASTNode.start <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= ctx.currentASTNode.end
      ) {
        if (classNameNode.type === 'unknown') {
          array[index] = createExpressionNode({
            delimiterType: classNameNode.delimiterType,
            isItFunctionArgument: true,
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          });
        } else if (classNameNode.type === 'expression') {
          classNameNode.isItFunctionArgument = true;
        }
      }
    });
  }
}

function handleJavaScriptConditionalExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  ctx.classNameNodes.forEach((classNameNode, index, array) => {
    const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

    if (
      ctx.currentASTNode.start <= classNameNodeRangeStart &&
      classNameNodeRangeEnd <= ctx.currentASTNode.end
    ) {
      if (classNameNode.type === 'unknown') {
        array[index] = createExpressionNode({
          delimiterType: classNameNode.delimiterType,
          isItAnOperandOfTernaryOperator: true,
          range: classNameNode.range,
          startLineIndex: classNameNode.startLineIndex,
        });
      } else if (classNameNode.type === 'expression') {
        classNameNode.isItAnOperandOfTernaryOperator = true;
      }
    }
  });

  if (isTypeof(ctx.node, schemas.javaScriptConditionalExpressionSchema)) {
    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);

    ctx.classNameNodes.push({
      type: 'ternary',
      range: [ctx.currentASTNode.start, ctx.currentASTNode.end],
      startLineIndex: currentNodeStartLineNumber - 1,
    });
  }
}

function handleJavaScriptFile(ctx: CaseHandlerContext) {
  if (isTypeof(ctx.node, schemas.javaScriptFileSchema)) {
    ctx.node.comments.forEach((comment) => {
      if (comment.value.trim() === 'prettier-ignore') {
        ctx.prettierIgnoreNodes.push({
          type: comment.type,
          start: comment.start,
          end: comment.end,
        });
      }
    });
  }
}

function handleJavaScriptJSXAttribute(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(ctx.parentNode, schemas.jsxOpeningElementSchema) &&
    ctx.parentNode.type === 'JSXOpeningElement' &&
    isTypeof(ctx.node, schemas.jsxAttributeSchema) &&
    ctx.node.name.type === 'JSXIdentifier' &&
    ctx.supportedAttributes.includes(ctx.node.name.name)
  ) {
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const parentNodeName = ctx.parentNode.name;
    const parentNodeStartLineNumber = ctx.parentNode.loc
      ? ctx.parentNode.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.parentNode);
    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);

    ctx.classNameNodes.forEach((classNameNode, index, array) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        ctx.currentASTNode.start <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= ctx.currentASTNode.end
      ) {
        if (classNameNode.type === 'unknown' && classNameNode.delimiterType !== 'backtick') {
          array[index] = {
            type: 'attribute',
            isTheFirstLineOnTheSameLineAsTheOpeningTag:
              parentNodeStartLineNumber === currentNodeStartLineNumber,
            elementName: getElementName(parentNodeName),
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          };
        }
      }
    });
  }
}

function handleJavaScriptJSXExpressionContainer(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.javaScriptJSXExpressionContainerSchema)) {
    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);
    const currentNodeStartLineIndex = currentNodeStartLineNumber - 1;

    ctx.classNameNodes.forEach((classNameNode, index, array) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        ctx.currentASTNode.start <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= ctx.currentASTNode.end
      ) {
        if (classNameNode.type === 'unknown') {
          if (classNameNode.delimiterType !== 'backtick') {
            array[index] = createExpressionNode({
              delimiterType: classNameNode.delimiterType,
              hasSingleQuote: classNameNode.hasSingleQuote,
              hasDoubleQuote: classNameNode.hasDoubleQuote,
              hasBacktick: classNameNode.hasBacktick,
              shouldKeepDelimiter: classNameNode.hasSingleQuote && classNameNode.hasDoubleQuote,
              range: classNameNode.range,
              startLineIndex: classNameNode.startLineIndex,
            });
          } else {
            array[index] = createExpressionNode({
              delimiterType: classNameNode.delimiterType,
              isTheFirstLineOnTheSameLineAsTheAttributeName:
                classNameNode.startLineIndex === currentNodeStartLineIndex,
              range: classNameNode.range,
              startLineIndex: classNameNode.startLineIndex,
            });
          }
        } else if (classNameNode.type === 'expression') {
          classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName =
            classNameNode.startLineIndex === currentNodeStartLineIndex;
        }
      }
    });
  }
}

function handleJavaScriptLogicalExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.javaScriptLogicalExpressionSchema)) {
    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);

    ctx.classNameNodes.push({
      type: 'logical',
      range: [ctx.currentASTNode.start, ctx.currentASTNode.end],
      startLineIndex: currentNodeStartLineNumber - 1,
    });
  }
}

function handleJavaScriptObjectProperty(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.javaScriptObjectPropertySchema)) {
    const objectKeyRangeStart = ctx.node.key.start;
    const objectKeyRangeEnd = ctx.node.key.end;

    ctx.classNameNodes.forEach((classNameNode, index, array) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;
      const isItAnObjectProperty =
        objectKeyRangeStart <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= objectKeyRangeEnd;

      if (
        ctx.currentASTNode.start <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= ctx.currentASTNode.end
      ) {
        if (classNameNode.type === 'unknown') {
          array[index] = createExpressionNode({
            delimiterType: classNameNode.delimiterType,
            isItAnObjectProperty,
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          });
        } else if (classNameNode.type === 'expression') {
          classNameNode.isItAnObjectProperty = isItAnObjectProperty;
        }
      }
    });
  }
}

function handleJavaScriptStringLiteral(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.javaScriptStringLiteralSchema)) {
    ctx.classNameNodes.push({
      type: 'unknown',
      delimiterType:
        ctx.node.extra.raw[0] === SINGLE_QUOTE
          ? 'single-quote'
          : ctx.node.extra.raw[0] === DOUBLE_QUOTE
            ? 'double-quote'
            : 'backtick',
      hasSingleQuote: ctx.node.value.indexOf(SINGLE_QUOTE) !== -1,
      hasDoubleQuote: ctx.node.value.indexOf(DOUBLE_QUOTE) !== -1,
      hasBacktick: ctx.node.value.indexOf(BACKTICK) !== -1,
      range: [ctx.currentASTNode.start, ctx.currentASTNode.end],
      startLineIndex: ctx.node.loc.start.line - 1,
    });
  }
}

function handleJavaScriptTaggedTemplateExpression(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    (isTypeof(ctx.node, schemas.taggedIdentifierOffsetsSchema) && ctx.node.tag.name === 'css') ||
    (isTypeof(ctx.node, schemas.taggedMemberOffsetsSchema) &&
      ctx.node.tag.object.name === 'String' &&
      ctx.node.tag.property.name === 'raw')
  ) {
    const tagRangeStart = ctx.node.tag.start;
    const tagRangeEnd = ctx.node.tag.end;

    // Note: In fact, the tag name is not `prettierIgnoreNode`, but it is considered a kind of ignore comment to ignore the template literal that immediately follows it.
    ctx.prettierIgnoreNodes.push({
      type: ctx.node.tag.type,
      start: tagRangeStart,
      end: tagRangeEnd - 1,
    });
    return;
  }

  if (
    (isTypeof(ctx.node, schemas.taggedIdentifierRangeSchema) && ctx.node.tag.name === 'css') ||
    (isTypeof(ctx.node, schemas.taggedMemberRangeSchema) &&
      ctx.node.tag.object.name === 'String' &&
      ctx.node.tag.property.name === 'raw')
  ) {
    const [tagRangeStart, tagRangeEnd] = ctx.node.tag.range;

    // Note: In fact, the tag name is not `prettierIgnoreNode`, but it is considered a kind of ignore comment to ignore the template literal that immediately follows it.
    ctx.prettierIgnoreNodes.push({
      type: ctx.node.tag.type,
      start: tagRangeStart,
      end: tagRangeEnd - 1,
    });
    return;
  }

  if (
    (isTypeof(ctx.node, schemas.taggedIdentifierSchema) &&
      ctx.supportedFunctions.includes(ctx.node.tag.name)) ||
    (isTypeof(ctx.node, schemas.taggedMemberSchema) &&
      ctx.supportedFunctions.includes(ctx.node.tag.object.name)) ||
    (isTypeof(ctx.node, schemas.taggedCallSchema) &&
      ctx.supportedFunctions.includes(ctx.node.tag.callee.name))
  ) {
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const nodeTagType = ctx.node.tag.type;

    ctx.classNameNodes.forEach((classNameNode, index, array) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        ctx.currentASTNode.start <= classNameNodeRangeStart &&
        classNameNodeRangeEnd <= ctx.currentASTNode.end
      ) {
        if (classNameNode.type === 'unknown' && classNameNode.delimiterType === 'backtick') {
          array[index] = createExpressionNode({
            delimiterType: classNameNode.delimiterType,
            isItFunctionArgument: nodeTagType === 'CallExpression',
            shouldKeepDelimiter: true,
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          });
        } else if (
          classNameNode.type === 'expression' &&
          classNameNode.delimiterType === 'backtick'
        ) {
          classNameNode.isItFunctionArgument = nodeTagType === 'CallExpression';
          classNameNode.shouldKeepDelimiter = true;
        }
      }
    });
  }
}

function handleJavaScriptTemplateLiteral(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.javaScriptTemplateLiteralSchema)) {
    const { cooked } = ctx.node.quasis[0].value;

    const hasSingleQuote = cooked.indexOf(SINGLE_QUOTE) !== -1;
    const hasDoubleQuote = cooked.indexOf(DOUBLE_QUOTE) !== -1;
    const hasBacktick = cooked.indexOf(BACKTICK) !== -1;

    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);

    ctx.classNameNodes.push(
      createExpressionNode({
        delimiterType: 'backtick',
        hasSingleQuote,
        hasDoubleQuote,
        hasBacktick,
        shouldKeepDelimiter: !ctx.node.quasis[0].tail || (hasSingleQuote && hasDoubleQuote),
        range: [ctx.currentASTNode.start, ctx.currentASTNode.end],
        startLineIndex: currentNodeStartLineNumber - 1,
      }),
    );
  }
}

function handleTypeScriptBlock(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.node, schemas.typeScriptBlockSchema) &&
    ctx.node.value.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleTypeScriptLiteral(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.typeScriptLiteralSchema)) {
    const currentNodeStartLineNumber = ctx.node.loc
      ? ctx.node.loc.start.line
      : getStartLineNumber(ctx.formattedText, ctx.node);

    ctx.classNameNodes.push({
      type: 'unknown',
      delimiterType:
        ctx.node.raw[0] === SINGLE_QUOTE
          ? 'single-quote'
          : ctx.node.raw[0] === DOUBLE_QUOTE
            ? 'double-quote'
            : 'backtick',
      hasSingleQuote: ctx.node.value.indexOf(SINGLE_QUOTE) !== -1,
      hasDoubleQuote: ctx.node.value.indexOf(DOUBLE_QUOTE) !== -1,
      hasBacktick: ctx.node.value.indexOf(BACKTICK) !== -1,
      range: [ctx.currentASTNode.start, ctx.currentASTNode.end],
      startLineIndex: currentNodeStartLineNumber - 1,
    });
  }
}

function handleSvelteAttribute(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(ctx.node, schemas.svelteAttributeSchema) &&
    ctx.supportedAttributes.includes(ctx.node.name)
  ) {
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const childNodes = Array.isArray(ctx.node.value) ? ctx.node.value : [ctx.node.value];
    const hasExpression = childNodes.some(
      (childNode) => childNode.type === 'MustacheTag' || childNode.type === 'ExpressionTag',
    );

    if (hasExpression) {
      let minRangeStart = Infinity;
      let maxRangeEnd = 0;
      let startLineIndex: number | undefined;
      const removeTargetNodeIndexes: number[] = [];

      ctx.classNameNodes.forEach((classNameNode, index) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        if (
          ctx.currentASTNode.start <= classNameNodeRangeStart &&
          classNameNodeRangeEnd <= ctx.currentASTNode.end
        ) {
          if (classNameNode.type === 'unknown') {
            removeTargetNodeIndexes.push(index);

            if (maxRangeEnd < classNameNodeRangeEnd) {
              maxRangeEnd = classNameNodeRangeEnd;
            }

            if (minRangeStart > classNameNodeRangeStart) {
              minRangeStart = classNameNodeRangeStart;
              startLineIndex = classNameNode.startLineIndex;
            }
          }
        }
      });

      if (startLineIndex !== undefined) {
        removeTargetNodeIndexes.sort((former, latter) => latter - former);
        removeTargetNodeIndexes.forEach((targetNodeIndex) => {
          ctx.classNameNodes.splice(targetNodeIndex, 1);
        });

        ctx.classNameNodes.push({
          type: 'attribute',
          isTheFirstLineOnTheSameLineAsTheOpeningTag: false,
          elementName: '',
          range: [minRangeStart, maxRangeEnd],
          startLineIndex,
        });
      }
    } else {
      ctx.classNameNodes.forEach((classNameNode, index, array) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        if (
          ctx.currentASTNode.start <= classNameNodeRangeStart &&
          classNameNodeRangeEnd <= ctx.currentASTNode.end
        ) {
          if (classNameNode.type === 'unknown' && classNameNode.delimiterType !== 'backtick') {
            array[index] = {
              type: 'attribute',
              isTheFirstLineOnTheSameLineAsTheOpeningTag: false,
              elementName: '',
              range: classNameNode.range,
              startLineIndex: classNameNode.startLineIndex,
            };
          }
        }
      });
    }
  }
}

function handleSvelteComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.node, schemas.svelteCommentSchema) &&
    ctx.node.data.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleSvelteMustacheTag(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  const currentNodeStartLineIndex =
    ctx.formattedText.slice(0, ctx.currentASTNode.start).split(EOL).length - 1;

  ctx.classNameNodes.forEach((classNameNode, index, array) => {
    const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

    if (
      ctx.currentASTNode.start <= classNameNodeRangeStart &&
      classNameNodeRangeEnd <= ctx.currentASTNode.end
    ) {
      if (classNameNode.type === 'unknown') {
        if (classNameNode.delimiterType !== 'backtick') {
          array[index] = createExpressionNode({
            delimiterType: classNameNode.delimiterType,
            hasSingleQuote: classNameNode.hasSingleQuote,
            hasDoubleQuote: classNameNode.hasDoubleQuote,
            hasBacktick: classNameNode.hasBacktick,
            shouldKeepDelimiter: classNameNode.hasSingleQuote && classNameNode.hasDoubleQuote,
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          });
        } else {
          array[index] = createExpressionNode({
            delimiterType: classNameNode.delimiterType,
            isTheFirstLineOnTheSameLineAsTheAttributeName:
              classNameNode.startLineIndex === currentNodeStartLineIndex,
            range: classNameNode.range,
            startLineIndex: classNameNode.startLineIndex,
          });
        }
      } else if (classNameNode.type === 'expression') {
        classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName =
          classNameNode.startLineIndex === currentNodeStartLineIndex;
      }
    }
  });
}

function handleSvelteRefinedScript(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.svelteRefinedScriptSchema)) {
    // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const textNodeInScript = ctx.node.content;

    if (textNodeInScript) {
      const openingTagEndingOffset = textNodeInScript.start;
      const openingTagEndingLineIndex = textNodeInScript.loc.start.line - 1;

      const subText = textNodeInScript.value;
      const subOptions = {
        ...ctx.options,
        parser: 'typescript',
      };
      const typescriptAst = parseTypescript(subText, subOptions);
      const targetClassNameNodesInScript = findTargetClassNameNodesBasedOnJavaScript(
        subText,
        typescriptAst,
        subOptions,
      ).map<ClassNameNode>((classNameNode) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        return {
          ...classNameNode,
          range: [
            classNameNodeRangeStart + openingTagEndingOffset,
            classNameNodeRangeEnd + openingTagEndingOffset,
          ],
          startLineIndex: classNameNode.startLineIndex + openingTagEndingLineIndex,
        };
      });

      ctx.classNameNodes.push(...targetClassNameNodesInScript);
    }
  }
}

function handleSvelteText(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.parentNode, schemas.svelteTextParentSchema) &&
    isTypeof(ctx.node, schemas.svelteTextSchema)
  ) {
    ctx.nonCommentNodes.push(ctx.currentASTNode);

    const delimiter = ctx.formattedText[ctx.node.start - 1];
    const currentNodeStartLineIndex =
      ctx.formattedText.slice(0, ctx.currentASTNode.start).split(EOL).length - 1;

    ctx.classNameNodes.push({
      type: 'unknown',
      delimiterType:
        delimiter === SINGLE_QUOTE
          ? 'single-quote'
          : delimiter === DOUBLE_QUOTE
            ? 'double-quote'
            : 'backtick',
      hasSingleQuote: ctx.node.data.indexOf(SINGLE_QUOTE) !== -1,
      hasDoubleQuote: ctx.node.data.indexOf(DOUBLE_QUOTE) !== -1,
      hasBacktick: ctx.node.data.indexOf(BACKTICK) !== -1,
      range: [ctx.currentASTNode.start - 1, ctx.currentASTNode.end + 1],
      startLineIndex: currentNodeStartLineIndex,
    });
  }
}

function handleHtmlAttribute(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(ctx.parentNode, schemas.htmlAttributeParentSchema) &&
    (ctx.parentNode?.kind ?? ctx.parentNode?.type) === 'element' &&
    isTypeof(ctx.node, schemas.htmlAttributeSchema)
  ) {
    const typedNode = ctx.node;

    const boundAngularAttributeRegExp = /^\[(?:.+)\]$/;
    const isBoundAngularAttribute = ctx.node.name.match(boundAngularAttributeRegExp) !== null;

    const boundVueAttributeRegExp = /^(?:v-bind)?:/;
    const isBoundVueAttribute = ctx.node.name.match(boundVueAttributeRegExp) !== null;

    if (isBoundAngularAttribute) {
      ctx.keywordStartingNodes.push(ctx.currentASTNode);

      const backslashIndexes: number[] = [];
      let mutableAttributeValue = ctx.node.value;
      let errorLineIndex: number | null = null;

      do {
        errorLineIndex = null;

        try {
          const plainAttributeName = ctx.node.name.replace(/^\[(?:attr\.)?(.+)\]$/, '$1');
          const isSupportedAttribute = ctx.supportedAttributes.includes(plainAttributeName);

          const jsxStart = `<div ${isSupportedAttribute ? 'className' : plainAttributeName}={`;
          const jsxEnd = '}></div>';

          const subText = `${jsxStart}${mutableAttributeValue}${jsxEnd}`;
          const subOptions = {
            ...ctx.options,
            parser: 'babel',
          };
          const babelAst = parseBabel(subText, subOptions);
          const targetClassNameNodesInAttribute = findTargetClassNameNodesBasedOnJavaScript(
            subText,
            babelAst,
            subOptions,
          ).map<ClassNameNode>((classNameNode) => {
            const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

            if (classNameNode.type === 'expression') {
              classNameNode.isItAngularExpression = true;

              if (
                classNameNode.delimiterType !== 'backtick' &&
                classNameNode.startLineIndex === 0
              ) {
                classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName = true;
              }
            }

            const attributeOffset = -jsxStart.length + typedNode.valueSpan.start.offset + 1;

            const rangeStartWithoutJsx = classNameNodeRangeStart - jsxStart.length;
            const backslashCountBeforeThisNode = backslashIndexes.filter(
              (backslashIndex) => backslashIndex < rangeStartWithoutJsx,
            ).length;
            const rangeEndWithoutJsx = classNameNodeRangeEnd - jsxStart.length;
            const backslashCountUptoThisNode = backslashIndexes.filter(
              (backslashIndex) => backslashIndex < rangeEndWithoutJsx,
            ).length;

            return {
              ...classNameNode,
              range: [
                classNameNodeRangeStart + attributeOffset - backslashCountBeforeThisNode,
                classNameNodeRangeEnd + attributeOffset - backslashCountUptoThisNode,
              ],
              startLineIndex: classNameNode.startLineIndex + typedNode.sourceSpan.start.line,
            };
          });

          ctx.classNameNodes.push(...targetClassNameNodesInAttribute);
        } catch (error) {
          if (isTypeof(error, schemas.htmlAttributeErrorSchema)) {
            if (error.message.match(/^Unterminated string constant./) === null) {
              break;
            }

            errorLineIndex = error.loc.start.line - 1;
          }
        }

        if (errorLineIndex !== null) {
          const mutableAttributeLines = mutableAttributeValue.split(EOL);
          let isBackslashAdded = false;

          mutableAttributeValue = mutableAttributeLines
            .map((line, index) => {
              if (
                !isBackslashAdded &&
                // biome-ignore lint/style/noNonNullAssertion: Type guarded in upper scope.
                index >= errorLineIndex! &&
                line[line.length - 1] !== '\\'
              ) {
                isBackslashAdded = true;

                const totalTextLengthUptoPrevLine = mutableAttributeLines
                  .slice(0, index)
                  .reduce((textLength, _line) => textLength + _line.length + EOL.length, 0);

                backslashIndexes.push(totalTextLengthUptoPrevLine + line.length);

                return `${line}\\`;
              }

              return line;
            })
            .join(EOL);
        }
      } while (errorLineIndex !== null);
    } else if (isBoundVueAttribute) {
      ctx.keywordStartingNodes.push(ctx.currentASTNode);

      try {
        const plainAttributeName = ctx.node.name.replace(boundVueAttributeRegExp, '');
        const isSupportedAttribute = ctx.supportedAttributes.includes(plainAttributeName);

        const jsxStart = `<div ${isSupportedAttribute ? 'className' : plainAttributeName}={`;
        const jsxEnd = '}></div>';

        const subText = `${jsxStart}${ctx.node.value}${jsxEnd}`;
        const subOptions = {
          ...ctx.options,
          parser: 'babel',
        };
        const babelAst = parseBabel(subText, subOptions);
        const targetClassNameNodesInAttribute = findTargetClassNameNodesBasedOnJavaScript(
          subText,
          babelAst,
          subOptions,
        ).map<ClassNameNode>((classNameNode) => {
          const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

          if (classNameNode.type === 'expression') {
            classNameNode.isItInVueTemplate = true;

            if (classNameNode.delimiterType !== 'backtick' && classNameNode.startLineIndex === 0) {
              classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName = true;
            }
          }

          const attributeOffset = -jsxStart.length + typedNode.valueSpan.start.offset + 1;

          return {
            ...classNameNode,
            range: [
              classNameNodeRangeStart + attributeOffset,
              classNameNodeRangeEnd + attributeOffset,
            ],
            startLineIndex: classNameNode.startLineIndex + typedNode.sourceSpan.start.line,
          };
        });

        ctx.classNameNodes.push(...targetClassNameNodesInAttribute);
      } catch (_) {
        // no action
      }
    } else {
      if (ctx.supportedAttributes.includes(ctx.node.name)) {
        ctx.keywordStartingNodes.push(ctx.currentASTNode);

        const classNameNodeRangeStart = ctx.node.valueSpan.start.offset;
        const classNameNodeRangeEnd = ctx.node.valueSpan.end.offset;

        ctx.nonCommentNodes.push({
          type: 'StringLiteral',
          start: classNameNodeRangeStart,
          end: classNameNodeRangeEnd,
        });

        const parentNodeStartLineIndex = ctx.parentNode.sourceSpan.start.line;
        const nodeStartLineIndex = ctx.node.sourceSpan.start.line;

        ctx.classNameNodes.push({
          type: 'attribute',
          isTheFirstLineOnTheSameLineAsTheOpeningTag:
            parentNodeStartLineIndex === nodeStartLineIndex,
          elementName: ctx.parentNode.name,
          range: [classNameNodeRangeStart, classNameNodeRangeEnd],
          startLineIndex: nodeStartLineIndex,
        });
      }
    }
  }
}

function handleHtmlComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.node, schemas.htmlCommentSchema) &&
    ctx.node.value.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleHtmlElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.htmlElementSchema) && ctx.node.name === 'script') {
    const textNodeInScript = ctx.node.children.at(0);

    if (ctx.node.attrs.find((attr) => attr.name === 'lang' && attr.value === 'ts')) {
      // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
      ctx.keywordStartingNodes.push(ctx.currentASTNode);

      if (textNodeInScript) {
        const openingTagEndingLineIndex = ctx.node.startSourceSpan.end.line;
        const openingTagEndingOffset = ctx.node.startSourceSpan.end.offset;

        const subText = textNodeInScript.value;
        const subOptions = {
          ...ctx.options,
          parser: 'typescript',
        };
        const typescriptAst = parseTypescript(subText, subOptions);
        const targetClassNameNodesInScript = findTargetClassNameNodesBasedOnJavaScript(
          subText,
          typescriptAst,
          subOptions,
        ).map<ClassNameNode>((classNameNode) => {
          const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

          return {
            ...classNameNode,
            range: [
              classNameNodeRangeStart + openingTagEndingOffset,
              classNameNodeRangeEnd + openingTagEndingOffset,
            ],
            startLineIndex: classNameNode.startLineIndex + openingTagEndingLineIndex,
          };
        });

        ctx.classNameNodes.push(...targetClassNameNodesInScript);
      }
    } else if (
      ctx.node.attrs.find(
        (attr) => attr.name === 'type' && (attr.value === '' || attr.value === 'text/javascript'),
      ) ||
      !ctx.node.attrs.find((attr) => attr.name === 'type')
    ) {
      // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
      ctx.keywordStartingNodes.push(ctx.currentASTNode);

      if (textNodeInScript) {
        const openingTagEndingLineIndex = ctx.node.startSourceSpan.end.line;
        const openingTagEndingOffset = ctx.node.startSourceSpan.end.offset;

        const subText = textNodeInScript.value;
        const subOptions = {
          ...ctx.options,
          parser: 'babel',
        };
        const babelAst = parseBabel(subText, subOptions);
        const targetClassNameNodesInScript = findTargetClassNameNodesBasedOnJavaScript(
          subText,
          babelAst,
          subOptions,
        ).map<ClassNameNode>((classNameNode) => {
          const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

          return {
            ...classNameNode,
            range: [
              classNameNodeRangeStart + openingTagEndingOffset,
              classNameNodeRangeEnd + openingTagEndingOffset,
            ],
            startLineIndex: classNameNode.startLineIndex + openingTagEndingLineIndex,
          };
        });

        ctx.classNameNodes.push(...targetClassNameNodesInScript);
      }
    }
  }
}

function handleAngularElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.angularElementSchema) && ctx.node.name === 'script') {
    // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const textNodeInScript = ctx.node.children.at(0);

    if (textNodeInScript) {
      const openingTagEndingLineIndex = ctx.node.startSourceSpan.end.line;
      const openingTagEndingOffset = ctx.node.startSourceSpan.end.offset;

      const subText = textNodeInScript.value;
      const subOptions = {
        ...ctx.options,
        parser: 'typescript',
      };
      const typescriptAst = parseTypescript(subText, subOptions);
      const targetClassNameNodesInScript = findTargetClassNameNodesBasedOnJavaScript(
        subText,
        typescriptAst,
        subOptions,
      ).map<ClassNameNode>((classNameNode) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        return {
          ...classNameNode,
          range: [
            classNameNodeRangeStart + openingTagEndingOffset,
            classNameNodeRangeEnd + openingTagEndingOffset,
          ],
          startLineIndex: classNameNode.startLineIndex + openingTagEndingLineIndex,
        };
      });

      ctx.classNameNodes.push(...targetClassNameNodesInScript);
    }
  }
}

function handleAstroAttribute(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (
    isTypeof(ctx.parentNode, schemas.astroAttributeParentSchema) &&
    (ctx.parentNode.type === 'element' || ctx.parentNode.type === 'component') &&
    isTypeof(ctx.node, schemas.astroAttributeSchema)
  ) {
    const typedNode = ctx.node;

    const attributeStart = `${ctx.node.name}=${UNKNOWN_DELIMITER}`;

    if (ctx.node.kind === 'expression') {
      ctx.keywordStartingNodes.push(ctx.currentASTNode);

      const isSupportedAttribute = ctx.supportedAttributes.includes(ctx.node.name);

      const jsxStart = `<div ${isSupportedAttribute ? 'className' : ctx.node.name}={`;
      const jsxEnd = '}></div>';

      const subText = `${jsxStart}${ctx.node.value}${jsxEnd}`;
      const subOptions = {
        ...ctx.options,
        parser: 'typescript',
        customAttributes: ctx.supportedAttributes,
        customFunctions: ctx.supportedFunctions,
      };
      const typescriptAst = parseTypescript(subText, subOptions);
      const targetClassNameNodesInAttribute = findTargetClassNameNodesBasedOnJavaScript(
        subText,
        typescriptAst,
        subOptions,
      ).map<ClassNameNode>((classNameNode) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        if (
          classNameNode.type === 'expression' &&
          classNameNode.delimiterType !== 'backtick' &&
          classNameNode.startLineIndex === 0
        ) {
          classNameNode.isTheFirstLineOnTheSameLineAsTheAttributeName = true;
        }

        const attributeOffset = -jsxStart.length + ctx.currentASTNode.start + attributeStart.length;

        return {
          ...classNameNode,
          range: [
            classNameNodeRangeStart + attributeOffset,
            classNameNodeRangeEnd + attributeOffset,
          ],
          startLineIndex: classNameNode.startLineIndex + typedNode.position.start.line - 1,
        };
      });

      ctx.classNameNodes.push(...targetClassNameNodesInAttribute);
    } else if (ctx.node.kind === 'quoted') {
      if (ctx.supportedAttributes.includes(ctx.node.name)) {
        ctx.keywordStartingNodes.push(ctx.currentASTNode);

        const parentNodeStartLineIndex = ctx.parentNode.position.start.line - 1;
        const nodeStartLineIndex = ctx.node.position.start.line - 1;

        ctx.classNameNodes.push({
          type: 'attribute',
          isTheFirstLineOnTheSameLineAsTheOpeningTag:
            parentNodeStartLineIndex === nodeStartLineIndex,
          elementName: ctx.parentNode.name,
          range: [ctx.currentASTNode.start + attributeStart.length - 1, ctx.currentASTNode.end],
          startLineIndex: ctx.node.position.start.line - 1,
        });
      }
    }
  }
}

function handleAstroComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.node, schemas.astroCommentSchema) &&
    ctx.node.value.trim() === 'prettier-ignore'
  ) {
    const commentOffset = '<!--'.length;

    ctx.prettierIgnoreNodes.push({
      ...ctx.currentASTNode,
      start: ctx.currentASTNode.start - commentOffset,
      end: ctx.currentASTNode.end,
    });
  }
}

function handleAstroElement(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.astroElementSchema) && ctx.node.name === 'script') {
    // Note: In fact, the script element is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the element.
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const textNodeInScript = ctx.node.children.at(0);

    if (textNodeInScript) {
      const openingTagEndingLineIndex = textNodeInScript.position.start.line - 1;
      const openingTagEndingOffset = textNodeInScript.position.start.offset;

      const subText = textNodeInScript.value;
      const subOptions = {
        ...ctx.options,
        parser: 'typescript',
      };
      const typescriptAst = parseTypescript(subText, subOptions);
      const targetClassNameNodesInScript = findTargetClassNameNodesBasedOnJavaScript(
        subText,
        typescriptAst,
        subOptions,
      ).map<ClassNameNode>((classNameNode) => {
        const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

        return {
          ...classNameNode,
          range: [
            classNameNodeRangeStart + openingTagEndingOffset,
            classNameNodeRangeEnd + openingTagEndingOffset,
          ],
          startLineIndex: classNameNode.startLineIndex + openingTagEndingLineIndex,
        };
      });

      ctx.classNameNodes.push(...targetClassNameNodesInScript);
    }
  }
}

function handleCssCssAtrule(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.cssCssAtruleSchema)) {
    // Note: In fact, the `@apply` rule is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the rule.
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const offset = '@apply'.length;

    const classNameNodeRangeStart = ctx.currentASTNode.start + offset;
    const classNameNodeRangeEnd = ctx.currentASTNode.end;

    const nodeStartLineIndex = ctx.node.source.start.line - 1;

    // Note: In fact, since CSS code does not have a delimiter, it might be better to create a new node type. However, if we consider the characters on the left and right of the class name as a delimiter, the formatting method is the same as AttributeNode, so I have processed it as an AttributeNode type for now.
    ctx.classNameNodes.push({
      type: 'attribute',
      isTheFirstLineOnTheSameLineAsTheOpeningTag: true,
      elementName: '',
      range: [classNameNodeRangeStart, classNameNodeRangeEnd],
      startLineIndex: nodeStartLineIndex,
    });
  }
}

function handleCssCssComment(ctx: CaseHandlerContext) {
  if (
    isTypeof(ctx.node, schemas.cssCssCommentSchema) &&
    ctx.node.text.trim() === 'prettier-ignore'
  ) {
    ctx.prettierIgnoreNodes.push(ctx.currentASTNode);
  }
}

function handleAstroFrontmatter(ctx: CaseHandlerContext) {
  ctx.nonCommentNodes.push(ctx.currentASTNode);

  if (isTypeof(ctx.node, schemas.astroFrontmatterSchema)) {
    // Note: In fact, the frontmatter is not a `keywordStartingNode`, but it is considered a kind of safe list to maintain the `classNameNode`s obtained from the code inside the frontmatter.
    ctx.keywordStartingNodes.push(ctx.currentASTNode);

    const subText = ctx.node.value;
    const subOptions = {
      ...ctx.options,
      parser: 'typescript',
      customAttributes: ctx.supportedAttributes,
      customFunctions: ctx.supportedFunctions,
    };
    const typescriptAst = parseTypescript(subText, subOptions);
    const targetClassNameNodesInFrontMatter = findTargetClassNameNodesBasedOnJavaScript(
      subText,
      typescriptAst,
      subOptions,
    ).map<ClassNameNode>((classNameNode) => {
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

    ctx.classNameNodes.push(...targetClassNameNodesInFrontMatter);
  }
}

const babelCaseHandlers: CaseHandlers = {
  CallExpression: handleJavaScriptCallExpression,
  JSXAttribute: handleJavaScriptJSXAttribute,
  JSXExpressionContainer: handleJavaScriptJSXExpressionContainer,
  ConditionalExpression: handleJavaScriptConditionalExpression,
  TemplateLiteral: handleJavaScriptTemplateLiteral,
  TaggedTemplateExpression: handleJavaScriptTaggedTemplateExpression,
  LogicalExpression: handleJavaScriptLogicalExpression,
};

const typescriptCaseHandlers: CaseHandlers = {
  ...babelCaseHandlers,
  Property: handleJavaScriptObjectProperty,
  Literal: handleTypeScriptLiteral,
  Block: handleTypeScriptBlock,
  Line: handleTypeScriptBlock,
};

const cssCaseHandlers: CaseHandlers = {
  'css-atrule': handleCssCssAtrule,
  'css-comment': handleCssCssComment,
};

const parserCaseHandlers: ParserCaseHandlers = {
  babel: {
    ...babelCaseHandlers,
    ObjectProperty: handleJavaScriptObjectProperty,
    StringLiteral: handleJavaScriptStringLiteral,
    File: handleJavaScriptFile,
  },
  'babel-ts': {
    ...babelCaseHandlers,
    ObjectProperty: handleJavaScriptObjectProperty,
    StringLiteral: handleJavaScriptStringLiteral,
    File: handleJavaScriptFile,
  },
  typescript: {
    ...typescriptCaseHandlers,
  },
  oxc: {
    ...typescriptCaseHandlers,
  },
  'oxc-ts': {
    ...typescriptCaseHandlers,
  },
  svelte: {
    CallExpression: handleJavaScriptCallExpression,
    Property: handleJavaScriptObjectProperty,
    ConditionalExpression: handleJavaScriptConditionalExpression,
    TemplateLiteral: handleJavaScriptTemplateLiteral,
    TaggedTemplateExpression: handleJavaScriptTaggedTemplateExpression,
    LogicalExpression: handleJavaScriptLogicalExpression,
    Literal: handleTypeScriptLiteral,
    Block: handleTypeScriptBlock,
    Line: handleTypeScriptBlock,
    Attribute: handleSvelteAttribute,
    Comment: handleSvelteComment,
    ExpressionTag: handleSvelteMustacheTag,
    MustacheTag: handleSvelteMustacheTag,
    RefinedScript: handleSvelteRefinedScript,
    Text: handleSvelteText,
  },
  html: {
    attribute: handleHtmlAttribute,
    element: handleHtmlElement,
    comment: handleHtmlComment,
  },
  angular: {
    attribute: handleHtmlAttribute,
    element: handleAngularElement,
    comment: handleHtmlComment,
  },
  vue: {
    attribute: handleHtmlAttribute,
    element: handleAngularElement,
    comment: handleHtmlComment,
  },
  css: {
    ...cssCaseHandlers,
  },
  scss: {
    ...cssCaseHandlers,
  },
  less: {
    ...cssCaseHandlers,
  },
  astro: {
    frontmatter: handleAstroFrontmatter,
    attribute: handleAstroAttribute,
    element: handleAstroElement,
    comment: handleAstroComment,
  },
};

export function findTargetClassNameNodesBasedOnJavaScript(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): ClassNameNode[] {
  const supportedAttributes: string[] = ['class', 'className', ...options.customAttributes];
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

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, schemas.nodeTypeSchema)) {
      return;
    }

    let recursiveProps: string[] = [];

    switch (node.type) {
      case 'ArrayExpression': {
        recursiveProps = ['elements'];
        break;
      }
      case 'ArrowFunctionExpression':
      case 'BlockStatement':
      case 'FunctionDeclaration':
      case 'FunctionExpression': {
        recursiveProps = ['body'];
        break;
      }
      case 'AssignmentExpression':
      case 'LogicalExpression': {
        recursiveProps = ['right'];
        break;
      }
      case 'Attribute':
      case 'JSXAttribute': {
        recursiveProps = ['value'];
        break;
      }
      case 'AwaitBlock': {
        recursiveProps = ['pending', 'then', 'catch'];
        break;
      }
      case 'BinaryExpression': {
        recursiveProps = ['left', 'right'];
        break;
      }
      case 'CallExpression':
      case 'OptionalCallExpression': {
        recursiveProps = ['arguments'];
        break;
      }
      case 'Fragment':
      case 'JSXFragment': {
        recursiveProps = ['children', 'nodes'];
        break;
      }
      case 'CatchBlock':
      case 'ElseBlock':
      case 'KeyBlock':
      case 'PendingBlock':
      case 'SnippetBlock':
      case 'ThenBlock': {
        recursiveProps = ['children', 'body', 'fragment'];
        break;
      }
      case 'ChainExpression':
      case 'ExpressionStatement':
      case 'JSXExpressionContainer': {
        recursiveProps = ['expression'];
        break;
      }
      case 'ConditionalExpression':
      case 'IfStatement': {
        recursiveProps = ['consequent', 'alternate'];
        break;
      }
      case 'Component':
      case 'Element':
      case 'InlineComponent':
      case 'RegularElement':
      case 'SvelteComponent':
      case 'SvelteElement':
      case 'SvelteFragment': {
        recursiveProps = ['attributes', 'children', 'fragment'];
        break;
      }
      case 'ExportDefaultDeclaration':
      case 'ExportNamedDeclaration': {
        recursiveProps = ['declaration'];
        break;
      }
      case 'File': {
        recursiveProps = ['program'];
        break;
      }
      case 'EachBlock': {
        recursiveProps = ['children', 'else', 'body', 'fallback', 'context'];
        break;
      }
      case 'IfBlock': {
        recursiveProps = ['children', 'else', 'consequent', 'alternate', 'test'];
        break;
      }
      case 'JSXElement': {
        recursiveProps = ['openingElement', 'children'];
        break;
      }
      case 'JSXOpeningElement': {
        recursiveProps = ['attributes'];
        break;
      }
      case 'Literal': {
        recursiveProps = ['leadingComments'];
        break;
      }
      case 'ExpressionTag':
      case 'MustacheTag': {
        recursiveProps = ['expression'];
        break;
      }
      case 'ObjectExpression': {
        recursiveProps = ['properties'];
        break;
      }
      case 'ObjectProperty':
      case 'Property': {
        recursiveProps = ['key', 'value'];
        break;
      }
      case 'Program': {
        recursiveProps = ['body', 'comments'];
        break;
      }
      case 'ReturnStatement': {
        recursiveProps = ['argument'];
        break;
      }
      case 'Root': {
        recursiveProps = ['html', 'instance', 'module', 'fragment'];
        break;
      }
      case 'Script': {
        recursiveProps = ['content'];
        break;
      }
      case 'TaggedTemplateExpression': {
        recursiveProps = ['quasi'];
        break;
      }
      case 'TemplateLiteral': {
        recursiveProps = ['expressions', 'quasis'];
        break;
      }
      case 'VariableDeclaration': {
        recursiveProps = ['declarations'];
        break;
      }
      case 'VariableDeclarator': {
        recursiveProps = ['init'];
        break;
      }
      default: {
        break;
      }
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!recursiveProps.includes(key)) {
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

    if (isTypeof(node, schemas.nodeWithRangeSchema)) {
      const [rangeStart, rangeEnd] = node.range;

      // @ts-expect-error: Make the structure of the AST consistent.
      node.start = rangeStart;
      // @ts-expect-error: Make the structure of the AST consistent.
      node.end = rangeEnd;
    }

    if (!isTypeof(node, schemas.nodeOffsetsSchema)) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart = node.start;
    const currentNodeRangeEnd = node.end;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        supportedAttributes,
        supportedFunctions,
        nonCommentNodes,
        prettierIgnoreNodes,
        keywordStartingNodes,
        classNameNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      if (nodeType !== 'JSXText') {
        nonCommentNodes.push(currentASTNode);
      }
    }
  }

  // NOTE: The top node of the Svelte AST does not have a type property.
  if (!ast.type) {
    ast.type = 'Root';
  }
  recursion(ast);

  return filterAndSortClassNameNodes(
    nonCommentNodes,
    prettierIgnoreNodes,
    keywordStartingNodes,
    classNameNodes,
  );
}

export function findTargetClassNameNodesBasedOnHtml(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): ClassNameNode[] {
  const supportedAttributes: string[] = [
    'class',
    'className',
    ...(options.parser === 'angular' ? ['ngClass'] : []),
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

  function recursion(
    node: unknown,
    parentNode?: { kind: string; type?: undefined } | { kind?: undefined; type: string },
  ): void {
    if (!isTypeof(node, schemas.nodeKindSchema) && !isTypeof(node, schemas.nodeTypeSchema)) {
      return;
    }

    const nodeType = isTypeof(node, schemas.nodeKindSchema) ? node.kind : node.type;

    let recursiveProps: string[] = [];

    switch (nodeType) {
      case 'angularControlFlowBlock':
      case 'root': {
        recursiveProps = ['children'];
        break;
      }
      case 'element': {
        recursiveProps = ['attrs', 'children'];
        break;
      }
      default: {
        break;
      }
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!recursiveProps.includes(key)) {
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

    if (!isTypeof(node, schemas.htmlNodeSourceSchema)) {
      return;
    }

    const currentNodeRangeStart = node.sourceSpan.start.offset;
    const currentNodeRangeEnd = node.sourceSpan.end.offset;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        supportedAttributes,
        supportedFunctions,
        nonCommentNodes,
        prettierIgnoreNodes,
        keywordStartingNodes,
        classNameNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      nonCommentNodes.push(currentASTNode);
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

export function findTargetClassNameNodesBasedOnCss(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): ClassNameNode[] {
  const supportedAttributes: string[] = ['class', 'className', ...options.customAttributes];
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

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, schemas.nodeTypeSchema)) {
      return;
    }

    let recursiveProps: string[] = [];

    switch (node.type) {
      case 'css-atrule':
      case 'css-root':
      case 'css-rule': {
        recursiveProps = ['nodes'];
        break;
      }
      default: {
        break;
      }
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!recursiveProps.includes(key)) {
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

    if (!isTypeof(node, schemas.cssNodeSourceSchema)) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart = node.source.startOffset;
    const currentNodeRangeEnd = node.source.endOffset;

    const currentASTNode: ASTNode = {
      type: nodeType,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        supportedAttributes,
        supportedFunctions,
        nonCommentNodes,
        prettierIgnoreNodes,
        keywordStartingNodes,
        classNameNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      nonCommentNodes.push(currentASTNode);
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

export function findTargetClassNameNodesBasedOnAstro(
  formattedText: string,
  ast: AST,
  options: ResolvedOptions,
): ClassNameNode[] {
  const supportedAttributes: string[] = [
    'class',
    'className',
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

  function recursion(node: unknown, parentNode?: { type: string }): void {
    if (!isTypeof(node, schemas.nodeTypeSchema)) {
      return;
    }

    let recursiveProps: string[] = [];

    switch (node.type) {
      case 'component':
      case 'element': {
        recursiveProps = ['attributes', 'children'];
        break;
      }
      case 'expression':
      case 'fragment':
      case 'root': {
        recursiveProps = ['children'];
        break;
      }
      default: {
        break;
      }
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!recursiveProps.includes(key)) {
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

    if (!isTypeof(node, schemas.astroNodePositionSchema)) {
      return;
    }

    const nodeType = node.type;
    const currentNodeRangeStart =
      totalTextLengthUptoSpecificIndexLine[node.position.start.line - 1] +
      (node.position.start.column - 1);
    const currentNodeRangeEnd = node.position.end
      ? totalTextLengthUptoSpecificIndexLine[node.position.end.line - 1] +
        (node.position.end.column - 1)
      : currentNodeRangeStart +
        (node.type === 'attribute'
          ? `${node.name}=${UNKNOWN_DELIMITER}${node.value}${UNKNOWN_DELIMITER}`.length
          : `${node.value}`.length);

    const currentASTNode: ASTNode = {
      type: node.type,
      start: currentNodeRangeStart,
      end: currentNodeRangeEnd,
    };

    const handler = parserCaseHandlers[String(options.parser)]?.[nodeType];

    if (handler) {
      const context: CaseHandlerContext = {
        formattedText,
        options,
        supportedAttributes,
        supportedFunctions,
        nonCommentNodes,
        prettierIgnoreNodes,
        keywordStartingNodes,
        classNameNodes,
        node,
        parentNode,
        currentASTNode,
      };

      handler(context);
    } else {
      if (node.type !== 'text') {
        nonCommentNodes.push(currentASTNode);
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
