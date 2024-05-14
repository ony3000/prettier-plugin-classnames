import { createHash } from 'node:crypto';

import {
  findTargetClassNameNodes,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAstro,
} from './finder';
import type { Dict, ClassNameNode, NarrowedParserOptions } from './shared';
import { EOL, PH, SPACE, TAB, SINGLE_QUOTE, DOUBLE_QUOTE, BACKTICK } from './shared';

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
    return node.isTheFirstLineOnTheSameLineAsTheOpeningTag ? 2 : 1;
  }

  if (
    node.type === 'expression' &&
    (node.isTheFirstLineOnTheSameLineAsTheAttributeName || node.isItAnOperandOfTernaryOperator)
  ) {
    return 1;
  }

  return 0;
}

function getSomeKindOfQuotes(
  node: ClassNameNode,
  isMultiLineClassName: boolean,
  parser: string,
  singleQuote: boolean,
): [string, string] {
  let baseQuote = DOUBLE_QUOTE;

  if (node.type === 'expression') {
    if (node.delimiterType === 'backtick' && node.shouldKeepDelimiter) {
      baseQuote = BACKTICK;
    } else if (parser === 'vue') {
      baseQuote = SINGLE_QUOTE;
    } else if (singleQuote && node.hasSingleQuote) {
      if (node.shouldKeepDelimiter) {
        if (node.delimiterType === 'backtick') {
          baseQuote = BACKTICK;
        } else if (node.delimiterType === 'single-quote') {
          baseQuote = SINGLE_QUOTE;
        }
      }
    } else if (!singleQuote && node.hasDoubleQuote) {
      if (node.shouldKeepDelimiter) {
        if (node.delimiterType === 'backtick') {
          baseQuote = BACKTICK;
        } else if (node.delimiterType === 'single-quote') {
          baseQuote = SINGLE_QUOTE;
        }
      } else {
        baseQuote = SINGLE_QUOTE;
      }
    }
  }

  const opener = `${
    isMultiLineClassName &&
    node.type === 'expression' &&
    node.delimiterType !== 'backtick' &&
    node.isItAnObjectProperty
      ? '['
      : ''
  }${!isMultiLineClassName || node.type === 'attribute' ? baseQuote : BACKTICK}`;
  const closer = `${!isMultiLineClassName || node.type === 'attribute' ? baseQuote : BACKTICK}${
    isMultiLineClassName &&
    node.type === 'expression' &&
    node.delimiterType !== 'backtick' &&
    node.isItAnObjectProperty
      ? ']'
      : ''
  }`;

  return [opener, closer];
}

