import { createHash } from 'node:crypto';
import { z } from 'zod';

import { parseAndAssemble } from './experimental';
import {
  findTargetClassNameNodes,
  findTargetClassNameNodesForHtml,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAngular,
  findTargetClassNameNodesForAstro,
  findTargetClassNameNodesForSvelte,
} from './finder';
import type { Dict, ClassNameNode } from './shared';
import { EOL, PH, SPACE, TAB, SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK, isTypeof } from './shared';

type LineNode = {
  indentLevel: number;
};

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

function getExtraIndentLevel(node: ClassNameNode) {
  if (node.type === 'attribute') {
    return 1;
  }

  if (
    node.type === 'expression' &&
    (node.isTheFirstLineOnTheSameLineAsTheAttributeName || node.isItAnOperandOfTernaryOperator)
  ) {
    return 1;
  }

  return 0;
}

function getDelimiters(
  node: ClassNameNode,
  isMultiLineClassName: boolean,
  singleQuote: boolean,
): [string, string] {
  let baseDelimiter = DOUBLE_QUOTE;

  if (node.type === 'expression') {
    if (node.shouldKeepDelimiter) {
      if (node.delimiterType === 'backtick') {
        baseDelimiter = BACKTICK;
      } else if (node.delimiterType === 'single-quote') {
        baseDelimiter = SINGLE_QUOTE;
      } else {
        // baseDelimiter = DOUBLE_QUOTE;
      }
    } else if (node.isItInVueTemplate) {
      baseDelimiter = SINGLE_QUOTE;
    } else if (singleQuote) {
      if (node.hasSingleQuote) {
        // baseDelimiter = DOUBLE_QUOTE;
      } else {
        baseDelimiter = SINGLE_QUOTE;
      }
    } else if (!singleQuote) {
      if (node.hasDoubleQuote) {
        baseDelimiter = SINGLE_QUOTE;
      } else {
        // baseDelimiter = DOUBLE_QUOTE;
      }
    }
  }

  if (node.type === 'expression' && node.isItAngularExpression) {
    return [SINGLE_QUOTE, SINGLE_QUOTE];
  }

  let opener = baseDelimiter;
  let closer = baseDelimiter;

  if (isMultiLineClassName) {
    const areNeededBrackets =
      node.type === 'expression' && node.delimiterType !== 'backtick' && node.isItAnObjectProperty;

    opener = `${areNeededBrackets ? '[' : ''}${
      node.type === 'attribute' ? baseDelimiter : BACKTICK
    }`;
    closer = `${node.type === 'attribute' ? baseDelimiter : BACKTICK}${
      areNeededBrackets ? ']' : ''
    }`;
  } else {
    const areNeededBrackets =
      node.type === 'expression' && node.isItAnObjectProperty && baseDelimiter === BACKTICK;

    opener = `${areNeededBrackets ? '[' : ''}${baseDelimiter}`;
    closer = `${baseDelimiter}${areNeededBrackets ? ']' : ''}`;
  }

  return [opener, closer];
}

function replaceSpacesAtBothEnds(className: string): [string, string, string] {
  const matchArray = className.match(/^(\s*)[^\s](?:[\s\w\W]*[^\s])?(\s*)$/);
  const leadingSpace = matchArray?.[1] ?? '';
  const trailingSpace = matchArray?.[2] ?? '';

  const replacedClassName = `${PH.repeat(leadingSpace.length)}${className.slice(
    leadingSpace.length,
    -trailingSpace.length || undefined,
  )}${PH.repeat(trailingSpace.length)}`;

  return [leadingSpace, replacedClassName, trailingSpace];
}

function sha1(input: string): string {
  return createHash('sha1').update(input).digest('hex');
}

