import { createHash } from 'node:crypto';

import type { NodeRange, ExpressionNode, ClassNameNode } from './shared';
import { EOL, PH, SPACE, TAB, SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK } from './shared';

function sha1(input: string): string {
  return createHash('sha1').update(input).digest('hex');
}

function freezeText(input: string): string {
  const charCodeForLowerCaseAlpha = 945;
  const greekPlaceholder = [...Array(16)].map((_, index) =>
    String.fromCharCode(charCodeForLowerCaseAlpha + index),
  );

  const hash = sha1(input);
  const prefix = hash
    .slice(0, Math.min(input.length, hash.length))
    .split('')
    .map((hex) => greekPlaceholder[Number.parseInt(hex, 16)])
    .join('');
  const rest = PH.repeat(Math.max(0, input.length - hash.length));

  return `${prefix}${rest}`;
}

function formatClassName(source: string, printWidth: number): string {
  const lines: string[] = [];
  let remainder = `${source}${SPACE}`.replace(/[\s]+/g, SPACE);

  while (remainder.length) {
    const chunk = remainder.slice(0, Math.max(0, printWidth) + 1);
    const lastSpaceIndexInChunk = chunk.lastIndexOf(SPACE);
    let lineCandidate = remainder.slice(0, lastSpaceIndexInChunk);

    if (lastSpaceIndexInChunk === -1) {
      const firstSpaceIndex = remainder.indexOf(SPACE);

      lineCandidate = remainder.slice(0, firstSpaceIndex);

      if (firstSpaceIndex === -1) {
        lineCandidate = remainder;
        remainder = '';
      } else {
        remainder = remainder.slice(firstSpaceIndex).trimStart();
      }
    } else {
      remainder = remainder.slice(lastSpaceIndexInChunk).trimStart();
    }

    lines.push(lineCandidate);
  }

  return lines.join(EOL);
}

type StructuredClassNameNode = ClassNameNode & {
  parent?: StructuredClassNameNode;
  children: StructuredClassNameNode[];
};

type TextToken = {
  type: string;
  range: NodeRange;
  body: string;
  frozenClassName?: string;
  children?: TextToken[];
  props?: Omit<ClassNameNode, 'type' | 'range'> & { indentLevel: number };
};

function assembleTokens(textTokens: TextToken[]): string {
  return textTokens.map((token) => token.frozenClassName ?? token.body).join('');
}

function structuringClassNameNodes(
  targetClassNameNodes: ClassNameNode[],
): StructuredClassNameNode[] {
  const sortedStructuredClassNameNodes: StructuredClassNameNode[] = targetClassNameNodes
    .map((classNameNode) => ({
      ...classNameNode,
      children: [],
    }))
    .sort((former, latter) => {
      const [rangeStartOfFormer, rangeEndOfFormer] = former.range; // [a1, a2]
      const [rangeStartOfLatter, rangeEndOfLatter] = latter.range; // [b1, b2]

      // a1 < a2 < b1 < b2
      if (rangeStartOfFormer < rangeStartOfLatter && rangeEndOfFormer < rangeEndOfLatter) {
        return -1;
      }

      // b1 < b2 < a1 < a2
      if (rangeStartOfFormer > rangeStartOfLatter && rangeEndOfFormer > rangeEndOfLatter) {
        return 1;
      }

      // a1 < b1 < b2 <= a2
      if (rangeStartOfFormer < rangeStartOfLatter && rangeEndOfFormer >= rangeEndOfLatter) {
        return -1;
      }

      // b1 < a1 < a2 <= b2
      if (rangeStartOfFormer > rangeStartOfLatter && rangeEndOfFormer <= rangeEndOfLatter) {
        return 1;
      }

      return 0;
    });

  sortedStructuredClassNameNodes.forEach((classNameNode, index) => {
    if (index === 0) {
      return;
    }

    const [rangeStartOfClassName, rangeEndOfClassName] = classNameNode.range;
    const parentNodeCandidateIndex = sortedStructuredClassNameNodes
      .slice(0, index)
      .findLastIndex((parentCandidate) => {
        const [rangeStartOfParentCandidate, rangeEndOfParentCandidate] = parentCandidate.range;

        return (
          rangeStartOfParentCandidate < rangeStartOfClassName &&
          rangeEndOfClassName <= rangeEndOfParentCandidate
        );
      });

    if (parentNodeCandidateIndex !== -1) {
      const parentNode = sortedStructuredClassNameNodes[parentNodeCandidateIndex];

      // eslint-disable-next-line no-param-reassign
      classNameNode.parent = parentNode;
      parentNode.children.push(classNameNode);
    }
  });

  return sortedStructuredClassNameNodes.filter((classNameNode) => !classNameNode.parent);
}

