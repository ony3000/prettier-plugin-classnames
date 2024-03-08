import { createHash } from 'node:crypto';

import {
  findTargetClassNameNodes,
  findTargetClassNameNodesForVue,
  findTargetClassNameNodesForAstro,
} from './finder';
import type { Dict, ClassNameNode, NarrowedParserOptions } from './shared';
import { EOL, PH, SPACE, TAB, TAB_SIZE, ClassNameType } from './shared';

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

function getExtraIndentLevel(type: ClassNameType) {
  if (type === ClassNameType.ASL) {
    return 2;
  }

  if (
    [
      ClassNameType.AOL,
      ClassNameType.SLSL,
      ClassNameType.SLTO,
      ClassNameType.TLSL,
      ClassNameType.TLTO,
      ClassNameType.TLPQTO,
    ].includes(type)
  ) {
    return 1;
  }

  return 0;
}

function getSomeKindOfQuotes(
  type: ClassNameType,
  isMultiLineClassName: boolean,
  parser: string,
): [string, string] {
  // prettier-ignore
  const baseQuote =
    // eslint-disable-next-line no-nested-ternary
    type === ClassNameType.TLPQ || type === ClassNameType.TLPQTO
      ? '`'
      : (
        parser === 'vue' &&
        [
          ClassNameType.FA,
          ClassNameType.CSL,
          ClassNameType.SLSL,
          ClassNameType.SLOP,
          ClassNameType.SLTO,
          ClassNameType.CTL,
          ClassNameType.TLSL,
          ClassNameType.TLOP,
          ClassNameType.TLTO,
          ClassNameType.TLPQTO,
        ].includes(type)
          ? "'"
          : '"'
      );

  const opener = `${isMultiLineClassName && type === ClassNameType.SLOP ? '[' : ''}${
    !isMultiLineClassName || type === ClassNameType.ASL || type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }`;
  const closer = `${
    !isMultiLineClassName || type === ClassNameType.ASL || type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }${isMultiLineClassName && type === ClassNameType.SLOP ? ']' : ''}`;

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

function freezeIndent(input: string): string {
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

function freezeString(input: string): string {
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

function replaceClassName({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  targetClassNameTypes,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  targetClassNameTypes?: ClassNameType[];
}): string {
  const freezer: { type: 'string' | 'indent'; from: string; to: string }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = targetClassNameNodes.reduce(
    (
      formattedPrevText,
      { type, range: [rangeStart, rangeEnd], startLineIndex },
      classNameNodeIndex,
    ) => {
      if (targetClassNameTypes && !targetClassNameTypes.includes(type)) {
        return formattedPrevText;
      }

      const correctedRangeEnd = rangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(type);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      const classNameBase = formattedPrevText.slice(rangeStart + 1, correctedRangeEnd - 1);

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLineIndentLength = indentUnit.length * baseIndentLevel;
      const firstLinePadLength =
        rangeStart +
        1 -
        totalTextLengthUptoPrevLine -
        firstLineIndentLength +
        (indentUnit === TAB ? TAB_SIZE : indentUnit.length) * baseIndentLevel;

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

        const multiLinePadLength =
          (indentUnit === TAB ? TAB_SIZE : indentUnit.length) * multiLineIndentLevel;

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
        type,
        isMultiLineClassName,
        options.parser,
      );

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeIndent(rawIndent);
      const substitute = `${quoteStart}${classNameWithOriginalSpaces}${quoteEnd}`
        .split(EOL)
        .map((raw) => {
          const frozen = freezeString(raw);

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

      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset,
      )}${substitute}${formattedPrevText.slice(correctedRangeEnd + sliceOffset)}`;

      rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
        if (rangeCorrectionIndex <= classNameNodeIndex) {
          return;
        }

        const [nthNodeRangeStart, nthNodeRangeEnd] =
          targetClassNameNodes[rangeCorrectionIndex].range;

        if (nthNodeRangeStart < rangeStart && rangeEnd < nthNodeRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] += correctedRangeEnd - rangeStart - substitute.length;
        }
      });

      return classNamePartialWrappedText;
    },
    formattedText,
  );

  return freezer.reduceRight(
    (prevText, { type, from, to }) =>
      type === 'indent'
        ? prevText.replace(new RegExp(`^\\s*${from}`, 'gm'), to)
        : prevText.replace(from, to),
    icedFormattedText,
  );
}

export function parseLineByLineAndReplace({
  formattedText,
  ast,
  options,
  format,
  addon,
  targetClassNameTypes,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => string;
  addon: Dict<(text: string, options: any) => any>;
  targetClassNameTypes?: ClassNameType[];
}): string {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(ast, options, addon);
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

  return replaceClassName({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    targetClassNameTypes,
  });
}

async function replaceClassNameAsync({
  formattedText,
  indentUnit,
  targetClassNameNodes,
  lineNodes,
  options,
  format,
  targetClassNameTypes,
}: {
  formattedText: string;
  indentUnit: string;
  targetClassNameNodes: ClassNameNode[];
  lineNodes: LineNode[];
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  targetClassNameTypes?: ClassNameType[];
}): Promise<string> {
  const freezer: { type: 'string' | 'indent'; from: string; to: string }[] = [];
  const rangeCorrectionValues = [...Array(targetClassNameNodes.length)].map(() => 0);

  const icedFormattedText = await targetClassNameNodes.reduce(
    async (
      formattedPrevTextPromise,
      { type, range: [rangeStart, rangeEnd], startLineIndex },
      classNameNodeIndex,
    ) => {
      if (targetClassNameTypes && !targetClassNameTypes.includes(type)) {
        return formattedPrevTextPromise;
      }

      const formattedPrevText = await formattedPrevTextPromise;

      const correctedRangeEnd = rangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(type);
      const multiLineIndentLevel = isStartingPositionRelative
        ? baseIndentLevel + extraIndentLevel
        : 0;

      const classNameBase = formattedPrevText.slice(rangeStart + 1, correctedRangeEnd - 1);

      // preprocess (first)
      const [leadingSpace, classNameWithoutSpacesAtBothEnds, trailingSpace] =
        replaceSpacesAtBothEnds(classNameBase);

      const totalTextLengthUptoPrevLine = formattedPrevText
        .split(EOL)
        .slice(0, startLineIndex)
        .reduce((textLength, line) => textLength + line.length + EOL.length, 0);
      const firstLineIndentLength = indentUnit.length * baseIndentLevel;
      const firstLinePadLength =
        rangeStart +
        1 -
        totalTextLengthUptoPrevLine -
        firstLineIndentLength +
        (indentUnit === TAB ? TAB_SIZE : indentUnit.length) * baseIndentLevel;

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

        const multiLinePadLength =
          (indentUnit === TAB ? TAB_SIZE : indentUnit.length) * multiLineIndentLevel;

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
        type,
        isMultiLineClassName,
        options.parser,
      );

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeIndent(rawIndent);
      const substitute = `${quoteStart}${classNameWithOriginalSpaces}${quoteEnd}`
        .split(EOL)
        .map((raw) => {
          const frozen = freezeString(raw);

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

      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset,
      )}${substitute}${formattedPrevText.slice(correctedRangeEnd + sliceOffset)}`;

      rangeCorrectionValues.forEach((_, rangeCorrectionIndex, array) => {
        if (rangeCorrectionIndex <= classNameNodeIndex) {
          return;
        }

        const [nthNodeRangeStart, nthNodeRangeEnd] =
          targetClassNameNodes[rangeCorrectionIndex].range;

        if (nthNodeRangeStart < rangeStart && rangeEnd < nthNodeRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] += correctedRangeEnd - rangeStart - substitute.length;
        }
      });

      return classNamePartialWrappedText;
    },
    Promise.resolve(formattedText),
  );

  return freezer.reduceRight(
    (prevText, { type, from, to }) =>
      type === 'indent'
        ? prevText.replace(new RegExp(`^\\s*${from}`, 'gm'), to)
        : prevText.replace(from, to),
    icedFormattedText,
  );
}

export async function parseLineByLineAndReplaceAsync({
  formattedText,
  ast,
  options,
  format,
  addon,
  targetClassNameTypes,
}: {
  formattedText: string;
  ast: any;
  options: NarrowedParserOptions;
  format: (source: string, options?: any) => Promise<string>;
  addon: Dict<(text: string, options: any) => any>;
  targetClassNameTypes?: ClassNameType[];
}): Promise<string> {
  if (formattedText === '') {
    return formattedText;
  }

  const indentUnit = options.useTabs ? TAB : SPACE.repeat(options.tabWidth);

  let targetClassNameNodes: ClassNameNode[] = [];
  switch (options.parser) {
    case 'astro': {
      targetClassNameNodes = findTargetClassNameNodesForAstro(ast, options, addon);
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

  return replaceClassNameAsync({
    formattedText,
    indentUnit,
    targetClassNameNodes,
    lineNodes,
    options,
    format,
    targetClassNameTypes,
  });
}
