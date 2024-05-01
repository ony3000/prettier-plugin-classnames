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

function getExtraIndentLevel(node: ClassNameNode) {
  if (node.type === ClassNameType.ASL) {
    return 2;
  }

  if (
    node.type === ClassNameType.AOL ||
    node.type === ClassNameType.SLSL ||
    node.type === ClassNameType.SLTO ||
    node.type === ClassNameType.TLSL ||
    node.type === ClassNameType.TLTO ||
    node.type === ClassNameType.TLPQTO
  ) {
    return 1;
  }

  return 0;
}

function getSomeKindOfQuotes(
  node: ClassNameNode,
  isMultiLineClassName: boolean,
  parser: string,
): [string, string] {
  const baseQuote =
    // eslint-disable-next-line no-nested-ternary
    node.type === ClassNameType.TLPQ || node.type === ClassNameType.TLPQTO
      ? '`'
      : parser === 'vue' &&
        (node.type === ClassNameType.FA ||
          node.type === ClassNameType.CSL ||
          node.type === ClassNameType.SLSL ||
          node.type === ClassNameType.SLOP ||
          node.type === ClassNameType.SLTO ||
          node.type === ClassNameType.CTL ||
          node.type === ClassNameType.TLSL ||
          node.type === ClassNameType.TLOP ||
          node.type === ClassNameType.TLTO)
      ? "'"
      : '"';

  const opener = `${isMultiLineClassName && node.type === ClassNameType.SLOP ? '[' : ''}${
    !isMultiLineClassName || node.type === ClassNameType.ASL || node.type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }`;
  const closer = `${
    !isMultiLineClassName || node.type === ClassNameType.ASL || node.type === ClassNameType.AOL
      ? baseQuote
      : '`'
  }${isMultiLineClassName && node.type === ClassNameType.SLOP ? ']' : ''}`;

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
      const {
        type,
        range: [rangeStart, rangeEnd],
        startLineIndex,
        elementName,
      } = classNameNode;

      if (
        isSecondPhase &&
        (((options.parser === 'vue' || options.parser === 'astro') &&
          !(type === ClassNameType.ASL || type === ClassNameType.AOL)) ||
          (!(options.parser === 'vue' || options.parser === 'astro') &&
            !(
              type === ClassNameType.ASL ||
              type === ClassNameType.AOL ||
              type === ClassNameType.CTL ||
              type === ClassNameType.TLSL
            )))
      ) {
        return formattedPrevText;
      }

      const correctedRangeEnd = rangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(classNameNode);
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
        classNameNode,
        isMultiLineClassName,
        options.parser,
      );

      const elementOpener = '<';
      const spaceAfterElementName = ' ';
      const conditionForSameLineAttribute =
        isEndingPositionAbsolute &&
        type === ClassNameType.ASL &&
        isMultiLineClassName &&
        formattedClassName.length +
          options.tabWidth -
          (elementName ? `${elementOpener}${elementName}${spaceAfterElementName}`.length : 0) <=
          options.printWidth;
      const conditionForOwnLineAttribute =
        isEndingPositionAbsolute &&
        type === ClassNameType.AOL &&
        !isMultiLineClassName &&
        classNameWithOriginalSpaces !== classNameBase &&
        formattedClassName.length -
          options.tabWidth +
          (elementName ? `${elementOpener}${elementName}${spaceAfterElementName}`.length : 0) >
          options.printWidth;

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeNonClassName(rawIndent);

      const isAttributeType = type === ClassNameType.ASL || type === ClassNameType.AOL;
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

      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset + (isAttributeType ? 1 : 0),
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

        if (nthNodeRangeStart < rangeStart && rangeEnd < nthNodeRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] += correctedRangeEnd - rangeStart - substitute.length;
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
      const {
        type,
        range: [rangeStart, rangeEnd],
        startLineIndex,
        elementName,
      } = classNameNode;

      if (
        isSecondPhase &&
        (((options.parser === 'vue' || options.parser === 'astro') &&
          !(type === ClassNameType.ASL || type === ClassNameType.AOL)) ||
          (!(options.parser === 'vue' || options.parser === 'astro') &&
            !(
              type === ClassNameType.ASL ||
              type === ClassNameType.AOL ||
              type === ClassNameType.CTL ||
              type === ClassNameType.TLSL
            )))
      ) {
        return formattedPrevTextPromise;
      }

      const formattedPrevText = await formattedPrevTextPromise;

      const correctedRangeEnd = rangeEnd - rangeCorrectionValues[classNameNodeIndex];

      const isStartingPositionRelative = options.endingPosition !== 'absolute';
      const isEndingPositionAbsolute = options.endingPosition !== 'relative';
      const isOutputIdeal = isStartingPositionRelative && isEndingPositionAbsolute;

      const { indentLevel: baseIndentLevel } = lineNodes[startLineIndex];
      const extraIndentLevel = getExtraIndentLevel(classNameNode);
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
        classNameNode,
        isMultiLineClassName,
        options.parser,
      );

      const elementOpener = '<';
      const spaceAfterElementName = ' ';
      const conditionForSameLineAttribute =
        isEndingPositionAbsolute &&
        type === ClassNameType.ASL &&
        isMultiLineClassName &&
        formattedClassName.length +
          options.tabWidth -
          (elementName ? `${elementOpener}${elementName}${spaceAfterElementName}`.length : 0) <=
          options.printWidth;
      const conditionForOwnLineAttribute =
        isEndingPositionAbsolute &&
        type === ClassNameType.AOL &&
        !isMultiLineClassName &&
        classNameWithOriginalSpaces !== classNameBase &&
        formattedClassName.length -
          options.tabWidth +
          (elementName ? `${elementOpener}${elementName}${spaceAfterElementName}`.length : 0) >
          options.printWidth;

      const rawIndent = indentUnit.repeat(multiLineIndentLevel);
      const frozenIndent = freezeNonClassName(rawIndent);

      const isAttributeType = type === ClassNameType.ASL || type === ClassNameType.AOL;
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

      const sliceOffset = !isMultiLineClassName && type === ClassNameType.TLOP ? 1 : 0;
      const classNamePartialWrappedText = `${formattedPrevText.slice(
        0,
        rangeStart - sliceOffset + (isAttributeType ? 1 : 0),
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

        if (nthNodeRangeStart < rangeStart && rangeEnd < nthNodeRangeEnd) {
          // eslint-disable-next-line no-param-reassign
          array[rangeCorrectionIndex] += correctedRangeEnd - rangeStart - substitute.length;
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