function replaceSpacesAtBothEnds(className: string): [string, string, string] {
  const matchArray = className.match(/^(\s*)[^\s](?:.*[^\s])?(\s*)$/);
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

const frozenAttributeName = freezeNonClassName('attribute');
const doubleFrozenAttributeName = freezeNonClassName(frozenAttributeName);

function replaceClassName({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  isSecondPhase,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  isSecondPhase: boolean;
}): string {
  const freezer: { type: 'string' | 'indent'; from: string; to: string }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = targetClassNameNodes.reduce(
    (formattedPrevText, classNameNode, classNameNodeIndex) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        isSecondPhase &&
        (((options.parser === 'vue' || options.parser === 'astro') &&
          !(classNameNode.type === 'attribute')) ||
          (!(options.parser === 'vue' || options.parser === 'astro') &&
            !(
              classNameNode.type === 'attribute' ||
              (classNameNode.type === 'expression' &&
                classNameNode.delimiterType === 'backtick' &&
                !classNameNode.isItAnObjectProperty &&
                !classNameNode.isItAnOperandOfTernaryOperator &&
                !classNameNode.isItFunctionArgument &&
                !classNameNode.shouldKeepDelimiter)
            )))
      ) {
        return formattedPrevText;
      }

      const correctedRangeEnd = classNameNodeRangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[classNameNode.startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(classNameNode);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      const classNameBase = formattedPrevText.slice(
        classNameNodeRangeStart + 1,
        correctedRangeEnd - 1,
      );

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
      )}${classNameWithoutSpacesAtBothEnds}`;

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
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        classNameNode,
        isMultiLineClassName,
        options.parser,
        options.singleQuote,
      );

      const elementOpener = '<';
      const spaceAfterElementName = ' ';
      const conditionForSameLineAttribute =
        isEndingPositionAbsolute &&
        classNameNode.type === 'attribute' &&
        classNameNode.isTheFirstLineOnTheSameLineAsTheOpeningTag &&
        isMultiLineClassName &&
        formattedClassName.length +
          options.tabWidth -
          `${elementOpener}${classNameNode.elementName}${spaceAfterElementName}`.length <=
          options.printWidth;
      const conditionForOwnLineAttribute =
        isEndingPositionAbsolute &&
        classNameNode.type === 'attribute' &&
        !classNameNode.isTheFirstLineOnTheSameLineAsTheOpeningTag &&
        !isMultiLineClassName &&
        classNameWithOriginalSpaces !== classNameBase &&
        formattedClassName.length -
          options.tabWidth +
          `${elementOpener}${classNameNode.elementName}${spaceAfterElementName}`.length >
          options.printWidth;

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeNonClassName(rawIndent);

      const isAttributeType = classNameNode.type === 'attribute';
      const substitute = `${isAttributeType ? '' : quoteStart}${classNameWithOriginalSpaces}${
        isAttributeType ? '' : quoteEnd
      }`
        .split(EOL)
        .map((raw) => {
          const frozen = freezeClassName(raw);

          freezer.push({
            type: 'string',
            from: frozen,
            to: raw,
          });

          return frozen;
        })
        .join(`${EOL}${frozenIndent}`);

      if (isStartingPositionRelative && isMultiLineClassName) {
        freezer.push({
          type: 'indent',
          from: frozenIndent,
          to: rawIndent,
        });
      }

      const sliceOffset =
        !isMultiLineClassName &&
        classNameNode.type === 'expression' &&
        classNameNode.delimiterType === 'backtick' &&
        classNameNode.isItAnObjectProperty
          ? 1
          : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        classNameNodeRangeStart - sliceOffset + (isAttributeType ? 1 : 0),
      )}${substitute}${
        isAttributeType
          ? formattedPrevText.slice(
              correctedRangeEnd + sliceOffset - 1,
              correctedRangeEnd + sliceOffset,
            )
          : ''
      }${
        conditionForSameLineAttribute || conditionForOwnLineAttribute
          ? `${EOL}${frozenAttributeName}${EOL}`
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

  return freezer
    .reduceRight(
      (prevText, { type, from, to }) =>
        type === 'indent'
          ? prevText.replace(new RegExp(`^\\s*${from}`, 'gm'), to)
          : prevText.replace(from, to),
      icedFormattedText,
    )
    .replace(new RegExp(`^\\s*${doubleFrozenAttributeName}${EOL}`, 'gm'), '')
    .replace(new RegExp(`${frozenAttributeName}`, 'gm'), doubleFrozenAttributeName);
}

export function parseLineByLineAndReplace({
  formattedText,
  ast,
  options,
  format,
  addon,
  isSecondPhase,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  addon: Dict<(text: string, options: any) => any>;
  isSecondPhase: boolean;
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
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetClassNameNodes = findTargetClassNameNodes(ast, options);
      break;
    }
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  const classNameWrappedText = replaceClassName({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    isSecondPhase,
  });

  return isSecondPhase
    ? classNameWrappedText.replace(new RegExp(`^\\s*${doubleFrozenAttributeName}${EOL}`, 'gm'), '')
    : classNameWrappedText;
}

async function replaceClassNameAsync({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  isSecondPhase,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  isSecondPhase: boolean;
}): Promise<string> {
  const freezer: { type: 'string' | 'indent'; from: string; to: string }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = await targetClassNameNodes.reduce(
    async (formattedPrevTextPromise, classNameNode, classNameNodeIndex) => {
      const [classNameNodeRangeStart, classNameNodeRangeEnd] = classNameNode.range;

      if (
        isSecondPhase &&
        (((options.parser === 'vue' || options.parser === 'astro') &&
          !(classNameNode.type === 'attribute')) ||
          (!(options.parser === 'vue' || options.parser === 'astro') &&
            !(
              classNameNode.type === 'attribute' ||
              (classNameNode.type === 'expression' &&
                classNameNode.delimiterType === 'backtick' &&
                !classNameNode.isItAnObjectProperty &&
                !classNameNode.isItAnOperandOfTernaryOperator &&
                !classNameNode.isItFunctionArgument &&
                !classNameNode.shouldKeepDelimiter)
            )))
      ) {
        return formattedPrevTextPromise;
      }

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

      const classNameBase = formattedPrevText.slice(
        classNameNodeRangeStart + 1,
        correctedRangeEnd - 1,
      );

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
      )}${classNameWithoutSpacesAtBothEnds}`;

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
      );

      // postprocess (last)
      const classNameWithOriginalSpaces = `${leadingSpace}${classNameWithoutPadding.slice(
        leadingSpace.length,
        -trailingSpace.length || undefined,
      )}${trailingSpace}`;

      const isMultiLineClassName = classNameWithOriginalSpaces.split(EOL).length > 1;
      const [quoteStart, quoteEnd] = getSomeKindOfQuotes(
        classNameNode,
        isMultiLineClassName,
        options.parser,
        options.singleQuote,
      );

      const elementOpener = '<';
      const spaceAfterElementName = ' ';
      const conditionForSameLineAttribute =
        isEndingPositionAbsolute &&
        classNameNode.type === 'attribute' &&
        classNameNode.isTheFirstLineOnTheSameLineAsTheOpeningTag &&
        isMultiLineClassName &&
        formattedClassName.length +
          options.tabWidth -
          `${elementOpener}${classNameNode.elementName}${spaceAfterElementName}`.length <=
          options.printWidth;
      const conditionForOwnLineAttribute =
        isEndingPositionAbsolute &&
        classNameNode.type === 'attribute' &&
        !classNameNode.isTheFirstLineOnTheSameLineAsTheOpeningTag &&
        !isMultiLineClassName &&
        classNameWithOriginalSpaces !== classNameBase &&
        formattedClassName.length -
          options.tabWidth +
          `${elementOpener}${classNameNode.elementName}${spaceAfterElementName}`.length >
          options.printWidth;

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeNonClassName(rawIndent);

      const isAttributeType = classNameNode.type === 'attribute';
      const substitute = `${isAttributeType ? '' : quoteStart}${classNameWithOriginalSpaces}${
        isAttributeType ? '' : quoteEnd
      }`
        .split(EOL)
        .map((raw) => {
          const frozen = freezeClassName(raw);

          freezer.push({
            type: 'string',
            from: frozen,
            to: raw,
          });

          return frozen;
        })
        .join(`${EOL}${frozenIndent}`);

      if (isStartingPositionRelative && isMultiLineClassName) {
        freezer.push({
          type: 'indent',
          from: frozenIndent,
          to: rawIndent,
        });
      }

      const sliceOffset =
        !isMultiLineClassName &&
        classNameNode.type === 'expression' &&
        classNameNode.delimiterType === 'backtick' &&
        classNameNode.isItAnObjectProperty
          ? 1
          : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        classNameNodeRangeStart - sliceOffset + (isAttributeType ? 1 : 0),
      )}${substitute}${
        isAttributeType
          ? formattedPrevText.slice(
              correctedRangeEnd + sliceOffset - 1,
              correctedRangeEnd + sliceOffset,
            )
          : ''
      }${
        conditionForSameLineAttribute || conditionForOwnLineAttribute
          ? `${EOL}${frozenAttributeName}${EOL}`
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

  return freezer
    .reduceRight(
      (prevText, { type, from, to }) =>
        type === 'indent'
          ? prevText.replace(new RegExp(`^\\s*${from}`, 'gm'), to)
          : prevText.replace(from, to),
      icedFormattedText,
    )
    .replace(new RegExp(`^\\s*${doubleFrozenAttributeName}${EOL}`, 'gm'), '')
    .replace(new RegExp(`${frozenAttributeName}`, 'gm'), doubleFrozenAttributeName);
}

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
  format,
  addon,
  isSecondPhase,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  addon: Dict<(text: string, options: any) => any>;
  isSecondPhase: boolean;
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
    case 'vue': {
      targetClassNameNodes = findTargetClassNameNodesForVue(ast, options, addon);
      break;
    }
    default: {
      targetClassNameNodes = findTargetClassNameNodes(ast, options);
      break;
    }
  }

  const lineNodes = parseLineByLine(formattedText, indentUnit);

  const classNameWrappedText = await replaceClassNameAsync({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    isSecondPhase,
  });

  return isSecondPhase
    ? classNameWrappedText.replace(new RegExp(`^\\s*${doubleFrozenAttributeName}${EOL}`, 'gm'), '')
    : classNameWrappedText;
}