function linearParse(
  formattedText: string,
  indentUnit: string,
  structuredClassNameNodes: StructuredClassNameNode[],
): TextToken[] {
  const formattedLines = formattedText.split(EOL);
  const sortedStructuredClassNameNodes = structuredClassNameNodes.slice().sort((former, latter) => {
    const [rangeStartOfFormer] = former.range;
    const [rangeStartOfLatter] = latter.range;

    return rangeStartOfLatter - rangeStartOfFormer;
  });
  const textTokens: TextToken[] = [];
  let temporaryRangeEnd = formattedText.length;
  let typeOfParent: string | null = null;
  let rangeStartOfParent = 0;
  let rangeEndOfParent = formattedText.length;

  for (let nodeIndex = 0; nodeIndex < sortedStructuredClassNameNodes.length; nodeIndex += 1) {
    const structuredClassNameNode = sortedStructuredClassNameNodes[nodeIndex];
    const { type, range, parent, children, startLineIndex, ...rest } = structuredClassNameNode;
    const [rangeStartOfClassName, rangeEndOfClassName] = range;

    const indentMatchResult = formattedLines[startLineIndex].match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;

    const delimiterOffset =
      type === 'expression' &&
      structuredClassNameNode.isItAnObjectProperty &&
      structuredClassNameNode.delimiterType === 'backtick'
        ? 1
        : 0;

    if (parent) {
      typeOfParent = parent.type;
      [rangeStartOfParent, rangeEndOfParent] = parent.range;

      if (rangeEndOfParent < temporaryRangeEnd) {
        if (parent.type === 'ternary' || parent.type === 'logical') {
          textTokens.push({
            type: 'Placeholder',
            range: [rangeEndOfParent, temporaryRangeEnd],
            body: formattedText.slice(rangeEndOfParent, temporaryRangeEnd),
          });
          temporaryRangeEnd = rangeEndOfParent;
        } else {
          textTokens.push({
            type: 'Placeholder',
            range: [rangeEndOfParent - 1, temporaryRangeEnd],
            body: formattedText.slice(rangeEndOfParent - 1, temporaryRangeEnd),
          });
          temporaryRangeEnd = rangeEndOfParent - 1;
        }
      }
    }

    textTokens.push({
      type: 'Text',
      range: [rangeEndOfClassName + delimiterOffset, temporaryRangeEnd],
      body: formattedText.slice(rangeEndOfClassName + delimiterOffset, temporaryRangeEnd),
    });

    if (type === 'ternary' || type === 'logical') {
      const ternaryExpression = formattedText.slice(rangeStartOfClassName, rangeEndOfClassName);
      const ternaryToken: TextToken = {
        type,
        range: [rangeStartOfClassName, rangeEndOfClassName],
        body: ternaryExpression,
      };

      if (children.length) {
        const textTokensOfChildren = linearParse(formattedText, indentUnit, children);

        ternaryToken.children = textTokensOfChildren;
        ternaryToken.body = assembleTokens(textTokensOfChildren);
      }

      ternaryToken.props = {
        ...rest,
        startLineIndex,
        indentLevel,
      };

      if (parent) {
        const frozenClassName = freezeText(ternaryExpression);

        ternaryToken.frozenClassName = frozenClassName;
      }

      textTokens.push(ternaryToken);

      temporaryRangeEnd = rangeStartOfClassName;
    } else {
      textTokens.push({
        type: 'ClosingDelimiter',
        range: [rangeEndOfClassName - 1, rangeEndOfClassName + delimiterOffset],
        body: formattedText.slice(rangeEndOfClassName - 1, rangeEndOfClassName + delimiterOffset),
      });

      // ----------------------------------------------------------------

      const classNameWithoutDelimiter = formattedText.slice(
        rangeStartOfClassName + 1,
        rangeEndOfClassName - 1,
      );
      const classNameToken: TextToken = {
        type,
        range: [rangeStartOfClassName + 1, rangeEndOfClassName - 1],
        body: classNameWithoutDelimiter,
      };

      if (children.length) {
        const textTokensOfChildren = linearParse(formattedText, indentUnit, children);

        classNameToken.children = textTokensOfChildren;
        classNameToken.body = assembleTokens(textTokensOfChildren);
      }

      classNameToken.props = {
        ...rest,
        startLineIndex,
        indentLevel,
      };

      if (parent) {
        const frozenClassName = freezeText(classNameWithoutDelimiter.replace(/\s+/g, SPACE));

        classNameToken.frozenClassName = frozenClassName;
      }

      textTokens.push(classNameToken);

      // ----------------------------------------------------------------

      textTokens.push({
        type: 'OpeningDelimiter',
        range: [rangeStartOfClassName - delimiterOffset, rangeStartOfClassName + 1],
        body: formattedText.slice(
          rangeStartOfClassName - delimiterOffset,
          rangeStartOfClassName + 1,
        ),
      });

      temporaryRangeEnd = rangeStartOfClassName - delimiterOffset;
    }
  }

  // Note: Since parent cannot be accessed directly outside of the for loop, I check for changes that may occur when parent exists.
  if (typeOfParent) {
    if (typeOfParent === 'ternary' || typeOfParent === 'logical') {
      textTokens.push({
        type: 'Text',
        range: [rangeStartOfParent, temporaryRangeEnd],
        body: formattedText.slice(rangeStartOfParent, temporaryRangeEnd),
      });
      textTokens.push({
        type: 'Placeholder',
        range: [0, rangeStartOfParent],
        body: formattedText.slice(0, rangeStartOfParent),
      });
    } else {
      textTokens.push({
        type: 'Text',
        range: [rangeStartOfParent + 1, temporaryRangeEnd],
        body: formattedText.slice(rangeStartOfParent + 1, temporaryRangeEnd),
      });
      textTokens.push({
        type: 'Placeholder',
        range: [0, rangeStartOfParent + 1],
        body: formattedText.slice(0, rangeStartOfParent + 1),
      });
    }
  } else {
    textTokens.push({
      type: 'Text',
      range: [0, temporaryRangeEnd],
      body: formattedText.slice(0, temporaryRangeEnd),
    });
  }

  textTokens.reverse();

  return textTokens.filter((token) => token.type !== 'Placeholder');
}

