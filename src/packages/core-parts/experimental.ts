import type { ExpressionNode, ClassNameNode } from './shared';
import { EOL, PH, SPACE, BACKTICK } from './shared';

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

function parseLineByLine(
  formattedText: string,
  indentUnit: string,
  targetClassNameNodes: ClassNameNode[],
): LineNode[] {
  const formattedLines = formattedText.split(EOL);
  let rangeStartOfLine = 0;
  let rangeEndOfLine: number;

  const parsedLineNodes: LineNode[] = [];
  let numberOfLinesToSkip = 0;

  for (let currentLineIndex = 0; currentLineIndex < formattedLines.length; currentLineIndex += 1) {
    const line = formattedLines[currentLineIndex];

    const indentMatchResult = line.match(new RegExp(`^(${indentUnit})*`));
    const indentLevel = indentMatchResult![0].length / indentUnit.length;
    const offset = indentUnit.length * indentLevel;
    const parts: LinePart[] = [];

    rangeEndOfLine = rangeStartOfLine + line.length;

    if (numberOfLinesToSkip > 0) {
      // nothing to do
      numberOfLinesToSkip -= 1;
    } else {
      const classNameNodesStartingFromCurrentLine = targetClassNameNodes.filter(
        ({ startLineIndex }) => startLineIndex === currentLineIndex,
      );

      let temporaryRangeEnd = rangeEndOfLine;

      for (let index = 0; index < classNameNodesStartingFromCurrentLine.length; index += 1) {
        const classNameNode = classNameNodesStartingFromCurrentLine[index];
        const {
          range,
          startLineIndex, // not in use
          ...restWithType
        } = classNameNode;
        const { type, ...restWithoutType } = restWithType;
        const [rangeStartOfClassName, rangeEndOfClassName] = range;

        const classNameLiteralOrExpression = formattedText.slice(
          rangeStartOfClassName + 1,
          rangeEndOfClassName - 1,
        );
        const numberOfLinesOfClassName = classNameLiteralOrExpression.split(EOL).length;
        const rangeEndOfLineWhereClassNameEnds = formattedLines
          .slice(0, currentLineIndex + numberOfLinesOfClassName)
          .reduce(
            (totalTextLength, text, textIndex) =>
              totalTextLength + (textIndex > 0 ? EOL.length : 0) + text.length,
            0,
          );

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
              : temporaryRangeEnd,
          ),
        });
        parts.push({
          type: 'ClosingDelimiter',
          body: formattedText.slice(rangeEndOfClassName - 1, rangeEndOfClassName + delimiterOffset),
        });

        parts.push({
          type,
          body: classNameLiteralOrExpression,
          props: restWithoutType,
        });
        numberOfLinesToSkip += numberOfLinesOfClassName - 1;

        parts.push({
          type: 'OpeningDelimiter',
          body: formattedText.slice(
            rangeStartOfClassName - delimiterOffset,
            rangeStartOfClassName + 1,
          ),
        });

        temporaryRangeEnd = rangeStartOfClassName - delimiterOffset;
      }
      parts.push({
        type: 'Text',
        body: formattedText.slice(rangeStartOfLine, temporaryRangeEnd).slice(offset),
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
    }

    rangeStartOfLine = rangeEndOfLine + EOL.length;
  }

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
          const props = currentPart.props as Omit<
            ExpressionNode,
            'type' | 'range' | 'startLineIndex'
          >;

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

          const areNeededBrackets = isMultiLineClassName && props.isItAnObjectProperty;

          parts[partIndex - 1].body = `${areNeededBrackets ? '[' : ''}${BACKTICK}`;
          parts[partIndex + 1].body = `${BACKTICK}${areNeededBrackets ? ']' : ''}`;

          slicedLineNodes[slicedLineNodes.length - 1].parts.push(
            ...parts.splice(partIndex + 1, parts.length - (partIndex + 1)),
          );

          parts.splice(partIndex, 1, ...slicedLineNodes.splice(0, 1)[0].parts);

          slicedLineNodes.forEach((lineNode) => {
            if (isStartingPositionRelative) {
              if (props.isTheFirstLineOnTheSameLineAsTheAttributeName) {
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

  const lineNodes = parseLineByLine(formattedText, indentUnit, targetClassNameNodes);

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