function freezeNonClassName(input: string): string {
  const charCodeForUpperCaseAlpha = 913;
  const greekPlaceholder = [...Array(16)].map((_, index) =>
    String.fromCharCode(charCodeForUpperCaseAlpha + index),
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

function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

function replaceClassName({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: ResolvedOptions;
  format: (source: string, options?: any) => string;
}): string {
  const freezer: { from: string[]; to: string[] }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = targetClassNameNodes.reduce(
    (formattedPrevText, classNameNode, classNameNodeIndex) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      const correctedRangeEnd = classNameNodeRangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[classNameNode.startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(classNameNode);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      if (classNameNode.type === 'ternary') {
        const ternaryExpression = formattedPrevText.slice(
          classNameNodeRangeStart,
          correctedRangeEnd,
        );
        const frozenTernaryExpression = freezeNonClassName(ternaryExpression);

        freezer.push({
          from: [frozenTernaryExpression],
          to: [ternaryExpression],
        });

        const ternarySubstitutedText = `${formattedPrevText.slice(
          0,
          classNameNodeRangeStart,
        )}${frozenTernaryExpression}${formattedPrevText.slice(correctedRangeEnd)}`;

        rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
          if (rangeCorrectionIndex <= classNameNodeIndex) {
            return;
          }

          const [nthNodeRangeStart, nthNodeRangeEnd] =
            targetClassNameNodes[rangeCorrectionIndex].range;

          if (
            nthNodeRangeStart < classNameNodeRangeStart &&
            classNameNodeRangeEnd < nthNodeRangeEnd
          ) {
            // eslint-disable-next-line no-param-reassign
            array[rangeCorrectionIndex] +=
              correctedRangeEnd - classNameNodeRangeStart - frozenTernaryExpression.length;
          }
        });

        return ternarySubstitutedText;
      }

      let classNameBase = formattedPrevText.slice(
        classNameNodeRangeStart + 1,
        correctedRangeEnd - 1,
      );
      const trailingDelimiter = isEndingPositionAbsolute
        ? formattedPrevText[correctedRangeEnd - 1]
        : '';
      if (classNameNode.type === 'attribute') {
        classNameBase = classNameBase.trim();
      } else if (classNameNode.type === 'expression') {
        const hasLeadingSpace = classNameBase !== classNameBase.trimStart();
        const hasTrailingSpace = classNameBase !== classNameBase.trimEnd();

        classNameBase = `${hasLeadingSpace ? SPACE : ''}${classNameBase
          .trim()
          .replace(/\\\n/g, '')}${hasTrailingSpace ? SPACE : ''}`;
      }

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, classNameNode.startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLineIndentLength = indentUnit.length * baseIndentLevel;
      const firstLinePadLength =
        classNameNodeRangeStart +
        1 -
        totalTextLengthUptoPrevLine -
        firstLineIndentLength +
        options.tabWidth * baseIndentLevel;

      // preprocess (first+1)
      const classNameWithFirstLinePadding = `${PH.repeat(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      )}${classNameWithoutSpacesAtBothEnds}${PH.repeat(trailingDelimiter.length)}`;

      const formattedClassName = ((cn: string) => {
        const formatted = format(cn, {
          ...options,
          parser: 'html',
          plugins: [],
          rangeStart: 0,
          rangeEnd: Infinity,
          endOfLine: 'lf',
        }).trimEnd();

        if (!isOutputIdeal) {
          return formatted;
        }

        const [firstLine, ...rest] = formatted.split(EOL);

        if (rest.length === 0) {
          return firstLine;
        }

        const multiLinePadLength = options.tabWidth * multiLineIndentLevel;

        const formattedRest = format(rest.join(EOL), {
          ...options,
          parser: 'html',
          plugins: [],
          rangeStart: 0,
          rangeEnd: Infinity,
          endOfLine: 'lf',
          printWidth: options.printWidth - multiLinePadLength,
        }).trimEnd();

        return `${firstLine}${EOL}${formattedRest}`;
      })(classNameWithFirstLinePadding);

      // postprocess (last-1)
      const classNameWithoutPadding = formattedClassName.slice(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
        -trailingDelimiter.length || undefined,
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [delimiterStart, delimiterEnd] = getDelimiters(
        classNameNode,
        isMultiLineClassName,
        options.singleQuote,
      );

      let substituteBase = classNameWithOriginalSpaces;
      if (classNameNode.type === 'expression') {
        if (delimiterStart === SINGLE_QUOTE) {
          if (classNameNode.delimiterType !== 'single-quote' && classNameNode.hasSingleQuote) {
            substituteBase = substituteBase.replace(/'/g, `\\${SINGLE_QUOTE}`);
          }
        } else if (delimiterStart === DOUBLE_QUOTE) {
          if (classNameNode.delimiterType !== 'double-quote' && classNameNode.hasDoubleQuote) {
            substituteBase = substituteBase.replace(/"/g, `\\${DOUBLE_QUOTE}`);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (classNameNode.delimiterType !== 'backtick' && classNameNode.hasBacktick) {
            substituteBase = substituteBase.replace(/`/g, `\\${BACKTICK}`);
          }
        }

        substituteBase = `${delimiterStart}${substituteBase}${delimiterEnd}`;
      }

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);

      const classNamePieces: string[] = [];
      const frozenClassNamePieces: string[] = [];
      const substitute = substituteBase
        .split(EOL)
        .map((raw) => {
          const frozen = freezeClassName(raw);

          classNamePieces.push(raw);
          frozenClassNamePieces.push(frozen);

          return frozen;
        })
        .join(`${EOL}${rawIndent}`);
      freezer.push({
        from: frozenClassNamePieces,
        to: classNamePieces,
      });

      const isAttributeType = classNameNode.type === 'attribute';
      const sliceOffset =
        !isMultiLineClassName &&
        classNameNode.type === 'expression' &&
        classNameNode.delimiterType === 'backtick' &&
        classNameNode.isItAnObjectProperty
          ? 1
          : 0;
      const conditionForSyntaxTransformation =
        isMultiLineClassName &&
        options.syntaxTransformation &&
        ['babel', 'typescript', 'astro', 'svelte', 'vue'].includes(options.parser as string);
      const classNamePartialWrappedText = `${
        isAttributeType && conditionForSyntaxTransformation && options.parser === 'vue'
          ? formattedPrevText
              .slice(0, classNameNodeRangeStart - sliceOffset)
              .replace(/([^ :=]+=)$/, ':$1')
          : formattedPrevText.slice(
              0,
              classNameNodeRangeStart -
                sliceOffset +
                (isAttributeType && !conditionForSyntaxTransformation ? 1 : 0),
            )
      }${
        // eslint-disable-next-line no-nested-ternary
        isAttributeType && conditionForSyntaxTransformation
          ? options.parser === 'vue'
            ? `${DOUBLE_QUOTE}${BACKTICK}`
            : `{${BACKTICK}`
          : ''
      }${substitute}${
        // eslint-disable-next-line no-nested-ternary
        isAttributeType
          ? // eslint-disable-next-line no-nested-ternary
            conditionForSyntaxTransformation
            ? options.parser === 'vue'
              ? `${BACKTICK}${DOUBLE_QUOTE}`
              : `${BACKTICK}}`
            : formattedPrevText.slice(
                correctedRangeEnd + sliceOffset - 1,
                correctedRangeEnd + sliceOffset,
              )
          : ''
      }${formattedPrevText.slice(correctedRangeEnd + sliceOffset)}`;

      rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
        if (rangeCorrectionIndex <= classNameNodeIndex) {
          return;
        }

        const [nthNodeRangeStart, nthNodeRangeEnd] =
          targetClassNameNodes[rangeCorrectionIndex].range;

        if (
          nthNodeRangeStart < classNameNodeRangeStart &&
          classNameNodeRangeEnd < nthNodeRangeEnd
        ) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] +=
            correctedRangeEnd - classNameNodeRangeStart - substitute.length;
        }
      });

      return classNamePartialWrappedText;
    },
    formattedText,
  );

  return freezer.reduceRight((prevText, { from, to }) => {
    const regExp = new RegExp(from.join('(\\s*)'));
    const matchResult = prevText.match(regExp);

    if (!matchResult) {
      return prevText;
    }

    return prevText.replace(regExp, (_, ...rest) => {
      const capturedGroups = rest.slice(0, matchResult.length - 1);

      return to
        .map(
          (raw, index) =>
            `${raw}${capturedGroups[index] === undefined ? '' : capturedGroups[index]}`,
        )
        .join('');
    });
  }, icedFormattedText);
}

export function parseLineByLineAndReplace({
  formattedText,
  ast,
  options,
  format,
  addon,
}: {
  formattedText: string;
  ast: any;
  options: ResolvedOptions;
  format: (source: string, options?: any) => string;
  addon: Dict<(text: string, options: any) => any>;
}): string {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(formattedText, ast, options, addon);
      break;
    }
    case 'svelte': {
      targetClassNameNodes = findTargetClassNameNodesForSvelte(formattedText, ast, options, addon);
      break;
    }
    case 'angular': {
      targetClassNameNodes = findTargetClassNameNodesForAngular(ast, options, addon);
      break;
    }
    case 'html': {
      targetClassNameNodes = findTargetClassNameNodesForHtml(ast, options, addon);
      break;
    }
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetClassNameNodes = findTargetClassNameNodes(ast, options);
      break;
    }
  }

  if (options.experimentalOptimization) {
    return parseAndAssemble(formattedText, indentUnit, targetClassNameNodes, options);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  const classNameWrappedText = replaceClassName({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
  });

  return classNameWrappedText;
}

async function replaceClassNameAsync({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: ResolvedOptions;
  format: (source: string, options?: any) => Promise<string>;
}): Promise<string> {
  const freezer: { from: string[]; to: string[] }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = await targetClassNameNodes.reduce(
    async (formattedPrevTextPromise, classNameNode, classNameNodeIndex) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      const formattedPrevText = await formattedPrevTextPromise;

      const correctedRangeEnd = classNameNodeRangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[classNameNode.startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(classNameNode);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      if (classNameNode.type === 'ternary') {
        const ternaryExpression = formattedPrevText.slice(
          classNameNodeRangeStart,
          correctedRangeEnd,
        );
        const frozenTernaryExpression = freezeNonClassName(ternaryExpression);

        freezer.push({
          from: [frozenTernaryExpression],
          to: [ternaryExpression],
        });

        const ternarySubstitutedText = `${formattedPrevText.slice(
          0,
          classNameNodeRangeStart,
        )}${frozenTernaryExpression}${formattedPrevText.slice(correctedRangeEnd)}`;

        rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
          if (rangeCorrectionIndex <= classNameNodeIndex) {
            return;
          }

          const [nthNodeRangeStart, nthNodeRangeEnd] =
            targetClassNameNodes[rangeCorrectionIndex].range;

          if (
            nthNodeRangeStart < classNameNodeRangeStart &&
            classNameNodeRangeEnd < nthNodeRangeEnd
          ) {
            // eslint-disable-next-line no-param-reassign
            array[rangeCorrectionIndex] +=
              correctedRangeEnd - classNameNodeRangeStart - frozenTernaryExpression.length;
          }
        });

        return ternarySubstitutedText;
      }

      let classNameBase = formattedPrevText.slice(
        classNameNodeRangeStart + 1,
        correctedRangeEnd - 1,
      );
      const trailingDelimiter = isEndingPositionAbsolute
        ? formattedPrevText[correctedRangeEnd - 1]
        : '';
      if (classNameNode.type === 'attribute') {
        classNameBase = classNameBase.trim();
      } else if (classNameNode.type === 'expression') {
        const hasLeadingSpace = classNameBase !== classNameBase.trimStart();
        const hasTrailingSpace = classNameBase !== classNameBase.trimEnd();

        classNameBase = `${hasLeadingSpace ? SPACE : ''}${classNameBase
          .trim()
          .replace(/\\\n/g, '')}${hasTrailingSpace ? SPACE : ''}`;
      }

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, classNameNode.startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLineIndentLength = indentUnit.length * baseIndentLevel;
      const firstLinePadLength =
        classNameNodeRangeStart +
        1 -
        totalTextLengthUptoPrevLine -
        firstLineIndentLength +
        options.tabWidth * baseIndentLevel;

      // preprocess (first+1)
      const classNameWithFirstLinePadding = `${PH.repeat(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
      )}${classNameWithoutSpacesAtBothEnds}${PH.repeat(trailingDelimiter.length)}`;

      const formattedClassName = await (async (cn: string) => {
        const formatted = (
          await format(cn, {
            ...options,
            parser: 'html',
            plugins: [],
            rangeStart: 0,
            rangeEnd: Infinity,
            endOfLine: 'lf',
          })
        ).trimEnd();

        if (!isOutputIdeal) {
          return formatted;
        }

        const [firstLine, ...rest] = formatted.split(EOL);

        if (rest.length === 0) {
          return firstLine;
        }

        const multiLinePadLength = options.tabWidth * multiLineIndentLevel;

        const formattedRest = (
          await format(rest.join(EOL), {
            ...options,
            parser: 'html',
            plugins: [],
            rangeStart: 0,
            rangeEnd: Infinity,
            endOfLine: 'lf',
            printWidth: options.printWidth - multiLinePadLength,
          })
        ).trimEnd();

        return `${firstLine}${EOL}${formattedRest}`;
      })(classNameWithFirstLinePadding);

      // postprocess (last-1)
      const classNameWithoutPadding = formattedClassName.slice(
        isEndingPositionAbsolute ? firstLinePadLength : 0,
        -trailingDelimiter.length || undefined,
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [delimiterStart, delimiterEnd] = getDelimiters(
        classNameNode,
        isMultiLineClassName,
        options.singleQuote,
      );

      let substituteBase = classNameWithOriginalSpaces;
      if (classNameNode.type === 'expression') {
        if (delimiterStart === SINGLE_QUOTE) {
          if (classNameNode.delimiterType !== 'single-quote' && classNameNode.hasSingleQuote) {
            substituteBase = substituteBase.replace(/'/g, `\\${SINGLE_QUOTE}`);
          }
        } else if (delimiterStart === DOUBLE_QUOTE) {
          if (classNameNode.delimiterType !== 'double-quote' && classNameNode.hasDoubleQuote) {
            substituteBase = substituteBase.replace(/"/g, `\\${DOUBLE_QUOTE}`);
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (classNameNode.delimiterType !== 'backtick' && classNameNode.hasBacktick) {
            substituteBase = substituteBase.replace(/`/g, `\\${BACKTICK}`);
          }
        }

        substituteBase = `${delimiterStart}${substituteBase}${delimiterEnd}`;
      }

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);

      const classNamePieces: string[] = [];
      const frozenClassNamePieces: string[] = [];
      const substitute = substituteBase
        .split(EOL)
        .map((raw) => {
          const frozen = freezeClassName(raw);

          classNamePieces.push(raw);
          frozenClassNamePieces.push(frozen);

          return frozen;
        })
        .join(`${EOL}${rawIndent}`);
      freezer.push({
        from: frozenClassNamePieces,
        to: classNamePieces,
      });

      const isAttributeType = classNameNode.type === 'attribute';
      const sliceOffset =
        !isMultiLineClassName &&
        classNameNode.type === 'expression' &&
        classNameNode.delimiterType === 'backtick' &&
        classNameNode.isItAnObjectProperty
          ? 1
          : 0;
      const conditionForSyntaxTransformation =
        isMultiLineClassName &&
        options.syntaxTransformation &&
        ['babel', 'typescript', 'astro', 'svelte', 'vue'].includes(options.parser as string);
      const classNamePartialWrappedText = `${
        isAttributeType && conditionForSyntaxTransformation && options.parser === 'vue'
          ? formattedPrevText
              .slice(0, classNameNodeRangeStart - sliceOffset)
              .replace(/([^ :=]+=)$/, ':$1')
          : formattedPrevText.slice(
              0,
              classNameNodeRangeStart -
                sliceOffset +
                (isAttributeType && !conditionForSyntaxTransformation ? 1 : 0),
            )
      }${
        // eslint-disable-next-line no-nested-ternary
        isAttributeType && conditionForSyntaxTransformation
          ? options.parser === 'vue'
            ? `${DOUBLE_QUOTE}${BACKTICK}`
            : `{${BACKTICK}`
          : ''
      }${substitute}${
        // eslint-disable-next-line no-nested-ternary
        isAttributeType
          ? // eslint-disable-next-line no-nested-ternary
            conditionForSyntaxTransformation
            ? options.parser === 'vue'
              ? `${BACKTICK}${DOUBLE_QUOTE}`
              : `${BACKTICK}}`
            : formattedPrevText.slice(
                correctedRangeEnd + sliceOffset - 1,
                correctedRangeEnd + sliceOffset,
              )
          : ''
      }${formattedPrevText.slice(correctedRangeEnd + sliceOffset)}`;

      rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
        if (rangeCorrectionIndex <= classNameNodeIndex) {
          return;
        }

        const [nthNodeRangeStart, nthNodeRangeEnd] =
          targetClassNameNodes[rangeCorrectionIndex].range;

        if (
          nthNodeRangeStart < classNameNodeRangeStart &&
          classNameNodeRangeEnd < nthNodeRangeEnd
        ) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] +=
            correctedRangeEnd - classNameNodeRangeStart - substitute.length;
        }
      });

      return classNamePartialWrappedText;
    },
    Promise.resolve(formattedText),
  );

  return freezer.reduceRight((prevText, { from, to }) => {
    const regExp = new RegExp(from.join('(\\s*)'));
    const matchResult = prevText.match(regExp);

    if (!matchResult) {
      return prevText;
    }

    return prevText.replace(regExp, (_, ...rest) => {
      const capturedGroups = rest.slice(0, matchResult.length - 1);

      return to
        .map(
          (raw, index) =>
            `${raw}${capturedGroups[index] === undefined ? '' : capturedGroups[index]}`,
        )
        .join('');
    });
  }, icedFormattedText);
}

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
  format,
  addon,
}: {
  formattedText: string;
  ast: any;
  options: ResolvedOptions;
  format: (source: string, options?: any) => Promise<string>;
  addon: Dict<(text: string, options: any) => any>;
}): Promise<string> {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(formattedText, ast, options, addon);
      break;
    }
    case 'svelte': {
      targetClassNameNodes = findTargetClassNameNodesForSvelte(formattedText, ast, options, addon);
      break;
    }
    case 'angular': {
      targetClassNameNodes = findTargetClassNameNodesForAngular(ast, options, addon);
      break;
    }
    case 'html': {
      targetClassNameNodes = findTargetClassNameNodesForHtml(ast, options, addon);
      break;
    }
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetClassNameNodes = findTargetClassNameNodes(ast, options);
      break;
    }
  }

  if (options.experimentalOptimization) {
    return parseAndAssemble(formattedText, indentUnit, targetClassNameNodes, options);
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  const classNameWrappedText = await replaceClassNameAsync({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
  });

  return classNameWrappedText;
}

