import { createHash } from 'node:crypto';

import type {
  Dict,
  NodeRange,
  ExpressionNode,
  TernaryExpressionNode,
  ClassNameNode,
} from './shared';
import { EOL, PH, SPACE, SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK } from './shared';

type LinePart = {
  type: string;
  body: string;
  props?: Omit<ClassNameNode, 'type' | 'range' | 'startLineIndex'>;
};

type LineNode = {
  indentLevel: number;
  parts: LinePart[];
};

const inspectOptions: any = { depth: null };

function sha1(input: string): string {
  return createHash('sha1').update(input).digest('hex');
}

function freezeClassName(input: string): string {
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

function parseLineByLineFromBottomToTop(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
): LineNode[] {
  const formattedLines = formattedText.split(EOL);
  let rangeStartOfLine: number;
  let rangeEndOfLine = formattedText.length;
  const rangePerLine: Dict<NodeRange> = {};

  const parsedLineNodes: LineNode[] = [];

  for (
    let currentLineIndex = formattedLines.length - 1;
    currentLineIndex >= 0;
    currentLineIndex -= 1
  ) {
    const line = formattedLines[currentLineIndex];

    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;
    const indentOffset = indentUnit.length * indentLevel;
    const parts: LinePart[] = [];

    rangeStartOfLine = rangeEndOfLine - line.length;
    rangePerLine[currentLineIndex] = [rangeStartOfLine, rangeEndOfLine];

    const classNameNodesStartingFromCurrentLine = targetClassNameNodes.filter(
      ({ startLineIndex }) => startLineIndex === currentLineIndex,
    );

    let rangeEndOfPart = rangeEndOfLine;

    for (
      let nodeIndex = 0;
      nodeIndex < classNameNodesStartingFromCurrentLine.length;
      nodeIndex += 1
    ) {
      const classNameNode = classNameNodesStartingFromCurrentLine[nodeIndex];
      const {
        range,
        startLineIndex, // not in use
        ...restWithType
      } = classNameNode;
      const { type, ...restWithoutType } = restWithType;
      const [rangeStartOfClassName, rangeEndOfClassName] = range;

      const classNameWithoutDelimiter = formattedText.slice(
        rangeStartOfClassName + 1,
        rangeEndOfClassName - 1,
      );
      const numberOfLinesOfClassName = classNameWithoutDelimiter.split(EOL).length;
      const numberOfLinesToSkip = numberOfLinesOfClassName - 1;
      const rangeOfLineWhereClassNameEnds = rangePerLine[currentLineIndex + numberOfLinesToSkip];

      if (rangeOfLineWhereClassNameEnds) {
        const [, rangeEndOfLineWhereClassNameEnds] = rangeOfLineWhereClassNameEnds;

        const delimiterOffset =
          restWithType.type === 'expression' &&
          restWithType.isItAnObjectProperty &&
          restWithType.delimiterType === 'backtick'
            ? 1
            : 0;

        parts.push({
          type: 'Text',
          body: formattedText.slice(
            rangeEndOfClassName + delimiterOffset,
            rangeEndOfClassName + delimiterOffset < rangeEndOfLineWhereClassNameEnds
              ? rangeEndOfLineWhereClassNameEnds
              : rangeEndOfPart,
          ),
        });
        parts.push({
          type: 'ClosingDelimiter',
          body: formattedText.slice(rangeEndOfClassName - 1, rangeEndOfClassName + delimiterOffset),
        });
        parts.push({
          type,
          body: classNameWithoutDelimiter,
          props: restWithoutType,
        });
        parts.push({
          type: 'OpeningDelimiter',
          body: formattedText.slice(
            rangeStartOfClassName - delimiterOffset,
            rangeStartOfClassName + 1,
          ),
        });

        rangeEndOfPart = rangeStartOfClassName - delimiterOffset;
      }

      if (numberOfLinesToSkip) {
        parsedLineNodes.splice(parsedLineNodes.length - numberOfLinesToSkip, numberOfLinesToSkip);
      }
    }

    parts.push({
      type: 'Text',
      body: formattedText.slice(rangeStartOfLine, rangeEndOfPart).slice(indentOffset),
    });
    parts.reverse();

    if (parts.length > 1 && parts[0].body === '') {
      parts.shift();
    }
    if (parts.length > 1 && parts[parts.length - 1].body === '') {
      parts.pop();
    }

    parsedLineNodes.push({
      indentLevel,
      parts,
    });

    rangeEndOfLine = rangeStartOfLine - EOL.length;
  }

  parsedLineNodes.reverse();

  return parsedLineNodes;
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

function transformClassNameIfNecessary(lineNodes: LineNode[], options: ResolvedOptions): void {
  const isStartingPositionRelative = options.endingPosition !== 'absolute';
  const isEndingPositionAbsolute = options.endingPosition !== 'relative';
  const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

  for (let lineIndex = lineNodes.length - 1; lineIndex >= 0; lineIndex -= 1) {
    const { indentLevel, parts } = lineNodes[lineIndex];
    const temporaryLineNodes: LineNode[] = [];

    let temporaryPartIndex = parts.length;

    for (let partIndex = parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const currentPart = parts[partIndex];

      if (currentPart.type === 'attribute') {
        const slicedLineNodes: LineNode[] = [];
        const leadingText = isEndingPositionAbsolute
          ? `${SPACE.repeat(options.tabWidth * indentLevel)}${parts
              .slice(0, partIndex)
              .map(({ body }) => body)
              .join('')}`
          : '';
        const classNameBase = `${PH.repeat(leadingText.length)}${currentPart.body.trim()}`;

        let formattedClassName = formatClassName(classNameBase, options.printWidth).slice(
          leadingText.length,
        );
        if (options.debugFlag) {
          // eslint-disable-next-line no-console
          console.dir(formattedClassName, inspectOptions);
        }
        const lines = formattedClassName.split(EOL);
        const isMultiLineClassName = lines.length > 1;

        if (isMultiLineClassName) {
          if (isOutputIdeal) {
            const multiLineIndentLevel = indentLevel + 1;

            formattedClassName = [
              lines[0],
              formatClassName(
                lines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              ),
            ].join(EOL);
          }

          slicedLineNodes.push(
            ...formattedClassName.split(EOL).map((line) => ({
              indentLevel,
              parts: [
                {
                  type: 'Text',
                  body: line,
                },
              ],
            })),
          );

          slicedLineNodes[slicedLineNodes.length - 1].parts.push(
            ...parts.splice(partIndex + 1, parts.length - (partIndex + 1)),
          );

          parts.splice(partIndex, 1, ...slicedLineNodes.splice(0, 1)[0].parts);

          slicedLineNodes.forEach((lineNode) => {
            if (isStartingPositionRelative) {
              // eslint-disable-next-line no-param-reassign
              lineNode.indentLevel += 1;
            } else {
              // eslint-disable-next-line no-param-reassign
              lineNode.indentLevel = 0;
            }
          });

          slicedLineNodes.reverse();

          temporaryLineNodes.push(...slicedLineNodes);
          temporaryPartIndex = partIndex + 1;
        } else {
          currentPart.type = 'Text';
          currentPart.body = formattedClassName;
        }
      } else if (currentPart.type === 'expression') {
        const props = currentPart.props as Omit<
          ExpressionNode,
          'type' | 'range' | 'startLineIndex'
        >;

        const slicedLineNodes: LineNode[] = [];
        const leadingText = isEndingPositionAbsolute
          ? `${SPACE.repeat(options.tabWidth * indentLevel)}${parts
              .slice(0, partIndex)
              .map(({ body }) => body)
              .join('')}`
          : '';
        const hasLeadingSpace = currentPart.body !== currentPart.body.trimStart();
        const hasTrailingSpace = currentPart.body !== currentPart.body.trimEnd();
        const classNameBase = `${PH.repeat(leadingText.length)}${
          hasLeadingSpace ? SPACE : ''
        }${currentPart.body.trim().replace(/\\\n/g, '')}`;

        let formattedClassName = `${formatClassName(classNameBase, options.printWidth).slice(
          leadingText.length,
        )}${hasTrailingSpace ? SPACE : ''}`;
        if (options.debugFlag) {
          // eslint-disable-next-line no-console
          console.dir(formattedClassName, inspectOptions);
        }
        const lines = formattedClassName.split(EOL);
        const isMultiLineClassName = lines.length > 1;

        if (isMultiLineClassName) {
          if (isOutputIdeal) {
            const multiLineIndentLevel =
              props.isTheFirstLineOnTheSameLineAsTheAttributeName ||
              props.isItAnOperandOfTernaryOperator
                ? indentLevel + 1
                : indentLevel;

            formattedClassName = [
              lines[0],
              `${formatClassName(
                lines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              )}${hasTrailingSpace ? SPACE : ''}`,
            ].join(EOL);
          }

          if (props.delimiterType !== 'backtick' && props.hasBacktick) {
            formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
          }

          slicedLineNodes.push(
            ...formattedClassName.split(EOL).map((line) => ({
              indentLevel,
              parts: [
                {
                  type: 'Text',
                  body: line,
                },
              ],
            })),
          );

          const areNeededBrackets = props.isItAnObjectProperty;

          parts[partIndex - 1].body = `${areNeededBrackets ? '[' : ''}${BACKTICK}`;
          parts[partIndex + 1].body = `${BACKTICK}${areNeededBrackets ? ']' : ''}`;

          slicedLineNodes[slicedLineNodes.length - 1].parts.push(
            ...parts.splice(partIndex + 1, parts.length - (partIndex + 1)),
          );

          parts.splice(partIndex, 1, ...slicedLineNodes.splice(0, 1)[0].parts);

          slicedLineNodes.forEach((lineNode) => {
            if (isStartingPositionRelative) {
              if (
                props.isTheFirstLineOnTheSameLineAsTheAttributeName ||
                props.isItAnOperandOfTernaryOperator
              ) {
                // eslint-disable-next-line no-param-reassign
                lineNode.indentLevel += 1;
              }
            } else {
              // eslint-disable-next-line no-param-reassign
              lineNode.indentLevel = 0;
            }
          });

          slicedLineNodes.reverse();

          temporaryLineNodes.push(...slicedLineNodes);
          temporaryPartIndex = partIndex + 1;
        } else {
          currentPart.type = 'Text';
          currentPart.body = formattedClassName;

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

          parts[partIndex - 1].body = baseDelimiter;
          parts[partIndex + 1].body = baseDelimiter;

          if (baseDelimiter === SINGLE_QUOTE) {
            if (props.delimiterType !== 'single-quote' && props.hasSingleQuote) {
              currentPart.body = formattedClassName.replace(/'/g, `\\${SINGLE_QUOTE}`);
            }
          } else if (baseDelimiter === DOUBLE_QUOTE) {
            if (props.delimiterType !== 'double-quote' && props.hasDoubleQuote) {
              currentPart.body = formattedClassName.replace(/"/g, `\\${DOUBLE_QUOTE}`);
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (props.delimiterType !== 'backtick' && props.hasBacktick) {
              currentPart.body = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
            }
          }
        }
      }
    }

    temporaryLineNodes.push({
      indentLevel,
      parts: parts.slice(0, temporaryPartIndex),
    });
    temporaryLineNodes.reverse();

    lineNodes.splice(
      lineIndex,
      1,
      ...temporaryLineNodes.filter((lineNode) => lineNode.parts.length),
    );
  }
}

function assembleLine(lineNodes: LineNode[], indentUnit: string): string {
  return lineNodes
    .map(
      ({ indentLevel, parts }) =>
        `${indentUnit.repeat(indentLevel)}${parts.map(({ body }) => body).join('')}`,
    )
    .join(EOL);
}

/**
 * Parse and assemble like `prettier-plugin-brace-style`
 *
 * @deprecated
 */
export function parseAndAssembleLikePpbs(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
  options: ResolvedOptions,
): string {
  if (options.debugFlag) {
    // eslint-disable-next-line no-console
    console.dir(formattedText, inspectOptions);
    // eslint-disable-next-line no-console
    console.dir(targetClassNameNodes, inspectOptions);
  }

  const lineNodes = parseLineByLineFromBottomToTop(
    formattedText,
    indentUnit,
    targetClassNameNodes.filter(({ type }) => type !== 'ternary'),
  );

  if (options.debugFlag) {
    // eslint-disable-next-line no-console
    console.dir(lineNodes, inspectOptions);
  }

  transformClassNameIfNecessary(lineNodes, options);

  if (options.debugFlag) {
    // eslint-disable-next-line no-console
    console.dir(lineNodes, inspectOptions);
  }

  return assembleLine(lineNodes, indentUnit);
}

// ----------------------------------------------------------------

type NonTernaryNode = Exclude<ClassNameNode, TernaryExpressionNode>;

type StructuredClassNameNode = NonTernaryNode & {
  parent?: StructuredClassNameNode;
  children: StructuredClassNameNode[];
};

type TextToken = {
  type: string;
  range: NodeRange;
  body: string;
  frozenClassName?: string;
  children?: TextToken[];
  props?: Omit<NonTernaryNode, 'type' | 'range'> & { indentLevel: number };
};

function assembleTokens(textTokens: TextToken[]): string {
  return textTokens
    .map((token) =>
      token.type === 'expression' ? token.frozenClassName ?? token.body : token.body,
    )
    .join('');
}

function structuringClassNameNodes(
  targetClassNameNodes: NonTernaryNode[],
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

      // a1 < b1 < b2 < a2
      if (rangeStartOfFormer < rangeStartOfLatter && rangeEndOfFormer > rangeEndOfLatter) {
        return -1;
      }

      // b1 < a1 < a2 < b2
      if (rangeStartOfFormer > rangeStartOfLatter && rangeEndOfFormer < rangeEndOfLatter) {
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
          rangeEndOfClassName < rangeEndOfParentCandidate
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
      [rangeStartOfParent, rangeEndOfParent] = parent.range;

      if (rangeEndOfParent < temporaryRangeEnd) {
        textTokens.push({
          type: 'Placeholder',
          range: [rangeEndOfParent - 1, temporaryRangeEnd],
          body: formattedText.slice(rangeEndOfParent - 1, temporaryRangeEnd),
        });
        temporaryRangeEnd = rangeEndOfParent - 1;
      }
    }

    textTokens.push({
      type: 'Text',
      range: [rangeEndOfClassName + delimiterOffset, temporaryRangeEnd],
      body: formattedText.slice(rangeEndOfClassName + delimiterOffset, temporaryRangeEnd),
    });
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
      const frozenClassName = freezeClassName(classNameWithoutDelimiter);

      classNameToken.frozenClassName = frozenClassName;
    }

    textTokens.push(classNameToken);

    // ----------------------------------------------------------------

    textTokens.push({
      type: 'OpeningDelimiter',
      range: [rangeStartOfClassName - delimiterOffset, rangeStartOfClassName + 1],
      body: formattedText.slice(rangeStartOfClassName - delimiterOffset, rangeStartOfClassName + 1),
    });

    temporaryRangeEnd = rangeStartOfClassName - delimiterOffset;
  }

  if (rangeStartOfParent) {
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
  const isStartingPositionRelative = options.endingPosition !== 'absolute';
  const isEndingPositionAbsolute = options.endingPosition !== 'relative';
  const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

  for (let tokenIndex = formattedTokens.length - 1; tokenIndex >= 0; tokenIndex -= 1) {
    const token = formattedTokens[tokenIndex];

    if (token.type === 'attribute') {
      const props = token.props!;
      const leadingText = isEndingPositionAbsolute
        ? assembleTokens(formattedTokens.slice(0, tokenIndex)).split(EOL).slice(-1).join('')
        : '';
      const classNameBase = `${PH.repeat(leadingText.length)}${token.body.trim()}`;

      let formattedClassName = formatClassName(classNameBase, options.printWidth).slice(
        leadingText.length,
      );
      const formattedLines = formattedClassName.split(EOL);
      const isMultiLineClassName = formattedLines.length > 1;

      if (isMultiLineClassName) {
        const multiLineIndentLevel = isStartingPositionRelative ? props.indentLevel + 1 : 0;

        formattedClassName = [
          formattedLines[0],
          ...(isOutputIdeal
            ? formatClassName(
                formattedLines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              ).split(EOL)
            : formattedLines.slice(1)),
        ].join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);
      }

      token.body = formattedClassName;
    } else if (token.type === 'expression') {
      const props = token.props as Omit<ExpressionNode, 'range' | 'type'> & {
        indentLevel: number;
      };
      const leadingText = isEndingPositionAbsolute
        ? assembleTokens(formattedTokens.slice(0, tokenIndex)).split(EOL).slice(-1).join('')
        : '';
      const hasLeadingSpace = token.body !== token.body.trimStart();
      const hasTrailingSpace = token.body !== token.body.trimEnd();
      const classNameBase = `${PH.repeat(leadingText.length)}${
        hasLeadingSpace ? SPACE : ''
      }${token.body.trim().replace(/\\\n/g, '')}`;

      let formattedClassName = `${formatClassName(classNameBase, options.printWidth).slice(
        leadingText.length,
      )}${hasTrailingSpace ? SPACE : ''}`;
      const formattedLines = formattedClassName.split(EOL);
      const isMultiLineClassName = formattedLines.length > 1;

      if (isMultiLineClassName) {
        // eslint-disable-next-line no-nested-ternary
        const multiLineIndentLevel = isStartingPositionRelative
          ? props.isTheFirstLineOnTheSameLineAsTheAttributeName ||
            props.isItAnOperandOfTernaryOperator
            ? props.indentLevel + 1
            : props.indentLevel
          : 0;

        formattedClassName = [
          formattedLines[0],
          ...(isOutputIdeal
            ? `${formatClassName(
                formattedLines.slice(1).join(EOL),
                options.printWidth - options.tabWidth * multiLineIndentLevel,
              )}${hasTrailingSpace ? SPACE : ''}`.split(EOL)
            : formattedLines.slice(1)),
        ].join(`${EOL}${indentUnit.repeat(multiLineIndentLevel)}`);

        const areNeededBrackets = props.isItAnObjectProperty;

        formattedTokens[tokenIndex - 1].body = `${areNeededBrackets ? '[' : ''}${BACKTICK}`;
        formattedTokens[tokenIndex + 1].body = `${BACKTICK}${areNeededBrackets ? ']' : ''}`;

        if (props.delimiterType !== 'backtick' && props.hasBacktick) {
          formattedClassName = formattedClassName.replace(/`/g, `\\${BACKTICK}`);
        }
      } else {
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

        formattedTokens[tokenIndex - 1].body = baseDelimiter;
        formattedTokens[tokenIndex + 1].body = baseDelimiter;

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

function unfreezeToken(token: TextToken): string {
  if (token.children?.length) {
    for (let index = token.children.length - 1; index >= 0; index -= 1) {
      const tokenOfChildren = token.children[index];

      if (tokenOfChildren.type === 'expression' && tokenOfChildren.frozenClassName) {
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
          `${token.children[index - 1].body}${unfreezeToken(tokenOfChildren)}${
            token.children[index + 1].body
          }`,
        );
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
  if (options.debugFlag) {
    console.dir(formattedText, inspectOptions);
    console.dir(targetClassNameNodes, inspectOptions);
  }

  const structuredClassNameNodes = structuringClassNameNodes(
    targetClassNameNodes.filter(({ type }) => type !== 'ternary') as NonTernaryNode[],
  );

  if (options.debugFlag) {
    console.dir(structuredClassNameNodes, inspectOptions);
  }

  const textTokens = linearParse(formattedText, indentUnit, structuredClassNameNodes);

  if (options.debugFlag) {
    console.dir(textTokens, inspectOptions);
  }

  const formattedTokens = formatTokens(textTokens, indentUnit, options);

  if (options.debugFlag) {
    console.dir(formattedTokens, inspectOptions);
  }

  return formattedTokens.map(unfreezeToken).join('');
}