function formatTokens(
  textTokens: TextToken[],
  indentUnit: string,
  options: ResolvedOptions,
): TextToken[] {
  const formattedTokens = structuredClone(textTokens);
  const isEndingPositionAbsolute = options.endingPosition !== 'relative';

  for (let tokenIndex = formattedTokens.length - 1; tokenIndex >= 0; tokenIndex -= 1) {
    const token = formattedTokens[tokenIndex];

    if (token.type === 'ternary' || token.type === 'logical') {
      if (token.children?.length) {
        token.children = formatTokens(token.children, indentUnit, options);
      }
    } else if (token.type === 'attribute') {
      const props = token.props!;
      const leadingText = isEndingPositionAbsolute
        ? assembleTokens(formattedTokens.slice(0, tokenIndex))
            .split(EOL)
            .slice(-1)
            .join('')
            .replace(/\t/g, SPACE.repeat(options.tabWidth))
        : '';
      const trailingDelimiter = isEndingPositionAbsolute
        ? formattedTokens[tokenIndex + 1].body
        : '';
      const classNameBase = `${PH.repeat(leadingText.length)}${token.body.trim()}${PH.repeat(
        trailingDelimiter.length,
      )}`;

      let formattedClassName = formatClassName(classNameBase, options.printWidth).slice(
        leadingText.length,
      );
      const formattedLines = formattedClassName.split(EOL);
      const isMultiLineClassName = formattedLines.length > 1;

      if (isMultiLineClassName) {
        const multiLineIndentLevel = props.indentLevel + 1;

        formattedClassName = [
          formattedLines[0],
          ...(isEndingPositionAbsolute
            ? formatClassName(
                formattedLines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              ).split(EOL)
            : formattedLines.slice(1)),
        ].join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);
      }
      formattedClassName = formattedClassName.slice(0, -trailingDelimiter.length || undefined);

      if (isMultiLineClassName && options.syntaxTransformation) {
        switch (options.parser) {
          case 'babel':
          case 'typescript':
          case 'astro':
          case 'svelte': {
            formattedTokens[tokenIndex - 1].body = `{${BACKTICK}`;
            formattedTokens[tokenIndex + 1].body = `${BACKTICK}}`;

            formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
            break;
          }
          case 'vue': {
            formattedTokens[tokenIndex - 2].body = formattedTokens[tokenIndex - 2].body.replace(
              /([^ :=]+=)$/,
              ':$1',
            );
            formattedTokens[tokenIndex - 1].body = `${DOUBLE_QUOTE}${BACKTICK}`;
            formattedTokens[tokenIndex + 1].body = `${BACKTICK}${DOUBLE_QUOTE}`;

            formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
            break;
          }
          default: {
            break;
          }
        }
      }

      token.body = formattedClassName;
    } else if (token.type === 'expression') {
      const props = token.props as Omit<ExpressionNode, 'range' | 'type'> & {
        indentLevel: number;
      };
      const leadingText = isEndingPositionAbsolute
        ? assembleTokens(formattedTokens.slice(0, tokenIndex))
            .split(EOL)
            .slice(-1)
            .join('')
            .replace(/\t/g, SPACE.repeat(options.tabWidth))
        : '';
      const trailingDelimiter = isEndingPositionAbsolute
        ? formattedTokens[tokenIndex + 1].body
        : '';
      const hasLeadingSpace = token.body !== token.body.trimStart();
      const hasTrailingSpace = token.body !== token.body.trimEnd();
      const classNameBase = `${PH.repeat(leadingText.length)}${
        hasLeadingSpace ? SPACE : ''
      }${token.body.trim().replace(/\\\n/g, '')}${hasTrailingSpace ? SPACE : ''}${PH.repeat(
        trailingDelimiter.length,
      )}`;

      let formattedClassName = `${formatClassName(classNameBase, options.printWidth).slice(
        leadingText.length,
      )}${!trailingDelimiter && hasTrailingSpace ? SPACE : ''}`;
      const formattedLines = formattedClassName.split(EOL);
      const isMultiLineClassName = formattedLines.length > 1;

      if (isMultiLineClassName) {
        const multiLineIndentLevel =
          props.isTheFirstLineOnTheSameLineAsTheAttributeName ||
          props.isItAnOperandOfTernaryOperator
            ? props.indentLevel + 1
            : props.indentLevel;

        formattedClassName = [
          formattedLines[0],
          ...(isEndingPositionAbsolute
            ? `${formatClassName(
                formattedLines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              )}${!trailingDelimiter && hasTrailingSpace ? SPACE : ''}`.split(EOL)
            : formattedLines.slice(1)),
        ].join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);
        formattedClassName = formattedClassName.slice(0, -trailingDelimiter.length || undefined);

        if (props.isItAngularExpression) {
          formattedTokens[tokenIndex - 1].body = SINGLE_QUOTE;
          formattedTokens[tokenIndex + 1].body = SINGLE_QUOTE;
        } else {
          const areNeededBrackets = props.isItAnObjectProperty;

          formattedTokens[tokenIndex - 1].body = `${areNeededBrackets ? '[' : ''}${BACKTICK}`;
          formattedTokens[tokenIndex + 1].body = `${BACKTICK}${areNeededBrackets ? ']' : ''}`;

          if (props.delimiterType !== 'backtick' && props.hasBacktick) {
            formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
          }
        }
      } else {
        formattedClassName = formattedClassName.slice(0, -trailingDelimiter.length || undefined);

        let baseDelimiter = DOUBLE_QUOTE;

        if (props.shouldKeepDelimiter) {
          if (props.delimiterType === 'backtick') {
            baseDelimiter = BACKTICK;
          } else if (props.delimiterType === 'single-quote') {
            baseDelimiter = SINGLE_QUOTE;
          } else {
            // baseDelimiter = DOUBLE_QUOTE;
          }
        } else if (props.isItInVueTemplate) {
          baseDelimiter = SINGLE_QUOTE;
        } else if (options.singleQuote) {
          if (props.hasSingleQuote) {
            // baseDelimiter = DOUBLE_QUOTE;
          } else {
            baseDelimiter = SINGLE_QUOTE;
          }
        } else if (!options.singleQuote) {
          if (props.hasDoubleQuote) {
            baseDelimiter = SINGLE_QUOTE;
          } else {
            // baseDelimiter = DOUBLE_QUOTE;
          }
        }

        if (props.isItAngularExpression) {
          baseDelimiter = SINGLE_QUOTE;
        }

        const areNeededBrackets = props.isItAnObjectProperty && baseDelimiter === BACKTICK;

        formattedTokens[tokenIndex - 1].body = `${areNeededBrackets ? '[' : ''}${baseDelimiter}`;
        formattedTokens[tokenIndex + 1].body = `${baseDelimiter}${areNeededBrackets ? ']' : ''}`;

        if (baseDelimiter === SINGLE_QUOTE) {
          if (props.delimiterType !== 'single-quote' && props.hasSingleQuote) {
            formattedClassName = formattedClassName.replace(/'/g, `\\${SINGLE_QUOTE}`);
          }
        } else if (baseDelimiter === DOUBLE_QUOTE) {
          if (props.delimiterType !== 'double-quote' && props.hasDoubleQuote) {
            formattedClassName = formattedClassName.replace(/"/g, `\\${DOUBLE_QUOTE}`);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (props.delimiterType !== 'backtick' && props.hasBacktick) {
            formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
          }
        }
      }

      if (token.children?.length) {
        token.children = formatTokens(token.children, indentUnit, options);
      }

      token.body = formattedClassName;
    }
  }

  return formattedTokens;
}

