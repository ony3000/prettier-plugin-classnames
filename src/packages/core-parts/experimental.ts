import type { ClassNameNode } from './shared';
import { EOL, SPACE } from './shared';

type LinePart = {
  type: string;
  body: string;
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
        const [rangeStartOfClassName, rangeEndOfClassName] = classNameNode.range;

        parts.push({
          type: 'Text',
          body: formattedText.slice(rangeEndOfClassName, temporaryRangeEnd),
        });
        parts.push({
          type: 'ClosingDelimiter',
          body: formattedText.slice(rangeEndOfClassName - 1, rangeEndOfClassName),
        });

        const classNameLiteralOrExpression = formattedText.slice(
          rangeStartOfClassName + 1,
          rangeEndOfClassName - 1,
        );
        parts.push({
          type: classNameNode.type,
          body: classNameLiteralOrExpression,
        });
        numberOfLinesToSkip += classNameLiteralOrExpression.split(EOL).length - 1;

        parts.push({
          type: 'OpeningDelimiter',
          body: formattedText.slice(rangeStartOfClassName, rangeStartOfClassName + 1),
        });

        temporaryRangeEnd = rangeStartOfClassName;
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

function formatClassName(source: string, options: ResolvedOptions): string {
  const lines: string[] = [];
  let remainder = `${source}${SPACE}`.replace(/[\s]+/g, SPACE);

  while (remainder.length) {
    const chunk = remainder.slice(0, options.printWidth + 1);
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

  if (options.debugFlag) {
    // eslint-disable-next-line no-console
    console.dir(lines, inspectOptions);
  }

  return lines.join(EOL);
}

function transformClassNameIfNecessary(lineNodes: LineNode[], options: ResolvedOptions): void {
  for (let lineIndex = lineNodes.length - 1; lineIndex >= 0; lineIndex -= 1) {
    const { indentLevel, parts } = lineNodes[lineIndex];
    const temporaryLineNodes: LineNode[] = [];

    let temporaryPartIndex = parts.length;

    for (let partIndex = parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const currentPart = parts[partIndex];

      if (currentPart.type === 'attribute') {
        const slicedLineNodes: LineNode[] = [];
        const classNameBase = currentPart.body.trim();
        const formattedClassName = formatClassName(classNameBase, options);
        if (options.debugFlag) {
          // eslint-disable-next-line no-console
          console.dir(formattedClassName, inspectOptions);
        }
        const isMultiLineClassName = formattedClassName.split(EOL).length > 1;

        if (isMultiLineClassName) {
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
            // eslint-disable-next-line no-param-reassign
            lineNode.indentLevel += 1;
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