export function refineSvelteAst(preprocessedText: string, ast: any) {
  if (!ast.instance) {
    return ast;
  }

  const scriptTag = preprocessedText.slice(ast.instance.start, ast.instance.end);
  const matchResult = scriptTag.match(/ ✂prettier:content✂="([^"]+)"/);

  if (matchResult === null) {
    return ast;
  }

  const [temporaryAttributeWithLeadingSpace, encodedContent] = matchResult;
  const plainContent = base64Decode(encodedContent);

  const restoreOffset =
    plainContent.length - (temporaryAttributeWithLeadingSpace.length + '{}'.length);

  function recursion(node: unknown): void {
    if (!isTypeof(node, z.object({ type: z.string() }))) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode);
        });
        return;
      }

      recursion(value);
    });

    if (
      !isTypeof(
        node,
        z.object({
          start: z.number(),
          end: z.number(),
        }),
      )
    ) {
      return;
    }

    if (ast.instance.end <= node.start) {
      // eslint-disable-next-line no-param-reassign
      node.start += restoreOffset;
    }
    if (ast.instance.end <= node.end) {
      // eslint-disable-next-line no-param-reassign
      node.end += restoreOffset;
    }
  }

  recursion(ast.html);

  // eslint-disable-next-line no-param-reassign
  ast.instance = {
    type: 'RefinedScript',
    start: ast.instance.start,
    end: ast.instance.end + restoreOffset,
    loc: {
      start: {
        line: preprocessedText.slice(0, ast.instance.start).split(EOL).length,
      },
    },
    content: {
      type: 'RefinedScriptSource',
      start: ast.instance.end + restoreOffset - ('</script>'.length + plainContent.length),
      end: ast.instance.end + restoreOffset - '</script>'.length,
      loc: {
        start: {
          line: ast.instance.content.body[0].loc.start.line,
        },
      },
      value: plainContent,
    },
  };

  return ast;
}