function unfreezeToken(token: TextToken, options: ResolvedOptions): string {
  if (token.children?.length) {
    for (let index = token.children.length - 1; index >= 0; index -= 1) {
      const tokenOfChildren = token.children[index];

      if (tokenOfChildren.frozenClassName !== undefined) {
        if (tokenOfChildren.type === 'ternary' || tokenOfChildren.type === 'logical') {
          const plainText = unfreezeToken(tokenOfChildren, options);
          let replaceTarget: string | RegExp = tokenOfChildren.frozenClassName;
          let replaceValue = plainText;

          const isNestedExpressionOpenedOnThePreviousLine =
            token.body.match(
              new RegExp(`\\$\\{${EOL}[${SPACE}${TAB}]*${tokenOfChildren.frozenClassName}`),
            ) !== null;
          const isNestedExpressionClosedOnTheNextLine =
            token.body.match(
              new RegExp(`${tokenOfChildren.frozenClassName}${EOL}[${SPACE}${TAB}]*\\}`),
            ) !== null;
          const isMultiLineBody =
            isNestedExpressionOpenedOnThePreviousLine || isNestedExpressionClosedOnTheNextLine;

          if (isMultiLineBody) {
            replaceTarget = new RegExp(
              `[${SPACE}${TAB}]*${tokenOfChildren.frozenClassName}${
                isNestedExpressionClosedOnTheNextLine ? '' : `[${SPACE}${TAB}]*`
              }`,
            );
            replaceValue = `${isNestedExpressionOpenedOnThePreviousLine ? '' : EOL}${
              token.children[index - 1].body.match(new RegExp(`[${SPACE}${TAB}]*$`))![0]
            }${plainText}${
              // eslint-disable-next-line no-nested-ternary
              isNestedExpressionClosedOnTheNextLine
                ? ''
                : token.children[index + 1].body.match(new RegExp(`^${EOL}[${SPACE}${TAB}]*`))![0]
            }`;
          }

          // eslint-disable-next-line no-param-reassign
          token.body = token.body.replace(replaceTarget, replaceValue);
        } else if (tokenOfChildren.type === 'expression') {
          const props = tokenOfChildren.props as Omit<ExpressionNode, 'range' | 'type'> & {
            indentLevel: number;
          };
          const originalDelimiter =
            // eslint-disable-next-line no-nested-ternary
            props.delimiterType === 'single-quote'
              ? SINGLE_QUOTE
              : props.delimiterType === 'double-quote'
                ? DOUBLE_QUOTE
                : BACKTICK;

          // eslint-disable-next-line no-param-reassign
          token.body = token.body.replace(
            `${originalDelimiter}${tokenOfChildren.frozenClassName}${originalDelimiter}`,
            `${token.children[index - 1].body}${unfreezeToken(tokenOfChildren, options)}${
              token.children[index + 1].body
            }`,
          );
        }
      }
    }
  }

  return token.body;
}

export function parseAndAssemble(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
  options: ResolvedOptions,
): string {
  const structuredClassNameNodes = structuringClassNameNodes(targetClassNameNodes);

  const textTokens = linearParse(formattedText, indentUnit, structuredClassNameNodes);

  const formattedTokens = formatTokens(textTokens, indentUnit, options);

  return formattedTokens.map((token) => unfreezeToken(token, options)).join('');
}
